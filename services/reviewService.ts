import { getSupabaseClient } from "../lib/supabase";
import { Review } from "../types";

interface AddReviewPayload {
    booking_id: string;
    property_id: string;
    user_id: string;
    rating: number;
    comment: string;
}

export const addReview = async ({ booking_id, property_id, user_id, rating, comment }: AddReviewPayload): Promise<{ data: Review | null, error: any }> => {
    const supabase = getSupabaseClient();
    
    // Check if a review for this booking already exists to prevent duplicates.
    // The RLS policy on the DB also enforces this, but a client-side check provides a better error message.
    const { data: existingReview, error: checkError } = await supabase
        .from('reviews')
        .select('id')
        .eq('booking_id', booking_id)
        .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "exact one row not found", which is what we want.
        return { data: null, error: checkError };
    }
    if (existingReview) {
        return { data: null, error: { message: 'A review for this booking already exists.' } };
    }

    // Insert the new review
    const { data, error } = await supabase
        .from('reviews')
        .insert({
            booking_id,
            property_id,
            user_id,
            rating,
            comment,
        })
        .select()
        .single();
    
    return { data, error };
};