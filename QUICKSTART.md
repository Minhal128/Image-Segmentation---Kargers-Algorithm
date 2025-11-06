# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1️⃣ Install Dependencies

```bash
cd H:\Development\DAA
npm run install:all
```

### 2️⃣ Start the Application

```bash
npm run dev
```

### 3️⃣ Open in Browser

Navigate to: **http://localhost:5173**

---

## 📸 How to Use

1. **Upload Image**: Drag & drop or click to select
2. **Adjust Settings**:
   - Monte Carlo Iterations: 15 (default)
   - Similarity Threshold: 50 (default)
3. **Click "Segment Image"**
4. **Download Result**

---

## 🎯 Best Practices

### For Good Results:
- Use images with clear foreground/background
- Start with default parameters
- Increase iterations (20-30) for better accuracy
- Adjust threshold based on image:
  - High contrast: 30-50
  - Similar colors: 60-80

### Performance Tips:
- Smaller images process faster
- More iterations = better quality but slower
- Typical processing time: 2-5 seconds

---

## 📚 Documentation

- **README.md**: Full project overview
- **DOCUMENTATION.md**: Complete algorithm explanation
- **ALGORITHM_EXPLANATION.md**: Simple explanation
- **SETUP_GUIDE.md**: Detailed setup instructions

---

## 🛠️ Troubleshooting

**Port in use?**
```bash
# Kill process on port 5173 or 3000
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

**Dependencies not installed?**
```bash
cd client && npm install
cd ../server && npm install
```

**Sharp module error?**
```bash
cd server && npm rebuild sharp
```

---

## 🎨 Features

✅ Karger's Min-Cut Algorithm  
✅ Monte Carlo Optimization  
✅ Modern React UI with TailwindCSS  
✅ shadcn/ui Components  
✅ Toast Notifications  
✅ Real-time Processing  
✅ Download Results  
✅ Interactive Documentation  

---

## 📊 Tech Stack

**Frontend**: React 18, Vite, TailwindCSS, shadcn/ui, react-toastify  
**Backend**: Node.js, Express, Sharp, Multer  
**Algorithm**: Karger's Min-Cut with Monte Carlo  

---

**Ready to segment some images? Let's go! 🎉**
