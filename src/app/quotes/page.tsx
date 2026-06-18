"use client";
import React from "react";
import Link from "next/link";
import { FileText, TrendingUp, ArrowUpRight, CheckCircle2, Clock, Send, Download, DollarSign } from "lucide-react";
import { useStore } from "@/lib/store";
import { getStatusColor } from "@/lib/data";

export default function QuotesPage() {
  const quotes = useStore((s) => s.quotes);
  const projects = useStore((s) => s.projects);

  const totalPipeline = quotes.reduce((sum, q) => {
    const sub = q.material_cost + q.labor_cost + q.delivery_fee;
    return sum + sub + sub * (q.margin_percent / 100);
  }, 0);

  return (
    <div className="animate-fade">
      <div className="page-header">
        <h1>Quotes</h1>
        <p>Manage quotes, track margins, and monitor your sales pipeline</p>
      </div>

      <div className="grid-4" style={{ marginBottom: 28 }}>
        <div className="metric-card">
          <span className="metric-label">Total Quotes</span>
          <span className="metric-value">{quotes.length}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Pipeline Value</span>
          <span className="metric-value" style={{ color: "var(--accent)" }}>${(totalPipeline / 1000).toFixed(0)}K</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Avg Margin</span>
          <span className="metric-value" style={{ color: "var(--success)" }}>
            {quotes.length > 0 ? Math.round(quotes.reduce((s, q) => s + q.margin_percent, 0) / quotes.length) : 0}%
          </span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Pending</span>
          <span className="metric-value">{quotes.filter(q => q.status === "Draft" || q.status === "Sent").length}</span>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr><th>Project</th><th>Material</th><th>Labor</th><th>Delivery</th><th>Margin</th><th>Total</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {quotes.map((q) => {
                const proj = projects.find(p => p.id === q.project_id);
                const sub = q.material_cost + q.labor_cost + q.delivery_fee;
                const total = sub + sub * (q.margin_percent / 100);
                return (
                  <tr key={q.id}>
                    <td style={{ fontWeight: 600 }}>{proj?.project_name || q.project_id}</td>
                    <td>${q.material_cost.toLocaleString()}</td>
                    <td>${q.labor_cost.toLocaleString()}</td>
                    <td>${q.delivery_fee}</td>
                    <td style={{ color: q.margin_percent >= 20 ? "var(--success)" : "var(--warning)", fontWeight: 600 }}>{q.margin_percent}%</td>
                    <td style={{ fontWeight: 700, color: "var(--accent)" }}>${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                    <td><span className="badge" style={{ background: `${getStatusColor(q.status)}20`, color: getStatusColor(q.status) }}>{q.status}</span></td>
                    <td>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button className="btn btn-ghost btn-sm" title="Send"><Send size={14} /></button>
                        <button className="btn btn-ghost btn-sm" title="Download"><Download size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
