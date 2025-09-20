#!/usr/bin/env node

/**
 * Kedster's Static Cyber Tools - Cloudflare Configuration Verification
 * 
 * This script verifies Cloudflare configuration and worker functions
 * as outlined in the GitHub issue requirements.
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

class CloudflareVerifier {
    constructor() {
        this.domain = 'cybertools.kedster.com'; // From wrangler.toml
        this.baseDomain = 'kedster.com';
        this.results = {
            dns: { passed: 0, failed: 0, tests: [] },
            worker: { passed: 0, failed: 0, tests: [] },
            homepage: { passed: 0, failed: 0, tests: [] },
            integration: { passed: 0, failed: 0, tests: [] }
        };
    }

    log(message, type = 'info') {
        const colors = {
            info: '\x1b[36m',    // Cyan
            success: '\x1b[32m', // Green
            warning: '\x1b[33m', // Yellow
            error: '\x1b[31m',   // Red
            reset: '\x1b[0m'
        };
        
        const icons = {
            info: 'ℹ',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        };

        console.log(`${colors[type]}${icons[type]} ${message}${colors.reset}`);
    }

    async runCommand(command, description) {
        try {
            this.log(`Running: ${description}`, 'info');
            const { stdout, stderr } = await execAsync(command);
            return { success: true, stdout, stderr };
        } catch (error) {
            return { success: false, error: error.message, stdout: error.stdout, stderr: error.stderr };
        }
    }

    async checkDNSConfiguration() {
        this.log('\n🔍 Checking DNS & Routing Configuration', 'info');
        
        // Check if domain points to Cloudflare nameservers
        const digResult = await this.runCommand(
            `dig NS ${this.baseDomain} +short`, 
            'Checking nameservers'
        );
        
        if (digResult.success && digResult.stdout.includes('cloudflare')) {
            this.log('DNS points to Cloudflare nameservers', 'success');
            this.results.dns.passed++;
            this.results.dns.tests.push({
                name: 'Cloudflare NS Records',
                status: 'PASS',
                details: 'Domain uses Cloudflare nameservers'
            });
        } else {
            this.log('DNS may not be configured for Cloudflare', 'warning');
            this.results.dns.failed++;
            this.results.dns.tests.push({
                name: 'Cloudflare NS Records',
                status: 'WARN',
                details: 'Could not verify Cloudflare nameservers'
            });
        }

        // Check domain resolution
        const nslookupResult = await this.runCommand(
            `nslookup ${this.domain}`,
            'Resolving domain'
        );

        if (nslookupResult.success) {
            this.log(`Domain ${this.domain} resolves successfully`, 'success');
            this.results.dns.passed++;
            this.results.dns.tests.push({
                name: 'Domain Resolution',
                status: 'PASS',
                details: `${this.domain} resolves correctly`
            });
        } else {
            this.log(`Failed to resolve ${this.domain}`, 'error');
            this.results.dns.failed++;
            this.results.dns.tests.push({
                name: 'Domain Resolution',
                status: 'FAIL',
                details: `Could not resolve ${this.domain}`
            });
        }
    }

    async checkWorkerDeployment() {
        this.log('\n🚀 Checking Worker Deployment', 'info');

        // Check wrangler authentication
        const whoamiResult = await this.runCommand(
            'npx wrangler whoami',
            'Checking Wrangler authentication'
        );

        if (whoamiResult.success) {
            this.log('Wrangler authentication successful', 'success');
            this.results.worker.passed++;
            this.results.worker.tests.push({
                name: 'Wrangler Auth',
                status: 'PASS',
                details: 'Successfully authenticated with Wrangler'
            });
        } else {
            this.log('Wrangler authentication failed - please run "wrangler login"', 'error');
            this.results.worker.failed++;
            this.results.worker.tests.push({
                name: 'Wrangler Auth',
                status: 'FAIL',
                details: 'Not authenticated with Wrangler CLI'
            });
        }

        // Check deployments list
        const deploymentsResult = await this.runCommand(
            'npx wrangler deployments list --json',
            'Checking deployment history'
        );

        if (deploymentsResult.success) {
            this.log('Successfully retrieved deployment list', 'success');
            this.results.worker.passed++;
            this.results.worker.tests.push({
                name: 'Deployment History',
                status: 'PASS',
                details: 'Can access deployment history'
            });
        } else {
            this.log('Failed to retrieve deployment list', 'warning');
            this.results.worker.failed++;
            this.results.worker.tests.push({
                name: 'Deployment History',
                status: 'FAIL',
                details: 'Cannot access deployment history'
            });
        }
    }

    async checkHomepageAvailability() {
        this.log('\n🏠 Checking Homepage Availability', 'info');

        try {
            // Test root domain
            const response = await fetch(`https://${this.domain}`, {
                method: 'HEAD',
                timeout: 10000,
                headers: {
                    'User-Agent': 'Kedster-Cloudflare-Verifier/1.0'
                }
            });

            if (response.ok) {
                this.log(`Homepage is accessible at https://${this.domain}`, 'success');
                this.results.homepage.passed++;
                
                // Check for Cloudflare headers
                const cfHeaders = [];
                response.headers.forEach((value, name) => {
                    if (name.toLowerCase().includes('cf-') || name.toLowerCase().includes('cloudflare')) {
                        cfHeaders.push(`${name}: ${value}`);
                    }
                });

                if (cfHeaders.length > 0) {
                    this.log('Cloudflare headers detected', 'success');
                    this.results.homepage.tests.push({
                        name: 'Homepage Accessibility',
                        status: 'PASS',
                        details: `Site accessible with CF headers: ${cfHeaders.join(', ')}`
                    });
                } else {
                    this.log('No Cloudflare headers detected', 'warning');
                    this.results.homepage.tests.push({
                        name: 'Homepage Accessibility',
                        status: 'PASS',
                        details: 'Site accessible but no CF headers found'
                    });
                }
            } else {
                this.log(`Homepage returned status: ${response.status}`, 'error');
                this.results.homepage.failed++;
                this.results.homepage.tests.push({
                    name: 'Homepage Accessibility',
                    status: 'FAIL',
                    details: `HTTP ${response.status} - ${response.statusText}`
                });
            }
        } catch (error) {
            this.log(`Failed to access homepage: ${error.message}`, 'error');
            this.results.homepage.failed++;
            this.results.homepage.tests.push({
                name: 'Homepage Accessibility',
                status: 'FAIL',
                details: `Connection error: ${error.message}`
            });
        }
    }

    async checkWorkerFunctionality() {
        this.log('\n⚙️ Checking Worker Functionality', 'info');

        try {
            // Test worker response with full request
            const response = await fetch(`https://${this.domain}/`, {
                method: 'GET',
                timeout: 10000,
                headers: {
                    'User-Agent': 'Kedster-Cloudflare-Verifier/1.0',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                }
            });

            if (response.ok) {
                const content = await response.text();
                
                // Check for worker-specific content
                if (content.includes('Kedster\'s Static Cyber Tools')) {
                    this.log('Worker is serving expected content', 'success');
                    this.results.worker.passed++;
                    this.results.worker.tests.push({
                        name: 'Worker Response',
                        status: 'PASS',
                        details: 'Worker serving correct homepage content'
                    });
                } else {
                    this.log('Worker content may not be correct', 'warning');
                    this.results.worker.failed++;
                    this.results.worker.tests.push({
                        name: 'Worker Response',
                        status: 'FAIL',
                        details: 'Worker not serving expected content'
                    });
                }

                // Test different routes
                const testRoutes = ['/dev/', '/Prod/', '/api/'];
                for (const route of testRoutes) {
                    try {
                        const routeResponse = await fetch(`https://${this.domain}${route}`, {
                            method: 'HEAD',
                            timeout: 5000
                        });
                        
                        if (routeResponse.ok) {
                            this.log(`Route ${route} is accessible`, 'success');
                        } else {
                            this.log(`Route ${route} returned ${routeResponse.status}`, 'warning');
                        }
                    } catch (routeError) {
                        this.log(`Route ${route} failed: ${routeError.message}`, 'warning');
                    }
                }

            } else {
                this.log(`Worker returned status: ${response.status}`, 'error');
                this.results.worker.failed++;
                this.results.worker.tests.push({
                    name: 'Worker Response',
                    status: 'FAIL',
                    details: `HTTP ${response.status} - ${response.statusText}`
                });
            }
        } catch (error) {
            this.log(`Worker functionality test failed: ${error.message}`, 'error');
            this.results.worker.failed++;
            this.results.worker.tests.push({
                name: 'Worker Response',
                status: 'FAIL',
                details: `Connection error: ${error.message}`
            });
        }
    }

    async checkIntegrationRequirements() {
        this.log('\n🔐 Checking Integration Requirements', 'info');

        try {
            // Check wrangler.toml for environment variables configuration
            const wranglerConfig = await fs.readFile('wrangler.toml', 'utf8');
            
            if (wranglerConfig.includes('vars') || wranglerConfig.includes('secrets')) {
                this.log('Environment variables section found in wrangler.toml', 'success');
                this.results.integration.passed++;
                this.results.integration.tests.push({
                    name: 'Environment Config',
                    status: 'PASS',
                    details: 'Variables/secrets configuration detected'
                });
            } else {
                this.log('No environment variables configuration found', 'warning');
                this.results.integration.tests.push({
                    name: 'Environment Config',
                    status: 'INFO',
                    details: 'No vars/secrets configured (may be intentional)'
                });
            }

            // Check for Google Auth/Stripe references in the codebase
            const srcFiles = await fs.readdir('src');
            let hasAuthCode = false;
            
            for (const file of srcFiles) {
                if (file.endsWith('.js')) {
                    const content = await fs.readFile(path.join('src', file), 'utf8');
                    if (content.includes('google') || content.includes('stripe') || content.includes('oauth')) {
                        hasAuthCode = true;
                        break;
                    }
                }
            }

            if (hasAuthCode) {
                this.log('Authentication integration code detected', 'success');
                this.results.integration.passed++;
                this.results.integration.tests.push({
                    name: 'Auth Integration',
                    status: 'PASS',
                    details: 'Google/Stripe integration code found'
                });
            } else {
                this.log('No authentication integration code found', 'info');
                this.results.integration.tests.push({
                    name: 'Auth Integration',
                    status: 'INFO',
                    details: 'No auth integration detected (placeholder ready)'
                });
            }

        } catch (error) {
            this.log(`Integration check failed: ${error.message}`, 'warning');
            this.results.integration.failed++;
            this.results.integration.tests.push({
                name: 'Integration Check',
                status: 'FAIL',
                details: `Error checking integration: ${error.message}`
            });
        }
    }

    printSummary() {
        this.log('\n📋 Verification Summary', 'info');
        console.log('─'.repeat(80));
        
        const categories = ['dns', 'worker', 'homepage', 'integration'];
        let totalPassed = 0;
        let totalFailed = 0;

        categories.forEach(category => {
            const result = this.results[category];
            const total = result.passed + result.failed;
            const percentage = total > 0 ? Math.round((result.passed / total) * 100) : 0;
            
            console.log(`${category.toUpperCase().padEnd(12)} | ${result.passed}✅ ${result.failed}❌ | ${percentage}% passed`);
            
            totalPassed += result.passed;
            totalFailed += result.failed;
        });

        console.log('─'.repeat(80));
        const overallTotal = totalPassed + totalFailed;
        const overallPercentage = overallTotal > 0 ? Math.round((totalPassed / overallTotal) * 100) : 0;
        console.log(`OVERALL      | ${totalPassed}✅ ${totalFailed}❌ | ${overallPercentage}% passed`);
        
        if (overallPercentage >= 80) {
            this.log('\n🎉 Cloudflare configuration looks good!', 'success');
        } else if (overallPercentage >= 60) {
            this.log('\n⚠️  Some issues detected - see details above', 'warning');
        } else {
            this.log('\n❌ Multiple issues detected - configuration needs attention', 'error');
        }
    }

    printTroubleshootingChecklist() {
        this.log('\n🔧 Quick Troubleshooting Checklist', 'info');
        console.log('─'.repeat(80));
        
        const checklist = [
            'DNS A/CNAME records point to Cloudflare (proxied)',
            'Worker deployed successfully (wrangler deployments list)',
            'Correct route applied to Worker in Cloudflare Dashboard',
            'Homepage reachable and not stuck in deploy',
            'Worker responds with expected output',
            'Env vars (Google/Stripe keys) configured in Cloudflare',
            'No mixed routing conflict between Pages and Worker'
        ];

        checklist.forEach((item, index) => {
            console.log(`${(index + 1).toString().padStart(2)}. ☐ ${item}`);
        });

        console.log('\n📚 Helpful Commands:');
        console.log('   npm run verify:dns        # Check DNS configuration');
        console.log('   npm run verify:worker      # Check worker deployment');
        console.log('   npm run verify:homepage    # Check homepage availability');
        console.log('   npx wrangler dev           # Local worker development');
        console.log('   npx wrangler deploy        # Deploy worker');
        console.log('   npx wrangler pages deploy  # Deploy pages');
    }

    async runAll() {
        this.log('🛡️ Kedster\'s Static Cyber Tools - Cloudflare Verification', 'info');
        console.log('═'.repeat(80));

        await this.checkDNSConfiguration();
        await this.checkWorkerDeployment();
        await this.checkHomepageAvailability();
        await this.checkWorkerFunctionality();
        await this.checkIntegrationRequirements();

        this.printSummary();
        this.printTroubleshootingChecklist();
    }

    async runSpecific(type) {
        switch (type) {
            case 'dns':
                await this.checkDNSConfiguration();
                break;
            case 'worker':
                await this.checkWorkerDeployment();
                await this.checkWorkerFunctionality();
                break;
            case 'homepage':
                await this.checkHomepageAvailability();
                break;
            case 'troubleshoot':
                this.printTroubleshootingChecklist();
                return;
            default:
                this.log('Unknown verification type', 'error');
                return;
        }
        this.printSummary();
    }
}

// Main execution
async function main() {
    const verifier = new CloudflareVerifier();
    
    const args = process.argv.slice(2);
    const flags = args.filter(arg => arg.startsWith('--')).map(arg => arg.substring(2));
    
    if (flags.length === 0) {
        await verifier.runAll();
    } else {
        for (const flag of flags) {
            await verifier.runSpecific(flag);
        }
    }
}

// Handle errors gracefully
process.on('uncaughtException', (error) => {
    console.error('\n❌ Uncaught Exception:', error.message);
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    console.error('\n❌ Unhandled Rejection:', reason);
    process.exit(1);
});

main().catch(error => {
    console.error('\n❌ Verification failed:', error.message);
    process.exit(1);
});