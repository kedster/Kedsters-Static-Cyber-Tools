// DNS Poisoning Checker - Unit Tests
import { jest, describe, test, expect } from '@jest/globals';
import { 
    DNS_SERVERS,
    validateDomain, 
    detectInconsistencies,
    parseGoogleDNSResponse,
    parseHackerTargetResponse,
    parseDOHResponse,
    analyzeResults,
    categorizeResult
} from './dns-utils.js';

describe('DNS Poisoning Checker - Constants', () => {
    test('should have expected DNS servers configured', () => {
        expect(DNS_SERVERS).toHaveLength(4);
        expect(DNS_SERVERS[0].name).toBe('Google Primary');
        expect(DNS_SERVERS[0].type).toBe('google');
        expect(DNS_SERVERS[1].name).toBe('Google Secondary');
        expect(DNS_SERVERS[2].name).toBe('HackerTarget');
        expect(DNS_SERVERS[2].type).toBe('hackertarget');
        expect(DNS_SERVERS[3].name).toBe('DNS.SB');
        expect(DNS_SERVERS[3].type).toBe('doh');
    });
});

describe('DNS Poisoning Checker - Domain Validation', () => {
    test('should validate correct domain formats', () => {
        expect(validateDomain('google.com')).toBe(true);
        expect(validateDomain('sub.domain.com')).toBe(true);
        expect(validateDomain('example.org')).toBe(true);
        expect(validateDomain('test-domain.net')).toBe(true);
        expect(validateDomain('a.co')).toBe(true);
        expect(validateDomain('deep.sub.domain.co.uk')).toBe(true);
    });

    test('should reject invalid domain formats', () => {
        expect(validateDomain('')).toBe(false);
        expect(validateDomain('invalid')).toBe(false);
        expect(validateDomain('invalid.')).toBe(false);
        expect(validateDomain('.invalid')).toBe(false);
        expect(validateDomain('invalid..com')).toBe(false);
        expect(validateDomain('-invalid.com')).toBe(false);
        expect(validateDomain('invalid-.com')).toBe(false);
        expect(validateDomain('192.168.1.1')).toBe(false);
    });

    test('should handle international domains', () => {
        expect(validateDomain('xn--fsq.com')).toBe(true); // Punycode domain
        expect(validateDomain('example.xn--fiqs8s')).toBe(true); // Chinese TLD
    });
});

describe('DNS Poisoning Checker - Inconsistency Detection', () => {
    test('should detect no inconsistencies when all servers return same results', () => {
        const serverResults = {
            'Google Primary': ['8.8.8.8'],
            'Google Secondary': ['8.8.8.8'],
            'HackerTarget': ['8.8.8.8'],
            'DNS.SB': ['8.8.8.8']
        };

        const inconsistencies = detectInconsistencies(serverResults);
        expect(inconsistencies).toHaveLength(0);
    });

    test('should detect inconsistencies when servers return different results', () => {
        const serverResults = {
            'Google Primary': ['8.8.8.8'],
            'Google Secondary': ['8.8.4.4'],
            'HackerTarget': ['8.8.8.8']
        };

        const inconsistencies = detectInconsistencies(serverResults);
        expect(inconsistencies.length).toBeGreaterThan(0);
        
        const inconsistency = inconsistencies.find(inc => 
            inc.servers.includes('Google Primary') && inc.servers.includes('Google Secondary')
        );
        expect(inconsistency).toBeDefined();
        expect(inconsistency.description).toContain('8.8.8.8');
        expect(inconsistency.description).toContain('8.8.4.4');
    });

    test('should detect multiple inconsistencies', () => {
        const serverResults = {
            'Google Primary': ['1.1.1.1'],
            'Google Secondary': ['2.2.2.2'],
            'HackerTarget': ['3.3.3.3'],
            'DNS.SB': ['4.4.4.4']
        };

        const inconsistencies = detectInconsistencies(serverResults);
        expect(inconsistencies.length).toBeGreaterThan(3); // Multiple pairwise comparisons
    });

    test('should handle servers with multiple IP addresses', () => {
        const serverResults = {
            'Google Primary': ['8.8.8.8', '8.8.4.4'],
            'Google Secondary': ['8.8.4.4', '8.8.8.8'], // Same IPs, different order
            'HackerTarget': ['8.8.8.8', '8.8.4.4']
        };

        const inconsistencies = detectInconsistencies(serverResults);
        expect(inconsistencies.length).toBeGreaterThan(0); // Different order = inconsistency
    });

    test('should return empty array for insufficient server data', () => {
        const serverResults = {
            'Google Primary': ['8.8.8.8']
        };

        const inconsistencies = detectInconsistencies(serverResults);
        expect(inconsistencies).toHaveLength(0);
    });

    test('should handle empty server results', () => {
        const inconsistencies = detectInconsistencies({});
        expect(inconsistencies).toHaveLength(0);
    });
});

describe('DNS Poisoning Checker - Google DNS Response Parsing', () => {
    test('should parse valid Google DNS response', () => {
        const mockResponse = {
            Answer: [
                { type: 1, data: '8.8.8.8' },
                { type: 1, data: '8.8.4.4' },
                { type: 16, data: 'v=spf1 include:_spf.google.com ~all' } // TXT record, should be ignored
            ]
        };

        const addresses = parseGoogleDNSResponse(mockResponse);
        expect(addresses).toEqual(['8.8.8.8', '8.8.4.4']);
    });

    test('should handle empty Answer array', () => {
        const mockResponse = { Answer: [] };
        const addresses = parseGoogleDNSResponse(mockResponse);
        expect(addresses).toEqual([]);
    });

    test('should handle missing Answer property', () => {
        const mockResponse = {};
        const addresses = parseGoogleDNSResponse(mockResponse);
        expect(addresses).toEqual([]);
    });

    test('should handle null/undefined response', () => {
        expect(parseGoogleDNSResponse(null)).toEqual([]);
        expect(parseGoogleDNSResponse(undefined)).toEqual([]);
        expect(parseGoogleDNSResponse({})).toEqual([]);
    });
});

describe('DNS Poisoning Checker - HackerTarget Response Parsing', () => {
    test('should parse valid HackerTarget response', () => {
        const mockResponse = `google.com has address 8.8.8.8
google.com has address 8.8.4.4
google.com mail is handled by 10 smtp.google.com.`;

        const addresses = parseHackerTargetResponse(mockResponse);
        expect(addresses).toEqual(['8.8.8.8', '8.8.4.4']);
    });

    test('should handle response with no A records', () => {
        const mockResponse = `google.com mail is handled by 10 smtp.google.com.
google.com has AAAA address 2001:4860:4860::8888`;

        const addresses = parseHackerTargetResponse(mockResponse);
        expect(addresses).toEqual([]);
    });

    test('should handle empty response', () => {
        const addresses = parseHackerTargetResponse('');
        expect(addresses).toEqual([]);
    });

    test('should handle malformed response', () => {
        const mockResponse = 'This is not a valid DNS response';
        const addresses = parseHackerTargetResponse(mockResponse);
        expect(addresses).toEqual([]);
    });
});

describe('DNS Poisoning Checker - DOH Response Parsing', () => {
    test('should parse valid DOH response', () => {
        const mockResponse = {
            Answer: [
                { type: 1, data: '1.1.1.1' },
                { type: 1, data: '1.0.0.1' }
            ]
        };

        const addresses = parseDOHResponse(mockResponse);
        expect(addresses).toEqual(['1.1.1.1', '1.0.0.1']);
    });

    test('should handle empty DOH response', () => {
        const addresses = parseDOHResponse({ Answer: [] });
        expect(addresses).toEqual([]);
    });

    test('should handle missing Answer in DOH response', () => {
        const addresses = parseDOHResponse({});
        expect(addresses).toEqual([]);
    });
});

describe('DNS Poisoning Checker - Results Analysis', () => {
    test('should analyze consistent results correctly', () => {
        const mockResults = [
            { server: 'Google Primary', status: 'success', addresses: ['8.8.8.8'] },
            { server: 'Google Secondary', status: 'success', addresses: ['8.8.8.8'] },
            { server: 'HackerTarget', status: 'success', addresses: ['8.8.8.8'] }
        ];

        const analysis = analyzeResults(mockResults);
        
        expect(analysis.overallStatus).toBe('safe');
        expect(analysis.inconsistencies).toHaveLength(0);
        expect(analysis.successfulQueries).toBe(3);
        expect(analysis.totalQueries).toBe(3);
        expect(analysis.allAddresses).toEqual(['8.8.8.8']);
    });

    test('should analyze inconsistent results correctly', () => {
        const mockResults = [
            { server: 'Google Primary', status: 'success', addresses: ['8.8.8.8'] },
            { server: 'Google Secondary', status: 'success', addresses: ['8.8.4.4'] },
            { server: 'HackerTarget', status: 'error', addresses: [] }
        ];

        const analysis = analyzeResults(mockResults);
        
        expect(analysis.overallStatus).toBe('warning');
        expect(analysis.inconsistencies.length).toBeGreaterThan(0);
        expect(analysis.successfulQueries).toBe(2);
        expect(analysis.totalQueries).toBe(3);
        expect(analysis.allAddresses).toContain('8.8.8.8');
        expect(analysis.allAddresses).toContain('8.8.4.4');
    });

    test('should handle all failed queries', () => {
        const mockResults = [
            { server: 'Google Primary', status: 'error', addresses: [] },
            { server: 'Google Secondary', status: 'error', addresses: [] }
        ];

        const analysis = analyzeResults(mockResults);
        
        expect(analysis.overallStatus).toBe('safe'); // No inconsistencies if no successful queries
        expect(analysis.inconsistencies).toHaveLength(0);
        expect(analysis.successfulQueries).toBe(0);
        expect(analysis.totalQueries).toBe(2);
        expect(analysis.allAddresses).toEqual([]);
    });
});

describe('DNS Poisoning Checker - Result Categorization', () => {
    test('should categorize error results correctly', () => {
        const result = { server: 'Test', status: 'error', addresses: [] };
        const category = categorizeResult(result, []);
        
        expect(category.cardClass).toContain('danger');
        expect(category.statusText).toBe('ERROR');
    });

    test('should categorize no results correctly', () => {
        const result = { server: 'Test', status: 'success', addresses: [] };
        const category = categorizeResult(result, []);
        
        expect(category.cardClass).toContain('warning');
        expect(category.statusText).toBe('NO RESULTS');
    });

    test('should categorize consistent results correctly', () => {
        const result = { server: 'Test', status: 'success', addresses: ['8.8.8.8'] };
        const inconsistencies = [];
        const category = categorizeResult(result, inconsistencies);
        
        expect(category.cardClass).toContain('safe');
        expect(category.statusText).toBe('CONSISTENT');
    });

    test('should categorize inconsistent results correctly', () => {
        const result = { server: 'Test', status: 'success', addresses: ['8.8.8.8'] };
        const inconsistencies = [
            { servers: ['Test', 'Other'], description: 'Different results' }
        ];
        const category = categorizeResult(result, inconsistencies);
        
        expect(category.cardClass).toContain('warning');
        expect(category.statusText).toBe('INCONSISTENT');
    });
});