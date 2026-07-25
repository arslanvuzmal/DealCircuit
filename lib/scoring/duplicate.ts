import { prisma } from '../db';

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  duplicateOfId?: string;
  reason?: string;
}

export async function detectDuplicateLead(
  normalizedEmail: string,
  normalizedPhone?: string,
  companyName?: string,
  fullName?: string,
  idempotencyKey?: string
): Promise<DuplicateCheckResult> {
  // 1. Check idempotency key if provided
  if (idempotencyKey) {
    const existingByIdempotency = await prisma.lead.findUnique({
      where: { idempotencyKey },
    });
    if (existingByIdempotency) {
      return {
        isDuplicate: true,
        duplicateOfId: existingByIdempotency.id,
        reason: `Matched exact idempotency key: ${idempotencyKey}`,
      };
    }
  }

  // 2. Check exact normalized email
  const existingByEmail = await prisma.lead.findFirst({
    where: { normalizedEmail },
    orderBy: { createdAt: 'desc' },
  });
  if (existingByEmail) {
    return {
      isDuplicate: true,
      duplicateOfId: existingByEmail.id,
      reason: `Matched exact email address: ${normalizedEmail}`,
    };
  }

  // 3. Check normalized phone if present
  if (normalizedPhone && normalizedPhone.length >= 7) {
    const existingByPhone = await prisma.lead.findFirst({
      where: { normalizedPhone },
      orderBy: { createdAt: 'desc' },
    });
    if (existingByPhone) {
      return {
        isDuplicate: true,
        duplicateOfId: existingByPhone.id,
        reason: `Matched phone number: ${normalizedPhone}`,
      };
    }
  }

  // 4. Check company name + full name combination
  if (companyName && fullName) {
    const existingByCompanyAndName = await prisma.lead.findFirst({
      where: {
        companyName: { equals: companyName },
        fullName: { equals: fullName },
      },
      orderBy: { createdAt: 'desc' },
    });
    if (existingByCompanyAndName) {
      return {
        isDuplicate: true,
        duplicateOfId: existingByCompanyAndName.id,
        reason: `Matched company "${companyName}" and contact name "${fullName}"`,
      };
    }
  }

  return { isDuplicate: false };
}
