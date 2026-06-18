"use client";
import React from "react";
import { Truck, Clock, MapPin, CheckCircle2, Package, AlertTriangle, User } from "lucide-react";
import { useStore } from "@/lib/store";
import { getPriorityColor } from "@/lib/data";

const columns = [
  { key: "Ready", label: "Ready to Load", color: "var(--warning)" },
  { key: "Loading", label: "Loading", color: "var(--info)" },
  { key: "In Transit", label: "In Transit", color: "var(--accent)" },
  { key: "Delivered", label: "Delivered", color: "var(--success)" },
];

export default function DispatchPage() {
  const tasks = useStore((s) => s.dispatchTasks);

  return (
    <div className="animate-fade">
      <div className="page-header">
        <h1>Dispatch Board</h1>
        <p>Track deliveries and manage field logistics in real-time</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns.length}, 1fr)`, gap: 16, minHeight: "70vh" }}>
        {columns.map((col) => {
          const colTasks = tasks.filter(t => t.status === col.key);
          return (
            <div key={col.key} style={{ background: "var(--bg-surface)", borderRadius: "var(--radius)", padding: 16, border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: col.color }} />
                <span style={{ fontWeight: 600, fontSize: 14 }}>{col.label}</span>
                <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--text-muted)", background: "var(--bg-card)", padding: "2px 8px", borderRadius: 10 }}>
                  {colTasks.length}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {colTasks.map((task) => (
                  <div key={task.id} className="card" style={{ padding: 14, borderLeft: `3px solid ${getPriorityColor(task.priority)}` }}>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{task.project_name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: 4 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <User size={12} /> {task.driver}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <MapPin size={12} /> {task.location}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Clock size={12} /> {task.delivery_date}
                      </span>
                    </div>
                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid var(--border)" }}>
                      {task.items.map((item, i) => (
                        <div key={i} style={{ fontSize: 11, color: "var(--text-secondary)", padding: "2px 0", display: "flex", alignItems: "center", gap: 4 }}>
                          <Package size={10} /> {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {colTasks.length === 0 && (
                  <div style={{ textAlign: "center", padding: 24, color: "var(--text-muted)", fontSize: 13 }}>
                    No tasks
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
