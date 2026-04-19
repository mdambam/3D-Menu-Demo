# 3D Menu Demo

A modern, premium restaurant demo website featuring interactive 3D/AR food visualization built with Next.js, Tailwind CSS, Framer Motion, and Three.js.

## Features

- **Landing Page**: Fullscreen hero with animated background, "How It Works" section, and QR code generation
- **Menu Page**: Grid of food items with search, hover animations, and 3D preview buttons
- **AR Page**: Fullscreen 3D experience with:
  - Swipe gestures (left/right) to navigate food items
  - Smooth slide transitions between models
  - Floating animation for premium feel
  - Shadow effects for realism
  - Optimized for mobile devices
- **Multi-Item AR Page**: Virtual table setup showing multiple dishes with camera controls

## Tech Stack

- **Next.js 14** - App Router, React Server Components
- **Tailwind CSS** - Utility-first styling with custom theme
- **Framer Motion** - Smooth animations and transitions
- **Three.js + React Three Fiber** - 3D rendering and AR simulation
- **Supabase** - Backend database (with mock data fallback)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Landing page
│   ├── menu/page.tsx     # Menu grid
│   ├── ar/page.tsx       # Single item AR view
│   ├── ar-multi/page.tsx # Multi-item table view
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── FoodModel.tsx     # 3D food models
│   ├── QRCode.tsx        # QR code modal
│   └── SwipeGesture.tsx  # Swipe detection
├── lib/
│   ├── supabase.ts       # Database client + mock data
│   └── utils.ts          # Utility functions
└── ...
```

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

If not configured, the app will use mock data.

## Mobile Optimizations

- Touch-friendly swipe gestures on AR page
- Mobile-first responsive design
- Safe area insets for iPhone
- Optimized touch targets (min 44px)
- Hardware-accelerated animations

## Browser Support

- Chrome/Edge (latest)
- Safari (latest) - optimized for iPhone
- Firefox (latest)

## Demo Data

The app includes 6 sample menu items:
- Wagyu Beef Steak
- Truffle Lobster
- Golden Sushi Platter
- Molten Chocolate Cake
- Artisan Burger
- Tiramisu Classic

Each has a procedurally generated 3D model matching the food type.
