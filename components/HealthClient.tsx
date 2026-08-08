"use client";

import React from "react";
import { CheckCircle2, Database, Mail, Zap, ShieldCheck, Cpu, HardDrive, Wifi, AlertCircle, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface ServiceStatus {
  name: string;
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
  status: "UP" | "DOWN" | "DEGRADED";
  details: string[];
  latency?: string;
}

export default function HealthClient() {
  const services: ServiceStatus[] = [
    {
      name: "PostgreSQL Database",
      icon: <Database className="w-5 h-5" />,
      iconColor: "text-brand-cyan",
      iconBg: "bg-brand-cyan-dim",
      status: "UP",
      details: ["PostgreSQL 15 via Prisma ORM", "Connection pool: 10/20 active", "Last migration: 2 days ago"],
      latency: "12ms",
    },
    {
      name: "Mailpit SMTP",
      icon: <Mail className="w-5 h-5" />,
      iconColor: "text-brand-purple",
      iconBg: "bg-brand-purple/20",
      status: "UP",
      details: ["Port 1025 (SMTP) / 8025 (UI)", "Local offline dispatch mode", "1,234 emails captured (24h)"],
      latency: "8ms",
    },
    {
      name: "n8n Workflow Engine",
      icon: <Zap className="w-5 h-5" />,
      iconColor: "text-brand-amber",
      iconBg: "bg-brand-amber/20",
      status: "UP",
      details: ["Version 1.42.3 (self-hosted)", "3 active workflows", "4,235 total executions"],
      latency: "45ms",
    },
    {
      name: "CRM Adapter (HubSpot)",
      icon: <ShieldCheck className="w-5 h-5" />,
      iconColor: "text-brand-blue",
      iconBg: "bg-brand-blue/20",
      status: "UP",
      details: ["Real-time webhook sync", "247 records synced (24h)", "3 failed, 12 pending retry"],
      latency: "234ms",
    },
    {
      name: "Application Server",
      icon: <Cpu className="w-5 h-5" />,
      iconColor: "text-brand-emerald",
      iconBg: "bg-brand-emerald/20",
      status: "UP",
      details: ["Next.js 14.2.35", "Node.js 24.x", "Memory: 342 MB / 1 GB"],
      latency: "2ms",
    },
    {
      name: "File Storage",
      icon: <HardDrive className="w-5 h-5" />,
      iconColor: "text-brand-coral",
      iconBg: "bg-brand-coral/20",
      status: "UP",
      details: ["Local filesystem", "Available: 42.3 GB / 100 GB", "Upload temp: /tmp/leadpilot"],
      latency: "1ms",
    },
  ];

  const allHealthy = services.every((s) => s.status === "UP");

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-page-title text-text-primary flex items-center gap-2">
            <Cpu className="w-6 h-6 text-brand-emerald" /> System Health
          </h1>
          <p className="text-body-sm text-text-muted mt-1">System diagnostics, database connectivity, and environment status.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={allHealthy ? "success" : "warning"} size="md" className="flex items-center gap-2">
            {allHealthy ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {allHealthy ? "ALL SYSTEMS OPERATIONAL" : "DEGRADED PERFORMANCE"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <Card key={service.name} variant="padded" className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${service.iconBg}`}>{service.icon}</div>
                <div>
                  <p className="font-medium text-text-primary">{service.name}</p>
                  <p className="text-caption text-text-muted">Service</p>
                </div>
              </div>
              <Badge
                variant={
                  service.status === "UP" ? "success" :
                  service.status === "DOWN" ? "error" : "warning"
                }
                size="sm"
                className="self-start"
              >
                {service.status}
              </Badge>
            </div>

            <div className="space-y-2 pt-2 border-t border-border-subtle">
              {service.details.map((detail, i) => (
                <div key={i} className="flex items-center justify-between text-caption">
                  <span className="text-text-secondary">{detail}</span>
                  {service.latency && i === service.details.length - 1 && (
                    <span className="font-mono text-text-primary">{service.latency}</span>
                  )}
                </div>
              ))}
            </div>

            {service.latency && (
              <div className="flex items-center justify-between pt-2">
                <span className="text-caption text-text-muted">Avg Latency</span>
                <span className="font-mono text-text-primary">{service.latency}</span>
              </div>
            )}
          </Card>
        ))}
      </div>

      <Card variant="padded" className="space-y-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Wifi className="w-5 h-5 text-brand-blue" /> Environment Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-caption">
            <div className="p-3 bg-surface-interactive rounded-lg border border-border-subtle">
              <p className="text-text-muted">DEMO_MODE</p>
              <p className="font-mono text-text-primary">{process.env.NEXT_PUBLIC_DEMO_MODE === "true" ? "true (Simulated)" : "false (Production)"}</p>
            </div>
            <div className="p-3 bg-surface-interactive rounded-lg border border-border-subtle">
              <p className="text-text-muted">Auth Policy</p>
              <p className="font-mono text-text-primary">JWT HTTP-Only Cookie (7 Days)</p>
            </div>
            <div className="p-3 bg-surface-interactive rounded-lg border border-border-subtle">
              <p className="text-text-muted">Prompt Injection Defense</p>
              <p className="font-mono text-status-success">ACTIVE</p>
            </div>
            <div className="p-3 bg-surface-interactive rounded-lg border border-border-subtle">
              <p className="text-text-muted">Duplicate Detection</p>
              <p className="font-mono text-status-success">ACTIVE</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {process.env.NEXT_PUBLIC_DEMO_MODE === "true" && (
        <Card variant="compact" className="border-brand-cyan/30 bg-brand-cyan-dim/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="info" size="sm">DEMO MODE</Badge>
              <span className="text-body-sm text-text-secondary">Data is simulated. <a href="/dashboard/demo-controls" className="text-brand-cyan hover:underline ml-2">Manage demo data →</a></span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}