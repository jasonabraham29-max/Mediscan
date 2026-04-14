import { useState, useEffect } from "react";

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
    doctolib: "Doctolib",
    symptoms: ["Fièvre", "Maux de tête", "Toux", "Essoufflement", "Douleur thoracique", "Nausées", "Vomissements", "Diarrhée", "Fatigue", "Vertiges", "Mal de gorge", "Éruption cutanée", "Douleurs musculaires", "Maux de dos", "Palpitations"],
    step1: "Décrivez",
    step2: "Confirmez",
    step3: "Résultat",
    next: "Continuer →",
    yourAge: "Quel est votre âge ?",
    ageDesc: "Pour personnaliser l'analyse",
    selected: "sélectionné(s)",
    summary: "Résumé de votre analyse",
    error: "Erreur. Réessayez.",
    poweredBy: "Propulsé par l'IA",
    confidential: "100% Confidentiel",
    instant: "Résultat Instantané",
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
    doctolib: "Doctolib",
    symptoms: ["Fever", "Headache", "Cough", "Shortness of breath", "Chest pain", "Nausea", "Vomiting", "Diarrhea", "Fatigue", "Dizziness", "Sore throat", "Rash", "Muscle pain", "Back pain", "Palpitations"],
    step1: "Describe",
    step2: "Confirm",
    step3: "Result",
    next: "Continue →",
    yourAge: "What is your age?",
    ageDesc: "To personalize the analysis",
    selected: "selected",
    summary: "Your analysis summary",
    error: "Error. Please retry.",
    poweredBy: "AI Powered",
    confidential: "100% Confidential",
    instant: "Instant Result",
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
    doctolib: "Doctolib",
    symptoms: ["Fiebre", "Dolor de cabeza", "Tos", "Falta de aire", "Dolor pecho", "Náuseas", "Vómitos", "Diarrea", "Fatiga", "Mareos", "Dolor de garganta", "Erupción", "Dolor muscular", "Dolor de espalda", "Palpitaciones"],
    step1: "Describir",
    step2: "Confirmar",
    step3: "Resultado",
    next: "Continuar →",
    yourAge: "¿Cuál es tu edad?",
    ageDesc: "Para personalizar el análisis",
    selected: "seleccionado(s)",
    summary: "Resumen de tu análisis",
    error: "Error. Inténtalo de nuevo.",
    poweredBy: "Impulsado por IA",
    confidential: "100% Confidencial",
    instant: "Resultado Instantáneo",
  }
};

const URGENCY_CONFIG = {
  critical: { color: "#EF4444", light: "#FEF2F2", border: "#FECACA", gradient: "linear-gradient(135deg, #EF4444, #DC2626)", icon: "🚨" },
  high: { color: "#F59E0B", light: "#FFFBEB", border: "#FDE68A", gradient: "linear-gradient(135deg, #F59E0B, #D97706)", icon: "⚠️" },
  low: { color: "#10B981", light: "#ECFDF5", border: "#A7F3D0", gradient: "linear-gradient(135deg, #10B981, #059669)", icon: "✅" }
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
- critical: danger de vie
- high: voir médecin dans 24h
- low: soins à domicile suffisants

Pour medications: uniquement médicaments sans ordonnance
Si critical: medications = []
Maximum 2 médicaments.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_ANTHROPIC_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    },
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

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: #0A0F1E;
    min-height: 100vh;
    color: #0A0F1E;
  }

  .ms-root {
    min-height: 100vh;
    background: linear-gradient(160deg, #0A0F1E 0%, #0D1533 40%, #0A1628 100%);
    position: relative;
    overflow: hidden;
  }

  .ms-bg-orb1 {
    position: fixed;
    top: -120px;
    right: -120px;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }

  .ms-bg-orb2 {
    position: fixed;
    bottom: -150px;
    left: -100px;
    width: 450px;
    height: 450px;
    background: radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }

  .ms-container {
    position: relative;
    z-index: 1;
    max-width: 480px;
    margin: 0 auto;
    padding: 0 16px 40px;
    min-height: 100vh;
  }

  .ms-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 0 24px;
  }

  .ms-logo {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .ms-logo-icon {
    width: 38px;
    height: 38px;
    background: linear-gradient(135deg, #6366F1, #8B5CF6);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    box-shadow: 0 4px 16px rgba(99,102,241,0.4);
  }

  .ms-logo-text {
    font-family: 'Syne', sans-serif;
    font-size: 20px;
    font-weight: 800;
    color: white;
    letter-spacing: -0.3px;
  }

  .ms-logo-text span {
    color: #818CF8;
  }

  .ms-lang-switcher {
    display: flex;
    gap: 4px;
    background: rgba(255,255,255,0.06);
    border-radius: 10px;
    padding: 4px;
  }

  .ms-lang-btn {
    padding: 5px 10px;
    border-radius: 7px;
    border: none;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
    color: rgba(255,255,255,0.5);
    background: transparent;
  }

  .ms-lang-btn.active {
    background: rgba(255,255,255,0.12);
    color: white;
  }

  .ms-hero {
    text-align: center;
    padding: 8px 0 28px;
  }

  .ms-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(99,102,241,0.15);
    border: 1px solid rgba(99,102,241,0.3);
    border-radius: 100px;
    padding: 6px 14px;
    font-size: 12px;
    font-weight: 600;
    color: #A5B4FC;
    margin-bottom: 16px;
    letter-spacing: 0.3px;
  }

  .ms-badge::before {
    content: '';
    width: 6px;
    height: 6px;
    background: #6366F1;
    border-radius: 50%;
    animation: pulse-dot 2s infinite;
  }

  @keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }

  .ms-tagline {
    font-family: 'Syne', sans-serif;
    font-size: 32px;
    font-weight: 800;
    color: white;
    line-height: 1.15;
    margin-bottom: 10px;
    letter-spacing: -0.5px;
  }

  .ms-tagline span {
    background: linear-gradient(135deg, #818CF8, #6EE7B7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .ms-subtitle {
    font-size: 15px;
    color: rgba(255,255,255,0.5);
    line-height: 1.6;
    font-weight: 400;
  }

  .ms-trust-bar {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
  }

  .ms-trust-item {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    color: rgba(255,255,255,0.35);
    font-weight: 500;
  }

  .ms-trust-item span:first-child {
    font-size: 13px;
  }

  .ms-stepper {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    gap: 0;
  }

  .ms-step {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .ms-step-circle {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    transition: all 0.3s;
    font-family: 'Syne', sans-serif;
  }

  .ms-step-circle.active {
    background: linear-gradient(135deg, #6366F1, #8B5CF6);
    color: white;
    box-shadow: 0 4px 12px rgba(99,102,241,0.4);
  }

  .ms-step-circle.done {
    background: rgba(16,185,129,0.2);
    color: #10B981;
    border: 1px solid rgba(16,185,129,0.3);
  }

  .ms-step-circle.inactive {
    background: rgba(255,255,255,0.06);
    color: rgba(255,255,255,0.25);
    border: 1px solid rgba(255,255,255,0.08);
  }

  .ms-step-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.3px;
    text-transform: uppercase;
  }

  .ms-step-label.active { color: white; }
  .ms-step-label.done { color: #10B981; }
  .ms-step-label.inactive { color: rgba(255,255,255,0.2); }

  .ms-step-line {
    width: 40px;
    height: 1px;
    background: rgba(255,255,255,0.08);
    margin: 0 8px;
  }

  .ms-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 24px;
    margin-bottom: 12px;
    backdrop-filter: blur(10px);
  }

  .ms-textarea {
    width: 100%;
    min-height: 110px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 14px;
    padding: 16px;
    color: white;
    font-size: 15px;
    font-family: 'DM Sans', sans-serif;
    resize: none;
    outline: none;
    transition: all 0.2s;
    line-height: 1.6;
  }

  .ms-textarea::placeholder { color: rgba(255,255,255,0.2); }
  .ms-textarea:focus {
    border-color: rgba(99,102,241,0.5);
    background: rgba(255,255,255,0.07);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
  }

  .ms-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 16px 0;
  }

  .ms-divider-line {
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.07);
  }

  .ms-divider-text {
    font-size: 12px;
    color: rgba(255,255,255,0.25);
    font-weight: 500;
    white-space: nowrap;
  }

  .ms-symptoms-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .ms-symptom-chip {
    padding: 8px 14px;
    border-radius: 100px;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.04);
    color: rgba(255,255,255,0.6);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
  }

  .ms-symptom-chip:hover {
    border-color: rgba(99,102,241,0.4);
    color: white;
    background: rgba(99,102,241,0.1);
  }

  .ms-symptom-chip.selected {
    background: rgba(99,102,241,0.2);
    border-color: rgba(99,102,241,0.6);
    color: #A5B4FC;
    font-weight: 600;
  }

  .ms-btn-primary {
    width: 100%;
    padding: 16px;
    border-radius: 14px;
    border: none;
    background: linear-gradient(135deg, #6366F1, #8B5CF6);
    color: white;
    font-size: 16px;
    font-weight: 700;
    font-family: 'Syne', sans-serif;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 8px 24px rgba(99,102,241,0.35);
    letter-spacing: 0.2px;
  }

  .ms-btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 32px rgba(99,102,241,0.45);
  }

  .ms-btn-primary:active { transform: translateY(0); }

  .ms-btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .ms-age-input {
    width: 100%;
    padding: 16px 20px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 14px;
    color: white;
    font-size: 18px;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    outline: none;
    text-align: center;
    transition: all 0.2s;
    margin-bottom: 16px;
  }

  .ms-age-input::placeholder { color: rgba(255,255,255,0.2); font-weight: 400; font-size: 15px; }
  .ms-age-input:focus {
    border-color: rgba(99,102,241,0.5);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
  }
  .ms-age-input::-webkit-inner-spin-button,
  .ms-age-input::-webkit-outer-spin-button { -webkit-appearance: none; }

  .ms-summary-box {
    background: rgba(99,102,241,0.08);
    border: 1px solid rgba(99,102,241,0.2);
    border-radius: 14px;
    padding: 14px 16px;
    margin-bottom: 16px;
  }

  .ms-summary-label {
    font-size: 11px;
    font-weight: 600;
    color: rgba(165,180,252,0.7);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 6px;
  }

  .ms-summary-value {
    font-size: 14px;
    color: rgba(255,255,255,0.8);
    font-weight: 500;
    line-height: 1.5;
  }

  .ms-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
    text-align: center;
  }

  .ms-loading-ring {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: 3px solid rgba(99,102,241,0.15);
    border-top-color: #6366F1;
    animation: spin 0.8s linear infinite;
    margin-bottom: 20px;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .ms-loading-text {
    font-size: 16px;
    color: rgba(255,255,255,0.6);
    font-weight: 500;
  }

  .ms-loading-sub {
    font-size: 13px;
    color: rgba(255,255,255,0.25);
    margin-top: 6px;
  }

  .ms-result-header {
    border-radius: 20px;
    padding: 24px;
    margin-bottom: 12px;
    position: relative;
    overflow: hidden;
  }

  .ms-result-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 100px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 12px;
  }

  .ms-result-verdict {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: 10px;
    letter-spacing: -0.3px;
  }

  .ms-result-explanation {
    font-size: 14px;
    line-height: 1.6;
    opacity: 0.75;
  }

  .ms-result-timeframe {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 12px;
    padding: 6px 12px;
    border-radius: 100px;
    background: rgba(0,0,0,0.12);
    font-size: 12px;
    font-weight: 600;
    opacity: 0.8;
  }

  .ms-white-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 18px;
    padding: 20px;
    margin-bottom: 10px;
  }

  .ms-section-title {
    font-size: 13px;
    font-weight: 700;
    color: rgba(255,255,255,0.5);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 14px;
  }

  .ms-med-item {
    display: flex;
    gap: 14px;
    align-items: flex-start;
    padding: 12px 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }

  .ms-med-item:last-child { border-bottom: none; }

  .ms-med-icon {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: rgba(99,102,241,0.12);
    border: 1px solid rgba(99,102,241,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }

  .ms-med-name {
    font-size: 15px;
    font-weight: 700;
    color: white;
    margin-bottom: 3px;
  }

  .ms-med-dose {
    font-size: 13px;
    color: #818CF8;
    font-weight: 500;
  }

  .ms-med-note {
    font-size: 12px;
    color: rgba(255,255,255,0.3);
    margin-top: 2px;
  }

  .ms-action-item {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    padding: 10px 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }

  .ms-action-item:last-child { border-bottom: none; }

  .ms-action-num {
    width: 24px;
    height: 24px;
    border-radius: 8px;
    background: rgba(16,185,129,0.15);
    border: 1px solid rgba(16,185,129,0.3);
    color: #10B981;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 800;
    flex-shrink: 0;
    font-family: 'Syne', sans-serif;
  }

  .ms-action-text {
    font-size: 14px;
    color: rgba(255,255,255,0.75);
    line-height: 1.5;
    padding-top: 3px;
  }

  .ms-watch-card {
    background: rgba(245,158,11,0.06);
    border: 1px solid rgba(245,158,11,0.2);
    border-radius: 18px;
    padding: 20px;
    margin-bottom: 10px;
  }

  .ms-watch-item {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    padding: 6px 0;
  }

  .ms-watch-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #F59E0B;
    margin-top: 7px;
    flex-shrink: 0;
  }

  .ms-watch-text {
    font-size: 14px;
    color: rgba(255,255,255,0.6);
    line-height: 1.5;
  }

  .ms-cta-grid {
    display: grid;
    gap: 10px;
    margin-bottom: 10px;
  }

  .ms-cta-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 16px;
    border-radius: 14px;
    text-decoration: none;
    font-size: 15px;
    font-weight: 700;
    font-family: 'Syne', sans-serif;
    transition: all 0.2s;
    letter-spacing: 0.2px;
  }

  .ms-cta-btn:hover { transform: translateY(-1px); }

  .ms-cta-emergency {
    background: linear-gradient(135deg, #EF4444, #DC2626);
    color: white;
    box-shadow: 0 8px 24px rgba(239,68,68,0.35);
  }

  .ms-cta-doctor {
    background: linear-gradient(135deg, #F59E0B, #D97706);
    color: white;
    box-shadow: 0 6px 18px rgba(245,158,11,0.3);
  }

  .ms-cta-doctolib {
    background: linear-gradient(135deg, #0EA5E9, #0284C7);
    color: white;
    box-shadow: 0 6px 18px rgba(14,165,233,0.3);
  }

  .ms-cta-pharmacy {
    background: linear-gradient(135deg, #10B981, #059669);
    color: white;
    box-shadow: 0 6px 18px rgba(16,185,129,0.3);
  }

  .ms-disclaimer {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
    padding: 14px 16px;
    margin-bottom: 14px;
  }

  .ms-disclaimer p {
    font-size: 12px;
    color: rgba(255,255,255,0.25);
    line-height: 1.6;
    text-align: center;
  }

  .ms-btn-secondary {
    width: 100%;
    padding: 14px;
    border-radius: 14px;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.5);
    font-size: 15px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.2s;
  }

  .ms-btn-secondary:hover {
    border-color: rgba(255,255,255,0.2);
    color: rgba(255,255,255,0.7);
    background: rgba(255,255,255,0.04);
  }

  .ms-error {
    text-align: center;
    padding: 12px;
    color: #F87171;
    font-size: 14px;
    font-weight: 500;
    background: rgba(239,68,68,0.08);
    border-radius: 12px;
    margin-bottom: 12px;
    border: 1px solid rgba(239,68,68,0.2);
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .ms-animate { animation: fadeIn 0.4s ease forwards; }
`;

export default function MediScan() {
  const [lang, setLang] = useState("fr");
  const [step, setStep] = useState(1);
  const [description, setDescription] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [age, setAge] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const t = T[lang];

  const toggleSymptom = (s) => {
    setSelectedSymptoms(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  };

  const handleAnalyze = async () => {
    if (!description && selectedSymptoms.length === 0) return;
    setLoading(true);
    setError(false);
    try {
      const data = await analyze(description, selectedSymptoms, age || "30", lang);
      setResult(data);
      setStep(3);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(1);
    setDescription("");
    setSelectedSymptoms([]);
    setAge("");
    setResult(null);
    setError(false);
  };

  const getStepState = (n) => {
    if (n < step) return "done";
    if (n === step) return "active";
    return "inactive";
  };

  const cfg = result ? URGENCY_CONFIG[result.urgency] : null;

  return (
    <>
      <style>{styles}</style>
      <div className="ms-root">
        <div className="ms-bg-orb1" />
        <div className="ms-bg-orb2" />
        <div className="ms-container">

          {/* Header */}
          <div className="ms-header">
            <div className="ms-logo">
              <div className="ms-logo-icon">🩺</div>
              <div className="ms-logo-text">Medi<span>Scan</span></div>
            </div>
            <div className="ms-lang-switcher">
              {["fr", "en", "es"].map(l => (
                <button key={l} className={`ms-lang-btn ${lang === l ? "active" : ""}`} onClick={() => setLang(l)}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Hero — only step 1 */}
          {step === 1 && (
            <div className="ms-hero ms-animate">
              <div className="ms-badge">IA Médicale · {t.instant}</div>
              <h1 className="ms-tagline">
                {lang === "fr" && <>Votre santé<br /><span>en 3 clics</span></>}
                {lang === "en" && <>Your health<br /><span>in 3 clicks</span></>}
                {lang === "es" && <>Tu salud<br /><span>en 3 clics</span></>}
              </h1>
              <p className="ms-subtitle">{t.subtitle}</p>
              <div className="ms-trust-bar">
                <div className="ms-trust-item"><span>🔒</span><span>{t.confidential}</span></div>
                <div className="ms-trust-item"><span>⚡</span><span>{t.instant}</span></div>
                <div className="ms-trust-item"><span>🤖</span><span>{t.poweredBy}</span></div>
              </div>
            </div>
          )}

          {/* Stepper */}
          <div className="ms-stepper">
            {[1, 2, 3].map((n, i) => (
              <div key={n} style={{ display: "flex", alignItems: "center" }}>
                <div className="ms-step">
                  <div className={`ms-step-circle ${getStepState(n)}`}>
                    {getStepState(n) === "done" ? "✓" : n}
                  </div>
                  <span className={`ms-step-label ${getStepState(n)}`}>
                    {t[`step${n}`]}
                  </span>
                </div>
                {i < 2 && <div className="ms-step-line" />}
              </div>
            ))}
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="ms-animate">
              <div className="ms-card">
                <textarea
                  className="ms-textarea"
                  placeholder={t.placeholder}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
                <div className="ms-divider">
                  <div className="ms-divider-line" />
                  <span className="ms-divider-text">{t.orChoose}</span>
                  <div className="ms-divider-line" />
                </div>
                <div className="ms-symptoms-grid">
                  {t.symptoms.map(s => (
                    <button
                      key={s}
                      className={`ms-symptom-chip ${selectedSymptoms.includes(s) ? "selected" : ""}`}
                      onClick={() => toggleSymptom(s)}
                    >
                      {selectedSymptoms.includes(s) ? "✓ " : ""}{s}
                    </button>
                  ))}
                </div>
              </div>
              <button
                className="ms-btn-primary"
                onClick={() => setStep(2)}
                disabled={!description && selectedSymptoms.length === 0}
              >
                {t.next}
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="ms-animate">
              <div className="ms-card">
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>👤</div>
                  <p style={{ fontSize: 18, fontWeight: 700, color: "white", fontFamily: "Syne, sans-serif" }}>{t.yourAge}</p>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>{t.ageDesc}</p>
                </div>
                <input
                  type="number"
                  className="ms-age-input"
                  placeholder={t.agePlaceholder}
                  value={age}
                  onChange={e => setAge(e.target.value)}
                />
                <div className="ms-summary-box">
                  <div className="ms-summary-label">{t.summary}</div>
                  <div className="ms-summary-value">
                    {description || selectedSymptoms.join(", ")}
                  </div>
                </div>
                {error && <div className="ms-error">{t.error}</div>}
              </div>
              <button
                className="ms-btn-primary"
                onClick={handleAnalyze}
                disabled={loading}
              >
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                    <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                    {t.analyzing}
                  </span>
                ) : t.analyze}
              </button>
            </div>
          )}

          {/* STEP 3 — Loading */}
          {step === 3 && loading && (
            <div className="ms-card ms-animate">
              <div className="ms-loading">
                <div className="ms-loading-ring" />
                <p className="ms-loading-text">{t.analyzing}</p>
                <p className="ms-loading-sub">Analyse IA en cours...</p>
              </div>
            </div>
          )}

          {/* STEP 3 — Result */}
          {step === 3 && result && !loading && (
            <div className="ms-animate">
              {/* Result Header */}
              <div className="ms-result-header" style={{
                background: cfg.gradient,
                color: "white"
              }}>
                <div className="ms-result-badge" style={{
                  background: "rgba(0,0,0,0.15)",
                  color: "rgba(255,255,255,0.9)"
                }}>
                  {cfg.icon} {result.urgency === "critical" ? t.emergency : result.urgency === "high" ? t.doctor : t.home}
                </div>
                <div className="ms-result-verdict">{result.verdict}</div>
                <div className="ms-result-explanation">{result.explanation}</div>
                {result.timeframe && (
                  <div className="ms-result-timeframe">⏱ {result.timeframe}</div>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="ms-cta-grid" style={{
                gridTemplateColumns: result.urgency === "critical" ? "1fr" : result.urgency === "high" ? "1fr 1fr" : "1fr"
              }}>
                {result.urgency === "critical" && (
                  <a href="tel:15" className="ms-cta-btn ms-cta-emergency">📞 {t.call15}</a>
                )}
                {result.urgency === "high" && (
                  <>
                    <a href="tel:3600" className="ms-cta-btn ms-cta-doctor">👨‍⚕️ {t.findDoctor}</a>
                    <a href="https://www.doctolib.fr" target="_blank" className="ms-cta-btn ms-cta-doctolib">🗓 {t.doctolib}</a>
                  </>
                )}
                {result.urgency === "low" && (
                  <a href="https://www.google.com/maps/search/pharmacie" target="_blank" className="ms-cta-btn ms-cta-pharmacy">💊 {t.findPharmacy}</a>
                )}
              </div>

              {/* Medications */}
              {result.medications?.length > 0 && (
                <div className="ms-white-card">
                  <div className="ms-section-title">{t.medications}</div>
                  {result.medications.map((m, i) => (
                    <div key={i} className="ms-med-item">
                      <div className="ms-med-icon">💊</div>
                      <div>
                        <div className="ms-med-name">{m.name}</div>
                        <div className="ms-med-dose">{m.dose}</div>
                        {m.note && <div className="ms-med-note">{m.note}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              {result.actions?.length > 0 && (
                <div className="ms-white-card">
                  <div className="ms-section-title">{t.actions}</div>
                  {result.actions.map((a, i) => (
                    <div key={i} className="ms-action-item">
                      <div className="ms-action-num">{i + 1}</div>
                      <div className="ms-action-text">{a}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Watch For */}
              {result.watchFor?.length > 0 && (
                <div className="ms-watch-card">
                  <div className="ms-section-title" style={{ color: "rgba(245,158,11,0.7)" }}>{t.warning}</div>
                  {result.watchFor.map((w, i) => (
                    <div key={i} className="ms-watch-item">
                      <div className="ms-watch-dot" />
                      <div className="ms-watch-text">{w}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Disclaimer */}
              <div className="ms-disclaimer">
                <p>{t.disclaimer}</p>
              </div>

              <button className="ms-btn-secondary" onClick={reset}>↩ {t.back}</button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
