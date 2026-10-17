import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import {
  Lock, Settings, Users, Trophy, Gift, CheckCircle2, XCircle,
  Download, Plus, Trash2, RotateCcw, Sparkles, ArrowRight, Zap,
} from "lucide-react";

// ---------------------------------------------------------------
// Paleta — identidad Carnes Don Gerardo (Grupo Sanmarti)
// ---------------------------------------------------------------
const BG = "#000000";
const SURFACE = "#141414";
const SURFACE_2 = "#1E1E1E";
const BORDER = "#333333";
const TEXT = "#DADADA";
const MUTED = "#8F8F8F";
const GOLD = "#C6BB9E";     // acento de marca (antes "gold" genérico)
const CORAL = "#A6453B";    // errores / urgencia — rojo apagado, en tono con la marca
const GREEN = "#9C8F6B";    // confirmaciones — variante más oscura del acento
const BLUE = "#B7B7B7";     // gris neutro, usado para la etiqueta "modo normal"

const PRIZE_COLORS = ["#C6BB9E", "#8F7E62", "#DADADA", "#4A4A4A", "#E8DFC8", "#A6453B"];
const NONE_COLOR = "#242424";

// Timing del giro
const SPIN_DURATION_MS = 7000; // duración de la animación de la ruleta
const EXTRA_SPINS = 9; // vueltas completas antes de frenar, solo efecto visual
const SETTLE_PAUSE_MS = 3000; // pausa con la ruleta ya frenada, antes de mostrar el premio
const CONFETTI_DURATION_MS = 4200; // el confeti dura un poco más que la pausa, se apaga solo
const CONFETTI_COLORS = ["#C6BB9E", "#E8DFC8", "#DADADA", "#A6453B", "#8F7E62"];

// Logo del cliente (incrustado como base64 para que el artifact sea autocontenido)
const LOGO_SRC = "data:image/png;base64,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";


const uid = () => Math.random().toString(36).slice(2, 10);

// ---------------------------------------------------------------
// Conexión con el backend real (Supabase + Railway). El resultado de cada
// giro ya NO se calcula acá: este archivo solo pide datos y pinta lo que
// el servidor responde.
// ---------------------------------------------------------------
const API_BASE_URL = "https://ruleta-backend-production-facf.up.railway.app";
// Clave compartida por el propio frontend, no es una contraseña de usuario
// (ver README del backend) — solo evita que la API quede abierta a cualquiera.
const OPERATOR_APP_KEY = "5c8b089f18c8319ddeb4b586ba882c2975bc8abd9920b628";

async function apiOperator(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-app-key": OPERATOR_APP_KEY,
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "No se pudo conectar con el servidor.");
  return data;
}

async function apiAdmin(path, token, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "No se pudo conectar con el servidor.");
  return data;
}

// SOLO para pintar la ruleta antes de girar. El resultado real siempre lo
// decide el backend en /api/spin — si este preview no coincide exactamente
// con lo que el servidor devuelva, la rueda se redibuja con la lista real
// justo antes de animar (ver spin()).
function previewOutcomes(prizes, expectedPeople, normalCount, mode) {
  const withStock = prizes.filter((p) => p.stock > 0);
  if (mode === "remate") {
    return withStock.map((p) => ({ type: "prize", id: p.id, name: p.name, color: p.color }));
  }
  const peopleRemaining = Math.max(expectedPeople - normalCount, 1);
  const sumRaw = withStock.reduce((a, p) => a + p.stock / peopleRemaining, 0);
  const outcomes = withStock.map((p) => ({ type: "prize", id: p.id, name: p.name, color: p.color }));
  if (sumRaw < 1) {
    outcomes.push({ type: "none", id: "none", name: "Seguí participando", color: NONE_COLOR });
  }
  return outcomes;
}

// Reparte los mismos resultados en divisiones visuales de igual tamaño.
function toEqualSlots(outcomes) {
  const n = outcomes.length;
  if (n === 0) return [];
  const width = 360 / n;
  return outcomes.map((o, i) => ({ ...o, start: i * width, end: (i + 1) * width }));
}

function polarPoint(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx, cy, r, startAngle, endAngle) {
  const start = polarPoint(cx, cy, r, startAngle);
  const end = polarPoint(cx, cy, r, endAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
}

// ---------------------------------------------------------------
// Rueda (SVG) — la rotación y el "tick" del puntero se controlan de forma
// imperativa desde afuera (ver runSpin), por eso expone un ref con
// setRotation() y tick().
// ---------------------------------------------------------------
const Wheel = forwardRef(function Wheel({ slots, size = 300 }, ref) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 6;
  const wheelElRef = useRef(null);
  const pointerElRef = useRef(null);

  useImperativeHandle(ref, () => ({
    setRotation(deg) {
      if (wheelElRef.current) wheelElRef.current.style.transform = `rotate(${deg}deg)`;
    },
    tick() {
      const el = pointerElRef.current;
      if (!el) return;
      el.style.transition = "none";
      el.style.transform = "translateX(-50%) rotate(-22deg)";
      // fuerza reflow para que el próximo cambio sí anime
      void el.offsetWidth;
      el.style.transition = "transform 170ms cubic-bezier(0.34, 1.56, 0.64, 1)";
      el.style.transform = "translateX(-50%) rotate(0deg)";
    },
  }));

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      {/* puntero: se "flexiona" cada vez que pasa un separador entre premios */}
      <div
        ref={pointerElRef}
        style={{
          position: "absolute", top: -4, left: "50%", transform: "translateX(-50%)",
          width: 0, height: 0, zIndex: 5, transformOrigin: "50% 0%",
          borderLeft: "12px solid transparent", borderRight: "12px solid transparent",
          borderTop: `20px solid ${GOLD}`, filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.4))",
        }}
      />
      <svg
        ref={wheelElRef}
        viewBox={`0 0 ${size} ${size}`}
        width={size} height={size}
        style={{ transform: "rotate(0deg)", display: "block" }}
      >
        <circle cx={cx} cy={cy} r={r + 4} fill={SURFACE_2} stroke={BORDER} strokeWidth="2" />
        {slots.map((s) => {
          const mid = (s.start + s.end) / 2;
          const labelR = r * 0.62;
          const midRad = ((mid - 90) * Math.PI) / 180;
          const lx = cx + labelR * Math.cos(midRad);
          const ly = cy + labelR * Math.sin(midRad);
          return (
            <g key={s.id}>
              <path d={arcPath(cx, cy, r, s.start, s.end)} fill={s.color} stroke={BG} strokeWidth="2" />
              <text
                x={lx} y={ly}
                fill={s.type === "none" ? MUTED : "#0A0A0A"}
                fontSize={Math.round(size * 0.045)}
                fontWeight="400"
                letterSpacing="0.3"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                {(s.name.length > 14 ? s.name.slice(0, 13) + "…" : s.name).toUpperCase()}
              </text>
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r={r * 0.16} fill={SURFACE} stroke={BORDER} strokeWidth="2" />
      </svg>
    </div>
  );
});

// ---------------------------------------------------------------
// Confeti — se dispara una sola vez, en el instante en que la ruleta
// frena sobre un premio. Cada tira genera su propio recorrido de caída.
// ---------------------------------------------------------------
function Confetti({ pieceCount = 80 }) {
  const pieces = useRef(
    Array.from({ length: pieceCount }).map(() => ({
      id: uid(),
      left: Math.random() * 100,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      w: 6 + Math.random() * 5,
      h: 8 + Math.random() * 8,
      duration: 2.6 + Math.random() * 1.8,
      delay: Math.random() * 0.4,
      drift: (Math.random() - 0.5) * 220,
      spin: 360 + Math.random() * 540,
      round: Math.random() > 0.5,
    }))
  ).current;

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 80 }}>
      {pieces.map((p) => (
        <span
          key={p.id}
          style={{
            position: "absolute", top: -16, left: `${p.left}%`,
            width: p.w, height: p.h, background: p.color,
            borderRadius: p.round ? "50%" : 2,
            animation: `confettiFall ${p.duration}s cubic-bezier(0.35,0,0.65,1) forwards`,
            animationDelay: `${p.delay}s`,
            "--drift": `${p.drift}px`,
            "--spin": `${p.spin}deg`,
          }}
        />
      ))}
    </div>
  );
}


function ConfirmDialog({ title, message, confirmLabel, onCancel, onConfirm }) {
  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 90, padding: 16,
      }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16,
          padding: 24, maxWidth: 360, width: "100%", textAlign: "center",
        }}
      >
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", textTransform: "uppercase", letterSpacing: 0.5, fontSize: 20, marginBottom: 8 }}>
          {title}
        </div>
        <div style={{ fontSize: 13, color: MUTED, marginBottom: 20, lineHeight: 1.5 }}>{message}</div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            style={{ flex: 1, background: "transparent", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "12px 16px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            style={{ flex: 1, background: CORAL, color: "#0A0A0A", border: "none", borderRadius: 12, padding: "12px 16px", fontWeight: 800, fontSize: 14, cursor: "pointer" }}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function TicketCard({ children, accent }) {
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 380, zoom: Math.min(1.8, Math.max(1, (window.innerWidth - 40) / 380)) }}>
      <div
        style={{
          background: SURFACE_2, border: `2px dashed ${accent}`, borderRadius: 16,
          padding: "28px 24px", textAlign: "center", position: "relative", overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", left: -14, top: "50%", transform: "translateY(-50%)", width: 24, height: 24, borderRadius: "50%", background: BG }} />
        <div style={{ position: "absolute", right: -14, top: "50%", transform: "translateY(-50%)", width: 24, height: 24, borderRadius: "50%", background: BG }} />
        {children}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------
// App principal
// ---------------------------------------------------------------
export default function RuletaPremios() {
  const [tab, setTab] = useState("operador"); // operador | config | resultados
  const [adminToken, setAdminToken] = useState(null);
  const [pwdInput, setPwdInput] = useState("");
  const [pwdError, setPwdError] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);

  const [prizes, setPrizes] = useState([]);
  const [expectedPeople, setExpectedPeople] = useState(1);
  const [normalCount, setNormalCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [stateLoading, setStateLoading] = useState(true);
  const [mode, setMode] = useState("normal"); // normal | remate — vive solo en esta sesión de la tablet
  const [participants, setParticipants] = useState([]);
  const [participantsLoading, setParticipantsLoading] = useState(false);

  const [flow, setFlow] = useState("idle"); // idle | form | consent | spin | result | birthdate
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [birthdate, setBirthdate] = useState("");
  const [wheelSlots, setWheelSlots] = useState([]);

  const [spinning, setSpinning] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [apiError, setApiError] = useState("");

  const wheelRef = useRef(null);
  const winnerRef = useRef(null);
  const rafRef = useRef(null);
  const settleTimeoutRef = useRef(null);
  const confettiTimeoutRef = useRef(null);

  const totalStockRemaining = prizes.reduce((a, p) => a + p.stock, 0);

  // limpieza al desmontar, por si el componente se va con una animación en curso
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (settleTimeoutRef.current) window.clearTimeout(settleTimeoutRef.current);
      if (confettiTimeoutRef.current) window.clearTimeout(confettiTimeoutRef.current);
    };
  }, []);

  // apagado automático del modo remate al agotarse el stock
  useEffect(() => {
    if (mode === "remate" && totalStockRemaining === 0) setMode("normal");
  }, [totalStockRemaining, mode]);

  // primera carga: trae stock y contadores reales apenas abre la tablet
  useEffect(() => {
    refreshState().finally(() => setStateLoading(false));
  }, []);

  const refreshState = async () => {
    try {
      const data = await apiOperator("/api/state");
      setPrizes(data.prizes);
      setExpectedPeople(data.expectedPeople);
      setNormalCount(data.normalCount);
      setTotalCount(data.totalCount);
      return data;
    } catch (e) {
      setApiError(e.message);
      throw e;
    }
  };

  // ---------- Flujo operador ----------
  const startNewParticipant = () => {
    setFormData({ name: "", email: "" });
    setFormError("");
    setConsentChecked(false);
    setFlow("form");
  };

  const submitForm = async () => {
    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    if (!name || !email) { setFormError("Completá nombre y correo."); return; }
    if (!/^\S+@\S+\.\S+$/.test(email)) { setFormError("El correo no parece válido."); return; }
    setFormError("");
    setFormLoading(true);
    try {
      const res = await apiOperator("/api/validate-email", {
        method: "POST",
        body: JSON.stringify({ email, mode }),
      });
      if (!res.valid) {
        setFormError("Ese correo ya participó en este evento.");
        return;
      }
      setFormData({ name, email });
      setFlow("consent");
    } catch (e) {
      setFormError(e.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handOverTablet = async () => {
    if (!consentChecked) return;
    setApiError("");
    try {
      const data = await refreshState();
      const preview = previewOutcomes(data.prizes, data.expectedPeople, data.normalCount, mode);
      setWheelSlots(toEqualSlots(preview));
      setFlow("spin");
    } catch {
      // si falla el refresh, igual dejamos avanzar con lo último que había
      setWheelSlots(toEqualSlots(previewOutcomes(prizes, expectedPeople, normalCount, mode)));
      setFlow("spin");
    }
  };

  const spin = async () => {
    if (spinning || wheelSlots.length === 0 || !wheelRef.current) return;
    setSpinning(true);
    setApiError("");

    let data;
    try {
      data = await apiOperator("/api/spin", {
        method: "POST",
        body: JSON.stringify({ name: formData.name, email: formData.email, mode }),
      });
    } catch (e) {
      setSpinning(false);
      setApiError(e.message);
      return;
    }

    // acá llega la lista REAL que usó el servidor para decidir — se redibuja
    // la rueda con esto, no con el preview que se armó antes de girar
    const newSlots = toEqualSlots(data.outcomes);
    setWheelSlots(newSlots);
    const winnerSlot = newSlots.find((s) => s.id === data.winner.id) || newSlots[newSlots.length - 1];
    winnerRef.current = { ...data.winner, participantId: data.participantId };

    const segmentWidth = 360 / newSlots.length;
    const margin = segmentWidth * 0.15;
    const landingSpot = winnerSlot.start + margin + Math.random() * (segmentWidth - margin * 2);
    const totalRotation = 360 * EXTRA_SPINS + (360 - landingSpot);

    runSpinAnimation(totalRotation, segmentWidth);
  };

  // Animación manual con easing cuadrático (frenado constante, como la fricción
  // real de una ruleta) para poder "enganchar" el tick del puntero en cada
  // separador que cruza, en vez de depender de una transición CSS ciega.
  const runSpinAnimation = (totalRotation, segmentWidth) => {
    const startTime = performance.now();
    let lastBoundary = 0;

    const frame = (now) => {
      const t = Math.min((now - startTime) / SPIN_DURATION_MS, 1);
      const eased = 1 - (1 - t) * (1 - t); // ease-out cuadrático = desaceleración constante
      const current = totalRotation * eased;

      wheelRef.current?.setRotation(current);

      const boundary = Math.floor(current / segmentWidth);
      if (boundary > lastBoundary) {
        lastBoundary = boundary;
        wheelRef.current?.tick();
      }

      if (t < 1) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        // la ruleta acaba de frenar: si tocó un premio, arranca el confeti ahora mismo
        if (winnerRef.current?.type === "prize") {
          setShowConfetti(true);
          confettiTimeoutRef.current = window.setTimeout(() => setShowConfetti(false), CONFETTI_DURATION_MS);
        }
        // se deja 3s a la vista antes de mostrar la pantalla del premio
        settleTimeoutRef.current = window.setTimeout(() => {
          setSpinning(false);
          resolveSpin(winnerRef.current);
        }, SETTLE_PAUSE_MS);
      }
    };

    rafRef.current = requestAnimationFrame(frame);
  };

  const resolveSpin = (winner) => {
    setLastResult({ type: winner.type, name: winner.name });
    setFlow("result");
  };

  const continueAfterResult = () => {
    if (lastResult?.type === "prize") {
      setBirthdate("");
      backToIdle();
    } else {
      backToIdle();
    }
  };

  const confirmBirthdateAndDeliver = async () => {
    try {
      await apiOperator("/api/redeem", {
        method: "POST",
        body: JSON.stringify({ participantId: winnerRef.current?.participantId, birthdate }),
      });
    } catch (e) {
      setApiError(e.message);
    }
    backToIdle();
  };

  const backToIdle = () => {
    setFlow("idle");
    setFormData({ name: "", email: "" });
    setConsentChecked(false);
    setLastResult(null);
    setBirthdate("");
    refreshState();
  };

  const activateRemate = () => { if (totalStockRemaining > 0) setMode("remate"); };

  // ---------- Panel de configuración (protegido con login real) ----------
  const loadAdminEvent = async (token) => {
    const data = await apiAdmin("/api/admin/event", token);
    setExpectedPeople(data.event.expectedPeople);
    setPrizes(data.prizes);
  };

  const loadParticipants = async (token) => {
    setParticipantsLoading(true);
    try {
      const data = await apiAdmin("/api/admin/participants", token);
      setParticipants(data.participants);
    } catch (e) {
      setApiError(e.message);
    } finally {
      setParticipantsLoading(false);
    }
  };

  const handleAdminLogin = async () => {
    setPwdError("");
    setAdminLoading(true);
    try {
      const data = await apiAdmin("/api/admin/login", null, {
        method: "POST",
        body: JSON.stringify({ password: pwdInput }),
      });
      setAdminToken(data.token);
      setPwdInput("");
      await Promise.all([loadAdminEvent(data.token), loadParticipants(data.token)]);
    } catch (e) {
      setPwdError(e.message);
    } finally {
      setAdminLoading(false);
    }
  };

  const addPrize = async () => {
    if (!adminToken) return;
    try {
      const data = await apiAdmin("/api/admin/prizes", adminToken, {
        method: "POST",
        body: JSON.stringify({ name: "Nuevo premio", stock: 1 }),
      });
      setPrizes((prev) => [...prev, data.prize]);
    } catch (e) {
      setApiError(e.message);
    }
  };

  const updatePrizeLocal = (id, patch) => {
    setPrizes((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  const persistPrize = async (id) => {
    if (!adminToken) return;
    const p = prizes.find((pr) => pr.id === id);
    if (!p) return;
    try {
      await apiAdmin(`/api/admin/prizes/${id}`, adminToken, {
        method: "PUT",
        body: JSON.stringify({ name: p.name, stock: p.stock }),
      });
    } catch (e) {
      setApiError(e.message);
    }
  };

  const removePrize = async (id) => {
    if (!adminToken) return;
    try {
      await apiAdmin(`/api/admin/prizes/${id}`, adminToken, { method: "DELETE" });
      setPrizes((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      setApiError(e.message);
    }
  };

  const persistExpectedPeople = async () => {
    if (!adminToken) return;
    try {
      await apiAdmin("/api/admin/event", adminToken, {
        method: "PUT",
        body: JSON.stringify({ expectedPeople }),
      });
    } catch (e) {
      setApiError(e.message);
    }
  };

  const resetEvent = async () => {
    if (!adminToken) return;
    try {
      await apiAdmin("/api/admin/reset", adminToken, { method: "POST" });
      await Promise.all([loadAdminEvent(adminToken), loadParticipants(adminToken)]);
      setMode("normal");
      backToIdle();
    } catch (e) {
      setApiError(e.message);
    }
  };

  const exportCSV = () => {
    const headers = ["Nombre", "Correo", "Fecha y hora", "Premio", "Fecha de nacimiento", "Modo"];
    const rows = participants.map((p) => [
      p.name,
      p.email,
      new Date(p.played_at).toLocaleString("es-AR"),
      p.prize_name || "Sin premio",
      p.birthdate || "",
      p.mode === "remate" ? "Remate" : "Normal",
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "participantes_ruleta.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  // ---------- estilos compartidos ----------
  const inputStyle = {
    width: "100%", background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10,
    padding: "10px 12px", color: TEXT, fontSize: 14, outline: "none",
  };
  const labelStyle = { fontSize: 12, color: MUTED, marginBottom: 6, display: "block", fontWeight: 600, letterSpacing: 0.3 };
  const primaryBtn = (bg = GOLD) => ({
    background: bg, color: "#0A0A0A", border: "none", borderRadius: 12,
    padding: "14px 22px", fontWeight: 800, fontSize: 15, cursor: "pointer",
    display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "center",
  });
  const ghostBtn = {
    background: "transparent", color: MUTED, border: `1px solid ${BORDER}`, borderRadius: 12,
    padding: "10px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer",
    display: "inline-flex", alignItems: "center", gap: 6, justifyContent: "center",
  };

  const isParticipantFacing = ["consent", "spin", "result", "birthdate"].includes(flow);
  const needsAdminGate = (tab === "config" || tab === "resultados") && !adminToken;

  return (
    <div style={{ background: BG, minHeight: "100%", fontFamily: "Inter, sans-serif", color: TEXT }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; font-family: 'Inter', sans-serif; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1); }
        ::placeholder { color: #6870A0; }
        @keyframes confettiFall {
          0% { transform: translateY(-10px) translateX(0) rotate(0deg); opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(110vh) translateX(var(--drift)) rotate(var(--spin)); opacity: 0; }
        }
      `}</style>

      {showConfetti && <Confetti />}

      {confirmingReset && (
        <ConfirmDialog
          title="¿Reiniciar el evento?"
          message="Se van a borrar todas las participaciones registradas en la base de datos y el stock vuelve a su valor inicial. Esta acción no se puede deshacer."
          confirmLabel="Sí, reiniciar"
          onCancel={() => setConfirmingReset(false)}
          onConfirm={() => { resetEvent(); setConfirmingReset(false); }}
        />
      )}

      <div style={{ maxWidth: 880, margin: "0 auto", padding: "20px 16px 60px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <img src={LOGO_SRC} alt="Carnes Don Gerardo" style={{ height: 42, width: "auto", display: "block" }} />
            <div style={{ width: 1, height: 34, background: BORDER }} />
            <div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", textTransform: "uppercase", letterSpacing: 1, fontWeight: 400, fontSize: 24, color: TEXT, lineHeight: 1 }}>
                Ruleta de Premios
              </div>
              <div style={{ fontSize: 11, color: MUTED, marginTop: 3 }}>Conectada a la base de datos en vivo</div>
            </div>
          </div>
          {mode === "remate" && (
            <div style={{ background: "rgba(166,69,59,0.15)", border: `1px solid ${CORAL}`, color: CORAL, borderRadius: 999, padding: "6px 14px", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", gap: 6 }}>
              <Zap size={14} /> MODO REMATE ACTIVO
            </div>
          )}
        </div>

        {apiError && (
          <div style={{ background: "rgba(166,69,59,0.12)", border: `1px solid ${CORAL}`, color: CORAL, borderRadius: 12, padding: "10px 14px", fontSize: 13, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <span>{apiError}</span>
            <button onClick={() => setApiError("")} style={{ background: "transparent", border: "none", color: CORAL, cursor: "pointer", fontSize: 16, lineHeight: 1 }}>×</button>
          </div>
        )}

        {/* Nav (oculta cuando la tablet está "en manos del participante") */}
        {!isParticipantFacing && (
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {[
              { id: "operador", label: "Operador", icon: Users },
              { id: "config", label: "Configuración", icon: Settings },
              { id: "resultados", label: "Resultados", icon: Trophy },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                style={{
                  ...ghostBtn,
                  background: tab === id ? SURFACE_2 : "transparent",
                  color: tab === id ? TEXT : MUTED,
                  borderColor: tab === id ? GOLD : BORDER,
                }}
              >
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>
        )}

        {isParticipantFacing && (
          <div style={{ marginBottom: 20, fontSize: 12, color: MUTED, textAlign: "center" }}>
            Tablet en manos del participante
          </div>
        )}

        {/* ---------------- TAB OPERADOR ---------------- */}
        {tab === "operador" && (
          <div>
            {flow === "idle" && (
              <div style={{ display: "grid", gap: 16 }}>
                {stateLoading ? (
                  <div style={{ color: MUTED, fontSize: 13, textAlign: "center", padding: 20 }}>Cargando datos del evento…</div>
                ) : (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: 10 }}>
                      <StatCard label="Personas jugadas" value={`${normalCount} / ${expectedPeople}`} icon={Users} />
                      <StatCard label="Premios con stock" value={prizes.filter((p) => p.stock > 0).length} icon={Gift} />
                      <StatCard label="Stock total restante" value={totalStockRemaining} icon={Trophy} />
                    </div>

                    <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 18, padding: 32, textAlign: "center" }}>
                      <Sparkles size={28} color={GOLD} style={{ marginBottom: 10 }} />
                      <div style={{ fontFamily: "'Bebas Neue', sans-serif", textTransform: "uppercase", letterSpacing: 0.6, fontSize: 24, fontWeight: 400, marginBottom: 6 }}>
                        Pantalla de bienvenida
                      </div>
                      <div style={{ color: MUTED, fontSize: 13, marginBottom: 20 }}>
                        {prizes.length === 0
                          ? "Todavía no hay premios cargados — configurá al menos uno antes de arrancar."
                          : "Cargá los datos del próximo participante para empezar."}
                      </div>
                      <button style={{ ...primaryBtn(), opacity: prizes.length === 0 ? 0.5 : 1 }} disabled={prizes.length === 0} onClick={startNewParticipant}>
                        Cargar participante <ArrowRight size={16} />
                      </button>
                    </div>

                    <div style={{ display: "flex", justifyContent: "center" }}>
                      {mode === "normal" ? (
                        <button
                          style={{ ...ghostBtn, opacity: totalStockRemaining === 0 ? 0.4 : 1 }}
                          disabled={totalStockRemaining === 0}
                          onClick={activateRemate}
                          title={totalStockRemaining === 0 ? "No queda stock para rematar" : "Liquida el stock sobrante garantizando premio en cada giro"}
                        >
                          <Zap size={14} /> Activar Modo Remate
                        </button>
                      ) : (
                        <div style={{ fontSize: 12, color: MUTED }}>Se desactiva solo al agotarse el stock.</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {flow === "form" && (
              <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 18, padding: 28, maxWidth: 420, margin: "0 auto" }}>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Datos del participante</div>
                <label style={labelStyle}>Nombre</label>
                <input style={{ ...inputStyle, marginBottom: 14 }} value={formData.name}
                  onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))} placeholder="Nombre y apellido" />
                <label style={labelStyle}>Correo electrónico</label>
                <input style={{ ...inputStyle, marginBottom: 14 }} value={formData.email}
                  onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))} placeholder="nombre@correo.com" />
                {formError && (
                  <div style={{ color: CORAL, fontSize: 12, marginBottom: 12, display: "flex", gap: 6, alignItems: "center" }}>
                    <XCircle size={14} /> {formError}
                  </div>
                )}
                <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                  <button style={ghostBtn} onClick={backToIdle}>Cancelar</button>
                  <button style={{ ...primaryBtn(), opacity: formLoading ? 0.6 : 1 }} disabled={formLoading} onClick={submitForm}>
                    {formLoading ? "Verificando…" : "Continuar"} <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {flow === "consent" && (
              <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 18, padding: 28, maxWidth: 420, margin: "0 auto", textAlign: "center" }}>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>¡Hola, {formData.name.split(" ")[0]}!</div>
                <div style={{ color: MUTED, fontSize: 13, marginBottom: 20 }}>Antes de girar, aceptá lo siguiente:</div>
                <label style={{ display: "flex", gap: 10, alignItems: "flex-start", textAlign: "left", background: SURFACE_2, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 14, marginBottom: 18, cursor: "pointer" }}>
                  <input type="checkbox" checked={consentChecked} onChange={(e) => setConsentChecked(e.target.checked)} style={{ marginTop: 2 }} />
                  <span style={{ fontSize: 13, color: TEXT }}>Acepto que mis datos se usen para contactarme con novedades y promociones.</span>
                </label>
                <button style={{ ...primaryBtn(GREEN), width: "100%", opacity: consentChecked ? 1 : 0.5 }} disabled={!consentChecked} onClick={handOverTablet}>
                  Girar la ruleta <ArrowRight size={16} />
                </button>
              </div>
            )}

            {flow === "spin" && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22, padding: "10px 0 20px" }}>
                <div style={{ fontSize: 13, color: MUTED }}>{formData.name}, es tu turno</div>
                <Wheel ref={wheelRef} slots={wheelSlots} size={Math.min(window.innerWidth - 40, window.innerHeight * 0.6, 700)} />
                <button style={{ ...primaryBtn(GOLD), opacity: spinning ? 0.6 : 1, minWidth: 180 }} disabled={spinning} onClick={spin}>
                  {spinning ? "Girando…" : "GIRAR"}
                </button>
              </div>
            )}

            {flow === "result" && lastResult && (
              <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
                <TicketCard accent={lastResult.type === "prize" ? GOLD : BORDER}>
                  {lastResult.type === "prize" ? (
                    <>
                      <Trophy size={30} color={GOLD} style={{ marginBottom: 10 }} />
                      <div style={{ fontSize: 12, color: MUTED, marginBottom: 4, letterSpacing: 1 }}>GANASTE</div>
                      <div style={{ fontFamily: "'Bebas Neue', sans-serif", textTransform: "uppercase", letterSpacing: 0.6, fontSize: 26, fontWeight: 400, marginBottom: 16 }}>{lastResult.name}</div>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={30} color={MUTED} style={{ marginBottom: 10 }} />
                      <div style={{ fontSize: 12, color: MUTED, marginBottom: 4, letterSpacing: 1 }}>ESTA VEZ NO</div>
                      <div style={{ fontFamily: "'Bebas Neue', sans-serif", textTransform: "uppercase", letterSpacing: 0.6, fontSize: 21, fontWeight: 400, marginBottom: 16 }}>¡Gracias por participar!</div>
                    </>
                  )}
                  <button style={{ ...primaryBtn(lastResult.type === "prize" ? GOLD : SURFACE_2), color: lastResult.type === "prize" ? "#0A0A0A" : TEXT, width: "100%" }} onClick={continueAfterResult}>
                    {lastResult.type === "prize" ? "Continuar" : "Finalizar"} <ArrowRight size={16} />
                  </button>
                </TicketCard>
              </div>
            )}

            {flow === "birthdate" && (
              <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 18, padding: 28, maxWidth: 420, margin: "0 auto" }}>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Un último dato</div>
                <div style={{ color: MUTED, fontSize: 13, marginBottom: 16 }}>Para retirar tu premio, completá tu fecha de nacimiento.</div>
                <label style={labelStyle}>Fecha de nacimiento</label>
                <input type="date" style={{ ...inputStyle, marginBottom: 18 }} value={birthdate} onChange={(e) => setBirthdate(e.target.value)} />
                <button style={{ ...primaryBtn(GREEN), width: "100%", opacity: birthdate ? 1 : 0.5 }} disabled={!birthdate} onClick={confirmBirthdateAndDeliver}>
                  Confirmar entrega del premio <CheckCircle2 size={16} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ---------------- TAB CONFIG / RESULTADOS: login compartido ---------------- */}
        {needsAdminGate ? (
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 18, padding: 28, maxWidth: 360, margin: "0 auto", textAlign: "center" }}>
            <Lock size={24} color={MUTED} style={{ marginBottom: 10 }} />
            <div style={{ fontWeight: 700, marginBottom: 4 }}>Acceso protegido</div>
            <div style={{ fontSize: 12, color: MUTED, marginBottom: 16 }}>Ingresá la contraseña del panel de administración.</div>
            <input
              type="password" style={{ ...inputStyle, marginBottom: 10, textAlign: "center" }}
              value={pwdInput} onChange={(e) => setPwdInput(e.target.value)} placeholder="Contraseña"
              onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
            />
            {pwdError && <div style={{ color: CORAL, fontSize: 12, marginBottom: 10 }}>{pwdError}</div>}
            <button style={{ ...primaryBtn(), width: "100%", opacity: adminLoading ? 0.6 : 1 }} disabled={adminLoading} onClick={handleAdminLogin}>
              {adminLoading ? "Entrando…" : "Desbloquear"}
            </button>
          </div>
        ) : (
          <>
            {/* ---------------- TAB CONFIG ---------------- */}
            {tab === "config" && (
              <div style={{ display: "grid", gap: 20 }}>
                <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 18, padding: 22 }}>
                  <label style={labelStyle}>Personas esperadas en el evento</label>
                  <input
                    type="number" min="1" style={{ ...inputStyle, maxWidth: 160 }}
                    value={expectedPeople}
                    onChange={(e) => setExpectedPeople(Math.max(1, Number(e.target.value) || 1))}
                    onBlur={persistExpectedPeople}
                  />
                  <div style={{ fontSize: 12, color: MUTED, marginTop: 8 }}>
                    Base para calcular la probabilidad dinámica de cada premio.
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div style={{ fontWeight: 700 }}>Premios</div>
                    <button style={ghostBtn} onClick={addPrize}><Plus size={14} /> Agregar premio</button>
                  </div>
                  <div style={{ display: "grid", gap: 10 }}>
                    {prizes.map((p) => (
                      <div key={p.id} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 14, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                        <div style={{ width: 14, height: 14, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
                        <input
                          style={{ ...inputStyle, flex: 2, minWidth: 140 }}
                          value={p.name}
                          onChange={(e) => updatePrizeLocal(p.id, { name: e.target.value })}
                          onBlur={() => persistPrize(p.id)}
                        />
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 11, color: MUTED }}>Stock</span>
                          <input
                            type="number" min="0" style={{ ...inputStyle, width: 76 }}
                            value={p.stock}
                            onChange={(e) => updatePrizeLocal(p.id, { stock: Math.max(0, Number(e.target.value) || 0) })}
                            onBlur={() => persistPrize(p.id)}
                          />
                        </div>
                        <button style={{ ...ghostBtn, borderColor: "transparent", color: CORAL }} onClick={() => removePrize(p.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    {prizes.length === 0 && <div style={{ color: MUTED, fontSize: 13 }}>No hay premios cargados todavía.</div>}
                  </div>
                  <div style={{ fontSize: 12, color: MUTED, marginTop: 10 }}>
                    La imagen de cada premio se define en la etapa de diseño; por ahora se identifica con un color.
                  </div>
                </div>
              </div>
            )}

            {/* ---------------- TAB RESULTADOS ---------------- */}
            {tab === "resultados" && (
              <div style={{ display: "grid", gap: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                  <div style={{ fontWeight: 700 }}>
                    {participantsLoading ? "Cargando…" : `${participants.length} participaciones registradas`}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={ghostBtn} onClick={() => setConfirmingReset(true)}><RotateCcw size={14} /> Reiniciar evento</button>
                    <button style={primaryBtn()} onClick={exportCSV} disabled={participants.length === 0}><Download size={16} /> Exportar CSV</button>
                  </div>
                </div>

                <div style={{ overflowX: "auto", border: `1px solid ${BORDER}`, borderRadius: 14 }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: SURFACE_2, textAlign: "left" }}>
                        {["Nombre", "Correo", "Fecha y hora", "Premio", "Fecha de nac.", "Modo"].map((h) => (
                          <th key={h} style={{ padding: "10px 12px", color: MUTED, fontWeight: 700, fontSize: 11, letterSpacing: 0.4, whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {participants.map((p) => (
                        <tr key={p.id} style={{ borderTop: `1px solid ${BORDER}` }}>
                          <td style={{ padding: "10px 12px" }}>{p.name}</td>
                          <td style={{ padding: "10px 12px", color: MUTED }}>{p.email}</td>
                          <td style={{ padding: "10px 12px", color: MUTED, whiteSpace: "nowrap" }}>{new Date(p.played_at).toLocaleString("es-AR")}</td>
                          <td style={{ padding: "10px 12px" }}>
                            {(!p.prize_name || p.prize_name === "Sin premio") ? <span style={{ color: MUTED }}>Sin premio</span> : <span style={{ color: GOLD, fontWeight: 700 }}>{p.prize_name}</span>}
                          </td>
                          <td style={{ padding: "10px 12px", color: MUTED }}>{p.birthdate || "—"}</td>
                          <td style={{ padding: "10px 12px" }}>
                            <span style={{ fontSize: 11, fontWeight: 800, color: p.mode === "remate" ? CORAL : BLUE }}>
                              {p.mode === "remate" ? "REMATE" : "NORMAL"}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {participants.length === 0 && !participantsLoading && (
                        <tr><td colSpan={6} style={{ padding: 20, textAlign: "center", color: MUTED }}>Todavía no hay participaciones.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 34, height: 34, borderRadius: 10, background: SURFACE_2, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={16} color={GOLD} />
      </div>
      <div>
        <div style={{ fontSize: 11, color: MUTED }}>{label}</div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 0.4, fontSize: 20, fontWeight: 400 }}>{value}</div>
      </div>
    </div>
  );
}
