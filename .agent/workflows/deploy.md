---
description: Deploy the application to Vercel production
---
1. **Login to Vercel (if not already)**:
   ```bash
   vercel login
   ```

2. **Set up Environment Variables**:
   You must add the following variables to Vercel for the API routes and frontend to work. Use the production values from your `.env` file.
   
   **Frontend Variables**:
   ```bash
   vercel env add VITE_STORE_URL production
   vercel env add VITE_GOOGLE_SCRIPT_URL production
   ```

   **Backend Variables (Secure)**:
   ```bash
   vercel env add AZURE_OPENAI_ENDPOINT production
   vercel env add AZURE_OPENAI_API_KEY production
   vercel env add AZURE_OPENAI_DEPLOYMENT production
   vercel env add AZURE_WHISPER_ENDPOINT production
   vercel env add AZURE_WHISPER_KEY production
   vercel env add AZURE_WHISPER_DEPLOYMENT production
   ```

3. **Deploy to Production**:
   Run the following command to build and deploy to the production environment:
   ```bash
   vercel --prod
   ```

4. **Verify Deployment**:
   Open the production URL provided by the CLI and verify that:
   - Voice assessment works (Azure APIs are connected).
   - The contact form works ($VITE_GOOGLE_SCRIPT_URL).
   - Routing and UI look correct.
