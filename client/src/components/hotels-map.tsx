import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Link } from "wouter";
import { Star, MapPin } from "lucide-react";
import L from "leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom marker icon
const createCustomIcon = (color: string = "#3b82f6") => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          transform: rotate(45deg);
          color: white;
          font-weight: bold;
          font-size: 16px;
        ">📍</div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// Hotels data - Partner Hotels Only
export const hotelsData = [
  {
    id: "eka-hotel-eldoret",
    name: "EKA Hotel Eldoret",
    description: "A contemporary style hotel located at Rupa's Mall, offering convenience and comfort. Our official partner hotel.",
    coordinates: [0.5134, 35.2923] as [number, number],
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    rating: 4.5,
    location: "Rupa's Mall, Malaba Road, Eldoret"
  },
  {
    id: "grand-empire-hotel-eldoret",
    name: "Grand Empire Hotel Eldoret",
    description: "A premier hotel in Eldoret offering exceptional service and amenities. Our official partner hotel.",
    coordinates: [0.5150, 35.2800] as [number, number],
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
    rating: 4.4,
    location: "Eldoret, Kenya"
  }
];

// Component to fit map bounds to show all markers
function MapBounds({ hotels }: { hotels: typeof hotelsData }) {
  const map = useMap();

  useEffect(() => {
    if (hotels.length > 0) {
      const bounds = L.latLngBounds(
        hotels.map(hotel => hotel.coordinates)
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, hotels]);

  return null;
}

// Hotel Popup Card Component
function HotelPopupCard({ hotel }: { hotel: typeof hotelsData[0] }) {
  return (
    <Link href={`/hotels/${hotel.id}`}>
      <div className="w-64 cursor-pointer group">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
          {/* Image */}
          <div className="relative h-32 w-full overflow-hidden">
            <img
              src={hotel.image}
              alt={hotel.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x200?text=Hotel";
              }}
            />
            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-xs font-semibold text-gray-800">{hotel.rating}</span>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-3">
            <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1 group-hover:text-primary transition-colors">
              {hotel.name}
            </h3>
            <div className="flex items-start gap-1.5 text-xs text-gray-600">
              <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0 text-gray-400" />
              <p className="line-clamp-2">{hotel.location}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

interface HotelsMapProps {
  center?: [number, number];
  zoom?: number;
  hotels?: typeof hotelsData;
  className?: string;
  height?: string;
}

export function HotelsMap({
  center = [0.5142, 35.2697], // Eldoret, Kenya
  zoom = 13,
  hotels = hotelsData,
  className = "",
  height = "500px"
}: HotelsMapProps) {
  // Calculate bounds to fit all hotels
  const bounds = useMemo(() => {
    if (hotels.length === 0) return null;
    return L.latLngBounds(
      hotels.map(hotel => hotel.coordinates)
    );
  }, [hotels]);

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%", borderRadius: "0.5rem", zIndex: 0 }}
        scrollWheelZoom={true}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Fit bounds to show all hotels */}
        {bounds && <MapBounds hotels={hotels} />}
        
        {/* Render markers for each hotel */}
        {hotels.map((hotel) => (
          <Marker
            key={hotel.id}
            position={hotel.coordinates}
            icon={createCustomIcon("#3b82f6")}
          >
            <Popup
              closeButton={true}
              className="custom-popup"
              maxWidth={300}
            >
              <HotelPopupCard hotel={hotel} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
