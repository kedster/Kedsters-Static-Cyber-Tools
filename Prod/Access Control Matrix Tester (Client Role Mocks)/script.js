// Access Control Matrix Tester (Client Role Mocks)
// Role-based access control testing tool with client-side simulation

class AccessControlTester {
    constructor() {
        this.currentUser = {
            username: 'guest',
            role: 'guest',
            permissions: []
        };
        
        this.roles = {
            guest: {
                name: 'Guest',
                permissions: ['view_public']
            },
            user: {
                name: 'User',
                permissions: ['view_public', 'view_profile', 'edit_profile', 'create_post']
            },
            moderator: {
                name: 'Moderator', 
                permissions: ['view_public', 'view_profile', 'edit_profile', 'create_post', 'moderate_posts', 'view_reports', 'ban_users']
            },
            admin: {
                name: 'Admin',
                permissions: ['view_public', 'view_profile', 'edit_profile', 'create_post', 'moderate_posts', 'view_reports', 'ban_users', 'manage_users', 'view_analytics', 'system_config']
            },
            superadmin: {
                name: 'Super Admin',
                permissions: ['*'] // All permissions
            }
        };
        
        this.resources = {
            'Public Content': ['view_public'],
            'User Profiles': ['view_profile', 'edit_profile'],
            'Posts & Comments': ['create_post', 'moderate_posts'],
            'User Reports': ['view_reports'],
            'User Management': ['ban_users', 'manage_users'],
            'System Analytics': ['view_analytics'],
            'System Configuration': ['system_config'],
            'Database Access': ['db_read', 'db_write'],
            'Admin Panel': ['admin_access']
        };
        
        this.testStats = {
            totalTests: 0,
            allowedAccess: 0,
            deniedAccess: 0,
            vulnerabilities: 0
        };
        
        this.init();
    }

    init() {
        this.buildAccessMatrix();
        this.populateResourceSelector();
        this.updateUserDisplay();
        console.log('Access Control Matrix Tester initialized');
    }

    // Build the access control matrix
    buildAccessMatrix() {
        const matrixBody = document.getElementById('matrixBody');
        const roleKeys = Object.keys(this.roles);
        
        Object.entries(this.resources).forEach(([resource, actions]) => {
            actions.forEach(action => {
                const row = document.createElement('tr');
                
                // Resource/Action column
                const resourceCell = document.createElement('td');
                resourceCell.textContent = `${resource} → ${action}`;
                row.appendChild(resourceCell);
                
                // Permission cells for each role
                roleKeys.forEach(roleKey => {
                    const cell = document.createElement('td');
                    const hasPermission = this.checkRolePermission(roleKey, action);
                    
                    cell.textContent = hasPermission ? '✅ ALLOW' : '❌ DENY';
                    cell.className = hasPermission ? 'permission-allowed' : 'permission-denied';
                    row.appendChild(cell);
                });
                
                matrixBody.appendChild(row);
            });
        });
    }

    // Check if role has specific permission
    checkRolePermission(roleKey, permission) {
        const role = this.roles[roleKey];
        if (!role) return false;
        
        // Super admin has all permissions
        if (role.permissions.includes('*')) return true;
        
        return role.permissions.includes(permission);
    }

    // Populate resource selector dropdown
    populateResourceSelector() {
        const resourceSelect = document.getElementById('testResource');
        const actionSelect = document.getElementById('testAction');
        
        Object.keys(this.resources).forEach(resource => {
            const option = document.createElement('option');
            option.value = resource;
            option.textContent = resource;
            resourceSelect.appendChild(option);
        });
        
        resourceSelect.addEventListener('change', (e) => {
            this.populateActionSelector(e.target.value);
        });
    }

    // Populate action selector based on resource
    populateActionSelector(resource) {
        const actionSelect = document.getElementById('testAction');
        actionSelect.innerHTML = '<option value="">-- Choose Action --</option>';
        
        if (resource && this.resources[resource]) {
            this.resources[resource].forEach(action => {
                const option = document.createElement('option');
                option.value = action;
                option.textContent = action.replace(/_/g, ' ').toUpperCase();
                actionSelect.appendChild(option);
            });
        }
    }

    // Update user display
    updateUserDisplay() {
        const role = this.roles[this.currentUser.role];
        const permissions = role ? role.permissions : [];
        
        document.getElementById('userName').textContent = this.currentUser.username;
        document.getElementById('userRole').textContent = role ? role.name : 'Unknown';
        document.getElementById('userPermissions').textContent = 
            permissions.includes('*') ? 'All Permissions' : 
            permissions.length > 0 ? `${permissions.length} permissions` : 'No Permissions';
        
        // Update avatar based on role
        const avatars = {
            guest: '👤',
            user: '👨‍💻',
            moderator: '👮',
            admin: '🔧',
            superadmin: '👑'
        };
        document.getElementById('userAvatar').textContent = avatars[this.currentUser.role] || '👤';
        
        this.currentUser.permissions = permissions;
    }

    // Show login modal
    showLoginModal() {
        document.getElementById('loginModal').style.display = 'block';
        document.getElementById('username').focus();
    }

    // Hide login modal
    hideLoginModal() {
        document.getElementById('loginModal').style.display = 'none';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    }

    // Perform login
    performLogin() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const selectedRole = document.getElementById('roleSelect').value;
        
        if (!username) {
            alert('Please enter a username');
            return;
        }
        
        // Simulate authentication (client-side mock)
        this.currentUser.username = username;
        this.currentUser.role = selectedRole;
        
        this.updateUserDisplay();
        this.hideLoginModal();
        
        this.logMessage(`User "${username}" logged in with role: ${this.roles[selectedRole].name}`, 'info');
    }

    // Test specific permission
    testPermission() {
        const resource = document.getElementById('testResource').value;
        const action = document.getElementById('testAction').value;
        
        if (!resource || !action) {
            alert('Please select both resource and action');
            return;
        }
        
        const hasPermission = this.checkUserPermission(action);
        const resultDiv = document.getElementById('testResult');
        
        this.testStats.totalTests++;
        
        if (hasPermission) {
            this.testStats.allowedAccess++;
            resultDiv.className = 'test-result allowed';
            resultDiv.innerHTML = `
                <div>
                    ✅ <strong>ACCESS GRANTED</strong><br>
                    User "${this.currentUser.username}" (${this.roles[this.currentUser.role].name}) 
                    can perform "${action.replace(/_/g, ' ')}" on "${resource}"
                </div>
            `;
            this.logMessage(`✅ ALLOW: ${action} on ${resource} for ${this.currentUser.username}`, 'success');
        } else {
            this.testStats.deniedAccess++;
            resultDiv.className = 'test-result denied';
            resultDiv.innerHTML = `
                <div>
                    ❌ <strong>ACCESS DENIED</strong><br>
                    User "${this.currentUser.username}" (${this.roles[this.currentUser.role].name}) 
                    cannot perform "${action.replace(/_/g, ' ')}" on "${resource}"
                </div>
            `;
            this.logMessage(`❌ DENY: ${action} on ${resource} for ${this.currentUser.username}`, 'error');
        }
        
        this.updateStats();
    }

    // Check if current user has permission
    checkUserPermission(permission) {
        // Super admin has all permissions
        if (this.currentUser.permissions.includes('*')) return true;
        
        return this.currentUser.permissions.includes(permission);
    }

    // Run full access test
    runFullTest() {
        this.logMessage('Starting comprehensive access control test...', 'info');
        const resultDiv = document.getElementById('testResult');
        resultDiv.className = 'test-result info';
        resultDiv.innerHTML = '<div>🔄 <strong>Running Full Access Test...</strong><br>Testing all permissions for current role</div>';
        
        let testResults = [];
        let vulnerabilitiesFound = 0;
        
        // Test all actions across all resources
        Object.entries(this.resources).forEach(([resource, actions]) => {
            actions.forEach(action => {
                const hasPermission = this.checkUserPermission(action);
                const shouldHave = this.checkRolePermission(this.currentUser.role, action);
                
                this.testStats.totalTests++;
                
                if (hasPermission) {
                    this.testStats.allowedAccess++;
                } else {
                    this.testStats.deniedAccess++;
                }
                
                // Check for potential privilege escalation vulnerabilities
                if (hasPermission && !shouldHave) {
                    vulnerabilitiesFound++;
                    this.testStats.vulnerabilities++;
                    testResults.push({
                        resource,
                        action,
                        status: 'VULNERABILITY',
                        message: 'Privilege escalation detected'
                    });
                    this.logMessage(`🚨 VULNERABILITY: Unexpected access to ${action} on ${resource}`, 'error');
                } else if (hasPermission) {
                    testResults.push({
                        resource,
                        action,
                        status: 'ALLOWED',
                        message: 'Access granted as expected'
                    });
                } else {
                    testResults.push({
                        resource,
                        action,
                        status: 'DENIED',
                        message: 'Access denied as expected'
                    });
                }
            });
        });
        
        // Display results summary
        setTimeout(() => {
            if (vulnerabilitiesFound > 0) {
                resultDiv.className = 'test-result denied';
                resultDiv.innerHTML = `
                    <div>
                        🚨 <strong>SECURITY ISSUES FOUND</strong><br>
                        ${vulnerabilitiesFound} privilege escalation vulnerabilities detected!<br>
                        Total tests: ${testResults.length} | See log for details
                    </div>
                `;
            } else {
                resultDiv.className = 'test-result allowed';
                resultDiv.innerHTML = `
                    <div>
                        ✅ <strong>ACCESS CONTROL WORKING CORRECTLY</strong><br>
                        All ${testResults.length} permission tests passed<br>
                        No privilege escalation vulnerabilities detected
                    </div>
                `;
            }
            
            this.updateStats();
            this.logMessage(`Full access test completed: ${testResults.length} tests, ${vulnerabilitiesFound} vulnerabilities`, 'info');
        }, 1500);
    }

    // Update statistics display
    updateStats() {
        document.getElementById('totalTests').textContent = this.testStats.totalTests;
        document.getElementById('allowedAccess').textContent = this.testStats.allowedAccess;
        document.getElementById('deniedAccess').textContent = this.testStats.deniedAccess;
        document.getElementById('vulnerabilities').textContent = this.testStats.vulnerabilities;
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
}

// Global functions for HTML onclick events
let accessTester;

window.addEventListener('DOMContentLoaded', () => {
    accessTester = new AccessControlTester();
});

function showLoginModal() {
    accessTester.showLoginModal();
}

function hideLoginModal() {
    accessTester.hideLoginModal();
}

function performLogin() {
    accessTester.performLogin();
}

function testPermission() {
    accessTester.testPermission();
}

function runFullTest() {
    accessTester.runFullTest();
}

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    const modal = document.getElementById('loginModal');
    if (event.target === modal) {
        accessTester.hideLoginModal();
    }
});

console.log('Access Control Matrix Tester loaded');
