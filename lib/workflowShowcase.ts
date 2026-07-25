export type StepColor = 'cyan' | 'purple' | 'emerald' | 'amber' | 'coral' | 'muted';

export interface PipelineStep {
  title: string;
  description: string;
  color: StepColor;
}

export interface PipelineBranchPath {
  label: string;
  color: StepColor;
  steps: PipelineStep[];
}

export type PipelineSection =
  | { type: 'step'; step: PipelineStep }
  | { type: 'branch'; title: string; paths: PipelineBranchPath[] };

export interface WorkflowShowcase {
  slug: string;
  name: string;
  tagline: string;
  nodeCount: number;
  file: string;
  tags: string[];
  businessNarrative: string[];
  pipeline: PipelineSection[];
  technicalHighlights: string[];
}

export const workflowShowcases: WorkflowShowcase[] = [
  {
    slug: 'advanced-lead-nurture-sequence',
    name: 'Advanced Multi-Touch Nurture Sequence',
    tagline:
      "Turns a ‘not right now’ into a booked call — automatically, over weeks, without anyone on your team lifting a finger.",
    nodeCount: 27,
    file: 'advanced-lead-nurture-sequence.json',
    tags: ['Wait delays', 'Switch routing', 'Re-scoring', 'Multi-week cadence'],
    businessNarrative: [
      "Most CRMs stop at the first follow-up. If a lead doesn't respond, they quietly fall off the radar — and someone on the team has to remember to check back in. This automation removes that gap entirely.",
      "It runs every 6 hours, finds every WARM and COLD lead that's gone quiet, and keeps working them on its own schedule: fast-paced touches for warm leads who are still likely to convert, and a patient quarterly cadence for cold leads who might just need more time.",
      "The moment a lead shows real engagement — opening an email, clicking through — the system stops nurturing and hands them straight to a sales rep in real time. No missed hot leads, no manual tracking spreadsheets.",
    ],
    pipeline: [
      { type: 'step', step: { title: 'Scan for Eligible Leads', description: 'Every 6 hours, find every WARM and COLD lead that has gone quiet.', color: 'cyan' } },
      {
        type: 'branch',
        title: 'Split by Lead Temperature',
        paths: [
          { label: 'WARM', color: 'emerald', steps: [
            { title: 'Send Touch 1', description: 'Re-engagement email goes out immediately.', color: 'emerald' },
            { title: 'Wait 3 Days', description: 'Give the lead time to respond.', color: 'muted' },
            { title: 'Check Engagement', description: 'Did they open, click, or reply?', color: 'emerald' },
          ]},
          { label: 'COLD', color: 'amber', steps: [
            { title: 'Wait 14 Days', description: 'Long, patient cadence — no pressure.', color: 'muted' },
            { title: 'Send Quarterly Check-in', description: 'A light-touch "still interested?" email.', color: 'amber' },
          ]},
        ],
      },
      {
        type: 'branch',
        title: 'WARM Path — Route by Engagement Level',
        paths: [
          { label: 'High Engagement', color: 'emerald', steps: [
            { title: 'Alert Sales Rep Instantly', description: 'Hand off to a human the moment interest is real.', color: 'emerald' },
          ]},
          { label: 'Medium Engagement', color: 'amber', steps: [
            { title: 'Send Touch 2 (Case Study)', description: 'A stronger, proof-based follow-up.', color: 'amber' },
            { title: 'Wait 5 Days, Then Check Again', description: 'Re-score if they respond; otherwise move to long-term nurture.', color: 'muted' },
          ]},
          { label: 'No Engagement', color: 'muted', steps: [
            { title: 'Move to Long-Term Nurture', description: 'Not gone — just slowed down.', color: 'muted' },
          ]},
        ],
      },
      {
        type: 'branch',
        title: 'COLD Path — On Response',
        paths: [
          { label: 'Responded', color: 'emerald', steps: [
            { title: 'Re-score the Lead', description: 'Circumstances may have changed — check again.', color: 'emerald' },
            { title: 'Reactivate & Notify Sales', description: 'Bring them back into the active pipeline.', color: 'emerald' },
          ]},
          { label: 'No Response', color: 'muted', steps: [
            { title: 'Loop Back Into Long-Term Cadence', description: 'Try again next quarter — automatically.', color: 'muted' },
          ]},
        ],
      },
      { type: 'step', step: { title: 'Every Outcome Logged', description: 'Full history recorded for reporting and audit.', color: 'purple' } },
    ],
    technicalHighlights: [
      '27 real n8n nodes — Wait, Switch, IF, Set, Merge, and HTTP Request nodes wired together',
      'Genuine multi-day / multi-week delays via native n8n Wait nodes, not simulated',
      'Every branch converges back through a Merge node so no lead is ever lost, whichever path they take',
    ],
  },
  {
    slug: 'multi-stage-crm-escalation',
    name: 'Multi-Stage CRM Sync Escalation & Resilience',
    tagline:
      "When your CRM integration hiccups, this diagnoses the failure and knows exactly how to respond — so a lead is never silently lost.",
    nodeCount: 23,
    file: 'multi-stage-crm-escalation.json',
    tags: ['Error classification', 'Exponential backoff', 'Human escalation'],
    businessNarrative: [
      "A failed CRM sync is usually invisible until someone notices a lead is missing. This automation makes that impossible: every failure is classified, retried the right way for its specific cause, and escalated to a human the moment automated recovery won't work.",
      "Not every failure deserves the same response. Expired credentials need a person, immediately — retrying won't fix it. A rate limit needs patience and backoff. A timeout might just need a fast second attempt. This workflow tells the difference and acts accordingly.",
      "If all automated recovery attempts are exhausted, the lead is flagged for manual review and your team gets a high-priority alert — nothing ever waits silently in a failed state.",
    ],
    pipeline: [
      { type: 'step', step: { title: 'CRM Sync Request Received', description: 'A lead is ready to be pushed into the CRM.', color: 'cyan' } },
      { type: 'step', step: { title: 'Attempt Primary Sync', description: 'The straightforward path, tried first.', color: 'purple' } },
      {
        type: 'branch',
        title: 'Success or Failure?',
        paths: [
          { label: 'Success', color: 'emerald', steps: [
            { title: 'Log Success & Done', description: 'Clean sync, nothing further needed.', color: 'emerald' },
          ]},
          { label: 'Failure', color: 'coral', steps: [
            { title: 'Classify the Error Type', description: 'Not all failures are the same — diagnose first.', color: 'coral' },
          ]},
        ],
      },
      {
        type: 'branch',
        title: 'Retry Strategy — Matched to the Failure',
        paths: [
          { label: 'Bad Credentials', color: 'coral', steps: [
            { title: 'Alert Ops Immediately', description: 'Retrying won’t help — this needs a human.', color: 'coral' },
            { title: 'Halt Automated Retries', description: 'Stop wasting attempts on an unrecoverable error.', color: 'muted' },
          ]},
          { label: 'Rate Limited', color: 'amber', steps: [
            { title: 'Wait 60s, Retry', description: 'Short first backoff.', color: 'amber' },
            { title: 'Still Failing? Wait 5min, Retry Once More', description: 'Longer second backoff before giving up.', color: 'amber' },
          ]},
          { label: 'Timeout', color: 'amber', steps: [
            { title: 'Fast Retry (10s)', description: 'Timeouts often resolve on a quick second try.', color: 'amber' },
            { title: 'Still Failing? Wait 2min, Retry Once More', description: 'One more attempt before escalating.', color: 'amber' },
          ]},
          { label: 'Unknown Error', color: 'muted', steps: [
            { title: 'Log Full Context', description: 'Capture everything for debugging.', color: 'muted' },
            { title: 'Escalate Immediately', description: 'Unfamiliar errors go straight to a human.', color: 'coral' },
          ]},
        ],
      },
      { type: 'step', step: { title: 'Check Total Attempt Count', description: 'Every path converges here before deciding what happens next.', color: 'purple' } },
      {
        type: 'branch',
        title: 'Attempts Exhausted?',
        paths: [
          { label: 'Yes — Give Up Automating', color: 'coral', steps: [
            { title: 'Flag Lead for Manual Review', description: 'A person takes it from here.', color: 'coral' },
            { title: 'Send High-Priority Alert', description: 'The team is notified, not left guessing.', color: 'coral' },
          ]},
          { label: 'No — Recovered', color: 'emerald', steps: [
            { title: 'Log Final Outcome', description: 'Success recorded after retry.', color: 'emerald' },
          ]},
        ],
      },
    ],
    technicalHighlights: [
      '23 nodes, 4-way error classification via a Switch node, independent backoff timing per failure type',
      'Every retry path — success or exhausted — converges through a Merge node into one final audit record',
      'Models a real production pattern: fail fast on unrecoverable errors, back off patiently on transient ones',
    ],
  },
  {
    slug: 'enterprise-lead-scoring-orchestration',
    name: 'Enterprise Lead Scoring Orchestration',
    tagline:
      'Two independent scoring engines run at the same time and cross-check each other, so one AI mistake never decides who your sales team calls first.',
    nodeCount: 26,
    file: 'enterprise-lead-scoring-orchestration.json',
    tags: ['Parallel branches', 'Score reconciliation', 'Fan-out / fan-in'],
    businessNarrative: [
      'Relying on a single AI score is risky — models can misread a submission or return an inconsistent result. This automation never trusts one source alone.',
      'It runs a deterministic, rules-based score and an AI-generated score in true parallel, then compares them. If they disagree significantly, it defaults to the safer rules-based number and flags the discrepancy for a human to look at — the AI never gets the final say by itself.',
      'Once a lead’s category is settled, three separate actions — drafting the follow-up, syncing the CRM, and notifying the right person — all fire at the same time instead of one after another, so a HOT lead reaches a salesperson in seconds, not minutes.',
    ],
    pipeline: [
      { type: 'step', step: { title: 'Lead Ready for Orchestrated Scoring', description: 'Triggered once initial intake is complete.', color: 'cyan' } },
      {
        type: 'branch',
        title: 'Run Both Scoring Engines — True Parallel Execution',
        paths: [
          { label: 'Deterministic', color: 'purple', steps: [
            { title: 'Rules-Based Score', description: 'Transparent, predictable, always explainable.', color: 'purple' },
          ]},
          { label: 'AI', color: 'purple', steps: [
            { title: 'AI-Generated Score', description: 'Nuanced, with a built-in timeout safety net.', color: 'purple' },
          ]},
        ],
      },
      { type: 'step', step: { title: 'Compare & Reconcile', description: 'Both results merge into one comparison step.', color: 'purple' } },
      {
        type: 'branch',
        title: 'Do the Two Scores Agree?',
        paths: [
          { label: 'Significant Gap', color: 'amber', steps: [
            { title: 'Flag Discrepancy for Review', description: 'A human sees exactly where the models disagreed.', color: 'amber' },
            { title: 'Default to Rules-Based Score', description: 'The safer, explainable number wins by default.', color: 'amber' },
          ]},
          { label: 'Close Enough', color: 'emerald', steps: [
            { title: 'Blend Into Weighted Final Score', description: 'Both engines contribute to the result.', color: 'emerald' },
          ]},
        ],
      },
      {
        type: 'branch',
        title: 'Confidence Check',
        paths: [
          { label: 'Low Confidence', color: 'coral', steps: [
            { title: 'Route Straight to Human Review', description: 'Genuine uncertainty never gets auto-decided.', color: 'coral' },
          ]},
          { label: 'Confident', color: 'emerald', steps: [
            { title: 'Route by Final Category', description: 'On to the category-specific action fan-out.', color: 'emerald' },
          ]},
        ],
      },
      {
        type: 'branch',
        title: 'Category Fan-Out — All Actions Fire Simultaneously',
        paths: [
          { label: 'HOT', color: 'emerald', steps: [
            { title: 'Priority Follow-up', description: 'Drafted immediately.', color: 'emerald' },
            { title: 'High-Priority CRM Sync', description: 'Pushed to the top of the pipeline.', color: 'emerald' },
            { title: 'Instant Sales Alert', description: 'A rep is notified in real time.', color: 'emerald' },
          ]},
          { label: 'WARM', color: 'amber', steps: [
            { title: 'Standard Follow-up', description: 'Drafted for review.', color: 'amber' },
            { title: 'Standard CRM Sync', description: 'Synced at normal priority.', color: 'amber' },
            { title: 'Enter Nurture Sequence', description: 'Handed to the multi-touch nurture automation.', color: 'amber' },
          ]},
          { label: 'COLD', color: 'muted', steps: [
            { title: 'Low-Priority CRM Sync', description: 'Recorded, not urgent.', color: 'muted' },
            { title: 'Add to Long-Term List', description: 'Revisited on a slower cadence.', color: 'muted' },
          ]},
        ],
      },
      { type: 'step', step: { title: 'Full Score Audit Trail Recorded', description: 'Deterministic score, AI score, final score, and the reasoning — all traceable after the fact.', color: 'purple' } },
    ],
    technicalHighlights: [
      '26 nodes, including genuine parallel execution (not sequential IF/else) for both scoring and the final category actions',
      'A Merge node reconciles two independent Deterministic and AI results into one number before anything downstream happens',
      'Fan-out / fan-in pattern: 3 actions per category run simultaneously, then converge before the workflow completes',
    ],
  },
];

export function getWorkflowShowcase(slug: string): WorkflowShowcase | undefined {
  return workflowShowcases.find((w) => w.slug === slug);
}
