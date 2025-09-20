// Shared Tool Frame JavaScript
// Common functionality for all tools

class ToolFrame {
    constructor(toolName = 'Cybersecurity Tool') {
        this.toolName = toolName;
        this.init();
    }

    init() {
        this.updateBreadcrumb();
        this.setupNavigation();
        console.log(`Tool frame initialized for: ${this.toolName}`);
    }

    updateBreadcrumb() {
        const breadcrumb = document.querySelector('.tool-breadcrumb');
        if (breadcrumb) {
            breadcrumb.textContent = this.toolName;
        }
        
        // Update document title
        document.title = `${this.toolName} - Kedster's Static Cyber Tools`;
    }

    setupNavigation() {
        // Handle back navigation
        const backLink = document.querySelector('.back-home');
        if (backLink) {
            backLink.addEventListener('click', (e) => {
                // Optional: Add confirmation if user has unsaved work
                // For now, just navigate normally
            });
        }
    }

    showLoading(message = 'Loading...') {
        const existing = document.querySelector('.loading-overlay');
        if (existing) return;

        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>${message}</p>
            </div>
        `;
        
        document.body.appendChild(overlay);
    }

    hideLoading() {
        const overlay = document.querySelector('.loading-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// Add necessary CSS for loading and notifications
const frameStyles = document.createElement('style');
frameStyles.textContent = `
    .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    }

    .loading-spinner {
        background: white;
        padding: 30px;
        border-radius: 10px;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #667eea;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 15px;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .notification {
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 10001;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 15px;
        max-width: 400px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        animation: slideIn 0.3s ease;
    }

    .notification-info {
        background: #3498db;
    }

    .notification-success {
        background: #00b894;
    }

    .notification-warning {
        background: #fdcb6e;
        color: #333;
    }

    .notification-error {
        background: #e17055;
    }

    .notification button {
        background: none;
        border: none;
        color: inherit;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;

document.head.appendChild(frameStyles);

// Export for use by individual tools
window.ToolFrame = ToolFrame;