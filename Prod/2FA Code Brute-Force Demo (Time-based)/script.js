// 2FA Code Brute-Force Demo (Time-based)
// Educational cybersecurity tool for demonstrating TOTP vulnerabilities

class TOTPBruteForceDemo {
    constructor() {
        this.secretKey = '';
        this.timeWindow = 30;
        this.isAttacking = false;
        this.attackInterval = null;
        this.totpInterval = null;
        this.stats = {
            attempts: 0,
            startTime: null,
            matches: 0
        };
        this.currentValidCode = '';
        
        this.init();
    }

    init() {
        this.startTOTPTimer();
        this.setupEventListeners();
        console.log('2FA Brute-Force Demo initialized');
    }

    setupEventListeners() {
        document.getElementById('secretKey').addEventListener('input', (e) => {
            this.secretKey = e.target.value.toUpperCase().replace(/\s/g, '');
            this.updateCurrentCode();
        });

        document.getElementById('timeWindow').addEventListener('change', (e) => {
            this.timeWindow = parseInt(e.target.value);
            this.updateCurrentCode();
        });
    }

    // Base32 decode function for TOTP
    base32Decode(base32) {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        let bits = '';
        let result = [];

        for (let char of base32) {
            if (char === '=') break;
            bits += alphabet.indexOf(char).toString(2).padStart(5, '0');
        }

        for (let i = 0; i < bits.length - 7; i += 8) {
            result.push(parseInt(bits.substr(i, 8), 2));
        }

        return new Uint8Array(result);
    }

    // HMAC-SHA1 implementation (simplified for demo)
    async hmacSHA1(key, message) {
        const keyArray = key.length > 64 ? 
            new Uint8Array(await crypto.subtle.digest('SHA-1', key)).slice(0, 20) : 
            new Uint8Array([...key, ...new Array(64 - key.length).fill(0)]);

        const oKeyPad = keyArray.map(b => b ^ 0x5c);
        const iKeyPad = keyArray.map(b => b ^ 0x36);

        const innerHash = await crypto.subtle.digest('SHA-1', 
            new Uint8Array([...iKeyPad, ...message])
        );
        
        return crypto.subtle.digest('SHA-1', 
            new Uint8Array([...oKeyPad, ...new Uint8Array(innerHash)])
        );
    }

    // Generate TOTP code
    async generateTOTP(secret, timeStep = null) {
        if (!secret) return '------';

        try {
            const time = timeStep || Math.floor(Date.now() / 1000 / this.timeWindow);
            const timeBuffer = new ArrayBuffer(8);
            const timeView = new DataView(timeBuffer);
            timeView.setUint32(4, time, false);

            const keyBytes = this.base32Decode(secret);
            const hash = await this.hmacSHA1(keyBytes, new Uint8Array(timeBuffer));
            const hashArray = new Uint8Array(hash);
            
            const offset = hashArray[19] & 0x0f;
            const code = ((hashArray[offset] & 0x7f) << 24) |
                        ((hashArray[offset + 1] & 0xff) << 16) |
                        ((hashArray[offset + 2] & 0xff) << 8) |
                        (hashArray[offset + 3] & 0xff);

            return (code % 1000000).toString().padStart(6, '0');
        } catch (error) {
            return '------';
        }
    }

    // Update current valid TOTP code
    async updateCurrentCode() {
        if (this.secretKey) {
            this.currentValidCode = await this.generateTOTP(this.secretKey);
            document.getElementById('currentCode').textContent = this.currentValidCode;
        } else {
            document.getElementById('currentCode').textContent = '------';
            this.currentValidCode = '';
        }
    }

    // Start TOTP timer
    startTOTPTimer() {
        this.updateCurrentCode();
        
        this.totpInterval = setInterval(async () => {
            await this.updateCurrentCode();
            this.updateCountdown();
        }, 1000);
    }

    // Update countdown display
    updateCountdown() {
        const now = Math.floor(Date.now() / 1000);
        const timeInWindow = now % this.timeWindow;
        const remaining = this.timeWindow - timeInWindow;
        const percentage = (remaining / this.timeWindow) * 100;

        document.getElementById('timeRemaining').textContent = remaining;
        document.getElementById('countdownFill').style.width = `${percentage}%`;
    }

    // Generate random secret for demo
    generateRandomSecret() {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        let secret = '';
        for (let i = 0; i < 16; i++) {
            secret += alphabet[Math.floor(Math.random() * alphabet.length)];
        }
        document.getElementById('secretKey').value = secret;
        this.secretKey = secret;
        this.updateCurrentCode();
        this.logMessage(`Generated random secret: ${secret}`, 'info');
    }

    // Start brute force attack simulation
    async startBruteForce() {
        if (!this.secretKey) {
            alert('Please enter a TOTP secret key first');
            return;
        }

        this.isAttacking = true;
        this.stats = {
            attempts: 0,
            startTime: Date.now(),
            matches: 0
        };

        document.getElementById('startAttack').disabled = true;
        document.getElementById('stopAttack').disabled = false;

        const attackMode = document.getElementById('attackMode').value;
        const attackSpeed = parseInt(document.getElementById('attackSpeed').value);
        const delayMs = 1000 / attackSpeed;

        this.logMessage(`Starting ${attackMode} brute force attack at ${attackSpeed} attempts/sec`, 'info');
        this.logMessage('⚠️  Educational demonstration - Do not use on production systems!', 'warning');

        const patterns = this.getAttackPatterns(attackMode);
        let patternIndex = 0;

        this.attackInterval = setInterval(async () => {
            if (!this.isAttacking || patternIndex >= patterns.length) {
                this.stopBruteForce();
                return;
            }

            const testCode = patterns[patternIndex];
            this.stats.attempts++;
            
            // Check if code matches current valid code
            if (testCode === this.currentValidCode) {
                this.stats.matches++;
                this.logMessage(`🎯 MATCH FOUND: ${testCode} (Attempt #${this.stats.attempts})`, 'success');
            }

            // Update stats display
            this.updateStatsDisplay();

            patternIndex++;
        }, delayMs);
    }

    // Get attack patterns based on mode
    getAttackPatterns(mode) {
        switch (mode) {
            case 'sequential':
                return Array.from({length: 1000000}, (_, i) => 
                    i.toString().padStart(6, '0')
                );
            
            case 'dictionary':
                return [
                    '000000', '123456', '111111', '000001', '123123',
                    '222222', '333333', '444444', '555555', '666666',
                    '777777', '888888', '999999', '012345', '654321',
                    '123321', '111222', '222111', '121212', '131313',
                    '141414', '151515', '161616', '171717', '181818',
                    '191919', '202020', '212121', '232323', '242424',
                    '252525', '262626', '272727', '282828', '293030'
                ];
            
            case 'time-based':
                // Focus on current time window and adjacent windows
                const currentTime = Math.floor(Date.now() / 1000 / this.timeWindow);
                const patterns = [];
                
                for (let offset = -2; offset <= 2; offset++) {
                    patterns.push(this.generateTOTP(this.secretKey, currentTime + offset));
                }
                
                return Promise.all(patterns);
                
            default:
                return ['000000'];
        }
    }

    // Stop brute force attack
    stopBruteForce() {
        this.isAttacking = false;
        if (this.attackInterval) {
            clearInterval(this.attackInterval);
            this.attackInterval = null;
        }

        document.getElementById('startAttack').disabled = false;
        document.getElementById('stopAttack').disabled = true;

        const duration = (Date.now() - this.stats.startTime) / 1000;
        this.logMessage(`Attack stopped. Duration: ${duration.toFixed(1)}s, Attempts: ${this.stats.attempts}, Matches: ${this.stats.matches}`, 'info');
    }

    // Update statistics display
    updateStatsDisplay() {
        const duration = (Date.now() - this.stats.startTime) / 1000;
        const rate = duration > 0 ? (this.stats.attempts / duration).toFixed(0) : 0;

        document.getElementById('attemptCount').textContent = this.stats.attempts.toLocaleString();
        document.getElementById('attackTime').textContent = duration.toFixed(1);
        document.getElementById('attackRate').textContent = rate;
        document.getElementById('successCount').textContent = this.stats.matches;
    }

    // Log message to attack log
    logMessage(message, type = 'normal') {
        const log = document.getElementById('attackLog');
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
}

// Global functions for HTML onclick events
let demo;

window.addEventListener('DOMContentLoaded', () => {
    demo = new TOTPBruteForceDemo();
});

function generateRandomSecret() {
    demo.generateRandomSecret();
}

function startBruteForce() {
    demo.startBruteForce();
}

function stopBruteForce() {
    demo.stopBruteForce();
}

console.log('2FA Code Brute-Force Demo (Time-based) loaded');
