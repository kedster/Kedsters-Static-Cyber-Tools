// WHOIS Lookup Tool - Integration Tests
import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { cleanDomain, validateDomain } from './whois-utils.js';
import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

describe('WHOIS Lookup Tool - HTML Integration', () => {
    let whoisHTML;
    let whoisScript;

    beforeEach(() => {
        // Read the HTML and script files
        const htmlPath = path.join(__dirname, '../../Prod/WHOIS Lookup Tool/index.html');
        const scriptPath = path.join(__dirname, '../../Prod/WHOIS Lookup Tool/script.js');
        
        whoisHTML = fs.readFileSync(htmlPath, 'utf-8');
        whoisScript = fs.readFileSync(scriptPath, 'utf-8');
        
        // Set up the DOM
        document.documentElement.innerHTML = whoisHTML;
    });

    test('should have all required DOM elements', () => {
        const domainInput = document.getElementById('domainInput');
        const searchBtn = document.getElementById('searchBtn');
        const loading = document.getElementById('loading');
        const error = document.getElementById('error');
        const results = document.getElementById('results');
        const btnText = document.getElementById('btnText');

        expect(domainInput).toBeTruthy();
        expect(searchBtn).toBeTruthy();
        expect(loading).toBeTruthy();
        expect(error).toBeTruthy();
        expect(results).toBeTruthy();
        expect(btnText).toBeTruthy();
    });

    test('should have correct initial state', () => {
        const domainInput = document.getElementById('domainInput');
        const searchBtn = document.getElementById('searchBtn');
        const loading = document.getElementById('loading');
        const error = document.getElementById('error');
        const results = document.getElementById('results');

        expect(domainInput.placeholder).toContain('Enter domain name');
        expect(searchBtn.disabled).toBe(false);
        expect(loading.style.display).toBe('');
        expect(error.style.display).toBe('');
        expect(results.style.display).toBe('');
    });

    test('should have example domains clickable', () => {
        const exampleDomains = document.querySelectorAll('.example-domain');
        expect(exampleDomains.length).toBeGreaterThan(0);
        
        // Check that each example domain has onclick attribute
        exampleDomains.forEach(domain => {
            expect(domain.getAttribute('onclick')).toBeTruthy();
            expect(domain.getAttribute('onclick')).toContain('fillDomain');
        });
    });

    test('should have proper semantic HTML structure', () => {
        const title = document.querySelector('title');
        const h1 = document.querySelector('h1');
        const input = document.querySelector('input[type="text"]');
        const button = document.querySelector('button');

        expect(title.textContent).toBe('WHOIS Lookup Tool');
        expect(h1.textContent).toContain('WHOIS Lookup');
        expect(input).toBeTruthy();
        expect(button).toBeTruthy();
    });

    test('should have accessibility attributes', () => {
        const domainInput = document.getElementById('domainInput');
        const searchBtn = document.getElementById('searchBtn');

        // Check for basic accessibility
        expect(domainInput.placeholder).toBeTruthy();
        expect(searchBtn.textContent.trim()).toBeTruthy();
    });
});

describe('WHOIS Lookup Tool - Script Integration', () => {
    beforeEach(() => {
        // Set up basic DOM structure needed for the script
        document.body.innerHTML = `
            <input id="domainInput" type="text" />
            <button id="searchBtn"><span id="btnText">Lookup</span></button>
            <div id="loading" style="display: none;"></div>
            <div id="error" style="display: none;"></div>
            <div id="results" style="display: none;">
                <span id="domainTitle"></span>
                <div id="whoisData"></div>
            </div>
        `;
    });

    test('should be able to evaluate script functions', () => {
        // These functions should be available from our utils        
        expect(typeof cleanDomain).toBe('function');
        expect(typeof validateDomain).toBe('function');
        
        // Test basic functionality
        expect(cleanDomain('https://www.google.com')).toBe('google.com');
        expect(validateDomain('google.com')).toBe(true);
    });

    test('should have DOM manipulation capabilities', () => {
        const domainInput = document.getElementById('domainInput');
        const btnText = document.getElementById('btnText');
        const loading = document.getElementById('loading');
        
        // Test that we can modify the DOM elements
        domainInput.value = 'test.com';
        expect(domainInput.value).toBe('test.com');
        
        btnText.textContent = 'Looking up...';
        expect(btnText.textContent).toBe('Looking up...');
        
        loading.style.display = 'block';
        expect(loading.style.display).toBe('block');
    });
});