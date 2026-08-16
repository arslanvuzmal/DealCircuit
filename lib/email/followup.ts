export interface FollowUpDraft {
  subject: string;
  body: string;
  category: string;
}

export function generateFollowUpDraft(
  fullName: string,
  companyName: string,
  category: 'HOT' | 'WARM' | 'COLD' | 'REVIEW_REQUIRED',
  serviceRequired: string,
  missingInfo: string[] = []
): FollowUpDraft {
  const firstName = fullName.split(' ')[0] || fullName;

  if (category === 'HOT') {
    return {
      subject: `Priority: Custom ${serviceRequired} for ${companyName}`,
      body: `Hi ${firstName},

Thank you for reaching out to DealCircuit regarding ${serviceRequired} for ${companyName}.

Based on your project requirements and timeline, we believe this is a high-priority fit for our enterprise team. We would love to invite you to an initial 20-minute discovery call to align on your architecture and custom workflow goals.

You can select a convenient time directly on our calendar here: https://dealcircuit.ai/schedule

Looking forward to speaking with you!

Best regards,
Sales Operations Team
DealCircuit`,
      category: 'HOT',
    };
  }

  if (category === 'WARM') {
    const missingText = missingInfo.length > 0
      ? `To help us tailor our initial proposal, could you share a bit more context regarding: ${missingInfo.join(', ')}?`
      : 'We would love to share a short video overview of how we deliver custom automation for teams like yours.';

    return {
      subject: `Next Steps: ${serviceRequired} for ${companyName}`,
      body: `Hi ${firstName},

Thank you for your interest in DealCircuit! We received your submission for ${serviceRequired} at ${companyName}.

${missingText}

Alternatively, you can reply directly to this email or review our live platform demo at https://dealcircuit.ai/demo.

Best regards,
DealCircuit Team`,
      category: 'WARM',
    };
  }

  if (category === 'COLD') {
    return {
      subject: `Thank you for contacting DealCircuit (${companyName})`,
      body: `Hi ${firstName},

Thank you for taking the time to share your requirements for ${serviceRequired}.

While our enterprise custom delivery models currently focus on dedicated high-scale deployments, we recommend reviewing our self-serve documentation and starter templates at https://dealcircuit.ai/resources.

We appreciate your interest in DealCircuit and wish ${companyName} continued success.

Best regards,
DealCircuit Team`,
      category: 'COLD',
    };
  }

  // REVIEW_REQUIRED
  return {
    subject: `[Pending Clarification] DealCircuit - Submission for ${companyName}`,
    body: `Hi ${firstName},

Thank you for submitting your lead request for ${companyName}.

Our review team is currently reviewing your project details to ensure we pair you with the right solutions specialist. We will reach out with follow-up information shortly.

Best regards,
DealCircuit Review Team`,
    category: 'REVIEW_REQUIRED',
  };
}
