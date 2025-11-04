// FIX: Use a more stable Supabase functions type reference URL to resolve Deno runtime type errors with `Deno.env`.
/// <reference types="https://esm.sh/@supabase/functions-js@2/src/edge-runtime.d.ts" />

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@12.12.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Common CORS headers for potential browser interactions if needed
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Initialize Stripe
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  httpClient: Stripe.createFetchHttpClient(),
  apiVersion: '2022-11-15',
})

// Initialize Supabase Admin Client
const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

serve(async (req) => {
  const signature = req.headers.get('Stripe-Signature')
  const body = await req.text()
  
  let event
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature!,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!
    )
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message)
    return new Response(err.message, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const bookingId = session.client_reference_id

        if (!bookingId) {
          throw new Error('Missing booking_id in checkout session.')
        }

        // 1. Fetch booking and related data
        const { data: booking, error: bookingError } = await supabaseAdmin
          .from('bookings')
          .select('*, properties!inner(tenant_id, tenants!inner(commission_rate))')
          .eq('id', bookingId)
          .single()

        if (bookingError) throw bookingError
        if (booking.status === 'confirmed') {
            console.log(`Booking ${bookingId} is already confirmed. Ignoring webhook.`);
            break;
        }

        const tenant = booking.properties?.tenants;
        if (!tenant) {
            throw new Error(`Could not find tenant for property ${booking.property_id}`);
        }

        // 2. Calculate commission and net amount
        const commissionMinor = Math.floor(booking.total_price_usd_minor * tenant.commission_rate)
        const partnerNetMinor = booking.total_price_usd_minor - commissionMinor

        // 3. Update booking to 'confirmed' and add financial details
        await supabaseAdmin
          .from('bookings')
          .update({
            status: 'confirmed',
            stripe_payment_intent_id: session.payment_intent,
            commission_minor: commissionMinor,
            partner_net_minor: partnerNetMinor,
          })
          .eq('id', bookingId)
          .throwOnError()

        // 4. Create payment record
         await supabaseAdmin
            .from('booking_payments')
            .insert({
                booking_id: bookingId,
                stripe_payment_intent_id: session.payment_intent,
                amount_minor: session.amount_total,
                currency: session.currency?.toUpperCase(),
                captured: true,
            })
            .throwOnError();

        // 5. Create wallet ledger entries for accounting
        const ledgerEntries = [
          { tenant_id: booking.properties.tenant_id, booking_id: bookingId, amount_minor: booking.total_price_usd_minor, currency: 'USD', entry_type: 'credit' },
          { tenant_id: booking.properties.tenant_id, booking_id: bookingId, amount_minor: commissionMinor, currency: 'USD', entry_type: 'fee' },
          { tenant_id: booking.properties.tenant_id, booking_id: bookingId, amount_minor: partnerNetMinor, currency: 'USD', entry_type: 'debit' },
        ];

        await supabaseAdmin.from('wallet_ledger').insert(ledgerEntries).throwOnError();
        
        console.log(`Successfully processed booking ${bookingId} and created financial records.`);
        break
      }
      
      case 'charge.refunded': {
        const refund = event.data.object;
        const { data: booking, error } = await supabaseAdmin
            .from('bookings')
            .select('*, properties!inner(tenant_id, tenants!inner(commission_rate))')
      }
    }
    return new Response(JSON.stringify({ received: true }), { status: 200 })
  } catch (error) {
    console.error('Error in Stripe webhook handler:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
