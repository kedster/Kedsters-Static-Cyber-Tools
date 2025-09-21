# 🛡️ CyberTools

Professional cybersecurity toolkit with 345+ tools: WHOIS lookup, DNS analysis, 2FA testing, API security, and more. Deployed on Cloudflare with unified directory structure for educational and professional use.

![Homepage Directory](https://github.com/user-attachments/assets/ed95cc8e-21d7-4ab5-876e-2427a34d6edd)

## 🚀 Quick Start

### 1. Access the Live Directory
Visit the main directory at your deployed URL to browse all available tools:
- Production-ready tools for professional use
- Development tools for testing and learning
- Comprehensive tool search and filtering

### 2. Example Tool Usage

#### WHOIS Lookup Tool
Professional domain analysis with RDAP support:
```bash
# Navigate to: /Prod/WHOIS Lookup Tool/index.html
# Enter domain: google.com
# Get comprehensive domain information including:
# - Registration details
# - DNS records
# - RDAP data
# - Security analysis
```

#### 2FA Code Brute-Force Demo
Educational TOTP attack simulation:
```bash
# Navigate to: /Prod/2FA Code Brute-Force Demo (Time-based)/index.html
# Generate TOTP codes
# Simulate various attack scenarios
# Learn about 2FA security implications
```

#### API Security Tester
Comprehensive REST API vulnerability testing:
```bash
# Navigate to: /Prod/API security tester/index.html
# Test 11 vulnerability categories
# Automated risk scoring
# Multi-authentication support
```

### 3. Local Development
```bash
# Clone and start local server
git clone <repository-url>
cd Kedsters-Static-Cyber-Tools
python3 -m http.server 8000

# Access at http://localhost:8000
```

## 🛡️ Directory Structure

### Single Operational Site Architecture
```
/
├── index.html              # Main directory landing page
├── Prod/                   # Production-ready tools (7 tools)
│   ├── WHOIS Lookup Tool/
│   ├── DNS poisoning checker/
│   ├── 2FA Code Brute-Force Demo (Time-based)/
│   ├── API security tester/
│   ├── ARP spoofing detector/
│   ├── Access Control Matrix Tester/
│   └── Access control matrix/
├── dev/                    # Development tools (338+ tools)
│   ├── Account lockout tracker/
│   ├── Acunetix/
│   ├── Aircrack-ng/
│   └── ... (335+ more tools)
├── shared/                 # Shared resources
├── src/                    # Cloudflare Worker source
├── scripts/                # Deployment and verification scripts
└── styles.css             # Global styling
```

### Tools Available

#### 🚀 Production Ready (7 tools)
Professional tools ready for enterprise use:

- **WHOIS Lookup Tool**: Multi-API domain information with RDAP support
- **DNS Poisoning Checker**: Advanced DNS analysis and anomaly detection  
- **2FA Code Brute-Force Demo**: TOTP security testing with real-time simulation
- **API Security Tester**: 11 test categories with comprehensive vulnerability detection
- **ARP Spoofing Detector**: Real-time network monitoring with attack simulation
- **Access Control Matrix Tester**: Role-based permission testing environment
- **Access Control Matrix Manager**: Visual RBAC management with export/import

#### 🔬 Development Tools (338+ tools)
Extensive cybersecurity toolkit covering:

- **Authentication**: OAuth, SAML, JWT, 2FA, session management
- **Network Security**: DNS, ARP, packet analysis, traffic monitoring
- **Web Security**: XSS, CSRF, SQL injection, API testing
- **Analysis**: Forensics, threat hunting, log correlation
- **Testing**: Vulnerability scanning, penetration testing, exploit frameworks

## 🚀 Deployment Architecture

### Cloudflare Workers + Pages Setup
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Cloudflare    │    │   Cloudflare     │    │   Tool Pages    │
│     Worker      │───▶│     Pages        │───▶│   (Static)      │
│  (API + Router) │    │  (Static Assets) │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

#### Cloudflare Pages (Static Content)
- All individual tool HTML/CSS/JS files
- Global CDN distribution
- Lightning-fast tool loading

#### Cloudflare Worker (Dynamic Layer)
- Main directory page generation
- Tool verification and health checks
- API endpoints for tool management
- Intelligent routing and fallbacks

## 📸 Screenshots

### Main Directory Homepage
The unified directory provides easy access to all tools with search and filtering capabilities.

### WHOIS Lookup Tool Example
![WHOIS Tool](https://github.com/user-attachments/assets/ed95cc8e-21d7-4ab5-876e-2427a34d6edd)

*Professional domain analysis interface with clean, intuitive design*

## 💻 Development Guide

### Local Development Setup
```bash
# Start development server
python3 -m http.server 8000

# With live reload (if you have Python packages)
python3 -m http.server 8000 --bind 127.0.0.1

# Access tools at:
# http://localhost:8000/                    # Main directory
# http://localhost:8000/Prod/WHOIS Lookup Tool/  # Individual tools
```

### Cloudflare Deployment
```bash
# Install Wrangler CLI
npm install -g wrangler

# Deploy Pages (static assets)
wrangler pages deploy . --project-name kedsters-tools

# Deploy Worker (dynamic layer)  
wrangler deploy src/index.js

# Verify deployment
npm run verify              # Full verification
npm run verify:dns          # DNS configuration
npm run verify:worker       # Worker deployment  
npm run verify:homepage     # Homepage availability
```

### Adding New Tools
```bash
# 1. Create tool structure
mkdir -p "dev/My New Tool"
cd "dev/My New Tool"

# 2. Create required files
touch index.html style.css script.js

# 3. Follow HTML template structure
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My New Tool</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="auth-placeholder">🔐 Google Authentication Ready</div>
    <h1>🔧 My New Tool</h1>
    <div class="tool-container">
        <!-- Tool interface here -->
    </div>
    <script src="script.js"></script>
</body>
</html>
EOF

# 4. Tools automatically appear in main directory
```

### Verification and Troubleshooting
```bash
# Full system verification
npm run verify

# Individual checks
npm run verify:dns          # Check DNS configuration
npm run verify:worker       # Verify worker deployment
npm run verify:homepage     # Test homepage accessibility
npm run troubleshoot        # Get troubleshooting checklist

# Local development debugging
npm run dev                 # Start local worker dev environment
```

## 🔧 Tool Usage Examples

### Network Analysis Workflow
```bash
# 1. Start with WHOIS lookup for domain intelligence
Navigate to: /Prod/WHOIS Lookup Tool/
Input: target-domain.com
Output: Registration details, DNS info, security insights

# 2. Check for DNS poisoning
Navigate to: /Prod/DNS poisoning checker/
Input: target-domain.com  
Output: Multi-server DNS analysis, anomaly detection

# 3. Monitor network for ARP attacks
Navigate to: /Prod/ARP spoofing detector/
Output: Real-time network monitoring, attack simulation
```

### API Security Testing Workflow
```bash
# 1. Comprehensive API security assessment
Navigate to: /Prod/API security tester/
Input: API endpoint and authentication
Output: 11-category vulnerability assessment with risk scoring

# 2. Test authentication mechanisms
Navigate to: /Prod/Access Control Matrix Tester/
Output: Role-based access control testing with permission validation
```

### Security Training Workflow
```bash
# 1. 2FA security demonstration
Navigate to: /Prod/2FA Code Brute-Force Demo (Time-based)/
Output: TOTP generation, attack simulation, educational insights

# 2. Access control management
Navigate to: /Prod/Access control matrix/
Output: Visual RBAC management with export/import capabilities
```

## 🛡️ Security & Ethics

⚠️ **Critical**: These tools are designed exclusively for:
- ✅ **Educational purposes** and cybersecurity learning
- ✅ **Authorized penetration testing** on systems you own
- ✅ **Security research** with proper authorization
- ✅ **Professional security assessments** with client permission

❌ **Never use these tools for**:
- Unauthorized access to systems
- Malicious activities or attacks
- Testing systems without explicit permission
- Any illegal or unethical purposes

### Responsible Use Guidelines
```
1. Always obtain written authorization before testing
2. Respect system boundaries and limitations
3. Report vulnerabilities through proper channels
4. Follow applicable laws and regulations
5. Use tools for defensive security purposes
```

## 📋 Tool Categories

### 🔐 Authentication & Access Control
- 2FA/MFA testing and simulation tools
- OAuth, SAML, JWT token analysis
- Session management and hijacking demos
- Role-based access control testing
- Permission auditing and validation

### 🌐 Network Security
- DNS analysis and poisoning detection
- ARP spoofing detection and prevention
- Network packet analysis tools
- Traffic monitoring and visualization
- Port scanning and network discovery

### 🕸️ Web Application Security
- XSS payload testing and prevention
- CSRF token analysis and testing
- SQL injection detection tools
- API security assessment suites
- Web shell detection and analysis

### 🔍 Analysis & Forensics
- Digital forensics file analysis
- Log correlation and analysis
- Threat hunting dashboards
- Incident response tracking
- Evidence chain management

### 🧪 Testing & Simulation
- Vulnerability scanning interfaces
- Penetration testing planners
- Attack simulation environments
- Security awareness training tools
- Exploit development frameworks

## 📊 Statistics

| Category | Count | Status |
|----------|-------|--------|
| **Total Tools** | **345+** | Growing |
| Production Ready | 7 | Fully Operational |
| In Development | 338+ | Active Development |
| Tool Categories | 5 | Complete Coverage |
| Deployment Targets | 2 | Cloudflare Optimized |

---

## 🤝 Contributing

Contributions welcome! Please ensure all new tools follow the established patterns:
- Consistent HTML/CSS/JS structure
- Google Authentication placeholder integration  
- Responsive design principles
- Educational focus with ethical use guidelines

## 📄 License

Educational and professional use only. See individual tool licenses for specific terms.

---

**🛡️ Built for Security Professionals | 🎓 Educational Use | 🌐 Global CDN Delivery**