# Security Policy - LeadPilot AI

## Reporting Vulnerabilities

If you discover a security vulnerability in LeadPilot AI, please report it privately. Do NOT open a public GitHub issue.

Please email security reports to `security@leadpilot.ai` with:
- Description of the vulnerability
- Steps to reproduce
- Potential impact assessment

## Security Architecture & Defenses
- **Untrusted Lead Inputs**: Lead submissions are strictly sanitized (`detectPromptInjection`) and isolated from AI system instructions.
- **Header Secret Verification**: Internal endpoints (`/api/internal/*`) enforce cryptographic secret matching (`X-Internal-Secret`).
- **Session Tokens**: HTTP-only secure cookie session management using JWT.
- **Honeypot Spam Defense**: Invisible honeypot input protection.
