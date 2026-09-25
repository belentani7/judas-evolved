/* Style direction: Dark Cosmic Luxury — black void, Belentani Ruby, editorial serif, precise mono labels, immersive but accessible motion. */
import { useEffect, useMemo, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";
import { applyDiamondAnswer } from "@shared/diamondLogic";
import {
  ArrowUpRight,
  AudioLines,
  BookOpen,
  BrainCircuit,
  Check,
  ChevronRight,
  CircleDot,
  Clock3,
  Code2,
  Command,
  Copy,
  Film,
  Image as ImageIcon,
  Layers3,
  Menu,
  MessageSquareText,
  Music2,
  Pause,
  Play,
  Plus,
  Rows3,
  Search,
  Send,
  Sparkles,
  Star,
  Stars,
  WandSparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";

const categoryMeta = [
  { id: "all", label: "All instruments", icon: Layers3 },
  { id: "image", label: "Image atelier", icon: ImageIcon },
  { id: "motion", label: "Motion studio", icon: Film },
  { id: "sound", label: "Sound room", icon: Music2 },
  { id: "words", label: "Words & lyrics", icon: BookOpen },
  { id: "oracle", label: "Oracle chamber", icon: Stars },
  { id: "code", label: "Code rituals", icon: Code2 },
] as const;

type CategoryId = (typeof categoryMeta)[number]["id"];

type Tool = {
  id: number;
  name: string;
  category: Exclude<CategoryId, "all">;
  description: string;
  status: "ONLINE" | "LOCAL READY" | "CONNECTOR READY";
  tone: string;
  tag: string;
};

const families: Record<Exclude<CategoryId, "all">, { prefixes: string[]; tag: string; description: string; tone: string }> = {
  image: { prefixes: ["Portrait Forge", "Obsidian Frame", "Ruby Light", "Dream Surface", "Scene Alchemist", "Texture Room", "Form Finder", "Lens Ritual", "Archive Bloom", "Visual Oracle"], tag: "VISUAL", description: "Shape a visual direction through art, light, surface and atmosphere.", tone: "ruby" },
  motion: { prefixes: ["Cinematic Pulse", "Frame Weaver", "Motion Bloom", "Scene Orbit", "Sequence Room", "Kinetic Muse", "Cut Ritual", "Slow Cinema", "Light Choreographer", "Motion Oracle"], tag: "MOTION", description: "Compose movement, sequencing and visual rhythm for the next chapter.", tone: "violet" },
  sound: { prefixes: ["Sonic Alchemy", "Bass Ritual", "Voice Room", "Tempo Oracle", "Harmonic Field", "Noise Garden", "Pulse Composer", "Mix Chamber", "Frequency Bloom", "Aural Archive"], tag: "SOUND", description: "Build sonic worlds, vocal ideas, rhythm and atmosphere.", tone: "amber" },
  words: { prefixes: ["Lyric Mirror", "Poem Engine", "Narrative Veil", "Hook Foundry", "Verse Oracle", "Manifesto Room", "Story Thread", "Word Alchemist", "Rhyme Chamber", "Text Ritual"], tag: "WORDS", description: "Turn a feeling, fragment or contradiction into language.", tone: "ivory" },
  oracle: { prefixes: ["Dream Decoder", "Card Tirage", "Symbol Reader", "Night Archive", "Inner Weather", "Memory Oracle", "Archetype Room", "Choice Mirror", "Desire Lens", "Signal Seer"], tag: "ORACLE", description: "Read symbols, dreams, choices and inner landscapes as creative material.", tone: "blue" },
  code: { prefixes: ["Prompt Smith", "Role Architect", "Flow Weaver", "Data Ritual", "Agent Loom", "Logic Mirror", "Schema Studio", "System Scribe", "Code Oracle", "Pattern Forge"], tag: "SYSTEM", description: "Design prompts, roles, flows and creative systems for local models.", tone: "green" },
};

const tools: Tool[] = Object.entries(families).flatMap(([category, family], familyIndex) =>
  family.prefixes.flatMap((prefix, prefixIndex) =>
    Array.from({ length: 5 }, (_, variantIndex) => {
      const id = familyIndex * 50 + prefixIndex * 5 + variantIndex + 1;
      const variant = ["I", "II", "III", "IV", "V"][variantIndex];
      return {
        id,
        name: `${prefix} ${variant}`,
        category: category as Exclude<CategoryId, "all">,
        description: family.description,
        status: id % 7 === 0 ? "CONNECTOR READY" : id % 3 === 0 ? "LOCAL READY" : "ONLINE",
        tone: family.tone,
        tag: family.tag,
      };
    }),
  ),
);

const featuredIds = [1, 56, 104, 153, 203, 253];
const roles = ["The Muse", "The Mirror", "The Producer", "The Oracle", "The Scribe"];
const diamondData = [
  { name: "THE HUMAN", axis: "MEMORY", symbol: "○", prompt: "Who were you before the world named you?", result: "You kept the first name you were given, but not the shape it made you wear.", choices: ["I remember the quiet before the name.", "I became the name they gave me."] },
  { name: "THE ARTIST", axis: "CREATION", symbol: "✦", prompt: "What would you make if nobody could applaud?", result: "Creation is an act of defiance. Your hands answered before your fear did.", choices: ["Something unfinished but alive.", "Nothing. I would finally rest."] },
  { name: "THE SINNER", axis: "DESIRE", symbol: "◈", prompt: "What do you want when nobody is watching?", result: "Desire is not a confession. It is the direction your silence keeps choosing.", choices: ["To be seen without performing.", "To disappear without explaining."] },
  { name: "THE SAINT", axis: "FORGIVENESS", symbol: "†", prompt: "Which truth would you stop punishing yourself for?", result: "Forgiveness is the door you thought had to be earned before it could open.", choices: ["I was allowed to leave.", "I still owe them an ending."] },
  { name: "THE WARRIOR", axis: "WILL", symbol: "△", prompt: "What remains when doubt has used every argument?", result: "Will is not force. It is the quiet decision to return when leaving would be easier.", choices: ["I return, even without proof.", "I wait until I am certain."] },
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [compactView, setCompactView] = useState(false);
  const [microTool, setMicroTool] = useState("Dream Decoder");
  const [microInput, setMicroInput] = useState("");
  const [microOutput, setMicroOutput] = useState("Select an instrument and give it a fragment.");
  const [isPlaying, setIsPlaying] = useState(false);
  const [diamondIndex, setDiamondIndex] = useState(0);
  const [memory, setMemory] = useState<Record<string, number>>({ MEMORY: 0, CREATION: 0, DESIRE: 0, FORGIVENESS: 0, WILL: 0 });
  const [revelation, setRevelation] = useState(false);
  const [choiceMade, setChoiceMade] = useState(false);
  const [answeredDiamonds, setAnsweredDiamonds] = useState<Record<number, boolean>>({});
  const [role, setRole] = useState(roles[0]);
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("Awaiting a creative signal…");
  const [chat, setChat] = useState<{ from: "oracle" | "you"; text: string }[]>([
    { from: "oracle", text: "The chamber is open. Give me a fragment, a question or a contradiction." },
  ]);
  const [chatInput, setChatInput] = useState("");
  const drawerCloseRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageResult, setImageResult] = useState("Awaiting visual direction…");
  const roleMutation = trpc.lab.runRole.useMutation();
  const imageMutation = trpc.lab.generateImage.useMutation();

  useEffect(() => {
    if (!selectedTool) return;
    drawerCloseRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setSelectedTool(null); return; }
      if (event.key !== "Tab") return;
      const drawer = drawerCloseRef.current?.closest(".tool-drawer");
      if (!drawer) return;
      const focusable = Array.from(drawer.querySelectorAll<HTMLElement>("button, input, textarea, a[href], [tabindex]:not([tabindex='-1'])")).filter((item) => !item.hasAttribute("disabled"));
      if (!focusable.length) return;
      const first = focusable[0]; const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => { document.removeEventListener("keydown", onKeyDown); window.setTimeout(() => lastTriggerRef.current?.focus(), 0); };
  }, [selectedTool]);

  const filteredTools = useMemo(() => {
    const query = search.toLowerCase().trim();
    return tools.filter((tool) => {
      const matchesCategory = activeCategory === "all" || tool.category === activeCategory;
      const matchesSearch = !query || `${tool.name} ${tool.description} ${tool.tag}`.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  const toggleFavorite = (id: number) => {
    setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const runLocalRitual = async () => {
    if (!prompt.trim()) {
      toast.error("Give the chamber a signal first.");
      return;
    }
    setOutput(`${role} is interpreting your signal…`);
    try {
      const result = await roleMutation.mutateAsync({ role, input: prompt.trim() });
      setOutput(result.configured ? result.output || "The role returned an empty signal." : `Local-ready preview from ${role}: “${prompt.trim()}” becomes a doorway. Follow the tension, keep the image, remove the explanation.`);
    } catch {
      setOutput("The local role is unreachable. Check the endpoint and try again.");
    }
  };

  const runImageRitual = async () => {
    if (!imagePrompt.trim()) {
      toast.error("Give the image atelier a direction first.");
      return;
    }
    setImageResult("The atelier is preparing a visual pass…");
    try {
      const result = await imageMutation.mutateAsync({ prompt: imagePrompt.trim() });
      setImageResult(result.configured ? "Visual result received from the connected provider." : "Image atelier ready. Connect an external image provider endpoint to render the final asset.");
    } catch {
      setImageResult("The image provider is unreachable. The atelier remains ready for connection.");
    }
  };

  const chooseDiamond = (index: number) => { setDiamondIndex(index); setChoiceMade(Boolean(answeredDiamonds[index])); };
  const answerDiamond = (choiceIndex: number) => {
    const axis = diamondData[diamondIndex].axis;
    const result = applyDiamondAnswer(memory, answeredDiamonds, diamondIndex, axis, choiceIndex);
    if (!result.applied) return;
    setMemory(result.memory);
    setAnsweredDiamonds(result.answered);
    setChoiceMade(true);
    if (Object.keys(result.answered).length === diamondData.length) setRevelation(true);
  };

  const runMicroTool = () => {
    if (!microInput.trim()) {
      toast.error("Give the instrument a fragment first.");
      return;
    }
    const replies: Record<string, string> = {
      "Dream Decoder": "The dream is not a prediction. It is a room your attention keeps returning to.",
      "Card Tirage": "The card on the table is The Threshold: choose the door that asks something back.",
      "Poem Engine": "A first line surfaces: ‘The dark was only learning my name.’",
      "Lyric Mirror": "Your hook wants less explanation and one image that can survive the chorus.",
      "Video Storyboard": "Sequence 01: a figure crosses the frame, turns toward the red light, and does not speak.",
    };
    setMicroOutput(replies[microTool] || "The instrument returned a new direction.");
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    const current = chatInput.trim();
    setChat((items) => [...items, { from: "you", text: current }, { from: "oracle", text: `I received “${current}”. Try asking what it reveals, what it hides, or what it wants to become.` }]);
    setChatInput("");
  };

  return (
    <div className="app-shell">
      <div className="grain" aria-hidden="true" />
      <header className="topbar">
        <a className="wordmark" href="#arrival" aria-label="Belentani home"><span className="mark">◇</span><span>BELENTANI</span></a>
        <nav className={mobileMenu ? "nav-links nav-open" : "nav-links"}>
          <a href="#lab" onClick={() => setMobileMenu(false)}>The Lab</a>
          <a href="#featured" onClick={() => setMobileMenu(false)}>Featured</a>
          <a href="#oracle" onClick={() => setMobileMenu(false)}>Oracle</a>
          <a href="#artist" onClick={() => setMobileMenu(false)}>The Artist</a>
        </nav>
        <div className="topbar-actions">
          <span className="status-dot"><i /> SYSTEM ONLINE</span>
          <button className="icon-button mobile-trigger" onClick={() => setMobileMenu((value) => !value)} aria-label="Open menu"><Menu size={18} /></button>
          <button className="round-button" onClick={() => scrollToId("lab")} aria-label="Enter laboratory"><ArrowUpRight size={18} /></button>
        </div>
      </header>

      <main>
        <section className="hero" id="arrival">
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
          <div className="hero-orbit orbit-three" />
          <div className="hero-copy reveal-up">
            <div className="eyebrow"><span className="eyebrow-line" /> BELENTANI // JUDAS <span className="eyebrow-state">LABORATORY 001</span></div>
            <h1>Enter the<br /><em>unknown.</em></h1>
            <p className="hero-lede">A living studio for sound, vision, language and the things that refuse to be explained.</p>
            <div className="hero-actions">
              <button className="primary-cta" onClick={() => scrollToId("lab")}>ENTER THE LAB <ArrowUpRight size={15} /></button>
              <button className="text-cta" onClick={() => scrollToId("oracle")}>OPEN THE ORACLE <ChevronRight size={15} /></button>
            </div>
            <div className="hero-meta"><span>300 instruments</span><span>05 local roles</span><span>∞ directions</span></div>
          </div>
          <div className="hero-sigil" aria-hidden="true"><div className="sigil-core" /><span className="sigil-label sigil-top">NO EXTERNAL LIMITS</span><span className="sigil-label sigil-bottom">MAKE SOMETHING TRUE</span></div>
          <div className="scroll-cue"><span>SCROLL TO DISCOVER</span><div className="scroll-line" /></div>
        </section>

        <section className="manifesto section-pad">
          <div className="section-index">01 / MANIFESTO</div>
          <div className="manifesto-grid"><h2>Not a dashboard.<br /><em>A doorway.</em></h2><div className="manifesto-copy"><p>Judas is the next release. The Lab is the machine behind it: a tactile collection of creative instruments designed to make ideas move.</p><p>Choose a role. Bring a fragment. Let the system return something you did not know you had already written.</p><button className="line-link" onClick={() => scrollToId("artist")}>READ THE BELENTANI NOTE <ArrowUpRight size={14} /></button></div></div>
        </section>

        <section className="lab-section section-pad" id="lab">
          <div className="section-head"><div><div className="section-index">02 / THE LABORATORY</div><h2>300 ways to<br /><em>begin again.</em></h2></div><div className="section-caption"><span className="live-pulse" /> Curated instruments for human + local intelligence.<br />No noise. Only direction.</div></div>
          <div className="lab-toolbar"><div className="search-wrap"><Search size={16} /><input aria-label="Search instruments" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search the instruments…" /><kbd>⌘ K</kbd></div><button className="filter-button" onClick={() => setActiveCategory("all")}><Command size={14} /> {filteredTools.length} FOUND</button><button className={compactView ? "filter-button active" : "filter-button"} onClick={() => setCompactView((value) => !value)} aria-label="Toggle compact view"><Rows3 size={14} /> {compactView ? "COMPACT" : "GRID"}</button></div>
          <div className="category-rail" role="tablist" aria-label="Tool categories">{categoryMeta.map((category) => { const Icon = category.icon; return <button key={category.id} className={activeCategory === category.id ? "category-tab active" : "category-tab"} onClick={() => setActiveCategory(category.id)} role="tab" aria-selected={activeCategory === category.id}><Icon size={15} />{category.label}</button>; })}</div>
          {filteredTools.length > 0 ? <div className={compactView ? "tool-grid compact" : "tool-grid"}>{filteredTools.slice(0, 24).map((tool, index) => <ToolCard key={tool.id} tool={tool} index={index} favorite={favorites.includes(tool.id)} onFavorite={() => toggleFavorite(tool.id)} onOpen={(element) => { lastTriggerRef.current = element; setSelectedTool(tool); }} />)}</div> : <div className="empty-state"><Search size={20} /><strong>No instrument found.</strong><span>Try another word or return to all instruments.</span><button className="line-link" onClick={() => { setSearch(""); setActiveCategory("all"); }}>RESET ARCHIVE <ArrowUpRight size={14} /></button></div>}
          <div className="catalog-footer"><span>Showing {Math.min(filteredTools.length, 24)} of {filteredTools.length} instruments</span><button className="line-link" onClick={() => toast.success("The full 300-instrument archive is indexed.")}>OPEN FULL ARCHIVE <ArrowUpRight size={14} /></button></div>
        </section>

        <section className="portal-section section-pad" id="portal"><div className="section-index">02.4 / THE PORTAL</div><div className="portal-intro"><h2>Five fragments.<br /><em>One missing.</em></h2><p>The portal does not ask you to win. It asks you to leave a trace. Choose a diamond and recover the memory inside it.</p></div><div className="diamond-constellation">{diamondData.map((diamond, index) => <button key={diamond.name} className={diamondIndex === index ? "diamond-node active" : "diamond-node"} onClick={() => chooseDiamond(index)}><span className="diamond-symbol">{diamond.symbol}</span><small>0{index + 1} / {diamond.axis}</small><strong>{diamond.name}</strong></button>)}</div><div className="diamond-reading"><div className="reading-mark">{diamondData[diamondIndex].symbol}</div><div><span className="mono-label">DECISION // {diamondData[diamondIndex].axis}</span><h3>{diamondData[diamondIndex].prompt}</h3><p>{choiceMade ? diamondData[diamondIndex].result : "Choose a response. The core will remember the direction, not the explanation."}</p><div className="choice-list">{diamondData[diamondIndex].choices.map((choice, index) => <button key={choice} className={choiceMade ? "choice-button answered" : "choice-button"} disabled={choiceMade} onClick={() => answerDiamond(index)}><span>0{index + 1}</span>{choice}</button>)}</div><button className="line-link" onClick={() => chooseDiamond((diamondIndex + 1) % diamondData.length)}>OPEN NEXT DIAMOND <ChevronRight size={14} /></button></div></div><div className="memory-console"><span className="mono-label">JUDAS CORE / MEMORY PROFILE</span><div className="memory-bars">{Object.entries(memory).map(([key, value]) => <div className="memory-row" key={key}><span>{key}</span><div><i style={{ width: `${value}%` }} /></div><b>{value}%</b></div>)}</div>{revelation && <div className="revelation"><span>ERROR / IDENTITY RESTORED</span><strong>THE MISSING PIECE IS YOU.</strong><button className="primary-cta" onClick={() => toast.success("The next chapter is yours.")}>ENTER THE NEXT CHAPTER <ArrowUpRight size={15} /></button><div className="profile-card"><span className="mono-label">YOUR JUDAS PROFILE</span><p>{memory.CREATION >= memory.MEMORY ? "You chose creation over obedience." : "You returned to memory before you chose creation."} {memory.FORGIVENESS > memory.DESIRE ? "You made room for forgiveness." : "You protected the desire you could not name."}</p></div></div>}</div></section>

        <section className="visual-atelier section-pad" id="visuals"><div className="atelier-preview"><div className="atelier-diamond">◇</div><span className="atelier-coordinates">IMAGE ATELIER / 07° 13' RUBY</span><div className="atelier-grid-lines" /></div><div className="atelier-copy"><div className="section-index">02.5 / IMAGE ATELIER</div><h2>Make the<br /><em>unseen visible.</em></h2><p>A front-end surface for an external image engine. The prompt, style and result travel through a private server adapter when you connect your provider.</p><div className="atelier-input"><textarea disabled={imageMutation.isPending} value={imagePrompt} onChange={(event) => setImagePrompt(event.target.value)} placeholder="Describe the visual you want to enter…" rows={3} /><button className="primary-cta" onClick={runImageRitual} disabled={imageMutation.isPending}><WandSparkles size={15} /> {imageMutation.isPending ? "PREPARING" : "GENERATE VISUAL"}</button></div><div className="atelier-status"><span><span className="live-pulse" /> {imageResult}</span><span>EXTERNAL ADAPTER / READY</span></div></div></section>

        <section className="micro-suite section-pad" id="suite"><div className="section-index">02.7 / SPECIALIST ROOMS</div><div className="micro-suite-head"><h2>Small rooms.<br /><em>Deep signals.</em></h2><p className="section-caption">Dedicated instruments for the fragments that do not fit inside one box.</p></div><div className="micro-grid">{["Video Storyboard", "Poem Engine", "Lyric Mirror", "Dream Decoder", "Card Tirage"].map((name, index) => <button key={name} className={microTool === name ? "micro-card active" : "micro-card"} onClick={() => setMicroTool(name)}><span>0{index + 1}</span><strong>{name}</strong><small>{index < 1 ? "MOTION" : index < 3 ? "WORDS" : "ORACLE"}</small></button>)}</div><div className="micro-workbench"><div><span className="mono-label">ACTIVE ROOM // {microTool.toUpperCase()}</span><p>{microOutput}</p></div><div className="micro-input"><input aria-label={`Input for ${microTool}`} value={microInput} onChange={(event) => setMicroInput(event.target.value)} onKeyDown={(event) => event.key === "Enter" && runMicroTool()} placeholder="Give this room a fragment…" /><button onClick={runMicroTool} aria-label={`Run ${microTool}`}><Sparkles size={15} /></button></div></div></section>

        <section className="playground section-pad" id="oracle">
          <div className="section-index">03 / LOCAL ROLE PLAYGROUND</div>
          <div className="playground-layout"><div className="playground-copy"><h2>Give it a<br /><em>signal.</em></h2><p>Five roles. One local model. Endless ways to turn a raw thought into a usable first move.</p><div className="role-list">{roles.map((item, index) => <button key={item} className={role === item ? "role-row selected" : "role-row"} onClick={() => setRole(item)}><span>0{index + 1}</span><strong>{item}</strong><ChevronRight size={16} /></button>)}</div></div><div className="console-card"><div className="console-top"><span><CircleDot size={12} /> LOCAL MODEL / ROLE ACTIVE</span><span>NO KEY REQUIRED</span></div><div className="console-orbit"><div className="console-ring ring-a" /><div className="console-ring ring-b" /><div className="console-diamond">◇</div></div><div className="console-output"><span className="mono-label">RETURN // {role.toUpperCase()}</span><p>{output}</p></div><div className="console-input"><input disabled={roleMutation.isPending} value={prompt} onChange={(event) => setPrompt(event.target.value)} onKeyDown={(event) => event.key === "Enter" && runLocalRitual()} placeholder="Write a fragment, question or image…" /><button onClick={runLocalRitual} disabled={roleMutation.isPending} aria-label="Run local role"><Send size={16} /></button></div><div className="console-footer"><span><Sparkles size={13} /> Runs in your local role layer</span><span>v0.1 / READY</span></div></div></div>
        </section>

        <section className="featured section-pad" id="featured">
          <div className="section-head compact"><div><div className="section-index">04 / SELECTED INSTRUMENTS</div><h2>The first<br /><em>five doors.</em></h2></div><p className="section-caption">A small constellation from the archive.<br />Open one. Stay with it.</p></div>
          <div className="featured-grid">{featuredIds.map((id, index) => { const tool = tools.find((item) => item.id === id)!; return <button key={id} className={`featured-card featured-${index + 1}`} onClick={() => setSelectedTool(tool)}><span className="featured-number">0{index + 1}</span><span className="featured-glyph">{["◌", "✦", "◈", "△", "†", "∞"][index]}</span><span className="featured-name">{tool.name}</span><span className="featured-tag">{tool.tag} <ArrowUpRight size={13} /></span></button>; })}</div>
        </section>

        <section className="sound-section section-pad"><div className="sound-visual"><div className="sound-wave"><span /><span /><span /><span /><span /><span /><span /><span /><span /></div><div className="sound-orbit" /></div><div className="sound-copy"><div className="section-index">05 / SOUND ROOM</div><h2>Judas,<br /><em>in frequency.</em></h2><p>A release is not a file. It is a room you can return to. Press play and let the pulse find the edges.</p><div className="player"><button className="play-button" onClick={() => setIsPlaying((value) => !value)}>{isPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}</button><div className="player-track"><strong>{isPlaying ? "Signal / playing" : "Signal / waiting"}</strong><span>JUDAS — NEXT RELEASE</span></div><div className="player-time">{isPlaying ? "01:17" : "00:00"} / 03:42</div></div></div></section>

        <section className="artist-section section-pad" id="artist"><div className="artist-mark">B</div><div className="artist-copy"><div className="section-index">06 / THE ARTIST</div><h2>Born between<br /><em>two cities.</em></h2><p>Belentani is a singer and songwriter born in São Paulo, raised in Barcelona, and shaped by the emotional architecture between R&B, pop and electronic music.</p><p>Judas is the next release: a piece about contradiction, desire, rupture and the strange freedom of becoming someone you did not expect.</p><a className="line-link" href="https://www.instagram.com/belentani_" target="_blank" rel="noreferrer">FOLLOW THE SIGNAL <ArrowUpRight size={14} /></a></div><div className="artist-stats"><div><span>01</span><strong>voice</strong></div><div><span>02</span><strong>vision</strong></div><div><span>03</span><strong>vulnerability</strong></div></div></section>

        <section className="chat-section section-pad"><div><div className="section-index">07 / JUDASCHAT</div><h2>Ask the<br /><em>oracle.</em></h2><p className="chat-intro">A conversational chamber for lyrics, concepts, dreams and impossible questions.</p></div><div className="chat-card"><div className="chat-head"><span><span className="online-ring" /> JUDASCHAT</span><span>LOCAL ROLE / THE ORACLE</span></div><div className="chat-messages">{chat.map((message, index) => <div key={`${message.text}-${index}`} className={message.from === "you" ? "chat-message you" : "chat-message"}><span>{message.from === "you" ? "YOU" : "ORACLE"}</span><p>{message.text}</p></div>)}</div><div className="chat-input"><input value={chatInput} onChange={(event) => setChatInput(event.target.value)} onKeyDown={(event) => event.key === "Enter" && sendChat()} placeholder="Ask about the next chapter…" /><button onClick={sendChat}><Send size={15} /></button></div></div></section>

        <section className="newsletter section-pad"><div className="newsletter-ornament">◇</div><div className="section-index">08 / TRANSMISSION</div><h2>Receive the<br /><em>next signal.</em></h2><p>New music, visual studies and strange tools, delivered only when they have something to say.</p><form onSubmit={(event) => { event.preventDefault(); toast.success("You are on the transmission list."); }}><input type="email" required placeholder="Your email address" aria-label="Email address" /><button className="primary-cta" type="submit">JOIN THE LIST <ArrowUpRight size={15} /></button></form></section>
      </main>

      <footer className="footer"><div className="footer-top"><a className="wordmark" href="#arrival"><span className="mark">◇</span><span>BELENTANI</span></a><span className="footer-note">AN ARTIST BLENDING R&B, POP & ELECTRONIC MUSIC<br />INTO A WORLD OF SONIC FANTASY.</span><div className="footer-links"><a href="https://open.spotify.com/intl-es/artist/2bU5Ir70YHHuUnq2f3WCYl" target="_blank" rel="noreferrer">Spotify</a><a href="https://youtube.com/@belentani" target="_blank" rel="noreferrer">YouTube</a><a href="https://www.instagram.com/belentani_" target="_blank" rel="noreferrer">Instagram</a></div></div><div className="footer-bottom"><span>© 2026 BELENTANI / JUDAS</span><span>THE NEXT CHAPTER IS YOURS.</span><button onClick={() => scrollToId("arrival")}>BACK TO TOP ↑</button></div></footer>

      {selectedTool && <div className="modal-backdrop" onClick={() => setSelectedTool(null)}><aside className="tool-drawer" role="dialog" aria-modal="true" aria-labelledby="tool-drawer-title" onClick={(event) => event.stopPropagation()}><button ref={drawerCloseRef} className="drawer-close" onClick={() => setSelectedTool(null)} aria-label="Close tool"><X size={18} /></button><div className={`drawer-glyph tone-${selectedTool.tone}`}>{selectedTool.tag === "ORACLE" ? "◈" : selectedTool.tag === "MOTION" ? "△" : selectedTool.tag === "SOUND" ? "∿" : "✦"}</div><span className="mono-label">INSTRUMENT {String(selectedTool.id).padStart(3, "0")} / {selectedTool.status}</span><h2 id="tool-drawer-title">{selectedTool.name}</h2><p>{selectedTool.description}</p><div className="drawer-specs"><div><span>ROLE</span><strong>{selectedTool.tag}</strong></div><div><span>STATE</span><strong>{selectedTool.status}</strong></div><div><span>MODE</span><strong>LOCAL / HYBRID</strong></div></div><button className="primary-cta wide" onClick={() => { setSelectedTool(null); scrollToId("oracle"); toast.success(`${selectedTool.name} loaded into the playground.`); }}>LOAD INTO PLAYGROUND <ArrowUpRight size={15} /></button><button className="secondary-cta" onClick={() => { toggleFavorite(selectedTool.id); toast.success(favorites.includes(selectedTool.id) ? "Removed from collection." : "Saved to your collection."); }}>{favorites.includes(selectedTool.id) ? <Check size={15} /> : <Star size={15} />} {favorites.includes(selectedTool.id) ? "SAVED TO COLLECTION" : "SAVE TO COLLECTION"}</button></aside></div>}
    </div>
  );
}

function ToolCard({ tool, index, favorite, onFavorite, onOpen }: { tool: Tool; index: number; favorite: boolean; onFavorite: () => void; onOpen: (element: HTMLElement) => void }) {
  return <article className={`tool-card tone-${tool.tone}`} style={{ "--delay": `${(index % 6) * 55}ms` } as React.CSSProperties} onClick={(event) => onOpen(event.currentTarget)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onOpen(event.currentTarget); } }} tabIndex={0} role="button"><div className="tool-card-top"><span className="tool-id">{String(tool.id).padStart(3, "0")}</span><button className={favorite ? "favorite active" : "favorite"} onClick={(event) => { event.stopPropagation(); onFavorite(); }} aria-label={favorite ? "Remove favorite" : "Add favorite"}><Star size={14} fill={favorite ? "currentColor" : "none"} /></button></div><div className="tool-glyph">{tool.tag === "ORACLE" ? "◈" : tool.tag === "MOTION" ? "△" : tool.tag === "SOUND" ? "∿" : tool.tag === "WORDS" ? "Aa" : tool.tag === "SYSTEM" ? "⌘" : "✦"}</div><div className="tool-card-bottom"><span className="tool-tag">{tool.tag}</span><h3>{tool.name}</h3><p>{tool.status} <span className="mini-dot" /></p></div></article>;
}
