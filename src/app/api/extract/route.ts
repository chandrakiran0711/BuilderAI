import { NextRequest, NextResponse } from "next/server";

// Construction keyword dictionaries for NLP analysis
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Demolition: ["demolish", "remove", "tear out", "strip", "gut", "abatement", "haul away", "dispose", "clear"],
  Framing: ["frame", "stud", "joist", "header", "rafter", "truss", "sheathing", "plywood", "lumber", "2x4", "2x6", "framing"],
  Plumbing: ["plumbing", "pipe", "pex", "copper", "drain", "faucet", "toilet", "shower", "sink", "water heater", "valve", "supply line", "waste line", "sewer", "bathtub", "vanity"],
  Electrical: ["electrical", "wire", "outlet", "switch", "panel", "breaker", "circuit", "romex", "conduit", "lighting", "fixture", "recessed", "can light", "gfci", "amp", "voltage"],
  HVAC: ["hvac", "duct", "furnace", "air conditioning", "ac unit", "thermostat", "ventilation", "exhaust fan", "mini split", "heat pump", "return air"],
  Tile: ["tile", "grout", "mortar", "thinset", "backsplash", "ceramic", "porcelain", "marble", "travertine", "mosaic", "subway tile"],
  Drywall: ["drywall", "sheetrock", "gypsum", "joint compound", "mud", "tape", "texture", "skim coat"],
  Painting: ["paint", "primer", "stain", "finish", "coat", "roller", "brush", "latex", "semi-gloss", "satin", "eggshell"],
  Flooring: ["flooring", "hardwood", "laminate", "vinyl", "carpet", "underlayment", "subfloor", "lvp", "lvt"],
  Roofing: ["roof", "shingle", "flashing", "gutter", "soffit", "fascia", "ridge vent", "underlayment", "tar paper"],
  Insulation: ["insulation", "r-value", "fiberglass", "spray foam", "batt", "blown-in", "rigid foam", "vapor barrier"],
  Concrete: ["concrete", "foundation", "slab", "footing", "rebar", "form", "pour", "masonry", "block", "brick", "mortar"],
  Windows: ["window", "glass", "pane", "sash", "frame", "egress", "double-hung", "casement", "sliding door"],
  Cabinetry: ["cabinet", "countertop", "granite", "quartz", "drawer", "shelf", "pantry", "island"],
};

const MATERIAL_DB: Record<string, { unit: string; unit_price: number; supplier: string; lead_time: string; waste_factor: number }> = {
  "2x4 SPF Studs 8ft": { unit: "pieces", unit_price: 3.98, supplier: "Home Depot", lead_time: "1 day", waste_factor: 0.05 },
  "2x6 SPF Studs 8ft": { unit: "pieces", unit_price: 6.48, supplier: "Home Depot", lead_time: "1 day", waste_factor: 0.05 },
  "1/2\" Drywall 4x8": { unit: "sheets", unit_price: 12.50, supplier: "Lowe's", lead_time: "1 day", waste_factor: 0.08 },
  "5/8\" Drywall 4x8": { unit: "sheets", unit_price: 14.75, supplier: "Lowe's", lead_time: "1 day", waste_factor: 0.08 },
  "Porcelain Tile 12x24": { unit: "sq ft", unit_price: 4.50, supplier: "Floor & Decor", lead_time: "3 days", waste_factor: 0.12 },
  "Ceramic Subway Tile 3x6": { unit: "sq ft", unit_price: 2.80, supplier: "Floor & Decor", lead_time: "2 days", waste_factor: 0.10 },
  "PEX Pipe 1/2\"": { unit: "ft", unit_price: 0.85, supplier: "Ferguson", lead_time: "2 days", waste_factor: 0.08 },
  "Copper Pipe 3/4\" Type L": { unit: "ft", unit_price: 3.20, supplier: "Ferguson", lead_time: "3 days", waste_factor: 0.06 },
  "Romex 12/2 NM-B Wire": { unit: "ft", unit_price: 0.65, supplier: "Home Depot", lead_time: "1 day", waste_factor: 0.10 },
  "Romex 14/2 NM-B Wire": { unit: "ft", unit_price: 0.48, supplier: "Home Depot", lead_time: "1 day", waste_factor: 0.10 },
  "Interior Latex Paint 5gal": { unit: "buckets", unit_price: 145.00, supplier: "Sherwin-Williams", lead_time: "1 day", waste_factor: 0 },
  "Primer 5gal": { unit: "buckets", unit_price: 95.00, supplier: "Sherwin-Williams", lead_time: "1 day", waste_factor: 0 },
  "R-13 Fiberglass Batt Insulation": { unit: "rolls", unit_price: 42.00, supplier: "Home Depot", lead_time: "1 day", waste_factor: 0.05 },
  "Cement Board 1/2\" 3x5": { unit: "sheets", unit_price: 14.00, supplier: "Home Depot", lead_time: "1 day", waste_factor: 0.05 },
  "Thinset Mortar 50lb": { unit: "bags", unit_price: 18.50, supplier: "Home Depot", lead_time: "1 day", waste_factor: 0 },
  "Joint Compound 5gal": { unit: "buckets", unit_price: 16.00, supplier: "Lowe's", lead_time: "1 day", waste_factor: 0 },
  "Plywood 3/4\" 4x8 CDX": { unit: "sheets", unit_price: 48.00, supplier: "Home Depot", lead_time: "1 day", waste_factor: 0.05 },
  "Concrete Mix 80lb": { unit: "bags", unit_price: 6.50, supplier: "Home Depot", lead_time: "1 day", waste_factor: 0.05 },
  "Standard Toilet": { unit: "units", unit_price: 189.00, supplier: "Home Depot", lead_time: "3 days", waste_factor: 0 },
  "Bathroom Vanity 36\"": { unit: "units", unit_price: 450.00, supplier: "Lowe's", lead_time: "7 days", waste_factor: 0 },
  "LED Recessed Light 4\"": { unit: "units", unit_price: 28.00, supplier: "Home Depot", lead_time: "1 day", waste_factor: 0 },
  "GFCI Outlet": { unit: "units", unit_price: 18.00, supplier: "Home Depot", lead_time: "1 day", waste_factor: 0 },
  "Standard Light Switch": { unit: "units", unit_price: 3.50, supplier: "Home Depot", lead_time: "1 day", waste_factor: 0 },
  "Exhaust Fan 80 CFM": { unit: "units", unit_price: 89.00, supplier: "Home Depot", lead_time: "3 days", waste_factor: 0 },
  "Vinyl Plank Flooring LVP": { unit: "sq ft", unit_price: 3.25, supplier: "Floor & Decor", lead_time: "3 days", waste_factor: 0.10 },
};

const PERMIT_TRIGGERS: Record<string, string[]> = {
  "Building Permit": ["structural", "wall removal", "addition", "new construction", "load-bearing", "foundation", "framing"],
  "Electrical Permit": ["electrical", "panel", "circuit", "wire", "outlet", "breaker", "amp"],
  "Plumbing Permit": ["plumbing", "pipe", "drain", "water heater", "sewer", "relocat"],
  "Mechanical Permit (HVAC)": ["hvac", "duct", "furnace", "air conditioning", "mini split", "heat pump"],
  "Demolition Permit": ["demolish", "tear down", "gut", "abatement"],
  "Roofing Permit": ["roof replacement", "re-roof", "new roof"],
};

const SAFETY_TRIGGERS: Record<string, string[]> = {
  "Asbestos inspection required (pre-1978 structures)": ["demolish", "remove", "tear out", "renovation", "remodel", "old", "existing"],
  "Lead paint testing required": ["paint removal", "scraping", "sanding", "pre-1978", "old paint"],
  "GFCI protection required near water sources": ["bathroom", "kitchen", "laundry", "wet area", "sink", "shower"],
  "Fall protection required for work above 6 feet": ["roof", "second floor", "ladder", "scaffold", "ceiling", "attic"],
  "PPE required on site at all times": ["demolition", "construction", "renovation", "remodel"],
  "Proper ventilation required for paint/adhesive work": ["paint", "adhesive", "epoxy", "solvent", "stain"],
  "Fire extinguisher required on site": ["construction", "renovation", "welding", "torch"],
  "Electrical lockout/tagout procedures": ["panel", "breaker", "electrical", "live wire"],
  "Structural shoring required before wall removal": ["load-bearing", "wall removal", "structural"],
  "Waterproofing membrane required in wet areas": ["shower", "bathtub", "bathroom floor", "wet area"],
};

function classifyDocument(text: string): string {
  const lower = text.toLowerCase();
  const scores: Record<string, number> = {
    "Architectural Plan / Blueprint": 0,
    "Request for Quote (RFQ)": 0,
    "Specification Sheet": 0,
    "Material List / BOM": 0,
    "Inspection Report": 0,
    "Change Order": 0,
    "Construction Scope of Work": 0,
  };
  if (/blueprint|floor plan|elevation|section view|detail|scale\s*[:=]/i.test(lower)) scores["Architectural Plan / Blueprint"] += 5;
  if (/dimension|ft|feet|inches|\"|\bx\b.*\bx\b/i.test(lower)) scores["Architectural Plan / Blueprint"] += 2;
  if (/rfq|request for quote|bid|proposal|submit.*price/i.test(lower)) scores["Request for Quote (RFQ)"] += 5;
  if (/specification|spec sheet|product data|manufacturer/i.test(lower)) scores["Specification Sheet"] += 5;
  if (/material list|bill of material|bom|quantity|item\s*#/i.test(lower)) scores["Material List / BOM"] += 5;
  if (/inspection|inspector|pass|fail|violation|compliance/i.test(lower)) scores["Inspection Report"] += 5;
  if (/change order|co\s*#|revision|amendment|modification/i.test(lower)) scores["Change Order"] += 5;
  if (/scope of work|sow|task|phase|deliverable/i.test(lower)) scores["Construction Scope of Work"] += 5;
  if (/install|remove|demolish|construct|build|repair|replace/i.test(lower)) scores["Construction Scope of Work"] += 2;

  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return best[1] > 0 ? best[0] : "Construction Document (General)";
}

function extractDimensions(text: string): Record<string, string> {
  const dims: Record<string, string> = {};
  const patterns = [
    /(\d+)\s*(?:ft|feet|')\s*[x×]\s*(\d+)\s*(?:ft|feet|')/gi,
    /(\d+)\s*(?:ft|feet|')\s*(?:wide|long|tall|high|deep)/gi,
    /(?:width|length|height|depth)\s*[:=]?\s*(\d+)\s*(?:ft|feet|'|inches|")/gi,
    /(\d+)\s*(?:sq\.?\s*ft|square\s*feet|sf)/gi,
    /ceiling\s*(?:height)?\s*[:=]?\s*(\d+)\s*(?:ft|feet|')/gi,
  ];
  const roomMatch = text.match(/(\d+)\s*(?:ft|feet|')\s*[x×]\s*(\d+)\s*(?:ft|feet|')/i);
  if (roomMatch) {
    dims["room_dimensions"] = `${roomMatch[1]} ft × ${roomMatch[2]} ft`;
    dims["estimated_area"] = `${parseInt(roomMatch[1]) * parseInt(roomMatch[2])} sq ft`;
  }
  const sqftMatch = text.match(/(\d[\d,]*)\s*(?:sq\.?\s*ft|square\s*feet|sf)/i);
  if (sqftMatch) dims["total_area"] = `${sqftMatch[1]} sq ft`;
  const ceilingMatch = text.match(/ceiling\s*(?:height)?\s*[:=]?\s*(\d+)\s*(?:ft|feet|')/i);
  if (ceilingMatch) dims["ceiling_height"] = `${ceilingMatch[1]} ft`;
  return dims;
}

function extractScopeItems(text: string): Array<{ description: string; category: string; confidence: number }> {
  const items: Array<{ description: string; category: string; confidence: number }> = [];
  const sentences = text.split(/[.\n\r]+/).map(s => s.trim()).filter(s => s.length > 10 && s.length < 300);
  const actionVerbs = /\b(install|remove|demolish|replace|repair|build|construct|frame|wire|plumb|tile|paint|apply|mount|hang|set|lay|pour|run|connect|extend|add|upgrade|finish|patch|seal|caulk|grout|sand|prime|coat|insulate|vent|route|drill|cut|strip|gut|haul)\b/i;

  for (const sentence of sentences) {
    if (!actionVerbs.test(sentence)) continue;
    let bestCat = "General";
    let bestScore = 0;
    for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      let score = 0;
      for (const kw of keywords) {
        if (sentence.toLowerCase().includes(kw)) score += 1;
      }
      if (score > bestScore) { bestScore = score; bestCat = cat; }
    }
    const confidence = Math.min(0.98, 0.70 + bestScore * 0.07 + (sentence.length > 30 ? 0.05 : 0));
    items.push({ description: sentence.replace(/^[-•*>\d.)\s]+/, "").trim(), category: bestCat, confidence: Math.round(confidence * 100) / 100 });
  }
  // Deduplicate by similar description
  const unique = items.filter((item, i) => !items.slice(0, i).some(prev => prev.description.toLowerCase().includes(item.description.toLowerCase().slice(0, 20))));
  return unique.slice(0, 20);
}

function inferMaterials(scopeItems: Array<{ category: string; description: string }>, dims: Record<string, string>, text: string) {
  const materials: Array<{ name: string; category: string; quantity: number; unit: string; unit_price: number; total: number; supplier: string; in_stock: boolean; lead_time: string; waste_factor: number }> = [];
  const area = parseInt(dims["estimated_area"] || dims["total_area"] || "200");
  const added = new Set<string>();

  const addMat = (name: string, qty: number) => {
    if (added.has(name)) return;
    const db = MATERIAL_DB[name];
    if (!db) return;
    added.add(name);
    const adjQty = Math.ceil(qty * (1 + db.waste_factor));
    materials.push({ name, category: Object.entries(CATEGORY_KEYWORDS).find(([, kws]) => kws.some(k => name.toLowerCase().includes(k)))?.[0] || "General", quantity: adjQty, unit: db.unit, unit_price: db.unit_price, total: Math.round(adjQty * db.unit_price * 100) / 100, supplier: db.supplier, in_stock: Math.random() > 0.2, lead_time: db.lead_time, waste_factor: db.waste_factor });
  };

  for (const item of scopeItems) {
    const desc = item.description.toLowerCase();
    const cat = item.category;
    if (cat === "Framing" || desc.includes("frame") || desc.includes("wall")) { addMat("2x4 SPF Studs 8ft", Math.ceil(area / 2)); addMat("Plywood 3/4\" 4x8 CDX", Math.ceil(area / 32)); }
    if (cat === "Drywall" || desc.includes("drywall")) { addMat("1/2\" Drywall 4x8", Math.ceil(area / 32) * 2); addMat("Joint Compound 5gal", Math.ceil(area / 400)); }
    if (cat === "Plumbing" || desc.includes("plumb")) { addMat("PEX Pipe 1/2\"", Math.ceil(area * 0.4)); }
    if (desc.includes("toilet")) addMat("Standard Toilet", 1);
    if (desc.includes("vanity") || desc.includes("sink")) addMat("Bathroom Vanity 36\"", 1);
    if (cat === "Electrical" || desc.includes("electr") || desc.includes("wire")) { addMat("Romex 12/2 NM-B Wire", Math.ceil(area * 1.2)); addMat("GFCI Outlet", Math.ceil(area / 60)); addMat("Standard Light Switch", Math.ceil(area / 100) + 1); }
    if (desc.includes("recessed") || desc.includes("can light")) addMat("LED Recessed Light 4\"", 6);
    if (cat === "Tile" || desc.includes("tile")) { addMat("Porcelain Tile 12x24", Math.ceil(area * 0.6)); addMat("Cement Board 1/2\" 3x5", Math.ceil(area / 15)); addMat("Thinset Mortar 50lb", Math.ceil(area / 50)); }
    if (cat === "Painting" || desc.includes("paint")) { addMat("Interior Latex Paint 5gal", Math.ceil(area / 400) + 1); addMat("Primer 5gal", 1); }
    if (desc.includes("insulation") || desc.includes("insulate")) addMat("R-13 Fiberglass Batt Insulation", Math.ceil(area / 40));
    if (desc.includes("exhaust") || desc.includes("ventilation")) addMat("Exhaust Fan 80 CFM", 1);
    if (desc.includes("flooring") || desc.includes("vinyl") || desc.includes("lvp")) addMat("Vinyl Plank Flooring LVP", area);
    if (desc.includes("concrete") || desc.includes("slab")) addMat("Concrete Mix 80lb", Math.ceil(area / 4));
  }

  // Also scan raw text for materials
  const lower = text.toLowerCase();
  if (lower.includes("tile") && !added.has("Porcelain Tile 12x24")) addMat("Porcelain Tile 12x24", Math.ceil(area * 0.5));
  if (lower.includes("paint") && !added.has("Interior Latex Paint 5gal")) addMat("Interior Latex Paint 5gal", 2);

  return materials;
}

function findMissingInfo(text: string, scopeItems: Array<{ category: string }>, dims: Record<string, string>) {
  const missing: Array<{ field: string; severity: "Critical" | "Important" | "Minor"; suggestion: string }> = [];
  const lower = text.toLowerCase();
  const cats = new Set(scopeItems.map(s => s.category));

  if (!dims["room_dimensions"] && !dims["total_area"] && !dims["estimated_area"]) missing.push({ field: "Room/Area Dimensions", severity: "Critical", suggestion: "No dimensions found in document. Measurements are required for accurate material takeoff. Request dimensioned drawings." });
  if (cats.has("Tile") && !lower.includes("grout color")) missing.push({ field: "Tile grout color", severity: "Important", suggestion: "Tile work specified but no grout color selected. Recommend asking client for preference." });
  if (cats.has("Painting") && !/(color|sw\s*\d|benjamin|sherwin|behr)/i.test(lower)) missing.push({ field: "Paint color selection", severity: "Important", suggestion: "Painting scope found but no paint colors specified. Request color selections from client." });
  if (cats.has("Electrical") && !lower.includes("panel")) missing.push({ field: "Electrical panel capacity", severity: "Critical", suggestion: "Electrical work specified but panel schedule/capacity not referenced. Verify available amperage." });
  if ((lower.includes("bathroom") || lower.includes("shower") || lower.includes("kitchen")) && !lower.includes("waterproof")) missing.push({ field: "Waterproofing specification", severity: "Critical", suggestion: "Wet area work detected but no waterproofing membrane specified. Recommend Schluter DITRA or liquid membrane." });
  if (cats.has("Plumbing") && !lower.includes("water heater") && (lower.includes("bathroom") || lower.includes("kitchen"))) missing.push({ field: "Water heater adequacy", severity: "Important", suggestion: "New plumbing fixtures detected. Confirm existing water heater capacity is sufficient." });
  if (!lower.includes("hvac") && !lower.includes("heating") && !lower.includes("cooling") && scopeItems.length > 3) missing.push({ field: "HVAC requirements", severity: "Important", suggestion: "No HVAC scope found. Confirm if existing system is adequate for the renovation." });
  if (cats.has("Electrical") && !lower.includes("fixture") && !lower.includes("light")) missing.push({ field: "Light fixture selections", severity: "Minor", suggestion: "Electrical work specified but specific light fixtures not identified. Request fixture schedule." });
  if (!lower.includes("permit") && scopeItems.length > 2) missing.push({ field: "Permit requirements not addressed", severity: "Important", suggestion: "Document does not discuss permits. Review local code requirements before starting." });

  return missing;
}

function detectPermits(text: string): string[] {
  const lower = text.toLowerCase();
  const permits: string[] = [];
  for (const [permit, triggers] of Object.entries(PERMIT_TRIGGERS)) {
    if (triggers.some(t => lower.includes(t))) permits.push(permit);
  }
  if (permits.length === 0 && text.length > 200) permits.push("Building Permit (verify with local jurisdiction)");
  return permits;
}

function detectSafetyFlags(text: string): string[] {
  const lower = text.toLowerCase();
  const flags: string[] = [];
  for (const [flag, triggers] of Object.entries(SAFETY_TRIGGERS)) {
    if (triggers.some(t => lower.includes(t))) flags.push(flag);
  }
  if (flags.length === 0) flags.push("General construction safety protocols apply");
  return [...new Set(flags)];
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    let extractedText = "";

    if (file.type === "application/pdf") {
      const buffer = Buffer.from(await file.arrayBuffer());
      // Use require for pdf-parse directly from lib to avoid index.js debug execution
      const pdfParse = require("pdf-parse/lib/pdf-parse.js");
      const pdfData = await pdfParse(buffer);
      extractedText = pdfData.text;
    } else {
      // For images, we note them but can't OCR without Tesseract running server-side easily
      extractedText = `[Image file: ${file.name}] — Image-based documents require OCR processing. Text extraction limited.`;
    }

    if (!extractedText || extractedText.trim().length < 10) {
      return NextResponse.json({ error: "Could not extract text from document. The PDF may be image-based (scanned). Try a text-based PDF." }, { status: 422 });
    }

    // Run NLP analysis
    const classification = classifyDocument(extractedText);
    const dimensions = extractDimensions(extractedText);
    const rawScope = extractScopeItems(extractedText);
    const scopeItems = rawScope.map((s, i) => ({
      id: `s_${Date.now()}_${i}`,
      ...s,
      status: (s.confidence >= 0.85 ? "confirmed" : "pending") as "confirmed" | "pending",
      source_page: 1,
    }));
    const materials = inferMaterials(rawScope, dimensions, extractedText).map((m, i) => ({
      id: `m_${Date.now()}_${i}`,
      ...m,
    }));
    const missingInfo = findMissingInfo(extractedText, rawScope, dimensions).map((m, i) => ({
      id: `mi_${i}`,
      ...m,
    }));
    const permits = detectPermits(extractedText);
    const safety = detectSafetyFlags(extractedText);

    const overallConfidence = scopeItems.length > 0
      ? Math.round((scopeItems.reduce((s, item) => s + item.confidence, 0) / scopeItems.length) * 100) / 100
      : 0.5;

    const result = {
      project_type_detected: classification,
      confidence: overallConfidence,
      document_classification: classification,
      scope_items: scopeItems,
      materials_detected: materials,
      dimensions,
      missing_info: missingInfo,
      permits_needed: permits,
      safety_flags: safety,
      raw_text_preview: extractedText.slice(0, 500),
      total_text_length: extractedText.length,
      pages: extractedText.split(/\f/).length,
    };

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Extraction error:", err);
    return NextResponse.json({ error: err.message || "Extraction failed" }, { status: 500 });
  }
}
