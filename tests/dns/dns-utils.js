// DNS Poisoning Checker - Testable Functions
// Extracted from Prod/DNS poisoning checker/script.js for testing purposes

export const DNS_SERVERS = [
    { name: 'Google Primary', url: 'https://dns.google/resolve', type: 'google' },
    { name: 'Google Secondary', url: 'https://8.8.4.4/resolve', type: 'google' },
    { name: 'HackerTarget', url: 'https://api.hackertarget.com/dnslookup/', type: 'hackertarget' },
    { name: 'DNS.SB', url: 'https://doh.dns.sb/dns-query', type: 'doh' }
];

export function validateDomain(domain) {
    // Basic domain validation that handles subdomains
    if (!domain || typeof domain !== 'string') return false;
    
    // Check overall length
    if (domain.length > 253) return false;
    
    // Split by dots and validate each part
    const parts = domain.split('.');
    if (parts.length < 2) return false;
    
    // Validate each part
    for (const part of parts) {
        if (part.length === 0 || part.length > 63) return false;
        if (part.startsWith('-') || part.endsWith('-')) return false;
        if (!/^[a-zA-Z0-9-]+$/.test(part)) return false;
    }
    
    // Last part (TLD) should be at least 2 characters and not start with number
    const tld = parts[parts.length - 1];
    if (tld.length < 2 || /^\d/.test(tld)) return false;
    
    return true;
}

export function detectInconsistencies(serverResults) {
    const inconsistencies = [];
    const servers = Object.keys(serverResults);
    
    if (servers.length < 2) return inconsistencies;

    // Compare each server's results with others
    for (let i = 0; i < servers.length; i++) {
        for (let j = i + 1; j < servers.length; j++) {
            const server1 = servers[i];
            const server2 = servers[j];
            const addresses1 = serverResults[server1];
            const addresses2 = serverResults[server2];

            // Check if address lists are different
            if (JSON.stringify(addresses1) !== JSON.stringify(addresses2)) {
                inconsistencies.push({
                    servers: [server1, server2],
                    description: `${server1} returned [${addresses1.join(', ')}] while ${server2} returned [${addresses2.join(', ')}]`
                });
            }
        }
    }

    return inconsistencies;
}

export function parseGoogleDNSResponse(data) {
    const addresses = [];
    if (data && data.Answer) {
        data.Answer.forEach(answer => {
            if (answer.type === 1) { // A record
                addresses.push(answer.data);
            }
        });
    }
    return addresses;
}

export function parseHackerTargetResponse(text) {
    const addresses = [];
    const lines = text.split('\n');
    
    lines.forEach(line => {
        if (line.includes('has address')) {
            const match = line.match(/has address (\d+\.\d+\.\d+\.\d+)/);
            if (match) {
                addresses.push(match[1]);
            }
        }
    });
    
    return addresses;
}

export function parseDOHResponse(data) {
    const addresses = [];
    if (data && data.Answer) {
        data.Answer.forEach(answer => {
            if (answer.type === 1) { // A record
                addresses.push(answer.data);
            }
        });
    }
    return addresses;
}

export function analyzeResults(results) {
    const allAddresses = [];
    const serverResults = {};
    
    results.forEach(result => {
        if (result.status === 'success' && result.addresses.length > 0) {
            serverResults[result.server] = result.addresses.sort();
            result.addresses.forEach(addr => {
                if (!allAddresses.includes(addr)) {
                    allAddresses.push(addr);
                }
            });
        }
    });

    const inconsistencies = detectInconsistencies(serverResults);
    const overallStatus = inconsistencies.length > 0 ? 'warning' : 'safe';
    
    return {
        serverResults,
        inconsistencies,
        overallStatus,
        allAddresses,
        successfulQueries: results.filter(r => r.status === 'success').length,
        totalQueries: results.length
    };
}

export function categorizeResult(result, inconsistencies) {
    if (result.status === 'error') {
        return {
            cardClass: 'result-card danger',
            statusClass: 'status danger',
            statusText: 'ERROR'
        };
    }
    
    if (result.addresses.length === 0) {
        return {
            cardClass: 'result-card warning',
            statusClass: 'status warning', 
            statusText: 'NO RESULTS'
        };
    }
    
    const isConsistent = !inconsistencies.some(inc => 
        inc.servers.includes(result.server)
    );
    
    if (isConsistent) {
        return {
            cardClass: 'result-card safe',
            statusClass: 'status safe',
            statusText: 'CONSISTENT'
        };
    } else {
        return {
            cardClass: 'result-card warning',
            statusClass: 'status warning',
            statusText: 'INCONSISTENT'
        };
    }
}