// URL Encoder/Decoder Tool
// Educational cybersecurity tool for URL encoding/decoding and analysis

class URLEncoderDecoder {
    constructor() {
        this.init();
    }

    init() {
        console.log('URL Encoder/Decoder Tool initialized');
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('inputText').addEventListener('input', () => {
            this.autoDetectAndConvert();
            this.analyzeURL();
        });
    }

    autoDetectAndConvert() {
        const input = document.getElementById('inputText').value;
        if (!input.trim()) {
            this.clearResults();
            return;
        }

        // Try both encoding and decoding
        this.encodeURL();
        this.decodeURL();
    }

    encodeURL() {
        const input = document.getElementById('inputText').value;
        const encodedResult = document.getElementById('encodedResult');
        
        if (!input.trim()) {
            encodedResult.value = '';
            return;
        }

        try {
            const encoded = encodeURIComponent(input);
            encodedResult.value = encoded;
        } catch (error) {
            this.showMessage('Error encoding URL: ' + error.message, 'error');
            encodedResult.value = '';
        }
    }

    decodeURL() {
        const input = document.getElementById('inputText').value;
        const decodedResult = document.getElementById('decodedResult');
        
        if (!input.trim()) {
            decodedResult.value = '';
            return;
        }

        try {
            const decoded = decodeURIComponent(input);
            decodedResult.value = decoded;
        } catch (error) {
            // If decoding fails, show original input
            decodedResult.value = input;
        }
    }

    analyzeURL() {
        const input = document.getElementById('inputText').value;
        
        // Clear analysis if no input
        if (!input.trim()) {
            this.clearAnalysis();
            return;
        }

        try {
            // Try to decode first if it looks encoded
            let urlToAnalyze = input;
            if (input.includes('%')) {
                try {
                    urlToAnalyze = decodeURIComponent(input);
                } catch (e) {
                    // Keep original if decoding fails
                }
            }

            // Try to parse as URL
            let url;
            try {
                url = new URL(urlToAnalyze);
            } catch (e) {
                // If not a complete URL, try with https prefix
                try {
                    url = new URL('https://' + urlToAnalyze);
                } catch (e2) {
                    this.clearAnalysis();
                    return;
                }
            }

            // Update analysis
            document.getElementById('urlProtocol').textContent = url.protocol || '-';
            document.getElementById('urlHost').textContent = url.hostname || '-';
            document.getElementById('urlPort').textContent = url.port || 'default';
            document.getElementById('urlPath').textContent = url.pathname || '/';
            document.getElementById('urlQuery').textContent = url.search ? url.search.substring(1) : '-';
            document.getElementById('urlFragment').textContent = url.hash ? url.hash.substring(1) : '-';

        } catch (error) {
            this.clearAnalysis();
        }
    }

    clearAnalysis() {
        const fields = ['urlProtocol', 'urlHost', 'urlPort', 'urlPath', 'urlQuery', 'urlFragment'];
        fields.forEach(field => {
            document.getElementById(field).textContent = '-';
        });
    }

    clearAll() {
        document.getElementById('inputText').value = '';
        this.clearResults();
        this.clearAnalysis();
        this.showMessage('All fields cleared', 'info');
    }

    clearResults() {
        document.getElementById('encodedResult').value = '';
        document.getElementById('decodedResult').value = '';
    }

    loadExample(text) {
        document.getElementById('inputText').value = text;
        this.autoDetectAndConvert();
        this.analyzeURL();
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
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;

        const header = document.querySelector('.tool-header');
        header.insertAdjacentElement('afterend', messageDiv);

        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 3000);
    }
}

// Global functions for HTML onclick events
function encodeURL() {
    window.urlTool.encodeURL();
}

function decodeURL() {
    window.urlTool.decodeURL();
}

function clearAll() {
    window.urlTool.clearAll();
}

function loadExample(text) {
    window.urlTool.loadExample(text);
}

function copyToClipboard(elementId) {
    window.urlTool.copyToClipboard(elementId);
}

// Initialize tool when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.urlTool = new URLEncoderDecoder();
});

console.log('URL Encoder/Decoder Tool loaded');
