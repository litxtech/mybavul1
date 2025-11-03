// FIX: Updated the Deno type reference to a more reliable CDN (esm.sh) to fix issues with global type definitions like Deno.env and resolve the 'Cannot find type definition file' error.
/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-functions.d.ts" />

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@12.12.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Initialize Stripe client
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  httpClient: Stripe.createFetchHttpClient(),
  apiVersion: '2022-11-15',
})

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Initialize Supabase client with user's auth token
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // 2. Get the authenticated user
    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    const { booking_id } = await req.json()
    if (!booking_id) {
        return new Response(JSON.stringify({ error: 'Missing booking_id' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Use the admin client for trusted operations
     const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // 3. Fetch the booking and verify ownership and status
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .select('*, rate_plans(*)')
      .eq('id', booking_id)
      .single()

    if (bookingError) throw bookingError
    if (booking.user_id !== user.id) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    if (booking.status !== 'confirmed') {
        return new Response(JSON.stringify({ error: 'Booking cannot be cancelled in its current state.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // 4. Check cancellation policy
    const ratePlan = booking.rate_plans;
    if (!ratePlan || !ratePlan.refundable) {
        return new Response(JSON.stringify({ error: 'This booking is non-refundable.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    
    // Optional: Check deadline
    // const checkinDate = new Date(booking.checkin_date);
    // const deadline = new Date(checkinDate.getTime() - (ratePlan.cancellation_deadline_hours * 60 * 60 * 1000));
    // if (new Date() > deadline) {
    //     return new Response(JSON.stringify({ error: 'The cancellation deadline has passed.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    // }

    // 5. Immediately update booking status to 'cancelled' for instant UI feedback
     await supabaseAdmin
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', booking.id)
      .throwOnError()
    
    // 6. Create a refund in Stripe if a payment intent exists
    if (booking.stripe_payment_intent_id) {
        await stripe.refunds.create({
            payment_intent: booking.stripe_payment_intent_id,
        })
    } else {
        // Handle cases without a payment intent if necessary
        console.warn(`Booking ${booking.id} cancelled without a Stripe payment intent. No refund processed.`)
    }

    return new Response(JSON.stringify({ message: 'Booking cancelled successfully. A refund has been issued.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error cancelling booking:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})