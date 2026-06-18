"use client";
import React from "react";
import Link from "next/link";
import {
  FolderKanban, FileText, Truck, AlertTriangle, TrendingUp,
  ArrowUpRight, Clock, CheckCircle2, Upload, Package, Zap, Shield
} from "lucide-react";
import { useStore } from "@/lib/store";
import { getStatusColor, getPriorityColor } from "@/lib/data";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";

const barData = [
  { name: "Jan", projects: 4 }, { name: "Feb", projects: 6 },
  { name: "Mar", projects: 8 }, { name: "Apr", projects: 5 },
  { name: "May", projects: 11 },
];
const pieData = [
  { name: "Residential", value: 45 }, { name: "Commercial", value: 30 },
  { name: "Industrial", value: 15 }, { name: "Government", value: 10 },
];
const pieColors = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B"];
const areaData = [
  { week: "W1", cost: 12000 }, { week: "W2", cost: 18000 },
  { week: "W3", cost: 15000 }, { week: "W4", cost: 24000 },
  { week: "W5", cost: 21000 },
];

export default function DashboardPage() {
  const projects = useStore((s) => s.projects);
  const quotes = useStore((s) => s.quotes);
  const dispatchTasks = useStore((s) => s.dispatchTasks);

  const metrics = [
    { label: "Active Projects", value: projects.length, icon: FolderKanban, color: "var(--accent)", change: "+2 this week" },
    { label: "Pending Review", value: projects.filter(p => p.status === "Review").length, icon: Clock, color: "var(--warning)", change: "Needs attention" },
    { label: "Quotes Sent", value: quotes.filter(q => q.status === "Sent" || q.status === "Accepted").length, icon: FileText, color: "var(--success)", change: "$42K pipeline" },
    { label: "Active Deliveries", value: dispatchTasks.filter(d => d.status === "In Transit" || d.status === "Loading").length, icon: Truck, color: "var(--info)", change: "On track" },
  ];

  return (
    <div className="animate-fade">
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1>Dashboard</h1>
          <p>Construction Intelligence Overview — {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
        </div>
        <Link href="/projects" className="btn btn-primary">
          <Upload size={16} /> New Project
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid-4" style={{ marginBottom: 28 }}>
        {metrics.map((m) => (
          <div key={m.label} className="metric-card">
            <div className="metric-header">
              <span className="metric-label">{m.label}</span>
              <div className="metric-icon" style={{ background: `${m.color}20`, color: m.color }}>
                <m.icon size={20} />
              </div>
            </div>
            <div className="metric-value">{m.value}</div>
            <div className="metric-change" style={{ color: "var(--text-muted)" }}>
              <TrendingUp size={12} /> {m.change}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid-3" style={{ marginBottom: 28 }}>
        <div className="card">
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Projects This Year</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={barData}>
              <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text-primary)" }} />
              <Bar dataKey="projects" fill="var(--accent)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Project Types</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" paddingAngle={4}>
                {pieData.map((_, i) => <Cell key={i} fill={pieColors[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text-primary)" }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 8 }}>
            {pieData.map((d, i) => (
              <span key={d.name} style={{ fontSize: 11, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: pieColors[i], display: "inline-block" }} />
                {d.name}
              </span>
            ))}
          </div>
        </div>
        <div className="card">
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Weekly Spend</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={areaData}>
              <XAxis dataKey="week" stroke="var(--text-muted)" fontSize={12} />
              <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text-primary)" }} formatter={(v) => [`$${Number(v ?? 0).toLocaleString()}`, "Cost"]} />
              <defs>
                <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--success)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--success)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="cost" stroke="var(--success)" fill="url(#costGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600 }}>Recent Projects</h3>
          <Link href="/projects" style={{ fontSize: 13, color: "var(--accent)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
            View All <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Project</th><th>Customer</th><th>Status</th><th>Priority</th><th>Needed By</th><th></th>
              </tr>
            </thead>
            <tbody>
              {projects.slice(0, 5).map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600 }}>{p.project_name}</td>
                  <td style={{ color: "var(--text-secondary)" }}>{p.customer_name}</td>
                  <td><span className="badge" style={{ background: `${getStatusColor(p.status)}20`, color: getStatusColor(p.status) }}>{p.status}</span></td>
                  <td><span style={{ color: getPriorityColor(p.priority), fontWeight: 600, fontSize: 13 }}>{p.priority}</span></td>
                  <td style={{ color: "var(--text-muted)", fontSize: 13 }}>{p.needed_by}</td>
                  <td>
                    <Link href={`/projects/${p.id}`} className="btn btn-ghost btn-sm">
                      <ArrowUpRight size={14} /> View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
