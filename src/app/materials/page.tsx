"use client";
import React, { useState } from "react";
import { Search, Package, AlertTriangle, CheckCircle2, TrendingUp, TrendingDown } from "lucide-react";
import { useStore } from "@/lib/store";

const supplierCatalog = [
  { name: "2×4 SPF Studs 8ft", category: "Lumber", price: 3.98, stock: 1200, supplier: "Home Depot", trend: "up", change: "+5%" },
  { name: "1/2\" Drywall 4×8", category: "Drywall", price: 12.50, stock: 400, supplier: "Lowe's", trend: "down", change: "-2%" },
  { name: "PEX Pipe 1/2\" (100ft roll)", category: "Plumbing", price: 85.00, stock: 60, supplier: "Ferguson", trend: "up", change: "+8%" },
  { name: "Porcelain Tile 12×24 (per sq ft)", category: "Tile", price: 4.50, stock: 2000, supplier: "Floor & Decor", trend: "stable", change: "0%" },
  { name: "Romex 12/2 NM-B Wire (250ft)", category: "Electrical", price: 162.50, stock: 80, supplier: "Home Depot", trend: "up", change: "+12%" },
  { name: "Cement Board 1/2\" 3×5", category: "Substrate", price: 14.00, stock: 300, supplier: "Home Depot", trend: "stable", change: "0%" },
  { name: "Frameless Glass Shower Door 48×72", category: "Glass", price: 1200.00, stock: 5, supplier: "Glass Warehouse", trend: "up", change: "+3%" },
  { name: "LED Recessed Can Light 4\"", category: "Electrical", price: 28.00, stock: 150, supplier: "Home Depot", trend: "down", change: "-4%" },
  { name: "Interior Latex Paint (5 gal)", category: "Paint", price: 145.00, stock: 50, supplier: "Sherwin-Williams", trend: "up", change: "+6%" },
  { name: "Copper Pipe 3/4\" Type L (10ft)", category: "Plumbing", price: 32.00, stock: 25, supplier: "Ferguson", trend: "up", change: "+15%" },
];

export default function MaterialsPage() {
  const [search, setSearch] = useState("");
  const filtered = supplierCatalog.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) || m.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade">
      <div className="page-header">
        <h1>Materials & Supplier Catalog</h1>
        <p>Track pricing, stock levels, and market trends across suppliers</p>
      </div>

      {/* Summary Cards */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <div className="metric-card">
          <span className="metric-label">Total Items</span>
          <span className="metric-value">{supplierCatalog.length}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Low Stock Alerts</span>
          <span className="metric-value" style={{ color: "var(--danger)" }}>{supplierCatalog.filter(m => m.stock < 30).length}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Price Increases</span>
          <span className="metric-value" style={{ color: "var(--warning)" }}>{supplierCatalog.filter(m => m.trend === "up").length}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Suppliers</span>
          <span className="metric-value">{new Set(supplierCatalog.map(m => m.supplier)).size}</span>
        </div>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 20, maxWidth: 400 }}>
        <Search size={16} style={{ position: "absolute", left: 12, top: 12, color: "var(--text-muted)" }} />
        <input className="input" placeholder="Search materials..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 36 }} />
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr><th>Material</th><th>Category</th><th>Price</th><th>Stock</th><th>Supplier</th><th>Trend</th></tr>
            </thead>
            <tbody>
              {filtered.map((m, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500 }}>{m.name}</td>
                  <td><span className="badge badge-accent">{m.category}</span></td>
                  <td style={{ fontWeight: 600 }}>${m.price.toFixed(2)}</td>
                  <td>
                    {m.stock < 30 ? (
                      <span style={{ color: "var(--danger)", display: "flex", alignItems: "center", gap: 4 }}>
                        <AlertTriangle size={14} /> {m.stock} <span style={{ fontSize: 11 }}>Low</span>
                      </span>
                    ) : (
                      <span style={{ color: "var(--success)", display: "flex", alignItems: "center", gap: 4 }}>
                        <CheckCircle2 size={14} /> {m.stock}
                      </span>
                    )}
                  </td>
                  <td style={{ color: "var(--text-secondary)", fontSize: 13 }}>{m.supplier}</td>
                  <td>
                    <span style={{
                      color: m.trend === "up" ? "var(--danger)" : m.trend === "down" ? "var(--success)" : "var(--text-muted)",
                      display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600
                    }}>
                      {m.trend === "up" ? <TrendingUp size={14} /> : m.trend === "down" ? <TrendingDown size={14} /> : null}
                      {m.change}
                    </span>
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
