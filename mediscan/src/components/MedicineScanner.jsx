// Live camera QR scanner. Handles permission, start/stop, camera switching and image upload.
// It only reads the QR text and passes it to onDetected(text); it never decides the verification result.
import { useCallback, useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, SwitchCamera, Upload, Square, Play } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { cameraSupported, requestCameraPermission, listCameras, startCameraScan, decodeImageFile } from '../services/scannerService';

export default function MedicineScanner({ onDetected }) {
  const { t } = useLang();
  const videoRef = useRef(null);
  const controlsRef = useRef(null);
  const fileRef = useRef(null);
  const handled = useRef(false);
  const [running, setRunning] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');
  const [cameras, setCameras] = useState([]);
  const [cameraIndex, setCameraIndex] = useState(-1); // -1 = default (back) camera

  const stop = useCallback(() => {
    controlsRef.current?.stop();
    controlsRef.current = null;
    setRunning(false);
  }, []);

  // Turn the camera off when leaving the page.
  useEffect(() => stop, [stop]);

  const start = useCallback(async (deviceId) => {
    setError('');
    if (!cameraSupported()) { setError(t('scan.camera_unsupported')); return; }
    setStarting(true);
    try {
      await requestCameraPermission(); // shows the browser's permission prompt
    } catch (e) {
      setStarting(false);
      setError(e?.name === 'NotAllowedError' || e?.name === 'SecurityError' ? t('scan.camera_denied') : t('scan.camera_error'));
      return;
    }
    try {
      controlsRef.current?.stop();
      handled.current = false;
      setCameras(await listCameras());
      controlsRef.current = await startCameraScan(videoRef.current, deviceId, (text) => {
        if (handled.current) return; // ignore repeated reads of the same code
        handled.current = true;
        stop();
        onDetected(text);
      });
      setRunning(true);
    } catch {
      setError(t('scan.camera_error'));
    } finally {
      setStarting(false);
    }
  }, [onDetected, stop, t]);

  const switchCamera = () => {
    if (cameras.length < 2) return;
    const next = (cameraIndex + 1) % cameras.length;
    setCameraIndex(next);
    start(cameras[next].deviceId);
  };

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setError('');
    try {
      stop();
      onDetected(await decodeImageFile(file));
    } catch {
      setError(t('scan.no_qr'));
    }
  };

  return (
    <div className="scanner">
      <div className={`scan-viewport ${running ? 'running' : ''}`}>
        <video ref={videoRef} muted playsInline />
        {!running && (
          <div className="scan-idle">
            {starting ? <Camera size={40} /> : <CameraOff size={40} />}
            <p>{starting ? t('common.loading') : t('scan.camera_off')}</p>
          </div>
        )}
        <div className="scan-frame" aria-hidden="true">
          <i /><i /><i /><i />
          {running && <span className="laser" />}
        </div>
        {running && <p className="scan-status">{t('scan.camera_on')}</p>}
      </div>

      {error && <p className="notice notice-danger" role="alert">{error}</p>}

      <div className="scan-actions">
        {!running ? (
          <button className="btn btn-primary" onClick={() => start(cameraIndex >= 0 ? cameras[cameraIndex]?.deviceId : undefined)} disabled={starting}>
            <Play size={18} /> {t('scan.start')}
          </button>
        ) : (
          <button className="btn btn-primary" onClick={stop}><Square size={18} /> {t('scan.stop')}</button>
        )}
        {cameras.length > 1 && (
          <button className="btn btn-ghost" onClick={switchCamera}><SwitchCamera size={18} /> {t('scan.switch')}</button>
        )}
        <button className="btn btn-ghost" onClick={() => fileRef.current?.click()}><Upload size={18} /> {t('scan.upload')}</button>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
      </div>
    </div>
  );
}
