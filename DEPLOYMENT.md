# Tishya Foods Website - Deployment Guide

## 🚀 **Deploy to Vercel (Recommended)**

Vercel is the recommended platform for deploying Next.js applications. Follow these steps:

### **Quick Deployment (Automated)**
```bash
# Run the deployment script
./deploy.sh
```

### **Manual Deployment Steps**

#### **1. Install Vercel CLI**
```bash
npm install -g vercel
```

#### **2. Login to Vercel**
```bash
vercel login
```
This will open your browser to authenticate with Vercel.

#### **3. Deploy to Preview**
```bash
vercel
```
- Choose your team/scope
- Link to existing project or create new one
- Use default settings (Vercel auto-detects Next.js)

#### **4. Deploy to Production**
```bash
vercel --prod
```

### **🔧 Deployment Configuration**

Vercel will automatically detect the following settings:
- **Framework**: Next.js 15.3.4
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Node.js Version**: 18.x

### **📊 Expected Deployment Results**

After successful deployment:
- ✅ **Build Time**: < 30 seconds
- ✅ **Bundle Size**: ~155kB first load JS
- ✅ **Pages**: 8 pages generated
- ✅ **Performance**: Excellent Core Web Vitals
- ✅ **SSL**: Automatic HTTPS certificate

### **🌐 Your Live URLs**

After deployment, you'll get:
- **Preview URL**: `https://tishya-foods-website-[hash].vercel.app`
- **Production URL**: `https://tishya-foods-website.vercel.app`
- **Custom Domain**: Can be configured later

---

## 🌍 **Alternative Deployment Options**

### **Deploy to Netlify**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy --prod --dir=out
```

### **Deploy to GitHub Pages**
1. Push code to GitHub repository
2. Enable GitHub Pages in repository settings
3. Set source to GitHub Actions
4. Use the provided workflow file

### **Deploy to Railway**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway deploy
```

### **Deploy to DigitalOcean App Platform**
1. Connect your GitHub repository
2. Select Next.js as the framework
3. Configure build settings automatically
4. Deploy with one click

---

## ⚙️ **Environment Variables**

### **Required for Production**
Set these in your deployment platform:

```bash
# Database (if using)
DATABASE_URL="postgresql://user:pass@host:5432/db"

# Authentication (if using NextAuth)
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secret-key"

# Email (if using contact forms)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### **Optional**
```bash
# Analytics
GOOGLE_ANALYTICS_ID="GA-MEASUREMENT-ID"
VERCEL_ANALYTICS_ID="your-analytics-id"

# Instagram API (for real feed)
INSTAGRAM_ACCESS_TOKEN="your-token"

# Performance monitoring
SENTRY_DSN="your-sentry-dsn"
```

---

## 🔍 **Deployment Checklist**

### **Pre-Deployment**
- [x] ✅ All pages build without errors
- [x] ✅ TypeScript compilation passes
- [x] ✅ ESLint rules satisfied
- [x] ✅ Responsive design tested
- [x] ✅ Performance optimized
- [x] ✅ SEO meta tags configured
- [x] ✅ Security headers set

### **Post-Deployment Testing**
- [ ] 🌐 All pages load correctly
- [ ] 📱 Mobile responsiveness works
- [ ] 🤖 AI chatbot functions
- [ ] 🔍 Search and filtering work
- [ ] 📊 Performance metrics good
- [ ] 🔒 Security headers present
- [ ] 📈 Analytics tracking (if configured)

---

## 🛠️ **Deployment Commands Quick Reference**

```bash
# Test build locally
npm run build && npm start

# Deploy to Vercel preview
vercel

# Deploy to Vercel production
vercel --prod

# Check deployment status
vercel ls

# View deployment logs
vercel logs [deployment-url]

# Set environment variables
vercel env add [VAR_NAME]

# Link to existing project
vercel link
```

---

## 🎯 **Performance Expectations**

### **Lighthouse Scores** (Expected)
- **Performance**: 90+ 
- **Accessibility**: 95+
- **Best Practices**: 90+
- **SEO**: 95+

### **Core Web Vitals**
- **LCP**: < 2.5s
- **FID**: < 100ms  
- **CLS**: < 0.1

### **Bundle Analysis**
- **First Load JS**: ~155kB
- **Largest Route**: / (8.14kB)
- **Static Pages**: 7/8 pages
- **Dynamic Routes**: 1 API route

---

## 🆘 **Troubleshooting Deployment**

### **Build Fails**
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### **Environment Variables Missing**
```bash
# Add to Vercel
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
```

### **Performance Issues**
- Check bundle analyzer: `npm run analyze`
- Optimize images and fonts
- Enable compression and caching

### **Domain Configuration**
```bash
# Add custom domain
vercel domains add yourdomain.com
vercel alias [deployment-url] yourdomain.com
```

---

## 📞 **Support & Resources**

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **GitHub Repository**: Your repository URL
- **Live Website**: Will be provided after deployment

**The Tishya Foods website is fully optimized and ready for production deployment!** 🎉