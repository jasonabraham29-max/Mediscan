export default function MentionsLegales() {
  const items = [
    {
      icon: "👤",
      title: "Éditeur du site",
      content: [
        { label: "Nom", value: "Jason [NOM À COMPLÉTER]" },
        { label: "Statut", value: "Personne physique" },
        { label: "Adresse", value: "[ADRESSE À COMPLÉTER]" },
        { label: "E-mail", value: "contact@mediscan.app" },
      ]
    },
    {
      icon: "🌐",
      title: "Hébergement",
      content: [
        { label: "Hébergeur", value: "Vercel Inc." },
        { label: "Adresse", value: "340 Pine Street, Suite 701, San Francisco, CA 94104, USA" },
        { label: "Site", value: "vercel.com" },
      ]
    },
    {
      icon: "🤖",
      title: "Intelligence artificielle",
      content: [
        { label: "Fournisseur IA", value: "Anthropic, PBC" },
        { label: "Modèle utilisé", value: "Claude (API Anthropic)" },
        { label: "Site", value: "anthropic.com" },
      ]
    },
    {
      icon: "⚖️",
      title: "Propriété intellectuelle",
      content: [
        { label: "Marque", value: "MediScan™ — Tous droits réservés" },
        { label: "Code source", value: "Propriété de l'éditeur" },
        { label: "Reproduction", value: "Interdite sans autorisation écrite" },
      ]
    },
    {
      icon: "🛡️",
      title: "Données personnelles",
      content: [
        { label: "Responsable", value: "Jason [NOM À COMPLÉTER]" },
        { label: "Cadre légal", value: "RGPD + Loi Informatique et Libertés" },
        { label: "Autorité", value: "CNIL — www.cnil.fr" },
        { label: "Contact", value: "contact@mediscan.app" },
      ]
    },
    {
      icon: "🏥",
      title: "Avertissement médical",
      content: [
        { label: "Statut", value: "Service d'information uniquement" },
        { label: "Diagnostic", value: "Non fourni par ce service" },
        { label: "Urgence", value: "Appelez le 15 (SAMU) ou le 112" },
      ]
    }
  ];

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
          <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Mentions Légales</div>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px 80px" }}>
        <div style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))",
          border: "1px solid rgba(99,102,241,0.2)",
          borderRadius: 16,
          padding: "28px 24px",
          marginBottom: 32
        }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 10 }}>
            Mentions Légales
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
            Conformément aux dispositions de la loi n°2004-575 du 21 juin 2004 pour la confiance en l'économie numérique (LCEN).
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {items.map((item) => (
            <div key={item.title} style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14,
              padding: "20px 24px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: "#c4b5fd", margin: 0 }}>{item.title}</h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {item.content.map((row) => (
                  <div key={row.label} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 16,
                    paddingBottom: 10,
                    borderBottom: "1px solid rgba(255,255,255,0.05)"
                  }}>
                    <span style={{ color: "#64748b", fontSize: 12, fontWeight: 500, flexShrink: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>{row.label}</span>
                    <span style={{ color: "#cbd5e1", fontSize: 13, textAlign: "right" }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 32,
          padding: "16px 20px",
          background: "rgba(239,68,68,0.06)",
          border: "1px solid rgba(239,68,68,0.15)",
          borderRadius: 12,
          display: "flex",
          gap: 12,
          alignItems: "flex-start"
        }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>🚨</span>
          <p style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.6, margin: 0 }}>
            <strong style={{ color: "#fca5a5" }}>Urgence médicale :</strong> Ne pas utiliser MediScan en cas d'urgence. Appelez le <strong style={{ color: "#fca5a5" }}>15 (SAMU)</strong> ou le <strong style={{ color: "#fca5a5" }}>112</strong> immédiatement.
          </p>
        </div>
      </div>
    </div>
  );
}
