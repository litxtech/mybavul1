import React, { useEffect, useRef } from 'react';
import { Property, SearchParams } from '../types';
import { useCurrency } from '../contexts/CurrencyContext';

declare const L: any; // Use Leaflet from the global scope

interface MapViewProps {
    properties: Property[];
    searchParams: SearchParams;
}

const MapView: React.FC<MapViewProps> = ({ properties, searchParams }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const { formatCurrency } = useCurrency();

    useEffect(() => {
        if (mapContainerRef.current && !mapRef.current) {
            mapRef.current = L.map(mapContainerRef.current).setView([41.3851, 2.1734], 13); // Default view
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapRef.current);
        }

        if (mapRef.current && properties.length > 0) {
            // Clear existing markers
            mapRef.current.eachLayer((layer: any) => {
                if (layer instanceof L.Marker) {
                    mapRef.current.removeLayer(layer);
                }
            });

            const markers = L.featureGroup();

            properties.forEach(property => {
                const marker = L.marker([property.latitude, property.longitude]);
                const cheapestPriceUsdMinor = Math.min(...property.room_types?.flatMap(rt => rt.rate_plans?.map(rp => rp.price_per_night_usd_minor) || [Infinity]) || [Infinity]);
                
                const popupContent = `
                    <div class="font-sans">
                        <img src="${property.photos[0]}" alt="${property.title}" class="w-full h-24 object-cover rounded-t-md mb-2" />
                        <div class="p-1">
                            <h4 class="font-bold text-base mb-1">${property.title}</h4>
                            <p class="text-slate-600 dark:text-slate-300">from <strong class="text-primary-600">${formatCurrency(cheapestPriceUsdMinor)}</strong></p>
                            <a href="#/property/${property.id}?${new URLSearchParams(searchParams as any).toString()}" class="text-primary-600 font-semibold mt-2 inline-block">View Details &rarr;</a>
                        </div>
                    </div>
                `;
                
                marker.bindPopup(popupContent, { minWidth: 200 });
                markers.addLayer(marker);
            });

            markers.addTo(mapRef.current);
            mapRef.current.fitBounds(markers.getBounds().pad(0.1));
        }

    }, [properties, formatCurrency, searchParams]);

    return (
        <div ref={mapContainerRef} style={{ height: 'calc(100vh - 250px)', width: '100%' }} className="rounded-lg shadow-md" />
    );
};

export default MapView;