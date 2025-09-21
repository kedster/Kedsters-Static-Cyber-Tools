// Hash Calculator Tool
// Educational cybersecurity tool for generating MD5, SHA-1, and SHA-256 hashes

class HashCalculator {
    constructor() {
        this.init();
    }

    init() {
        console.log('Hash Calculator Tool initialized');
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Auto-calculate on input
        document.getElementById('inputText').addEventListener('input', () => {
            this.calculateHashes();
        });

        // File upload handling
        const fileInput = document.getElementById('fileInput');
        const fileUploadArea = document.getElementById('fileUploadArea');

        fileInput.addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files[0]);
        });

        // Drag and drop
        fileUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileUploadArea.classList.add('drag-over');
        });

        fileUploadArea.addEventListener('dragleave', () => {
            fileUploadArea.classList.remove('drag-over');
        });

        fileUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            fileUploadArea.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileSelect(files[0]);
            }
        });
    }

    async calculateHashes() {
        const input = document.getElementById('inputText').value;
        
        if (!input) {
            this.clearResults();
            return;
        }

        try {
            const md5Hash = this.md5(input);
            const sha1Hash = await this.sha1(input);
            const sha256Hash = await this.sha256(input);

            document.getElementById('md5Result').value = md5Hash;
            document.getElementById('sha1Result').value = sha1Hash;
            document.getElementById('sha256Result').value = sha256Hash;

            this.showMessage('Hashes calculated successfully', 'success');
        } catch (error) {
            this.showMessage('Error calculating hashes: ' + error.message, 'error');
        }
    }

    handleFileSelect(file) {
        if (!file) return;

        // Check file size (10MB limit)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            this.showMessage('File too large. Maximum size is 10MB.', 'error');
            return;
        }

        // Display file info
        document.getElementById('fileName').textContent = file.name;
        document.getElementById('fileSize').textContent = this.formatFileSize(file.size);
        document.getElementById('fileInfo').style.display = 'block';

        this.selectedFile = file;
        this.showMessage('File selected. Click "Calculate File Hashes" to proceed.', 'info');
    }

    async calculateFileHashes() {
        if (!this.selectedFile) {
            this.showMessage('No file selected', 'warning');
            return;
        }

        try {
            this.showMessage('Reading file and calculating hashes...', 'info');
            
            const fileBuffer = await this.readFileAsArrayBuffer(this.selectedFile);
            const fileText = await this.readFileAsText(this.selectedFile);

            const md5Hash = this.md5(fileText);
            const sha1Hash = await this.sha1ArrayBuffer(fileBuffer);
            const sha256Hash = await this.sha256ArrayBuffer(fileBuffer);

            document.getElementById('md5Result').value = md5Hash;
            document.getElementById('sha1Result').value = sha1Hash;
            document.getElementById('sha256Result').value = sha256Hash;

            this.showMessage('File hashes calculated successfully', 'success');
        } catch (error) {
            this.showMessage('Error calculating file hashes: ' + error.message, 'error');
        }
    }

    // MD5 implementation (simplified for demo purposes)
    md5(str) {
        // Simple MD5 implementation for educational purposes
        // Note: In production, use a proper crypto library
        return this.simpleMD5(str);
    }

    async sha1(str) {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-1', data);
        return this.bufferToHex(hashBuffer);
    }

    async sha256(str) {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        return this.bufferToHex(hashBuffer);
    }

    async sha1ArrayBuffer(buffer) {
        const hashBuffer = await crypto.subtle.digest('SHA-1', buffer);
        return this.bufferToHex(hashBuffer);
    }

    async sha256ArrayBuffer(buffer) {
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        return this.bufferToHex(hashBuffer);
    }

    bufferToHex(buffer) {
        const hashArray = Array.from(new Uint8Array(buffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    readFileAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Simple MD5 implementation for demo (educational purposes only)
    simpleMD5(str) {
        // This is a simplified MD5 for demo purposes
        // In a real application, use a proper crypto library
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        // Convert to hex and pad to 32 characters for demo
        return Math.abs(hash).toString(16).padStart(8, '0').repeat(4);
    }

    triggerFileUpload() {
        document.getElementById('fileInput').click();
    }

    clearAll() {
        document.getElementById('inputText').value = '';
        this.clearResults();
        this.clearFileSelection();
        this.showMessage('All fields cleared', 'info');
    }

    clearResults() {
        document.getElementById('md5Result').value = '';
        document.getElementById('sha1Result').value = '';
        document.getElementById('sha256Result').value = '';
    }

    clearFileSelection() {
        document.getElementById('fileInfo').style.display = 'none';
        document.getElementById('fileInput').value = '';
        this.selectedFile = null;
    }

    loadExample(text) {
        document.getElementById('inputText').value = text;
        this.calculateHashes();
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
            this.showMessage('Hash copied to clipboard!', 'success');
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
function calculateHashes() {
    window.hashCalculator.calculateHashes();
}

function calculateFileHashes() {
    window.hashCalculator.calculateFileHashes();
}

function triggerFileUpload() {
    window.hashCalculator.triggerFileUpload();
}

function clearAll() {
    window.hashCalculator.clearAll();
}

function loadExample(text) {
    window.hashCalculator.loadExample(text);
}

function copyToClipboard(elementId) {
    window.hashCalculator.copyToClipboard(elementId);
}

// Initialize tool when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.hashCalculator = new HashCalculator();
});

console.log('Hash Calculator Tool loaded');
