"use client";

import React from "react";
import Link from "next/link";
import { Edit3, MoreHorizontal, CheckCircle2, XCircle, Zap, X } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/DropdownMenu";
import { Button } from "@/components/ui/Button";

interface LeadActionsProps {
  lead: any;
}

export function LeadActions({ lead }: LeadActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem>
          <Link href={`/dashboard/leads/${lead.id}/edit`} className="flex w-full items-center">
            <Edit3 className="mr-2 h-4 w-4" /> Edit Details
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href={`/dashboard/leads/${lead.id}/approve`} className="flex w-full items-center text-status-success">
            <CheckCircle2 className="mr-2 h-4 w-4" /> Approve
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href={`/dashboard/leads/${lead.id}/reject`} className="flex w-full items-center text-status-error">
            <XCircle className="mr-2 h-4 w-4" /> Reject
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href={`/dashboard/leads/${lead.id}/reprocess`} className="flex w-full items-center text-brand-cyan">
            <Zap className="mr-2 h-4 w-4" /> Re-process
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-status-error" onClick={() => { /* handle delete */ }}>
          <X className="mr-2 h-4 w-4" /> Archive
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}