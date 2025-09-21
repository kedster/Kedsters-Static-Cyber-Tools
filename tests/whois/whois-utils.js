// WHOIS Lookup Tool - Testable Functions
// Extracted from Prod/WHOIS Lookup Tool/script.js for testing purposes

export function cleanDomain(domain) {
    // Remove protocol if present
    domain = domain.replace(/^https?:\/\//, '');
    // Remove www if present
    domain = domain.replace(/^www\./, '');
    // Remove trailing slash and path
    domain = domain.split('/')[0];
    // Remove port if present
    domain = domain.split(':')[0];
    return domain.toLowerCase().trim();
}

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

export function parseRDAP(data) {
    let result = '';
    
    if (data.ldhName) {
        result += `Domain Name: ${data.ldhName}\n`;
    }
    
    if (data.status) {
        result += `Status: ${data.status.join(', ')}\n`;
    }
    
    if (data.events) {
        data.events.forEach(event => {
            if (event.eventAction && event.eventDate) {
                result += `${event.eventAction}: ${new Date(event.eventDate).toLocaleDateString()}\n`;
            }
        });
    }
    
    if (data.entities) {
        data.entities.forEach(entity => {
            if (entity.roles) {
                result += `\n${entity.roles.join(', ')}:\n`;
            }
            if (entity.vcardArray && entity.vcardArray[1]) {
                entity.vcardArray[1].forEach(field => {
                    if (field[0] === 'fn') {
                        result += `  Name: ${field[3]}\n`;
                    } else if (field[0] === 'org') {
                        result += `  Organization: ${field[3]}\n`;
                    } else if (field[0] === 'email') {
                        result += `  Email: ${field[3]}\n`;
                    }
                });
            }
        });
    }
    
    if (data.nameservers) {
        result += '\nName Servers:\n';
        data.nameservers.forEach(ns => {
            result += `  ${ns.ldhName}\n`;
        });
    }
    
    return result || 'WHOIS data retrieved successfully, but format may not be fully supported.';
}

export function parseNetworkCalc(data, domain) {
    let result = `Domain Name: ${domain}\n`;
    
    if (data.records) {
        Object.keys(data.records).forEach(type => {
            if (data.records[type] && data.records[type].length > 0) {
                result += `\n${type} Records:\n`;
                data.records[type].forEach(record => {
                    result += `  ${record.address || record.target || record.value}\n`;
                });
            }
        });
    }
    
    return result;
}