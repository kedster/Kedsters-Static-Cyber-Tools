       const DNS_OVER_HTTPS_SERVERS = [
            { name: 'Cloudflare', url: 'https://1.1.1.1/dns-query' },
            { name: 'Google', url: 'https://8.8.8.8/resolve' },
            { name: 'Quad9', url: 'https://9.9.9.9/dns-query' },
            { name: 'OpenDNS', url: 'https://208.67.222.222/dns-query' }
        ];

        let dnsResults = [];

        async function queryDNS(server, domain) {
            try {
                let url, options;
                
                if (server.name === 'Google') {
                    // Google DNS has a different API format
                    url = `${server.url}?name=${domain}&type=A`;
                    options = {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json'
                        }
                    };
                } else {
                    // Cloudflare/Quad9/OpenDNS use standard DNS-over-HTTPS
                    url = server.url;
                    options = {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/dns-json',
                            'Content-Type': 'application/dns-json'
                        },
                        body: JSON.stringify({
                            name: domain,
                            type: 'A'
                        })
                    };
                }

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000);
                
                const response = await fetch(url, {
                    ...options,
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const data = await response.json();
                const addresses = [];

                if (server.name === 'Google') {
                    if (data.Answer) {
                        data.Answer.forEach(answer => {
                            if (answer.type === 1) { // A record
                                addresses.push(answer.data);
                            }
                        });
                    }
                } else {
                    if (data.Answer) {
                        data.Answer.forEach(answer => {
                            if (answer.type === 1) { // A record
                                addresses.push(answer.data);
                            }
                        });
                    }
                }

                return {
                    server: server.name,
                    addresses: addresses,
                    status: 'success',
                    responseTime: Date.now()
                };

            } catch (error) {
                return {
                    server: server.name,
                    addresses: [],
                    status: 'error',
                    error: error.message,
                    responseTime: Date.now()
                };
            }
        }

        async function checkDNS() {
            const domain = document.getElementById('domainInput').value.trim();
            const resultsDiv = document.getElementById('results');
            const checkBtn = document.getElementById('checkBtn');

            if (!domain) {
                alert('Please enter a domain name');
                return;
            }

            // Validate domain format
            const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])*$/;
            if (!domainRegex.test(domain)) {
                alert('Please enter a valid domain name');
                return;
            }

            checkBtn.disabled = true;
            checkBtn.textContent = 'Checking...';
            
            resultsDiv.innerHTML = `
                <div class="loading">
                    <div class="spinner"></div>
                    <span>Querying multiple DNS servers...</span>
                </div>
            `;

            dnsResults = [];
            const startTime = Date.now();

            // Query all DNS servers concurrently
            const promises = DNS_OVER_HTTPS_SERVERS.map(server => queryDNS(server, domain));
            const results = await Promise.all(promises);

            const endTime = Date.now();
            dnsResults = results;

            displayResults(domain, results, endTime - startTime);
            
            checkBtn.disabled = false;
            checkBtn.textContent = 'Check DNS';
        }

        function displayResults(domain, results, totalTime) {
            const resultsDiv = document.getElementById('results');
            
            // Analyze results for inconsistencies
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

            // Check for inconsistencies
            const inconsistencies = detectInconsistencies(serverResults);
            const overallStatus = inconsistencies.length > 0 ? 'warning' : 'safe';

            let html = '';

            // Display results for each DNS server
            results.forEach(result => {
                let cardClass = 'result-card';
                let statusClass = 'status';
                let statusText = '';

                if (result.status === 'error') {
                    cardClass += ' danger';
                    statusClass += ' danger';
                    statusText = 'ERROR';
                } else if (result.addresses.length === 0) {
                    cardClass += ' warning';
                    statusClass += ' warning';
                    statusText = 'NO RESULTS';
                } else {
                    const isConsistent = !inconsistencies.some(inc => 
                        inc.servers.includes(result.server)
                    );
                    if (isConsistent) {
                        cardClass += ' safe';
                        statusClass += ' safe';
                        statusText = 'CONSISTENT';
                    } else {
                        cardClass += ' warning';
                        statusClass += ' warning';
                        statusText = 'INCONSISTENT';
                    }
                }

                html += `
                    <div class="${cardClass}">
                        <div class="dns-server">${result.server} DNS</div>
                        ${result.status === 'error' ? 
                            `<div class="error">Error: ${result.error}</div>` :
                            result.addresses.length > 0 ? 
                                result.addresses.map(addr => 
                                    `<div class="ip-address">${addr}</div>`
                                ).join('') :
                                '<div class="ip-address">No A records found</div>'
                        }
                        <div class="${statusClass}">${statusText}</div>
                    </div>
                `;
            });

            // Summary
            let summaryClass = overallStatus === 'safe' ? 'safe' : 'warning';
            let summaryText = '';
            let summaryIcon = '';

            if (overallStatus === 'safe') {
                summaryIcon = '✅';
                summaryText = `DNS responses are consistent across all servers. No signs of DNS poisoning detected for ${domain}.`;
            } else {
                summaryIcon = '⚠️';
                summaryText = `Inconsistent DNS responses detected! This could indicate DNS poisoning or server issues for ${domain}.`;
                
                if (inconsistencies.length > 0) {
                    summaryText += '<br><br><strong>Inconsistencies found:</strong><br>';
                    inconsistencies.forEach(inc => {
                        summaryText += `• ${inc.description}<br>`;
                    });
                }
            }

            html += `
                <div class="summary ${summaryClass}">
                    <h3>${summaryIcon} Analysis Complete</h3>
                    <p>${summaryText}</p>
                    <p style="margin-top: 15px; opacity: 0.8;">
                        Query completed in ${totalTime}ms • ${results.filter(r => r.status === 'success').length}/${results.length} servers responded
                    </p>
                </div>
            `;

            resultsDiv.innerHTML = html;
        }

        function detectInconsistencies(serverResults) {
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

        // Allow Enter key to trigger check
        document.getElementById('domainInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkDNS();
            }
        });

        // Initial load - check Google as example
        window.addEventListener('load', function() {
            // Optionally auto-check on load
            // checkDNS();
        });