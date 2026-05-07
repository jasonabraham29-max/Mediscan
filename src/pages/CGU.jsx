import { useState } from "react";

const sections = [
  {
    id: "objet",
    title: "1. Objet du service",
    content: `MediScan est un service d'information médicale en ligne accessible à l'adresse mediscan-alpha.vercel.app.

Le service permet aux utilisateurs de décrire leurs symptômes et d'obtenir une analyse informative générée par intelligence artificielle, incluant des pistes de compréhension, des conseils généraux et des indications sur la nécessité de consulter un professionnel de santé.

MediScan n'est pas un service médical. Il ne fournit pas de diagnostic médical, ne prescrit pas de traitement et ne remplace en aucun cas l'avis d'un médecin ou d'un professionnel de santé.`
  },
  {
    id: "acces",
    title: "2. Accès au service",
    content: `L'accès à MediScan est gratuit et ne nécessite pas de création de compte (dans sa version actuelle).

Le service est accessible 24h/24, 7j/7, sous réserve de maintenance ou d'interruption technique. L'éditeur ne garantit pas une disponibilité continue et ne saurait être tenu responsable d'éventuelles interruptions.

L'utilisation du service est réservée aux personnes âgées de 18 ans ou plus, ou aux mineurs sous supervision parentale.`
  },
  {
    id: "utilisation",
    title: "3. Utilisation acceptable",
    content: `En utilisant MediScan, vous vous engagez à :

• Utiliser le service uniquement à des fins personnelles et non commerciales
• Ne pas tenter de contourner, pirater ou perturber le fonctionnement du service
• Ne pas saisir de données personnelles identifiables d'autres personnes sans leur consentement
• Ne pas utiliser le service dans un contexte d'urgence médicale (appelez le 15 / SAMU)

Est strictement interdit : l'utilisation automatisée (bots, scripts), le scraping, la revente des résultats générés.`
  },
  {
    id: "limites",
    title: "4. Limites médicales — À lire impérativement",
    content: `⚠️ AVERTISSEMENT IMPORTANT

MediScan est un outil d'aide à l'information, pas un outil de diagnostic.

Les analyses générées :
• Sont produites par une intelligence artificielle et peuvent contenir des erreurs
• Ne tiennent pas compte de votre historique médical complet
• Ne remplacent pas un examen clinique par un médecin
• Ne doivent pas être utilisées pour modifier ou arrêter un traitement médical en cours

En cas d'urgence médicale, appelez immédiatement le 15 (SAMU) ou le 112.

L'utilisateur utilise MediScan sous sa propre responsabilité.`
  },
  {
    id: "responsabilite",
    title: "5. Responsabilité de l'éditeur",
    content: `L'éditeur de MediScan s'engage à mettre en œuvre tous les moyens raisonnables pour assurer la qualité des informations fournies, mais ne peut garantir leur exactitude, exhaustivité ou pertinence dans tous les cas.

L'éditeur ne saurait être tenu responsable :
• Des décisions médicales prises sur la base des analyses générées
• Des dommages directs ou indirects résultant de l'utilisation du service
• Des interruptions temporaires du service`
  },
  {
    id: "propriete",
    title: "6. Propriété intellectuelle",
    content: `L'ensemble des éléments constituant MediScan (logo, interface, code, textes, marque) sont la propriété exclusive de l'éditeur et sont protégés par les lois relatives à la propriété intellectuelle.

Toute reproduction, représentation, modification ou exploitation non autorisée est strictement interdite.

Les analyses générées par l'IA sont produites à la demande de l'utilisateur et lui sont destinées à titre personnel uniquement.`
  },
  {
    id: "modification",
    title: "7. Modification des CGU",
    content: `L'éditeur se réserve le droit de modifier les présentes CGU à tout moment. Les modifications prennent effet dès leur publication sur le site.

Il est recommandé de consulter régulièrement cette page. L'utilisation continue du service après modification vaut acceptation des nouvelles conditions.`
  },
  {
    id: "droit",
    title: "8. Droit applicable",
    content: `Les présentes CGU sont soumises au droit français.

En cas de litige relatif à l'interprétation ou à l'exécution des présentes, les tribunaux français seront seuls compétents.

Contact : contact@mediscan.app`
  }
];

export default function CGU() {
  const [activeSection, setActiveSection] = useState(null);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0f1e 0%, #0d1b2a 50%, #0a1628 100%)",
      fontFamily: "'DM Sans', -apple-system, sans-serif",
      color: "#e2e8f0",
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
          <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Conditions Générales d'Utilisation</div>
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
            }}>Droit Français</span>
            <span style={{ color: "#475569", fontSize: 12 }}>En vigueur depuis Mai 2025</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 10, lineHeight: 1.3 }}>
            Conditions Générales d'Utilisation
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
            En utilisant MediScan, vous acceptez les présentes conditions. Veuillez les lire attentivement, en particulier la section sur les limites médicales.
          </p>
        </div>

        {/* Urgent warning */}
        <div style={{
          marginBottom: 24,
          padding: "14px 20px",
          background: "rgba(239,68,68,0.08)",
          border: "1px solid rgba(239,68,68,0.25)",
          borderRadius: 12,
          display: "flex",
          gap: 12,
          alignItems: "center"
        }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>🚨</span>
          <p style={{ color: "#fca5a5", fontSize: 13, fontWeight: 600, margin: 0 }}>
            En cas d'urgence médicale, appelez le <strong>15 (SAMU)</strong> ou le <strong>112</strong>. N'utilisez pas MediScan en situation d'urgence.
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
                border: section.id === "limites"
                  ? activeSection === section.id
                    ? "1px solid rgba(251,191,36,0.4)"
                    : "1px solid rgba(251,191,36,0.2)"
                  : activeSection === section.id
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
                  color: section.id === "limites"
                    ? "#fbbf24"
                    : activeSection === section.id ? "#a5b4fc" : "#cbd5e1",
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
      </div>
    </div>
  );
}
