"use client";
import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, Sparkles, Loader2, CheckCircle2, Brain, Layers, AlertTriangle } from "lucide-react";
import { useStore } from "@/lib/store";

const steps = [
  { label: "Upload Document", icon: Upload },
  { label: "Text Extraction", icon: FileText },
  { label: "AI Classification", icon: Brain },
  { label: "Scope & Takeoff", icon: Layers },
  { label: "Review Ready", icon: CheckCircle2 },
];

export default function ExtractionPage() {
  const router = useRouter();
  const addProject = useStore((s) => s.addProject);
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [projectName, setProjectName] = useState("");

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  }, []);

  const setExtraction = useStore((s) => s.setExtraction);

  const handleProcess = async () => {
    if (!file) return;
    setProcessing(true);
    setCurrentStep(0);
    
    // Start step animation
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 1500);

    const id = addProject({
      project_name: projectName || file.name.replace(/\.[^.]+$/, ""),
      documents: [{
        id: `doc_${Date.now()}`, name: file.name, type: file.type,
        size: file.size, uploaded_at: new Date().toISOString(),
        pages: Math.ceil(file.size / 50000), status: "extracting" as const,
      }],
    });

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/extract", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setExtraction(id, data);
      }
    } catch (err) {
      console.error(err);
    }

    clearInterval(interval);
    setCurrentStep(4);
    setTimeout(() => router.push(`/projects/${id}`), 800);
  };

  return (
    <div className="animate-fade">
      <div className="page-header">
        <h1>AI Document Extraction</h1>
        <p>Upload architectural plans and let AI extract scope, materials, and costs</p>
      </div>

      {/* Pipeline Steps */}
      <div className="card" style={{ marginBottom: 28, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
          <div style={{ position: "absolute", top: 20, left: "10%", right: "10%", height: 2, background: "var(--border)" }} />
          {steps.map((step, i) => (
            <div key={step.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, position: "relative", zIndex: 1, flex: 1 }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                background: i <= currentStep && processing ? "var(--accent)" : "var(--bg-surface)",
                border: `2px solid ${i <= currentStep && processing ? "var(--accent)" : "var(--border)"}`,
                color: i <= currentStep && processing ? "white" : "var(--text-muted)",
                transition: "all 0.3s ease",
              }}>
                {i < currentStep && processing ? <CheckCircle2 size={18} /> :
                  i === currentStep && processing ? <Loader2 size={18} className="animate-spin" /> :
                    <step.icon size={18} />}
              </div>
              <span style={{ fontSize: 11, color: i <= currentStep && processing ? "var(--text-primary)" : "var(--text-muted)", fontWeight: 500, textAlign: "center" }}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {!processing ? (
        <div className="grid-2">
          <div>
            <div
              className={`upload-zone ${dragOver ? "dragover" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById("extract-input")?.click()}
              style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}
            >
              <input id="extract-input" type="file" accept=".pdf,.png,.jpg,.jpeg,.tiff" style={{ display: "none" }}
                onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])} />
              {file ? (
                <>
                  <div className="upload-icon"><CheckCircle2 size={28} style={{ color: "var(--success)" }} /></div>
                  <h3>{file.name}</h3>
                  <p>{(file.size / 1024 / 1024).toFixed(2)} MB • {Math.ceil(file.size / 50000)} estimated pages</p>
                </>
              ) : (
                <>
                  <div className="upload-icon"><Upload size={28} /></div>
                  <h3>Drop your architectural plan here</h3>
                  <p>PDF, PNG, JPG, TIFF supported</p>
                </>
              )}
            </div>
          </div>

          <div className="card" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600 }}>Extraction Settings</h3>
            <div>
              <label style={{ fontSize: 13, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Project Name (optional)</label>
              <input className="input" placeholder="Auto-detected from document" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
            </div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", padding: 14, background: "var(--bg-surface)", borderRadius: "var(--radius-sm)" }}>
              <strong style={{ color: "var(--text-primary)" }}>What AI will extract:</strong>
              <ul style={{ marginTop: 8, paddingLeft: 16, display: "flex", flexDirection: "column", gap: 6 }}>
                <li>Document classification (Blueprint, RFQ, Spec Sheet)</li>
                <li>Project scope & line items with confidence scores</li>
                <li>Material quantities & specifications</li>
                <li>Missing information & auto-generated RFIs</li>
                <li>Required permits & safety flags</li>
              </ul>
            </div>
            <button className="btn btn-primary btn-lg" style={{ width: "100%", justifyContent: "center", marginTop: "auto" }}
              onClick={handleProcess} disabled={!file}>
              <Sparkles size={18} /> Start AI Extraction
            </button>
          </div>
        </div>
      ) : (
        <div className="card" style={{ textAlign: "center", padding: 60 }}>
          <Loader2 size={48} className="animate-spin" style={{ color: "var(--accent)", margin: "0 auto 20px" }} />
          <h2 style={{ marginBottom: 8 }}>Processing: {steps[currentStep]?.label}</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: 20 }}>
            {currentStep === 0 && "Reading document structure..."}
            {currentStep === 1 && "Extracting text, coordinates, and layout data..."}
            {currentStep === 2 && "Classifying document type with AI..."}
            {currentStep === 3 && "Generating scope items and material takeoff..."}
            {currentStep === 4 && "Finalizing extraction results..."}
          </p>
          <div className="progress-bar" style={{ maxWidth: 400, margin: "0 auto" }}>
            <div className="progress-fill" style={{ width: `${((currentStep + 1) / 5) * 100}%`, background: "var(--gradient-1)" }} />
          </div>
        </div>
      )}
    </div>
  );
}
