const { jsPDF } = require("jspdf");
const path = require("path");

function createBathroomRemodel() {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("SCOPE OF WORK — Bathroom Remodel", 20, 20);
  doc.setFontSize(11);
  doc.text("Project: Johnson Master Bathroom Renovation", 20, 32);
  doc.text("Location: 123 Oak Street, Wilmington NC 28401", 20, 38);
  doc.text("Client: Mark Johnson", 20, 44);
  doc.text("Date: May 10, 2026", 20, 50);
  doc.text("Prepared by: ABC Construction LLC", 20, 56);

  doc.setFontSize(13);
  doc.text("1. DEMOLITION", 20, 70);
  doc.setFontSize(10);
  doc.text("- Remove existing shower enclosure, shower pan, and all wall tile.", 25, 78);
  doc.text("- Demolish existing vanity, countertop, and mirror.", 25, 84);
  doc.text("- Remove existing toilet and disconnect plumbing.", 25, 90);
  doc.text("- Strip all flooring down to subfloor. Haul away all debris.", 25, 96);

  doc.setFontSize(13);
  doc.text("2. FRAMING & STRUCTURAL", 20, 110);
  doc.setFontSize(10);
  doc.text("- Frame new shower alcove 48 inches x 36 inches.", 25, 118);
  doc.text("- Install blocking for grab bars and shower glass.", 25, 124);
  doc.text("- Verify subfloor integrity; replace any water-damaged sections.", 25, 130);

  doc.setFontSize(13);
  doc.text("3. PLUMBING", 20, 144);
  doc.setFontSize(10);
  doc.text("- Relocate shower drain to center of new shower footprint.", 25, 152);
  doc.text("- Install new PEX supply lines for shower valve and vanity.", 25, 158);
  doc.text("- Install new toilet flange and supply line.", 25, 164);
  doc.text("- Connect double-vanity with two undermount sinks.", 25, 170);

  doc.setFontSize(13);
  doc.text("4. ELECTRICAL", 20, 184);
  doc.setFontSize(10);
  doc.text("- Install 6 recessed LED can lights on dimmer switch.", 25, 192);
  doc.text("- Install 2 GFCI outlets above vanity area.", 25, 198);
  doc.text("- Wire and install new exhaust fan with humidity sensor.", 25, 204);
  doc.text("- All electrical work per NEC code on dedicated 20-amp circuit.", 25, 210);

  doc.setFontSize(13);
  doc.text("5. TILE WORK", 20, 224);
  doc.setFontSize(10);
  doc.text("- Install cement board substrate on all shower walls.", 25, 232);
  doc.text("- Apply waterproof membrane (Schluter DITRA) in shower and floor.", 25, 238);
  doc.text("- Install porcelain tile 12x24 floor-to-ceiling in shower area.", 25, 244);
  doc.text("- Install porcelain tile 12x24 on bathroom floor.", 25, 250);
  doc.text("- Room dimensions: 10 ft x 12 ft, ceiling height 9 ft.", 25, 256);

  doc.addPage();
  doc.setFontSize(13);
  doc.text("6. FIXTURES & FINISHES", 20, 20);
  doc.setFontSize(10);
  doc.text("- Install 60-inch double vanity (white shaker style) with quartz countertop.", 25, 28);
  doc.text("- Install frameless glass shower door 48x72.", 25, 34);
  doc.text("- Install new elongated comfort-height toilet.", 25, 40);
  doc.text("- Install all trim, accessories, and towel bars.", 25, 46);

  doc.setFontSize(13);
  doc.text("7. PAINTING", 20, 60);
  doc.setFontSize(10);
  doc.text("- Prime all new drywall surfaces.", 25, 68);
  doc.text("- Apply 2 coats interior latex paint (semi-gloss for bathroom).", 25, 74);
  doc.text("- Paint color to be selected by homeowner.", 25, 80);

  doc.setFontSize(13);
  doc.text("8. NOTES & EXCLUSIONS", 20, 94);
  doc.setFontSize(10);
  doc.text("- Homeowner responsible for fixture selections not listed above.", 25, 102);
  doc.text("- Price does not include heated floor system. Add $1,200 if desired.", 25, 108);
  doc.text("- All work subject to building, plumbing, and electrical permits.", 25, 114);
  doc.text("- Estimated timeline: 3 weeks from permit approval.", 25, 120);

  const outputPath = path.join(__dirname, "..", "public", "test-pdfs", "bathroom_remodel_scope.pdf");
  require("fs").mkdirSync(path.dirname(outputPath), { recursive: true });
  require("fs").writeFileSync(outputPath, Buffer.from(doc.output("arraybuffer")));
  console.log("Created:", outputPath);
}

function createCommercialOffice() {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("CONSTRUCTION SCOPE OF WORK", 20, 20);
  doc.setFontSize(14);
  doc.text("Commercial Office Buildout — Suite 200", 20, 30);
  doc.setFontSize(10);
  doc.text("Project: Riverside Properties LLC — Office Renovation", 20, 40);
  doc.text("Location: 456 Market Street, Suite 200, Raleigh NC 27601", 20, 46);
  doc.text("Total Area: 2,400 sq ft", 20, 52);
  doc.text("Date: May 5, 2026", 20, 58);

  doc.setFontSize(13);
  doc.text("PHASE 1: DEMOLITION & SITE PREP", 20, 72);
  doc.setFontSize(10);
  doc.text("- Demolish all existing partition walls and ceiling grid.", 25, 80);
  doc.text("- Remove existing carpet and VCT flooring throughout.", 25, 86);
  doc.text("- Remove all existing light fixtures and electrical devices.", 25, 92);
  doc.text("- Cap and seal all existing plumbing lines at walls.", 25, 98);

  doc.setFontSize(13);
  doc.text("PHASE 2: FRAMING & DRYWALL", 20, 112);
  doc.setFontSize(10);
  doc.text("- Frame 6 new private offices using metal studs (3-5/8 inch).", 25, 120);
  doc.text("- Frame 1 large conference room (20 ft x 16 ft).", 25, 126);
  doc.text("- Frame break room with kitchenette area.", 25, 132);
  doc.text("- Install 5/8 inch drywall on all new walls, tape, mud, and sand.", 25, 138);
  doc.text("- Install new suspended acoustical ceiling grid throughout.", 25, 144);

  doc.setFontSize(13);
  doc.text("PHASE 3: ELECTRICAL", 20, 158);
  doc.setFontSize(10);
  doc.text("- Install new 200-amp electrical panel for suite.", 25, 166);
  doc.text("- Wire all offices with duplex outlets per code (every 6 feet).", 25, 172);
  doc.text("- Install dedicated 20-amp circuits for break room appliances.", 25, 178);
  doc.text("- Install LED 2x4 troffer lights in ceiling grid (48 total).", 25, 184);
  doc.text("- Install network conduit runs to all offices for data/phone.", 25, 190);
  doc.text("- Install emergency exit lighting per fire code.", 25, 196);

  doc.setFontSize(13);
  doc.text("PHASE 4: PLUMBING", 20, 210);
  doc.setFontSize(10);
  doc.text("- Install break room sink with hot and cold supply lines.", 25, 218);
  doc.text("- Connect dishwasher supply and drain in break room.", 25, 224);
  doc.text("- Install drinking fountain in common hallway.", 25, 230);

  doc.setFontSize(13);
  doc.text("PHASE 5: HVAC", 20, 244);
  doc.setFontSize(10);
  doc.text("- Install 2 new mini split HVAC systems for independent zone control.", 25, 252);
  doc.text("- Extend existing duct work to new office layout.", 25, 258);
  doc.text("- Install thermostat in each office zone.", 25, 264);

  doc.addPage();
  doc.setFontSize(13);
  doc.text("PHASE 6: FLOORING", 20, 20);
  doc.setFontSize(10);
  doc.text("- Install luxury vinyl plank flooring throughout (2,400 sq ft).", 25, 28);
  doc.text("- Install rubber transition strips at all doorways.", 25, 34);

  doc.setFontSize(13);
  doc.text("PHASE 7: PAINTING & FINISHES", 20, 48);
  doc.setFontSize(10);
  doc.text("- Prime and paint all new drywall — 2 coats eggshell finish.", 25, 56);
  doc.text("- Install commercial-grade door hardware on all offices.", 25, 62);
  doc.text("- Install window blinds on all exterior windows (8 total).", 25, 68);
  doc.text("- Install ADA-compliant signage on all rooms.", 25, 74);

  doc.setFontSize(13);
  doc.text("PHASE 8: FIRE & SAFETY", 20, 88);
  doc.setFontSize(10);
  doc.text("- Install fire sprinkler heads per NFPA code in all new rooms.", 25, 96);
  doc.text("- Install smoke detectors and carbon monoxide detectors.", 25, 102);
  doc.text("- Install fire extinguisher cabinets (2 locations).", 25, 108);
  doc.text("- All work to meet ADA accessibility requirements.", 25, 114);

  doc.setFontSize(13);
  doc.text("BUDGET ESTIMATE", 20, 132);
  doc.setFontSize(10);
  doc.text("Total estimated material cost: $18,400", 25, 140);
  doc.text("Total estimated labor cost: $24,000", 25, 146);
  doc.text("Permits and fees: $1,200", 25, 152);
  doc.text("Contingency (10%): $4,360", 25, 158);
  doc.text("TOTAL PROJECT ESTIMATE: $47,960", 25, 168);

  const outputPath = path.join(__dirname, "..", "public", "test-pdfs", "commercial_office_scope.pdf");
  require("fs").mkdirSync(path.dirname(outputPath), { recursive: true });
  require("fs").writeFileSync(outputPath, Buffer.from(doc.output("arraybuffer")));
  console.log("Created:", outputPath);
}

function createKitchenRenovation() {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("KITCHEN RENOVATION — SCOPE OF WORK", 20, 20);
  doc.setFontSize(10);
  doc.text("Project: Williams Kitchen Remodel", 20, 32);
  doc.text("Location: 789 Pine Drive, Durham NC 27707", 20, 38);
  doc.text("Client: Sarah Williams", 20, 44);
  doc.text("Kitchen Dimensions: 14 ft x 18 ft, ceiling height 10 ft", 20, 50);
  doc.text("Total Kitchen Area: 252 sq ft", 20, 56);

  doc.setFontSize(13);
  doc.text("1. DEMOLITION", 20, 70);
  doc.setFontSize(10);
  doc.text("- Remove all existing cabinets (upper and lower).", 25, 78);
  doc.text("- Remove existing countertops and backsplash tile.", 25, 84);
  doc.text("- Demolish non-load-bearing wall between kitchen and dining room.", 25, 90);
  doc.text("- Remove existing vinyl flooring down to subfloor.", 25, 96);
  doc.text("- Disconnect and remove existing appliances (range, dishwasher, disposal).", 25, 102);

  doc.setFontSize(13);
  doc.text("2. STRUCTURAL", 20, 116);
  doc.setFontSize(10);
  doc.text("- Install LVL beam to replace load-bearing wall (per engineer's specs).", 25, 124);
  doc.text("- Frame new island peninsula (4 ft x 8 ft).", 25, 130);
  doc.text("- Repair and level subfloor as needed.", 25, 136);

  doc.setFontSize(13);
  doc.text("3. PLUMBING", 20, 150);
  doc.setFontSize(10);
  doc.text("- Relocate kitchen sink to new island location.", 25, 158);
  doc.text("- Install new garbage disposal.", 25, 164);
  doc.text("- Run gas line to new range location.", 25, 170);
  doc.text("- Install dishwasher supply and drain connections.", 25, 176);
  doc.text("- Install pot-filler faucet at range wall.", 25, 182);

  doc.setFontSize(13);
  doc.text("4. ELECTRICAL", 20, 196);
  doc.setFontSize(10);
  doc.text("- Install 6 recessed LED can lights over work areas.", 25, 204);
  doc.text("- Install 3 pendant lights over island.", 25, 210);
  doc.text("- Install under-cabinet LED strip lighting.", 25, 216);
  doc.text("- Install GFCI outlets every 4 feet along countertops (per code).", 25, 222);
  doc.text("- Install dedicated circuits for range, refrigerator, dishwasher, disposal.", 25, 228);
  doc.text("- Upgrade electrical panel to accommodate new load.", 25, 234);

  doc.setFontSize(13);
  doc.text("5. CABINETRY & COUNTERTOPS", 20, 248);
  doc.setFontSize(10);
  doc.text("- Install custom shaker-style cabinets (white) — 14 lower, 10 upper.", 25, 256);
  doc.text("- Install quartz countertops (Calacatta Gold) on perimeter and island.", 25, 262);

  doc.addPage();
  doc.setFontSize(13);
  doc.text("6. TILE & BACKSPLASH", 20, 20);
  doc.setFontSize(10);
  doc.text("- Install ceramic subway tile backsplash (white 3x6).", 25, 28);
  doc.text("- Backsplash from countertop to upper cabinets on all walls.", 25, 34);

  doc.setFontSize(13);
  doc.text("7. FLOORING", 20, 48);
  doc.setFontSize(10);
  doc.text("- Install luxury vinyl plank flooring throughout kitchen and dining area.", 25, 56);
  doc.text("- Total flooring area approximately 400 sq ft.", 25, 62);

  doc.setFontSize(13);
  doc.text("8. PAINTING", 20, 76);
  doc.setFontSize(10);
  doc.text("- Prime and paint all new drywall and patched areas.", 25, 84);
  doc.text("- Apply 2 coats Benjamin Moore Chantilly Lace (OC-65) semi-gloss.", 25, 90);

  const outputPath = path.join(__dirname, "..", "public", "test-pdfs", "kitchen_renovation_scope.pdf");
  require("fs").mkdirSync(path.dirname(outputPath), { recursive: true });
  require("fs").writeFileSync(outputPath, Buffer.from(doc.output("arraybuffer")));
  console.log("Created:", outputPath);
}

createBathroomRemodel();
createCommercialOffice();
createKitchenRenovation();
console.log("\n✅ All test PDFs created in public/test-pdfs/");
