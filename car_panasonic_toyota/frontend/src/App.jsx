import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// --- Configuration ---
// const API_BASE_URL = '/api'; // Your FastAPI backend URL
const API_BASE_URL = 'http://localhost:8000';

// --- Icons (inline SVG, no external dependency) ---
const MicIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

const MicOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="1" y1="1" x2="23" y2="23" />
    <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
    <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

const CarIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 13l1.5-4.5A2 2 0 0 1 6.4 7h11.2a2 2 0 0 1 1.9 1.5L21 13" />
    <path d="M3 13h18v4a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H6v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4z" />
    <circle cx="7.5" cy="16.5" r="1.5" />
    <circle cx="16.5" cy="16.5" r="1.5" />
  </svg>
);

const SparkleIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
  </svg>
);

const SignalIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <rect x="2" y="14" width="4" height="8" rx="1" />
    <rect x="10" y="9" width="4" height="13" rx="1" />
    <rect x="18" y="4" width="4" height="18" rx="1" opacity="0.5" />
  </svg>
);

const FanIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 12c0-3 1-6 4-7 2.5-.8 4.5 1 3.5 3.5-1 2.5-4.5 3.5-7.5 3.5z" />
    <path d="M12 12c-3 0-6-1-7-4-.8-2.5 1-4.5 3.5-3.5 2.5 1 3.5 4.5 3.5 7.5z" />
    <path d="M12 12c0 3-1 6-4 7-2.5.8-4.5-1-3.5-3.5 1-2.5 4.5-3.5 7.5-3.5z" />
    <circle cx="12" cy="12" r="1.6" />
  </svg>
);

const PowerIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v8" />
    <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
  </svg>
);

const LeafIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 4 13c0-6 5-11 16-11 0 11-5 18-9 18z" />
    <path d="M4 13c4 0 7-3 7-7" />
  </svg>
);

// OpenWeather's 1-5 Air Quality Index scale.
const AQI_LABELS = { 1: 'Good', 2: 'Fair', 3: 'Moderate', 4: 'Poor', 5: 'Very Poor' };

const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4.5" />
    <path d="M12 2.5v2.5M12 19v2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M2.5 12H5M19 12h2.5M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8" />
  </svg>
);

const CloudIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 19a4.5 4.5 0 0 1-.5-8.97A5.5 5.5 0 0 1 16.9 8.06 4 4 0 0 1 17 16H6.5z" />
  </svg>
);

const CloudRainIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 15.5a4.5 4.5 0 0 1-.5-8.97A5.5 5.5 0 0 1 16.9 4.56 4 4 0 0 1 17 12.5H6.5z" />
    <path d="M8 18v2M12 18v2M16 18v2" />
  </svg>
);

const CloudLightningIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 14.5a4.5 4.5 0 0 1-.5-8.97A5.5 5.5 0 0 1 16.9 3.56 4 4 0 0 1 17 11.5H6.5z" />
    <path d="M13 13l-3 5h3l-3 5" />
  </svg>
);

const SnowflakeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v20M4.2 7l15.6 10M4.2 17L19.8 7" />
  </svg>
);

const MistIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 8h16M4 12h16M4 16h10" />
  </svg>
);

// Maps an OpenWeather icon code (e.g. "10d") to one of the SVG icons above by its
// two-digit condition prefix, ignoring the day/night suffix.
const weatherIconFor = (code) => {
  const prefix = (code || '').slice(0, 2);
  if (prefix === '01') return <SunIcon />;
  if (['02', '03', '04'].includes(prefix)) return <CloudIcon />;
  if (['09', '10'].includes(prefix)) return <CloudRainIcon />;
  if (prefix === '11') return <CloudLightningIcon />;
  if (prefix === '13') return <SnowflakeIcon />;
  if (prefix === '50') return <MistIcon />;
  return <CloudIcon />;
};

function App() {
  const [error, setError] = useState('');

  // Whether this browser can access the microphone at all — gates the Live Talk
  // button (the only voice input mode now; Push to talk was removed).
  const [isAudioSupported, setIsAudioSupported] = useState(false);

  // --- Ignition: system must be "started" before the dashboard is usable ---
  const [isSystemOn, setIsSystemOn] = useState(false);
  const [isBooting, setIsBooting] = useState(false);

  // Real GPS location, acquired on power-on — see toggleSystemPower. Used for
  // location-dependent queries (weather, nearby search, dealership finder) instead
  // of letting the backend fall back to a random default point.
  const [coords, setCoords] = useState(null);

  // Dashboard widget data — fetched once real coords are available (see the effect
  // below). These are separate lightweight JSON endpoints, not the conversational
  // Gemini pipeline, so the widgets can populate on their own without a voice command.
  const [weather, setWeather] = useState(null);
  const [airQuality, setAirQuality] = useState(null);

  useEffect(() => {
    if (!coords) return;

    fetch(`${API_BASE_URL}/current-weather/?lat=${coords.lat}&lng=${coords.lng}`, {
      headers: { 'X-API-Key': 'nUutfYzyfwDyQ99r-7eYkQULAQLpk95zKkhlp-ISmpM' },
    })
      .then(res => res.ok ? res.json() : Promise.reject(new Error(`Weather request failed: ${res.status}`)))
      .then(setWeather)
      .catch(err => console.warn('Weather widget fetch failed:', err));

    fetch(`${API_BASE_URL}/air-quality/?lat=${coords.lat}&lng=${coords.lng}`, {
      headers: { 'X-API-Key': 'nUutfYzyfwDyQ99r-7eYkQULAQLpk95zKkhlp-ISmpM' },
    })
      .then(res => res.ok ? res.json() : Promise.reject(new Error(`Air quality request failed: ${res.status}`)))
      .then(setAirQuality)
      .catch(err => console.warn('Air quality widget fetch failed:', err));
  }, [coords]);

  // --- Gemini Live (real-time voice mode) ---
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [liveStatus, setLiveStatus] = useState('idle'); // idle | connecting | listening | speaking
  const liveWsRef = useRef(null);
  const liveStreamRef = useRef(null);
  const liveCaptureCtxRef = useRef(null);
  const liveCaptureNodeRef = useRef(null);
  const livePlaybackCtxRef = useRef(null);
  const livePlaybackCursorRef = useRef(0);

  // --- Dummy dashboard state: AC/climate, driven by real command codes ---
  const [ac, setAc] = useState({ power: true, temp: 22, fan: 3 });
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

  const WAKE_PHRASE = 'hello toyota';

  // Live clock for the dashboard status bar
  const [clock, setClock] = useState(() => new Date());
  useEffect(() => {
    const tick = setInterval(() => setClock(new Date()), 1000 * 15);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    // Live Talk needs getUserMedia (mic access) — that's the only real requirement
    // now that Push to talk's MediaRecorder-based pipeline is gone.
    const hasMediaDevices = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    setIsAudioSupported(hasMediaDevices);
    if (!hasMediaDevices) console.warn('❌ getUserMedia not supported in this browser');
  }, []);

  // --- Gemini Live tool-call -> same dashboard state ---
  // Only the AC/climate tools update visible dashboard state — Gemini Live already
  // speaks its own natural confirmation for whatever it just did, so no separate
  // audio clip or chat message is needed here.
  const applyLiveToolCall = (name, args) => {
    if (name === 'set_ac_power') { setAc(s => ({ ...s, power: !!args.on })); }
    else if (name === 'set_temperature') {
      const v = parseInt(args.celsius, 10);
      if (!isNaN(v)) setAc(s => ({ ...s, temp: clamp(v, 16, 30) }));
    }
    else if (name === 'adjust_temperature') {
      setAc(s => ({ ...s, temp: clamp(s.temp + (args.direction === 'down' ? -1 : 1), 16, 30) }));
    }
    else if (name === 'set_fan_speed') {
      const v = parseInt(args.level, 10);
      if (!isNaN(v)) setAc(s => ({ ...s, fan: clamp(v, 1, 7) }));
    }
  };

  // --- Raw PCM audio helpers for Gemini Live streaming ---
  const floatTo16BitPCM = (float32Array) => {
    const out = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return out;
  };

  const downsampleBuffer = (buffer, inputSampleRate, targetSampleRate) => {
    if (targetSampleRate === inputSampleRate) return buffer;
    const ratio = inputSampleRate / targetSampleRate;
    const newLength = Math.round(buffer.length / ratio);
    const result = new Float32Array(newLength);
    let offsetResult = 0;
    let offsetBuffer = 0;
    while (offsetResult < newLength) {
      const nextOffsetBuffer = Math.round((offsetResult + 1) * ratio);
      let accum = 0, count = 0;
      for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
        accum += buffer[i];
        count++;
      }
      result[offsetResult] = count > 0 ? accum / count : 0;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }
    return result;
  };

  const base64FromInt16 = (int16Array) => {
    const bytes = new Uint8Array(int16Array.buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  };

  const int16FromBase64 = (b64) => {
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new Int16Array(bytes.buffer);
  };

  const playLiveAudioChunk = (base64Data) => {
    const ctx = livePlaybackCtxRef.current;
    if (!ctx) return;
    const int16 = int16FromBase64(base64Data);
    const float32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) float32[i] = int16[i] / 32768;

    const buffer = ctx.createBuffer(1, float32.length, 24000);
    buffer.copyToChannel(float32, 0);

    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(ctx.destination);

    const now = ctx.currentTime;
    const startAt = Math.max(now, livePlaybackCursorRef.current);
    src.start(startAt);
    livePlaybackCursorRef.current = startAt + buffer.duration;
  };

  const stopLiveTalk = () => {
    setIsLiveActive(false);
    setLiveStatus('idle');
    if (liveWsRef.current) {
      try { liveWsRef.current.send(JSON.stringify({ type: 'end' })); } catch (e) { /* noop */ }
      liveWsRef.current.close();
      liveWsRef.current = null;
    }
    if (liveCaptureNodeRef.current) {
      liveCaptureNodeRef.current.disconnect();
      liveCaptureNodeRef.current = null;
    }
    if (liveCaptureCtxRef.current) {
      liveCaptureCtxRef.current.close();
      liveCaptureCtxRef.current = null;
    }
    if (liveStreamRef.current) {
      liveStreamRef.current.getTracks().forEach(t => t.stop());
      liveStreamRef.current = null;
    }
    if (livePlaybackCtxRef.current) {
      livePlaybackCtxRef.current.close();
      livePlaybackCtxRef.current = null;
    }
  };

  const startLiveTalk = async () => {
    if (isLiveActive) return;
    setLiveStatus('connecting');
    setError('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      liveStreamRef.current = stream;

      // Real GPS coords (if acquired on power-on) let the backend answer
      // weather/dealership/local-search questions for the driver's actual location
      // instead of the random default fallback.
      let wsUrl = API_BASE_URL.replace(/^http/, 'ws') + '/ws/live';
      if (coords) {
        wsUrl += `?lat=${coords.lat}&lng=${coords.lng}`;
      }
      const ws = new WebSocket(wsUrl);
      liveWsRef.current = ws;

      livePlaybackCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      livePlaybackCursorRef.current = livePlaybackCtxRef.current.currentTime;

      ws.onopen = () => {
        setLiveStatus('listening');
        setIsLiveActive(true);

        const captureCtx = new (window.AudioContext || window.webkitAudioContext)();
        liveCaptureCtxRef.current = captureCtx;
        const source = captureCtx.createMediaStreamSource(stream);
        const processor = captureCtx.createScriptProcessor(4096, 1, 1);
        const muteGain = captureCtx.createGain();
        muteGain.gain.value = 0; // process audio without echoing mic input back to speakers
        liveCaptureNodeRef.current = processor;

        processor.onaudioprocess = (e) => {
          if (ws.readyState !== WebSocket.OPEN) return;
          const input = e.inputBuffer.getChannelData(0);
          const downsampled = downsampleBuffer(input, captureCtx.sampleRate, 16000);
          const pcm16 = floatTo16BitPCM(downsampled);
          ws.send(JSON.stringify({ type: 'audio', data: base64FromInt16(pcm16) }));
        };

        source.connect(processor);
        processor.connect(muteGain);
        muteGain.connect(captureCtx.destination);
      };

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.type === 'audio') {
          setLiveStatus('speaking');
          playLiveAudioChunk(msg.data);
        } else if (msg.type === 'tool_call') {
          applyLiveToolCall(msg.name, msg.args || {});
        } else if (msg.type === 'error') {
          setError(msg.message || 'Live voice error.');
          stopLiveTalk();
        }
      };

      ws.onclose = () => stopLiveTalk();
      ws.onerror = () => {
        setError('Live voice connection error.');
        stopLiveTalk();
      };
    } catch (err) {
      console.error('Failed to start live talk:', err);
      setError('Could not start live voice mode: ' + err.message);
      setLiveStatus('idle');
    }
  };

  const toggleLiveTalk = () => {
    if (isLiveActive) stopLiveTalk();
    else startLiveTalk();
  };

  // --- Wake word: "Hello Toyota" starts a voice command ---
  // On by default (even on a first-ever visit) and persists across reloads/power-cycles
  // via localStorage, so it stays on "all the time" unless the driver explicitly turns
  // it off — turning it off is itself remembered too. wakeWordEnabled reflects whether
  // it's actually listening right now (only possible while powered on).
  const [wakeWordPreferred, setWakeWordPreferred] = useState(() => {
    try { return localStorage.getItem(`wakeWordPreferred:${WAKE_PHRASE}`) !== 'false'; }
    catch (e) { return true; }
  });
  const [wakeWordEnabled, setWakeWordEnabled] = useState(false);
  const wakeRecognitionRef = useRef(null);

  // Just for recognizing the wake phrase itself — follows the browser/OS locale
  // rather than assuming English. The actual conversation that follows goes through
  // Live Talk (Gemini Live), which is natively multilingual and needs no language hint.
  const wakeWordLang = navigator.language || 'en-US';

  const startWakeWordListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Wake word detection is not supported in this browser.');
      return;
    }
    if (wakeRecognitionRef.current) return; // already running

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = wakeWordLang;

    recognition.onresult = (event) => {
      const last = event.results[event.results.length - 1];
      const heard = last[0].transcript.toLowerCase();
      if (heard.includes(WAKE_PHRASE.toLowerCase())) {
        recognition.stop();
        startLiveTalk();
      }
    };

    recognition.onend = () => {
      // Browsers auto-stop after a period of silence — keep listening while enabled
      if (wakeRecognitionRef.current === recognition) {
        try { recognition.start(); } catch (e) { /* already started */ }
      }
    };

    recognition.onerror = (event) => {
      console.warn('Wake word recognition error:', event.error);
    };

    wakeRecognitionRef.current = recognition;
    setWakeWordEnabled(true);
    recognition.start();
  };

  const stopWakeWordListening = () => {
    if (wakeRecognitionRef.current) {
      wakeRecognitionRef.current.onend = null; // don't auto-restart
      wakeRecognitionRef.current.stop();
      wakeRecognitionRef.current = null;
    }
    setWakeWordEnabled(false);
  };

  // User-facing toggle: flips the persistent preference and, if the system is
  // currently on, starts/stops listening immediately to match.
  const toggleWakeWord = () => {
    const next = !wakeWordPreferred;
    setWakeWordPreferred(next);
    try { localStorage.setItem(`wakeWordPreferred:${WAKE_PHRASE}`, String(next)); } catch (e) { /* noop */ }

    if (next && isSystemOn) startWakeWordListening();
    else if (!next) stopWakeWordListening();
  };

  // Auto-resume wake word listening whenever the system powers on, if the driver
  // previously left it enabled — that's what makes it "on all the time" without
  // having to re-toggle it every ignition cycle.
  useEffect(() => {
    if (isSystemOn && wakeWordPreferred) {
      startWakeWordListening();
    } else if (!isSystemOn) {
      stopWakeWordListening();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSystemOn]);

  // --- Ignition button: only gates access to the system. It does NOT decide
  // wake word on its own — that's driven by the persisted wakeWordPreferred
  // effect above, which auto-resumes/stops listening as isSystemOn changes.
  const toggleSystemPower = () => {
    if (isSystemOn) {
      // Powering off: cleanly stop anything that might be running
      if (isLiveActive) stopLiveTalk();
      setIsSystemOn(false);
      setIsBooting(false);
      return;
    }

    // Acquire real GPS coordinates on start — previously nothing sent lat/lng at
    // all, so every location-dependent query (weather, etc.) silently fell back to
    // a random Bangkok point on the backend. If the driver denies permission or the
    // browser doesn't support it, coords stays null and that old fallback still
    // applies — this can only make location accuracy better, never worse.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
          console.log('Got real location:', position.coords.latitude, position.coords.longitude);
        },
        (err) => console.warn('Geolocation unavailable, using backend default:', err.message),
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    }

    setIsBooting(true);
    setTimeout(() => {
      setIsBooting(false);
      setIsSystemOn(true);
    }, 1100);
  };

  const clockLabel = clock.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="page">
      <div className="bezel">
        <button
          type="button"
          onClick={toggleSystemPower}
          className={`power-button ${isSystemOn ? 'on' : ''}`}
          title={isSystemOn ? 'Power off the system' : 'Power on the system'}
        >
          <PowerIcon />
        </button>

        <div className="container">
          {!isSystemOn && (
            <div className="lock-screen">
              {isBooting ? (
                <>
                  <div className="boot-spinner" />
                  <p>Starting system…</p>
                </>
              ) : (
                <>
                  <div className="lock-icon"><PowerIcon /></div>
                  <p>Press the side button to power on</p>
                </>
              )}
            </div>
          )}
          {isSystemOn && (
          <>
          <div className="status-bar">
            <span className="status-item"><span className="status-dot" /> ONLINE</span>
            <span className="status-clock">{clockLabel}</span>
            <span className="status-item"><SignalIcon /> LTE</span>
          </div>

          <div className="dashboard-grid">
            <aside className="sidebar">
              <div className={`voice-orb ${liveStatus === 'listening' ? 'listening' : ''} ${liveStatus === 'speaking' ? 'thinking' : ''}`}>
                <div className="voice-orb-ring" />
                <div className="voice-orb-core"><CarIcon /></div>
              </div>
              <h1>Car Assistant</h1>

              <div className="widgets">
                <div className={`widget-card ${ac.power ? 'active' : ''}`}>
                  <div className="widget-head">
                    <span className="widget-label">Climate</span>
                    <span className={`widget-status-dot ${ac.power ? 'on' : ''}`} />
                  </div>
                  {ac.power ? (
                    <>
                      <div className="widget-temp">{ac.temp}<span className="widget-unit">°C</span></div>
                      <div className="fan-bars">
                        {[1, 2, 3, 4, 5, 6, 7].map(i => (
                          <span key={i} className={`fan-bar ${i <= ac.fan ? 'filled' : ''}`} />
                        ))}
                      </div>
                      <div className="widget-sub"><FanIcon /> Fan {ac.fan}/7</div>
                    </>
                  ) : (
                    <div className="widget-off">AC off</div>
                  )}
                </div>

                <div className="widget-card">
                  <div className="widget-head">
                    <span className="widget-label">Weather</span>
                  </div>
                  {weather?.weather ? (
                    <>
                      <div className="widget-temp">{Math.round(weather.weather.temperature)}<span className="widget-unit">°C</span></div>
                      <div className="widget-sub">
                        {weatherIconFor(weather.weather.icon)}
                        {weather.weather.description}
                        {weather.location?.name ? ` · ${weather.location.name}` : ''}
                      </div>
                    </>
                  ) : (
                    <div className="widget-off">{coords ? 'Loading…' : 'Waiting for location'}</div>
                  )}
                </div>

                <div className="widget-card">
                  <div className="widget-head">
                    <span className="widget-label">Air Quality</span>
                  </div>
                  {airQuality?.air_quality?.main ? (
                    <>
                      <div className="widget-sub-main">{AQI_LABELS[airQuality.air_quality.main.aqi] || 'Unknown'}</div>
                      <div className="widget-sub">
                        <LeafIcon /> PM2.5: {Math.round(airQuality.air_quality.components?.pm2_5 ?? 0)} µg/m³
                      </div>
                    </>
                  ) : (
                    <div className="widget-off">{coords ? 'Loading…' : 'Waiting for location'}</div>
                  )}
                </div>
              </div>

              <div className="sidebar-toolbar">
                <button
                  type="button"
                  onClick={toggleWakeWord}
                  className={`toolbar-button ${wakeWordPreferred ? 'wake-active' : ''}`}
                  title={`Say "${WAKE_PHRASE}" to start a voice command — stays on across power cycles`}
                  disabled={isLiveActive}
                >
                  {wakeWordPreferred ? `"${WAKE_PHRASE}" always on` : 'Wake word off'}
                </button>
              </div>
            </aside>

            <main className="main-panel">
              <div className="voice-status-panel">
                <SparkleIcon />
                <p className="voice-status-text">
                  {liveStatus === 'connecting' ? 'Connecting…'
                    : liveStatus === 'listening' ? 'Listening…'
                    : liveStatus === 'speaking' ? 'Speaking…'
                    : `Say "${WAKE_PHRASE}" or tap Live Talk`}
                </p>
                <p className="voice-status-hint">
                  Ask about the AC, the weather, the owner's manual, nearby dealerships, or anything else
                </p>
              </div>

              <div className="suggestion-chips">
                {['"What\'s the weather like?"', '"Turn on the AC"', '"Nearest dealership?"'].map(s => (
                  <span key={s} className="suggestion-chip">{s}</span>
                ))}
              </div>

              {error && <p className="error-message">{error}</p>}

              <div className="talk-buttons">
                <button
                  type="button"
                  onClick={toggleLiveTalk}
                  className={`mic-button live-button ${isLiveActive ? 'recording' : ''}`}
                  disabled={!isAudioSupported}
                  title={!isAudioSupported ?
                    "Microphone not available - check browser permissions" :
                    "Real-time voice conversation via Gemini Live"}
                >
                  {!isAudioSupported ? <MicOffIcon /> : <MicIcon />}
                  <span>
                    {liveStatus === 'connecting' ? 'Connecting…'
                      : liveStatus === 'listening' ? 'Live — listening'
                      : liveStatus === 'speaking' ? 'Live — speaking'
                      : 'Live Talk'}
                  </span>
                </button>
              </div>
            </main>
          </div>
          </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
