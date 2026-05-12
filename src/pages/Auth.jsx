import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAuth = async () => {
    setLoading(true);
    setMessage("");
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setMessage(error.message);
        else window.location.href = "/";
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) setMessage(error.message);
        else setMessage("Vérifiez votre email pour confirmer votre compte.");
      }
    } catch (e) {
      setMessage("Une erreur est survenue.");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0f1e 0%, #0d1b2a 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif", padding: 24
    }}>
      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(99,102,241,0.2)",
        borderRadius: 20, padding: "40px 32px", width: "100%", maxWidth: 420
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🩺</div>
          <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: 8 }}>MediScan</h1>
          <p style={{ color: "#64748b", fontSize: 14 }}>{isLogin ? "Connectez-vous à votre compte" : "Créez votre compte"}</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              padding: "14px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: 14, outline: "none"
            }}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{
              padding: "14px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: 14, outline: "none"
            }}
          />

          {message && (
            <p style={{ color: "#a5b4fc", fontSize: 13, textAlign: "center" }}>{message}</p>
          )}

          <button
            onClick={handleAuth}
            disabled={loading}
            style={{
              padding: "14px", borderRadius: 12, border: "none",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer"
            }}
          >
            {loading ? "Chargement..." : isLogin ? "Se connecter" : "Créer un compte"}
          </button>

          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{
              background: "none", border: "none", color: "#64748b",
              fontSize: 13, cursor: "pointer", textDecoration: "underline"
            }}
          >
            {isLogin ? "Pas de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
          </button>
        </div>
      </div>
    </div>
  );
}