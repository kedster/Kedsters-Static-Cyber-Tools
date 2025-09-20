// Access Control Matrix Manager
// Visual access control matrix management tool

class AccessControlMatrixManager {
    constructor() {
        this.roles = new Map();
        this.resources = new Map();
        this.permissions = new Map(); // role -> resource -> permission level
        this.selectedRole = null;
        this.selectedResource = null;
        
        this.init();
    }

    init() {
        this.loadSampleData();
        this.renderRoles();
        this.renderResources();
        this.renderPermissionsManager();
        this.renderMatrix();
        this.updateAnalytics();
        console.log('Access Control Matrix Manager initialized');
    }

    // Load sample data
    loadSampleData() {
        // Sample roles
        this.addRoleData('admin', {
            name: 'System Administrator',
            description: 'Full system access with all administrative privileges',
            level: 5
        });
        
        this.addRoleData('manager', {
            name: 'Manager',
            description: 'Management access to user data and reports',
            level: 4
        });
        
        this.addRoleData('editor', {
            name: 'Content Editor',
            description: 'Can create and edit content, moderate discussions',
            level: 3
        });
        
        this.addRoleData('user', {
            name: 'Regular User',
            description: 'Standard user with basic access permissions',
            level: 2
        });
        
        this.addRoleData('guest', {
            name: 'Guest User',
            description: 'Limited read-only access to public content',
            level: 1
        });
        
        // Sample resources
        this.addResourceData('user-database', {
            name: 'User Database',
            type: 'data',
            sensitivity: 'confidential'
        });
        
        this.addResourceData('reports', {
            name: 'System Reports',
            type: 'file',
            sensitivity: 'internal'
        });
        
        this.addResourceData('settings', {
            name: 'System Settings',
            type: 'system',
            sensitivity: 'restricted'
        });
        
        this.addResourceData('content', {
            name: 'Content Management',
            type: 'ui',
            sensitivity: 'internal'
        });
        
        this.addResourceData('public-content', {
            name: 'Public Content',
            type: 'ui',
            sensitivity: 'public'
        });
        
        // Sample permissions (0=none, 1=read, 2=write, 3=admin)
        this.setPermission('admin', 'user-database', 3);
        this.setPermission('admin', 'reports', 3);
        this.setPermission('admin', 'settings', 3);
        this.setPermission('admin', 'content', 3);
        this.setPermission('admin', 'public-content', 3);
        
        this.setPermission('manager', 'user-database', 2);
        this.setPermission('manager', 'reports', 2);
        this.setPermission('manager', 'settings', 1);
        this.setPermission('manager', 'content', 2);
        this.setPermission('manager', 'public-content', 2);
        
        this.setPermission('editor', 'user-database', 1);
        this.setPermission('editor', 'reports', 1);
        this.setPermission('editor', 'settings', 0);
        this.setPermission('editor', 'content', 2);
        this.setPermission('editor', 'public-content', 2);
        
        this.setPermission('user', 'user-database', 1);
        this.setPermission('user', 'reports', 0);
        this.setPermission('user', 'settings', 0);
        this.setPermission('user', 'content', 1);
        this.setPermission('user', 'public-content', 1);
        
        this.setPermission('guest', 'user-database', 0);
        this.setPermission('guest', 'reports', 0);
        this.setPermission('guest', 'settings', 0);
        this.setPermission('guest', 'content', 0);
        this.setPermission('guest', 'public-content', 1);
    }

    // Add role data
    addRoleData(id, roleData) {
        this.roles.set(id, { id, ...roleData });
        if (!this.permissions.has(id)) {
            this.permissions.set(id, new Map());
        }
    }

    // Add resource data
    addResourceData(id, resourceData) {
        this.resources.set(id, { id, ...resourceData });
    }

    // Set permission level
    setPermission(roleId, resourceId, level) {
        if (!this.permissions.has(roleId)) {
            this.permissions.set(roleId, new Map());
        }
        this.permissions.get(roleId).set(resourceId, level);
    }

    // Show tab
    showTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show selected tab
        document.getElementById(`${tabName}-tab`).classList.add('active');
        event.target.classList.add('active');
        
        // Refresh content based on tab
        switch (tabName) {
            case 'roles':
                this.renderRoles();
                break;
            case 'resources':
                this.renderResources();
                break;
            case 'permissions':
                this.renderPermissionsManager();
                break;
            case 'matrix':
                this.renderMatrix();
                break;
        }
    }

    // Render roles
    renderRoles() {
        const container = document.getElementById('rolesGrid');
        container.innerHTML = '';
        
        this.roles.forEach(role => {
            const roleCard = document.createElement('div');
            roleCard.className = 'role-card';
            roleCard.innerHTML = `
                <div class="card-header">
                    <div class="card-title">${role.name}</div>
                    <div class="card-level">Level ${role.level}</div>
                </div>
                <div class="card-description">${role.description}</div>
                <div class="card-actions">
                    <button class="edit-btn" onclick="editRole('${role.id}')">Edit</button>
                    <button class="delete-btn" onclick="deleteRole('${role.id}')">Delete</button>
                </div>
            `;
            container.appendChild(roleCard);
        });
    }

    // Render resources
    renderResources() {
        const container = document.getElementById('resourcesGrid');
        container.innerHTML = '';
        
        this.resources.forEach(resource => {
            const resourceCard = document.createElement('div');
            resourceCard.className = 'resource-card';
            resourceCard.innerHTML = `
                <div class="card-header">
                    <div class="card-title">${resource.name}</div>
                    <div class="card-type">${resource.type.toUpperCase()}</div>
                </div>
                <div class="card-description">
                    <strong>Sensitivity:</strong> ${resource.sensitivity.toUpperCase()}<br>
                    <strong>Type:</strong> ${resource.type.replace('-', ' ').toUpperCase()}
                </div>
                <div class="card-actions">
                    <button class="edit-btn" onclick="editResource('${resource.id}')">Edit</button>
                    <button class="delete-btn" onclick="deleteResource('${resource.id}')">Delete</button>
                </div>
            `;
            container.appendChild(resourceCard);
        });
    }

    // Render permissions manager
    renderPermissionsManager() {
        const container = document.getElementById('permissionsManager');
        container.innerHTML = `
            <div class="permission-grid">
                <div class="role-selector">
                    <h4>Select Role:</h4>
                    <div class="role-list" id="roleList">
                        ${Array.from(this.roles.values()).map(role => 
                            `<div class="role-item" onclick="selectRole('${role.id}')">${role.name}</div>`
                        ).join('')}
                    </div>
                </div>
                <div class="resource-selector">
                    <h4>Select Resource:</h4>
                    <div class="resource-list" id="resourceList">
                        ${Array.from(this.resources.values()).map(resource => 
                            `<div class="resource-item" onclick="selectResource('${resource.id}')">${resource.name}</div>`
                        ).join('')}
                    </div>
                </div>
            </div>
            <div id="permissionControls" style="display: none; margin-top: 20px;">
                <h4>Permission Level:</h4>
                <div style="display: flex; gap: 10px; margin-top: 10px;">
                    <button onclick="setPermissionLevel(0)" class="permission-btn denied">None</button>
                    <button onclick="setPermissionLevel(1)" class="permission-btn read">Read</button>
                    <button onclick="setPermissionLevel(2)" class="permission-btn write">Write</button>
                    <button onclick="setPermissionLevel(3)" class="permission-btn admin">Admin</button>
                </div>
                <div id="currentPermission" style="margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 5px;"></div>
            </div>
        `;
    }

    // Render matrix
    renderMatrix() {
        const container = document.getElementById('matrixDisplay');
        const roles = Array.from(this.roles.values());
        const resources = Array.from(this.resources.values());
        
        let matrixHTML = '<table class="matrix-table"><thead><tr>';
        matrixHTML += '<th>Resource</th>';
        roles.forEach(role => {
            matrixHTML += `<th>${role.name}</th>`;
        });
        matrixHTML += '</tr></thead><tbody>';
        
        resources.forEach(resource => {
            matrixHTML += `<tr><td>${resource.name}</td>`;
            roles.forEach(role => {
                const permission = this.permissions.get(role.id)?.get(resource.id) || 0;
                const permissionText = ['❌', '👁️', '✏️', '⚡'][permission];
                const permissionClass = ['permission-denied', 'permission-read', 'permission-write', 'permission-admin'][permission];
                
                matrixHTML += `<td onclick="togglePermission('${role.id}', '${resource.id}')">
                    <div class="permission-cell ${permissionClass}">${permissionText}</div>
                </td>`;
            });
            matrixHTML += '</tr>';
        });
        
        matrixHTML += '</tbody></table>';
        container.innerHTML = matrixHTML;
    }

    // Update analytics
    updateAnalytics() {
        document.getElementById('totalRoles').textContent = this.roles.size;
        document.getElementById('totalResources').textContent = this.resources.size;
        
        let totalPermissions = 0;
        this.permissions.forEach(rolePerms => {
            rolePerms.forEach(level => {
                if (level > 0) totalPermissions++;
            });
        });
        document.getElementById('totalPermissions').textContent = totalPermissions;
        
        const maxPermissions = this.roles.size * this.resources.size;
        const coverage = maxPermissions > 0 ? Math.round((totalPermissions / maxPermissions) * 100) : 0;
        document.getElementById('matrixCoverage').textContent = `${coverage}%`;
    }

    // Select role for permission editing
    selectRole(roleId) {
        this.selectedRole = roleId;
        document.querySelectorAll('.role-item').forEach(item => item.classList.remove('selected'));
        event.target.classList.add('selected');
        this.updatePermissionControls();
    }

    // Select resource for permission editing  
    selectResource(resourceId) {
        this.selectedResource = resourceId;
        document.querySelectorAll('.resource-item').forEach(item => item.classList.remove('selected'));
        event.target.classList.add('selected');
        this.updatePermissionControls();
    }

    // Update permission controls
    updatePermissionControls() {
        const controlsDiv = document.getElementById('permissionControls');
        const currentDiv = document.getElementById('currentPermission');
        
        if (this.selectedRole && this.selectedResource) {
            controlsDiv.style.display = 'block';
            const role = this.roles.get(this.selectedRole);
            const resource = this.resources.get(this.selectedResource);
            const currentLevel = this.permissions.get(this.selectedRole)?.get(this.selectedResource) || 0;
            const levelNames = ['None', 'Read', 'Write', 'Admin'];
            
            currentDiv.innerHTML = `
                <strong>Current Permission:</strong><br>
                Role: <span style="color: #74b9ff;">${role.name}</span><br>
                Resource: <span style="color: #0984e3;">${resource.name}</span><br>
                Level: <span style="color: #00b894;">${levelNames[currentLevel]}</span>
            `;
        } else {
            controlsDiv.style.display = 'none';
        }
    }

    // Set permission level
    setPermissionLevel(level) {
        if (this.selectedRole && this.selectedResource) {
            this.setPermission(this.selectedRole, this.selectedResource, level);
            this.updatePermissionControls();
            this.renderMatrix();
            this.updateAnalytics();
        }
    }

    // Toggle permission in matrix
    togglePermission(roleId, resourceId) {
        const currentLevel = this.permissions.get(roleId)?.get(resourceId) || 0;
        const newLevel = (currentLevel + 1) % 4;
        this.setPermission(roleId, resourceId, newLevel);
        this.renderMatrix();
        this.updateAnalytics();
    }

    // Show modal
    showModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
    }

    // Hide modal
    hideModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    // Add role
    addRole() {
        const name = document.getElementById('roleName').value.trim();
        const description = document.getElementById('roleDescription').value.trim();
        const level = parseInt(document.getElementById('roleLevel').value);
        
        if (!name) {
            alert('Please enter a role name');
            return;
        }
        
        const id = name.toLowerCase().replace(/\s+/g, '-');
        this.addRoleData(id, { name, description, level });
        
        this.renderRoles();
        this.renderPermissionsManager();
        this.renderMatrix();
        this.updateAnalytics();
        this.hideModal('addRoleModal');
        
        // Clear form
        document.getElementById('roleName').value = '';
        document.getElementById('roleDescription').value = '';
        document.getElementById('roleLevel').value = '1';
    }

    // Add resource
    addResource() {
        const name = document.getElementById('resourceName').value.trim();
        const type = document.getElementById('resourceType').value;
        const sensitivity = document.getElementById('resourceSensitivity').value;
        
        if (!name) {
            alert('Please enter a resource name');
            return;
        }
        
        const id = name.toLowerCase().replace(/\s+/g, '-');
        this.addResourceData(id, { name, type, sensitivity });
        
        this.renderResources();
        this.renderPermissionsManager();
        this.renderMatrix();
        this.updateAnalytics();
        this.hideModal('addResourceModal');
        
        // Clear form
        document.getElementById('resourceName').value = '';
        document.getElementById('resourceType').value = 'data';
        document.getElementById('resourceSensitivity').value = 'public';
    }

    // Export matrix
    exportMatrix() {
        const matrixData = {
            roles: Array.from(this.roles.entries()),
            resources: Array.from(this.resources.entries()),
            permissions: Array.from(this.permissions.entries()).map(([roleId, resourceMap]) => [
                roleId,
                Array.from(resourceMap.entries())
            ])
        };
        
        const dataStr = JSON.stringify(matrixData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `access-control-matrix-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        alert('Access control matrix exported successfully!');
    }

    // Import matrix
    importMatrix() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const matrixData = JSON.parse(e.target.result);
                        
                        // Clear existing data
                        this.roles.clear();
                        this.resources.clear();
                        this.permissions.clear();
                        
                        // Load imported data
                        matrixData.roles.forEach(([id, role]) => {
                            this.roles.set(id, role);
                        });
                        
                        matrixData.resources.forEach(([id, resource]) => {
                            this.resources.set(id, resource);
                        });
                        
                        matrixData.permissions.forEach(([roleId, resourcePerms]) => {
                            const rolePermMap = new Map();
                            resourcePerms.forEach(([resourceId, level]) => {
                                rolePermMap.set(resourceId, level);
                            });
                            this.permissions.set(roleId, rolePermMap);
                        });
                        
                        // Refresh all displays
                        this.renderRoles();
                        this.renderResources();
                        this.renderPermissionsManager();
                        this.renderMatrix();
                        this.updateAnalytics();
                        
                        alert('Access control matrix imported successfully!');
                    } catch (error) {
                        alert('Error importing matrix: Invalid file format');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    // Validate matrix
    validateMatrix() {
        const issues = [];
        
        // Check for roles without any permissions
        this.roles.forEach((role, roleId) => {
            const rolePerms = this.permissions.get(roleId);
            if (!rolePerms || rolePerms.size === 0) {
                issues.push(`Role "${role.name}" has no permissions assigned`);
            }
        });
        
        // Check for resources with no access
        this.resources.forEach((resource, resourceId) => {
            let hasAccess = false;
            this.permissions.forEach(rolePerms => {
                if (rolePerms.get(resourceId) > 0) {
                    hasAccess = true;
                }
            });
            if (!hasAccess) {
                issues.push(`Resource "${resource.name}" has no access permissions`);
            }
        });
        
        // Check for privilege escalation issues
        this.roles.forEach((role, roleId) => {
            this.resources.forEach((resource, resourceId) => {
                const permission = this.permissions.get(roleId)?.get(resourceId) || 0;
                if (role.level < 3 && permission === 3 && resource.sensitivity === 'restricted') {
                    issues.push(`Low-level role "${role.name}" has admin access to restricted resource "${resource.name}"`);
                }
            });
        });
        
        if (issues.length === 0) {
            alert('✅ Matrix validation passed! No issues found.');
        } else {
            alert(`⚠️ Matrix validation found ${issues.length} issues:\n\n${issues.join('\n')}`);
        }
    }
}

// Global functions for HTML onclick events
let matrixManager;

window.addEventListener('DOMContentLoaded', () => {
    matrixManager = new AccessControlMatrixManager();
});

function showTab(tabName) {
    matrixManager.showTab(tabName);
}

function showAddRoleModal() {
    matrixManager.showModal('addRoleModal');
}

function showAddResourceModal() {
    matrixManager.showModal('addResourceModal');
}

function hideModal(modalId) {
    matrixManager.hideModal(modalId);
}

function addRole() {
    matrixManager.addRole();
}

function addResource() {
    matrixManager.addResource();
}

function selectRole(roleId) {
    matrixManager.selectRole(roleId);
}

function selectResource(resourceId) {
    matrixManager.selectResource(resourceId);
}

function setPermissionLevel(level) {
    matrixManager.setPermissionLevel(level);
}

function togglePermission(roleId, resourceId) {
    matrixManager.togglePermission(roleId, resourceId);
}

function exportMatrix() {
    matrixManager.exportMatrix();
}

function importMatrix() {
    matrixManager.importMatrix();
}

function validateMatrix() {
    matrixManager.validateMatrix();
}

function editRole(roleId) {
    alert('Edit role functionality would be implemented here');
}

function deleteRole(roleId) {
    if (confirm('Are you sure you want to delete this role?')) {
        matrixManager.roles.delete(roleId);
        matrixManager.permissions.delete(roleId);
        matrixManager.renderRoles();
        matrixManager.renderMatrix();
        matrixManager.updateAnalytics();
    }
}

function editResource(resourceId) {
    alert('Edit resource functionality would be implemented here');
}

function deleteResource(resourceId) {
    if (confirm('Are you sure you want to delete this resource?')) {
        matrixManager.resources.delete(resourceId);
        matrixManager.permissions.forEach(rolePerms => {
            rolePerms.delete(resourceId);
        });
        matrixManager.renderResources();
        matrixManager.renderMatrix();
        matrixManager.updateAnalytics();
    }
}

console.log('Access Control Matrix Manager loaded');
