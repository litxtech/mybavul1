import { getSupabaseClient } from "../lib/supabase";
import { Property, RoomType, RatePlan, SearchParams, Currency } from "../types";

interface CreateBookingParams {
    userId: string;
    property: Property;
    room: RoomType;
    rate: RatePlan;
    searchParams: SearchParams;
    displayCurrency: Currency;
}

// Utility to calculate the number of nights
const getDurationInNights = (checkin: string, checkout: string): number => {
    const startDate = new Date(checkin);
    const endDate = new Date(checkout);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
};

// NOTE: A Supabase Edge Function is required to securely create the Stripe Checkout session.
// The function would be located at `supabase/functions/create-checkout-session/index.ts`
// and would handle the communication with the Stripe API using a secret key.

export const createBookingAndCheckout = async ({ userId, property, room, rate, searchParams, displayCurrency }: CreateBookingParams) => {
    
    // Access the Stripe key from `process.env`
    const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
    if (!stripePublishableKey) {
        const errorMessage = "Stripe Publishable Key is not configured. Payment cannot proceed.";
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
    
    const durationNights = getDurationInNights(searchParams.checkin, searchParams.checkout);
    const totalPriceUsdMinor = rate.price_per_night_usd_minor * durationNights;
    const supabase = getSupabaseClient();

    // We need to fetch the exchange rate to calculate the display price
    const { data: fxRateData, error: fxError } = await supabase
        .from('fx_rates')
        .select('rate')
        .eq('base', 'USD')
        .eq('quote', displayCurrency.code)
        .single();
        
    if (fxError && displayCurrency.code !== 'USD') {
        console.error("Error fetching exchange rate:", fxError);
        throw new Error("Could not fetch exchange rate.");
    }

    const exchangeRate = fxRateData?.rate || 1;
    const totalPriceDisplayMinor = Math.round(totalPriceUsdMinor * exchangeRate);

    // Step 1: Create a 'pending' booking in the database.
    const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
            user_id: userId,
            property_id: property.id,
            room_type_id: room.id,
            rate_plan_id: rate.id,
            checkin_date: searchParams.checkin,
            checkout_date: searchParams.checkout,
            guest_count: searchParams.guests,
            total_price_usd_minor: totalPriceUsdMinor,
            display_currency: displayCurrency.code,
            total_price_display_minor: totalPriceDisplayMinor,
            status: 'pending',
        })
        .select()
        .single();

    if (bookingError) {
        console.error("Error creating pending booking:", bookingError);
        throw new Error("Could not create booking.");
    }

    // Step 2: Invoke the Supabase Edge Function to create a Stripe Checkout session.
    const { data: functionData, error: functionError } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          booking_id: booking.id,
          property_name: property.title,
          room_name: room.name,
          amount_minor: totalPriceDisplayMinor,
          currency: displayCurrency.code.toLowerCase(),
        },
    });

    if (functionError) {
        console.error('Error invoking Supabase function:', functionError);
        // Attempt to clean up the pending booking
        await supabase.from('bookings').delete().eq('id', booking.id);
        throw new Error("Could not connect to payment service.");
    }

    const { sessionId } = functionData;

    // Step 3: Redirect the user to Stripe Checkout.
    const stripe = (window as any).Stripe(stripePublishableKey);
    const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: sessionId,
    });

    if (stripeError) {
        console.error("Stripe redirect error:", stripeError);
        throw new Error("Could not redirect to payment page.");
    }
};


export const cancelBooking = async (bookingId: string) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.functions.invoke('cancel-booking', {
        body: { booking_id: bookingId },
    });

    if (error) {
        console.error("Error invoking cancel-booking function:", error.message);
        throw new Error(data?.error || "Failed to cancel booking.");
    }

    return data;
};