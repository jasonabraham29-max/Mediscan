import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

const SYMPTOMS = [
  "Fièvre", "Maux de tête", "Toux sèche", "Essoufflement",
  "Douleur thoracique", "Nausées", "Fatigue intense", "Vertiges",
  "Mal de gorge", "Douleurs musculaires", "Maux de dos", "Palpitations",
  "Frissons", "Perte d'appétit", "Troubles du sommeil"
];

export default function App() {
  const [step, setStep] = useState(0);
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState([]);
  const [age, setAge] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);const [user, setUser] = useState(null);

useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    setUser(session?.user ?? null);
  });
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null);
  });
  return () => subscription.unsubscribe();
}, []);

const handleLogout = async () => {
  await supabase.auth.signOut();
  setUser(null);
};

const getInitials = (email) => email ? email.substring(0, 2).toUpperCase() : "??";

  const toggle = (s) => setSelected(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setError(null);
    const symptomsText = [
      description && `Description : ${description}`,
      selected.length > 0 && `Symptômes : ${selected.join(", ")}`,
      age && `Âge : ${age} ans`,
    ].filter(Boolean).join("\n");
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
          max_tokens: 1000,
          messages: [{ role: "user", content: `Tu es un assistant médical informatif. Réponds UNIQUEMENT en JSON valide sans markdown ni backticks.\n\n${symptomsText}\n\nFormat exact:\n{"diagnostic":"...","medicaments":["...","..."],"actions":["...","..."]}` }],
        }),
      });
      const data = await response.json();
      const text = data.content?.[0]?.text || "";
      const parsed = JSON.parse(text.trim());
      setResult(parsed);
      setStep(4);
    } catch (err) {
      setError("Erreur lors de l'analyse. Réessayez.");
    } finally {
      setAnalyzing(false);
    }
  };

  const reset = () => { setStep(0); setDescription(""); setSelected([]); setAge(""); setResult(null); setError(null); };

  return (
    <div style={{ minHeight: "100vh", background: "#F8FBFF", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --navy:#0A1628; --navy2:#1B3A6B; --blue:#1B6FBF; --sky:#5BA8E5; --ice:#EBF4FF; --gold:#C9A84C; --border:rgba(91,168,229,0.15); }
        @keyframes fadeUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        .fade-up { animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) forwards; opacity:0; }
        .d1{animation-delay:0.1s} .d2{animation-delay:0.22s} .d3{animation-delay:0.34s} .d4{animation-delay:0.46s} .d5{animation-delay:0.58s}
        .btn-primary { display:inline-flex; align-items:center; gap:12px; padding:18px 40px; border-radius:50px; border:none; background:linear-gradient(135deg,var(--navy),var(--navy2)); color:white; font-family:'DM Sans',sans-serif; font-size:15px; font-weight:500; cursor:pointer; letter-spacing:0.03em; transition:all 0.4s cubic-bezier(0.16,1,0.3,1); box-shadow:0 8px 32px rgba(10,22,40,0.2); }
        .btn-primary:hover { transform:translateY(-3px); box-shadow:0 20px 48px rgba(10,22,40,0.3); }
        .btn-primary:disabled { opacity:0.5; cursor:not-allowed; transform:none; }
        .btn-ghost { display:inline-flex; align-items:center; gap:8px; padding:15px 28px; border-radius:50px; border:1.5px solid var(--border); background:transparent; color:var(--blue); font-family:'DM Sans',sans-serif; font-size:14px; font-weight:500; cursor:pointer; transition:all 0.2s; }
        .btn-ghost:hover { border-color:var(--sky); background:var(--ice); }
        .chip { display:inline-flex; align-items:center; gap:6px; padding:10px 18px; border-radius:50px; border:1px solid var(--border); background:white; color:var(--blue); font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; cursor:pointer; transition:all 0.2s; }
        .chip:hover { border-color:var(--sky); background:var(--ice); transform:translateY(-1px); }
        .chip.on { background:var(--navy); border-color:var(--navy); color:white; }
        .field { width:100%; padding:18px 22px; border-radius:16px; border:1px solid var(--border); background:white; font-family:'DM Sans',sans-serif; font-size:15px; color:var(--navy); outline:none; transition:all 0.2s; resize:none; line-height:1.65; }
        .field:focus { border-color:var(--sky); box-shadow:0 0 0 4px rgba(91,168,229,0.08); }
        .field::placeholder { color:#B8C5D3; }
        .card { background:white; border-radius:24px; border:1px solid var(--border); box-shadow:0 4px 48px rgba(27,111,191,0.06); padding:32px; }
        .gold-line { height:1px; background:linear-gradient(90deg,transparent,var(--gold),transparent); border:none; }
        .snode { width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:'DM Sans',sans-serif; font-size:12px; font-weight:600; flex-shrink:0; transition:all 0.4s; }
        .snode.done { background:var(--navy); color:white; }
        .snode.active { background:var(--gold); color:var(--navy); box-shadow:0 4px 16px rgba(201,168,76,0.4); }
        .snode.idle { background:#EBF4FF; color:#93A5B8; }
        .sline { flex:1; height:1px; background:var(--border); transition:background 0.4s; }
        .sline.done { background:var(--navy); }
        .hero-orb { position:absolute; border-radius:50%; background:radial-gradient(circle,rgba(201,168,76,0.12),transparent 70%); animation:float 6s ease-in-out infinite; }
        .feature-card { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:20px; padding:28px 24px; transition:all 0.3s; }
        .feature-card:hover { background:rgba(255,255,255,0.07); border-color:rgba(201,168,76,0.3); transform:translateY(-4px); }
        @media(max-width:768px) { .hero-title{font-size:42px!important} .stats-row{flex-direction:column!important;gap:24px!important} .features-grid{grid-template-columns:1fr!important} }
      `}</style>

      {/* HEADER */}
      <header style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"0 32px",height:68,background:step===0?"transparent":"rgba(248,251,255,0.95)",backdropFilter:"blur(20px)",borderBottom:step===0?"none":"1px solid rgba(91,168,229,0.15)",transition:"all 0.4s"}}>
        <div style={{maxWidth:1200,margin:"0 auto",height:"100%",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,borderRadius:10,background:step===0?"rgba(255,255,255,0.1)":"#0A1628",border:step===0?"1px solid rgba(255,255,255,0.15)":"none",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.4s"}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2v6m0 0v6m0-6H6m6 0h6" stroke="#5BA8E5" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="12" cy="16" r="2" fill="#C9A84C"/>
              </svg>
            </div>
            <div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600,color:step===0?"white":"#0A1628",lineHeight:1.1,transition:"color 0.4s"}}>Medi<span style={{color:"#5BA8E5"}}>Scan</span></div>
              <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:9,color:"#C9A84C",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase"}}>Intelligence Médicale</div>
            </div>
          </div>
          <button onClick={() => window.location.href="/auth"} style={{padding:"9px 22px",borderRadius:50,border:step===0?"1px solid rgba(255,255,255,0.2)":"1px solid rgba(27,111,191,0.2)",background:"transparent",color:step===0?"rgba(255,255,255,0.8)":"#1B6FBF",fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:500,cursor:"pointer",transition:"all 0.3s"}}>
            {user ? (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <div style={{
      width: 34, height: 34, borderRadius: "50%",
      background: "linear-gradient(135deg, #0A1628, #1B6FBF)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif", fontSize: 12,
      fontWeight: 700, color: "white",
      border: "2px solid rgba(201,168,76,0.4)"
    }}>
      {getInitials(user.email)}
    </div>
    <span style={{
      fontFamily: "'DM Sans', sans-serif", fontSize: 13,
      color: "#1B6FBF", fontWeight: 500,
      maxWidth: 140, overflow: "hidden",
      textOverflow: "ellipsis", whiteSpace: "nowrap"
    }}>
      {user.email}
    </span>
    <button className="ghost" style={{ padding: "8px 18px", fontSize: 12 }}
      onClick={handleLogout}>
      Déconnexion
    </button>
  </div>
) : (
  <button className="ghost" style={{ padding: "10px 22px", fontSize: 13 }}
    onClick={() => window.location.href = "/auth"}>
    Se connecter
  </button>
)}
          </button>
        </div>
      </header>

      {/* LANDING - STEP 0 */}
      {step === 0 && (
        <>
          <section style={{minHeight:"100vh",background:"linear-gradient(160deg,#0A1628 0%,#1B3A6B 50%,#0F2340 100%)",display:"flex",alignItems:"center",paddingTop:68,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 30% 50%,rgba(201,168,76,0.08),transparent 60%),radial-gradient(ellipse at 80% 20%,rgba(91,168,229,0.06),transparent 50%)"}}/>
            <div className="hero-orb" style={{width:600,height:600,top:-100,right:-200}}/>
            <div className="hero-orb" style={{width:300,height:300,bottom:50,left:-50,animationDelay:"3s"}}/>
            <div style={{maxWidth:1200,margin:"0 auto",padding:"80px 32px",width:"100%",position:"relative",zIndex:1}}>
              <div style={{maxWidth:760}}>
                <div className="fade-up d1" style={{display:"inline-flex",alignItems:"center",gap:10,marginBottom:32}}>
                  <div style={{width:32,height:1,background:"linear-gradient(90deg,transparent,#C9A84C)"}}/>
                  <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:600,color:"#C9A84C",letterSpacing:"0.15em",textTransform:"uppercase"}}>Intelligence Artificielle Médicale</span>
                  <div style={{width:32,height:1,background:"linear-gradient(90deg,#C9A84C,transparent)"}}/>
                </div>
                <h1 className="fade-up d2 hero-title" style={{fontFamily:"'Cormorant Garamond',serif",fontSize:72,fontWeight:300,color:"white",lineHeight:1.08,marginBottom:28,letterSpacing:"-0.01em"}}>
                  Vos symptômes,<br/>
                  <span style={{fontStyle:"italic",color:"#5BA8E5"}}>compris</span> en{" "}
                  <span style={{position:"relative",display:"inline-block"}}>
                    30 secondes.
                    <svg style={{position:"absolute",bottom:-4,left:0,width:"100%"}} height="6" viewBox="0 0 300 6" preserveAspectRatio="none">
                      <path d="M0 4 Q75 1 150 3 Q225 5 300 2" stroke="#C9A84C" strokeWidth="1.5" fill="none" opacity="0.7"/>
                    </svg>
                  </span>
                </h1>
                <p className="fade-up d3" style={{fontFamily:"'DM Sans',sans-serif",fontSize:19,color:"rgba(255,255,255,0.55)",lineHeight:1.75,marginBottom:48,maxWidth:520,fontWeight:300}}>
                  MediScan analyse vos symptômes grâce à l'intelligence artificielle et vous guide vers la meilleure décision — en toute confidentialité.
                </p>
                <div className="fade-up d4" style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
                  <button className="btn-primary" onClick={() => setStep(1)} style={{fontSize:16,padding:"20px 48px"}}>
                    Analyser mes symptômes
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </button>
                  <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"rgba(255,255,255,0.3)"}}>Gratuit · Sans inscription</span>
                </div>
              </div>
              <div className="fade-up d5 stats-row" style={{display:"flex",gap:64,marginTop:96,paddingTop:48,borderTop:"1px solid rgba(255,255,255,0.08)"}}>
                {[{num:"30s",label:"Temps d'analyse"},{num:"0",label:"Données conservées"},{num:"3",label:"Langues disponibles"}].map(({num,label})=>(
                  <div key={label} style={{textAlign:"center"}}>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:48,fontWeight:300,color:"#C9A84C",lineHeight:1,marginBottom:6}}>{num}</div>
                    <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"rgba(255,255,255,0.45)",fontWeight:500,letterSpacing:"0.08em",textTransform:"uppercase"}}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section style={{background:"#0A1628",padding:"96px 32px"}}>
            <div style={{maxWidth:1200,margin:"0 auto"}}>
              <div style={{textAlign:"center",marginBottom:64}}>
                <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:600,color:"#C9A84C",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:16}}>Pourquoi MediScan</div>
                <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:42,fontWeight:300,color:"white",lineHeight:1.2}}>L'information médicale, <em style={{fontStyle:"italic",color:"#5BA8E5"}}>démocratisée</em></h2>
              </div>
              <div className="features-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24}}>
                {[
                  {icon:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",title:"100% Confidentiel",desc:"Vos données ne sont jamais stockées ni transmises. Chaque analyse est traitée en temps réel et effacée immédiatement."},
                  {icon:"M13 2L3 14h9l-1 8 10-12h-9l1-8z",title:"Résultat Instantané",desc:"En moins de 30 secondes, obtenez un diagnostic probable, des médicaments suggérés et des actions concrètes à suivre."},
                  {icon:"M22 12h-4l-3 9L9 3l-3 9H2",title:"IA Clinique",desc:"Propulsé par Claude d'Anthropic, l'un des modèles d'IA les plus avancés au monde, formé sur des données médicales rigoureuses."},
                ].map(({icon,title,desc})=>(
                  <div key={title} className="feature-card">
                    <div style={{width:44,height:44,borderRadius:12,background:"rgba(201,168,76,0.1)",border:"1px solid rgba(201,168,76,0.2)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20}}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={icon}/></svg>
                    </div>
                    <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:500,color:"white",marginBottom:12}}>{title}</h3>
                    <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"rgba(255,255,255,0.45)",lineHeight:1.75}}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section style={{background:"linear-gradient(135deg,#0A1628,#1B3A6B)",padding:"80px 32px",textAlign:"center",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at center,rgba(201,168,76,0.06),transparent 70%)"}}/>
            <div style={{position:"relative",zIndex:1}}>
              <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:600,color:"#C9A84C",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:16}}>Prêt à commencer ?</div>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:48,fontWeight:300,color:"white",marginBottom:16,lineHeight:1.15}}>Obtenez votre analyse <em style={{fontStyle:"italic"}}>maintenant</em></h2>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,color:"rgba(255,255,255,0.4)",marginBottom:40}}>Gratuit · Sans inscription · Résultat en 30 secondes</p>
              <button className="btn-primary" onClick={() => setStep(1)} style={{fontSize:16,padding:"20px 52px"}}>
                Commencer l'analyse
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </section>

          <footer style={{background:"#060E1A",padding:"32px",borderTop:"1px solid rgba(255,255,255,0.04)"}}>
            <div style={{maxWidth:1200,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
              <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:14,color:"rgba(255,255,255,0.2)"}}>© 2026 MediScan — Intelligence Médicale</span>
              <div style={{display:"flex",gap:24}}>
                {["Confidentialité","CGU","Mentions légales"].map(l=>(
                  <a key={l} href={`/${l==="Confidentialité"?"confidentialite":l==="CGU"?"cgu":"mentions-legales"}`} style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"rgba(255,255,255,0.25)",textDecoration:"none"}}>{l}</a>
                ))}
              </div>
            </div>
          </footer>
        </>
      )}

      {/* STEP 1 — SYMPTOMS */}
      {step === 1 && (
        <div style={{minHeight:"100vh",paddingTop:68}}>
          <div style={{maxWidth:720,margin:"0 auto",padding:"56px 28px 80px"}}>
            <div style={{display:"flex",alignItems:"center",gap:0,marginBottom:48,maxWidth:300}}>
              <div className="snode active">1</div>
              <div className="sline"/>
              <div className="snode idle">2</div>
              <div className="sline"/>
              <div className="snode idle">3</div>
              <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#93A5B8",marginLeft:14}}>Étape 1 sur 3</span>
            </div>
            <div style={{marginBottom:40}}>
              <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:600,color:"#C9A84C",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:12}}>Décrivez vos symptômes</div>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:42,fontWeight:300,color:"#0A1628",lineHeight:1.15,marginBottom:12}}>Que ressentez-vous <em style={{fontStyle:"italic",color:"#1B6FBF"}}>en ce moment</em> ?</h2>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,color:"#6B7A8D",lineHeight:1.7}}>Décrivez vos symptômes librement ou sélectionnez parmi les plus courants.</p>
            </div>
            <hr className="gold-line" style={{marginBottom:40}}/>
            <div className="card">
              <label style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:600,color:"#93A5B8",letterSpacing:"0.1em",textTransform:"uppercase",display:"block",marginBottom:12}}>En vos propres mots</label>
              <textarea className="field" rows={4} placeholder="Ex : Depuis hier soir, j'ai mal à la gorge, une légère fièvre et des frissons..." value={description} onChange={e=>setDescription(e.target.value)}/>
              <div style={{display:"flex",alignItems:"center",gap:16,margin:"24px 0",fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#C8D5E0"}}>
                <div style={{flex:1,height:1,background:"var(--border)"}}/>ou sélectionnez ci-dessous<div style={{flex:1,height:1,background:"var(--border)"}}/>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:32}}>
                {SYMPTOMS.map(s=>(
                  <button key={s} className={`chip ${selected.includes(s)?"on":""}`} onClick={()=>toggle(s)}>
                    {selected.includes(s)&&<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                    {s}
                  </button>
                ))}
              </div>
              <div style={{display:"flex",gap:12}}>
                <button className="btn-ghost" onClick={()=>setStep(0)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                  Retour
                </button>
                <button className="btn-primary" style={{flex:1,justifyContent:"center"}} onClick={()=>setStep(2)} disabled={!description.trim()&&selected.length===0}>
                  Continuer
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2 — DISCLAIMER */}
      {step === 2 && (
        <div style={{minHeight:"100vh",paddingTop:68,display:"flex",alignItems:"center"}}>
          <div style={{maxWidth:560,margin:"0 auto",padding:"40px 28px"}}>
            <div style={{textAlign:"center",marginBottom:40}}>
              <div style={{width:72,height:72,borderRadius:20,background:"linear-gradient(135deg,#EBF4FF,#F8FBFF)",border:"1px solid rgba(27,111,191,0.15)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px"}}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#1B6FBF" strokeWidth="1.5" fill="none"/>
                  <path d="M12 8v4m0 4h.01" stroke="#1B6FBF" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:600,color:"#C9A84C",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:12}}>Information importante</div>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:36,fontWeight:400,color:"#0A1628",marginBottom:12,lineHeight:1.2}}>Avant votre analyse</h2>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,color:"#6B7A8D",lineHeight:1.75}}>MediScan est un <strong style={{color:"#1B6FBF",fontWeight:600}}>outil d'aide à l'information</strong> et ne remplace en aucun cas l'avis d'un professionnel de santé.</p>
            </div>
            <div style={{background:"#FEF9EC",border:"1px solid rgba(201,168,76,0.3)",borderRadius:16,padding:"20px 24px",marginBottom:16,display:"flex",gap:14,alignItems:"flex-start"}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{flexShrink:0,marginTop:2}}>
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#C9A84C" strokeWidth="2" fill="none"/>
                <line x1="12" y1="9" x2="12" y2="13" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round"/>
                <line x1="12" y1="17" x2="12.01" y2="17" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <div>
                <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:13,color:"#8B6914",marginBottom:4}}>Urgence médicale ?</div>
                <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#8B6914",lineHeight:1.65}}>Appelez le <strong>15 (SAMU)</strong> ou le <strong>112</strong> immédiatement.</div>
              </div>
            </div>
            <div style={{background:"#F0F7FF",border:"1px solid rgba(27,111,191,0.12)",borderRadius:16,padding:"16px 24px",marginBottom:32,fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#3D6899",lineHeight:1.65}}>
              Les résultats sont indicatifs. Consultez toujours un médecin pour un diagnostic officiel.
            </div>
            <div style={{display:"flex",gap:12}}>
              <button className="btn-ghost" onClick={()=>setStep(1)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Retour
              </button>
              <button className="btn-primary" style={{flex:1,justifyContent:"center"}} onClick={()=>setStep(3)}>
                J'ai compris — Continuer
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3 — CONFIRM */}
      {step === 3 && (
        <div style={{minHeight:"100vh",paddingTop:68}}>
          <div style={{maxWidth:720,margin:"0 auto",padding:"56px 28px 80px"}}>
            <div style={{display:"flex",alignItems:"center",gap:0,marginBottom:48,maxWidth:300}}>
              <div className="snode done"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg></div>
              <div className="sline done"/>
              <div className="snode done"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg></div>
              <div className="sline done"/>
              <div className="snode active">3</div>
              <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#93A5B8",marginLeft:14}}>Étape 3 sur 3</span>
            </div>
            <div style={{marginBottom:32}}>
              <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:600,color:"#C9A84C",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:12}}>Confirmation</div>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:42,fontWeight:300,color:"#0A1628",lineHeight:1.15}}>Vérifiez votre <em style={{fontStyle:"italic",color:"#1B6FBF"}}>profil</em></h2>
            </div>
            <div className="card" style={{marginBottom:16}}>
              {description&&(
                <div style={{marginBottom:24}}>
                  <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:600,color:"#93A5B8",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10}}>Description</div>
                  <div style={{background:"#F8FBFF",borderRadius:12,padding:"14px 18px",fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#3D4F63",lineHeight:1.65}}>{description}</div>
                </div>
              )}
              {selected.length>0&&(
                <div style={{marginBottom:24}}>
                  <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:600,color:"#93A5B8",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10}}>Symptômes</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{selected.map(s=><span key={s} className="chip on" style={{cursor:"default"}}>{s}</span>)}</div>
                </div>
              )}
              <hr className="gold-line" style={{margin:"24px 0"}}/>
              <label style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:600,color:"#93A5B8",letterSpacing:"0.1em",textTransform:"uppercase",display:"block",marginBottom:10}}>Âge (optionnel)</label>
              <input type="number" className="field" placeholder="Ex: 28" value={age} onChange={e=>setAge(e.target.value)} style={{maxWidth:140}}/>
            </div>
            {error&&<div style={{background:"#FFF5F5",border:"1px solid rgba(220,53,69,0.2)",borderRadius:14,padding:"14px 18px",fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#C0392B",marginBottom:16}}>{error}</div>}
            <div style={{display:"flex",gap:12}}>
              <button className="btn-ghost" onClick={()=>setStep(2)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Retour
              </button>
              <button className="btn-primary" style={{flex:1,justifyContent:"center"}} onClick={handleAnalyze} disabled={analyzing}>
                {analyzing?"Analyse en cours...":"Lancer l'analyse"}
                {!analyzing&&<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>}
              </button>
            </div>
            {analyzing&&(
              <div style={{position:"fixed",inset:0,zIndex:200,background:"rgba(8,16,30,0.9)",backdropFilter:"blur(24px)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:32}}>
                <svg width="72" height="72" viewBox="0 0 72 72" fill="none" style={{animation:"spin 1.4s linear infinite"}}>
                  <circle cx="36" cy="36" r="32" stroke="rgba(91,168,229,0.15)" strokeWidth="2"/>
                  <path d="M36 4 A32 32 0 0 1 68 36" stroke="#5BA8E5" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
                <div style={{textAlign:"center"}}>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:300,color:"white",marginBottom:8}}>Analyse en cours</div>
                  <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"rgba(255,255,255,0.35)"}}>Notre IA examine vos symptômes...</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 4 — RESULT */}
      {step===4&&result&&(
        <div style={{minHeight:"100vh",paddingTop:68}}>
          <div style={{maxWidth:720,margin:"0 auto",padding:"56px 28px 80px",animation:"fadeIn 0.8s ease"}}>
            <div style={{background:"linear-gradient(135deg,#0A1628,#1B3A6B)",borderRadius:28,padding:"40px 44px",marginBottom:24,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:-40,right:-40,width:200,height:200,background:"radial-gradient(circle,rgba(201,168,76,0.15),transparent 70%)"}}/>
              <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(201,168,76,0.15)",borderRadius:50,padding:"5px 14px",marginBottom:16}}>
                <div style={{width:5,height:5,borderRadius:"50%",background:"#C9A84C"}}/>
                <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:600,color:"#C9A84C",letterSpacing:"0.1em",textTransform:"uppercase"}}>Analyse complète</span>
              </div>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:300,color:"white",marginBottom:8}}>Résultats de votre analyse</h2>
              <p style={{fontFamily:"'DM Sans',sans-serif",color:"rgba(255,255,255,0.35)",fontSize:13}}>{age?`Patient de ${age} ans · `:""} Analyse personnalisée par IA</p>
            </div>
            <div style={{background:"#EBF4FF",border:"1px solid rgba(27,111,191,0.12)",borderRadius:20,padding:"26px 28px",marginBottom:16}}>
              <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:700,color:"#1B6FBF",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10}}>Diagnostic probable</div>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,color:"#0A1628",lineHeight:1.8}}>{result.diagnostic}</p>
            </div>
            <div style={{background:"#FDFAF2",border:"1px solid rgba(201,168,76,0.18)",borderRadius:20,padding:"26px 28px",marginBottom:16}}>
              <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:700,color:"#C9A84C",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10}}>Médicaments suggérés</div>
              <ul style={{listStyle:"none",padding:0}}>
                {result.medicaments.map((m,i)=>(
                  <li key={i} style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#3D4F63",lineHeight:1.75,padding:"5px 0",display:"flex",gap:12}}>
                    <span style={{color:"#C9A84C",fontWeight:700,flexShrink:0}}>—</span>{m}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{background:"#F0FAF4",border:"1px solid rgba(39,174,96,0.12)",borderRadius:20,padding:"26px 28px",marginBottom:24}}>
              <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:700,color:"#27AE60",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10}}>Actions recommandées</div>
              <ul style={{listStyle:"none",padding:0}}>
                {result.actions.map((a,i)=>(
                  <li key={i} style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#2D5A3D",lineHeight:1.75,padding:"5px 0",display:"flex",gap:12}}>
                    <span style={{color:"#27AE60",fontWeight:700,flexShrink:0}}>—</span>{a}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{background:"#FEF9EC",border:"1px solid rgba(201,168,76,0.2)",borderRadius:14,padding:"14px 20px",marginBottom:32,fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#8B6914",lineHeight:1.65}}>
              Informations indicatives uniquement. Consultez un médecin pour tout symptôme persistant.
            </div>
            <button className="btn-primary" style={{width:"100%",justifyContent:"center",padding:"18px"}} onClick={reset}>
              Nouvelle analyse
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
