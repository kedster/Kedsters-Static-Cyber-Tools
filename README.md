# Kedster's Static Cyber Tools

This repository contains a comprehensive collection of cybersecurity tools and educational resources, organized in a unified directory structure for easy navigation and deployment.

## 🛡️ Directory Structure

### Single Operational Site
- **Main Directory**: Unified landing page (`/index.html`) that serves as the tool directory
- **Production Tools** (`/Prod/`): Fully operational, production-ready cybersecurity tools
- **Featured Development Tools** (`/dev/`): Advanced tools with comprehensive functionality 
- **Static Assets** (`/shared/`, `/styles.css`, `/script.js`): Shared resources and styling

### Tools Available

#### Production Ready (2 tools)
- **WHOIS Lookup Tool**: Domain information lookup with RDAP support
- **DNS Poisoning Checker**: Advanced DNS analysis and anomaly detection

#### Featured Development Tools (5 tools)
- **2FA Code Brute-Force Demo**: TOTP security demonstration with attack simulation
- **API Security Tester**: Comprehensive REST API security testing suite
- **ARP Spoofing Detector**: Network monitoring and attack detection
- **Access Control Matrix Tester**: Role-based access control testing environment
- **Access Control Matrix Manager**: Visual access control management system

#### Development Tools (300+ tools)
- Extensive collection of cybersecurity tools covering all major categories
- Authentication, Network Security, Web Security, Analysis, and Testing tools
- All tools follow consistent UI/UX patterns with Google Authentication integration

## 🚀 Deployment Architecture

### Cloudflare Workers + Pages Integration
- **Single Worker/Pages deployment** under one operational site
- **Unified routing** through `_routes.json` and `wrangler.toml` configuration
- **Consistent framing** across all tool pages
- **Automatic directory updates** when new tools are added

### Key Features
- 📁 **Directory-style homepage** with searchable, filterable tool catalog
- 🔐 **Google Authentication ready** across all tools
- 📱 **Responsive design** with mobile compatibility
- 🎨 **Professional UI/UX** with glassmorphism effects and gradient backgrounds
- 📊 **Real-time statistics** showing tool counts and categories
- 🔍 **Advanced search and filtering** by category and tool type

## 💻 Development

### Local Development
```bash
# Start local server
python3 -m http.server 8000

# Access the directory at http://localhost:8000
```

### Cloudflare Deployment
```bash
# Deploy to Cloudflare Pages
wrangler pages deploy

# Deploy Worker
wrangler deploy
```

### Adding New Tools
1. Create tool directory under `/dev/` or `/Prod/`
2. Follow the established HTML/CSS/JS structure
3. Tools automatically appear in the main directory
4. Include Google Authentication placeholder integration

## 🛡️ Security & Ethics

⚠️ **Important**: These tools are designed for:
- Educational purposes
- Authorized penetration testing
- Security research on systems you own or have explicit permission to test

**Always use responsibly and legally.**

## 📋 Tool Categories

- **Authentication**: 2FA, OAuth, session management tools
- **Network**: DNS, ARP, network monitoring and analysis
- **Web Security**: XSS, CSRF, API security testing tools  
- **Analysis**: Traffic analysis, forensics, threat hunting
- **Testing**: Vulnerability scanners, exploit frameworks

---

**Total Tools**: 345+ (and growing)
**Production Ready**: 2 tools
**Featured Development**: 5 tools
**In Development**: 338+ tools