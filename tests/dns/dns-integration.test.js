// DNS Poisoning Checker - Integration Tests
import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { DNS_SERVERS, validateDomain, detectInconsistencies, analyzeResults } from './dns-utils.js';
import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

describe('DNS Poisoning Checker - HTML Integration', () => {
    let dnsHTML;
    let dnsScript;

    beforeEach(() => {
        // Read the HTML and script files
        const htmlPath = path.join(__dirname, '../../Prod/DNS poisoning checker/index.html');
        const scriptPath = path.join(__dirname, '../../Prod/DNS poisoning checker/script.js');
        
        dnsHTML = fs.readFileSync(htmlPath, 'utf-8');
        dnsScript = fs.readFileSync(scriptPath, 'utf-8');
        
        // Set up the DOM
        document.documentElement.innerHTML = dnsHTML;
    });

    test('should have all required DOM elements', () => {
        const domainInput = document.getElementById('domainInput');
        const checkBtn = document.getElementById('checkBtn');
        const results = document.getElementById('results');

        expect(domainInput).toBeTruthy();
        expect(checkBtn).toBeTruthy();
        expect(results).toBeTruthy();
    });

    test('should have correct initial state', () => {
        const domainInput = document.getElementById('domainInput');
        const checkBtn = document.getElementById('checkBtn');
        const results = document.getElementById('results');

        expect(domainInput.placeholder).toContain('Enter domain');
        expect(domainInput.value).toBe('google.com'); // Default value
        expect(checkBtn.disabled).toBe(false);
        expect(checkBtn.textContent).toContain('Check DNS');
        expect(results.className).toContain('results');
    });

    test('should have proper semantic HTML structure', () => {
        const title = document.querySelector('title');
        const h1 = document.querySelector('h1');
        const input = document.querySelector('input[type="text"]');
        const button = document.querySelector('button');

        expect(title.textContent).toBe('DNS Poisoning Checker');
        expect(h1.textContent).toContain('DNS Poisoning Checker');
        expect(input).toBeTruthy();
        expect(button).toBeTruthy();
    });

    test('should have descriptive content', () => {
        const description = document.querySelector('p');
        expect(description.textContent).toContain('Detect DNS tampering');
        expect(description.textContent).toContain('multiple DNS servers');
    });

    test('should have proper container structure', () => {
        const container = document.querySelector('.container');
        const header = document.querySelector('.header');
        const content = document.querySelector('.content');
        const inputSection = document.querySelector('.input-section');

        expect(container).toBeTruthy();
        expect(header).toBeTruthy();
        expect(content).toBeTruthy();
        expect(inputSection).toBeTruthy();
    });

    test('should have accessibility attributes', () => {
        const domainInput = document.getElementById('domainInput');
        const checkBtn = document.getElementById('checkBtn');

        // Check for basic accessibility
        expect(domainInput.placeholder).toBeTruthy();
        expect(checkBtn.textContent.trim()).toBeTruthy();
    });
});

describe('DNS Poisoning Checker - Script Integration', () => {
    beforeEach(() => {
        // Set up basic DOM structure needed for the script
        document.body.innerHTML = `
            <input id="domainInput" type="text" value="google.com" />
            <button id="checkBtn">Check DNS</button>
            <div id="results" class="results"></div>
        `;
    });

    test('should be able to evaluate script functions', () => {
        // These functions should be available from our utils        
        expect(typeof validateDomain).toBe('function');
        expect(typeof detectInconsistencies).toBe('function');
        expect(typeof analyzeResults).toBe('function');
        
        // Test basic functionality
        expect(validateDomain('google.com')).toBe(true);
        expect(detectInconsistencies({})).toEqual([]);
    });

    test('should have DOM manipulation capabilities', () => {
        const domainInput = document.getElementById('domainInput');
        const checkBtn = document.getElementById('checkBtn');
        const results = document.getElementById('results');
        
        // Test that we can modify the DOM elements
        domainInput.value = 'test.com';
        expect(domainInput.value).toBe('test.com');
        
        checkBtn.disabled = true;
        expect(checkBtn.disabled).toBe(true);
        
        results.innerHTML = '<div>Test results</div>';
        expect(results.innerHTML).toContain('Test results');
    });

    test('should support DNS server configuration', () => {        
        expect(DNS_SERVERS).toBeTruthy();
        expect(Array.isArray(DNS_SERVERS)).toBe(true);
        expect(DNS_SERVERS.length).toBeGreaterThan(0);
        
        // Check that each DNS server has required properties
        DNS_SERVERS.forEach(server => {
            expect(server.name).toBeTruthy();
            expect(server.url).toBeTruthy();
            expect(server.type).toBeTruthy();
        });
    });

    test('should handle result analysis correctly', () => {        
        const mockResults = [
            { server: 'Google Primary', status: 'success', addresses: ['8.8.8.8'] },
            { server: 'Google Secondary', status: 'success', addresses: ['8.8.8.8'] }
        ];
        
        const analysis = analyzeResults(mockResults);
        expect(analysis.overallStatus).toBe('safe');
        expect(analysis.successfulQueries).toBe(2);
        expect(analysis.totalQueries).toBe(2);
    });
});