# Zynk Quick Commerce - Deployment Guide

Complete guide to deploy all three components to production.

---

## 🌐 Admin Panel Deployment (Vercel)

### Option 1: Deploy via Vercel Dashboard

1. **Go to [vercel.com](https://vercel.com)**
2. Click "Add New" → "Project"
3. Import `zynk-admin-panel` repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: .next

5. **Add Environment Variables**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   ```

6. Click "Deploy"
7. Your admin panel will be live at: `https://zynk-admin-panel.vercel.app`

### Option 2: Deploy via CLI

```bash
cd zynk-admin-panel

# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# Deploy to production
vercel --prod
```

---

## 📱 User App Deployment

### iOS App Store

#### Prerequisites
- Apple Developer Account ($99/year)
- Mac with Xcode installed
- Valid certificates and provisioning profiles

#### Steps

1. **Configure app.json**:
```json
{
  "expo": {
    "name": "Zynk",
    "slug": "zynk-user-app",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.yourcompany.zynk",
      "buildNumber": "1"
    }
  }
}
```

2. **Build for iOS**:
```bash
cd zynk-user-app

# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build for iOS
eas build --platform ios
```

3. **Submit to App Store**:
```bash
eas submit --platform ios
```

4. **App Store Connect**:
   - Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
   - Fill in app information
   - Add screenshots
   - Submit for review

### Android Play Store

#### Prerequisites
- Google Play Developer Account ($25 one-time)
- Android Studio (optional)

#### Steps

1. **Configure app.json**:
```json
{
  "expo": {
    "android": {
      "package": "com.yourcompany.zynk",
      "versionCode": 1
    }
  }
}
```

2. **Build for Android**:
```bash
cd zynk-user-app

# Build APK/AAB
eas build --platform android
```

3. **Submit to Play Store**:
```bash
eas submit --platform android
```

4. **Play Console**:
   - Go to [play.google.com/console](https://play.google.com/console)
   - Create new app
   - Upload AAB file
   - Fill in store listing
   - Submit for review

---

## 🚗 Driver App Deployment

### iOS App Store

```bash
cd zynk-driver-app

# Build for iOS
eas build --platform ios

# Submit
eas submit --platform ios
```

### Android Play Store

```bash
cd zynk-driver-app

# Build for Android
eas build --platform android

# Submit
eas submit --platform android
```

---

## 🗄️ Database (Supabase)

### Production Setup

1. **Upgrade Supabase Plan** (if needed):
   - Free tier: Good for testing
   - Pro tier: $25/month for production

2. **Enable Backups**:
   - Go to Database → Backups
   - Enable daily backups

3. **Set Up Monitoring**:
   - Enable database metrics
   - Set up alerts for high usage

4. **Security Checklist**:
   - ✅ RLS policies enabled
   - ✅ API keys secured
   - ✅ CORS configured
   - ✅ Rate limiting enabled

---

## 🔐 Environment Variables

### Admin Panel (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

### User App (.env)
```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaxxx...
```

### Driver App (.env)
```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaxxx...
```

---

## 🌍 Custom Domain Setup

### Admin Panel (Vercel)

1. Go to Vercel project settings
2. Click "Domains"
3. Add your domain: `admin.zynk.com`
4. Update DNS records:
   ```
   Type: CNAME
   Name: admin
   Value: cname.vercel-dns.com
   ```

### Mobile Apps

- iOS: Configure in App Store Connect
- Android: Configure in Play Console

---

## 📊 Monitoring & Analytics

### Vercel Analytics

```bash
# Install Vercel Analytics
npm install @vercel/analytics

# Add to layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Expo Analytics

```bash
# Install Expo Analytics
npx expo install expo-analytics

# Configure in app
import * as Analytics from 'expo-analytics'
```

---

## 🔄 CI/CD Setup

### GitHub Actions (Admin Panel)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### EAS Build (Mobile Apps)

Create `eas.json`:

```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "buildConfiguration": "Release"
      }
    }
  }
}
```

---

## 🚀 Performance Optimization

### Admin Panel

1. **Enable Vercel Edge Functions**
2. **Configure caching**:
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['your-supabase-url.supabase.co'],
  },
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=3600',
        },
      ],
    },
  ],
}
```

### Mobile Apps

1. **Enable Hermes** (Android):
```json
{
  "expo": {
    "android": {
      "enableHermes": true
    }
  }
}
```

2. **Optimize images**:
```bash
npm install expo-image
```

---

## 📱 Push Notifications Setup

### Firebase Cloud Messaging

1. **Create Firebase Project**:
   - Go to [console.firebase.google.com](https://console.firebase.google.com)
   - Create new project

2. **Add Apps**:
   - Add iOS app
   - Add Android app
   - Download config files

3. **Configure Expo**:
```json
{
  "expo": {
    "android": {
      "googleServicesFile": "./google-services.json"
    },
    "ios": {
      "googleServicesFile": "./GoogleService-Info.plist"
    }
  }
}
```

---

## 🔒 Security Checklist

### Before Going Live

- [ ] All API keys in environment variables
- [ ] RLS policies tested
- [ ] HTTPS enabled everywhere
- [ ] Rate limiting configured
- [ ] Error logging set up
- [ ] Backup strategy in place
- [ ] Security headers configured
- [ ] CORS properly configured
- [ ] Input validation on all forms
- [ ] SQL injection prevention verified

---

## 📈 Scaling Considerations

### Database
- Enable connection pooling
- Set up read replicas
- Implement caching (Redis)
- Monitor query performance

### API
- Implement rate limiting
- Use CDN for static assets
- Enable gzip compression
- Optimize database queries

### Mobile Apps
- Implement offline mode
- Cache API responses
- Lazy load images
- Optimize bundle size

---

## 💰 Cost Estimation

### Monthly Costs (Estimated)

**Supabase**:
- Free tier: $0 (up to 500MB database)
- Pro tier: $25/month

**Vercel**:
- Hobby: $0 (personal projects)
- Pro: $20/month (commercial)

**App Stores**:
- Apple: $99/year
- Google: $25 one-time

**Optional Services**:
- Firebase: $0-25/month
- Google Maps API: $0-200/month
- SendGrid: $0-15/month

**Total**: ~$50-100/month for production

---

## 🆘 Troubleshooting

### Build Failures

**Issue**: "Module not found"
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue**: "Environment variables not found"
- Check `.env` file exists
- Verify variable names match
- Restart development server

### Deployment Issues

**Issue**: "Vercel deployment failed"
- Check build logs
- Verify environment variables
- Test build locally: `npm run build`

**Issue**: "EAS build failed"
- Check `eas.json` configuration
- Verify credentials
- Check build logs: `eas build:list`

---

## 📞 Support Resources

- **Vercel**: [vercel.com/support](https://vercel.com/support)
- **Expo**: [expo.dev/support](https://expo.dev/support)
- **Supabase**: [supabase.com/support](https://supabase.com/support)

---

## ✅ Post-Deployment Checklist

- [ ] Admin panel accessible
- [ ] User app on App Store
- [ ] User app on Play Store
- [ ] Driver app on App Store
- [ ] Driver app on Play Store
- [ ] Database backups enabled
- [ ] Monitoring set up
- [ ] Analytics configured
- [ ] Push notifications working
- [ ] Payment gateway tested
- [ ] Error tracking enabled
- [ ] Performance monitoring active

---

**Your Zynk Quick Commerce platform is now live! 🎉**
