# Cloudflare Configuration Verification

This document provides comprehensive instructions for verifying your Cloudflare configuration and worker functions for Kedster's Static Cyber Tools.

## 🚀 Quick Start

Run the complete verification suite:
```bash
npm run verify
```

## 📋 Verification Categories

### 1. DNS & Routing Configuration (`npm run verify:dns`)

**What it checks:**
- Domain nameserver configuration pointing to Cloudflare
- DNS resolution for your domain
- Cloudflare proxying status

**Commands executed:**
```bash
dig NS kedster.com +short
nslookup cybertools.kedster.com
```

**Expected results:**
- ✅ Nameservers contain "cloudflare.com"
- ✅ Domain resolves successfully

### 2. Worker Deployment (`npm run verify:worker`)

**What it checks:**
- Wrangler CLI authentication status
- Worker deployment history
- Worker functionality and response headers

**Commands executed:**
```bash
npx wrangler whoami
npx wrangler deployments list --json
```

**Expected results:**
- ✅ Successfully authenticated with Wrangler
- ✅ Deployment history accessible
- ✅ Worker responds with expected content
- ✅ CF-Worker headers present

### 3. Homepage Availability (`npm run verify:homepage`)

**What it checks:**
- Homepage accessibility via HTTPS
- Cloudflare header presence
- Response status and content

**Tests performed:**
```bash
curl -I https://cybertools.kedster.com
curl -H "User-Agent: Kedster-Cloudflare-Verifier/1.0" https://cybertools.kedster.com
```

**Expected results:**
- ✅ HTTP 200 response
- ✅ Cloudflare headers detected
- ✅ Expected content served

### 4. Integration Requirements

**What it checks:**
- Environment variables configuration in wrangler.toml
- Authentication integration code presence
- Google SSO/Stripe configuration readiness

**Expected results:**
- ✅ Environment variables configured (if needed)
- ✅ Auth integration code detected (if implemented)

## 🔧 Troubleshooting Commands

### Manual Verification Steps

1. **Check DNS Configuration:**
   ```bash
   # Verify nameservers
   dig yourdomain.com NS +short
   
   # Check domain resolution
   nslookup cybertools.kedster.com
   ```

2. **Verify Worker Deployment:**
   ```bash
   # Check authentication
   npx wrangler whoami
   
   # List deployments
   npx wrangler deployments list
   
   # Test worker locally
   npx wrangler dev
   ```

3. **Test Homepage:**
   ```bash
   # Check headers
   curl -I https://cybertools.kedster.com
   
   # Test worker functionality
   curl -v https://cybertools.kedster.com/api/health
   ```

4. **Cloudflare Dashboard Checks:**
   - DNS tab: Confirm orange cloud ☁️ enabled for routes
   - Workers & Routes: Verify worker assigned to correct route
   - Pages → Deployments: Check latest build is active (if using Pages)

## 📊 API Endpoints for Testing

Your worker includes these API endpoints for verification:

- **Health Check:** `GET /api/health`
  - Returns worker status and basic information
  
- **Worker Info:** `GET /api/worker-info`
  - Returns detailed worker configuration and capabilities

Example usage:
```bash
curl https://cybertools.kedster.com/api/health | jq
curl https://cybertools.kedster.com/api/worker-info | jq
```

## 🔍 Expected Headers

When your worker is properly configured, responses should include:
```
X-Powered-By: Cloudflare Workers
CF-Worker: kedsters-static-cyber-tools
X-Worker-Version: 1.0.0
Server: Cloudflare
```

## ⚠️ Common Issues & Solutions

### 1. DNS Not Pointing to Cloudflare
**Problem:** `dig NS yourdomain.com` doesn't show Cloudflare nameservers

**Solution:**
1. Update nameservers at your domain registrar to Cloudflare's
2. Wait for DNS propagation (up to 48 hours)

### 2. Worker Authentication Failed
**Problem:** `npx wrangler whoami` returns authentication error

**Solution:**
```bash
npx wrangler login
# Follow the browser authentication flow
```

### 3. Worker Not Responding
**Problem:** Homepage returns errors or wrong content

**Solutions:**
1. Check worker deployment: `npx wrangler deployments list`
2. Verify routes in Cloudflare Dashboard → Workers & Routes
3. Redeploy worker: `npm run deploy`

### 4. Mixed Content Issues
**Problem:** Some assets load over HTTP instead of HTTPS

**Solution:**
1. Ensure all URLs in your code use HTTPS or protocol-relative URLs
2. Check Cloudflare SSL/TLS settings (Full or Full Strict)

### 5. Environment Variables Missing
**Problem:** Integration features not working

**Solution:**
1. Add variables to `wrangler.toml`:
   ```toml
   [env.production.vars]
   GOOGLE_CLIENT_ID = "your-client-id"
   
   [env.production.secrets]
   # Use: wrangler secret put STRIPE_SECRET_KEY
   ```
2. Deploy with: `npx wrangler deploy`

## 🎯 Success Criteria

Your Cloudflare configuration is properly set up when:

- ✅ DNS points to Cloudflare nameservers
- ✅ Domain resolves correctly
- ✅ Worker is deployed and authenticated
- ✅ Homepage is accessible via HTTPS
- ✅ Worker headers are present in responses
- ✅ API endpoints respond correctly
- ✅ No mixed routing conflicts
- ✅ Environment variables configured (if needed)

## 📞 Getting Help

If you encounter issues:

1. Run the troubleshoot command: `npm run troubleshoot`
2. Check the [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
3. Review [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
4. Check the repository issues for similar problems

## 🔄 Continuous Monitoring

Consider setting up monitoring for:
- Worker uptime and response times
- DNS resolution consistency
- SSL certificate expiration
- API endpoint availability

You can use the verification script in CI/CD pipelines or as a health check.