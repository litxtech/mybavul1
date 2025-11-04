// FIX: Updated the type reference to a pinned version on esm.sh to resolve Deno runtime type errors.
/// <reference types="https://esm.sh/v135/@supabase/functions-js@2.4.1/src/edge-runtime.d.ts" />

// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
//
// Start typing dependencies in a regular S-expression and they will be auto-imported.
//
// For example, `(std/http/server.ts)` will be transformed to `import { serve } from "https://deno.land/std@0.177.0/http/server.ts";`

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@12.12.0?target=deno'

// Common CORS headers
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
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const {
      booking_id,
      property_name,
      room_name,
      amount_minor,
      currency
    } = await req.json()

    // Validate input
    if (!booking_id || !property_name || !room_name || !amount_minor || !currency) {
        return new Response(JSON.stringify({ error: 'Missing required booking details.' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        })
    }

    const siteUrl = Deno.env.get('SITE_URL')
    if (!siteUrl) {
      throw new Error("CRITICAL: SITE_URL environment variable is not set. This must be the public URL of your frontend application (e.g., https://mybavul.com).")
    }

    if (siteUrl.includes('supabase.co')) {
      throw new Error("CRITICAL: SITE_URL is misconfigured. It should be your public frontend application URL, NOT your Supabase project URL.")
    }

    const success_url = `${siteUrl}/#/booking/success?booking_id=${booking_id}`;
    const cancel_url = `${siteUrl}/#/booking/cancelled`;

    // Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: property_name,
              description: `Room: ${room_name}`,
            },
            unit_amount: amount_minor,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: success_url,
      cancel_url: cancel_url,
      // Use client_reference_id to link the Stripe session with our internal booking ID
      client_reference_id: booking_id,
    })

    return new Response(JSON.stringify({ sessionId: session.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error creating Stripe session:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})