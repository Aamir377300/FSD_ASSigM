# Deployment Guide

Complete guide to deploy your Notes & Bookmarks Manager to production.

## Overview

This application has two parts that need to be deployed separately:
- **Backend**: Node.js/Express API → Deploy to Railway/Render/Heroku
- **Frontend**: Next.js app → Deploy to Vercel

## Prerequisites

- GitHub account
- Vercel account (for frontend)
- Railway/Render account (for backend)
- MongoDB Atlas account (for database)

---

## Step 1: Setup MongoDB Atlas

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "Free" tier
   - Select a region close to you
   - Click "Create Cluster"

3. **Create Database User**
   - Security → Database Access
   - Add New Database User
   - Username: `admin`
   - Password: (generate strong password)
   - Save credentials

4. **Whitelist IP**
   - Security → Network Access
   - Add IP Address
   - Allow Access from Anywhere: `0.0.0.0/0`
   - Confirm

5. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your password
   - Example: `mongodb+srv://admin:password@cluster0.xxxxx.mongodb.net/notes-bookmarks`

---

## Step 2: Deploy Backend

### Option A: Railway (Recommended - Easiest)

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login**
   ```bash
   railway login
   ```

3. **Deploy Backend**
   ```bash
   cd backend
   railway init
   railway up
   ```

4. **Add Environment Variables**
   ```bash
   railway variables set MONGODB_URI="your_mongodb_atlas_uri"
   railway variables set JWT_SECRET="your_secret_key"
   railway variables set NODE_ENV="production"
   railway variables set PORT="5000"
   ```

5. **Get Backend URL**
   ```bash
   railway domain
   ```
   Save this URL (e.g., `https://your-app.railway.app`)

### Option B: Render

1. **Go to Render Dashboard**
   - https://render.com
   - Sign up/Login

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Or use "Deploy from Git URL"

3. **Configure Service**
   - Name: `notes-bookmarks-backend`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Add Environment Variables**
   ```
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_secret_key
   NODE_ENV=production
   PORT=5000
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment
   - Copy your backend URL

### Option C: Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login**
   ```bash
   heroku login
   ```

3. **Create App**
   ```bash
   cd backend
   heroku create your-app-name
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set MONGODB_URI="your_mongodb_atlas_uri"
   heroku config:set JWT_SECRET="your_secret_key"
   heroku config:set NODE_ENV="production"
   ```

5. **Deploy**
   ```bash
   git init
   git add .
   git commit -m "Deploy backend"
   git push heroku main
   ```

---

## Step 3: Deploy Frontend to Vercel

### Method 1: Vercel Dashboard (Easiest)

1. **Go to Vercel**
   - https://vercel.com
   - Sign up/Login with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import your GitHub repository

3. **Configure Project**
   - Framework Preset: **Next.js**
   - Root Directory: **frontend**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Add Environment Variable**
   - Click "Environment Variables"
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://your-backend-url.railway.app/api`
   - (Use your actual backend URL from Step 2)

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment
   - Your app will be live at `https://your-app.vercel.app`

### Method 2: Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd frontend
   vercel
   ```

4. **Follow Prompts**
   - Set up and deploy? Yes
   - Which scope? (your account)
   - Link to existing project? No
   - Project name? (enter name)
   - Directory? `./`
   - Override settings? No

5. **Add Environment Variable**
   ```bash
   vercel env add NEXT_PUBLIC_API_URL
   # Enter your backend URL when prompted
   ```

6. **Redeploy**
   ```bash
   vercel --prod
   ```

---

## Step 4: Update Backend CORS

After deploying frontend, update your backend to allow requests from your Vercel domain:

<function_calls>
<invoke name="readFile">
<parameter name="path">backend/server.js


Update `backend/server.js` to configure CORS for production:

```javascript
// Replace this line:
app.use(cors());

// With this:
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-app.vercel.app'  // Your Vercel URL
    : 'http://localhost:3000',
  credentials: true
};
app.use(cors(corsOptions));
```

Or allow multiple origins:

```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'https://your-app.vercel.app',
  'https://your-custom-domain.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};
app.use(cors(corsOptions));
```

Then redeploy your backend.

---

## Step 5: Test Your Deployment

1. **Visit Your Frontend URL**
   - https://your-app.vercel.app

2. **Register a New Account**
   - Test the registration flow

3. **Create Notes and Bookmarks**
   - Verify all CRUD operations work

4. **Test Search and Filtering**
   - Make sure search works

---

## Troubleshooting

### Frontend Can't Connect to Backend

**Problem**: CORS errors or network errors

**Solution**:
1. Check `NEXT_PUBLIC_API_URL` in Vercel environment variables
2. Make sure it includes `/api` at the end
3. Verify backend CORS settings allow your Vercel domain
4. Check backend is running (visit backend URL in browser)

### Backend Crashes on Startup

**Problem**: Application error on Railway/Render

**Solution**:
1. Check environment variables are set correctly
2. Verify MongoDB connection string is correct
3. Check logs: `railway logs` or in Render dashboard
4. Make sure `NODE_ENV=production`

### MongoDB Connection Failed

**Problem**: Can't connect to MongoDB Atlas

**Solution**:
1. Check connection string has correct password
2. Verify IP whitelist includes `0.0.0.0/0`
3. Make sure database user has read/write permissions
4. Test connection string locally first

### Vercel Build Fails

**Problem**: Build errors during deployment

**Solution**:
1. Make sure Root Directory is set to `frontend`
2. Check `jsconfig.json` exists in frontend folder
3. Verify all dependencies are in `package.json`
4. Clear Vercel cache and redeploy

---

## Environment Variables Summary

### Backend (Railway/Render/Heroku)
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/notes-bookmarks
JWT_SECRET=your_super_secret_random_string_here
NODE_ENV=production
PORT=5000
```

### Frontend (Vercel)
```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
```

---

## Post-Deployment Checklist

- [ ] Backend is running and accessible
- [ ] Frontend is deployed and accessible
- [ ] MongoDB Atlas is connected
- [ ] Can register new users
- [ ] Can login
- [ ] Can create notes
- [ ] Can create bookmarks
- [ ] Search works
- [ ] Tag filtering works
- [ ] CORS is configured correctly
- [ ] Environment variables are set
- [ ] HTTPS is working

---

## Custom Domain (Optional)

### Add Custom Domain to Vercel

1. Go to your project in Vercel
2. Settings → Domains
3. Add your domain
4. Follow DNS configuration instructions

### Add Custom Domain to Railway

1. Go to your project in Railway
2. Settings → Domains
3. Add custom domain
4. Update DNS records

---

## Monitoring and Logs

### View Backend Logs

**Railway:**
```bash
railway logs
```

**Render:**
- Dashboard → Your Service → Logs

**Heroku:**
```bash
heroku logs --tail
```

### View Frontend Logs

**Vercel:**
- Dashboard → Your Project → Deployments → View Function Logs

---

## Updating Your Deployment

### Update Backend
```bash
cd backend
git add .
git commit -m "Update backend"
git push
# Railway/Render will auto-deploy
```

### Update Frontend
```bash
cd frontend
git add .
git commit -m "Update frontend"
git push
# Vercel will auto-deploy
```

---

## Cost Estimate

All services have free tiers:

- **MongoDB Atlas**: Free (512MB storage)
- **Railway**: Free ($5 credit/month)
- **Render**: Free (limited hours)
- **Heroku**: Free tier discontinued (use Railway/Render)
- **Vercel**: Free (unlimited deployments)

**Total Cost**: $0/month for hobby projects

---

## Security Recommendations

1. **Use Strong JWT Secret**
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

2. **Enable HTTPS Only**
   - All platforms provide HTTPS by default

3. **Restrict CORS**
   - Only allow your frontend domain

4. **Use Environment Variables**
   - Never commit secrets to Git

5. **Regular Updates**
   - Keep dependencies updated
   - Monitor security advisories

---

## Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Render Docs**: https://render.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com

---

**Your app is now live! 🎉**
