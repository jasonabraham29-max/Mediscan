import { useState } from "react";

const sections = [
  {
    id: "collecte",
    title: "1. Données collectées",
    content: `MediScan collecte uniquement les données que vous saisissez volontairement lors de l'utilisation du service :

• Les symptômes que vous décrivez (texte libre ou sélection)
• La langue choisie (FR, EN, ES)
• Les données techniques de navigation (adresse IP anonymisée, type de navigateur, pages visitées) via des outils d'analyse standard

MediScan ne collecte pas : nom, prénom, adresse e-mail, numéro de téléphone, ni aucune donnée permettant de vous identifier personnellement, sauf si vous créez un compte utilisateur (fonctionnalité à venir).`
  },
  {
    id: "utilisation",
    title: "2. Utilisation des données",
    content: `Les données saisies sont utilisées exclusivement pour :

• Générer une analyse de vos symptômes via un modèle d'intelligence artificielle (API Anthropic Claude)
• Améliorer la qualité et la pertinence des réponses du service
• Assurer le bon fonctionnement technique de l'application

Vos données ne sont jamais vendues, louées ou cédées à des tiers à des fins commerciales.`
  },
  {
    id: "ia",
    title: "3. Traitement par intelligence artificielle",
    content: `MediScan utilise l'API Claude d'Anthropic pour analyser vos symptômes. Les données transmises à Anthropic sont soumises à leur propre politique de confidentialité, disponible sur anthropic.com.

Important : les réponses générées par l'IA sont à titre informatif uniquement. Elles ne constituent pas un diagnostic médical et ne remplacent en aucun cas l'avis d'un professionnel de santé.`
  },
  {
    id: "conservation",
    title: "4. Durée de conservation",
    content: `Les symptômes saisis sont traités en temps réel et ne sont pas conservés sur nos serveurs au-delà de la durée nécessaire au traitement de votre requête.

Les données techniques de navigation sont conservées pour une durée maximale de 13 mois, conformément aux recommandations de la CNIL.`
  },
  {
    id: "droits",
    title: "5. Vos droits (RGPD)",
    content: `Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez des droits suivants :

• Droit d'accès à vos données
• Droit de rectification
• Droit à l'effacement (« droit à l'oubli »)
• Droit à la limitation du traitement
• Droit à la portabilité
• Droit d'opposition

Pour exercer ces droits, contactez-nous à : contact@mediscan.app`
  },
  {
    id: "cookies",
    title: "6. Cookies",
    content: `MediScan utilise uniquement des cookies techniques strictement nécessaires au fonctionnement du service (préférences de langue, session). Aucun cookie publicitaire ou de tracking tiers n'est utilisé.`
  },
  {
    id: "securite",
    title: "7. Sécurité",
    content: `Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte ou divulgation. L'application est hébergée sur Vercel (infrastructure sécurisée, connexion HTTPS obligatoire).`
  },
  {
    id: "contact",
    title: "8. Contact & réclamation",
    content: `Responsable du traitement : Jason [NOM À COMPLÉTER]
Adresse : [ADRESSE À COMPLÉTER]
E-mail : contact@mediscan.app

Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la CNIL : www.cnil.fr`
  }
];

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState(null);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0f1e 0%, #0d1b2a 50%, #0a1628 100%)",
      fontFamily: "'DM Sans', -apple-system, sans-serif",
      color: "#e2e8f0",
      padding: "0"
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid rgba(99,179,237,0.15)",
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        background: "rgba(10,15,30,0.8)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 10
      }}>
        <div style={{
          width: 36, height: 36,
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          borderRadius: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18
        }}>🩺</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, color: "#fff" }}>MediScan</div>
          <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Politique de confidentialité</div>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px 80px" }}>
        {/* Hero */}
        <div style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))",
          border: "1px solid rgba(99,102,241,0.2)",
          borderRadius: 16,
          padding: "28px 24px",
          marginBottom: 32
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{
              background: "rgba(99,102,241,0.2)",
              color: "#a5b4fc",
              padding: "4px 10px",
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em"
            }}>RGPD Conforme</span>
            <span style={{ color: "#475569", fontSize: 12 }}>Dernière mise à jour : Mai 2025</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 10, lineHeight: 1.3 }}>
            Politique de Confidentialité
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
            MediScan s'engage à protéger vos données personnelles. Cette politique explique quelles données nous collectons, comment nous les utilisons, et quels sont vos droits conformément au RGPD.
          </p>
        </div>

        {/* Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {sections.map((section) => (
            <div
              key={section.id}
              style={{
                background: activeSection === section.id
                  ? "rgba(99,102,241,0.08)"
                  : "rgba(255,255,255,0.03)",
                border: activeSection === section.id
                  ? "1px solid rgba(99,102,241,0.3)"
                  : "1px solid rgba(255,255,255,0.06)",
                borderRadius: 12,
                overflow: "hidden",
                transition: "all 0.2s ease",
                cursor: "pointer"
              }}
              onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
            >
              <div style={{
                padding: "16px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <h2 style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: activeSection === section.id ? "#a5b4fc" : "#cbd5e1",
                  margin: 0
                }}>{section.title}</h2>
                <span style={{
                  color: "#475569",
                  fontSize: 18,
                  transform: activeSection === section.id ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease"
                }}>⌄</span>
              </div>
              {activeSection === section.id && (
                <div style={{
                  padding: "0 20px 20px",
                  color: "#94a3b8",
                  fontSize: 13,
                  lineHeight: 1.8,
                  whiteSpace: "pre-line"
                }}>
                  {section.content}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div style={{
          marginTop: 32,
          padding: "16px 20px",
          background: "rgba(251,191,36,0.06)",
          border: "1px solid rgba(251,191,36,0.15)",
          borderRadius: 12,
          display: "flex",
          gap: 12,
          alignItems: "flex-start"
        }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
          <p style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.6, margin: 0 }}>
            MediScan est un outil d'information médicale. Les analyses générées ne constituent pas un diagnostic médical et ne remplacent pas la consultation d'un professionnel de santé qualifié.
          </p>
        </div>
      </div>
    </div>
  );
}
