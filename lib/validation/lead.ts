import { z } from 'zod';

export const publicLeadSubmissionSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  workEmail: z.string().email('Please enter a valid work email address'),
  phoneNumber: z.string().optional().default(''),
  companyName: z.string().min(2, 'Company name is required'),
  companyWebsite: z.string().optional().default(''),
  industry: z.string().min(2, 'Industry is required'),
  companySize: z.string().min(1, 'Company size is required'),
  serviceRequired: z.string().min(2, 'Service required is required'),
  budgetRange: z.string().min(1, 'Budget range is required'),
  desiredTimeline: z.string().min(1, 'Desired timeline is required'),
  decisionAuthority: z.string().min(1, 'Decision authority is required'),
  projectDescription: z.string().min(10, 'Please provide a detailed project description (at least 10 chars)'),
  leadSource: z.string().optional().default('Website Form'),
  consent: z.boolean().refine((val) => val === true, 'You must consent to continue'),
  websiteHoneypot: z.string().optional().default(''),
});

export type PublicLeadSubmissionInput = z.infer<typeof publicLeadSubmissionSchema>;

export function normalizeLeadData(input: PublicLeadSubmissionInput) {
  const normalizedEmail = input.workEmail.trim().toLowerCase();
  
  // Clean phone number (remove non-digits except initial +)
  let normalizedPhone = input.phoneNumber.trim();
  if (normalizedPhone) {
    const hasPlus = normalizedPhone.startsWith('+');
    const digits = normalizedPhone.replace(/\D/g, '');
    normalizedPhone = hasPlus ? `+${digits}` : digits;
  }

  // Clean company website
  let companyWebsite = input.companyWebsite.trim();
  if (companyWebsite && !companyWebsite.startsWith('http://') && !companyWebsite.startsWith('https://')) {
    companyWebsite = `https://${companyWebsite}`;
  }

  return {
    ...input,
    fullName: input.fullName.trim(),
    workEmail: input.workEmail.trim(),
    normalizedEmail,
    phoneNumber: input.phoneNumber.trim(),
    normalizedPhone,
    companyName: input.companyName.trim(),
    companyWebsite,
    projectDescription: input.projectDescription.trim(),
  };
}

export const scoreBreakdownCriterionSchema = z.object({
  score: z.number().min(0),
  maxScore: z.number().min(1),
  reason: z.string(),
});

export const qualificationResultSchema = z.object({
  scoreBreakdown: z.object({
    budgetFit: scoreBreakdownCriterionSchema,
    serviceFit: scoreBreakdownCriterionSchema,
    urgency: scoreBreakdownCriterionSchema,
    decisionAuthority: scoreBreakdownCriterionSchema,
    informationQuality: scoreBreakdownCriterionSchema,
  }),
  totalScore: z.number().min(0).max(100),
  category: z.enum(['HOT', 'WARM', 'COLD', 'REVIEW_REQUIRED']),
  confidence: z.number().min(0).max(1),
  summary: z.string(),
  risks: z.array(z.string()),
  missingInformation: z.array(z.string()),
  recommendedAction: z.string(),
  recommendedFollowUpDelay: z.string(),
});

export type QualificationResult = z.infer<typeof qualificationResultSchema>;
