"use client";
import React from "react";
import { Shield, AlertTriangle, CheckCircle2, FileText, HardHat, Flame, Zap, Droplets } from "lucide-react";

const safetyChecklist = [
  { category: "Pre-Construction", items: [
    { task: "Asbestos / Lead Paint survey completed", status: "complete" },
    { task: "Structural engineering review (if load-bearing)", status: "pending" },
    { task: "Utility locate (call 811) confirmed", status: "complete" },
    { task: "Site safety plan posted", status: "pending" },
  ]},
  { category: "On-Site Requirements", items: [
    { task: "Hard hats & safety glasses available", status: "complete" },
    { task: "Fire extinguisher on site (Class ABC)", status: "complete" },
    { task: "First aid kit stocked & accessible", status: "complete" },
    { task: "GFCI protection for all temporary power", status: "pending" },
    { task: "Fall protection for work above 6 feet", status: "pending" },
  ]},
  { category: "Inspections Required", items: [
    { task: "Rough plumbing inspection", status: "upcoming" },
    { task: "Rough electrical inspection", status: "upcoming" },
    { task: "Framing inspection", status: "upcoming" },
    { task: "Final building inspection", status: "upcoming" },
  ]},
];

const riskMetrics = [
  { label: "Overall Risk Score", value: "Medium", icon: Shield, color: "var(--warning)" },
  { label: "Open Safety Items", value: "4", icon: AlertTriangle, color: "var(--danger)" },
  { label: "Permits Filed", value: "2/3", icon: FileText, color: "var(--info)" },
  { label: "Days Since Incident", value: "47", icon: HardHat, color: "var(--success)" },
];

export default function SafetyPage() {
  return (
    <div className="animate-fade">
      <div className="page-header">
        <h1>Safety & Compliance</h1>
        <p>AI-powered safety analysis, permit tracking, and inspection readiness</p>
      </div>

      <div className="grid-4" style={{ marginBottom: 28 }}>
        {riskMetrics.map((m) => (
          <div key={m.label} className="metric-card">
            <div className="metric-header">
              <span className="metric-label">{m.label}</span>
              <div className="metric-icon" style={{ background: `${m.color}20`, color: m.color }}>
                <m.icon size={20} />
              </div>
            </div>
            <div className="metric-value" style={{ color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Blueprint Safety Scanner */}
      <div className="card" style={{ marginBottom: 20, background: "var(--accent-glow)", border: "1px solid rgba(59,130,246,0.2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <Shield size={20} style={{ color: "var(--accent)" }} />
          <h3 style={{ fontSize: 15, fontWeight: 600 }}>Blueprint Safety Scanner — AI Analysis</h3>
        </div>
        <div className="grid-3">
          {[
            { icon: Flame, label: "Fire Safety", status: "2 flags", color: "var(--danger)", detail: "GFCI not specified near water sources" },
            { icon: Zap, label: "Electrical Safety", status: "1 flag", color: "var(--warning)", detail: "Heated floor needs dedicated 20A breaker" },
            { icon: Droplets, label: "Waterproofing", status: "Critical", color: "var(--danger)", detail: "No membrane specified for wet areas" },
          ].map((item) => (
            <div key={item.label} className="card" style={{ borderLeft: `3px solid ${item.color}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <item.icon size={16} style={{ color: item.color }} />
                <span style={{ fontWeight: 600, fontSize: 14 }}>{item.label}</span>
                <span className="badge" style={{ background: `${item.color}20`, color: item.color, marginLeft: "auto" }}>{item.status}</span>
              </div>
              <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>{item.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Checklists */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {safetyChecklist.map((section) => (
          <div key={section.category} className="card">
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>{section.category}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {section.items.map((item, i) => (
                <div key={i} className="extraction-item">
                  <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
                    {item.status === "complete" ? (
                      <CheckCircle2 size={16} style={{ color: "var(--success)" }} />
                    ) : item.status === "pending" ? (
                      <AlertTriangle size={16} style={{ color: "var(--warning)" }} />
                    ) : (
                      <FileText size={16} style={{ color: "var(--text-muted)" }} />
                    )}
                    {item.task}
                  </span>
                  <span className={`badge ${item.status === "complete" ? "badge-success" : item.status === "pending" ? "badge-warning" : "badge-info"}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
