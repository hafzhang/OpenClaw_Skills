/**
 * External Link Validation
 * Phase 4: US-088 - External Link Validation
 */

import { getAllSkills } from './skills';
import { getAllTutorials } from './tutorials';
import { getAllConfigs } from './configs';

export interface LinkValidationResult {
  url: string;
  status: 'valid' | 'invalid' | 'unknown';
  statusCode?: number;
  error?: string;
  source: string;
  sourceType: 'skill' | 'tutorial' | 'config';
}

// Extract URLs from text
function extractUrls(text: string): string[] {
  const urlRegex = /(https?:\/\/[^\s<]+[^<.,;!?\s])/g;
  return text.match(urlRegex) || [];
}

// Collect all external links
export function collectAllLinks(): { url: string; source: string; sourceType: 'skill' | 'tutorial' | 'config' }[] {
  const links: { url: string; source: string; sourceType: 'skill' | 'tutorial' | 'config' }[] = [];

  // Collect from skills
  const skills = getAllSkills();
  skills.forEach(skill => {
    if (skill.url) {
      links.push({ url: skill.url, source: skill.name, sourceType: 'skill' });
    }
    if (skill.command) {
      const urls = extractUrls(skill.command);
      urls.forEach(url => {
        links.push({ url, source: skill.name, sourceType: 'skill' });
      });
    }
  });

  // Collect from tutorials
  const tutorials = getAllTutorials();
  tutorials.forEach(tutorial => {
    const urls = extractUrls(tutorial.content);
    urls.forEach(url => {
      links.push({ url, source: tutorial.title, sourceType: 'tutorial' });
    });
  });

  // Collect from configs
  const configs = getAllConfigs();
  configs.forEach(config => {
    if (config.authorUrl) {
      links.push({ url: config.authorUrl, source: config.name, sourceType: 'config' });
    }
    const configJson = JSON.stringify(config.config);
    const urls = extractUrls(configJson);
    urls.forEach(url => {
      links.push({ url, source: config.name, sourceType: 'config' });
    });
  });

  // Remove duplicates
  const uniqueLinks = links.filter((link, index, self) =>
    index === self.findIndex(l => l.url === link.url && l.source === link.source)
  );

  return uniqueLinks;
}

// Client-side link validation (checks format only)
export function validateLinkFormat(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Check if link is likely valid (basic checks)
export function isLinkLikelyValid(url: string): boolean {
  // Check protocol
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return false;
  }

  // Check for common URL patterns that might be invalid
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    return false;
  }

  // Check for placeholder URLs
  const placeholders = [
    'example.com',
    'placeholder.com',
    'your-domain.com',
    'your-website.com',
  ];

  if (placeholders.some(p => url.includes(p))) {
    return false;
  }

  return validateLinkFormat(url);
}

// Generate link validation report
export function generateLinkReport(): {
  total: number;
  valid: number;
  invalid: number;
  unknown: number;
  details: LinkValidationResult[];
} {
  const links = collectAllLinks();
  const results: LinkValidationResult[] = links.map(link => {
    const isValid = isLinkLikelyValid(link.url);
    return {
      url: link.url,
      status: isValid ? 'valid' : 'invalid',
      source: link.source,
      sourceType: link.sourceType,
      error: isValid ? undefined : 'Invalid URL format or placeholder',
    };
  });

  return {
    total: results.length,
    valid: results.filter(r => r.status === 'valid').length,
    invalid: results.filter(r => r.status === 'invalid').length,
    unknown: results.filter(r => r.status === 'unknown').length,
    details: results,
  };
}

// Export report as CSV
export function exportLinkReportAsCSV(report: ReturnType<typeof generateLinkReport>): string {
  const headers = ['URL', 'Status', 'Source', 'Source Type', 'Error'];
  const rows = report.details.map(d => [
    d.url,
    d.status,
    d.source,
    d.sourceType,
    d.error || '',
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

// Get broken links only
export function getBrokenLinks(): LinkValidationResult[] {
  const report = generateLinkReport();
  return report.details.filter(d => d.status === 'invalid');
}
