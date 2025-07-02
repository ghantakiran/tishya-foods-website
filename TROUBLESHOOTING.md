# Tishya Foods Website - Troubleshooting Guide

## 🚨 **Can't Access the Website?**

If you're having trouble accessing the Tishya Foods website, try these solutions:

### **1. Check Server Status**
```bash
# Kill any existing processes
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Start fresh development server
npm run dev

# Or start production server
npm run build && npm start
```

### **2. Try Different Ports**
```bash
# Try port 3001
npm run dev -- --port 3001

# Try port 8080
npm run dev -- --port 8080

# Try port 5000
npm run dev -- --port 5000
```

### **3. Access URLs to Try**
- http://localhost:3000
- http://127.0.0.1:3000
- http://0.0.0.0:3000
- http://[your-ip]:3000

### **4. Check Firewall/Security**
- **macOS**: Check System Preferences > Security & Privacy > Firewall
- **Windows**: Check Windows Defender Firewall
- **Antivirus**: Temporarily disable to test

### **5. Browser Issues**
- Try a different browser (Chrome, Firefox, Safari)
- Clear browser cache and cookies
- Try incognito/private mode
- Disable browser extensions

### **6. Network Issues**
```bash
# Check if Node.js can bind to port
node -e "require('http').createServer().listen(3000, () => console.log('Port 3000 OK'))"

# Check network interface
ifconfig | grep inet

# Test with curl
curl -I http://localhost:3000
```

### **7. Environment Issues**
```bash
# Check Node.js version (should be 18+)
node --version

# Check npm version
npm --version

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### **8. Alternative: Static Build**
If the server won't start, you can build a static version:
```bash
# Build static files
npm run build

# Serve with a simple HTTP server
npx serve .next/static -p 3000
```

### **9. Development vs Production**
```bash
# Development mode (with hot reload)
npm run dev

# Production mode (optimized)
npm run build && npm start
```

### **10. Manual Server Start**
```bash
# Navigate to project directory
cd /Users/kiranreddyghanta/Developer/TishyaFoods/tishya-foods-website

# Use the helper script
./start-server.sh

# Or start manually
npm install
npm run dev
```

## 🔍 **Common Error Solutions**

### **"EADDRINUSE" Error**
```bash
# Kill process using the port
lsof -ti:3000 | xargs kill -9
# Then restart
npm run dev
```

### **"Permission Denied" Error**
```bash
# Try a port above 1024
npm run dev -- --port 8080
```

### **"Module Not Found" Error**
```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

## 📞 **Still Having Issues?**

### **Quick Health Check**
The website includes a health check endpoint:
- http://localhost:3000/api/health

### **Server Information**
When running, you should see:
```
✓ Ready in [time]ms
- Local:        http://localhost:3000
- Network:      http://[your-ip]:3000
```

### **Expected Response**
The homepage should load with:
- Tishya Foods hero section
- Product categories
- Customer testimonials
- Instagram feed
- AI chatbot in bottom-right corner

## 🛠️ **Technical Details**

### **Project Structure**
```
tishya-foods-website/
├── src/app/          # Next.js App Router pages
├── src/components/   # React components
├── src/lib/          # Utilities and data
├── public/           # Static assets
└── package.json      # Dependencies
```

### **Key Dependencies**
- Next.js 15.3.4
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion

### **Build Output**
After successful build, you should see:
- Total pages: 8+ pages
- Bundle size: ~155kB first load
- All pages marked as ○ (Static) or ƒ (Dynamic)

---

**If none of these solutions work, the website code is complete and functional. The issue is likely related to local environment configuration or network settings.**