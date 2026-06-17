import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const SYMPTOMS = [
  "Fièvre", "Maux de tête", "Toux sèche", "Essoufflement",
  "Douleur thoracique", "Nausées", "Fatigue intense", "Vertiges",
  "Mal de gorge", "Douleurs musculaires", "Maux de dos", "Palpitations",
  "Frissons", "Perte d'appétit", "Troubles du sommeil"
];

const URGENCE_CONFIG = {
  "faible":            { color: "#27AE60", bg: "#F0FAF4", border: "rgba(39,174,96,0.2)",  label: "Faible",            dot: "#27AE60" },
  "modérée":           { color: "#E67E22", bg: "#FEF6EE", border: "rgba(230,126,34,0.2)", label: "Modérée",           dot: "#E67E22" },
  "élevée":            { color: "#C0392B", bg: "#FFF5F5", border: "rgba(192,57,43,0.25)", label: "Élevée",            dot: "#C0392B" },
  "urgence immédiate": { color: "#8B0000", bg: "#FFF0F0", border: "rgba(139,0,0,0.3)",    label: "Urgence immédiate", dot: "#8B0000" },
};

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function App() {
  const [step, setStep]               = useState(0);
  const [description, setDescription] = useState("");
  const [selected, setSelected]       = useState([]);
  const [age, setAge]                 = useState("");
  const [analyzing, setAnalyzing]     = useState(false);
  const [result, setResult]           = useState(null);
  const [error, setError]             = useState(null);
  const [user, setUser]               = useState(null);
  const [history, setHistory]         = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [expanded, setExpanded]       = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  const loadHistory = async () => {
    setHistoryLoading(true);
    const { data } = await supabase
      .from("health_history")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);
    setHistory(data || []);
    setHistoryLoading(false);
  };

  const openCarnet = () => {
    setStep(4);
    loadHistory();
  };

  const toggle = (s) => setSelected(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setError(null);

    const symptomsText = [
      description && `Description libre : ${description}`,
      selected.length > 0 && `Symptômes cochés : ${selected.join(", ")}`,
      age && `Âge du patient : ${age} ans`,
    ].filter(Boolean).join("\n");

    const systemPrompt = `Tu es MediScan, un assistant médical expert, bienveillant et rigoureux.
Tu analyses les symptômes avec précision et tu t'exprimes en français médical clair et rassurant.
Tu ne poses jamais de diagnostic définitif — tu orientes, tu rassures, tu guides.`;

    const userPrompt = `Données patient :
${symptomsText}

Analyse ces symptômes et réponds UNIQUEMENT en JSON valide, sans markdown ni backticks.

Format EXACT à respecter :
{
  "urgence": "faible" | "modérée" | "élevée" | "urgence immédiate",
  "diagnostic": "Explication claire en 2-3 phrases du tableau clinique probable, avec les raisons. Ton rassurant mais honnête.",
  "medicaments": [
    "Nom du médicament — dosage recommandé — précaution importante"
  ],
  "actions": [
    "Action concrète et immédiate à réaliser"
  ],
  "consulter": "Délai recommandé pour consulter un médecin (ex: dans les 24h, sous 48-72h, si aggravation, pas nécessaire si amélioration, etc.)",
  "signes_alarme": ["Signe qui doit déclencher un appel au 15 immédiatement"]
}

Règles strictes :
- Maximum 3 médicaments, uniquement disponibles sans ordonnance en France
- Maximum 4 actions concrètes
- Maximum 3 signes d'alarme
- Si les symptômes sont insuffisants ou vagues, dis-le clairement dans le diagnostic
- Toujours inclure un rappel de consulter un médecin dans "consulter"`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-opus-4-5",
          max_tokens: 1200,
          system: systemPrompt,
          messages: [{ role: "user", content: userPrompt }],
        }),
      });
      const data = await response.json();
      const text = data.content?.[0]?.text || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
      if (user) {
        await supabase.from("health_history").insert({
          user_id: user.id,
          symptoms_description: symptomsText,
          urgence: parsed.urgence,
          diagnostic: parsed.diagnostic,
          medicaments: parsed.medicaments,
          actions: parsed.actions,
          consulter: parsed.consulter,
          signes_alarme: parsed.signes_alarme,
        });
      }
      setStep(3);
    } catch (err) {
      setError("Erreur lors de l'analyse. Vérifiez votre connexion et réessayez.");
    } finally {
      setAnalyzing(false);
    }
  };

  const reset = () => {
    setStep(1); setDescription(""); setSelected([]);
    setAge(""); setResult(null); setError(null);
  };

  const urgenceCfg = result?.urgence ? (URGENCE_CONFIG[result.urgence] || URGENCE_CONFIG["faible"]) : null;

  return (
    <div style={{ minHeight: "100vh", background: "#F8FBFF" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --navy: #0A1628; --blue: #1B6FBF; --sky: #5BA8E5;
          --ice: #EBF4FF; --gold: #C9A84C; --border: rgba(91,168,229,0.15);
        }
        @keyframes rise    { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.5} }
        .rise { animation: rise 0.7s cubic-bezier(0.16,1,0.3,1) forwards; opacity:0; }
        .d1{animation-delay:0.05s} .d2{animation-delay:0.15s} .d3{animation-delay:0.25s}
        .d4{animation-delay:0.38s} .d5{animation-delay:0.5s}
        .chip {
          display:inline-flex; align-items:center; gap:6px; padding:9px 16px;
          border-radius:50px; border:1px solid var(--border); background:white;
          color:var(--blue); font-family:'DM Sans',sans-serif; font-size:13px;
          font-weight:500; cursor:pointer; transition:all 0.2s;
        }
        .chip:hover { border-color:var(--sky); background:var(--ice); transform:translateY(-1px); }
        .chip.on { background:var(--navy); border-color:var(--navy); color:white; }
        .cta {
          display:inline-flex; align-items:center; gap:10px; padding:16px 32px;
          border-radius:50px; border:none; background:var(--navy); color:white;
          font-family:'DM Sans',sans-serif; font-size:15px; font-weight:500;
          cursor:pointer; transition:all 0.3s;
        }
        .cta:hover { transform:translateY(-2px); box-shadow:0 12px 32px rgba(10,22,40,0.25); }
        .cta:disabled { opacity:0.5; cursor:not-allowed; transform:none; }
        .ghost {
          display:inline-flex; align-items:center; gap:8px; padding:15px 24px;
          border-radius:50px; border:1.5px solid var(--border); background:transparent;
          color:var(--blue); font-family:'DM Sans',sans-serif; font-size:15px;
          font-weight:500; cursor:pointer; transition:all 0.2s;
        }
        .ghost:hover { border-color:var(--sky); background:var(--ice); }
        .field {
          width:100%; padding:16px 20px; border-radius:14px; border:1px solid var(--border);
          background:white; font-family:'DM Sans',sans-serif; font-size:15px; color:var(--navy);
          outline:none; transition:border-color 0.2s,box-shadow 0.2s; resize:none; line-height:1.6;
        }
        .field:focus { border-color:var(--sky); box-shadow:0 0 0 4px rgba(91,168,229,0.1); }
        .field::placeholder { color:#B8C5D3; }
        .card {
          background:white; border-radius:20px; border:1px solid var(--border);
          box-shadow:0 2px 32px rgba(27,111,191,0.06); padding:28px;
        }
        .gold-line { height:2px; background:linear-gradient(90deg,transparent,var(--gold),transparent); border:none; }
        .snode {
          width:30px; height:30px; border-radius:50%; display:flex; align-items:center;
          justify-content:center; font-family:'DM Sans',sans-serif; font-size:12px;
          font-weight:600; flex-shrink:0; transition:all 0.3s;
        }
        .snode.done   { background:var(--navy); color:white; }
        .snode.active { background:var(--gold); color:var(--navy); }
        .snode.idle   { background:#EBF4FF; color:#93A5B8; }
        .sline { flex:1; height:1px; background:var(--border); }
        .sline.done { background:var(--navy); }
        .result-section { border-radius:16px; padding:22px 24px; margin-bottom:14px; }
        .result-label {
          font-family:'DM Sans',sans-serif; font-size:11px; font-weight:700;
          letter-spacing:0.1em; text-transform:uppercase; margin-bottom:10px;
        }
        .result-list { list-style:none; padding:0; }
        .result-list li {
          font-family:'DM Sans',sans-serif; font-size:14px; line-height:1.7;
          padding:5px 0; display:flex; gap:10px; border-bottom:1px solid rgba(0,0,0,0.04);
        }
        .result-list li:last-child { border-bottom:none; }
        .urgence-badge {
          display:inline-flex; align-items:center; gap:8px; padding:6px 14px;
          border-radius:50px; font-family:'DM Sans',sans-serif; font-size:12px; font-weight:600;
          letter-spacing:0.06em; text-transform:uppercase;
        }
        .urgence-dot { width:7px; height:7px; border-radius:50%; animation: pulse 2s ease-in-out infinite; }
        .history-card {
          background:white; border-radius:16px; border:1px solid var(--border);
          box-shadow:0 2px 16px rgba(27,111,191,0.05); margin-bottom:12px;
          overflow:hidden; transition:box-shadow 0.2s;
        }
        .history-card:hover { box-shadow:0 4px 24px rgba(27,111,191,0.1); }
        .history-header {
          padding:18px 22px; cursor:pointer; display:flex;
          align-items:center; justify-content:space-between; gap:12;
        }
        .history-body { padding:0 22px 18px; border-top:1px solid var(--border); }
        .carnet-btn {
          display:inline-flex; align-items:center; gap:6px; padding:8px 16px;
          border-radius:50px; border:1.5px solid var(--gold); background:transparent;
          color:var(--gold); font-family:'DM Sans',sans-serif; font-size:12px;
          font-weight:600; cursor:pointer; transition:all 0.2s;
        }
        .carnet-btn:hover { background:rgba(201,168,76,0.08); }
      `}</style>

      {/* ── DISCLAIMER MODAL ── */}
      {step === 0 && (
        <div style={{position:"fixed",inset:0,zIndex:100,background:"rgba(8,16,30,0.8)",backdropFilter:"blur(16px)",display:"flex",alignItems:"center",justifyContent:"center",padding:24,animation:"fadeIn 0.4s ease"}}>
          <div style={{background:"white",borderRadius:24,maxWidth:440,width:"100%",overflow:"hidden",boxShadow:"0 40px 80px rgba(10,22,40,0.3)"}}>
            <div style={{height:4,background:"linear-gradient(90deg,#1B6FBF,#C9A84C)"}}/>
            <div style={{padding:"32px 32px 28px"}}>
              <svg width="44" height="44" viewBox="0 0 48 48" fill="none" style={{marginBottom:20}}>
                <rect width="48" height="48" rx="14" fill="#EBF4FF"/>
                <path d="M24 14v10m0 4v2" stroke="#1B6FBF" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="24" cy="24" r="14" stroke="#5BA8E5" strokeWidth="1.5" fill="none"/>
              </svg>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:600,color:"#0A1628",marginBottom:10}}>Avant de commencer</h2>
              <p style={{fontFamily:"'DM Sans',sans-serif",color:"#6B7A8D",fontSize:14,lineHeight:1.65,marginBottom:18}}>
                MediScan est un <strong style={{color:"#1B6FBF"}}>outil d'information médicale</strong>, pas un substitut à une consultation médicale.
              </p>
              <div style={{background:"#FEF9EC",border:"1px solid rgba(201,168,76,0.3)",borderRadius:12,padding:"12px 16px",marginBottom:24,fontFamily:"'DM Sans',sans-serif",color:"#8B6914",fontSize:13,lineHeight:1.6}}>
                En cas d'urgence, appelez le <strong>15 (SAMU)</strong> ou le <strong>112</strong>.
              </div>
              <button className="cta" style={{width:"100%",justifyContent:"center"}} onClick={() => setStep(1)}>
                J'ai compris — Accéder au service
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── HEADER ── */}
      <header style={{position:"sticky",top:0,zIndex:50,background:"rgba(248,251,255,0.92)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(91,168,229,0.15)"}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"0 28px",height:64,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={() => setStep(step > 0 ? 1 : 0)}>
            <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="10" fill="#0A1628"/>
              <path d="M18 10v6m0 0v6m0-6h-6m6 0h6" stroke="#5BA8E5" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="18" cy="22" r="2" fill="#C9A84C"/>
            </svg>
            <div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:19,fontWeight:600,color:"#0A1628"}}>Medi<span style={{color:"#1B6FBF"}}>Scan</span></div>
              <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:9,color:"#C9A84C",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase"}}>Intelligence Médicale</div>
            </div>
          </div>

          {user ? (
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <button className="carnet-btn" onClick={openCarnet}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                Mon carnet
              </button>
              <div style={{width:34,height:34,borderRadius:"50%",background:"#0A1628",border:"2px solid #C9A84C",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:600,color:"#C9A84C"}}>
                {user.email?.slice(0,2).toUpperCase()}
              </div>
              <button className="ghost" style={{padding:"7px 16px",fontSize:12}} onClick={() => supabase.auth.signOut()}>
                Déconnexion
              </button>
            </div>
          ) : (
            <button className="ghost" style={{padding:"9px 20px",fontSize:13}}>Se connecter</button>
          )}
        </div>
      </header>

      {/* ── ÉTAPE 1 : SYMPTÔMES ── */}
      {step === 1 && (
        <main style={{maxWidth:720,margin:"0 auto",padding:"56px 28px 72px"}}>
          <div style={{marginBottom:48}}>
            <div className="rise d1" style={{display:"inline-flex",alignItems:"center",gap:10,fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:600,color:"#C9A84C",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:18}}>
              <div style={{width:20,height:1,background:"#C9A84C"}}/> IA Médicale Avancée <div style={{width:20,height:1,background:"#C9A84C"}}/>
            </div>
            <h1 className="rise d2" style={{fontFamily:"'Cormorant Garamond',serif",fontSize:48,fontWeight:300,color:"#0A1628",lineHeight:1.15,marginBottom:16}}>
              Comprenez vos <em style={{color:"#1B6FBF",fontStyle:"italic"}}>symptômes</em> maintenant.
            </h1>
            <p className="rise d3" style={{fontFamily:"'DM Sans',sans-serif",fontSize:16,color:"#6B7A8D",lineHeight:1.7}}>
              Décrivez ce que vous ressentez. Notre IA analyse vos symptômes et vous guide.
            </p>
          </div>
          <hr className="gold-line rise d3" style={{marginBottom:40}}/>
          <div className="rise d4" style={{display:"flex",alignItems:"center",gap:0,marginBottom:28,maxWidth:280}}>
            <div className="snode active">1</div>
            <div className="sline"/>
            <div className="snode idle">2</div>
            <div className="sline"/>
            <div className="snode idle">3</div>
            <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#93A5B8",marginLeft:14}}>Étape 1 sur 3</span>
          </div>
          <div className="rise d5 card">
            <label style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:600,color:"#93A5B8",letterSpacing:"0.1em",textTransform:"uppercase",display:"block",marginBottom:10}}>Décrivez vos symptômes</label>
            <textarea className="field" rows={4} placeholder="Ex : Depuis hier, j'ai mal à la gorge et une légère fièvre..." value={description} onChange={e => setDescription(e.target.value)}/>
            <div style={{display:"flex",alignItems:"center",gap:12,margin:"20px 0",fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#B8C5D3"}}>
              <div style={{flex:1,height:1,background:"rgba(91,168,229,0.15)"}}/>Ou sélectionnez ci-dessous<div style={{flex:1,height:1,background:"rgba(91,168,229,0.15)"}}/>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:28}}>
              {SYMPTOMS.map(s => (
                <button key={s} className={`chip ${selected.includes(s) ? "on" : ""}`} onClick={() => toggle(s)}>
                  {selected.includes(s) && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                  {s}
                </button>
              ))}
            </div>
            <button className="cta" style={{width:"100%",justifyContent:"center"}} onClick={() => setStep(2)} disabled={!description.trim() && selected.length === 0}>
              Continuer <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </main>
      )}

      {/* ── ÉTAPE 2 : CONFIRMATION ── */}
      {step === 2 && (
        <main style={{maxWidth:720,margin:"0 auto",padding:"56px 28px 72px"}}>
          <div style={{display:"flex",alignItems:"center",gap:0,marginBottom:36,maxWidth:280}}>
            <div className="snode done"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg></div>
            <div className="sline done"/>
            <div className="snode active">2</div>
            <div className="sline"/>
            <div className="snode idle">3</div>
            <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#93A5B8",marginLeft:14}}>Étape 2 sur 3</span>
          </div>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:36,fontWeight:600,color:"#0A1628",marginBottom:8}}>Confirmez votre profil</h2>
          <p style={{fontFamily:"'DM Sans',sans-serif",color:"#6B7A8D",fontSize:15,marginBottom:28}}>Vérifiez avant de lancer l'analyse.</p>
          <div className="card" style={{marginBottom:14}}>
            {description && (
              <div style={{marginBottom:20}}>
                <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:600,color:"#93A5B8",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>Description</div>
                <div style={{background:"#F8FBFF",borderRadius:10,padding:"12px 16px",fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#3D4F63",lineHeight:1.6}}>{description}</div>
              </div>
            )}
            {selected.length > 0 && (
              <div style={{marginBottom:20}}>
                <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:600,color:"#93A5B8",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>Symptômes sélectionnés</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{selected.map(s => <span key={s} className="chip on" style={{cursor:"default"}}>{s}</span>)}</div>
              </div>
            )}
            <hr className="gold-line" style={{margin:"20px 0"}}/>
            <label style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:600,color:"#93A5B8",letterSpacing:"0.1em",textTransform:"uppercase",display:"block",marginBottom:8}}>Âge (optionnel)</label>
            <input type="number" className="field" placeholder="Ex: 28" value={age} onChange={e => setAge(e.target.value)} style={{maxWidth:140}}/>
          </div>
          {error && (
            <div style={{background:"#FFF5F5",border:"1px solid rgba(220,53,69,0.2)",borderRadius:12,padding:"12px 16px",fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#C0392B",marginBottom:14}}>{error}</div>
          )}
          <div style={{display:"flex",gap:10}}>
            <button className="ghost" onClick={() => setStep(1)}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg> Retour
            </button>
            <button className="cta" style={{flex:1,justifyContent:"center"}} onClick={handleAnalyze} disabled={analyzing}>
              {analyzing ? "Analyse en cours..." : "Lancer l'analyse"}
              {!analyzing && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>}
            </button>
          </div>
          {analyzing && (
            <div style={{position:"fixed",inset:0,zIndex:200,background:"rgba(8,16,30,0.85)",backdropFilter:"blur(20px)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:28}}>
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={{animation:"spin 1.2s linear infinite"}}>
                <circle cx="32" cy="32" r="28" stroke="rgba(91,168,229,0.2)" strokeWidth="2"/>
                <path d="M32 4 A28 28 0 0 1 60 32" stroke="#5BA8E5" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              <div style={{textAlign:"center"}}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:"white",marginBottom:6}}>Analyse en cours</div>
                <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"rgba(255,255,255,0.45)"}}>Notre IA examine vos symptômes...</div>
              </div>
            </div>
          )}
        </main>
      )}

      {/* ── ÉTAPE 3 : RÉSULTATS ── */}
      {step === 3 && result && (
        <main style={{maxWidth:720,margin:"0 auto",padding:"56px 28px 72px",animation:"fadeIn 0.6s ease"}}>
          <div style={{background:"linear-gradient(135deg,#0A1628,#1B3A6B)",borderRadius:20,padding:"32px 36px",marginBottom:20,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,right:0,width:180,height:180,background:"radial-gradient(circle,rgba(201,168,76,0.12),transparent 70%)"}}/>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12,marginBottom:14}}>
              <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(201,168,76,0.15)",borderRadius:50,padding:"5px 14px"}}>
                <div style={{width:5,height:5,borderRadius:"50%",background:"#C9A84C"}}/>
                <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:600,color:"#C9A84C",letterSpacing:"0.1em",textTransform:"uppercase"}}>Analyse complète</span>
              </div>
              {urgenceCfg && (
                <div className="urgence-badge" style={{background:urgenceCfg.bg,border:`1px solid ${urgenceCfg.border}`,color:urgenceCfg.color}}>
                  <div className="urgence-dot" style={{background:urgenceCfg.dot}}/>
                  Urgence {urgenceCfg.label}
                </div>
              )}
            </div>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:400,color:"white",marginBottom:6}}>Résultats de votre analyse</h2>
            <p style={{fontFamily:"'DM Sans',sans-serif",color:"rgba(255,255,255,0.4)",fontSize:13}}>{age ? `Patient de ${age} ans` : "Analyse personnalisée"}</p>
          </div>
          <div className="result-section" style={{background:"#EBF4FF",border:"1px solid rgba(27,111,191,0.15)"}}>
            <div className="result-label" style={{color:"#1B6FBF"}}>Diagnostic probable</div>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,color:"#0A1628",lineHeight:1.7}}>{result.diagnostic}</p>
          </div>
          {result.medicaments?.length > 0 && (
            <div className="result-section" style={{background:"#FDFAF2",border:"1px solid rgba(201,168,76,0.2)"}}>
              <div className="result-label" style={{color:"#C9A84C"}}>Médicaments suggérés</div>
              <ul className="result-list">
                {result.medicaments.map((m,i) => <li key={i} style={{color:"#3D4F63"}}><span style={{color:"#C9A84C",fontWeight:600,flexShrink:0}}>—</span>{m}</li>)}
              </ul>
            </div>
          )}
          {result.actions?.length > 0 && (
            <div className="result-section" style={{background:"#F0FAF4",border:"1px solid rgba(39,174,96,0.15)"}}>
              <div className="result-label" style={{color:"#27AE60"}}>Actions recommandées</div>
              <ul className="result-list">
                {result.actions.map((a,i) => <li key={i} style={{color:"#2D5A3D"}}><span style={{color:"#27AE60",fontWeight:600,flexShrink:0}}>—</span>{a}</li>)}
              </ul>
            </div>
          )}
          {result.consulter && (
            <div className="result-section" style={{background:"#F5F0FF",border:"1px solid rgba(128,0,128,0.12)"}}>
              <div className="result-label" style={{color:"#7B2FBE"}}>Quand consulter un médecin</div>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#3D2B5A",lineHeight:1.7}}>{result.consulter}</p>
            </div>
          )}
          {result.signes_alarme?.length > 0 && (
            <div className="result-section" style={{background:"#FFF5F5",border:"1px solid rgba(192,57,43,0.2)"}}>
              <div className="result-label" style={{color:"#C0392B"}}>⚠️ Appelez le 15 si vous ressentez</div>
              <ul className="result-list">
                {result.signes_alarme.map((s,i) => <li key={i} style={{color:"#7B1A1A"}}><span style={{color:"#C0392B",fontWeight:600,flexShrink:0}}>—</span>{s}</li>)}
              </ul>
            </div>
          )}
          <div style={{background:"#FEF9EC",border:"1px solid rgba(201,168,76,0.2)",borderRadius:14,padding:"14px 18px",marginBottom:28,fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#8B6914",lineHeight:1.6}}>
            Informations indicatives uniquement. Consultez un médecin pour tout symptôme persistant ou qui s'aggrave.
          </div>
          <div style={{display:"flex",gap:10}}>
            <button className="cta" style={{flex:1,justifyContent:"center"}} onClick={reset}>
              Nouvelle analyse
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
            </button>
            {user && (
              <button className="ghost" onClick={openCarnet}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                Mon carnet
              </button>
            )}
          </div>
        </main>
      )}

      {/* ── ÉTAPE 4 : CARNET DE SANTÉ ── */}
      {step === 4 && (
        <main style={{maxWidth:720,margin:"0 auto",padding:"56px 28px 72px",animation:"fadeIn 0.5s ease"}}>
          <div style={{marginBottom:36}}>
            <button className="ghost" style={{marginBottom:24,padding:"9px 18px",fontSize:13}} onClick={() => setStep(1)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Retour
            </button>
            <div style={{display:"inline-flex",alignItems:"center",gap:10,fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:600,color:"#C9A84C",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:12}}>
              <div style={{width:20,height:1,background:"#C9A84C"}}/> Historique personnel <div style={{width:20,height:1,background:"#C9A84C"}}/>
            </div>
            <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:40,fontWeight:300,color:"#0A1628",lineHeight:1.15,marginBottom:8}}>
              Mon <em style={{color:"#1B6FBF",fontStyle:"italic"}}>carnet</em> de santé
            </h1>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,color:"#6B7A8D"}}>
              Vos {history.length} dernière{history.length > 1 ? "s" : ""} analyse{history.length > 1 ? "s" : ""} MediScan
            </p>
          </div>
          <hr className="gold-line" style={{marginBottom:32}}/>

          {historyLoading ? (
            <div style={{textAlign:"center",padding:"48px 0"}}>
              <svg width="40" height="40" viewBox="0 0 64 64" fill="none" style={{animation:"spin 1.2s linear infinite",margin:"0 auto 16px"}}>
                <circle cx="32" cy="32" r="28" stroke="rgba(91,168,229,0.2)" strokeWidth="2"/>
                <path d="M32 4 A28 28 0 0 1 60 32" stroke="#5BA8E5" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              <p style={{fontFamily:"'DM Sans',sans-serif",color:"#93A5B8",fontSize:14}}>Chargement de votre historique...</p>
            </div>
          ) : history.length === 0 ? (
            <div style={{textAlign:"center",padding:"48px 0",background:"white",borderRadius:20,border:"1px solid var(--border)"}}>
              <div style={{fontSize:40,marginBottom:16}}>📋</div>
              <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:"#0A1628",marginBottom:8}}>Aucune analyse pour l'instant</p>
              <p style={{fontFamily:"'DM Sans',sans-serif",color:"#93A5B8",fontSize:14,marginBottom:24}}>Vos prochaines analyses apparaîtront ici automatiquement.</p>
              <button className="cta" onClick={() => setStep(1)}>
                Lancer une analyse
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          ) : (
            history.map((item) => {
              const cfg = URGENCE_CONFIG[item.urgence] || URGENCE_CONFIG["faible"];
              const isOpen = expanded === item.id;
              return (
                <div key={item.id} className="history-card">
                  <div className="history-header" onClick={() => setExpanded(isOpen ? null : item.id)}>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6,flexWrap:"wrap"}}>
                        <div className="urgence-badge" style={{background:cfg.bg,border:`1px solid ${cfg.border}`,color:cfg.color,fontSize:11,padding:"4px 10px"}}>
                          <div className="urgence-dot" style={{background:cfg.dot,width:6,height:6}}/>
                          {cfg.label}
                        </div>
                        <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#93A5B8"}}>{formatDate(item.created_at)}</span>
                      </div>
                      <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#3D4F63",lineHeight:1.5,overflow:"hidden",textOverflow:"ellipsis",display:"-webkit-box",WebkitLineClamp:isOpen?undefined:2,WebkitBoxOrient:"vertical"}}>
                        {item.diagnostic}
                      </p>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#93A5B8" strokeWidth="2" style={{flexShrink:0,transform:isOpen?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.2s"}}>
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </div>
                  {isOpen && (
                    <div className="history-body">
                      {item.symptoms_description && (
                        <div style={{marginBottom:14}}>
                          <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,fontWeight:700,color:"#93A5B8",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:6}}>Symptômes décrits</div>
                          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#6B7A8D",lineHeight:1.6,background:"#F8FBFF",borderRadius:8,padding:"10px 14px"}}>{item.symptoms_description}</p>
                        </div>
                      )}
                      {item.medicaments?.length > 0 && (
                        <div style={{marginBottom:14}}>
                          <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,fontWeight:700,color:"#C9A84C",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:6}}>Médicaments</div>
                          {item.medicaments.map((m,i) => <p key={i} style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#3D4F63",padding:"3px 0"}}>— {m}</p>)}
                        </div>
                      )}
                      {item.consulter && (
                        <div style={{background:"#F5F0FF",borderRadius:10,padding:"10px 14px"}}>
                          <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:600,color:"#7B2FBE"}}>Consulter : </span>
                          <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#3D2B5A"}}>{item.consulter}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </main>
      )}

      {/* ── FOOTER ── */}
      <footer style={{borderTop:"1px solid rgba(91,168,229,0.15)",padding:"24px 28px"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
          <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:13,color:"#B8C5D3"}}>© 2026 MediScan</span>
          <div style={{display:"flex",gap:20}}>
            {["Confidentialité","CGU","Mentions légales"].map(l => (
              <a key={l} href={`/${l==="Confidentialité"?"confidentialite":l==="CGU"?"cgu":"mentions-legales"}`} style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#93A5B8",textDecoration:"none"}}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
