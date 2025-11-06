# Setup Guide - Image Segmentation Application

## Step-by-Step Installation

### 1. Prerequisites Check

Before starting, ensure you have:

```bash
# Check Node.js version (should be 18+)
node --version

# Check npm version
npm --version
```

If Node.js is not installed, download from: https://nodejs.org/

### 2. Navigate to Project Directory

```bash
cd H:\Development\DAA
```

### 3. Install Dependencies

Install all dependencies for root, client, and server:

```bash
npm run install:all
```

This will:
- Install root dependencies (concurrently)
- Install client dependencies (React, Vite, TailwindCSS, etc.)
- Install server dependencies (Express, Sharp, etc.)

**Expected time**: 2-5 minutes depending on internet speed

### 4. Verify Installation

Check that all packages are installed:

```bash
# Check client
cd client
npm list --depth=0

# Check server
cd ../server
npm list --depth=0
```

### 5. Start the Application

From the root directory:

```bash
# Start both frontend and backend
npm run dev
```

Or start them separately in different terminals:

**Terminal 1 - Backend**:
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend**:
```bash
cd client
npm run dev
```

### 6. Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

## Troubleshooting

### Issue: Port Already in Use

**Error**: `Port 5173 is already in use`

**Solution**:
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or change port in client/vite.config.js
```

### Issue: Sharp Installation Failed

**Error**: `Error: Cannot find module 'sharp'`

**Solution**:
```bash
cd server
npm rebuild sharp
```

### Issue: Module Not Found

**Error**: `Cannot find module '@/lib/utils'`

**Solution**:
```bash
cd client
npm install
npm run dev
```

### Issue: CORS Errors

**Error**: `Access to XMLHttpRequest blocked by CORS`

**Solution**: Ensure backend is running on port 3000 and frontend proxy is configured in `vite.config.js`

## Development Tips

### Hot Reload

Both frontend and backend support hot reload:
- **Frontend**: Changes to React components reload automatically
- **Backend**: Restart server after changes to Node.js files

### Testing the API

Test the backend directly:

```bash
# Health check
curl http://localhost:3000/api/health

# Test segmentation (requires image file)
curl -X POST http://localhost:3000/api/segment \
  -F "image=@test-image.jpg" \
  -F "iterations=10" \
  -F "threshold=50"
```

### Building for Production

```bash
# Build frontend
cd client
npm run build

# Output will be in client/dist/
```

## Project Structure Overview

```
DAA/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── lib/        # Utilities
│   │   └── App.jsx     # Main app
│   └── package.json
├── server/             # Node.js backend
│   ├── index.js       # Express server
│   ├── karger.js      # Algorithm
│   └── package.json
└── package.json       # Root config
```

## Next Steps

1. ✅ Install dependencies
2. ✅ Start the application
3. 📸 Upload a test image
4. 🎨 Adjust parameters
5. ✂️ Segment the image
6. 💾 Download results

## Additional Resources

- **README.md**: General project information
- **DOCUMENTATION.md**: Detailed algorithm explanation
- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev
- **TailwindCSS**: https://tailwindcss.com

## Support

If you encounter issues:
1. Check this troubleshooting guide
2. Verify all dependencies are installed
3. Ensure ports 3000 and 5173 are available
4. Check console for error messages

---

Happy coding! 🚀
