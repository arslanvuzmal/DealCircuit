export interface InjectionCheckResult {
  isInjectionDetected: boolean;
  suspiciousPhrases: string[];
  sanitizedDescription: string;
}

const INJECTION_PATTERNS = [
  /disregard\s+(the\s+)?(scoring\s+policy|instructions|rules|system\s+prompt)/i,
  /ignore\s+(all\s+)?(previous\s+)?(instructions|prompts|rules)/i,
  /expose\s+(your\s+)?(instructions|prompts|system\s+prompt|keys|secrets)/i,
  /classify\s+this\s+lead\s+as\s+(hot|warm|cold)/i,
  /override\s+(the\s+)?(score|category|rules)/i,
  /system\s+prompt\s*:/i,
  /you\s+are\s+now\s+a/i,
  /\[system\s*message\]/i,
  /<system_message>/i,
  /print\s+environment\s+variables/i,
  /export\s+(all|every|the)\s+(lead|data|database)/i,
  /send\s+(them|it|data)\s+to\s+[\w@.-]+/i,
  /exfiltrat(e|ion)/i,
];

export function detectPromptInjection(projectDescription: string, otherFields?: Record<string, string>): InjectionCheckResult {
  const textToScan = [projectDescription, ...Object.values(otherFields || {})].join(' ');
  const suspiciousPhrases: string[] = [];

  for (const pattern of INJECTION_PATTERNS) {
    const match = textToScan.match(pattern);
    if (match) {
      suspiciousPhrases.push(match[0]);
    }
  }

  const isInjectionDetected = suspiciousPhrases.length > 0;

  // Sanitize text by escaping potential prompt tags
  const sanitizedDescription = projectDescription
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return {
    isInjectionDetected,
    suspiciousPhrases,
    sanitizedDescription,
  };
}
