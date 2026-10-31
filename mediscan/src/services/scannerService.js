// QR scanning with @zxing/browser (camera and image upload).
import { BrowserQRCodeReader, BrowserCodeReader } from '@zxing/browser';

export const cameraSupported = () => !!navigator.mediaDevices?.getUserMedia;

// Asks the browser for camera permission (this shows the permission prompt).
// Throws if the user denies it. The temporary stream is closed straight away.
export async function requestCameraPermission() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } } });
  stream.getTracks().forEach((t) => t.stop());
}

export const listCameras = () => BrowserCodeReader.listVideoInputDevices();

// Starts decoding from the camera into a <video> element.
// Returns "controls" – call controls.stop() to turn the camera off.
export async function startCameraScan(videoEl, deviceId, onText) {
  const reader = new BrowserQRCodeReader();
  const video = deviceId ? { deviceId: { exact: deviceId } } : { facingMode: { ideal: 'environment' } };
  return reader.decodeFromConstraints({ video }, videoEl, (result) => {
    if (result) onText(result.getText());
  });
}

// Reads a QR code from an uploaded image file.
export async function decodeImageFile(file) {
  const url = URL.createObjectURL(file);
  try {
    const result = await new BrowserQRCodeReader().decodeFromImageUrl(url);
    return result.getText();
  } finally {
    URL.revokeObjectURL(url);
  }
}

// A QR code may hold a plain ID, a URL (…?id=ID or …/ID) or JSON ({"id":"ID"}).
export function extractIdentifier(text) {
  const raw = String(text || '').trim();
  if (!raw) return '';
  try {
    const json = JSON.parse(raw);
    if (json && (json.id || json.identifier)) return String(json.id || json.identifier).trim();
  } catch { /* not JSON */ }
  try {
    const url = new URL(raw);
    const param = url.searchParams.get('id') || url.searchParams.get('mid');
    return (param || url.pathname.split('/').filter(Boolean).pop() || raw).trim();
  } catch { /* not a URL */ }
  return raw;
}
