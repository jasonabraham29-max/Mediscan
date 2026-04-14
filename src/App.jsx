import { useState, useEffect } from "react";

// ─── Translations ─────────────────────────────────────────────────────────────
const T = {
  fr: {
    tagline: "Votre santé en 3 clics",
    subtitle: "Décrivez vos symptômes. Sachez quoi faire en 30 secondes.",
    placeholder: "Ex: j'ai mal à la tête depuis ce matin avec de la fièvre...",
    orChoose: "ou choisissez vos symptômes",
    age: "Votre âge",
    agePlaceholder: "Ex: 32",
    analyze: "Analyser maintenant",
    analyzing: "Analyse en cours...",
    back: "Nouvelle analyse",
    emergency: "APPELEZ LE 15",
    emergencyDesc: "Situation potentiellement grave. Appelez immédiatement.",
    doctor: "CONSULTEZ UN MÉDECIN",
    doctorDesc: "Consultation recommandée dans les 24h.",
    home: "RESTEZ CHEZ VOUS",
    homeDesc: "Vous pouvez vous soigner à domicile.",
    medications: "💊 Médicaments sans ordonnance conseillés",
    actions: "✅ Actions recommandées",
    warning: "⚠️ Surveiller si",
    disclaimer: "⚕️ Ces conseils ne remplacent pas un avis médical. Consultez toujours un médecin pour un diagnostic.",
    call15: "Appeler le 15",
    findDoctor: "Trouver un médecin",
    findPharmacy: "Pharmacie proche",
    symptoms: ["Fièvre", "Maux de tête", "Toux", "Essoufflement", "Douleur thoracique", "Nausées", "Vomissements", "Diarrhée", "Fatigue", "Vertiges", "Mal de gorge", "Éruption cutanée", "Douleurs musculaires", "Maux de dos", "Palpitations"],
    step1: "Décrivez",
    step2: "Confirmez",
    step3: "Résultat",
    next: "Continuer →",
    yourAge: "Quel est votre âge ?",
    ageDesc: "Pour personnaliser l'analyse",
    selected: "sélectionné(s)",
    lang: "Langue",
  },
  en: {
    tagline: "Your health in 3 clicks",
    subtitle: "Describe your symptoms. Know what to do in 30 seconds.",
    placeholder: "E.g: I've had a headache since this morning with fever...",
    orChoose: "or choose your symptoms",
    age: "Your age",
    agePlaceholder: "E.g: 32",
    analyze: "Analyze now",
    analyzing: "Analyzing...",
    back: "New analysis",
    emergency: "CALL 15 NOW",
    emergencyDesc: "Potentially serious situation. Call immediately.",
    doctor: "SEE A DOCTOR",
    doctorDesc: "Consultation recommended within 24h.",
    home: "STAY HOME",
    homeDesc: "You can treat yourself at home.",
    medications: "💊 Over-the-counter medications advised",
    actions: "✅ Recommended actions",
    warning: "⚠️ Watch out if",
    disclaimer: "⚕️ This advice does not replace medical advice. Always consult a doctor for a diagnosis.",
    call15: "Call 15",
    findDoctor: "Find a doctor",
    findPharmacy: "Nearby pharmacy",
    symptoms: ["Fever", "Headache", "Cough", "Shortness of breath", "Chest pain", "Nausea", "Vomiting", "Diarrhea", "Fatigue", "Dizziness", "Sore throat", "Rash", "Muscle pain", "Back pain", "Palpitations"],
    step1: "Describe",
    step2: "Confirm",
    step3: "Result",
    next: "Continue →",
    yourAge: "What is your age?",
    ageDesc: "To personalize the analysis",
    selected: "selected",
    lang: "Language",
  },
  es: {
    tagline: "Tu salud en 3 clics",
    subtitle: "Describe tus síntomas. Sabe qué hacer en 30 segundos.",
    placeholder: "Ej: tengo dolor de cabeza desde esta mañana con fiebre...",
    orChoose: "o elige tus síntomas",
    age: "Tu edad",
    agePlaceholder: "Ej: 32",
    analyze: "Analizar ahora",
    analyzing: "Analizando...",
    back: "Nuevo análisis",
    emergency: "LLAMA AL 112",
    emergencyDesc: "Situación potencialmente grave. Llama inmediatamente.",
    doctor: "CONSULTA UN MÉDICO",
    doctorDesc: "Consulta recomendada en 24h.",
    home: "QUÉDATE EN CASA",
    homeDesc: "Puedes tratarte en casa.",
    medications: "💊 Medicamentos sin receta recomendados",
    actions: "✅ Acciones recomendadas",
    warning: "⚠️ Vigila si",
    disclaimer: "⚕️ Estos consejos no reemplazan el consejo médico. Siempre consulta a un médico.",
    call15: "Llamar al 112",
    findDoctor: "Encontrar médico",
    findPharmacy: "Farmacia cercana",
    symptoms: ["Fiebre", "Dolor de cabeza", "Tos", "Falta de aire", "Dolor pecho", "Náuseas", "Vómitos", "Diarrea", "Fatiga", "Mareos", "Dolor de garganta", "Erupción", "Dolor muscular", "Dolor de espalda", "Palpitaciones"],
    step1: "Describir",
    step2: "Confirmar",
    step3: "Resultado",
    next: "Continuar →",
    yourAge: "¿Cuál es tu edad?",
    ageDesc: "Para personalizar el análisis",
    selected: "seleccionado(s)",
    lang: "Idioma",
  }
};

const URGENCY_CONFIG = {
  critical: {
    color: "#DC2626", light: "#FEF2F2", border: "#FECACA",
    icon: "🚨", pulse: true
  },
  high: {
    color: "#D97706", light: "#FFFBEB", border: "#FDE68A",
    icon: "⚠️", pulse: false
  },
  low: {
    color: "#059669", light: "#ECFDF5", border: "#A7F3D0",
    icon: "✅", pulse: false
  }
};

async function analyze(description, symptoms, age, lang) {
  const langNames = { fr: "français", en: "English", es: "español" };

  const prompt = `Tu es MediScan, assistant médical d'aide à la décision. Réponds UNIQUEMENT en JSON valide, sans markdown.

Patient: ${age} ans
Symptômes décrits: ${description || symptoms.join(", ")}
Langue de réponse: ${langNames[lang]}

JSON attendu (réponds dans la langue demandée):
{
  "urgency": "critical|high|low",
  "verdict": "phrase courte et claire (max 8 mots)",
  "explanation": "explication en 2 phrases max",
  "medications": [
    {"name": "nom médicament", "dose": "posologie", "note": "précision"}
  ],
  "actions": ["action 1", "action 2", "action 3"],
  "watchFor": ["signe 1", "signe 2"],
  "timeframe": "délai recommandé"
}

Règles urgency:
- critical: danger de vie (douleur poitrine+essoufflement, perte conscience, etc.)
- high: voir médecin dans 24h
- low: soins à domicile suffisants

Pour medications: uniquement médicaments sans ordonnance (Doliprane, Ibuprofène, Smecta, etc.)
Si critical: medications = []
Maximum 2 médicaments.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
  headers: { "Content-Type": "application/json", "x-api-key": import.meta.env.VITE_ANTHROPIC_KEY, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 800,
      messages: [{ role: "user", content: prompt }]
    })
  });
  const data = await res.json();
  const text = data.content.map(i => i.text || "").join("");
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

// ═══════════════════════════════════════════════════════════════
export default function MediScan() {
  const [lang, setLang] = useState("fr");
  const [step, setStep] = useState(1); // 1=describe, 2=age, 3=result
  const [description, setDescription] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [age, setAge] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const t = T[lang];
  const urgency = result ? URGENCY_CONFIG[result.urgency] : null;

  const toggleSymptom = (s) => setSelected(prev =>
    prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
  );
  const setSelected = setSelectedSymptoms;

  const canContinue = description.trim().length > 5 || selectedSymptoms.length > 0;

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await analyze(description, selectedSymptoms, age || "?", lang);
      setResult(r);
      setStep(3);
    } catch (e) {
      setError("Erreur. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(1); setDescription(""); setSelectedSymptoms([]);
    setAge(""); setResult(null); setError(null);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F8FAFC",
      fontFamily: "'Plus Jakarta Sans', 'Nunito', sans-serif",
      color: "#0F172A"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(220,38,38,0.4); } 50% { box-shadow: 0 0 0 12px rgba(220,38,38,0); } }
        .fadein { animation: fadeUp .35s ease; }
        .pulse { animation: pulse 2s infinite; }
        textarea { font-family: inherit; }
        input { font-family: inherit; }
      `}</style>

      {/* Header */}
      <div style={{
        background: "white",
        borderBottom: "1px solid #E2E8F0",
        padding: "16px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, color: "white", fontWeight: 800,
            boxShadow: "0 4px 12px rgba(59,130,246,0.3)"
          }}>+</div>
          <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.5 }}>
            Medi<span style={{ color: "#3B82F6" }}>Scan</span>
          </span>
        </div>

        {/* Language switcher */}
        <div style={{ display: "flex", gap: 6 }}>
          {["fr", "en", "es"].map(l => (
            <button key={l} onClick={() => setLang(l)} style={{
              padding: "5px 10px", borderRadius: 8, border: "1px solid #E2E8F0",
              background: lang === l ? "#3B82F6" : "white",
              color: lang === l ? "white" : "#64748B",
              cursor: "pointer", fontSize: 12, fontWeight: 600
            }}>{l.toUpperCase()}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 16px 40px" }}>

        {/* Step indicators */}
        {step < 3 && (
          <div style={{ display: "flex", alignItems: "center", padding: "20px 0 0", gap: 8 }}>
            {[1, 2, 3].map((s, i) => (
              <div key={s} style={{ display: "flex", alignItems: "center", flex: s < 3 ? 1 : "none" }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: step >= s ? "#3B82F6" : "#E2E8F0",
                  color: step >= s ? "white" : "#94A3B8",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, flexShrink: 0,
                  transition: "all .2s"
                }}>{s}</div>
                <span style={{
                  marginLeft: 6, fontSize: 12, fontWeight: 600,
                  color: step >= s ? "#3B82F6" : "#94A3B8"
                }}>{s === 1 ? t.step1 : s === 2 ? t.step2 : t.step3}</span>
                {s < 3 && <div style={{ flex: 1, height: 1, background: step > s ? "#3B82F6" : "#E2E8F0", marginLeft: 8 }} />}
              </div>
            ))}
          </div>
        )}

        {/* ══ STEP 1 — Describe ══ */}
        {step === 1 && (
          <div className="fadein">
            {/* Hero */}
            <div style={{ padding: "28px 0 20px" }}>
              <h1 style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.2, marginBottom: 8 }}>
                {t.tagline}
              </h1>
              <p style={{ color: "#64748B", fontSize: 15, lineHeight: 1.6 }}>{t.subtitle}</p>
            </div>

            {/* Text input */}
            <div style={{
              background: "white", borderRadius: 16,
              border: "2px solid #E2E8F0", marginBottom: 16,
              transition: "border-color .2s",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
            }}>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder={t.placeholder}
                rows={4}
                style={{
                  width: "100%", padding: "16px", border: "none",
                  borderRadius: 16, resize: "none", fontSize: 15,
                  color: "#0F172A", outline: "none", lineHeight: 1.6,
                  background: "transparent"
                }}
              />
              {description.length > 0 && (
                <div style={{
                  padding: "0 16px 12px", textAlign: "right",
                  fontSize: 12, color: "#94A3B8"
                }}>{description.length} caractères</div>
              )}
            </div>

            {/* Symptoms chips */}
            <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 10, fontWeight: 500 }}>
              {t.orChoose} {selectedSymptoms.length > 0 && (
                <span style={{ color: "#3B82F6", fontWeight: 700 }}>
                  · {selectedSymptoms.length} {t.selected}
                </span>
              )}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
              {t.symptoms.map((s, i) => (
                <button key={i} onClick={() => toggleSymptom(s)} style={{
                  padding: "8px 14px", borderRadius: 20,
                  border: selectedSymptoms.includes(s) ? "2px solid #3B82F6" : "1.5px solid #E2E8F0",
                  background: selectedSymptoms.includes(s) ? "#EFF6FF" : "white",
                  color: selectedSymptoms.includes(s) ? "#1D4ED8" : "#475569",
                  cursor: "pointer", fontSize: 13, fontWeight: selectedSymptoms.includes(s) ? 600 : 400,
                  transition: "all .15s"
                }}>{s}</button>
              ))}
            </div>

            {canContinue && (
              <button onClick={() => setStep(2)} style={{
                width: "100%", padding: "16px", borderRadius: 14,
                background: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
                border: "none", color: "white", fontSize: 16, fontWeight: 700,
                cursor: "pointer", boxShadow: "0 4px 16px rgba(59,130,246,0.4)",
                transition: "transform .1s"
              }}>{t.next}</button>
            )}
          </div>
        )}

        {/* ══ STEP 2 — Age ══ */}
        {step === 2 && (
          <div className="fadein" style={{ paddingTop: 28 }}>
            <div style={{
              background: "white", borderRadius: 20,
              border: "1px solid #E2E8F0", padding: 28, marginBottom: 20,
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
            }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>👤</div>
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>{t.yourAge}</h2>
              <p style={{ color: "#64748B", fontSize: 14, marginBottom: 20 }}>{t.ageDesc}</p>

              <input
                type="number" value={age}
                onChange={e => setAge(e.target.value)}
                placeholder={t.agePlaceholder}
                style={{
                  width: "100%", padding: "16px", borderRadius: 12,
                  border: "2px solid #E2E8F0", fontSize: 24, fontWeight: 700,
                  textAlign: "center", outline: "none", color: "#0F172A",
                  transition: "border-color .2s"
                }}
                onFocus={e => e.target.style.borderColor = "#3B82F6"}
                onBlur={e => e.target.style.borderColor = "#E2E8F0"}
              />
            </div>

            {/* Summary of symptoms */}
            <div style={{
              background: "#F0F9FF", borderRadius: 14,
              border: "1px solid #BAE6FD", padding: "14px 16px", marginBottom: 20
            }}>
              <p style={{ fontSize: 13, color: "#0369A1", fontWeight: 600, marginBottom: 4 }}>
                Résumé de votre analyse
              </p>
              <p style={{ fontSize: 13, color: "#0C4A6E", lineHeight: 1.5 }}>
                {description || selectedSymptoms.join(", ")}
              </p>
            </div>

            {error && (
              <div style={{
                background: "#FEF2F2", borderRadius: 12, padding: 14,
                marginBottom: 16, color: "#DC2626", fontSize: 14
              }}>{error}</div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={loading}
              style={{
                width: "100%", padding: "16px", borderRadius: 14,
                background: loading ? "#94A3B8" : "linear-gradient(135deg, #3B82F6, #1D4ED8)",
                border: "none", color: "white", fontSize: 16, fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 4px 16px rgba(59,130,246,0.4)"
              }}>
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <span style={{
                    width: 18, height: 18, borderRadius: "50%",
                    border: "2px solid white", borderTop: "2px solid transparent",
                    animation: "spin 0.8s linear infinite",
                    display: "inline-block"
                  }} />
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  {t.analyzing}
                </span>
              ) : t.analyze}
            </button>

            <button onClick={() => setStep(1)} style={{
              width: "100%", padding: "12px", borderRadius: 12,
              background: "none", border: "none", color: "#94A3B8",
              cursor: "pointer", fontSize: 14, marginTop: 10
            }}>← Retour</button>
          </div>
        )}

        {/* ══ STEP 3 — Result ══ */}
        {step === 3 && result && urgency && (
          <div className="fadein" style={{ paddingTop: 20 }}>

            {/* Main verdict */}
            <div style={{
              background: urgency.light,
              border: `2px solid ${urgency.border}`,
              borderRadius: 20, padding: 24, marginBottom: 16,
              ...(result.urgency === "critical" ? { animation: "pulse 2s infinite" } : {})
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <span style={{ fontSize: 36 }}>{urgency.icon}</span>
                <div>
                  <div style={{
                    display: "inline-block",
                    background: urgency.color, color: "white",
                    padding: "4px 14px", borderRadius: 20,
                    fontSize: 12, fontWeight: 800, letterSpacing: 0.5,
                    marginBottom: 6
                  }}>
                    {result.urgency === "critical" ? t.emergency :
                     result.urgency === "high" ? t.doctor : t.home}
                  </div>
                  <p style={{ fontSize: 18, fontWeight: 800, color: urgency.color, lineHeight: 1.2 }}>
                    {result.verdict}
                  </p>
                </div>
              </div>
              <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.6 }}>
                {result.explanation}
              </p>
              {result.timeframe && (
                <div style={{
                  marginTop: 12, padding: "8px 14px",
                  background: "rgba(255,255,255,0.7)", borderRadius: 10,
                  fontSize: 13, color: "#374151", fontWeight: 500
                }}>
                  ⏱ {result.timeframe}
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div style={{ display: "grid", gridTemplateColumns: result.urgency === "critical" ? "1fr" : "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {result.urgency === "critical" && (
                <a href="tel:15" style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "16px", borderRadius: 14, textDecoration: "none",
                  background: "#DC2626", color: "white",
                  fontSize: 16, fontWeight: 800,
                  boxShadow: "0 4px 16px rgba(220,38,38,0.4)"
                }}>
                  📞 {t.call15}
                </a>
              )}
              {result.urgency === "high" && (
                <>
                  <a href="tel:3600" style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    padding: "14px", borderRadius: 12, textDecoration: "none",
                    background: "#D97706", color: "white",
                    fontSize: 14, fontWeight: 700
                  }}>
                    👨‍⚕️ {t.findDoctor}
                  </a>
                  <a href="https://www.doctolib.fr" target="_blank" style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    padding: "14px", borderRadius: 12, textDecoration: "none",
                    background: "#0EA5E9", color: "white",
                    fontSize: 14, fontWeight: 700
                  }}>
                    🗓 Doctolib
                  </a>
                </>
              )}
              {result.urgency === "low" && (
                <a href="https://www.google.com/maps/search/pharmacie+près+de+moi" target="_blank" style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  padding: "14px", borderRadius: 12, textDecoration: "none",
                  background: "#059669", color: "white",
                  fontSize: 14, fontWeight: 700, gridColumn: "1/-1"
                }}>
                  💊 {t.findPharmacy}
                </a>
              )}
            </div>

            {/* Medications */}
            {result.medications?.length > 0 && (
              <div style={{
                background: "white", borderRadius: 16,
                border: "1px solid #E2E8F0", padding: 20, marginBottom: 12,
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
              }}>
                <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: "#374151" }}>
                  {t.medications}
                </p>
                {result.medications.map((m, i) => (
                  <div key={i} style={{
                    display: "flex", gap: 12, alignItems: "flex-start",
                    padding: "12px 0",
                    borderBottom: i < result.medications.length - 1 ? "1px solid #F1F5F9" : "none"
                  }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: "#EFF6FF", display: "flex",
                      alignItems: "center", justifyContent: "center",
                      fontSize: 20, flexShrink: 0
                    }}>💊</div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 15, color: "#0F172A" }}>{m.name}</p>
                      <p style={{ fontSize: 13, color: "#3B82F6", fontWeight: 500, marginTop: 2 }}>{m.dose}</p>
                      {m.note && <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>{m.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            {result.actions?.length > 0 && (
              <div style={{
                background: "white", borderRadius: 16,
                border: "1px solid #E2E8F0", padding: 20, marginBottom: 12,
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
              }}>
                <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: "#374151" }}>
                  {t.actions}
                </p>
                {result.actions.map((a, i) => (
                  <div key={i} style={{
                    display: "flex", gap: 12, alignItems: "flex-start",
                    padding: "8px 0",
                    borderBottom: i < result.actions.length - 1 ? "1px solid #F1F5F9" : "none"
                  }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: "50%",
                      background: "#DCFCE7", color: "#16A34A",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 800, flexShrink: 0
                    }}>{i + 1}</div>
                    <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.5 }}>{a}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Watch for */}
            {result.watchFor?.length > 0 && (
              <div style={{
                background: "#FFFBEB", borderRadius: 16,
                border: "1px solid #FDE68A", padding: 20, marginBottom: 12
              }}>
                <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 10, color: "#92400E" }}>
                  {t.warning}
                </p>
                {result.watchFor.map((w, i) => (
                  <div key={i} style={{
                    display: "flex", gap: 8, alignItems: "flex-start",
                    padding: "6px 0"
                  }}>
                    <span style={{ color: "#D97706", fontSize: 14 }}>›</span>
                    <p style={{ fontSize: 14, color: "#78350F", lineHeight: 1.5 }}>{w}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Disclaimer */}
            <div style={{
              background: "#F8FAFC", borderRadius: 12,
              border: "1px solid #E2E8F0", padding: 14, marginBottom: 16
            }}>
              <p style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.6 }}>{t.disclaimer}</p>
            </div>

            <button onClick={reset} style={{
              width: "100%", padding: "14px", borderRadius: 12,
              background: "white", border: "2px solid #E2E8F0",
              color: "#64748B", fontSize: 15, fontWeight: 600,
              cursor: "pointer"
            }}>↩ {t.back}</button>
          </div>
        )}
      </div>
    </div>
  );
}
