"use client";
import React, { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus, Search, Filter, ArrowUpRight, Clock, MapPin,
  FileText, Upload, CheckCircle2, AlertCircle, Loader2, Sparkles, X
} from "lucide-react";
import { useStore } from "@/lib/store";
import { getStatusColor, getPriorityColor } from "@/lib/data";

export default function ProjectsPage() {
  const router = useRouter();
  const projects = useStore((s) => s.projects);
  const addProject = useStore((s) => s.addProject);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [newName, setNewName] = useState("");
  const [newCustomer, setNewCustomer] = useState("");
  const [newLocation, setNewLocation] = useState("");

  const filtered = projects.filter((p) => {
    const matchSearch = p.project_name.toLowerCase().includes(search.toLowerCase()) ||
      p.customer_name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || p.status === filter;
    return matchSearch && matchFilter;
  });

  const statuses = ["All", "Pending Upload", "Extracting", "Review", "Approved", "In Progress", "Complete"];

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setUploadedFile(file);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  };

  const setExtraction = useStore((s) => s.setExtraction);

  const handleCreate = async () => {
    setUploading(true);
    const id = addProject({
      project_name: newName || (uploadedFile ? uploadedFile.name.replace(/\.[^.]+$/, "") : "Untitled Project"),
      customer_name: newCustomer || "Unknown Client",
      job_location: newLocation || "TBD",
      documents: uploadedFile ? [{
        id: `doc_${Date.now()}`,
        name: uploadedFile.name,
        type: uploadedFile.type,
        size: uploadedFile.size,
        uploaded_at: new Date().toISOString(),
        pages: Math.ceil(uploadedFile.size / 50000),
        status: "extracting" as const,
      }] : [],
    });

    if (uploadedFile) {
      try {
        const formData = new FormData();
        formData.append("file", uploadedFile);
        const res = await fetch("/api/extract", { method: "POST", body: formData });
        if (res.ok) {
          const data = await res.json();
          setExtraction(id, data);
        } else {
          console.error("Extraction failed");
        }
      } catch (err) {
        console.error(err);
      }
    }

    setUploading(false);
    setShowModal(false);
    setUploadedFile(null);
    setNewName("");
    setNewCustomer("");
    setNewLocation("");
    router.push(`/projects/${id}`);
  };

  return (
    <div className="animate-fade">
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1>Projects</h1>
          <p>Manage your construction projects and uploaded documents</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> New Project
        </button>
      </div>

      {/* Search & Filter */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 240, position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: 12, color: "var(--text-muted)" }} />
          <input className="input" placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 36 }} />
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {statuses.map((s) => (
            <button key={s} className={`btn btn-sm ${filter === s ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setFilter(s)}>{s}</button>
          ))}
        </div>
      </div>

      {/* Project Cards */}
      <div className="grid-3">
        {filtered.map((p) => (
          <Link key={p.id} href={`/projects/${p.id}`} className="card" style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span className="badge" style={{ background: `${getStatusColor(p.status)}20`, color: getStatusColor(p.status) }}>{p.status}</span>
              <span style={{ color: getPriorityColor(p.priority), fontWeight: 600, fontSize: 12 }}>{p.priority}</span>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{p.project_name}</h3>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12 }}>{p.customer_name}</p>
            <div style={{ display: "flex", gap: 16, fontSize: 12, color: "var(--text-muted)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={12} /> {p.job_location.split(",")[0]}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} /> {p.needed_by}</span>
            </div>
            {p.documents.length > 0 && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)", display: "flex", gap: 8, fontSize: 12, color: "var(--text-muted)" }}>
                <FileText size={12} /> {p.documents.length} document{p.documents.length > 1 ? "s" : ""} uploaded
              </div>
            )}
          </Link>
        ))}
      </div>

      {/* New Project Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => !uploading && setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0 }}>New Project</h2>
              {!uploading && <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}><X size={16} /></button>}
            </div>

            {/* Upload Zone */}
            <div
              className={`upload-zone ${dragOver ? "dragover" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-input")?.click()}
              style={{ marginBottom: 20 }}
            >
              <input id="file-input" type="file" accept=".pdf,.png,.jpg,.jpeg,.tiff" style={{ display: "none" }} onChange={handleFileSelect} />
              {uploadedFile ? (
                <>
                  <div className="upload-icon"><CheckCircle2 size={28} style={{ color: "var(--success)" }} /></div>
                  <h3>{uploadedFile.name}</h3>
                  <p>{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </>
              ) : (
                <>
                  <div className="upload-icon"><Upload size={28} /></div>
                  <h3>Upload Architecture Plan</h3>
                  <p>Drag & drop a PDF, or click to browse</p>
                  <p style={{ fontSize: 12, marginTop: 4 }}>Supports PDF, PNG, JPG, TIFF</p>
                </>
              )}
            </div>

            {/* Form Fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
              <div>
                <label style={{ fontSize: 13, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Project Name</label>
                <input className="input" placeholder="e.g. Johnson Bathroom Remodel" value={newName} onChange={(e) => setNewName(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: 13, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Customer Name</label>
                <input className="input" placeholder="e.g. Mark Johnson" value={newCustomer} onChange={(e) => setNewCustomer(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: 13, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Job Location</label>
                <input className="input" placeholder="e.g. 123 Oak St, Wilmington NC" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} />
              </div>
            </div>

            <button className="btn btn-primary btn-lg" style={{ width: "100%", justifyContent: "center" }}
              onClick={handleCreate} disabled={uploading}>
              {uploading ? (
                <><Loader2 size={18} className="animate-spin" /> AI is Analyzing Document...</>
              ) : (
                <><Sparkles size={18} /> Create & Analyze with AI</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
