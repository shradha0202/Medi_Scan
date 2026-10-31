// All backend communication lives here.
// - If VITE_API_BASE_URL is set, real HTTP requests are sent with Axios.
// - If it is empty, the functions use DEMO data from data/mockMedicines.js.
//
// Expected backend response for verify/details:
//   { status: 'verified' | 'expired' | 'not_found' | 'failed',
//     identifier: string,
//     record: { id, name, batch, manufacturer, manufacturedOn, expiryDate, signature } | null }
// signature (from the real backend): 'valid' | 'invalid'
import axios from 'axios';
import { mockMedicines } from '../data/mockMedicines';
import { expiryState } from '../utils/format';
import { getHistory, saveReport } from './historyService';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const USING_MOCK = !BASE_URL;

const http = axios.create({ baseURL: BASE_URL, timeout: 10000 });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const same = (a, b) => String(a || '').trim().toLowerCase() === String(b || '').trim().toLowerCase();

// ---- Demo "backend" (only used when no API URL is configured) ----
function demoResult(record, identifier) {
  if (!record) return { status: 'not_found', identifier, record: null };
  let status = 'verified';
  if (record.signature === 'demo_invalid') status = 'failed';
  else if (expiryState(record.expiryDate) === 'expired') status = 'expired';
  return { status, identifier: record.id, record: { ...record, demo: true } };
}

// 1. Verify a medicine using the identifier read from its QR code.
export async function verifyMedicine(identifier) {
  if (!USING_MOCK) return (await http.post('/verify', { identifier })).data;
  await wait(900); // simulates network time so the loading state is visible
  return demoResult(mockMedicines.find((m) => same(m.id, identifier)), identifier);
}

// 2. Search by medicine name, batch number or manufacturer.
export async function searchMedicines(query) {
  if (!USING_MOCK) return (await http.get('/medicines/search', { params: { q: query } })).data;
  await wait(250);
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return mockMedicines
    .filter((m) => [m.name, m.batch, m.manufacturer, m.id].some((v) => v.toLowerCase().includes(q)))
    .map((m) => demoResult(m, m.id));
}

// 3. Get the full details of one medicine.
export async function getMedicine(identifier) {
  if (!USING_MOCK) return (await http.get(`/medicines/${encodeURIComponent(identifier)}`)).data;
  await wait(200);
  return demoResult(mockMedicines.find((m) => same(m.id, identifier)), identifier);
}

// 4. Fetch scan history.
export async function fetchScanHistory() {
  if (!USING_MOCK) return (await http.get('/scans')).data;
  return getHistory();
}

// 5. Submit a suspicious medicine report. `payload.image` is an optional File.
export async function submitReport(payload) {
  if (!USING_MOCK) {
    const form = new FormData();
    Object.entries(payload).forEach(([k, v]) => v && form.append(k, v));
    return (await http.post('/reports', form)).data;
  }
  await wait(700);
  const { image, ...rest } = payload;
  saveReport({ ...rest, imageName: image?.name || null, submittedAt: new Date().toISOString(), demo: true });
  return { ok: true };
}
