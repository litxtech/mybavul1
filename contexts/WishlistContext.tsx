import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getSupabaseClient } from '../lib/supabase';
import { Wishlist, Property } from '../types';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist: Wishlist[];
  loading: boolean;
  addToWishlist: (propertyId: string) => Promise<void>;
  removeFromWishlist: (propertyId: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { session } = useAuth();
  const [wishlist, setWishlist] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = useCallback(async () => {
    if (!session?.user) {
        setWishlist([]);
        setLoading(false);
        return;
    };

    setLoading(true);
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('wishlists')
      .select('*, properties (*, room_types(*, rate_plans(*)))')
      .eq('user_id', session.user.id);
    
    if (error) {
      console.error("Error fetching wishlist:", error);
    } else {
      setWishlist(data as Wishlist[]);
    }
    setLoading(false);
  }, [session]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = async (propertyId: string) => {
    if (!session?.user) return;
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
        .from('wishlists')
        .insert({ user_id: session.user.id, property_id: propertyId })
        .select()
        .single();
    
    if (error) {
        console.error("Error adding to wishlist", error);
    } else if (data) {
        // Optimistically update UI
        setWishlist(prev => [...prev, data]);
        // Re-fetch to get joined data correctly
        fetchWishlist();
    }
  };

  const removeFromWishlist = async (propertyId: string) => {
    if (!session?.user) return;
    const supabase = getSupabaseClient();
    const { error } = await supabase
        .from('wishlists')
        .delete()
        .match({ user_id: session.user.id, property_id: propertyId });

    if (error) {
        console.error("Error removing from wishlist", error);
    } else {
        setWishlist(prev => prev.filter(item => item.property_id !== propertyId));
    }
  };

  const value = {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
