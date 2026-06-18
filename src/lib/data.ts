// BuilderAI — Data Layer & Types

export interface Project {
  id: string;
  project_name: string;
  customer_name: string;
  project_type: string;
  job_location: string;
  status: "Pending Upload" | "Extracting" | "Review" | "Approved" | "In Progress" | "Complete";
  priority: "High" | "Medium" | "Low";
  needed_by: string;
  created_at: string;
  documents: UploadedDoc[];
  extraction?: ExtractionResult;
}

export interface UploadedDoc {
  id: string;
  name: string;
  type: string;
  size: number;
  uploaded_at: string;
  pages: number;
  status: "uploaded" | "extracting" | "extracted" | "failed";
}

export interface ExtractionResult {
  project_type_detected: string;
  confidence: number;
  scope_items: ScopeItem[];
  materials_detected: MaterialItem[];
  dimensions: Record<string, string>;
  missing_info: MissingInfo[];
  permits_needed: string[];
  safety_flags: string[];
  document_classification: string;
}

export interface ScopeItem {
  id: string;
  description: string;
  category: string;
  confidence: number;
  status: "confirmed" | "pending" | "rejected";
  source_page: number;
}

export interface MaterialItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total: number;
  supplier: string;
  in_stock: boolean;
  lead_time: string;
  waste_factor: number;
}

export interface MissingInfo {
  id: string;
  field: string;
  severity: "Critical" | "Important" | "Minor";
  suggestion: string;
}

export interface Quote {
  id: string;
  project_id: string;
  material_cost: number;
  labor_cost: number;
  delivery_fee: number;
  margin_percent: number;
  status: "Draft" | "Sent" | "Accepted" | "Rejected";
}

export interface DispatchTask {
  id: string;
  project_id: string;
  project_name: string;
  driver: string;
  status: "Ready" | "Loading" | "In Transit" | "Delivered";
  priority: "High" | "Medium" | "Low";
  items: string[];
  delivery_date: string;
  location: string;
}

// ---------- Seed Data ----------

export const projects: Project[] = [
  {
    id: "p1",
    project_name: "Johnson Bathroom Remodel",
    customer_name: "Mark Johnson",
    project_type: "Residential Renovation",
    job_location: "123 Oak St, Wilmington NC",
    status: "Review",
    priority: "High",
    needed_by: "2026-06-15",
    created_at: "2026-05-10",
    documents: [
      { id: "d1", name: "bathroom_blueprint.pdf", type: "application/pdf", size: 2400000, uploaded_at: "2026-05-10", pages: 4, status: "extracted" },
    ],
    extraction: {
      project_type_detected: "Residential Bathroom Renovation",
      confidence: 0.94,
      document_classification: "Architectural Plan",
      scope_items: [
        { id: "s1", description: "Demolish existing shower enclosure and tile", category: "Demolition", confidence: 0.97, status: "confirmed", source_page: 1 },
        { id: "s2", description: "Install 48×36 walk-in frameless glass shower", category: "Plumbing", confidence: 0.93, status: "confirmed", source_page: 1 },
        { id: "s3", description: "Install double-vanity with undermount sinks", category: "Plumbing", confidence: 0.91, status: "pending", source_page: 2 },
        { id: "s4", description: "Full floor-to-ceiling tile (porcelain 12×24)", category: "Tile", confidence: 0.95, status: "confirmed", source_page: 2 },
        { id: "s5", description: "Install 6 recessed LED can lights", category: "Electrical", confidence: 0.88, status: "pending", source_page: 3 },
        { id: "s6", description: "Install heated tile floor system", category: "Electrical", confidence: 0.72, status: "pending", source_page: 3 },
        { id: "s7", description: "Replace exhaust fan with humidity-sensing unit", category: "HVAC", confidence: 0.85, status: "confirmed", source_page: 4 },
      ],
      materials_detected: [
        { id: "m1", name: "Porcelain Tile 12×24 (White Marble Look)", category: "Tile", quantity: 145, unit: "sq ft", unit_price: 4.50, total: 652.50, supplier: "Floor & Decor", in_stock: true, lead_time: "3 days", waste_factor: 0.12 },
        { id: "m2", name: "Cement Board 1/2\" 3×5", category: "Substrate", quantity: 12, unit: "sheets", unit_price: 14.00, total: 168.00, supplier: "Home Depot", in_stock: true, lead_time: "1 day", waste_factor: 0.05 },
        { id: "m3", name: "PEX Pipe 1/2\" (Red/Blue)", category: "Plumbing", quantity: 80, unit: "linear ft", unit_price: 0.85, total: 68.00, supplier: "Ferguson", in_stock: true, lead_time: "2 days", waste_factor: 0.08 },
        { id: "m4", name: "Frameless Glass Shower Door 48×72", category: "Glass", quantity: 1, unit: "unit", unit_price: 1200.00, total: 1200.00, supplier: "Glass Warehouse", in_stock: false, lead_time: "14 days", waste_factor: 0 },
        { id: "m5", name: "LED Recessed Can Light 4\"", category: "Electrical", quantity: 6, unit: "units", unit_price: 28.00, total: 168.00, supplier: "Home Depot", in_stock: true, lead_time: "1 day", waste_factor: 0 },
        { id: "m6", name: "Heated Floor Mat Kit (120 sq ft)", category: "Electrical", quantity: 1, unit: "kit", unit_price: 480.00, total: 480.00, supplier: "Warm Tiles", in_stock: true, lead_time: "5 days", waste_factor: 0 },
        { id: "m7", name: "Double Vanity 60\" (White Shaker)", category: "Cabinetry", quantity: 1, unit: "unit", unit_price: 890.00, total: 890.00, supplier: "Wayfair", in_stock: true, lead_time: "7 days", waste_factor: 0 },
      ],
      dimensions: { room_width: "10 ft", room_length: "12 ft", ceiling_height: "9 ft" },
      missing_info: [
        { id: "mi1", field: "Tile grout color", severity: "Important", suggestion: "Contact client: recommend Mapei Keracolor U in 'Frost'" },
        { id: "mi2", field: "Electrical panel capacity", severity: "Critical", suggestion: "Heated floors + 6 lights may need dedicated 20A circuit. Request panel schedule." },
        { id: "mi3", field: "Waterproofing method", severity: "Critical", suggestion: "No membrane specified. Recommend Schluter DITRA or liquid membrane." },
        { id: "mi4", field: "Vanity faucet style", severity: "Minor", suggestion: "Widespread vs single-hole not specified. Confirm with client." },
      ],
      permits_needed: ["Plumbing Permit", "Electrical Permit", "Building Permit (structural if load-bearing wall)"],
      safety_flags: ["Asbestos check required (pre-1980 home)", "GFCI outlets required within 6ft of water", "Heated floor requires dedicated circuit breaker"],
    },
  },
  {
    id: "p2",
    project_name: "Riverside Office Buildout",
    customer_name: "Riverside Properties LLC",
    project_type: "Commercial Renovation",
    job_location: "456 Market St, Suite 200, Raleigh NC",
    status: "In Progress",
    priority: "High",
    needed_by: "2026-07-01",
    created_at: "2026-05-05",
    documents: [
      { id: "d2", name: "office_floorplan.pdf", type: "application/pdf", size: 5800000, uploaded_at: "2026-05-05", pages: 8, status: "extracted" },
    ],
    extraction: undefined,
  },
  {
    id: "p3",
    project_name: "Oak Ridge Deck Addition",
    customer_name: "Sarah Williams",
    project_type: "Residential New Construction",
    job_location: "789 Pine Dr, Durham NC",
    status: "Approved",
    priority: "Medium",
    needed_by: "2026-06-30",
    created_at: "2026-05-08",
    documents: [],
    extraction: undefined,
  },
];

export const quotes: Quote[] = [
  { id: "q1", project_id: "p1", material_cost: 3626.50, labor_cost: 4800, delivery_fee: 250, margin_percent: 22, status: "Draft" },
  { id: "q2", project_id: "p2", material_cost: 18400, labor_cost: 24000, delivery_fee: 800, margin_percent: 18, status: "Sent" },
];

export const dispatchTasks: DispatchTask[] = [
  { id: "dt1", project_id: "p1", project_name: "Johnson Bathroom Remodel", driver: "Mike Rodriguez", status: "Ready", priority: "High", items: ["Porcelain Tile (145 sq ft)", "Cement Board (12 sheets)", "PEX Pipe (80 ft)"], delivery_date: "2026-05-16", location: "123 Oak St" },
  { id: "dt2", project_id: "p2", project_name: "Riverside Office Buildout", driver: "Tom Davis", status: "In Transit", priority: "High", items: ["Drywall 4×8 (48 sheets)", "Metal Studs (120 pcs)", "Insulation R-13 (16 batts)"], delivery_date: "2026-05-15", location: "456 Market St" },
  { id: "dt3", project_id: "p1", project_name: "Johnson Bathroom Remodel", driver: "Unassigned", status: "Ready", priority: "Medium", items: ["Frameless Glass Shower Door", "Double Vanity 60\""], delivery_date: "2026-05-22", location: "123 Oak St" },
];

// Helpers
export function getStatusColor(status: string) {
  const map: Record<string, string> = {
    "Pending Upload": "var(--text-muted)", Extracting: "var(--info)",
    Review: "var(--warning)", Approved: "var(--success)",
    "In Progress": "var(--accent)", Complete: "var(--success)",
    Draft: "var(--text-muted)", Sent: "var(--info)", Accepted: "var(--success)", Rejected: "var(--danger)",
    Ready: "var(--warning)", Loading: "var(--info)", "In Transit": "var(--accent)", Delivered: "var(--success)",
  };
  return map[status] || "var(--text-muted)";
}

export function getPriorityColor(p: string) {
  return p === "High" ? "var(--danger)" : p === "Medium" ? "var(--warning)" : "var(--success)";
}

export function getConfidenceLevel(c: number) {
  return c >= 0.9 ? "high" : c >= 0.75 ? "medium" : "low";
}
