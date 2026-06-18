"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FolderKanban, FileText, Truck, Zap,
  Package, Settings, ChevronLeft, ChevronRight, HardHat, Shield
} from "lucide-react";

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/projects", icon: FolderKanban, label: "Projects" },
  { href: "/extraction", icon: FileText, label: "AI Extraction" },
  { href: "/materials", icon: Package, label: "Materials" },
  { href: "/quotes", icon: FileText, label: "Quotes" },
  { href: "/dispatch", icon: Truck, label: "Dispatch" },
  { href: "/safety", icon: Shield, label: "Safety" },
  { href: "/workflows", icon: Zap, label: "Workflows" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-logo">
        <div className="logo-icon"><HardHat size={20} /></div>
        {!collapsed && (
          <div>
            <h1>BuilderAI</h1>
            <span>Construction Intelligence</span>
          </div>
        )}
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item ${pathname === item.href ? "active" : ""}`}
            title={collapsed ? item.label : undefined}
          >
            <item.icon size={20} />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
      <div className="sidebar-toggle">
        <button onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
}
