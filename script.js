// CyberTools - Main Directory
// Main landing page with tool directory functionality

class ToolsDirectory {
    constructor() {
        this.tools = {
            production: [
                {
                    name: 'WHOIS Lookup Tool',
                    description: 'Comprehensive domain information lookup with RDAP support and detailed analysis.',
                    path: 'Prod/WHOIS Lookup Tool/index.html',
                    categories: ['network', 'analysis'],
                    features: 'Multi-API, Error handling, Professional UI'
                },
                {
                    name: 'DNS Poisoning Checker',
                    description: 'Advanced DNS analysis tool for detecting poisoning attacks and inconsistencies.',
                    path: 'Prod/DNS poisoning checker/index.html',
                    categories: ['network', 'analysis'],
                    features: 'Multi-server, Anomaly detection, Real-time monitoring'
                },
                {
                    name: '2FA Code Brute-Force Demo (Time-based)',
                    description: 'Educational TOTP brute force simulator with real-time code generation and multiple attack modes.',
                    path: 'Prod/2FA Code Brute-Force Demo (Time-based)/index.html',
                    categories: ['authentication', 'testing'],
                    features: 'TOTP generation, Attack simulation, Educational insights'
                },
                {
                    name: 'API Security Tester',
                    description: 'Comprehensive REST API security testing suite with vulnerability detection and reporting.',
                    path: 'Prod/API security tester/index.html',
                    categories: ['web', 'testing'],
                    features: '11 test categories, Multi-auth, Risk scoring'
                },
                {
                    name: 'ARP Spoofing Detector',
                    description: 'Network monitoring tool for detecting ARP spoofing attacks with real-time alerts.',
                    path: 'Prod/ARP spoofing detector/index.html',
                    categories: ['network', 'analysis'],
                    features: 'Real-time monitoring, Attack simulation, Vendor analysis'
                },
                {
                    name: 'Access Control Matrix Tester',
                    description: 'Role-based access control testing environment with client-side role mocking.',
                    path: 'Prod/Access Control Matrix Tester (Client Role Mocks)/index.html',
                    categories: ['authentication', 'testing'],
                    features: 'Role simulation, Permission testing, Security insights'
                },
                {
                    name: 'Access Control Matrix Manager',
                    description: 'Visual access control management system with role/resource CRUD operations.',
                    path: 'Prod/Access control matrix/index.html',
                    categories: ['authentication', 'analysis'],
                    features: 'Visual matrix, Export/Import, Validation tools'
                }
            ],
            featured: [
            ],
            development: []
        };
        
        this.filteredTools = [];
        this.currentFilter = 'all';
        this.searchTerm = '';
        
        this.init();
    }

    async init() {
        await this.loadDevelopmentTools();
        this.renderAllTools();
        this.updateStats();
        this.setupEventListeners();
        console.log('Tools Directory initialized');
    }

    async loadDevelopmentTools() {
        // Get all development tools from the dev directory structure
        const devTools = [
            // Add all the dev tools programmatically
            'Account lockout tracker', 'Acunetix', 'Aircrack-ng', 'Anomaly detection engine',
            'Anti-Debugging Detector (Frontend)', 'Asset inventory manager', 'Attack vector visualizer',
            'Auth Token Expiry Tester', 'AutoComplete Exploit Demo Page', 'Autopsy',
            'Backdoor scanner', 'Backup verification tool', 'Bandwidth monitor', 'Base64 Encoder_Decoder',
            'Bcrypt Hash Demo', 'Beef', 'Behavioral analysis tool', 'Bettercap',
            'Binary converter', 'Biometric data analyzer', 'Blind SQL injection tester', 'Blockchain hash validator',
            'BloodHound', 'Botnet detector', 'Browser Cache Poisoning Demonstrator', 'Browser Exploit Detection UI (Mockup)',
            'Browser Extension Vulnerability Demo', 'Browser Fingerprinting Tool', 'Browser Hooking Demo (e.g., via BeEF clone)',
            'Brute force attack simulator', 'Burp Suite', 'Business impact analyzer', 'CAPTCHA Generator (Security Test Tool)',
            'CDN analyzer', 'CORS Misconfiguration Tester', 'CRLF injection detector', 'CSP Bypass Tester (Nonce, Hash, Wildcard Checks)',
            'CSP Evaluator', 'CSRF Generator', 'CSRF Token Extractor (Mock App)', 'CSRF token generator',
            'CVE database searcher', 'Caesar cipher tool', 'Censys', 'Certificate Pinning Tester (Visual)',
            'Certificate Transparency Log Viewer', 'Certificate authority builder', 'ClamAV', 'Click Fraud Bot UI (Simulated)',
            'Click Map Heat Overlay for Phishing Targets', 'Click jacking tester', 'Clickjacking Demonstrator',
            'Clickjacking frame buster', 'Clipboard Injection Proof-of-Concept', 'Clipboard Monitor (Demo)',
            'Cobalt Strike', 'Code Injection Practice Tool', 'Code Linting for Vulnerabilities (Simulated UI)',
            'Code obfuscation detector', 'Command History Leak Demo (Simulated Shell History)', 'Command Injection Tester UI (No backend execution)',
            'Command injection simulator', 'Compliance checker (GDPR, HIPAA, PCI)', 'Content Injection Replay Generator',
            'Content Spoofing Tester', 'Cookie Injection_Overwrite Tester', 'Cookie Jar Viewer (All cookies by scope)',
            'Cookie Scope Analyzer (Secure_HttpOnly_Domain)', 'Cookie Stealer Demo', 'Cookie analyzer',
            'Cookie consent manager', 'Crackmapexec', 'Credential AutoFill Sniffer', 'Credential Exposure Checker (Simulated)',
            'Credential Stuffing Simulator', 'Cross-Origin Leak Analyzer', 'Cryptocurrency wallet checker', 'DDoS attack simulator',
            'DNS Lookup', 'DNS Rebinding Simulator', 'DNS Tunnel Visualizer (Simulated)', 'DNS lookup tool',
            'DOM Clobbering Demonstration', 'DOM Purity Checker', 'Dark web monitor simulator', 'Data Exfiltration via CSS Demo',
            'Data breach simulator', 'Deserialization vulnerability scanner', 'Dictionary attack tester', 'Digital Forensics File Analyzer',
            'Digital forensics timeline', 'Digital signature verifier', 'Dirb', 'Directory Traversal Payload Generator',
            'Directory traversal checker', 'Domain WHOIS checker', 'Drag-and-Drop Attack Simulations (Exfil UI)',
            'Email Header Analyzer', 'Email Spoofing Simulator UI', 'Email spoofing detector', 'Empire',
            'Encrypted Chat App (AES_WebCrypto)', 'Encryption strength tester', 'Ettercap', 'Evidence chain tracker',
            'Exploit Chain Visualizer', 'Exploit database browser', 'Fake Antivirus Scanner UI', 'Fake Captcha Bypass Simulator',
            'Fake Login Page Builder', 'Fake Payment Form for PCI Testing', 'Fake Ransomware Countdown Page',
            'Fake Security Alert Pop-up Generator', 'Fake Software License Cracker Page (Training Demo)', 'Fake Update Installer Page Generator (for SE training)',
            'File Upload Vulnerability Tester (Client-side checks)', 'File hash calculator', 'File integrity checker',
            'File upload validator', 'Firewall rule generator', 'Form Grabber (Simulated)', 'Gobuster',
            'GraphQL security scanner', 'HSTS Policy Checker', 'HTML Injection Tester', 'HTML sanitizer',
            'HTML5 File API Exploit Demo', 'HTML5 WebSocket Exploit Demo', 'HTML_JS Keylogger (Ethical Demonstration)',
            'HTTP Parameter Pollution Tester UI', 'HTTP header analyzer', 'HTTP response splitting checker', 'Hash Calculator (MD5, SHA1, SHA256)',
            'Hash generator (MD5, SHA1, SHA256)', 'Hashcat', 'Heap Spray Visualizer (Mockup)', 'Hex editor',
            'Hidden Form Field Exploit Simulator', 'Honeypot creator', 'Hydra', 'IOC (Indicators of Compromise) tracker',
            'IP Geolocation Viewer', 'IP geolocation lookup', 'Identity correlation tool', 'Incident response tracker',
            'Incident timeline builder', 'Input validation checker', 'Intrusion detection simulator', 'Invisible iframe Exploit Demo',
            'JS Execution Context Visualizer', 'JS Heap Usage Tracker (via DevTools or UI layer)', 'JS Obfuscation Tool',
            'JWT Decoder', 'JavaScript Crypto Miner UI (Simulated)', 'JavaScript Sandbox Escaper (Simulated)',
            'JavaScript deobfuscator', 'John the Ripper', 'Kerberos ticket analyzer', 'Key Exchange Demo (Diffie-Hellman)',
            'Key management simulator', 'Keylogger detector', 'Keystroke Visualizer', 'Kill chain mapper',
            'Kismet', 'LDAP filter injector', 'LDAP injection tester', 'Load balancer tester',
            'Local file inclusion tester', 'Local storage scanner', 'LocalStorage Exploit Demo', 'Log analyzer',
            'Log correlation engine', 'Lynis', 'MAC address changer', 'MITMf',
            'MITRE ATT&CK framework navigator', 'Malicious Link Previewer', 'Malicious Script Dropper Simulator', 'Maltego',
            'Malware signature scanner', 'Man-in-the-Browser Simulator', 'Masscan', 'Medusa',
            'Memory dump analyzer', 'Metadata Extractor (Client-side)', 'Metadata extractor', 'Metasploit',
            'Mimikatz', 'Multi-factor authentication tester', 'Nessus', 'Network Sniffer UI (Mockup)',
            'Network connection tracker', 'Network packet analyzer', 'Network subnet calculator', 'Network traffic visualizer',
            'Nikto', 'Nmap', 'NoSQL injection checker', 'OAuth token validator',
            'OAuth2 Authorization Code Flow Visualizer', 'OSSEC', 'OWASP ZAP', 'Open Port Spoofing UI',
            'Open Redirect Tester', 'OpenVAS', 'PKI validator', 'Packet Visualizer UI (Drag-n-Drop Builder)',
            'Passphrase generator', 'Password Dictionary Brute Force (Local Demo)', 'Password Strength Meter', 'Password generator',
            'Password policy enforcer', 'Password strength checker', 'Patch management tracker', 'Payload Encoder Wheel (e.g., JS → Hex → Base64 → URI)',
            'Payload Obfuscator', 'Penetration testing planner', 'Permission auditor', 'Phishing Site Template Loader',
            'Phishing detector', 'Ping Utility (Simulated)', 'Port Scanner (WebSocket based)', 'Port scanner simulator',
            'PowerSploit', 'Privacy policy analyzer', 'Privilege escalation detector', 'Process monitor',
            'QR Code Phishing Generator', 'QR Code with Embedded Exploit Payload Demo', 'QR code generator_scanner', 'Qualys VMDR',
            'REST API fuzzer', 'ROT13 encoder_decoder', 'Race condition tester', 'Rainbow table generator',
            'Random Exploit Generator for CTFs', 'Rapid7 InsightVM', 'Recon-ng', 'Recovery time calculator',
            'Red Team Attack Chain Builder (Drag-n-Drop)', 'Reflected XSS Demo Page', 'Regex Tester', 'Regex pattern tester',
            'Registry key scanner', 'Remote file inclusion detector', 'Responder', 'Reverse DNS Lookup Viewer',
            'Reverse Shell Command Generator', 'Risk assessment calculator', 'Risk register tool', 'Rogue WiFi UI (Simulation)',
            'Rootkit analyzer', 'SAML Token Viewer', 'SAML assertion checker', 'SIEM event simulator',
            'SOAP service tester', 'SQL injection tester', 'SQLMap', 'SRI (Subresource Integrity) Hash Generator',
            'SSL Strip Simulator', 'SSL certificate analyzer', 'SSL_TLS Checker', 'SSLyze',
            'Script Injection Lab', 'Secure Code Review Training Tool (Frontend only)', 'Secure Input Field Tester (Masking, Paste Events)',
            'Security Headers Checker', 'Security Misconfiguration Simulator', 'Security Risk Score Calculator (based on input)',
            'Security audit reporter', 'Security awareness quiz', 'Security checklist generator', 'Security policy template generator',
            'Security scorecard generator', 'Self-XSS Training Tool', 'Server-side template injection detector', 'Session Hijacking Simulator',
            'Session Token Sniffer', 'Session fixation tester', 'Session token validator', 'Shadow Credential Attack Simulation',
            'Shadow DOM Exploit Explorer', 'Shodan', 'Simulated Cross-Tab Communication Hijack', 'Simulated Exploit Kit Landing Page',
            'Simulated Firewall Rule Tester', 'Simulated Key Exchange Failure Injector', 'Simulated Malware Download Trigger',
            'Simulated Ransom Note Generator', 'Sleuth Kit', 'Smart contract analyzer', 'Snort',
            'Social Engineer Toolkit', 'Social Engineering Toolkit UI (Mockup)', 'Social engineering toolkit', 'Steganography detector',
            'Subdomain Finder (API-based)', 'Suricata', 'System baseline comparator', 'TLS Downgrade Attack Simulator',
            'Testssl.sh', 'Threat hunting dashboard', 'Threat intelligence aggregator', 'Threat modeling tool',
            'Time-based attack simulator', 'Timing Attack Simulator', 'Tor Exit Node Checker', 'Traceroute Visualizer',
            'Two-factor authentication simulator', 'Typosquatting Detector', 'UAC Bypass Exploit Flowchart Tool', 'URL Encoder_Decoder',
            'User behavior analyzer', 'User-Agent Analyzer', 'VigenÃ¨re cipher', 'Volatility',
            'Vulnerability assessment dashboard', 'Vulnerability scanner interface', 'Web Form Auto-Fill Extractor', 'Web Shell (JS Terminal Emulator)',
            'Web Worker Race Condition Demo', 'Web shell detector', 'WebAssembly Inspection Tool (View + Decode)',
            'WebRTC IP Leak Tester', 'WebSocket security analyzer', 'Webcam Access Attempt Demo', 'Wireshark',
            'X-Powered-By Header Revealer', 'XML external entity tester', 'XPath injection tester', 'XSS Payload Tester',
            'XSS Polyglot Generator', 'XSS payload generator', 'YARA', 'Zero-Day Tracking Dashboard (Static Feed)',
            'Zip Bomb Generator (Frontend Archive API)', 'Zmap', 'theHarvester'
        ];

        // Categorize development tools
        this.tools.development = devTools.map(toolName => ({
            name: toolName,
            description: `${toolName} - Cybersecurity tool for specialized security testing and analysis.`,
            path: `dev/${toolName}/index.html`,
            categories: this.categorizeToolByName(toolName),
            features: 'In Development'
        }));
    }

    categorizeToolByName(toolName) {
        const categories = [];
        const name = toolName.toLowerCase();
        
        if (name.includes('auth') || name.includes('2fa') || name.includes('login') || 
            name.includes('token') || name.includes('oauth') || name.includes('saml') ||
            name.includes('access control') || name.includes('permission')) {
            categories.push('authentication');
        }
        
        if (name.includes('network') || name.includes('dns') || name.includes('arp') || 
            name.includes('ping') || name.includes('port') || name.includes('ip') ||
            name.includes('subnet') || name.includes('wifi') || name.includes('bluetooth')) {
            categories.push('network');
        }
        
        if (name.includes('web') || name.includes('http') || name.includes('html') || 
            name.includes('javascript') || name.includes('xss') || name.includes('sql') ||
            name.includes('api') || name.includes('cors') || name.includes('csrf')) {
            categories.push('web');
        }
        
        if (name.includes('test') || name.includes('scanner') || name.includes('fuzzer') || 
            name.includes('exploit') || name.includes('vulnerability') || name.includes('penetration')) {
            categories.push('testing');
        }
        
        if (name.includes('analyzer') || name.includes('monitor') || name.includes('detector') || 
            name.includes('checker') || name.includes('forensic') || name.includes('audit')) {
            categories.push('analysis');
        }
        
        return categories.length > 0 ? categories : ['general'];
    }

    renderAllTools() {
        this.renderToolsSection('productionTools', this.tools.production, 'production');
        this.renderToolsSection('featuredTools', this.tools.featured, 'featured');
        this.renderToolsSection('devTools', this.tools.development, 'development');
    }

    renderToolsSection(containerId, tools, type) {
        const container = document.getElementById(containerId);
        
        // Apply filters if needed
        let filteredTools = tools;
        if (this.currentFilter !== 'all' && type === 'development') {
            filteredTools = tools.filter(tool => 
                tool.categories.includes(this.currentFilter)
            );
        }
        
        if (this.searchTerm && type === 'development') {
            filteredTools = filteredTools.filter(tool =>
                tool.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                tool.description.toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        }

        if (filteredTools.length === 0 && type === 'development') {
            container.innerHTML = '<div class="no-results">No tools found matching your criteria.</div>';
            return;
        }

        container.innerHTML = filteredTools.map(tool => 
            this.createToolCard(tool, type)
        ).join('');
    }

    createToolCard(tool, type) {
        const categories = tool.categories.map(cat => 
            `<span class="tool-category">${cat}</span>`
        ).join('');

        return `
            <div class="tool-card ${type}" onclick="navigateToTool('${tool.path}')">
                <div class="tool-header">
                    <div>
                        <div class="tool-title">${tool.name}</div>
                    </div>
                    <div class="tool-status ${type}">${type}</div>
                </div>
                <div class="tool-description">${tool.description}</div>
                <div class="tool-categories">${categories}</div>
                <div class="tool-footer">
                    <a href="${tool.path}" class="tool-link" onclick="event.stopPropagation()">Open Tool</a>
                    <div class="tool-features">${tool.features}</div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchTerm = e.target.value;
            this.renderToolsSection('devTools', this.tools.development, 'development');
        });

        // Filter functionality
        document.querySelectorAll('.filter-tag').forEach(tag => {
            tag.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.category;
                this.renderToolsSection('devTools', this.tools.development, 'development');
            });
        });
    }

    updateStats() {
        document.getElementById('totalTools').textContent = 
            this.tools.production.length + this.tools.featured.length + this.tools.development.length;
        document.getElementById('productionCount').textContent = this.tools.production.length;
        document.getElementById('devCount').textContent = 
            this.tools.featured.length + this.tools.development.length;
    }
}

// Global functions
function navigateToTool(path) {
    window.location.href = path;
}

// Initialize the directory
document.addEventListener('DOMContentLoaded', () => {
    new ToolsDirectory();
});

console.log('Kedster\'s Static Cyber Tools Directory loaded');