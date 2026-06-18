const fs = require("fs");
const path = require("path");

async function testExtraction(filename) {
  const filePath = path.join(__dirname, "..", "public", "test-pdfs", filename);
  const fileBuffer = fs.readFileSync(filePath);
  const blob = new Blob([fileBuffer], { type: "application/pdf" });
  const formData = new FormData();
  formData.append("file", blob, filename);

  console.log(`\n${"=".repeat(60)}`);
  console.log(`Testing: ${filename}`);
  console.log("=".repeat(60));

  try {
    const res = await fetch("http://localhost:3000/api/extract", { method: "POST", body: formData });
    const data = await res.json();

    if (data.error) {
      console.log("ERROR:", data.error);
      return;
    }

    console.log(`\nClassification: ${data.document_classification}`);
    console.log(`Confidence: ${(data.confidence * 100).toFixed(0)}%`);
    console.log(`Text extracted: ${data.total_text_length} chars`);

    console.log(`\nScope Items (${data.scope_items.length}):`);
    data.scope_items.forEach((s, i) => {
      console.log(`  ${i + 1}. [${s.category}] ${s.description} (${(s.confidence * 100).toFixed(0)}% - ${s.status})`);
    });

    console.log(`\nMaterials (${data.materials_detected.length}):`);
    data.materials_detected.forEach((m) => {
      console.log(`  - ${m.name}: ${m.quantity} ${m.unit} @ $${m.unit_price} = $${m.total} (${m.supplier})`);
    });

    const totalMat = data.materials_detected.reduce((s, m) => s + m.total, 0);
    console.log(`  TOTAL: $${totalMat.toFixed(2)}`);

    console.log(`\nMissing Info (${data.missing_info.length}):`);
    data.missing_info.forEach((m) => {
      console.log(`  [${m.severity}] ${m.field}: ${m.suggestion}`);
    });

    console.log(`\nPermits: ${data.permits_needed.join(", ")}`);
    console.log(`Safety Flags: ${data.safety_flags.join("; ")}`);
    console.log(`Dimensions:`, data.dimensions);
  } catch (err) {
    console.log("FETCH ERROR:", err.message);
  }
}

(async () => {
  await testExtraction("bathroom_remodel_scope.pdf");
  await testExtraction("commercial_office_scope.pdf");
  await testExtraction("kitchen_renovation_scope.pdf");
  console.log("\n\n✅ All tests complete!");
})();
