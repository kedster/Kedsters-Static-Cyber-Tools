// Base64 Encoder/Decoder Tool
// Educational cybersecurity tool for encoding and decoding Base64 data

class Base64Tool {
    constructor() {
        this.init();
    }

    init() {
        console.log('Base64 Encoder/Decoder Tool initialized');
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Auto-detect and convert on input
        document.getElementById('inputText').addEventListener('input', () => {
            this.autoDetectAndConvert();
        });

        // Handle paste events
        document.getElementById('inputText').addEventListener('paste', () => {
            setTimeout(() => this.autoDetectAndConvert(), 100);
        });
    }

    encodeBase64() {
        const input = document.getElementById('inputText').value;
        const encodedResult = document.getElementById('encodedResult');
        
        if (!input.trim()) {
            this.showMessage('Please enter text to encode', 'warning');
            return;
        }

        try {
            const encoded = btoa(unescape(encodeURIComponent(input)));
            encodedResult.value = encoded;
            this.showMessage('Text successfully encoded to Base64', 'success');
        } catch (error) {
            this.showMessage('Error encoding text: ' + error.message, 'error');
            encodedResult.value = '';
        }
    }

    decodeBase64() {
        const input = document.getElementById('inputText').value;
        const decodedResult = document.getElementById('decodedResult');
        
        if (!input.trim()) {
            this.showMessage('Please enter Base64 text to decode', 'warning');
            return;
        }

        try {
            const decoded = decodeURIComponent(escape(atob(input.trim())));
            decodedResult.value = decoded;
            this.showMessage('Base64 successfully decoded', 'success');
        } catch (error) {
            this.showMessage('Error decoding Base64: Invalid format or corrupted data', 'error');
            decodedResult.value = '';
        }
    }

    autoDetectAndConvert() {
        const input = document.getElementById('inputText').value;
        if (!input.trim()) {
            this.clearResults();
            return;
        }

        // Try to detect if input looks like Base64
        if (this.isLikelyBase64(input.trim())) {
            this.decodeBase64();
        } else {
            this.encodeBase64();
        }
    }

    isLikelyBase64(str) {
        // Base64 regex pattern
        const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
        
        // Check if string matches Base64 pattern and has reasonable length
        if (!base64Regex.test(str)) {
            return false;
        }

        // Must be multiple of 4 in length (with padding)
        if (str.length % 4 !== 0) {
            return false;
        }

        // Check for typical Base64 characteristics
        const hasUpperCase = /[A-Z]/.test(str);
        const hasLowerCase = /[a-z]/.test(str);
        const hasNumbers = /[0-9]/.test(str);
        const hasSpecialChars = /[+/]/.test(str);
        
        // Likely Base64 if it has mixed case and/or special chars
        return (hasUpperCase && hasLowerCase) || hasSpecialChars || 
               (str.length > 16 && (hasNumbers || hasUpperCase || hasLowerCase));
    }

    clearAll() {
        document.getElementById('inputText').value = '';
        this.clearResults();
        this.showMessage('All fields cleared', 'info');
    }

    clearResults() {
        document.getElementById('encodedResult').value = '';
        document.getElementById('decodedResult').value = '';
    }

    loadExample(text) {
        document.getElementById('inputText').value = text;
        this.autoDetectAndConvert();
        this.showMessage('Example loaded', 'info');
    }

    copyToClipboard(elementId) {
        const element = document.getElementById(elementId);
        if (!element.value.trim()) {
            this.showMessage('Nothing to copy', 'warning');
            return;
        }

        element.select();
        element.setSelectionRange(0, 99999);
        
        try {
            document.execCommand('copy');
            this.showMessage('Copied to clipboard!', 'success');
        } catch (error) {
            this.showMessage('Failed to copy to clipboard', 'error');
        }
    }

    showMessage(message, type = 'info') {
        // Remove existing message
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;

        // Insert after header
        const header = document.querySelector('.tool-header');
        header.insertAdjacentElement('afterend', messageDiv);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 3000);
    }
}

// Global functions for HTML onclick events
function encodeBase64() {
    window.base64Tool.encodeBase64();
}

function decodeBase64() {
    window.base64Tool.decodeBase64();
}

function clearAll() {
    window.base64Tool.clearAll();
}

function loadExample(text) {
    window.base64Tool.loadExample(text);
}

function copyToClipboard(elementId) {
    window.base64Tool.copyToClipboard(elementId);
}

// Initialize tool when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.base64Tool = new Base64Tool();
});

console.log('Base64 Encoder/Decoder Tool loaded');
