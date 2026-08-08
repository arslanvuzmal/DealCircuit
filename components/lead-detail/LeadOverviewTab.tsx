"use client";

import React from "react";
import { User, Building2, Radio, Search, Clock } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/Avatar";

interface LeadOverviewTabProps {
  lead: any;
  latestScore: any;
}

export function LeadOverviewTab({ lead, latestScore }: LeadOverviewTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Contact & Company */}
      <Card variant="padded" className="space-y-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-brand-cyan" /> Contact & Company
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-body-sm">
            <div><p className="text-caption text-text-muted">Full Name</p><p className="font-medium text-text-primary">{lead.fullName}</p></div>
            <div><p className="text-caption text-text-muted">Email</p><p className="font-medium text-text-primary">{lead.workEmail}</p></div>
            <div><p className="text-caption text-text-muted">Phone</p><p className="font-medium text-text-primary">{lead.phoneNumber || "—"}</p></div>
            <div><p className="text-caption text-text-muted">Company</p><p className="font-medium text-text-primary">{lead.companyName}</p></div>
            <div><p className="text-caption text-text-muted">Website</p><p className="font-medium text-text-primary">{lead.companyWebsite || "—"}</p></div>
            <div><p className="text-caption text-text-muted">Industry</p><p className="font-medium text-text-primary">{lead.industry}</p></div>
            <div><p className="text-caption text-text-muted">Company Size</p><p className="font-medium text-text-primary">{lead.companySize}</p></div>
            <div><p className="text-caption text-text-muted">Source</p><p className="font-medium text-text-primary">{lead.leadSource}</p></div>
          </div>
        </CardContent>
      </Card>

      {/* Requirements */}
      <Card variant="padded" className="space-y-4 lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-brand-blue" /> Requirements & Budget
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-body-sm">
            <div><p className="text-caption text-text-muted">Service Required</p><p className="font-medium text-text-primary">{lead.serviceRequired}</p></div>
            <div><p className="text-caption text-text-muted">Budget Range</p><p className="font-medium text-brand-blue">{lead.budgetRange}</p></div>
            <div><p className="text-caption text-text-muted">Timeline</p><p className="font-medium text-text-primary">{lead.desiredTimeline}</p></div>
            <div><p className="text-caption text-text-muted">Decision Authority</p><p className="font-medium text-text-primary">{lead.decisionAuthority}</p></div>
          </div>
          <div className="space-y-2">
            <p className="text-caption text-text-muted">Project Description</p>
            <p className="bg-surface-interactive p-4 rounded-lg border border-border-subtle text-body-sm text-text-secondary leading-relaxed">{lead.projectDescription}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}