// WHOIS Lookup Tool - Unit Tests
import { jest, describe, test, expect } from '@jest/globals';
import { 
    cleanDomain, 
    validateDomain, 
    parseRDAP, 
    parseNetworkCalc 
} from './whois-utils.js';

describe('WHOIS Lookup Tool - Domain Cleaning', () => {
    test('should clean domain by removing protocol', () => {
        expect(cleanDomain('https://google.com')).toBe('google.com');
        expect(cleanDomain('http://example.org')).toBe('example.org');
    });

    test('should clean domain by removing www prefix', () => {
        expect(cleanDomain('www.google.com')).toBe('google.com');
        expect(cleanDomain('www.example.org')).toBe('example.org');
    });

    test('should clean domain by removing trailing slash and path', () => {
        expect(cleanDomain('google.com/')).toBe('google.com');
        expect(cleanDomain('google.com/path/to/page')).toBe('google.com');
    });

    test('should clean domain by removing port', () => {
        expect(cleanDomain('google.com:80')).toBe('google.com');
        expect(cleanDomain('example.org:8080')).toBe('example.org');
    });

    test('should clean complex domain strings', () => {
        expect(cleanDomain('https://www.google.com:443/search?q=test')).toBe('google.com');
        expect(cleanDomain('http://www.example.org:8080/path/to/resource/')).toBe('example.org');
    });

    test('should convert to lowercase and trim whitespace', () => {
        expect(cleanDomain('  GOOGLE.COM  ')).toBe('google.com');
        expect(cleanDomain('EXAMPLE.ORG\n')).toBe('example.org');
    });

    test('should handle empty or invalid input', () => {
        expect(cleanDomain('')).toBe('');
        expect(cleanDomain('   ')).toBe('');
    });
});

describe('WHOIS Lookup Tool - Domain Validation', () => {
    test('should validate correct domain formats', () => {
        expect(validateDomain('google.com')).toBe(true);
        expect(validateDomain('sub.domain.com')).toBe(true);
        expect(validateDomain('example.org')).toBe(true);
        expect(validateDomain('test-domain.net')).toBe(true);
        expect(validateDomain('a.co')).toBe(true);
        expect(validateDomain('123.456.co.uk')).toBe(true);
    });

    test('should reject invalid domain formats', () => {
        expect(validateDomain('')).toBe(false);
        expect(validateDomain('invalid')).toBe(false);
        expect(validateDomain('invalid.')).toBe(false);
        expect(validateDomain('.invalid')).toBe(false);
        expect(validateDomain('invalid..com')).toBe(false);
        expect(validateDomain('-invalid.com')).toBe(false);
        expect(validateDomain('invalid-.com')).toBe(false);
        expect(validateDomain('invalid.c')).toBe(false); // TLD too short
        expect(validateDomain('192.168.1.1')).toBe(false); // IP address
    });

    test('should reject domains with invalid characters', () => {
        expect(validateDomain('inv@lid.com')).toBe(false);
        expect(validateDomain('inv alid.com')).toBe(false);
        expect(validateDomain('inv_lid.com')).toBe(false);
        expect(validateDomain('invalid!.com')).toBe(false);
    });

    test('should handle long domains correctly', () => {
        const longDomain = 'a'.repeat(60) + '.com';
        expect(validateDomain(longDomain)).toBe(true);
        
        const tooLongDomain = 'a'.repeat(64) + '.com';
        expect(validateDomain(tooLongDomain)).toBe(false);
    });
});

describe('WHOIS Lookup Tool - RDAP Parsing', () => {
    test('should parse basic RDAP response', () => {
        const mockRdapData = {
            ldhName: 'example.com',
            status: ['client transfer prohibited'],
            events: [
                {
                    eventAction: 'registration',
                    eventDate: '2020-01-15T00:00:00Z'
                },
                {
                    eventAction: 'expiration',
                    eventDate: '2025-01-15T00:00:00Z'
                }
            ]
        };

        const result = parseRDAP(mockRdapData);
        
        expect(result).toContain('Domain Name: example.com');
        expect(result).toContain('Status: client transfer prohibited');
        expect(result).toContain('registration:');
        expect(result).toContain('expiration:');
    });

    test('should parse RDAP response with entities', () => {
        const mockRdapData = {
            ldhName: 'example.com',
            entities: [
                {
                    roles: ['registrant'],
                    vcardArray: [
                        'vcard',
                        [
                            ['fn', {}, 'text', 'John Doe'],
                            ['org', {}, 'text', 'Example Corp'],
                            ['email', {}, 'text', 'john@example.com']
                        ]
                    ]
                }
            ]
        };

        const result = parseRDAP(mockRdapData);
        
        expect(result).toContain('registrant:');
        expect(result).toContain('Name: John Doe');
        expect(result).toContain('Organization: Example Corp');
        expect(result).toContain('Email: john@example.com');
    });

    test('should parse RDAP response with nameservers', () => {
        const mockRdapData = {
            ldhName: 'example.com',
            nameservers: [
                { ldhName: 'ns1.example.com' },
                { ldhName: 'ns2.example.com' }
            ]
        };

        const result = parseRDAP(mockRdapData);
        
        expect(result).toContain('Name Servers:');
        expect(result).toContain('ns1.example.com');
        expect(result).toContain('ns2.example.com');
    });

    test('should handle empty RDAP response', () => {
        const result = parseRDAP({});
        expect(result).toBe('WHOIS data retrieved successfully, but format may not be fully supported.');
    });

    test('should handle malformed RDAP data gracefully', () => {
        const mockRdapData = {
            events: [
                { eventAction: 'registration' }, // Missing eventDate
                { eventDate: '2020-01-15T00:00:00Z' } // Missing eventAction
            ],
            entities: [
                {
                    roles: ['registrant'],
                    vcardArray: null // Invalid vcard structure
                }
            ]
        };

        const result = parseRDAP(mockRdapData);
        expect(result).toContain('registrant:');
        // Should not throw error and should handle gracefully
    });
});

describe('WHOIS Lookup Tool - NetworkCalc Parsing', () => {
    test('should parse NetworkCalc DNS response', () => {
        const mockData = {
            records: {
                A: [
                    { address: '93.184.216.34' },
                    { address: '93.184.216.35' }
                ],
                MX: [
                    { target: 'mail.example.com' }
                ],
                CNAME: [
                    { value: 'alias.example.com' }
                ]
            }
        };

        const result = parseNetworkCalc(mockData, 'example.com');
        
        expect(result).toContain('Domain Name: example.com');
        expect(result).toContain('A Records:');
        expect(result).toContain('93.184.216.34');
        expect(result).toContain('93.184.216.35');
        expect(result).toContain('MX Records:');
        expect(result).toContain('mail.example.com');
        expect(result).toContain('CNAME Records:');
        expect(result).toContain('alias.example.com');
    });

    test('should handle empty records', () => {
        const mockData = {
            records: {}
        };

        const result = parseNetworkCalc(mockData, 'example.com');
        expect(result).toBe('Domain Name: example.com\n');
    });

    test('should handle missing records property', () => {
        const mockData = {};
        const result = parseNetworkCalc(mockData, 'example.com');
        expect(result).toBe('Domain Name: example.com\n');
    });

    test('should handle null/undefined records gracefully', () => {
        const mockData = {
            records: {
                A: null,
                MX: undefined,
                CNAME: []
            }
        };

        const result = parseNetworkCalc(mockData, 'example.com');
        expect(result).toBe('Domain Name: example.com\n');
    });
});