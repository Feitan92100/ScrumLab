import { useState, useEffect, useRef } from "react";
import {
  Crown,
  Shield,
  Code2,
  Heart,
  Zap,
  Star,
  ChevronRight,
  RotateCcw,
  Trophy,
  Skull,
  Award,
  ArrowRight,
  Bell,
  BookOpen,
  History,
  LayoutDashboard,
  Menu,
  Search,
  UserCircle,
} from "lucide-react";

/* =========================================================================
   PALETTE & POLICES (injectées via <style>)
   ========================================================================= */

const PIXEL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap');

  .font-pixel { font-family: 'Press Start 2P', monospace; }
  .font-pixel-body { font-family: 'VT323', monospace; }

  .pixelated { 
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
  }

  /* Cadre pixel : bordure noire + ombre décalée façon NES */
  .pixel-frame {
    border: 4px solid #000;
    box-shadow: 6px 6px 0 0 #000;
  }
  .pixel-frame-inset {
    border: 4px solid #000;
    box-shadow: inset 0 0 0 2px rgba(255,255,255,0.2);
  }

  /* Bouton qui s'enfonce comme une touche de manette */
  .pixel-btn {
    border: 4px solid #000;
    box-shadow: 6px 6px 0 0 #000;
    transition: all 0.08s ease-out;
    position: relative;
  }
  .pixel-btn:hover:not(:disabled) {
    transform: translate(-2px, -2px);
    box-shadow: 8px 8px 0 0 #000;
  }
  .pixel-btn:active:not(:disabled) {
    transform: translate(6px, 6px);
    box-shadow: 0 0 0 0 #000;
  }
  .pixel-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Effet rebond perpétuel pour le CTA "Démarrer le Sprint" */
  @keyframes bounce-cta {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
  .animate-bounce-cta:hover {
    animation: bounce-cta 0.5s ease-in-out infinite;
  }

  /* Slide-in horizontaux pour les avatars de la simulation */
  @keyframes slide-in-left {
    0% { transform: translateX(-200px); opacity: 0; }
    100% { transform: translateX(0); opacity: 1; }
  }
  @keyframes slide-in-right {
    0% { transform: translateX(200px); opacity: 0; }
    100% { transform: translateX(0); opacity: 1; }
  }
  .animate-slide-left { animation: slide-in-left 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
  .animate-slide-right { animation: slide-in-right 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }

  /* Idle bobbing : les avatars respirent */
  @keyframes bob {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }
  .animate-bob { animation: bob 2s ease-in-out infinite; }

  /* Pulse pour les jauges qui viennent de changer */
  @keyframes gauge-flash {
    0%, 100% { transform: scale(1); filter: brightness(1); }
    50% { transform: scale(1.05); filter: brightness(1.5); }
  }
  .animate-gauge-flash { animation: gauge-flash 0.4s ease-in-out 2; }

  /* Curseur clignotant pour la machine à écrire */
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
  .animate-blink { animation: blink 0.8s steps(1) infinite; }

  /* LED de la console qui pulse */
  @keyframes led-pulse {
    0%, 100% { opacity: 1; box-shadow: 0 0 12px #ef4444; }
    50% { opacity: 0.4; box-shadow: 0 0 4px #ef4444; }
  }
  .animate-led { animation: led-pulse 1.2s ease-in-out infinite; }

  /* Apparition d'écran (effet "GAME ON") */
  @keyframes screen-on {
    0% { transform: scaleY(0.01); opacity: 0; filter: brightness(3); }
    50% { transform: scaleY(1); opacity: 1; filter: brightness(2); }
    100% { transform: scaleY(1); opacity: 1; filter: brightness(1); }
  }
  .animate-screen-on { animation: screen-on 0.5s ease-out; }

  /* Sol en damier pixel */
  .pixel-floor {
    background-image:
      linear-gradient(45deg, #166534 25%, transparent 25%),
      linear-gradient(-45deg, #166534 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #166534 75%),
      linear-gradient(-45deg, transparent 75%, #166534 75%);
    background-size: 32px 32px;
    background-position: 0 0, 0 16px, 16px -16px, -16px 0px;
    background-color: #15803d;
  }

  /* Étoiles d'ambiance pour l'écran de fin */
  @keyframes twinkle {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  }
  .animate-twinkle { animation: twinkle 2s ease-in-out infinite; }

  .saas-shell {
    background:
      radial-gradient(circle at top left, rgba(14, 165, 233, 0.12), transparent 34rem),
      linear-gradient(135deg, #f8fafc 0%, #eef2f7 52%, #e5e7eb 100%);
  }

  .saas-card {
    border: 1px solid rgba(15, 23, 42, 0.08);
    box-shadow: 0 24px 70px rgba(15, 23, 42, 0.14);
  }

  .office-scene {
    background:
      linear-gradient(180deg, rgba(255,255,255,0.78), rgba(226,232,240,0.82)),
      radial-gradient(circle at 24% 20%, rgba(56, 189, 248, 0.22), transparent 18rem);
  }

  .avatar-soft-shadow {
    filter: drop-shadow(0 18px 18px rgba(15, 23, 42, 0.22));
  }

  .pixelated svg,
  svg.pixelated {
    image-rendering: pixelated;
    shape-rendering: crispEdges;
  }
`;

/* =========================================================================
   DONNÉES — extraites pour respecter Open/Closed (ajouter un scénario
   ou un rôle se fait sans toucher au rendu).
   ========================================================================= */

const AVATARS = {
  male: {
    label: "ALEX",
  },
  female: {
    label: "NORA",
  },
};

const ROLES = [
  {
    id: "po",
    name: "Product Owner",
    icon: Crown,
    color: "bg-amber-400",
    textColor: "text-amber-900",
    stats: [
      { label: "Vision Client", value: 20, color: "text-amber-700" },
      { label: "Charisme", value: 15, color: "text-amber-700" },
      { label: "Code", value: -10, color: "text-red-700" },
    ],
  },
  {
    id: "sm",
    name: "Scrum Master",
    icon: Shield,
    color: "bg-indigo-400",
    textColor: "text-indigo-950",
    stats: [
      { label: "Facilitation", value: 25, color: "text-indigo-800" },
      { label: "Coaching", value: 15, color: "text-indigo-800" },
      { label: "Vélocité", value: 5, color: "text-indigo-800" },
    ],
  },
  {
    id: "dev",
    name: "Développeur",
    icon: Code2,
    color: "bg-emerald-400",
    textColor: "text-emerald-950",
    stats: [
      { label: "Code", value: 25, color: "text-emerald-800" },
      { label: "Qualité", value: 20, color: "text-emerald-800" },
      { label: "Charisme", value: -5, color: "text-red-700" },
    ],
  },
];

const SCENARIOS = [
  {
    npcName: "M. DUPONT",
    npcRole: "Client Mécontent",
    npcSeed: "Angry",
    npcColor: "bg-red-500",
    npcExpression: "😡",
    situation:
      "Vous étiez où ?! Ma fonctionnalité 'Export PDF' devait être livrée ce matin et elle N'EST PAS LÀ ! Je vous paie pour quoi exactement ?!",
    choices: [
      {
        label: "Vous avez raison, on la fait CE SOIR.",
        feedback: "L'équipe va devoir faire des heures sup. Le moral chute.",
        type: "bad",
        impact: { moral: -20, client: 15, quality: -15 },
      },
      {
        label: "Cette US n'était pas dans le Sprint engagé.",
        feedback: "Vous tenez le cadre. Le client râle mais respecte le process.",
        type: "neutral",
        impact: { moral: 5, client: -10, quality: 10 },
      },
      {
        label: "Asseyons-nous, regardons le board ensemble.",
        feedback: "Pédagogie + transparence. Le client comprend la priorité.",
        type: "good",
        impact: { moral: 10, client: 15, quality: 10 },
      },
    ],
  },
  {
    npcName: "MARC",
    npcRole: "Développeur en Burn-out",
    npcSeed: "Burned",
    npcColor: "bg-purple-500",
    npcExpression: "😩",
    situation:
      "Je tiens plus... 3 sprints de suite à 110% de capacité. J'arrive plus à dormir et le code que je produis... je n'en suis plus fier.",
    choices: [
      {
        label: "Tiens bon, fin de sprint dans 4 jours.",
        feedback: "Marc se referme. Toute l'équipe perçoit le manque d'écoute.",
        type: "bad",
        impact: { moral: -25, client: 5, quality: -20 },
      },
      {
        label: "On retire 2 US du Sprint, je remonte au PO.",
        feedback: "Action immédiate. Marc respire et l'équipe se sent protégée.",
        type: "good",
        impact: { moral: 25, client: -10, quality: 15 },
      },
      {
        label: "On t'assigne en binôme dès demain.",
        feedback: "Solution structurelle : partage de charge et de savoir.",
        type: "good",
        impact: { moral: 15, client: 0, quality: 20 },
      },
    ],
  },
  {
    npcName: "SOPHIE",
    npcRole: "Product Owner pressée",
    npcSeed: "Sophia",
    npcColor: "bg-pink-500",
    npcExpression: "😤",
    situation:
      "La rétro de demain ? On la saute. On a déjà 1 jour de retard sur le delivery, hors de question de perdre 1h30 à parler.",
    choices: [
      {
        label: "OK, on enchaîne sur le prochain Sprint.",
        feedback: "Les irritants s'accumulent. Les mêmes erreurs reviendront.",
        type: "bad",
        impact: { moral: -10, client: 5, quality: -25 },
      },
      {
        label: "Non. La rétro EST le Sprint, on la garde.",
        feedback: "Tu protèges le rituel. L'équipe te sait fiable.",
        type: "neutral",
        impact: { moral: 10, client: -5, quality: 15 },
      },
      {
        label: "Rétro condensée de 30 min, focus sur 1 action.",
        feedback: "Compromis intelligent. Le rituel vit, le delivery aussi.",
        type: "good",
        impact: { moral: 15, client: 10, quality: 15 },
      },
    ],
  },
];

const COURSE_MODULES = [
  {
    id: "video-rituels",
    title: "Les rituels Scrum expliqués en 3 minutes",
    format: "🎥 Vidéo",
    duration: "3 min",
    level: "Débutant",
    color: "bg-sky-50 text-sky-700 border-sky-200",
  },
  {
    id: "podcast-sm",
    title: "Posture Scrum Master : coacher sans imposer",
    format: "🎧 Podcast",
    duration: "8 min",
    level: "Intermédiaire",
    color: "bg-violet-50 text-violet-700 border-violet-200",
  },
  {
    id: "article-backlog",
    title: "Prioriser un backlog quand tout est urgent",
    format: "📖 Article",
    duration: "5 min",
    level: "Produit",
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    id: "sim-client",
    title: "Gérer un client mécontent sans casser le Sprint",
    format: "🎮 Simulation",
    duration: "12 min",
    level: "Avancé",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    id: "video-dod",
    title: "Definition of Done : le garde-fou qualité",
    format: "🎥 Vidéo",
    duration: "6 min",
    level: "Qualité",
    color: "bg-cyan-50 text-cyan-700 border-cyan-200",
  },
  {
    id: "article-retro",
    title: "Rétrospective efficace : une action, pas dix promesses",
    format: "📖 Article",
    duration: "4 min",
    level: "Facilitation",
    color: "bg-rose-50 text-rose-700 border-rose-200",
  },
];

const COMPETENCIES = [
  { label: "Rôles Scrum", value: 78 },
  { label: "Backlog", value: 62 },
  { label: "Rituels", value: 71 },
  { label: "Posture Agile", value: 58 },
  { label: "Qualité", value: 66 },
];

const LEARNERS = [
  { name: "Camille Martin", progress: 4, total: 5, score: 86, lastSeen: "Il y a 2 h", risk: false },
  { name: "Nadia Benali", progress: 3, total: 5, score: 74, lastSeen: "Hier", risk: false },
  { name: "Thomas Leroy", progress: 2, total: 5, score: 48, lastSeen: "Il y a 5 jours", risk: true },
  { name: "Inès Moreau", progress: 5, total: 5, score: 91, lastSeen: "Aujourd'hui", risk: false },
  { name: "Jules Bernard", progress: 1, total: 5, score: 39, lastSeen: "Il y a 8 jours", risk: true },
  { name: "Sarah Petit", progress: 2, total: 5, score: 52, lastSeen: "Il y a 3 jours", risk: true },
];

/* =========================================================================
   HOOKS & HELPERS (fonctions pures, testables)
   ========================================================================= */

const clamp = (n) => Math.max(0, Math.min(100, n));

const applyImpact = (g, impact) => ({
  moral: clamp(g.moral + impact.moral),
  client: clamp(g.client + impact.client),
  quality: clamp(g.quality + impact.quality),
});

const computeScore = (g) => Math.round((g.moral + g.client + g.quality) / 3);

const getVerdict = (score) => {
  if (score >= 80)
    return {
      title: "VICTORY !",
      subtitle: "Sprint Légendaire. L'équipe te respecte.",
      icon: Trophy,
      color: "bg-yellow-400",
      borderColor: "border-yellow-600",
      badge: "🏆",
    };
  if (score >= 55)
    return {
      title: "WELL DONE !",
      subtitle: "Sprint réussi. Quelques zones à améliorer.",
      icon: Award,
      color: "bg-emerald-400",
      borderColor: "border-emerald-700",
      badge: "🥈",
    };
  if (score >= 35)
    return {
      title: "TRY AGAIN",
      subtitle: "Sprint en demi-teinte. L'équipe est fatiguée.",
      icon: Star,
      color: "bg-orange-400",
      borderColor: "border-orange-700",
      badge: "🥉",
    };
  return {
    title: "GAME OVER",
    subtitle: "L'équipe est démobilisée. Le client est parti.",
    icon: Skull,
    color: "bg-red-500",
    borderColor: "border-red-800",
    badge: "💀",
  };
};

/** Effet machine à écrire : dévoile le texte caractère par caractère */
const useTypewriter = (text, speed = 25) => {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayed, done };
};

/* =========================================================================
   COMPOSANTS UI ATOMIQUES (réutilisés partout)
   ========================================================================= */

const CorporateAvatar = ({ gender = "male", className = "" }) => {
  const isFemale = gender === "female";

  return (
    <svg
      viewBox="0 0 160 200"
      role="img"
      aria-label={isFemale ? "Avatar pixel art femme" : "Avatar pixel art homme"}
      className={`w-full h-full pixelated avatar-soft-shadow ${className}`}
      style={{ imageRendering: "pixelated" }}
      shapeRendering="crispEdges"
    >
      <rect x="48" y="184" width="64" height="8" fill="#94a3b8" opacity="0.45" />

      <rect x="56" y="112" width="48" height="16" fill={isFemale ? "#334155" : "#dbeafe"} />
      <rect x="48" y="128" width="64" height="40" fill={isFemale ? "#1f2937" : "#bfdbfe"} />
      <rect x="64" y="112" width="32" height="16" fill={isFemale ? "#0f172a" : "#f8fafc"} />
      <rect x="72" y="128" width="16" height="24" fill={isFemale ? "#475569" : "#2563eb"} />

      <rect x="48" y="136" width="12" height="40" fill={isFemale ? "#1f2937" : "#bfdbfe"} />
      <rect x="100" y="136" width="12" height="40" fill={isFemale ? "#1f2937" : "#bfdbfe"} />
      <rect x="44" y="172" width="16" height="8" fill="#f2c7a0" />
      <rect x="100" y="172" width="16" height="8" fill="#f2c7a0" />

      <rect x="56" y="168" width="20" height="16" fill={isFemale ? "#111827" : "#2563eb"} />
      <rect x="84" y="168" width="20" height="16" fill={isFemale ? "#111827" : "#1d4ed8"} />
      <rect x="48" y="184" width="28" height="8" fill={isFemale ? "#0f172a" : "#f8fafc"} />
      <rect x="84" y="184" width="28" height="8" fill={isFemale ? "#0f172a" : "#f8fafc"} />

      <rect x="64" y="88" width="32" height="24" fill="#f2c7a0" />
      <rect x="52" y="48" width="56" height="48" fill="#f2c7a0" />
      <rect x="44" y="64" width="8" height="24" fill="#f2c7a0" />
      <rect x="108" y="64" width="8" height="24" fill="#f2c7a0" />

      {isFemale ? (
        <>
          <rect x="44" y="32" width="64" height="16" fill="#7c2d12" />
          <rect x="36" y="48" width="16" height="64" fill="#7c2d12" />
          <rect x="100" y="48" width="20" height="64" fill="#7c2d12" />
          <rect x="52" y="40" width="56" height="16" fill="#92400e" />
          <rect x="44" y="56" width="16" height="16" fill="#92400e" />
        </>
      ) : (
        <>
          <rect x="44" y="32" width="64" height="16" fill="#111827" />
          <rect x="52" y="24" width="48" height="16" fill="#111827" />
          <rect x="36" y="48" width="24" height="16" fill="#111827" />
          <rect x="92" y="48" width="24" height="16" fill="#111827" />
        </>
      )}

      <rect x="60" y="72" width="8" height="8" fill={isFemale ? "#166534" : "#5b3418"} />
      <rect x="92" y="72" width="8" height="8" fill={isFemale ? "#166534" : "#5b3418"} />
      <rect x="76" y="88" width="16" height="8" fill="#7f1d1d" />
      <rect x="68" y="104" width="24" height="8" fill="#eabf95" />
    </svg>
  );
};

const ClientAvatar = ({ className = "" }) => (
  <svg
    viewBox="0 0 160 200"
    role="img"
    aria-label="Client mecontent pixel art"
    className={`w-full h-full pixelated avatar-soft-shadow ${className}`}
    style={{ imageRendering: "pixelated" }}
    shapeRendering="crispEdges"
  >
    <rect x="48" y="184" width="64" height="8" fill="#94a3b8" opacity="0.45" />
    <rect x="52" y="112" width="56" height="56" fill="#111827" />
    <rect x="64" y="112" width="32" height="32" fill="#f8fafc" />
    <rect x="72" y="112" width="16" height="56" fill="#dc2626" />
    <rect x="48" y="136" width="12" height="40" fill="#111827" />
    <rect x="100" y="136" width="12" height="40" fill="#111827" />
    <rect x="44" y="172" width="16" height="8" fill="#eabf95" />
    <rect x="100" y="172" width="16" height="8" fill="#eabf95" />
    <rect x="56" y="168" width="20" height="16" fill="#111827" />
    <rect x="84" y="168" width="20" height="16" fill="#111827" />
    <rect x="48" y="184" width="28" height="8" fill="#0f172a" />
    <rect x="84" y="184" width="28" height="8" fill="#0f172a" />

    <rect x="64" y="88" width="32" height="24" fill="#eabf95" />
    <rect x="52" y="48" width="56" height="48" fill="#eabf95" />
    <rect x="44" y="64" width="8" height="24" fill="#eabf95" />
    <rect x="108" y="64" width="8" height="24" fill="#eabf95" />
    <rect x="44" y="32" width="64" height="16" fill="#1f2937" />
    <rect x="52" y="24" width="48" height="16" fill="#1f2937" />
    <rect x="36" y="48" width="24" height="16" fill="#1f2937" />
    <rect x="92" y="48" width="24" height="16" fill="#1f2937" />

    <rect x="56" y="64" width="16" height="8" fill="#111827" />
    <rect x="88" y="64" width="16" height="8" fill="#111827" />
    <rect x="64" y="76" width="8" height="8" fill="#4b2d18" />
    <rect x="92" y="76" width="8" height="8" fill="#4b2d18" />
    <rect x="72" y="96" width="24" height="8" fill="#7f1d1d" />
    <rect x="68" y="104" width="8" height="8" fill="#7f1d1d" />
    <rect x="92" y="104" width="8" height="8" fill="#7f1d1d" />
  </svg>
);

const ConsoleFrame = ({ children, activeSection, onNavigate }) => {
  const sectionMeta = {
    trainer: { title: "Dashboard formateur", subtitle: "Suivi de cohorte" },
    courses: { title: "Bibliothèque de cours", subtitle: "Vue apprenant" },
    game: { title: "Module AgileQuest", subtitle: "Simulation ScrumLab" },
  };
  const meta = sectionMeta[activeSection] || sectionMeta.game;
  const navItems = [
    { id: "trainer", label: "Dashboard", icon: LayoutDashboard },
    { id: "courses", label: "Mes Modules", icon: BookOpen },
    { id: "history", label: "Historique", icon: History, disabled: true },
  ];

  return (
  <div className="min-h-screen saas-shell font-pixel-body text-slate-900">
    <div className="flex min-h-screen">
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white/90 backdrop-blur px-5 py-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center font-pixel text-[13px]">SL</div>
          <div>
            <div className="font-pixel text-[12px] text-slate-950">ScrumLab</div>
            <div className="text-xs text-slate-500">Academie agile</div>
          </div>
        </div>
        <nav className="space-y-2 text-sm">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => !item.disabled && onNavigate(item.id)}
                disabled={item.disabled}
                className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left transition ${
                  activeSection === item.id
                    ? "bg-slate-950 text-white shadow-sm"
                    : item.disabled
                      ? "text-slate-300 cursor-not-allowed"
                      : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="mt-auto rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="font-pixel text-[9px] text-slate-700 mb-2">SPRINT LAB</div>
          <p className="text-sm text-slate-500 leading-snug">Module interactif Scrum pour managers et equipes produit.</p>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
            <button className="lg:hidden rounded-lg border border-slate-200 p-2 text-slate-600">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <div className="font-pixel text-[10px] md:text-xs text-slate-950">{meta.title}</div>
              <div className="hidden sm:block text-sm text-slate-500">{meta.subtitle}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden md:flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-400">
              <Search className="w-4 h-4" />
              Rechercher
            </div>
            <button className="relative rounded-lg border border-slate-200 bg-white p-2 text-slate-600">
              <Bell className="w-5 h-5" />
              <span className="absolute right-1.5 top-1.5 w-2 h-2 rounded-full bg-red-500" />
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-2 text-slate-700">
              <UserCircle className="w-5 h-5" />
              <span className="hidden sm:inline text-sm">Profil</span>
            </button>
          </div>
        </header>

        <div className="p-3 md:p-8">
          <div className="mx-auto max-w-6xl rounded-2xl bg-white saas-card overflow-hidden">
            <div className="border-b border-slate-200 bg-white px-4 py-3 md:px-6 flex items-center justify-between">
              <div>
                <div className="font-pixel text-[10px] md:text-xs text-slate-950">{meta.title}</div>
                <div className="text-sm text-slate-500">{meta.subtitle}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-red-400 rounded-full" />
                <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full" />
                <div className="w-2.5 h-2.5 bg-green-400 rounded-full" />
              </div>
            </div>
            <div className={`${activeSection === "game" ? "bg-slate-950" : "bg-slate-50"} p-2 md:p-4`}>
              <div className="animate-screen-on origin-center">{children}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
  );
};

const PixelButton = ({ children, onClick, disabled, color = "bg-emerald-400", className = "" }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`pixel-btn ${color} font-pixel text-black px-4 py-3 text-[10px] md:text-xs leading-relaxed ${className}`}
  >
    {children}
  </button>
);

const Gauge = ({ label, value, icon: Icon, color, flashing }) => (
  <div className={`pixel-frame-inset bg-slate-900 p-2 md:p-3 ${flashing ? "animate-gauge-flash" : ""}`}>
    <div className="flex items-center justify-between mb-1">
      <div className="flex items-center gap-1">
        <Icon className="w-3 h-3 md:w-4 md:h-4 text-white" strokeWidth={3} />
        <span className="font-pixel text-[7px] md:text-[9px] text-white">{label}</span>
      </div>
      <span className="font-pixel text-[9px] md:text-[11px] text-white tabular-nums">
        {value}
      </span>
    </div>
    {/* Barre segmentée pixel-style : 10 cases */}
    <div className="flex gap-[2px]">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className={`flex-1 h-3 md:h-4 border-2 border-black transition-colors duration-300 ${
            i < Math.round(value / 10) ? color : "bg-slate-700"
          }`}
        />
      ))}
    </div>
  </div>
);

/* =========================================================================
   VUE 1 — CRÉATION DE PERSONNAGE
   ========================================================================= */

const CharacterCreation = ({ onStart }) => {
  const [gender, setGender] = useState(null);
  const [role, setRole] = useState(null);

  const canStart = gender && role;
  const selectedRole = ROLES.find((r) => r.id === role);

  return (
    <div className="p-3 md:p-6 bg-gradient-to-b from-slate-100 via-white to-slate-200 min-h-[600px]">
      {/* Title */}
      <div className="text-center mb-6">
        <div className="inline-block bg-yellow-400 pixel-frame px-4 py-2 mb-3">
          <h1 className="font-pixel text-base md:text-2xl text-black tracking-tight">
            ★ ScrumLab ★
          </h1>
        </div>
        <p className="font-pixel text-[9px] md:text-xs text-slate-500 mt-2">
          CHOOSE YOUR HERO
        </p>
      </div>

      {/* Step 1: Gender */}
      <div className="mb-5">
        <h2 className="font-pixel text-[10px] md:text-xs text-slate-900 mb-3">
          ▶ 1. APPARENCE
        </h2>
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {Object.entries(AVATARS).map(([key, av]) => {
            const isSelected = gender === key;
            return (
              <button
                key={key}
                onClick={() => setGender(key)}
                className={`pixel-frame p-3 md:p-4 transition-transform ${
                  isSelected
                    ? "bg-yellow-300 scale-105"
                    : "bg-slate-200 hover:bg-slate-100"
                }`}
              >
                <div className="aspect-square bg-gradient-to-b from-slate-50 to-slate-200 pixel-frame-inset mb-2 flex items-center justify-center overflow-hidden">
                  <CorporateAvatar gender={key} />
                </div>
                <div className="font-pixel text-[9px] md:text-[11px] text-black text-center">
                  {av.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Role */}
      <div className="mb-6">
        <h2 className="font-pixel text-[10px] md:text-xs text-slate-900 mb-3">
          ▶ 2. CLASSE
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {ROLES.map((r) => {
            const Icon = r.icon;
            const isSelected = role === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`pixel-frame p-3 text-left transition-transform ${
                  isSelected ? `${r.color} scale-105` : "bg-slate-200 hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 ${r.color} border-2 border-black`}>
                    <Icon className="w-4 h-4 text-black" strokeWidth={3} />
                  </div>
                  <div className={`font-pixel text-[10px] ${r.textColor}`}>
                    {r.name}
                  </div>
                </div>
                <ul className="space-y-1">
                  {r.stats.map((s, i) => (
                    <li
                      key={i}
                      className={`font-pixel-body text-sm flex justify-between ${s.color}`}
                    >
                      <span>{s.label}</span>
                      <span className="font-bold tabular-nums">
                        {s.value > 0 ? `+${s.value}` : s.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="flex justify-center">
        <PixelButton
          onClick={() => canStart && onStart(gender, role)}
          disabled={!canStart}
          color="bg-red-500"
          className={`text-white text-xs md:text-sm px-6 py-4 ${
            canStart ? "animate-bounce-cta" : ""
          }`}
        >
          ▶ DÉMARRER LE SPRINT
        </PixelButton>
      </div>
    </div>
  );
};

/* =========================================================================
   VUE 2 — SIMULATION (Visual Novel)
   ========================================================================= */

/** Petit composant interne : décor open-space en pur CSS pixel */
const OpenSpaceBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Mur du fond — bleu pâle */}
    <div className="absolute inset-x-0 top-0 h-2/3 bg-gradient-to-b from-sky-300 to-sky-200" />

    {/* Sol en damier pixel */}
    <div className="absolute inset-x-0 bottom-0 h-1/3 pixel-floor" />

    {/* Soleil / lampe au plafond */}
    <div className="absolute top-3 right-6 w-8 h-8 bg-yellow-300 border-4 border-black" />
    <div className="absolute top-11 right-8 w-4 h-4 bg-yellow-200" />

    {/* Plante verte */}
    <div className="absolute left-2 bottom-[32%] w-10 h-12">
      <div className="absolute bottom-0 left-1 w-8 h-3 bg-amber-700 border-2 border-black" />
      <div className="absolute bottom-3 left-0 w-10 h-8 bg-green-500 border-2 border-black rounded-t-full" />
    </div>

    {/* Bureaux (2 simples) */}
    <div className="absolute right-3 bottom-[32%] w-12 h-2 bg-amber-800 border-2 border-black" />
    <div className="absolute right-3 bottom-[28%] w-2 h-4 bg-amber-900 border-2 border-black" />
    <div className="absolute right-10 bottom-[28%] w-2 h-4 bg-amber-900 border-2 border-black" />

    {/* Tableau blanc sur le mur */}
    <div className="absolute left-1/2 -translate-x-1/2 top-6 w-20 h-12 bg-white border-4 border-black">
      <div className="absolute inset-1 flex flex-col gap-1">
        <div className="h-1 bg-slate-400 w-3/4" />
        <div className="h-1 bg-slate-400 w-1/2" />
        <div className="h-1 bg-red-400 w-2/3" />
      </div>
    </div>

    {/* Post-it sur le tableau */}
    <div className="absolute left-1/2 top-3 w-3 h-3 bg-yellow-300 border-2 border-black" />
    <div className="absolute left-[55%] top-4 w-3 h-3 bg-pink-300 border-2 border-black" />
  </div>
);

const ModernOfficeBackground = () => (
  <div className="absolute inset-0 overflow-hidden office-scene">
    <div className="absolute inset-x-0 top-0 h-2/3 bg-[linear-gradient(90deg,rgba(148,163,184,0.18)_1px,transparent_1px),linear-gradient(180deg,rgba(148,163,184,0.16)_1px,transparent_1px)] bg-[size:48px_48px]" />
    <div className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-b from-slate-200 to-slate-300" />
    <div className="absolute inset-x-0 bottom-[38%] h-px bg-slate-300" />

    <div className="absolute left-8 top-8 w-32 h-20 rounded-lg border border-slate-300 bg-white/80 shadow-sm">
      <div className="absolute left-4 top-4 h-2 w-20 rounded bg-slate-300" />
      <div className="absolute left-4 top-8 h-2 w-14 rounded bg-slate-200" />
      <div className="absolute left-4 top-12 h-2 w-24 rounded bg-cyan-200" />
    </div>

    <div className="absolute right-8 top-8 w-36 h-16 rounded-lg border border-slate-300 bg-white shadow-sm">
      <div className="absolute left-4 bottom-4 h-6 w-6 rounded bg-emerald-200" />
      <div className="absolute left-14 bottom-4 h-10 w-6 rounded bg-sky-200" />
      <div className="absolute left-24 bottom-4 h-8 w-6 rounded bg-amber-200" />
    </div>

    <div className="absolute left-8 right-8 bottom-[28%] h-16 rounded-xl bg-white border border-slate-300 shadow-lg">
      <div className="absolute left-10 top-[-28px] w-16 h-10 rounded-md bg-slate-800 border-4 border-slate-700">
        <div className="h-1.5 w-8 rounded bg-cyan-300 mx-auto mt-3" />
      </div>
      <div className="absolute right-20 top-[-30px] w-20 h-12 rounded-md bg-slate-900 border-4 border-slate-700">
        <div className="h-1.5 w-10 rounded bg-emerald-300 mx-auto mt-4" />
      </div>
      <div className="absolute left-1/2 top-4 h-3 w-28 -translate-x-1/2 rounded bg-slate-200" />
    </div>

    <div className="absolute right-12 bottom-[38%] w-12 h-16">
      <div className="absolute bottom-0 left-4 h-8 w-6 rounded bg-slate-700" />
      <div className="absolute bottom-7 left-0 h-9 w-12 rounded-full bg-emerald-500" />
    </div>
  </div>
);

const Simulation = ({ gender, role, gauges, scenarioIndex, onChoice, flashingGauges }) => {
  const scenario = SCENARIOS[scenarioIndex];
  const playerAv = AVATARS[gender];
  const { displayed, done } = useTypewriter(scenario.situation, 22);
  const [revealChoices, setRevealChoices] = useState(false);

  useEffect(() => {
    setRevealChoices(false);
    if (done) {
      const t = setTimeout(() => setRevealChoices(true), 250);
      return () => clearTimeout(t);
    }
  }, [done, scenarioIndex]);

  return (
    <div className="bg-slate-50 p-2 md:p-3">
      {/* Top HUD */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="font-pixel text-[9px] md:text-[11px] text-slate-900">
            ◆ SPRINT #1 — TOUR {scenarioIndex + 1}/{SCENARIOS.length}
          </div>
          <div className="font-pixel text-[8px] md:text-[10px] text-slate-400">
            HP : ÉQUIPE
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Gauge
            label="MORAL"
            value={gauges.moral}
            icon={Heart}
            color="bg-red-500"
            flashing={flashingGauges.moral}
          />
          <Gauge
            label="VÉLOCITÉ"
            value={gauges.client}
            icon={Star}
            color="bg-yellow-400"
            flashing={flashingGauges.client}
          />
          <Gauge
            label="QUALITÉ"
            value={gauges.quality}
            icon={Zap}
            color="bg-cyan-400"
            flashing={flashingGauges.quality}
          />
        </div>
      </div>

      {/* Scene */}
      <div className="relative h-72 md:h-80 mb-3 rounded-xl border border-slate-300 overflow-hidden shadow-inner">
        <ModernOfficeBackground />

        {/* Player avatar (left) */}
        <div
          key={`player-${scenarioIndex}`}
          className="absolute bottom-[18%] left-4 md:left-10 z-10 animate-slide-left"
        >
          <div className="animate-bob">
            <div className="w-28 h-32 md:w-32 md:h-36 bg-white/80 rounded-xl border border-slate-300 overflow-hidden shadow-lg">
              <CorporateAvatar gender={gender} />
            </div>
            <div className="mt-1 mx-auto w-fit bg-slate-950 px-2 py-0.5 rounded-md border border-white">
              <span className="font-pixel text-[8px] text-white">{playerAv.label}</span>
            </div>
          </div>
        </div>

        {/* NPC avatar (right) */}
        <div
          key={`npc-${scenarioIndex}`}
          className="absolute bottom-[18%] right-4 md:right-10 z-10 animate-slide-right"
        >
          <div className="animate-bob" style={{ animationDelay: "0.5s" }}>
            <div className="w-28 h-32 md:w-32 md:h-36 bg-white/80 rounded-xl border border-slate-300 overflow-hidden relative shadow-lg">
              <ClientAvatar />
            </div>
            <div className="mt-1 mx-auto w-fit bg-red-700 px-2 py-0.5 rounded-md border border-white">
              <span className="font-pixel text-[8px] text-white">{scenario.npcName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogue Box */}
      <div className="bg-slate-800 pixel-frame p-3 md:p-4 mb-3 min-h-[110px]">
        <div className="font-pixel text-[9px] md:text-[10px] text-yellow-300 mb-2 flex items-center gap-1">
          ▶ {scenario.npcName} <span className="text-slate-400">— {scenario.npcRole}</span>
        </div>
        <p className="font-pixel-body text-lg md:text-xl text-white leading-snug">
          {displayed}
          {!done && <span className="inline-block ml-0.5 w-2 h-5 bg-white align-middle animate-blink" />}
          {done && <span className="ml-1 text-yellow-300 animate-blink">▼</span>}
        </p>
      </div>

      {/* Choices */}
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-2 transition-opacity duration-500 ${revealChoices ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        {scenario.choices.map((choice, idx) => (
          <button
            key={idx}
            onClick={() => onChoice(choice)}
            disabled={!revealChoices}
            className="pixel-btn bg-slate-100 hover:bg-yellow-200 p-3 text-left"
          >
            <div className="flex items-start gap-2 mb-2">
              <div className="bg-black text-yellow-300 font-pixel text-[9px] px-1.5 py-0.5 shrink-0">
                {idx + 1}
              </div>
              <div className="font-pixel-body text-sm md:text-base text-black leading-tight">
                {choice.label}
              </div>
            </div>
            <div className="flex gap-1 flex-wrap">
              {Object.entries(choice.impact).map(([k, v]) => {
                if (v === 0) return null;
                const label = k === "moral" ? "MOR" : k === "client" ? "VEL" : "QLT";
                return (
                  <span
                    key={k}
                    className={`font-pixel text-[7px] px-1 py-0.5 border-2 border-black ${
                      v > 0 ? "bg-green-300" : "bg-red-300"
                    }`}
                  >
                    {label}{v > 0 ? "+" : ""}{v}
                  </span>
                );
              })}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

/* =========================================================================
   VUE 3 — RÉSULTAT
   ========================================================================= */

const Result = ({ gauges, role, gender, onRestart }) => {
  const score = computeScore(gauges);
  const verdict = getVerdict(score);
  const VerdictIcon = verdict.icon;
  const roleData = ROLES.find((r) => r.id === role);
  const av = AVATARS[gender];

  return (
    <div className="bg-gradient-to-b from-slate-100 via-white to-slate-200 p-4 md:p-8 min-h-[600px] relative overflow-hidden">
      {/* Étoiles scintillantes */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white animate-twinkle"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}

      <div className="relative max-w-2xl mx-auto text-center">
        {/* Verdict title */}
        <div className={`inline-block ${verdict.color} pixel-frame px-6 py-3 mb-6`}>
          <h1 className="font-pixel text-lg md:text-3xl text-black">
            ★ {verdict.title} ★
          </h1>
        </div>

        {/* Big badge */}
        <div className="text-7xl md:text-8xl mb-4">{verdict.badge}</div>

        {/* Score */}
        <div className="bg-slate-900 pixel-frame p-4 mb-5 inline-block">
          <div className="font-pixel text-[9px] text-slate-400 mb-1">SCORE FINAL</div>
          <div className="font-pixel text-3xl md:text-5xl text-yellow-300 tabular-nums">
            {score} <span className="text-base md:text-2xl text-slate-500">/ 100</span>
          </div>
        </div>

        <p className="font-pixel-body text-base md:text-xl text-slate-700 mb-6 max-w-md mx-auto">
          {verdict.subtitle}
        </p>

        <div className="bg-white border border-slate-300 rounded-xl shadow-lg p-3 mb-5 max-w-sm mx-auto">
          <div className="font-pixel text-[8px] text-slate-500 mb-2">BADGE OBTENU</div>
          <div className="flex items-center justify-center gap-3">
            <div className={`${verdict.color} border-4 border-black p-2`}>
              <VerdictIcon className="w-6 h-6 text-black" strokeWidth={3} />
            </div>
            <div className="font-pixel text-[10px] text-slate-900">{verdict.title}</div>
          </div>
        </div>

        {/* Player card */}
        <div className="bg-white border border-slate-300 rounded-xl shadow-lg p-3 mb-6 flex items-center gap-3 max-w-sm mx-auto">
          <div className="w-20 h-24 bg-gradient-to-b from-slate-50 to-slate-200 rounded-lg border border-slate-300 overflow-hidden shrink-0">
            <CorporateAvatar gender={gender} />
          </div>
          <div className="text-left">
            <div className="font-pixel text-[9px] text-yellow-300">{av.label}</div>
            <div className={`font-pixel text-[8px] ${roleData.textColor} ${roleData.color} px-1 py-0.5 inline-block mt-1`}>
              {roleData.name.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Final gauges */}
        <div className="grid grid-cols-3 gap-2 mb-6 max-w-md mx-auto">
          <Gauge label="MORAL" value={gauges.moral} icon={Heart} color="bg-red-500" />
          <Gauge label="VÉLOCITÉ" value={gauges.client} icon={Star} color="bg-yellow-400" />
          <Gauge label="QUALITÉ" value={gauges.quality} icon={Zap} color="bg-cyan-400" />
        </div>

        {/* CTA */}
        <PixelButton
          onClick={onRestart}
          color="bg-emerald-400"
          className="text-xs md:text-sm"
        >
          <span className="flex items-center gap-2">
            <RotateCcw className="w-3.5 h-3.5" strokeWidth={3} /> RETOUR AU TABLEAU DE BORD
          </span>
        </PixelButton>

        <p className="font-pixel text-[7px] text-slate-500 mt-6">
          © ScrumLab · POWERED BY IK.RA
        </p>
      </div>
    </div>
  );
};

/* =========================================================================
   VUE 2.5 — FEEDBACK OVERLAY (entre 2 scénarios)
   ========================================================================= */

const FeedbackOverlay = ({ choice, onNext, isLast }) => {
  const styles = {
    good: { color: "bg-emerald-400", border: "border-emerald-700", label: "BIEN JOUÉ !", badge: "✨" },
    neutral: { color: "bg-sky-400", border: "border-sky-700", label: "CORRECT", badge: "✓" },
    bad: { color: "bg-red-500", border: "border-red-800", label: "RISQUÉ !", badge: "⚠" },
  };
  const s = styles[choice.type];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 animate-screen-on">
      <div className={`${s.color} pixel-frame max-w-md w-full p-5`}>
        <div className="text-center mb-3">
          <div className="text-5xl mb-2">{s.badge}</div>
          <div className="font-pixel text-sm md:text-base text-black">
            {s.label}
          </div>
        </div>
        <div className="bg-white pixel-frame-inset p-3 mb-4">
          <p className="font-pixel-body text-base md:text-lg text-black leading-snug">
            {choice.feedback}
          </p>
        </div>
        <div className="flex gap-2 justify-center mb-4 flex-wrap">
          {Object.entries(choice.impact).map(([k, v]) => {
            if (v === 0) return null;
            const label = k === "moral" ? "MORAL" : k === "client" ? "VÉLOCITÉ" : "QUALITÉ";
            return (
              <span
                key={k}
                className={`font-pixel text-[8px] px-2 py-1 border-2 border-black ${
                  v > 0 ? "bg-green-300 text-black" : "bg-red-300 text-black"
                }`}
              >
                {label} {v > 0 ? `+${v}` : v}
              </span>
            );
          })}
        </div>
        <button
          onClick={onNext}
          className="w-full pixel-btn bg-slate-900 text-white font-pixel text-[10px] md:text-xs px-4 py-3"
        >
          {isLast ? "▶ VOIR LE RÉSULTAT" : "▶ CONTINUER"}
        </button>
      </div>
    </div>
  );
};

/* =========================================================================
   COMPOSANT RACINE — chef d'orchestre.
   ========================================================================= */

const CourseLibrary = ({ onLaunchGame }) => {
  const [selectedModule, setSelectedModule] = useState(null);

  return (
    <div className="bg-slate-50 p-4 md:p-6 min-h-[640px]">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
        <div>
          <h1 className="font-pixel text-sm md:text-lg text-slate-950 mb-2">
            Bibliothèque ScrumLab
          </h1>
          <p className="text-slate-500 text-base">
            Des formats courts pour ancrer les bons réflexes agiles.
          </p>
        </div>
        <button
          onClick={onLaunchGame}
          className="rounded-lg bg-slate-950 text-white px-4 py-2 text-sm font-semibold hover:bg-slate-800"
        >
          Lancer la simulation AgileQuest
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {COURSE_MODULES.map((module) => (
          <button
            key={module.id}
            onClick={() => setSelectedModule(module)}
            className="text-left rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition"
          >
            <div className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold mb-4 ${module.color}`}>
              {module.format}
            </div>
            <h2 className="font-pixel text-[10px] leading-relaxed text-slate-950 mb-4">
              {module.title}
            </h2>
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>{module.level}</span>
              <span className="rounded-md bg-slate-100 px-2 py-1 font-semibold text-slate-700">
                {module.duration}
              </span>
            </div>
          </button>
        ))}
      </div>

      {selectedModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="text-4xl mb-3">🚧</div>
            <h2 className="font-pixel text-sm text-slate-950 mb-3">
              Module en création
            </h2>
            <p className="text-slate-600 mb-5">
              “{selectedModule.title}” est en cours de création. Tu peux déjà signaler ton intérêt pour être prévenu à sa sortie.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <button className="flex-1 rounded-lg bg-slate-950 text-white px-4 py-2 text-sm font-semibold">
                Prévenez-moi de sa sortie
              </button>
              <button
                onClick={() => setSelectedModule(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const RadarChart = () => {
  const center = 110;
  const maxRadius = 78;
  const points = COMPETENCIES.map((item, index) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / COMPETENCIES.length;
    const radius = (item.value / 100) * maxRadius;
    return {
      ...item,
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
      labelX: center + Math.cos(angle) * 98,
      labelY: center + Math.sin(angle) * 98,
      axisX: center + Math.cos(angle) * maxRadius,
      axisY: center + Math.sin(angle) * maxRadius,
    };
  });

  return (
    <svg viewBox="0 0 220 220" className="w-full max-w-sm mx-auto">
      {[0.33, 0.66, 1].map((step) => (
        <polygon
          key={step}
          points={COMPETENCIES.map((_, index) => {
            const angle = -Math.PI / 2 + (index * 2 * Math.PI) / COMPETENCIES.length;
            return `${center + Math.cos(angle) * maxRadius * step},${center + Math.sin(angle) * maxRadius * step}`;
          }).join(" ")}
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="1"
        />
      ))}
      {points.map((point) => (
        <line key={point.label} x1={center} y1={center} x2={point.axisX} y2={point.axisY} stroke="#e2e8f0" />
      ))}
      <polygon points={points.map((p) => `${p.x},${p.y}`).join(" ")} fill="rgba(14,165,233,0.25)" stroke="#0284c7" strokeWidth="3" />
      {points.map((point) => (
        <g key={point.label}>
          <circle cx={point.x} cy={point.y} r="4" fill="#0284c7" />
          <text x={point.labelX} y={point.labelY} textAnchor="middle" dominantBaseline="middle" className="fill-slate-600 text-[9px] font-bold">
            {point.label}
          </text>
        </g>
      ))}
    </svg>
  );
};

const TrainerDashboard = () => {
  const [filter, setFilter] = useState("");
  const learners = LEARNERS.filter((learner) =>
    learner.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="bg-slate-50 p-4 md:p-6 min-h-[640px]">
      <div className="mb-6">
        <h1 className="font-pixel text-sm md:text-lg text-slate-950 mb-2">
          Dashboard formateur
        </h1>
        <p className="text-slate-500 text-base">
          Données mockées de suivi pour une cohorte Scrum de 24 apprenants.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm">
          <div className="text-sm text-slate-500 mb-2">Complétion moyenne</div>
          <div className="font-pixel text-2xl text-slate-950 mb-3">68%</div>
          <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full w-[68%] rounded-full bg-emerald-500" />
          </div>
        </div>
        <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm">
          <div className="text-sm text-slate-500 mb-2">Score moyen de réussite</div>
          <div className="font-pixel text-2xl text-slate-950">14/20</div>
          <div className="mt-3 text-sm text-emerald-600 font-semibold">75% de moyenne</div>
        </div>
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 shadow-sm">
          <div className="text-sm text-red-600 mb-2">Apprenants en difficulté</div>
          <div className="font-pixel text-2xl text-red-700">3</div>
          <div className="mt-3 text-sm text-red-700 font-semibold">nécessitent votre attention</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-5">
        <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm">
          <h2 className="font-pixel text-[11px] text-slate-950 mb-4">Analyse des compétences</h2>
          <RadarChart />
        </div>

        <div className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <h2 className="font-pixel text-[11px] text-slate-950">Suivi individuel</h2>
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filtrer un apprenant..."
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="text-left font-semibold p-3">Apprenant</th>
                  <th className="text-left font-semibold p-3">Progression</th>
                  <th className="text-left font-semibold p-3">Score dernier module</th>
                  <th className="text-left font-semibold p-3">Dernière connexion</th>
                  <th className="text-left font-semibold p-3">Détail</th>
                </tr>
              </thead>
              <tbody>
                {learners.map((learner) => {
                  const percent = Math.round((learner.progress / learner.total) * 100);
                  return (
                    <tr key={learner.name} className="border-t border-slate-100">
                      <td className="p-3 font-semibold text-slate-900">{learner.name}</td>
                      <td className="p-3 min-w-40">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full rounded-full bg-sky-500" style={{ width: `${percent}%` }} />
                          </div>
                          <span className="text-slate-500">{learner.progress}/{learner.total}</span>
                        </div>
                      </td>
                      <td className={`p-3 font-semibold ${learner.risk ? "text-red-600" : "text-emerald-600"}`}>
                        {learner.score}%
                      </td>
                      <td className="p-3 text-slate-500">{learner.lastSeen}</td>
                      <td className="p-3">
                        <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 bg-slate-50">
                          Voir le détail
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AgileQuest() {
  const [activeSection, setActiveSection] = useState("courses");
  const [view, setView] = useState("creation");
  const [gender, setGender] = useState(null);
  const [role, setRole] = useState(null);
  const [gauges, setGauges] = useState({ moral: 50, client: 50, quality: 50 });
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [pendingChoice, setPendingChoice] = useState(null);
  const [flashingGauges, setFlashingGauges] = useState({});

  const handleStart = (g, r) => {
    setGender(g);
    setRole(r);
    setView("simulation");
  };

  const handleLaunchGame = () => {
    setActiveSection("game");
  };

  const handleChoice = (choice) => {
    // 1. Déclenche le flash sur les jauges impactées
    const flashing = {};
    Object.entries(choice.impact).forEach(([k, v]) => {
      if (v !== 0) flashing[k] = true;
    });
    setFlashingGauges(flashing);

    // 2. Applique l'impact (animation des barres)
    setGauges((g) => applyImpact(g, choice.impact));

    // 3. Stoppe le flash après l'animation
    setTimeout(() => setFlashingGauges({}), 900);

    // 4. Affiche le feedback (overlay)
    setPendingChoice(choice);
  };

  const handleNext = () => {
    setPendingChoice(null);
    if (scenarioIndex + 1 >= SCENARIOS.length) {
      setView("result");
    } else {
      setScenarioIndex((i) => i + 1);
    }
  };

  const handleRestart = () => {
    setView("creation");
    setGender(null);
    setRole(null);
    setGauges({ moral: 50, client: 50, quality: 50 });
    setScenarioIndex(0);
    setPendingChoice(null);
    setFlashingGauges({});
  };

  const handleReturnDashboard = () => {
    handleRestart();
    setActiveSection("trainer");
  };

  return (
    <>
      <style>{PIXEL_STYLES}</style>
      <ConsoleFrame activeSection={activeSection} onNavigate={setActiveSection}>
        {activeSection === "trainer" && <TrainerDashboard />}
        {activeSection === "courses" && <CourseLibrary onLaunchGame={handleLaunchGame} />}
        {activeSection === "game" && (
          <>
            {view === "creation" && <CharacterCreation onStart={handleStart} />}
            {view === "simulation" && (
              <Simulation
                gender={gender}
                role={role}
                gauges={gauges}
                scenarioIndex={scenarioIndex}
                onChoice={handleChoice}
                flashingGauges={flashingGauges}
              />
            )}
            {view === "result" && (
              <Result
                gauges={gauges}
                role={role}
                gender={gender}
                onRestart={handleReturnDashboard}
              />
            )}
          </>
        )}
        {pendingChoice && (
          <FeedbackOverlay
            choice={pendingChoice}
            onNext={handleNext}
            isLast={scenarioIndex + 1 >= SCENARIOS.length}
          />
        )}
      </ConsoleFrame>
    </>
  );
}
