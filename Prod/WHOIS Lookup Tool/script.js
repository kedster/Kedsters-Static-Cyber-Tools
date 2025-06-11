        let currentRequest = null;

        function fillDomain(domain) {
            document.getElementById('domainInput').value = domain;
            document.getElementById('domainInput').focus();
        }

        function cleanDomain(domain) {
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

        function validateDomain(domain) {
            const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
            return domainRegex.test(domain);
        }

        function showLoading() {
            document.getElementById('loading').style.display = 'block';
            document.getElementById('results').style.display = 'none';
            document.getElementById('error').style.display = 'none';
            document.getElementById('searchBtn').disabled = true;
            document.getElementById('btnText').textContent = 'Looking up...';
        }

        function hideLoading() {
            document.getElementById('loading').style.display = 'none';
            document.getElementById('searchBtn').disabled = false;
            document.getElementById('btnText').textContent = 'Lookup';
        }

        function showError(message) {
            const errorDiv = document.getElementById('error');
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            hideLoading();
        }

        function showResults(domain, whoisData) {
            document.getElementById('domainTitle').textContent = `Domain Information for ${domain}`;
            document.getElementById('whoisData').textContent = whoisData;
            document.getElementById('results').style.display = 'block';
            hideLoading();
        }

        async function performWhoisLookup() {
            const domain = cleanDomain(document.getElementById('domainInput').value);
            
            if (!domain) {
                showError('Please enter a domain name');
                return;
            }

            if (!validateDomain(domain)) {
                showError('Please enter a valid domain name (e.g., google.com)');
                return;
            }

            showLoading();

            try {
                // Cancel previous request if still pending
                if (currentRequest) {
                    currentRequest.abort();
                }

                // Create AbortController for this request
                currentRequest = new AbortController();

                // Try multiple WHOIS API services
                const apis = [
                    {
                        name: 'RDAP',
                        url: `https://rdap.verisign.com/com/v1/domain/${domain}`,
                        parser: parseRDAP
                    },
                    {
                        name: 'Backup RDAP',
                        url: `https://rdap.org/domain/${domain}`,
                        parser: parseRDAP
                    }
                ];

                let lastError = null;

                for (const api of apis) {
                    try {
                        const response = await fetch(api.url, {
                            signal: currentRequest.signal,
                            headers: {
                                'Accept': 'application/json'
                            }
                        });

                        if (response.ok) {
                            const data = await response.json();
                            const whoisText = api.parser(data);
                            showResults(domain, whoisText);
                            return;
                        }
                    } catch (error) {
                        if (error.name === 'AbortError') {
                            return; // Request was cancelled
                        }
                        lastError = error;
                        continue; // Try next API
                    }
                }

                // If all APIs fail, try a simpler approach
                try {
                    const response = await fetch(`https://networkcalc.com/api/dns/lookup/${domain}`, {
                        signal: currentRequest.signal
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        const whoisText = parseNetworkCalc(data, domain);
                        showResults(domain, whoisText);
                        return;
                    }
                } catch (error) {
                    // Continue to fallback
                }

                // Fallback: Show basic DNS information
                showBasicDomainInfo(domain);

            } catch (error) {
                if (error.name === 'AbortError') {
                    return; // Request was cancelled
                }
                showError(`Error looking up domain: ${error.message}`);
            } finally {
                currentRequest = null;
            }
        }

        function parseRDAP(data) {
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

        function parseNetworkCalc(data, domain) {
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

        async function showBasicDomainInfo(domain) {
            let result = `Domain Name: ${domain}\n`;
            result += `Lookup Date: ${new Date().toLocaleString()}\n\n`;
            result += `Basic domain information:\n`;
            result += `- This appears to be a valid domain name\n`;
            result += `- For detailed WHOIS information, you may need to:\n`;
            result += `  1. Use a dedicated WHOIS client\n`;
            result += `  2. Visit the domain registrar's website\n`;
            result += `  3. Use command line: whois ${domain}\n\n`;
            result += `Note: Some WHOIS servers may block web-based requests\n`;
            result += `or require direct connections for security reasons.`;
            
            showResults(domain, result);
        }

        // Allow Enter key to trigger search
        document.getElementById('domainInput').addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                performWhoisLookup();
            }
        });

        // Focus on input when page loads
        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('domainInput').focus();
        });