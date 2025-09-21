// ROT13 Encoder/Decoder Tool
// Educational cybersecurity tool for ROT13 cipher operations

class ROT13Tool {
    constructor() {
        this.init();
    }

    init() {
        console.log('ROT13 Encoder/Decoder Tool initialized');
        this.setupEventListeners();
        this.generateCipherWheel();
    }

    setupEventListeners() {
        // Auto-apply ROT13 on input
        document.getElementById('inputText').addEventListener('input', () => {
            this.applyROT13();
        });

        // Handle paste events
        document.getElementById('inputText').addEventListener('paste', () => {
            setTimeout(() => this.applyROT13(), 100);
        });
    }

    applyROT13() {
        const input = document.getElementById('inputText').value;
        const resultText = document.getElementById('resultText');
        
        if (!input.trim()) {
            resultText.value = '';
            return;
        }

        try {
            const result = this.rot13Transform(input);
            resultText.value = result;
            
            if (input.trim()) {
                this.showMessage('ROT13 transformation applied', 'success');
            }
        } catch (error) {
            this.showMessage('Error applying ROT13: ' + error.message, 'error');
            resultText.value = '';
        }
    }

    rot13Transform(text) {
        return text.replace(/[A-Za-z]/g, (char) => {
            const start = char <= 'Z' ? 65 : 97; // ASCII code for 'A' or 'a'
            const code = char.charCodeAt(0);
            const shifted = ((code - start + 13) % 26) + start;
            return String.fromCharCode(shifted);
        });
    }

    generateCipherWheel() {
        const plainDiv = document.getElementById('plainAlphabet');
        const rot13Div = document.getElementById('rot13Alphabet');
        
        // Generate plain alphabet
        let plainHTML = '';
        let rot13HTML = '';
        
        for (let i = 0; i < 26; i++) {
            const plainChar = String.fromCharCode(65 + i); // A-Z
            const rot13Char = String.fromCharCode(65 + ((i + 13) % 26)); // ROT13 equivalent
            
            plainHTML += `<span class="wheel-char">${plainChar}</span>`;
            rot13HTML += `<span class="wheel-char">${rot13Char}</span>`;
        }
        
        plainDiv.innerHTML = plainHTML;
        rot13Div.innerHTML = rot13HTML;
    }

    clearAll() {
        document.getElementById('inputText').value = '';
        document.getElementById('resultText').value = '';
        this.showMessage('All fields cleared', 'info');
    }

    loadExample(text) {
        document.getElementById('inputText').value = text;
        this.applyROT13();
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
function applyROT13() {
    window.rot13Tool.applyROT13();
}

function clearAll() {
    window.rot13Tool.clearAll();
}

function loadExample(text) {
    window.rot13Tool.loadExample(text);
}

function copyToClipboard(elementId) {
    window.rot13Tool.copyToClipboard(elementId);
}

// Initialize tool when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.rot13Tool = new ROT13Tool();
});

console.log('ROT13 Encoder/Decoder Tool loaded');
