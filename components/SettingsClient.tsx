"use client";

import React, { useState } from "react";
import { Settings, Bell, Database, Zap, Shield, Globe, Save, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";

export default function SettingsClient() {
  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
  };

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "integrations", label: "Integrations", icon: Database },
    { id: "workflows", label: "Workflows", icon: Zap },
    { id: "security", label: "Security", icon: Shield },
    { id: "data", label: "Data & Privacy", icon: Globe },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-page-title text-text-primary flex items-center gap-2"><Settings className="w-6 h-6 text-brand-blue" /> Settings</h1>
          <p className="text-body-sm text-text-muted mt-1">Workspace configuration - integrations, security, data policies, and preferences.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="whitespace-nowrap"><Loader2 className={`w-4 h-4 mr-2 ${saving ? "animate-spin" : "hidden"}`} /> <Save className={`w-4 h-4 mr-2 ${!saving ? "hidden" : ""}`} />{saving ? "Saving..." : "Save Changes"}</Button>
      </div>

      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center justify-center gap-2 px-4 py-3">
              <tab.icon className="w-4 h-4" /> {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card variant="padded" className="space-y-6">
            <CardHeader><CardTitle className="flex items-center gap-2"><Settings className="w-5 h-5 text-brand-blue" /> Workspace Identity</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-body-sm font-medium text-text-secondary">Workspace Name</label><Input value="DealCircuit" onChange={() => {}} placeholder="DealCircuit" /></div>
                <div className="space-y-2"><label className="text-body-sm font-medium text-text-secondary">Workspace Slug</label><Input value="leadpilot-ai" onChange={() => {}} placeholder="leadpilot-ai" /></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card variant="padded" className="space-y-6">
            <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5 text-brand-blue" /> Notification Channels</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-surface-interactive rounded-lg border border-border-subtle"><p className="text-body-sm text-text-secondary">Notifications settings coming soon...</p></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card variant="padded" className="space-y-6">
            <CardHeader><CardTitle className="flex items-center gap-2"><Database className="w-5 h-5 text-brand-blue" /> CRM Configuration</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-surface-interactive rounded-lg border border-border-subtle"><p className="text-body-sm text-text-secondary">Integrations settings coming soon...</p></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6">
          <Card variant="padded" className="space-y-6">
            <CardHeader><CardTitle className="flex items-center gap-2"><Zap className="w-5 h-5 text-brand-blue" /> n8n Workflow Engine</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-surface-interactive rounded-lg border border-border-subtle"><p className="text-body-sm text-text-secondary">Workflows settings coming soon...</p></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card variant="padded" className="space-y-6">
            <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5 text-brand-blue" /> Authentication & Access</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-surface-interactive rounded-lg border border-border-subtle"><p className="text-body-sm text-text-secondary">Security settings coming soon...</p></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card variant="padded" className="space-y-6">
            <CardHeader><CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5 text-brand-blue" /> Data Retention & Privacy</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-surface-interactive rounded-lg border border-border-subtle"><p className="text-body-sm text-text-secondary">Data settings coming soon...</p></div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {process.env.NEXT_PUBLIC_DEMO_MODE === "true" && (<Card variant="compact" className="border-brand-cyan/30 bg-brand-cyan-dim/30"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><Badge variant="info" size="sm">DEMO MODE</Badge><span className="text-body-sm text-text-secondary">Settings changes are simulated. <a href="/dashboard/demo-controls" className="text-brand-cyan hover:underline ml-2">Manage demo data</a></span></div></div></Card>)}
    </div>
  );
}