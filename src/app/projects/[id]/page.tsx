"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, CheckCircle2, AlertCircle, XCircle, FileText,
  Package, Clock, MapPin, ThumbsUp, ThumbsDown, Sparkles,
  Download, AlertTriangle, TrendingUp, Shield, Loader2
} from "lucide-react";
import { getStatusColor, getPriorityColor, getConfidenceLevel } from "@/lib/data";
import { useStore } from "@/lib/store";

type Tab = "scope" | "materials" | "quote" | "missing" | "safety";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const project = useStore((s) => s.projects.find((p) => p.id === id));
  const quote = useStore((s) => s.quotes.find((q) => q.project_id === id));
  const [tab, setTab] = useState<Tab>("scope");

  if (!project) {
    return (
      <div className="animate-fade" style={{ textAlign: "center", padding: 60 }}>
        <Loader2 size={40} className="animate-spin" style={{ color: "var(--accent)", margin: "0 auto 16px" }} />
        <h2>Loading project...</h2>
        <p style={{ color: "var(--text-muted)" }}>AI is analyzing your document</p>
      </div>
    );
  }

  const ext = project.extraction;
  const q = quote;
  const subtotal = q ? q.material_cost + q.labor_cost + q.delivery_fee : 0;
  const marginAmt = q ? subtotal * (q.margin_percent / 100) : 0;

  const exportCSV = () => {
    if (!ext) return;
    const rows = [["Material", "Category", "Qty", "Unit", "Unit Price", "Total", "Supplier", "In Stock"]];
    ext.materials_detected.forEach((m) => {
      rows.push([m.name, m.category, String(m.quantity), m.unit, String(m.unit_price), String(m.total), m.supplier, m.in_stock ? "Yes" : "No"]);
    });
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${project.project_name}_materials.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade">
      {/* Header */}
      <Link href="/projects" style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)", textDecoration: "none", fontSize: 13, marginBottom: 16 }}>
        <ArrowLeft size={14} /> Back to Projects
      </Link>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{project.project_name}</h1>
          <div style={{ display: "flex", gap: 16, fontSize: 13, color: "var(--text-muted)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={13} /> {project.job_location}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={13} /> Due: {project.needed_by}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <span className="badge" style={{ background: `${getStatusColor(project.status)}20`, color: getStatusColor(project.status) }}>{project.status}</span>
          <span className="badge" style={{ background: `${getPriorityColor(project.priority)}20`, color: getPriorityColor(project.priority) }}>{project.priority} Priority</span>
        </div>
      </div>

      {/* AI Confidence Banner */}
      {ext && (
        <div className="card" style={{ marginBottom: 20, background: "var(--accent-glow)", border: "1px solid rgba(59,130,246,0.2)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Sparkles size={20} style={{ color: "var(--accent)" }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>AI Extraction Complete — {Math.round(ext.confidence * 100)}% Confidence</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  Classified as: {ext.document_classification} • {ext.scope_items.length} scope items • {ext.materials_detected.length} materials • {ext.missing_info.length} gaps found
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {ext.missing_info.filter(m => m.severity === "Critical").length > 0 && (
                <span className="badge badge-danger"><AlertTriangle size={12} /> {ext.missing_info.filter(m => m.severity === "Critical").length} Critical Gaps</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="tab-bar">
        {[
          { key: "scope", label: "AI Scope Review", icon: Sparkles },
          { key: "materials", label: "Material Takeoff", icon: Package },
          { key: "quote", label: "Quote Builder", icon: FileText },
          { key: "missing", label: `Missing Info (${ext?.missing_info.length || 0})`, icon: AlertCircle },
          { key: "safety", label: "Safety & Permits", icon: Shield },
        ].map((t) => (
          <button key={t.key} className={`tab-item ${tab === t.key ? "active" : ""}`}
            onClick={() => setTab(t.key as Tab)}>
            <t.icon size={14} style={{ marginRight: 6 }} />{t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {!ext ? (
        <div className="card" style={{ textAlign: "center", padding: 60 }}>
          <Loader2 size={36} className="animate-spin" style={{ color: "var(--accent)", margin: "0 auto 12px" }} />
          <h3>AI is extracting data from your document...</h3>
          <p style={{ color: "var(--text-muted)", marginTop: 4 }}>This usually takes 3-5 seconds</p>
        </div>
      ) : (
        <>
          {/* SCOPE TAB */}
          {tab === "scope" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {ext.scope_items.map((item) => (
                <div key={item.id} className="extraction-item">
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                    <span className={`confidence-dot confidence-${getConfidenceLevel(item.confidence)}`} />
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 14 }}>{item.description}</div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                        {item.category} • Page {item.source_page} • {Math.round(item.confidence * 100)}% confident
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span className={`badge ${item.status === "confirmed" ? "badge-success" : item.status === "pending" ? "badge-warning" : "badge-danger"}`}>
                      {item.status === "confirmed" ? <CheckCircle2 size={10} /> : item.status === "pending" ? <AlertCircle size={10} /> : <XCircle size={10} />}
                      {" "}{item.status}
                    </span>
                    <button className="btn btn-ghost btn-sm" title="Approve"><ThumbsUp size={14} /></button>
                    <button className="btn btn-ghost btn-sm" title="Reject"><ThumbsDown size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* MATERIALS TAB */}
          {tab === "materials" && (
            <div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                <button className="btn btn-secondary btn-sm" onClick={exportCSV}>
                  <Download size={14} /> Export CSV
                </button>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Material</th><th>Category</th><th>Qty</th><th>Unit</th><th>Unit Price</th><th>Total</th><th>Supplier</th><th>Stock</th><th>Waste</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ext.materials_detected.map((m) => (
                      <tr key={m.id}>
                        <td style={{ fontWeight: 500 }}>{m.name}</td>
                        <td style={{ color: "var(--text-secondary)" }}>{m.category}</td>
                        <td>{m.quantity}</td>
                        <td style={{ color: "var(--text-muted)" }}>{m.unit}</td>
                        <td>${m.unit_price.toFixed(2)}</td>
                        <td style={{ fontWeight: 600 }}>${m.total.toFixed(2)}</td>
                        <td style={{ fontSize: 13 }}>{m.supplier}</td>
                        <td>{m.in_stock ? <span className="badge badge-success">In Stock</span> : <span className="badge badge-danger">Order</span>}</td>
                        <td style={{ color: m.waste_factor > 0.1 ? "var(--warning)" : "var(--text-muted)" }}>{Math.round(m.waste_factor * 100)}%</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={5} style={{ fontWeight: 700, textAlign: "right" }}>Total Material Cost:</td>
                      <td colSpan={4} style={{ fontWeight: 700, color: "var(--accent)" }}>
                        ${ext.materials_detected.reduce((s, m) => s + m.total, 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* QUOTE TAB */}
          {tab === "quote" && q && (
            <div className="grid-2">
              <div className="card">
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Quote Breakdown</h3>
                {[
                  { label: "Material Cost", value: q.material_cost },
                  { label: "Labor Cost", value: q.labor_cost },
                  { label: "Delivery Fee", value: q.delivery_fee },
                ].map((line) => (
                  <div key={line.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ color: "var(--text-secondary)" }}>{line.label}</span>
                    <span style={{ fontWeight: 500 }}>${line.value.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Subtotal</span>
                  <span style={{ fontWeight: 600 }}>${subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Margin ({q.margin_percent}%)</span>
                  <span style={{ fontWeight: 500, color: "var(--success)" }}>+${marginAmt.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", fontSize: 18 }}>
                  <span style={{ fontWeight: 700 }}>Total Quote</span>
                  <span style={{ fontWeight: 700, color: "var(--accent)" }}>${(subtotal + marginAmt).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
              <div className="card">
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Quote Status</h3>
                <div style={{ textAlign: "center", padding: 20 }}>
                  <span className="badge" style={{ background: `${getStatusColor(q.status)}20`, color: getStatusColor(q.status), fontSize: 14, padding: "8px 16px" }}>{q.status}</span>
                  <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
                    <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>Send to Client</button>
                    <button className="btn btn-secondary" style={{ width: "100%", justifyContent: "center" }}><Download size={14} /> Download PDF</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MISSING INFO TAB */}
          {tab === "missing" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {ext.missing_info.map((mi) => (
                <div key={mi.id} className="card" style={{
                  borderLeft: `3px solid ${mi.severity === "Critical" ? "var(--danger)" : mi.severity === "Important" ? "var(--warning)" : "var(--text-muted)"}`,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <AlertTriangle size={16} style={{ color: mi.severity === "Critical" ? "var(--danger)" : "var(--warning)" }} />
                        <span style={{ fontWeight: 600, fontSize: 14 }}>{mi.field}</span>
                        <span className={`badge ${mi.severity === "Critical" ? "badge-danger" : mi.severity === "Important" ? "badge-warning" : "badge-info"}`}>
                          {mi.severity}
                        </span>
                      </div>
                      <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                        <strong>AI Suggestion:</strong> {mi.suggestion}
                      </p>
                    </div>
                    <button className="btn btn-sm btn-secondary">Generate RFI</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SAFETY TAB */}
          {tab === "safety" && (
            <div className="grid-2">
              <div className="card">
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                  <Shield size={18} style={{ color: "var(--accent)" }} /> Required Permits
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {ext.permits_needed.map((permit, i) => (
                    <div key={i} className="extraction-item">
                      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <FileText size={14} style={{ color: "var(--warning)" }} />
                        {permit}
                      </span>
                      <span className="badge badge-warning">Required</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card">
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                  <AlertTriangle size={18} style={{ color: "var(--danger)" }} /> Safety Flags
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {ext.safety_flags.map((flag, i) => (
                    <div key={i} className="extraction-item" style={{ borderColor: "rgba(239,68,68,0.2)" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                        <AlertTriangle size={14} style={{ color: "var(--danger)" }} />
                        {flag}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
