// Dudley's Excavating — verified facts only. Every claim traces to a source noted inline.
export const biz = {
  name: "Dudley's Excavating, Inc.",
  shortName: "Dudley's Excavating",
  tagline: "Directional Boring · Excavation · Paving · Septic",
  phone: "530-385-1445",
  phoneHref: "tel:5303851445",
  email: "paul@dudleysexcavating.com",            // dudleysexcavating.com/contact-2
  address: "209 San Benito Ave, Gerber, CA 96035", // site + FMCSA
  city: "Gerber", state: "CA", zip: "96035",
  counties: ["Tehama", "Glenn", "Butte", "Shasta"], // site contact page
  license: "694077",           // CSLB, active (verified Aug 2026 via BuildZoom)
  licenseClasses: "Class A General Engineering · Low Voltage Systems · Construction Zone Traffic Control",
  dgs: "22540",                // Certified Small Business, DGS/E-Procurement
  usdot: "2728939",            // FMCSA SAFER
  butteLic: "CONV-0054",       // Butte County contractor license
  bond: "$15,000 — Indemnity Company of California",
  workersComp: "Insurance Company of the West",
  powerUnits: 40,              // FMCSA MCS-150 filed 09/25/2025
  drivers: 44,                 // FMCSA MCS-150 filed 09/25/2025
  permits: 127,                // BuildZoom permit history 2018–2025 (Chico, Redding, Butte Co.)
  founded: 1955,             // confirmed by the Dudley team on the walkthrough call, Aug 2026
  founder: "Harry Dudley",
  family: ["Scott Dudley", "Michael Dudley", "Kyle Dudley"],
  pm: "Glen Gipper",
  domain: "dudleysexcavating.com",
};

export const paradise = {
  // RDO Equipment case study (Nov 2022), quoting PM Glen Gipper.
  client: "AT&T",
  miles: 40,
  yearsTotal: 6,
  soil: "red clay, rock cobble, and granite",
  rig: "Vermeer D23x30DR S3",
  town: "Paradise, CA",
};

// [photo file, caption, category] — categories: boring|excavation|paving|utility|crew
export const photos = [
  ["f12f27ca-54ff-49e2-ae8a-ee6393f580fc.jpg", "Directional drill rig pushing rod on a mountain job", "boring"],
  ["80144252-8a61-4e2b-be71-811a5ea9d846.jpg", "Bore rig set up on the highway shoulder at first light", "boring"],
  ["f3a270d4-b715-4035-9683-9f4e000664f5.jpg", "27-foot 1-inch bore under a finished driveway — surface untouched", "boring"],
  ["d14aee6c-5d5f-4bcc-bd55-29f00d333153.jpg", "Bore pits and product pipe in native red earth", "boring"],
  ["a004537b-0195-44d4-9fe7-1081749ff5ee.jpg", "Rig walking the shoulder between shots", "boring"],
  ["d159418c-2f4b-4ef1-ae66-7ca10a88a9da.jpg", "Fused HDPE strung and ready to pull", "boring"],
  ["21c6cc0e-b49d-4ac3-a612-9cf67f2aa817.jpg", "Butt-fusing HDPE on the hillside", "utility"],
  ["60c82a06-8321-44e5-b403-a7b5255d25b0.jpg", "Fusion weld on the line, burn-scar timber behind", "utility"],
  ["573dac2a-c90c-41d6-8b5f-b78b2055cdea.jpg", "Vacuum potholing to expose existing utilities", "utility"],
  ["a092b754-85b0-4e1d-ab52-c89b3b5a56c9.jpg", "Vac crew daylighting a live line under traffic control", "utility"],
  ["610ce8ca-c6ad-47e8-864d-f4c0c7d661ed.jpg", "Potholing tight to landscape — surgical, not scorched-earth", "utility"],
  ["c592f19f-b545-4e93-a547-5d780c311a95.jpg", "Open trench crossing in native red dirt", "utility"],
  ["592d06b8-bc1e-4076-87f9-6508c62b130d.jpg", "Trenching rock beside the traveled way, plated overnight", "excavation"],
  ["Untitled-1.jpg", "Rock cut with the excavator — steel plates ready", "excavation"],
  ["2eecfa93-22bf-4b02-9b98-49e9c7c7ce23.jpg", "Excavator working the shoulder on a state route", "excavation"],
  ["64fcad2e-5201-4399-af3c-c5ebc1a974ff.jpg", "Hillside excavation with full traffic control", "excavation"],
  ["a6c99a6d-5882-4da3-bdbc-dc0ade895dd5.jpg", "Loading out on a mountain grade", "excavation"],
  ["c8befdac-e8b8-4964-a1b6-c3251011b4a2.jpg", "Excavator and end-dump working the edge of the road at dusk", "excavation"],
  ["0c587916-7d9a-4a63-9daa-3ae3177b74ba.jpg", "Double-drum roller on a patch set", "paving"],
  ["34f1ef0d-0849-49b2-a3be-b96a1235aab6.jpg", "Fresh mat rolled tight on a residential street", "paving"],
  ["2a23c12b-610c-4e57-8e0f-3b6a968eb70f.jpg", "Rolling behind the water truck", "paving"],
  ["2c5c0149-1d3e-40b6-913f-854b13b1371b.jpg", "Grinding out the failed section before repave", "paving"],
  ["deab7f8d-a4a5-4448-a87b-96cc9d684233.jpg", "Compacting the lift along the curb line", "paving"],
  ["44f5d4ea-dfb1-4b64-a87c-7d80f7d3f9c0.jpg", "Trench paveback down the centerline", "paving"],
  ["7499fd6f-4d0f-426e-9018-d7ae89bfd548.jpg", "Finished driveway apron, ready for traffic", "paving"],
  ["55c6ea23-532c-424f-b29b-2cc15e39013f.jpg", "Cleanup pass — leave it better than we found it", "crew"],
  ["42fb96bd-057d-42af-8869-a5e01283f474.jpg", "Layout marks down before the cut", "crew"],
  ["761beb71-0b24-4c8d-808d-97f1f806b5eb.jpg", "Rolling to the next shot", "crew"],
  ["Untitled.jpg", "Shoulder restored and hydroseeded behind the bore", "crew"],
];
