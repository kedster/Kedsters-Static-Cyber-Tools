// API Security Tester
// Comprehensive REST API security testing tool

class APISecurityTester {
    constructor() {
        this.isRunning = false;
        this.testResults = [];
        this.vulnerabilities = [];
        this.stats = {
            testsRun: 0,
            vulnerabilitiesFound: 0,
            riskScore: 0,
            startTime: null
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDemoData();
        console.log('API Security Tester initialized');
    }

    setupEventListeners() {
        // Authentication type change handler
        document.getElementById('authType').addEventListener('change', (e) => {
            this.toggleAuthDetails(e.target.value);
        });

        // HTTP method change handler
        document.getElementById('httpMethod').addEventListener('change', (e) => {
            this.toggleBodyField(e.target.value);
        });
    }

    // Toggle authentication details based on type
    toggleAuthDetails(authType) {
        const authDetails = document.getElementById('authDetails');
        const authLabel = document.getElementById('authLabel');
        const authValue = document.getElementById('authValue');

        if (authType === 'none') {
            authDetails.style.display = 'none';
        } else {
            authDetails.style.display = 'block';
            
            switch (authType) {
                case 'bearer':
                    authLabel.textContent = 'Bearer Token:';
                    authValue.placeholder = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
                    break;
                case 'apikey':
                    authLabel.textContent = 'API Key:';
                    authValue.placeholder = 'your-api-key-here';
                    break;
                case 'basic':
                    authLabel.textContent = 'Username:Password:';
                    authValue.placeholder = 'username:password';
                    break;
                case 'oauth':
                    authLabel.textContent = 'OAuth Token (Placeholder):';
                    authValue.placeholder = 'OAuth integration coming soon...';
                    break;
            }
        }
    }

    // Toggle request body field based on HTTP method
    toggleBodyField(method) {
        const bodyField = document.getElementById('requestBody').parentElement;
        if (['GET', 'HEAD', 'DELETE', 'OPTIONS'].includes(method)) {
            bodyField.style.display = 'none';
        } else {
            bodyField.style.display = 'block';
        }
    }

    // Load demo API for testing
    loadDemoData() {
        document.getElementById('apiUrl').value = 'https://jsonplaceholder.typicode.com/posts/1';
        document.getElementById('customHeaders').value = JSON.stringify({
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest"
        }, null, 2);
    }

    // Load demo API button handler
    loadTestAPI() {
        this.loadDemoData();
        this.logMessage('Demo API endpoint loaded: JSONPlaceholder', 'info');
    }

    // Start security tests
    async startSecurityTests() {
        const apiUrl = document.getElementById('apiUrl').value.trim();
        if (!apiUrl) {
            alert('Please enter an API endpoint URL');
            return;
        }

        this.isRunning = true;
        this.stats = {
            testsRun: 0,
            vulnerabilitiesFound: 0,
            riskScore: 0,
            startTime: Date.now()
        };
        this.testResults = [];
        this.vulnerabilities = [];

        document.getElementById('startTests').disabled = true;
        document.getElementById('stopTests').disabled = false;

        // Get selected tests
        const selectedTests = Array.from(document.querySelectorAll('input[data-test]:checked'))
            .map(cb => cb.dataset.test);

        this.logMessage(`Starting API security assessment on: ${apiUrl}`, 'info');
        this.logMessage(`Selected tests: ${selectedTests.join(', ')}`, 'info');

        // Clear previous results
        document.getElementById('reportContent').innerHTML = 'Running security tests...';

        // Run tests sequentially
        for (const testType of selectedTests) {
            if (!this.isRunning) break;
            
            await this.runSecurityTest(testType, apiUrl);
            await this.delay(500); // Brief pause between tests
        }

        this.completeAssessment();
    }

    // Stop security tests
    stopSecurityTests() {
        this.isRunning = false;
        document.getElementById('startTests').disabled = false;
        document.getElementById('stopTests').disabled = true;
        
        this.logMessage('Security assessment stopped by user', 'warning');
        this.completeAssessment();
    }

    // Run individual security test
    async runSecurityTest(testType, apiUrl) {
        this.stats.testsRun++;
        this.updateStatsDisplay();

        try {
            switch (testType) {
                case 'info-disclosure':
                    await this.testInformationDisclosure(apiUrl);
                    break;
                case 'error-disclosure':
                    await this.testErrorDisclosure(apiUrl);
                    break;
                case 'debug-info':
                    await this.testDebugInformation(apiUrl);
                    break;
                case 'auth-bypass':
                    await this.testAuthenticationBypass(apiUrl);
                    break;
                case 'token-validation':
                    await this.testTokenValidation(apiUrl);
                    break;
                case 'privilege-escalation':
                    await this.testPrivilegeEscalation(apiUrl);
                    break;
                case 'sql-injection':
                    await this.testSQLInjection(apiUrl);
                    break;
                case 'nosql-injection':
                    await this.testNoSQLInjection(apiUrl);
                    break;
                case 'command-injection':
                    await this.testCommandInjection(apiUrl);
                    break;
                case 'rate-limiting':
                    await this.testRateLimiting(apiUrl);
                    break;
                case 'dos-resilience':
                    await this.testDoSResilience(apiUrl);
                    break;
                default:
                    this.logMessage(`Unknown test type: ${testType}`, 'error');
            }
        } catch (error) {
            this.logMessage(`Test ${testType} failed: ${error.message}`, 'error');
        }
    }

    // Test information disclosure via server headers
    async testInformationDisclosure(apiUrl) {
        this.logMessage('Testing: Information Disclosure via Headers', 'info');
        
        try {
            const response = await this.makeRequest(apiUrl, 'GET');
            const sensitiveHeaders = ['server', 'x-powered-by', 'x-aspnet-version', 'x-runtime'];
            const foundHeaders = [];

            sensitiveHeaders.forEach(header => {
                const value = response.headers.get(header);
                if (value) {
                    foundHeaders.push(`${header}: ${value}`);
                }
            });

            if (foundHeaders.length > 0) {
                this.addVulnerability(
                    'Information Disclosure via Server Headers',
                    'medium',
                    `Sensitive server information exposed: ${foundHeaders.join(', ')}`,
                    'Remove or obscure server identification headers'
                );
            } else {
                this.logMessage('✓ No sensitive headers found', 'success');
            }
        } catch (error) {
            this.logMessage(`Header analysis failed: ${error.message}`, 'warning');
        }
    }

    // Test error message disclosure
    async testErrorDisclosure(apiUrl) {
        this.logMessage('Testing: Error Message Disclosure', 'info');
        
        const testPaths = [
            '/../../../../etc/passwd',
            '/nonexistent-endpoint-12345',
            '/<script>alert(1)</script>',
            '/?id=\'"',
            '/admin/secret'
        ];

        for (const path of testPaths) {
            try {
                const testUrl = apiUrl + path;
                const response = await this.makeRequest(testUrl, 'GET');
                const responseText = await response.text();

                // Check for common error patterns that reveal too much information
                const dangerousPatterns = [
                    /stack trace/i,
                    /database error/i,
                    /sql error/i,
                    /exception/i,
                    /debug/i,
                    /file not found.*\/[a-z]/i
                ];

                dangerousPatterns.forEach(pattern => {
                    if (pattern.test(responseText)) {
                        this.addVulnerability(
                            'Verbose Error Messages',
                            'low',
                            `Error endpoint ${path} reveals internal information`,
                            'Implement generic error messages'
                        );
                    }
                });
            } catch (error) {
                // Expected for many test cases
            }
        }
    }

    // Test for debug information leakage
    async testDebugInformation(apiUrl) {
        this.logMessage('Testing: Debug Information Disclosure', 'info');
        
        const debugParams = [
            '?debug=1',
            '?debug=true',
            '?trace=1',
            '?verbose=1',
            '?test=1'
        ];

        for (const param of debugParams) {
            try {
                const testUrl = apiUrl + param;
                const response = await this.makeRequest(testUrl, 'GET');
                const responseText = await response.text();

                // Check if debug parameter reveals additional information
                if (responseText.length > 1000 && 
                    (responseText.includes('debug') || responseText.includes('trace'))) {
                    this.addVulnerability(
                        'Debug Information Exposure',
                        'medium',
                        `Debug parameter ${param} may expose sensitive information`,
                        'Disable debug parameters in production'
                    );
                }
            } catch (error) {
                // Expected for some test cases
            }
        }
    }

    // Test authentication bypass
    async testAuthenticationBypass(apiUrl) {
        this.logMessage('Testing: Authentication Bypass Attempts', 'info');
        
        const bypassHeaders = {
            'X-Originating-IP': '127.0.0.1',
            'X-Forwarded-For': '127.0.0.1',
            'X-Remote-IP': '127.0.0.1',
            'X-Remote-Addr': '127.0.0.1'
        };

        try {
            const normalResponse = await this.makeRequest(apiUrl, 'GET');
            const normalStatus = normalResponse.status;

            // Test with bypass headers
            const bypassResponse = await this.makeRequest(apiUrl, 'GET', {}, bypassHeaders);
            
            if (bypassResponse.status !== normalStatus && bypassResponse.status < 400) {
                this.addVulnerability(
                    'Potential Authentication Bypass',
                    'high',
                    'IP spoofing headers may bypass authentication',
                    'Implement proper authentication validation'
                );
            }
        } catch (error) {
            this.logMessage(`Auth bypass test inconclusive: ${error.message}`, 'warning');
        }
    }

    // Test token validation
    async testTokenValidation(apiUrl) {
        this.logMessage('Testing: Token Validation', 'info');
        
        const invalidTokens = [
            'invalid-token-123',
            'Bearer invalid',
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature'
        ];

        for (const token of invalidTokens) {
            try {
                const headers = { 'Authorization': token };
                const response = await this.makeRequest(apiUrl, 'GET', {}, headers);
                
                if (response.status === 200) {
                    this.addVulnerability(
                        'Weak Token Validation',
                        'high',
                        `Invalid token "${token}" was accepted`,
                        'Implement proper token validation and verification'
                    );
                }
            } catch (error) {
                // Expected for invalid tokens
            }
        }
    }

    // Test privilege escalation
    async testPrivilegeEscalation(apiUrl) {
        this.logMessage('Testing: Privilege Escalation', 'info');
        
        const escalationParams = [
            '?admin=1',
            '?role=admin',
            '?user_id=1',
            '?is_admin=true'
        ];

        for (const param of escalationParams) {
            try {
                const testUrl = apiUrl + param;
                const response = await this.makeRequest(testUrl, 'GET');
                const responseText = await response.text();
                
                // Look for signs of elevated access
                if (responseText.includes('admin') || 
                    responseText.includes('privileged') ||
                    response.status === 200) {
                    this.addVulnerability(
                        'Potential Privilege Escalation',
                        'high',
                        `Parameter ${param} may grant elevated privileges`,
                        'Implement proper authorization checks'
                    );
                }
            } catch (error) {
                // Expected for some test cases
            }
        }
    }

    // Test SQL injection
    async testSQLInjection(apiUrl) {
        this.logMessage('Testing: SQL Injection Vulnerabilities', 'info');
        
        const sqlPayloads = [
            "' OR '1'='1",
            "'; DROP TABLE users; --",
            "' UNION SELECT NULL, NULL, NULL --",
            "1' AND (SELECT COUNT(*) FROM information_schema.tables)>0 AND '1'='1"
        ];

        for (const payload of sqlPayloads) {
            try {
                const testUrl = `${apiUrl}?id=${encodeURIComponent(payload)}`;
                const response = await this.makeRequest(testUrl, 'GET');
                const responseText = await response.text();
                
                // Check for SQL error indicators
                if (responseText.includes('SQL') || 
                    responseText.includes('mysql') ||
                    responseText.includes('ORA-') ||
                    responseText.includes('syntax error')) {
                    this.addVulnerability(
                        'Potential SQL Injection',
                        'high',
                        `SQL error detected with payload: ${payload}`,
                        'Use parameterized queries and input validation'
                    );
                }
            } catch (error) {
                // Expected for some payloads
            }
        }
    }

    // Test NoSQL injection
    async testNoSQLInjection(apiUrl) {
        this.logMessage('Testing: NoSQL Injection Vulnerabilities', 'info');
        
        const nosqlPayloads = [
            '{"$ne": null}',
            '{"$regex": ".*"}',
            '{"$where": "this.password.match(/.*/)"}',
            '{"$gt": ""}'
        ];

        const method = document.getElementById('httpMethod').value;
        
        if (method === 'POST' || method === 'PUT') {
            for (const payload of nosqlPayloads) {
                try {
                    const response = await this.makeRequest(apiUrl, method, payload, {
                        'Content-Type': 'application/json'
                    });
                    
                    if (response.status === 200) {
                        const responseText = await response.text();
                        if (responseText.length > 100) { // Significant response suggests success
                            this.addVulnerability(
                                'Potential NoSQL Injection',
                                'high',
                                `NoSQL payload accepted: ${payload}`,
                                'Validate and sanitize all input data'
                            );
                        }
                    }
                } catch (error) {
                    // Expected for some payloads
                }
            }
        }
    }

    // Test command injection
    async testCommandInjection(apiUrl) {
        this.logMessage('Testing: Command Injection Vulnerabilities', 'info');
        
        const commandPayloads = [
            '; ls',
            '| whoami',
            '&& pwd',
            '$(id)',
            '`cat /etc/passwd`'
        ];

        for (const payload of commandPayloads) {
            try {
                const testUrl = `${apiUrl}?cmd=${encodeURIComponent(payload)}`;
                const response = await this.makeRequest(testUrl, 'GET');
                const responseText = await response.text();
                
                // Check for command execution indicators
                if (responseText.includes('root:') || 
                    responseText.includes('uid=') ||
                    responseText.includes('/bin/') ||
                    responseText.includes('total ')) {
                    this.addVulnerability(
                        'Potential Command Injection',
                        'high',
                        `Command execution detected with payload: ${payload}`,
                        'Never execute user input as system commands'
                    );
                }
            } catch (error) {
                // Expected for some payloads
            }
        }
    }

    // Test rate limiting
    async testRateLimiting(apiUrl) {
        this.logMessage('Testing: Rate Limiting Implementation', 'info');
        
        const requests = [];
        const requestCount = 10;
        
        // Send multiple rapid requests
        for (let i = 0; i < requestCount; i++) {
            requests.push(this.makeRequest(apiUrl, 'GET'));
        }
        
        try {
            const responses = await Promise.all(requests);
            const successfulRequests = responses.filter(r => r.status === 200).length;
            
            if (successfulRequests === requestCount) {
                this.addVulnerability(
                    'Missing Rate Limiting',
                    'medium',
                    `All ${requestCount} rapid requests succeeded`,
                    'Implement rate limiting to prevent abuse'
                );
            } else {
                this.logMessage(`✓ Rate limiting detected: ${successfulRequests}/${requestCount} requests succeeded`, 'success');
            }
        } catch (error) {
            this.logMessage(`Rate limiting test failed: ${error.message}`, 'warning');
        }
    }

    // Test DoS resilience
    async testDoSResilience(apiUrl) {
        this.logMessage('Testing: DoS Resilience', 'info');
        
        const largePayload = 'x'.repeat(10000); // 10KB payload
        
        try {
            const response = await this.makeRequest(apiUrl, 'POST', largePayload, {
                'Content-Type': 'text/plain'
            });
            
            if (response.status === 200) {
                this.addVulnerability(
                    'Potential DoS Vulnerability',
                    'medium',
                    'Large payload accepted without size validation',
                    'Implement request size limits'
                );
            }
        } catch (error) {
            this.logMessage(`DoS test failed: ${error.message}`, 'warning');
        }
    }

    // Make HTTP request with error handling
    async makeRequest(url, method = 'GET', body = null, headers = {}) {
        const options = {
            method: method,
            headers: {
                ...headers
            },
            mode: 'cors'
        };

        // Add authentication if configured
        const authType = document.getElementById('authType').value;
        const authValue = document.getElementById('authValue').value;
        
        if (authType !== 'none' && authValue) {
            switch (authType) {
                case 'bearer':
                    options.headers['Authorization'] = `Bearer ${authValue}`;
                    break;
                case 'apikey':
                    options.headers['X-API-Key'] = authValue;
                    break;
                case 'basic':
                    options.headers['Authorization'] = `Basic ${btoa(authValue)}`;
                    break;
            }
        }

        // Add custom headers
        try {
            const customHeaders = JSON.parse(document.getElementById('customHeaders').value || '{}');
            Object.assign(options.headers, customHeaders);
        } catch (e) {
            // Invalid JSON in custom headers
        }

        if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
            if (typeof body === 'string') {
                options.body = body;
            } else {
                options.body = JSON.stringify(body);
                options.headers['Content-Type'] = 'application/json';
            }
        }

        const controller = new AbortController();
        options.signal = controller.signal;
        
        // Set timeout
        setTimeout(() => controller.abort(), 10000);

        return fetch(url, options);
    }

    // Add vulnerability to report
    addVulnerability(title, severity, description, recommendation) {
        this.vulnerabilities.push({
            title,
            severity,
            description,
            recommendation,
            timestamp: new Date().toLocaleTimeString()
        });
        
        this.stats.vulnerabilitiesFound++;
        this.stats.riskScore += this.getSeverityScore(severity);
        
        this.updateStatsDisplay();
        this.logMessage(`🚨 ${severity.toUpperCase()}: ${title}`, 'error');
    }

    // Get numeric score for severity
    getSeverityScore(severity) {
        const scores = { low: 1, medium: 3, high: 5, critical: 10 };
        return scores[severity] || 0;
    }

    // Complete assessment and generate report
    completeAssessment() {
        this.isRunning = false;
        document.getElementById('startTests').disabled = false;
        document.getElementById('stopTests').disabled = true;
        
        const duration = (Date.now() - this.stats.startTime) / 1000;
        this.logMessage(`Assessment completed in ${duration.toFixed(1)} seconds`, 'info');
        
        this.generateVulnerabilityReport();
        this.updateStatsDisplay();
    }

    // Generate vulnerability report
    generateVulnerabilityReport() {
        const reportContent = document.getElementById('reportContent');
        
        if (this.vulnerabilities.length === 0) {
            reportContent.innerHTML = '✅ No vulnerabilities detected in the tested endpoints.';
            return;
        }

        let html = `<div class="report-summary">Found ${this.vulnerabilities.length} potential vulnerabilities:</div>`;
        
        this.vulnerabilities.forEach((vuln, index) => {
            html += `
                <div class="vulnerability ${vuln.severity}">
                    <div class="vuln-title">${index + 1}. ${vuln.title} (${vuln.severity.toUpperCase()})</div>
                    <div class="vuln-details">
                        <strong>Description:</strong> ${vuln.description}<br>
                        <strong>Recommendation:</strong> ${vuln.recommendation}<br>
                        <strong>Detected at:</strong> ${vuln.timestamp}
                    </div>
                </div>
            `;
        });

        reportContent.innerHTML = html;
    }

    // Update statistics display
    updateStatsDisplay() {
        const duration = this.stats.startTime ? (Date.now() - this.stats.startTime) / 1000 : 0;
        
        document.getElementById('testCount').textContent = this.stats.testsRun;
        document.getElementById('vulnerabilities').textContent = this.stats.vulnerabilitiesFound;
        document.getElementById('riskScore').textContent = this.stats.riskScore;
        document.getElementById('testTime').textContent = duration.toFixed(1);
    }

    // Log message to test log
    logMessage(message, type = 'normal') {
        const log = document.getElementById('testLog');
        const timestamp = new Date().toLocaleTimeString();
        const colorClass = {
            'info': '#74b9ff',
            'warning': '#fdcb6e',
            'success': '#00b894',
            'error': '#e17055',
            'normal': '#00b894'
        }[type];

        const logEntry = document.createElement('div');
        logEntry.innerHTML = `<span style="color: #ddd">[${timestamp}]</span> <span style="color: ${colorClass}">${message}</span>`;
        log.appendChild(logEntry);
        log.scrollTop = log.scrollHeight;
    }

    // Utility function for delays
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Global functions for HTML onclick events
let apiTester;

window.addEventListener('DOMContentLoaded', () => {
    apiTester = new APISecurityTester();
});

function startSecurityTests() {
    apiTester.startSecurityTests();
}

function stopSecurityTests() {
    apiTester.stopSecurityTests();
}

function loadTestAPI() {
    apiTester.loadTestAPI();
}

console.log('API Security Tester loaded');
