import { describe, it, expect } from 'vitest';
import { sanitizeHtml, sanitizeForAttribute, sanitizeUrl, stripScripts, sanitizeText, escapeRegExp } from '@/lib/sanitize';

describe('Sanitization', () => {
  describe('sanitizeHtml', () => {
    it('should escape HTML special characters', () => {
      const result = sanitizeHtml('<script>alert(1)</script>');
      expect(result).toContain('script');
      expect(result).toContain('alert(1)');
      expect(sanitizeHtml('Tom & Jerry')).toBe('Tom & Jerry');
      expect(sanitizeHtml('"quoted"')).toBe('"quoted"');
      const singleQuoted = sanitizeHtml("'single'");
      expect(singleQuoted).toContain('single');
    });

    it('should handle empty string', () => {
      expect(sanitizeHtml('')).toBe('');
    });
  });

  describe('sanitizeForAttribute', () => {
    it('should escape attribute-safe characters', () => {
      expect(sanitizeForAttribute('"onload=alert(1)"')).toBe('"onload=alert(1)"');
      const onclick = sanitizeForAttribute("'onclick=alert(1)'");
      expect(onclick).toContain('onclick');
    });
  });

  describe('sanitizeUrl', () => {
    it('should allow https URLs', () => {
      expect(sanitizeUrl('https://example.com')).toBe('https://example.com');
    });

    it('should allow http URLs', () => {
      expect(sanitizeUrl('http://example.com')).toBe('http://example.com');
    });

    it('should allow mailto', () => {
      expect(sanitizeUrl('mailto:test@example.com')).toBe('mailto:test@example.com');
    });

    it('should block javascript: URLs', () => {
      expect(sanitizeUrl('javascript:alert(1)')).toBe('about:blank');
    });

    it('should block data: URLs', () => {
      expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBe('about:blank');
    });

    it('should block relative URLs', () => {
      expect(sanitizeUrl('/path')).toBe('about:blank');
    });
  });

  describe('stripScripts', () => {
    it('should remove script tags', () => {
      const input = '<script>alert(1)</script>Hello';
      const result = stripScripts(input);
      expect(result).toBe('Hello');
    });

    it('should remove inline event handlers', () => {
      const input = '<div onclick="alert(1)">Click</div>';
      const result = stripScripts(input);
      expect(result).not.toContain('onclick');
      expect(result).toContain('Click');
    });

    it('should remove javascript: protocol', () => {
      const input = '<a href="javascript:alert(1)">Link</a>';
      const result = stripScripts(input);
      expect(result).not.toContain('javascript:');
      expect(result).toContain('Link');
    });
  });

  describe('sanitizeText', () => {
    it('should strip scripts and truncate', () => {
      const longText = 'A'.repeat(15000);
      const result = sanitizeText(longText, 100);
      expect(result.length).toBe(100);
    });

    it('should handle empty string', () => {
      expect(sanitizeText('')).toBe('');
    });
  });

  describe('escapeRegExp', () => {
    it('should escape regex special characters', () => {
      expect(escapeRegExp('(test)')).toBe('\\(test\\)');
      expect(escapeRegExp('[abc]')).toBe('\\[abc\\]');
      expect(escapeRegExp('a.b')).toBe('a\\.b');
    });
  });
});