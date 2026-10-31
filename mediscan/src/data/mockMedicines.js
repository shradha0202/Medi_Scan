// DEMO DATA ONLY. These records are fake and are used until the real backend is ready.
// They have NOT passed a real Ed25519 signature check.
// "signature" is a simulated value: 'demo_valid' or 'demo_invalid'.

const DAY = 24 * 60 * 60 * 1000;
// Helper: a date N days from today (so the "expiring soon" demo never goes stale).
const inDays = (n) => new Date(Date.now() + n * DAY).toISOString().slice(0, 10);

export const mockMedicines = [
  { id: 'MS-DEMO-1001', name: 'Paracetamol 500 mg Tablets', batch: 'PCM25A-014', manufacturer: 'Sahyadri Pharma Labs (demo)', manufacturedOn: '2025-06-12', expiryDate: inDays(700), signature: 'demo_valid' },
  { id: 'MS-DEMO-1002', name: 'Amoxicillin 250 mg Capsules', batch: 'AMX23C-221', manufacturer: 'Kaveri Healthcare Ltd (demo)', manufacturedOn: '2023-01-20', expiryDate: '2025-01-19', signature: 'demo_valid' },
  { id: 'MS-DEMO-1003', name: 'Cetirizine 10 mg Tablets', batch: 'CTZ25B-087', manufacturer: 'Malnad Remedies (demo)', manufacturedOn: '2024-11-05', expiryDate: inDays(35), signature: 'demo_valid' },
  { id: 'MS-DEMO-1004', name: 'Metformin 500 mg Tablets', batch: 'MET25D-330', manufacturer: 'Chamundi Biotech (demo)', manufacturedOn: '2025-03-02', expiryDate: inDays(540), signature: 'demo_invalid' },
  { id: 'MS-DEMO-1005', name: 'ORS Powder (Oral Rehydration Salts)', batch: 'ORS25F-112', manufacturer: 'Sahyadri Pharma Labs (demo)', manufacturedOn: '2025-08-18', expiryDate: inDays(420), signature: 'demo_valid' },
];
