export interface LeadsFilterParams {
  q?: string;
  category?: string;
  status?: string;
  crmStatus?: string;
  dateRange?: string;
}

const DATE_RANGE_DAYS: Record<string, number> = {
  today: 1,
  week: 7,
  month: 30,
  quarter: 90,
};

export function buildLeadsWhere(params: LeadsFilterParams) {
  const where: Record<string, unknown> = {};

  if (params.q) {
    where.OR = [
      { fullName: { contains: params.q, mode: 'insensitive' } },
      { companyName: { contains: params.q, mode: 'insensitive' } },
      { workEmail: { contains: params.q, mode: 'insensitive' } },
    ];
  }
  if (params.category) where.category = params.category;
  if (params.status) where.status = params.status;
  if (params.crmStatus) where.crmSyncStatus = params.crmStatus;

  const days = params.dateRange ? DATE_RANGE_DAYS[params.dateRange] : undefined;
  if (days) {
    const from = new Date();
    from.setDate(from.getDate() - days);
    where.createdAt = { gte: from };
  }

  return where;
}
