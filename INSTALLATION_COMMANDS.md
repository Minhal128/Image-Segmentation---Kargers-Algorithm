# Installation Commands - Copy & Paste Guide

## 🚀 Complete Installation (One Command)

Open PowerShell/Terminal in `H:\Development\DAA` and run:

```powershell
npm run install:all
```

---

## 📋 Step-by-Step Installation

If you prefer to install manually:

### Step 1: Install Root Dependencies

```powershell
cd H:\Development\DAA
npm install
```

### Step 2: Install Client Dependencies

```powershell
cd client
npm install
```

### Step 3: Install Server Dependencies

```powershell
cd ..\server
npm install
```

### Step 4: Return to Root

```powershell
cd ..
```

---

## ▶️ Running the Application

### Option 1: Run Both (Recommended)

```powershell
npm run dev
```

This starts both frontend and backend simultaneously.

### Option 2: Run Separately

**Terminal 1 - Backend**:
```powershell
cd H:\Development\DAA
npm run dev:server
```

**Terminal 2 - Frontend**:
```powershell
cd H:\Development\DAA
npm run dev:client
```

---

## ✅ Verification Checklist

### After Installation

- [ ] No error messages during installation
- [ ] `node_modules` folder exists in root
- [ ] `node_modules` folder exists in `client/`
- [ ] `node_modules` folder exists in `server/`

### After Starting

- [ ] Backend shows: "Server running on port 3000"
- [ ] Frontend shows: "Local: http://localhost:5173"
- [ ] No error messages in console
- [ ] Browser opens automatically (or manually open http://localhost:5173)

### Testing the Application

- [ ] Upload an image (drag & drop or click)
- [ ] Image preview appears
- [ ] Adjust sliders (iterations and threshold)
- [ ] Click "Segment Image"
- [ ] Processing indicator appears
- [ ] Segmented result displays
- [ ] Statistics show (processing time, nodes, edges, cut size)
- [ ] Download button works
- [ ] Info modal opens and displays documentation

---

## 🔧 Troubleshooting Commands

### If Installation Fails

```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force client\node_modules
Remove-Item -Recurse -Force server\node_modules
npm run install:all
```

### If Sharp Module Fails

```powershell
cd server
npm rebuild sharp
```

### If Port is Already in Use

**Kill process on port 5173 (Frontend)**:
```powershell
netstat -ano | findstr :5173
# Note the PID from the output
taskkill /PID <PID> /F
```

**Kill process on port 3000 (Backend)**:
```powershell
netstat -ano | findstr :3000
# Note the PID from the output
taskkill /PID <PID> /F
```

### Check Node.js Version

```powershell
node --version
# Should be v18.0.0 or higher
```

### Check npm Version

```powershell
npm --version
# Should be 8.0.0 or higher
```

---

## 🧪 Testing Commands

### Test Backend API

```powershell
# Test health endpoint
curl http://localhost:3000/api/health
```

### Build for Production

```powershell
# Build frontend
cd client
npm run build

# Output will be in client/dist/
```

---

## 📦 Package Versions

### Root Package
```json
{
  "concurrently": "^8.2.2"
}
```

### Client Packages
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "vite": "^5.0.8",
  "tailwindcss": "^3.3.6",
  "react-toastify": "^9.1.3",
  "axios": "^1.6.2",
  "lucide-react": "^0.294.0"
}
```

### Server Packages
```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "multer": "^1.4.5-lts.1",
  "sharp": "^0.33.1"
}
```

---

## 🎯 Quick Commands Reference

| Command | Description |
|---------|-------------|
| `npm run install:all` | Install all dependencies |
| `npm run dev` | Start both frontend and backend |
| `npm run dev:client` | Start frontend only |
| `npm run dev:server` | Start backend only |
| `npm run build` | Build frontend for production |

---

## 🌐 URLs After Starting

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | Main application |
| Backend | http://localhost:3000 | API server |
| Health Check | http://localhost:3000/api/health | Server status |

---

## 📁 Expected Directory Structure After Installation

```
DAA/
├── node_modules/           ✅ Root dependencies
├── client/
│   ├── node_modules/       ✅ Client dependencies
│   ├── src/
│   ├── package.json
│   └── ...
├── server/
│   ├── node_modules/       ✅ Server dependencies
│   ├── index.js
│   ├── karger.js
│   └── package.json
├── package.json
└── ...
```

---

## 🎓 First Time Setup Checklist

1. **Prerequisites**
   - [ ] Node.js 18+ installed
   - [ ] npm installed
   - [ ] Terminal/PowerShell access

2. **Installation**
   - [ ] Navigate to `H:\Development\DAA`
   - [ ] Run `npm run install:all`
   - [ ] Wait for installation to complete
   - [ ] Verify no errors

3. **Starting Application**
   - [ ] Run `npm run dev`
   - [ ] Wait for both servers to start
   - [ ] Open browser to http://localhost:5173

4. **First Test**
   - [ ] Upload a test image
   - [ ] Use default parameters (15 iterations, 50 threshold)
   - [ ] Click "Segment Image"
   - [ ] Verify result appears
   - [ ] Download result

5. **Explore Features**
   - [ ] Try different images
   - [ ] Adjust parameters
   - [ ] Read documentation in Info modal
   - [ ] Test download functionality

---

## 💡 Pro Tips

### Faster Installation
```powershell
# Use npm ci for faster, cleaner installs (if package-lock.json exists)
npm ci
cd client && npm ci
cd ../server && npm ci
```

### Development Mode
```powershell
# Keep terminal open to see logs
npm run dev

# Watch for errors in console
# Backend logs show algorithm progress
# Frontend logs show API calls
```

### Testing Different Images
- Start with simple, high-contrast images
- Try images with clear foreground/background
- Experiment with different parameter combinations

---

## 🆘 Common Issues & Solutions

### Issue: "Cannot find module"
**Solution**: 
```powershell
npm run install:all
```

### Issue: "Port already in use"
**Solution**: 
```powershell
# Kill the process or change port in vite.config.js
```

### Issue: "Sharp installation failed"
**Solution**: 
```powershell
cd server
npm install --platform=win32 --arch=x64 sharp
```

### Issue: "CORS error"
**Solution**: 
- Ensure backend is running
- Check vite.config.js proxy settings
- Restart both servers

---

## 📞 Need Help?

1. Check `SETUP_GUIDE.md` for detailed troubleshooting
2. Review `DOCUMENTATION.md` for algorithm details
3. Read `README.md` for project overview
4. Check console for specific error messages

---

**Ready to start? Run this command:**

```powershell
cd H:\Development\DAA && npm run install:all && npm run dev
```

This will install everything and start the application in one go! 🚀
