// FIX: Replaced the broken Deno edge runtime types reference with a working version to resolve "Cannot find name 'Deno'" and type loading errors.
/// <reference types="https://esm.sh/v128/@supabase/functions-js@2.1.0/src/edge-runtime.d.ts" />

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.44.4'

// Self-contained types for the function
interface AvailableRate {
  room_type_id: string;
  rate_plan_id: string;
  rooms_left?: number;
}
interface AvailabilityResponse {
  isAvailable: boolean;
  rates: AvailableRate[];
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Simple deterministic hash function to create pseudo-randomness
const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { propertyId, checkin } = await req.json();

    if (!propertyId || !checkin) {
      return new Response(JSON.stringify({ error: 'Missing propertyId or checkin date' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use admin client for this trusted operation, as we're just reading public room data
    const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: roomTypes, error } = await supabaseAdmin
      .from('room_types')
      .select('id, rate_plans(id)')
      .eq('property_id', propertyId);

    if (error) throw error;
    if (!roomTypes || roomTypes.length === 0) {
      return new Response(JSON.stringify({ isAvailable: false, rates: [] }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const availableRates: AvailableRate[] = [];
    
    // Use a hash based on property and date to create deterministic "randomness"
    const dateSeed = new Date(checkin).getDate(); // Use day of the month as a seed
    const hash = simpleHash(`${propertyId}-${dateSeed}`);

    // Simulate availability logic
    roomTypes.forEach((room, roomIndex) => {
      room.rate_plans.forEach((plan, planIndex) => {
        // Decide if this specific room/plan combo is "available"
        // This logic will make some rooms available and some not, based on the hash
        if ((hash + roomIndex + planIndex * 2) % 1.2 > 0.2) { // ~83% chance of being available
          
          let rooms_left;
          const availabilityFactor = (hash + planIndex) % 10;
          if (availabilityFactor < 2) { // 20% chance of low availability
            rooms_left = (hash % 3) + 1; // 1, 2, or 3 rooms left
          }

          availableRates.push({
            room_type_id: room.id,
            rate_plan_id: plan.id,
            rooms_left: rooms_left
          });
        }
      });
    });

    const responsePayload: AvailabilityResponse = {
      isAvailable: availableRates.length > 0,
      rates: availableRates,
    };

    return new Response(JSON.stringify(responsePayload), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in check-availability function:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})