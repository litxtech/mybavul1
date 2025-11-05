// FIX: Updated the Supabase Edge Functions type reference to use the recommended esm.sh CDN and a non-versioned URL, which resolves TypeScript errors related to the Deno namespace.
/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

// Self-contained types to ensure function deploys correctly without external dependencies.
interface RatePlan {
  id: string;
  created_at: string;
  room_type_id: string;
  name: string;
  refundable: boolean;
  cancellation_policy: string;
  price_per_night_usd_minor: number;
  cancellation_deadline_hours: number;
  rateType: 'BOOKABLE' | 'RECHECK';
  rateCommentsId?: string;
  rateComments?: string;
  cancellationPolicies?: {
      amount: string;
      from: string;
  }[];
}
interface RoomType {
  id: string;
  created_at: string;
  property_id: string;
  name: string;
  capacity: number;
  photos: string[];
  rate_plans?: RatePlan[];
}
interface Property {
  id: string;
  created_at: string;
  title: string;
  description: string;
  location_city: string;
  location_country: string;
  latitude: number;
  longitude: number;
  photos: string[];
  star_rating: number;
  review_count: number;
  review_score: number;
  tenant_id: string;
  room_types?: RoomType[];
}


const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Map user-friendly city names to the required Hotelbeds destination codes.
const cityToDestinationCode: { [key: string]: string } = {
  'barcelona': 'BCN',
  'madrid': 'MAD',
  'palma': 'PMI',
  'istanbul': 'IST',
};

// Add mock coordinates for cities to enable map view functionality.
const cityCoordinates: { [key: string]: { lat: number; lng: number } } = {
    'BCN': { lat: 41.3851, lng: 2.1734 },
    'MAD': { lat: 40.4168, lng: -3.7038 },
    'PMI': { lat: 39.5696, lng: 2.6502 },
    'IST': { lat: 41.0082, lng: 28.9784 },
};

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

// Function to map Hotelbeds API response to our Property type
function mapHotelbedsToProperty(hotel: any): Property {
  const starRating = parseInt(hotel.categoryName?.match(/\d/)?.[0] || '3', 10);
  
  const mockDescription = `Enjoy a wonderful stay at ${hotel.name.content}, located in the heart of ${hotel.city.content}. This ${starRating}-star hotel offers great amenities and easy access to local attractions.`;
  const minRate = parseFloat(hotel.minRate);
  const nonRefundablePrice = Math.round(minRate * 0.9 * 100); // 10% cheaper
  const refundablePrice = Math.round(minRate * 100);

  const cancellationDeadline = new Date();
  cancellationDeadline.setDate(cancellationDeadline.getDate() + 14);

  // Get base coordinates for the city and add a small random offset.
  const baseCoords = cityCoordinates[hotel.destinationCode] || { lat: 0, lng: 0 };
  const latitude = baseCoords.lat + (Math.random() - 0.5) * 0.05; // ~5.5 km radius
  const longitude = baseCoords.lng + (Math.random() - 0.5) * 0.05;


  return {
    id: hotel.code.toString(),
    created_at: new Date().toISOString(),
    title: hotel.name.content,
    description: mockDescription,
    location_city: hotel.city.content,
    location_country: hotel.countryCode,
    latitude,
    longitude,
    photos: [
        `https://picsum.photos/seed/${hotel.code}/800/600`,
        `https://picsum.photos/seed/${hotel.code + 1}/800/600`,
        `https://picsum.photos/seed/${hotel.code + 2}/800/600`,
        `https://picsum.photos/seed/${hotel.code + 3}/800/600`,
        `https://picsum.photos/seed/${hotel.code + 4}/800/600`,
    ],
    star_rating: isNaN(starRating) ? 3 : starRating,
    review_count: Math.floor(Math.random() * 200) + 10,
    review_score: parseFloat(((Math.random() * 1.5) + 8.0).toFixed(1)), // Mocked score: 8.0-9.5
    tenant_id: 'd41d8cd9-8f00-4e2a-a259-07548b26b3c4', // A default tenant for now
    room_types: [
        {
            id: `${hotel.code}-standard`,
            created_at: new Date().toISOString(),
            property_id: hotel.code.toString(),
            name: 'Standard Room',
            capacity: 2,
            photos: [`https://picsum.photos/seed/${hotel.code}-room/800/600`],
            rate_plans: [
                {
                    id: `${hotel.code}-standard-refundable`,
                    created_at: new Date().toISOString(),
                    room_type_id: `${hotel.code}-standard`,
                    name: 'Free Cancellation',
                    refundable: true,
                    cancellation_policy: 'Flexible rate with free cancellation options. Please check the policy for deadlines.',
                    price_per_night_usd_minor: refundablePrice,
                    cancellation_deadline_hours: 24,
                    rateType: 'BOOKABLE',
                    rateComments: 'Breakfast can be added at the property for an additional fee.',
                    cancellationPolicies: [{
                        amount: (minRate * 0.5).toFixed(2), // 50% fee
                        from: cancellationDeadline.toISOString(),
                    }]
                },
                {
                    id: `${hotel.code}-standard-nonrefundable`,
                    created_at: new Date().toISOString(),
                    room_type_id: `${hotel.code}-standard`,
                    name: 'Non-Refundable',
                    refundable: false,
                    cancellation_policy: 'This rate is non-refundable. No changes or cancellations are allowed.',
                    price_per_night_usd_minor: nonRefundablePrice,
                    cancellation_deadline_hours: 0,
                    rateType: 'BOOKABLE',
                    rateComments: 'This is a special discounted rate with no flexibility. Payment is taken at the time of booking.',
                    cancellationPolicies: []
                }
            ]
        }
    ]
  };
}


serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { city, checkin, checkout, guests } = await req.json();
    
    if (!city || !checkin || !checkout || !guests) {
      return new Response(JSON.stringify({ error: 'Missing search parameters.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    
    const destinationCode = cityToDestinationCode[city.toLowerCase()];
    if (!destinationCode) {
      console.warn(`No destination code found for city: ${city}. Returning empty results.`);
      return new Response(JSON.stringify({ properties: [] }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // --- MOCK DATA GENERATION ---
    // This block replaces the call to the external Hotelbeds API.
    // It generates realistic-looking data based on the search query.
    console.log(`Generating mock hotel data for destination: ${destinationCode}`);
    
    const mockHotelsData = {
        hotels: {
            hotels: Array.from({ length: 15 }).map((_, i) => ({
                code: 1000 + i + simpleHash(city), // Use a simple hash to make hotel codes somewhat unique per city
                name: { content: `Hotel Mock ${city.charAt(0).toUpperCase() + city.slice(1)} ${i + 1}` },
                city: { content: city.charAt(0).toUpperCase() + city.slice(1) },
                countryCode: destinationCode === 'IST' ? 'TR' : 'ES',
                destinationCode: destinationCode,
                categoryName: `${Math.floor(Math.random() * 3) + 3}-star hotel`, // 3 to 5 stars
                minRate: (Math.random() * 200 + 50).toFixed(2), // 50 to 250
            }))
        }
    };
    const data = mockHotelsData;
    // --- END MOCK DATA GENERATION ---

    const properties: Property[] = (data.hotels?.hotels || [])
      .filter((hotel: any) => hotel.minRate && !isNaN(parseFloat(hotel.minRate)))
      .map(mapHotelbedsToProperty);

    return new Response(JSON.stringify({ properties }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error in search-hotels function:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})