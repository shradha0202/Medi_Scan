# MediScan – Web-Based Pharmaceutical Verification (Frontend)

End-user interface for scanning a medicine's QR code and viewing its verified record.
Built with React (Vite), React Router, Lucide icons, `@zxing/browser`, Web Speech API, LocalStorage and Axios.

> **DEMO DATA:** all medicine records in `src/data/mockMedicines.js` are fake. They have **not** passed a real Ed25519 check.
> A verified digital record confirms the registered information is intact. It does not by itself prove the physical tablet is genuine.

## Run locally

```bash
npm install
npm run dev        # opens http://localhost:5173
```

Other commands: `npm run build` (production build into `dist/`) and `npm run preview`.

## Testing the camera scanner

1. Open `http://localhost:5173/scan` and press **Start scan**. Allow the camera when the browser asks.
2. Make QR codes for the demo IDs with any QR generator (the QR text is just the ID):
   `MS-DEMO-1001` (verified), `MS-DEMO-1002` (expired), `MS-DEMO-1003` (expires soon),
   `MS-DEMO-1004` (signature failed), `MS-DEMO-1005` (verified). Any other ID shows **Record Not Found**.
   QR codes holding a URL such as `https://example.com/m?id=MS-DEMO-1001` also work.
3. You can also use **Upload QR image** or type an ID. Demo ID buttons are on the scanner page.
4. Scan the same ID 3 times within 24 hours to see **Suspicious Scan Detected**.

Camera access works only on `localhost` or `https`. To test on a phone, serve the app over https
(for example with an https tunnel such as ngrok or Cloudflare Tunnel). Plain `http://192.168.x.x` is blocked by the browser.

Voice commands need a browser with speech recognition (Chrome, Edge or Safari). Elsewhere the app shows a message instead of pretending it works.

## Connecting the backend

Copy `.env.example` to `.env` and set the URL:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

With the variable empty, demo data is used. With it set, `src/services/api.js` calls:

| Function | Request |
|---|---|
| `verifyMedicine(id)` | `POST /verify` `{ identifier }` |
| `searchMedicines(q)` | `GET /medicines/search?q=` |
| `getMedicine(id)` | `GET /medicines/:id` |
| `fetchScanHistory()` | `GET /scans` |
| `submitReport(form)` | `POST /reports` (multipart) |

Verify/details responses must look like:
`{ status: 'verified' | 'expired' | 'not_found' | 'failed', identifier, record: { id, name, batch, manufacturer, manufacturedOn, expiryDate, signature: 'valid' | 'invalid' } | null }`.
The scanner never decides a result itself. It only shows what the API returns.

## Project structure

```
src/
  components/   Sidebar, Navbar, SearchBar, MedicineScanner (camera), VoiceAssistant, MedicineCard,
                ResultCard (verification result), HealthTips, StatusBadge, Footer
  pages/        Home, Scanner, MedicineDetails, Search, ScanHistory, ReportMedicine,
                LanguageSettings (+ larger text), Help, About (privacy notice)
  services/     api.js (backend + demo), scannerService.js (zxing), voiceService.js (Web Speech), historyService.js (LocalStorage)
  context/      LanguageContext (t() function), PrefsContext (larger text)
  translations/ en.json, kn.json, hi.json
  data/         mockMedicines.js (DEMO DATA)
  styles/       global, sidebar, dashboard, scanner, responsive
```

## Adding a language

1. Copy `src/translations/en.json` to `xx.json` and translate the values.
2. Import it in `src/context/LanguageContext.jsx` and add one line to `LANGUAGES`.
3. Add the language code to `LOCALES` in `src/utils/format.js` (used for dates and voice).

## What is stored on the device (LocalStorage)

Scan history (medicine ID, result, time), recent searches, demo reports, language and text size.
Camera frames are processed in the browser and never saved. **About → Delete saved data** clears everything.
