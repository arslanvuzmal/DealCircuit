import { prisma } from '../db';

export async function logAuditEvent(data: {
  userId?: string;
  userEmail?: string;
  action: string;
  entityType: string;
  entityId: string;
  previousValue?: any;
  newValue?: any;
  reason?: string;
  ipAddress?: string;
}) {
  return prisma.auditLog.create({
    data: {
      userId: data.userId,
      userEmail: data.userEmail,
      action: data.action,
      entityType: data.entityType,
      entityId: data.entityId,
      previousValue: data.previousValue ? JSON.stringify(data.previousValue) : null,
      newValue: data.newValue ? JSON.stringify(data.newValue) : null,
      reason: data.reason,
      ipAddress: data.ipAddress,
    },
  });
}

export async function createInAppNotification(data: {
  title: string;
  message: string;
  type: 'HOT_LEAD' | 'REVIEW_NEEDED' | 'SYNC_ERROR' | 'SYSTEM';
}) {
  return prisma.notification.create({
    data: {
      title: data.title,
      message: data.message,
      type: data.type,
    },
  });
}

export async function recordWorkflowExecution(data: {
  workflowName: string;
  executionId?: string;
  status: 'SUCCESS' | 'FAILED' | 'RUNNING';
  startedAt?: Date;
  completedAt?: Date;
  details?: any;
}) {
  return prisma.workflowRun.create({
    data: {
      workflowName: data.workflowName,
      executionId: data.executionId || `exec_${Date.now()}`,
      status: data.status,
      startedAt: data.startedAt || new Date(),
      completedAt: data.completedAt || new Date(),
      detailsJson: data.details ? JSON.stringify(data.details) : null,
    },
  });
}
