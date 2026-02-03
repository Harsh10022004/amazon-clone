# Dependencies and Package Installation Guide

## Frontend Dependencies

All dependencies will be installed when you run `npm install` in the amazon-frontend directory.

### Core Dependencies

```bash
npm install react@^18.2.0 react-dom@^18.2.0
```

### Routing
```bash
npm install react-router-dom@^6.20.0
```

### HTTP Client
```bash
npm install axios@^1.6.2
```

### Icons
```bash
npm install react-icons@^4.12.0
```

### Build Tools (Development)
```bash
npm install --save-dev react-scripts@5.0.1
```

## Complete package.json

Your package.json already includes all dependencies. Simply run:

```bash
cd amazon-frontend
npm install
```

This will install ALL required packages automatically.

## Verification

After installation, verify with:

```bash
npm list --depth=0
```

You should see all packages listed without errors.

## Troubleshooting

### Issue: npm install fails

**Solution 1**: Clear npm cache
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Solution 2**: Use different registry
```bash
npm install --registry=https://registry.npmjs.org/
```

### Issue: Permission errors (Mac/Linux)

**Solution**: Use sudo or fix permissions
```bash
sudo npm install
# OR
sudo chown -R $USER:$(id -gn $USER) ~/.npm
sudo chown -R $USER:$(id -gn $USER) ~/.config
```

### Issue: Peer dependency warnings

These are usually safe to ignore. They don't affect functionality.

## Backend Dependencies

The backend dependencies are already configured in amazon-backend/package.json.

To install backend dependencies:

```bash
cd amazon-backend
npm install
```

This installs:
- express
- mysql2
- cors
- dotenv
- nodemon (dev)

## Version Compatibility

This project is tested with:
- Node.js: v14.x, v16.x, v18.x
- npm: v6.x, v7.x, v8.x, v9.x
- MySQL: v8.0.x

## Optional: Global Tools

For better development experience:

```bash
# Nodemon (if not already installed)
npm install -g nodemon

# Serve (for testing production builds)
npm install -g serve
```

## Production Build

To create an optimized production build:

```bash
cd amazon-frontend
npm run build
```

This creates a `build` folder with optimized static files ready for deployment.

## Testing Production Build Locally

```bash
# After npm run build
npx serve -s build -p 3000
```

## Environment Variables

Don't forget to create `.env` files:

### Frontend (.env in amazon-frontend/)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Backend (.env in amazon-backend/)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=amazon_clone
DB_PORT=3306
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Quick Install Commands Summary

```bash
# Backend
cd amazon-backend
npm install
# Edit .env with MySQL password
npm run seed
npm run dev

# Frontend (in new terminal)
cd amazon-frontend
npm install
npm start
```

That's it! Your Amazon clone will be running.
