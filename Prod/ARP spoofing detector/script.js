// ARP Spoofing Detector
// Network security tool for detecting ARP spoofing attacks

class ARPSpoofingDetector {
    constructor() {
        this.isMonitoring = false;
        this.monitoringInterval = null;
        this.arpTable = new Map();
        this.macVendorCache = new Map();
        this.alerts = [];
        this.stats = {
            devicesScanned: 0,
            anomaliesDetected: 0,
            monitoringStartTime: null
        };
        this.networkConfig = {
            subnet: '192.168.1.0/24',
            gateway: '192.168.1.1',
            localIP: '192.168.1.100'
        };
        
        this.init();
    }

    init() {
        this.detectNetworkInfo();
        this.loadMacVendorDatabase();
        this.startNetworkInfoUpdater();
        console.log('ARP Spoofing Detector initialized');
    }

    // Simulate network detection (browser limitations)
    detectNetworkInfo() {
        // Simulate network detection with random but realistic values
        const subnets = ['192.168.1.0/24', '192.168.0.0/24', '10.0.0.0/24', '172.16.0.0/24'];
        const randomSubnet = subnets[Math.floor(Math.random() * subnets.length)];
        
        this.networkConfig.subnet = randomSubnet;
        this.networkConfig.gateway = randomSubnet.split('/')[0].replace('.0', '.1');
        this.networkConfig.localIP = randomSubnet.split('/')[0].replace('.0', '.' + (Math.floor(Math.random() * 200) + 10));
        
        this.updateNetworkDisplay();
        this.logMessage('Network configuration detected automatically', 'info');
    }

    // Update network display
    updateNetworkDisplay() {
        document.getElementById('currentNetwork').textContent = this.networkConfig.subnet;
        document.getElementById('gatewayIP').textContent = this.networkConfig.gateway;
        document.getElementById('localIP').textContent = this.networkConfig.localIP;
        document.getElementById('networkRange').textContent = this.networkConfig.subnet;
    }

    // Start network info updater
    startNetworkInfoUpdater() {
        setInterval(() => {
            if (this.stats.monitoringStartTime) {
                const elapsed = Math.floor((Date.now() - this.stats.monitoringStartTime) / 60000);
                document.getElementById('monitoringTime').textContent = `${elapsed}m`;
            }
        }, 10000);
    }

    // Load MAC vendor database (simplified)
    loadMacVendorDatabase() {
        // Common MAC address prefixes and vendors
        this.macVendorCache.set('00:1B:63', 'Apple Inc.');
        this.macVendorCache.set('3C:15:C2', 'Apple Inc.');
        this.macVendorCache.set('F0:18:98', 'Apple Inc.');
        this.macVendorCache.set('08:00:27', 'VirtualBox');
        this.macVendorCache.set('00:0C:29', 'VMware Inc.');
        this.macVendorCache.set('00:50:56', 'VMware Inc.');
        this.macVendorCache.set('00:15:5D', 'Microsoft');
        this.macVendorCache.set('00:03:FF', 'Microsoft');
        this.macVendorCache.set('DC:A6:32', 'Raspberry Pi Foundation');
        this.macVendorCache.set('B8:27:EB', 'Raspberry Pi Foundation');
        this.macVendorCache.set('E4:5F:01', 'Raspberry Pi Foundation');
        this.macVendorCache.set('00:16:3E', 'Xensource Inc.');
        this.macVendorCache.set('52:54:00', 'QEMU');
        this.macVendorCache.set('02:00:4C', 'Unknown/Generic');
        this.macVendorCache.set('00:E0:4C', 'Realtek');
        this.macVendorCache.set('00:D0:C9', 'Intel');
        this.macVendorCache.set('00:1F:3C', 'Cisco');
        this.macVendorCache.set('00:24:A5', 'D-Link');
        this.macVendorCache.set('00:26:5A', 'Netgear');
    }

    // Get vendor from MAC address
    getMacVendor(macAddress) {
        if (!macAddress) return 'Unknown';
        
        const prefix = macAddress.toUpperCase().substring(0, 8);
        return this.macVendorCache.get(prefix) || 'Unknown Vendor';
    }

    // Update network configuration manually
    updateNetworkConfig() {
        const targetNetwork = document.getElementById('targetNetwork').value.trim();
        const gatewayAddress = document.getElementById('gatewayAddress').value.trim();
        
        if (targetNetwork && this.isValidCIDR(targetNetwork)) {
            this.networkConfig.subnet = targetNetwork;
        }
        
        if (gatewayAddress && this.isValidIP(gatewayAddress)) {
            this.networkConfig.gateway = gatewayAddress;
        }
        
        this.updateNetworkDisplay();
        this.logMessage('Network configuration updated manually', 'info');
    }

    // Validate CIDR notation
    isValidCIDR(cidr) {
        const cidrRegex = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;
        return cidrRegex.test(cidr);
    }

    // Validate IP address
    isValidIP(ip) {
        const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
        return ipRegex.test(ip) && ip.split('.').every(octet => parseInt(octet) <= 255);
    }

    // Start ARP monitoring
    startMonitoring() {
        if (this.isMonitoring) return;
        
        this.isMonitoring = true;
        this.stats.monitoringStartTime = Date.now();
        
        document.getElementById('startMonitoring').disabled = true;
        document.getElementById('stopMonitoring').disabled = false;
        
        this.updateNetworkStatus('monitoring', 'Monitoring Active');
        this.logMessage('ARP monitoring started', 'info');
        
        // Start monitoring loop
        this.monitoringInterval = setInterval(() => {
            this.performARPScan();
        }, parseInt(document.getElementById('scanInterval').value) * 1000);
        
        // Perform initial scan
        this.performARPScan();
    }

    // Stop ARP monitoring
    stopMonitoring() {
        if (!this.isMonitoring) return;
        
        this.isMonitoring = false;
        
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }
        
        document.getElementById('startMonitoring').disabled = false;
        document.getElementById('stopMonitoring').disabled = true;
        
        this.updateNetworkStatus('safe', 'Network Safe');
        this.logMessage('ARP monitoring stopped', 'info');
    }

    // Perform ARP scan (simulated)
    performARPScan() {
        const scanMode = document.getElementById('scanMode').value;
        this.logMessage(`Performing ${scanMode} ARP scan`, 'info');
        
        // Simulate discovering devices on network
        const devices = this.generateNetworkDevices();
        
        devices.forEach(device => {
            this.processARPEntry(device.ip, device.mac, device.isGateway);
        });
        
        this.updateARPTable();
        this.analyzeForSpoofing();
        this.updateStats();
        
        document.getElementById('lastCheck').textContent = `Last scan: ${new Date().toLocaleTimeString()}`;
    }

    // Generate simulated network devices
    generateNetworkDevices() {
        const devices = [];
        const baseIP = this.networkConfig.subnet.split('/')[0].split('.').slice(0, 3).join('.');
        
        // Always include gateway
        devices.push({
            ip: this.networkConfig.gateway,
            mac: this.generateMACAddress('00:1F:3C'), // Cisco router
            isGateway: true
        });
        
        // Generate random devices
        const deviceCount = Math.floor(Math.random() * 15) + 5; // 5-20 devices
        for (let i = 0; i < deviceCount; i++) {
            const hostId = Math.floor(Math.random() * 200) + 10;
            const ip = `${baseIP}.${hostId}`;
            
            devices.push({
                ip: ip,
                mac: this.generateRandomMACAddress(),
                isGateway: false
            });
        }
        
        return devices;
    }

    // Generate MAC address with specific prefix
    generateMACAddress(prefix) {
        const suffixes = Array.from({length: 3}, () => 
            Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase()
        );
        return `${prefix}:${suffixes.join(':')}`;
    }

    // Generate random MAC address
    generateRandomMACAddress() {
        const prefixes = Array.from(this.macVendorCache.keys());
        const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        return this.generateMACAddress(randomPrefix);
    }

    // Process ARP entry
    processARPEntry(ip, mac, isGateway = false) {
        const timestamp = new Date();
        const vendor = this.getMacVendor(mac);
        
        const existingEntry = this.arpTable.get(ip);
        let status = 'normal';
        let notes = '';
        
        if (existingEntry) {
            if (existingEntry.mac !== mac) {
                // MAC address changed for same IP - potential spoofing
                status = 'suspicious';
                notes = `MAC changed from ${existingEntry.mac}`;
                this.createAlert('MAC Address Conflict', 
                    `IP ${ip} has changed MAC from ${existingEntry.mac} to ${mac}`,
                    'high');
            } else {
                // Same MAC, just update timestamp
                existingEntry.lastSeen = timestamp;
                existingEntry.status = status;
                return;
            }
        }
        
        if (isGateway) {
            notes += (notes ? ', ' : '') + 'Gateway device';
            status = status === 'normal' ? 'gateway' : status;
        }
        
        this.arpTable.set(ip, {
            ip: ip,
            mac: mac,
            vendor: vendor,
            lastSeen: timestamp,
            status: status,
            notes: notes,
            isGateway: isGateway
        });
        
        this.stats.devicesScanned = this.arpTable.size;
    }

    // Analyze for spoofing patterns
    analyzeForSpoofing() {
        const macToIPs = new Map();
        
        // Group IPs by MAC address
        this.arpTable.forEach((entry, ip) => {
            if (!macToIPs.has(entry.mac)) {
                macToIPs.set(entry.mac, []);
            }
            macToIPs.get(entry.mac).push(ip);
        });
        
        // Check for multiple IPs with same MAC (potential ARP spoofing)
        macToIPs.forEach((ips, mac) => {
            if (ips.length > 1) {
                const vendor = this.getMacVendor(mac);
                this.createAlert('Duplicate MAC Address',
                    `MAC ${mac} (${vendor}) is associated with multiple IPs: ${ips.join(', ')}`,
                    'medium');
                
                ips.forEach(ip => {
                    const entry = this.arpTable.get(ip);
                    if (entry) {
                        entry.status = 'malicious';
                        entry.notes += (entry.notes ? ', ' : '') + 'Duplicate MAC detected';
                    }
                });
            }
        });
    }

    // Create security alert
    createAlert(title, description, severity) {
        const alert = {
            id: Date.now(),
            title: title,
            description: description,
            severity: severity,
            timestamp: new Date(),
            resolved: false
        };
        
        this.alerts.unshift(alert);
        this.stats.anomaliesDetected++;
        
        this.updateAlertsDisplay();
        this.updateNetworkStatus('warning', `${this.alerts.length} Security Alerts`);
        this.logMessage(`🚨 ALERT: ${title} - ${description}`, 'error');
    }

    // Update alerts display
    updateAlertsDisplay() {
        const container = document.getElementById('alertsContainer');
        
        if (this.alerts.length === 0) {
            container.innerHTML = '<div class="no-alerts">No security alerts. Network appears normal.</div>';
            return;
        }
        
        let html = '';
        this.alerts.forEach(alert => {
            html += `
                <div class="alert-item">
                    <div class="alert-title">${alert.title} (${alert.severity.toUpperCase()})</div>
                    <div class="alert-details">${alert.description}</div>
                    <div class="alert-timestamp">Detected: ${alert.timestamp.toLocaleString()}</div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }

    // Update ARP table display
    updateARPTable() {
        const tbody = document.getElementById('arpTableBody');
        
        if (this.arpTable.size === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="no-data">No ARP entries detected</td></tr>';
            return;
        }
        
        let html = '';
        const sortedEntries = Array.from(this.arpTable.values()).sort((a, b) => {
            // Sort gateways first, then by IP
            if (a.isGateway && !b.isGateway) return -1;
            if (!a.isGateway && b.isGateway) return 1;
            return a.ip.localeCompare(b.ip, undefined, { numeric: true });
        });
        
        sortedEntries.forEach(entry => {
            const statusClass = entry.status === 'normal' || entry.status === 'gateway' ? 'status-normal' :
                              entry.status === 'suspicious' ? 'status-suspicious' : 'status-malicious';
            
            html += `
                <tr>
                    <td>${entry.ip}</td>
                    <td style="font-family: monospace">${entry.mac}</td>
                    <td>${entry.vendor}</td>
                    <td>${entry.lastSeen.toLocaleTimeString()}</td>
                    <td class="${statusClass}">${entry.status.toUpperCase()}</td>
                    <td>${entry.notes || '-'}</td>
                </tr>
            `;
        });
        
        tbody.innerHTML = html;
    }

    // Update network status
    updateNetworkStatus(status, title) {
        const statusCard = document.querySelector('.status-card');
        const statusTitle = document.getElementById('networkStatus');
        const icon = statusCard.querySelector('.status-icon');
        
        statusCard.className = `status-card ${status}`;
        statusTitle.textContent = title;
        
        switch (status) {
            case 'safe':
                icon.textContent = '🛡️';
                break;
            case 'warning':
                icon.textContent = '⚠️';
                break;
            case 'danger':
                icon.textContent = '🚨';
                break;
            case 'monitoring':
                icon.textContent = '📡';
                break;
        }
    }

    // Update statistics
    updateStats() {
        document.getElementById('devicesScanned').textContent = this.stats.devicesScanned;
        document.getElementById('anomaliesDetected').textContent = this.stats.anomaliesDetected;
    }

    // Simulate ARP spoofing attack for demo
    simulateAttack() {
        if (!this.isMonitoring) {
            alert('Please start monitoring first');
            return;
        }
        
        this.logMessage('Simulating ARP spoofing attack...', 'warning');
        
        // Simulate gateway MAC address spoofing
        setTimeout(() => {
            const spoofedMAC = this.generateMACAddress('02:00:4C'); // Suspicious MAC
            this.processARPEntry(this.networkConfig.gateway, spoofedMAC, true);
            this.updateARPTable();
            
            // Simulate another device claiming the same IP
            setTimeout(() => {
                const anotherMAC = this.generateMACAddress('00:E0:4C');
                this.processARPEntry('192.168.1.50', spoofedMAC, false);
                this.processARPEntry('192.168.1.51', spoofedMAC, false);
                this.updateARPTable();
                this.analyzeForSpoofing();
                this.updateStats();
            }, 2000);
            
        }, 1000);
        
        this.logMessage('Attack simulation completed', 'info');
    }

    // Log message to activity log
    logMessage(message, type = 'normal') {
        const log = document.getElementById('activityLog');
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
let arpDetector;

window.addEventListener('DOMContentLoaded', () => {
    arpDetector = new ARPSpoofingDetector();
});

function updateNetworkConfig() {
    arpDetector.updateNetworkConfig();
}

function startMonitoring() {
    arpDetector.startMonitoring();
}

function stopMonitoring() {
    arpDetector.stopMonitoring();
}

function simulateAttack() {
    arpDetector.simulateAttack();
}

console.log('ARP Spoofing Detector loaded');
