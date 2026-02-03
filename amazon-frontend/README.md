# Amazon Clone - Frontend

A pixel-perfect Amazon.in clone built with React.js that seamlessly integrates with the Node.js backend.

## Features

- 🎨 **Pixel-Perfect UI**: Exact Amazon design with accurate colors, fonts, and spacing
- 🔍 **Search & Filter**: Full-text search with category filtering
- 🛒 **Shopping Cart**: Complete cart management (add, update, remove)
- 📦 **Product Details**: Image gallery, specifications, and pricing
- 📋 **Order History**: View and track past orders
- 📱 **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- ⚡ **Fast Performance**: Optimized React components

## Tech Stack

- **React 18**: Latest React with hooks
- **React Router 6**: Client-side routing
- **Axios**: HTTP client for API calls
- **React Icons**: Icon library
- **CSS3**: Custom styling (no CSS frameworks)

## Prerequisites

- Node.js 14+ and npm
- Running backend server (from setup_project.js)
- MySQL database (configured in backend)

## Quick Start

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm start
```

The app will open at `http://localhost:3000`

## Project Structure

```
src/
├── components/
│   └── Header/              # Navigation header
├── pages/
│   ├── Home/               # Landing page with carousel
│   ├── Search/             # Search results page
│   ├── ProductDetail/      # Individual product page
│   ├── Cart/               # Shopping cart page
│   └── Orders/             # Order history page
├── config/
│   └── api.js              # API configuration & endpoints
├── App.js                  # Main app with routing
└── index.js                # React entry point
```

## API Integration

The frontend connects to the backend API running on `http://localhost:5000/api` by default.

Update `.env` to change the API URL:
```env
REACT_APP_API_URL=http://your-backend-url/api
```

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests

## Design Implementation

This frontend meticulously replicates Amazon.in's design:

### Colors
- Primary Background: `#131921` (header)
- Secondary Background: `#232F3E` (nav bar)
- Orange: `#FF9900` (accents)
- Yellow: `#FFD814` (buttons)

### Typography
- Font Family: "Amazon Ember", Arial, sans-serif
- Header sizes match Amazon exactly

### Components
- Header with search, cart, and navigation
- Product cards with proper spacing
- Star ratings and pricing
- Responsive grid layouts

## Integration with Backend

Ensure your backend is running:

```bash
cd amazon-backend
npm run dev
```

The frontend automatically:
- Fetches products from `/api/products`
- Manages cart via `/api/cart` endpoints
- Places orders via `/api/orders`
- Updates in real-time

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Performance

- Lazy loading for images
- Optimized re-renders
- Efficient state management
- Code splitting for production

## License

This is a demonstration project created for educational purposes.

## Author

Created by Pranav

## Acknowledgments

- Design inspiration: Amazon.in
- Icons: React Icons library
- Backend: Custom Node.js + Express API
