# Hotels Map Component Setup Guide

## Installation

Before using the `HotelsMap` component, you need to install the required dependencies:

```bash
npm install react-leaflet leaflet
npm install --save-dev @types/leaflet
```

## Usage

The `HotelsMap` component is located at `client/src/components/hotels-map.tsx`.

### Basic Example

```tsx
import { HotelsMap } from "@/components/hotels-map";

function MyComponent() {
  return (
    <div className="w-full h-[500px]">
      <HotelsMap />
    </div>
  );
}
```

### With Custom Props

```tsx
import { HotelsMap } from "@/components/hotels-map";

function MyComponent() {
  return (
    <HotelsMap
      center={[0.5142, 35.2697]} // Custom center
      zoom={14} // Custom zoom level
      height="600px" // Custom height
      className="rounded-lg border" // Additional CSS classes
    />
  );
}
```

### Using Custom Hotel Data

```tsx
import { HotelsMap, hotelsData } from "@/components/hotels-map";

const customHotels = [
  {
    id: "custom-hotel",
    name: "Custom Hotel",
    description: "A custom hotel description",
    coordinates: [0.5142, 35.2697] as [number, number],
    image: "https://example.com/image.jpg",
    rating: 4.5,
    location: "Custom Location"
  }
];

function MyComponent() {
  return <HotelsMap hotels={customHotels} />;
}
```

## Features

- ✅ Interactive map centered on Eldoret, Kenya
- ✅ Custom styled markers for each hotel
- ✅ Popup cards with hotel information (image, name, rating, address)
- ✅ Clickable cards that navigate to `/hotels/[id]`
- ✅ Automatic bounds fitting to show all hotels
- ✅ Responsive design with Tailwind CSS
- ✅ Hover effects and smooth transitions

## Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `center` | `[number, number]` | `[0.5142, 35.2697]` | Map center coordinates (Eldoret) |
| `zoom` | `number` | `13` | Initial zoom level |
| `hotels` | `Hotel[]` | `hotelsData` | Array of hotel objects |
| `className` | `string` | `""` | Additional CSS classes |
| `height` | `string` | `"500px"` | Map container height |

## Hotel Data Structure

```typescript
{
  id: string;
  name: string;
  description: string;
  coordinates: [number, number]; // [latitude, longitude]
  image: string; // URL to hotel image
  rating: number; // Rating out of 5
  location: string; // Address or location description
}
```

## Navigation

The component uses `wouter` for routing. When a hotel card is clicked, it navigates to `/hotels/[id]`. Make sure you have a route set up for this path in your `App.tsx`:

```tsx
<Route path="/hotels/:id" component={HotelDetailPage} />
```

## Styling

The component uses Tailwind CSS and includes custom styles for:
- Map popups (rounded corners, shadows)
- Custom marker icons
- Responsive card layouts
- Hover effects

All styles are included in the component and `index.css`.
