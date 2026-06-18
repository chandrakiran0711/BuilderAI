"use client";
import React, { useState } from "react";
import { Zap, Play, Pause, CheckCircle2, AlertTriangle, ArrowRight, Plus } from "lucide-react";

const workflowRules = [
  { id: "w1", name: "Low Margin Alert", enabled: true, trigger: "Quote margin drops below 15%", action: "Notify project manager & flag quote for review", fired: 3 },
  { id: "w2", name: "Auto-Dispatch on Approval", enabled: true, trigger: "Project status changes to Approved", action: "Create dispatch tasks for all materials with lead time > 5 days", fired: 7 },
  { id: "w3", name: "Missing Info Escalation", enabled: true, trigger: "Critical missing info unresolved for 48 hours", action: "Auto-generate RFI and email architect", fired: 2 },
  { id: "w4", name: "Stock Alert", enabled: false, trigger: "Material stock drops below 20 units", action: "Notify procurement team & suggest alternative suppliers", fired: 0 },
  { id: "w5", name: "Weather Delay Warning", enabled: true, trigger: "Rain probability > 70% on outdoor task day", action: "Suggest schedule reorder: prioritize indoor work", fired: 5 },
  { id: "w6", name: "Safety Compliance Check", enabled: true, trigger: "New project created with extracted safety flags", action: "Auto-generate safety checklist and assign to site foreman", fired: 4 },
];

export default function WorkflowsPage() {
  const [rules, setRules] = useState(workflowRules);

  const toggle = (id: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  return (
    <div className="animate-fade">
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1>Workflow Automations</h1>
          <p>AI-powered WHEN → THEN rules that automate your construction operations</p>
        </div>
        <button className="btn btn-primary"><Plus size={16} /> New Rule</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {rules.map((rule) => (
          <div key={rule.id} className="card" style={{ opacity: rule.enabled ? 1 : 0.5, transition: "opacity 0.3s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <Zap size={18} style={{ color: rule.enabled ? "var(--accent)" : "var(--text-muted)" }} />
                  <span style={{ fontWeight: 600, fontSize: 16 }}>{rule.name}</span>
                  {rule.enabled && <span className="badge badge-success">Active</span>}
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ padding: "8px 14px", background: "var(--bg-surface)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", fontSize: 13 }}>
                    <span style={{ color: "var(--warning)", fontWeight: 600, marginRight: 6 }}>WHEN</span>
                    {rule.trigger}
                  </div>
                  <ArrowRight size={16} style={{ color: "var(--text-muted)" }} />
                  <div style={{ padding: "8px 14px", background: "var(--bg-surface)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", fontSize: 13 }}>
                    <span style={{ color: "var(--success)", fontWeight: 600, marginRight: 6 }}>THEN</span>
                    {rule.action}
                  </div>
                </div>
                {rule.fired > 0 && (
                  <div style={{ marginTop: 8, fontSize: 12, color: "var(--text-muted)" }}>
                    Triggered {rule.fired} times
                  </div>
                )}
              </div>
              <button className={`btn btn-sm ${rule.enabled ? "btn-secondary" : "btn-primary"}`} onClick={() => toggle(rule.id)}>
                {rule.enabled ? <><Pause size={14} /> Pause</> : <><Play size={14} /> Enable</>}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
