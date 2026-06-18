import { create } from 'zustand';
import { projects as seedProjects, quotes as seedQuotes, dispatchTasks as seedDispatch, Project, Quote, DispatchTask, ExtractionResult, ScopeItem, MaterialItem, MissingInfo } from './data';

interface AppState {
  projects: Project[];
  quotes: Quote[];
  dispatchTasks: DispatchTask[];
  addProject: (p: Partial<Project>) => string;
  updateProject: (id: string, data: Partial<Project>) => void;
  getProject: (id: string) => Project | undefined;
  setExtraction: (projectId: string, extraction: ExtractionResult) => void;
}

let counter = 100;
function genId() { return `p_${++counter}_${Date.now().toString(36)}`; }

// Simulate AI extraction from uploaded document
function simulateExtraction(projectName: string): ExtractionResult {
  const categories = ["Demolition", "Framing", "Plumbing", "Electrical", "Tile", "Drywall", "Painting", "Fixtures"];
  const scopeItems: ScopeItem[] = [
    { id: `s_${Date.now()}_1`, description: `Site preparation and demolition for ${projectName}`, category: "Demolition", confidence: 0.96, status: "confirmed", source_page: 1 },
    { id: `s_${Date.now()}_2`, description: "Rough framing per architectural plan", category: "Framing", confidence: 0.91, status: "confirmed", source_page: 1 },
    { id: `s_${Date.now()}_3`, description: "Plumbing rough-in (supply and waste lines)", category: "Plumbing", confidence: 0.88, status: "pending", source_page: 2 },
    { id: `s_${Date.now()}_4`, description: "Electrical rough-in per code", category: "Electrical", confidence: 0.85, status: "pending", source_page: 2 },
    { id: `s_${Date.now()}_5`, description: "Drywall installation and finishing", category: "Drywall", confidence: 0.93, status: "confirmed", source_page: 3 },
    { id: `s_${Date.now()}_6`, description: "Final paint — 2 coats (color TBD)", category: "Painting", confidence: 0.78, status: "pending", source_page: 3 },
  ];
  const materials: MaterialItem[] = [
    { id: `m_${Date.now()}_1`, name: "2×4 SPF Studs 8ft", category: "Lumber", quantity: 60, unit: "pieces", unit_price: 3.98, total: 238.80, supplier: "Home Depot", in_stock: true, lead_time: "1 day", waste_factor: 0.05 },
    { id: `m_${Date.now()}_2`, name: "1/2\" Drywall 4×8", category: "Drywall", quantity: 24, unit: "sheets", unit_price: 12.50, total: 300.00, supplier: "Lowe's", in_stock: true, lead_time: "1 day", waste_factor: 0.08 },
    { id: `m_${Date.now()}_3`, name: "Romex 12/2 NM-B Wire", category: "Electrical", quantity: 250, unit: "ft", unit_price: 0.65, total: 162.50, supplier: "Home Depot", in_stock: true, lead_time: "1 day", waste_factor: 0.10 },
    { id: `m_${Date.now()}_4`, name: "PEX Pipe 1/2\" (Red)", category: "Plumbing", quantity: 100, unit: "ft", unit_price: 0.85, total: 85.00, supplier: "Ferguson", in_stock: true, lead_time: "2 days", waste_factor: 0.08 },
    { id: `m_${Date.now()}_5`, name: "Interior Latex Paint (5 gal)", category: "Paint", quantity: 3, unit: "buckets", unit_price: 145.00, total: 435.00, supplier: "Sherwin-Williams", in_stock: true, lead_time: "1 day", waste_factor: 0 },
  ];
  const missing: MissingInfo[] = [
    { id: `mi_1`, field: "Paint color selection", severity: "Important", suggestion: "Client has not specified interior paint colors. Request selection." },
    { id: `mi_2`, field: "Fixture specifications", severity: "Critical", suggestion: "Light fixtures and plumbing fixtures not specified. Cannot complete takeoff." },
    { id: `mi_3`, field: "HVAC requirements", severity: "Important", suggestion: "No HVAC scope visible. Confirm if existing system is adequate." },
  ];
  return {
    project_type_detected: "General Construction / Renovation",
    confidence: 0.89,
    document_classification: "Architectural Plan",
    scope_items: scopeItems,
    materials_detected: materials,
    dimensions: { area: "~800 sq ft", ceiling_height: "9 ft" },
    missing_info: missing,
    permits_needed: ["Building Permit", "Electrical Permit", "Plumbing Permit"],
    safety_flags: ["PPE required on site", "Check for lead paint (pre-1978)", "Fire extinguisher required"],
  };
}

export const useStore = create<AppState>((set, get) => ({
  projects: [...seedProjects],
  quotes: [...seedQuotes],
  dispatchTasks: [...seedDispatch],

  addProject: (p) => {
    const id = genId();
    const newProject: Project = {
      id,
      project_name: p.project_name || "Untitled Project",
      customer_name: p.customer_name || "Unknown Client",
      project_type: p.project_type || "General Construction",
      job_location: p.job_location || "TBD",
      status: "Extracting",
      priority: (p.priority as Project["priority"]) || "Medium",
      needed_by: p.needed_by || new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      created_at: new Date().toISOString().split("T")[0],
      documents: p.documents || [],
      extraction: undefined,
    };
    set((s) => ({ projects: [newProject, ...s.projects] }));

    return id;
  },

  updateProject: (id, data) => {
    set((s) => ({
      projects: s.projects.map((p) => (p.id === id ? { ...p, ...data } : p)),
    }));
  },

  getProject: (id) => get().projects.find((p) => p.id === id),

  setExtraction: (projectId, extraction) => {
    set((s) => {
      const exists = s.quotes.find(q => q.project_id === projectId);
      const newQuotes = exists ? s.quotes : [
        ...s.quotes,
        {
          id: `q_${projectId}`,
          project_id: projectId,
          material_cost: extraction.materials_detected.reduce((sum, m) => sum + m.total, 0),
          labor_cost: Math.round(extraction.materials_detected.reduce((sum, m) => sum + m.total, 0) * 1.8),
          delivery_fee: 200,
          margin_percent: 20,
          status: "Draft" as const,
        },
      ];
      
      return {
        projects: s.projects.map((p) =>
          p.id === projectId ? { ...p, extraction, status: "Review" as const } : p
        ),
        quotes: newQuotes,
      };
    });
  },
}));
