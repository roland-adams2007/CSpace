import { useAuth } from "../context/Auth/UseAuth";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";

// ─── Animation Variants ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};
const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const features = [
  {
    icon: "🌐",
    title: "Multi-Site Management",
    description:
      "Manage unlimited websites from a single dashboard. Switch context instantly, track stats per site, and keep everything organized without juggling multiple accounts.",
    badge: "Core",
  },
  {
    icon: "🧱",
    title: "Visual Website Builder",
    description:
      "Build pages using structured, JSON-driven components — no code required. Add headers, hero sections, galleries, and footers with a drag-and-drop-ready interface.",
    badge: "Builder",
  },
  {
    icon: "🔒",
    title: "Secure by Default",
    description:
      "Every account is protected with email verification before access is granted. Routes are guarded, tenants are fully isolated, and sessions are managed securely.",
    badge: "Auth",
  },
  {
    icon: "⚡",
    title: "Async Email Processing",
    description:
      "Emails are dispatched via Redis-backed background workers — never blocking your request cycle. Verification, notifications, and alerts are delivered reliably at scale.",
    badge: "Infrastructure",
  },
  {
    icon: "🎨",
    title: "Theme-Ready Architecture",
    description:
      "The platform is structured to support multiple themes and color systems. Swap the look of any site without touching content — full separation of data and design.",
    badge: "Design",
  },
  {
    icon: "🔗",
    title: "Tenant Routing",
    description:
      "Each website gets a dedicated public URL at /c/your-brand. Routes are resolved dynamically, making sharing, linking, and embedding your site effortless.",
    badge: "Routing",
  },
  {
    icon: "📄",
    title: "Dynamic Page Engine",
    description:
      "Pages are built from structured JSON layouts stored in the database. Add, reorder, and remove components — the renderer handles the rest in real time.",
    badge: "Engine",
  },
  {
    icon: "📊",
    title: "Per-Site Analytics",
    description:
      "Track visitors, file uploads, messages received, and active automations per site. A live dashboard gives you the pulse of every property you manage.",
    badge: "Analytics",
  },
  {
    icon: "📬",
    title: "Contact & Messaging",
    description:
      "Every site can receive form submissions from visitors. Messages are aggregated in your dashboard so you never miss a lead, inquiry, or feedback entry.",
    badge: "Messaging",
  },
];

const steps = [
  {
    step: "01",
    title: "Create Account",
    desc: "Register with your email. A verification link is sent — click it to unlock your full workspace.",
    detail: "Uses secure token-based email verification with Redis-queued delivery.",
  },
  {
    step: "02",
    title: "Add a Website",
    desc: "Give your site a name and a unique slug. It's provisioned instantly with its own routing context.",
    detail: "Tenant isolation is applied automatically — each site is fully sandboxed.",
  },
  {
    step: "03",
    title: "Build Pages",
    desc: "Open the builder, add structured components — header, sections, footer — and arrange them visually.",
    detail: "Pages are stored as JSON layouts and rendered server-side on the public route.",
  },
  {
    step: "04",
    title: "Publish & Share",
    desc: "Your site is live at /c/your-slug the moment you save. Share the link — no deployment needed.",
    detail: "Dynamic routing resolves tenant slugs in real time with zero config.",
  },
];

const stats = [
  { value: "∞", label: "Websites per account" },
  { value: "< 1s", label: "Site provisioning time" },
  { value: "100%", label: "Tenant isolation" },
  { value: "JSON", label: "Powered page layouts" },
];

const architecture = [
  {
    layer: "Frontend",
    tech: "React + Tailwind",
    desc: "Component-driven UI with responsive layouts and smooth animations.",
    color: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-500/30",
    dot: "bg-blue-400",
  },
  {
    layer: "Auth Layer",
    tech: "Token-based verification",
    desc: "Signup → email verify → protected access. No shortcuts, no leaks.",
    color: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/30",
    dot: "bg-emerald-400",
  },
  {
    layer: "API / Backend",
    tech: "RESTful endpoints",
    desc: "Clean API surface for CRUD on websites, pages, components, and users.",
    color: "from-indigo-500/20 to-violet-500/20",
    border: "border-indigo-500/30",
    dot: "bg-indigo-400",
  },
  {
    layer: "Queue / Workers",
    tech: "Redis + Background jobs",
    desc: "Async email dispatch and task processing — decoupled from request threads.",
    color: "from-orange-500/20 to-red-500/20",
    border: "border-orange-500/30",
    dot: "bg-orange-400",
  },
  {
    layer: "Data Layer",
    tech: "JSON-driven layouts",
    desc: "Website structure stored as structured data, enabling dynamic rendering.",
    color: "from-purple-500/20 to-pink-500/20",
    border: "border-purple-500/30",
    dot: "bg-purple-400",
  },
  {
    layer: "Routing",
    tech: "Multi-tenant slugs",
    desc: "Every tenant resolves at /c/:slug — isolated, fast, and publicly shareable.",
    color: "from-yellow-500/20 to-amber-500/20",
    border: "border-yellow-500/30",
    dot: "bg-yellow-400",
  },
];

const faqs = [
  {
    q: "How does multi-tenancy work?",
    a: "Each website you create is scoped to a unique slug and fully isolated from others. Routes, data, and settings are all separated at the application layer — no shared state between tenants.",
  },
  {
    q: "What does the builder actually produce?",
    a: "The builder produces a structured JSON layout saved to the database. When someone visits your public /c/slug URL, the renderer reads that JSON and dynamically outputs your page.",
  },
  {
    q: "Is email verification required?",
    a: "Yes. After registration, a verification email is dispatched via a Redis-backed background worker. You cannot access the dashboard until your email is confirmed — this keeps accounts clean and secure.",
  },
  {
    q: "Can I have multiple websites?",
    a: "Yes — as many as you need. Every website is managed from the same dashboard and gets its own analytics, pages, files, and public slug.",
  },
  {
    q: "What components can I add to pages?",
    a: "Currently the builder supports structured components including headers, hero sections, content sections, galleries, and footers. The component registry is designed to expand with new types over time.",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
const HomePage = () => {
  const { user, loginUser } = useAuth();
  const heroRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans overflow-x-hidden">

      {/* ─── NAV ─── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-gray-950/80 backdrop-blur-md"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
            C
          </div>
          <span className="font-semibold text-sm text-white">Creator Workspace</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
          <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <motion.a
              href="/dashboard"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Go to Dashboard →
            </motion.a>
          ) : (
            <>
              <motion.button
                onClick={loginUser}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
              >
                Sign in
              </motion.button>
              <motion.a
                href="/register"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-white text-gray-900 text-sm font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Get started
              </motion.a>
            </>
          )}
        </div>
      </motion.nav>

      {/* ─── HERO ─── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px]" />
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-purple-600/8 blur-[100px]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            variants={fadeIn} initial="hidden" animate="visible" custom={0}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Multi-tenant website platform · Now in beta
          </motion.div>

          <motion.h1
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.08] mb-6"
          >
            Build websites.
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Own your space.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Creator Workspace is a centralized platform for creators and businesses to build, manage, and publish multiple websites — from one powerful dashboard. No juggling tools. No scattered logins.
          </motion.p>

          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            {user ? (
              <motion.a
                href="/dashboard"
                whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(99,102,241,0.4)" }}
                whileTap={{ scale: 0.97 }}
                className="px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors text-sm"
              >
                Open Dashboard →
              </motion.a>
            ) : (
              <>
                <motion.a
                  href="/register"
                  whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(99,102,241,0.4)" }}
                  whileTap={{ scale: 0.97 }}
                  className="px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors text-sm"
                >
                  Start for free
                </motion.a>
                <motion.button
                  onClick={loginUser}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-7 py-3.5 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white font-medium rounded-xl transition-all text-sm bg-white/5"
                >
                  Sign in
                </motion.button>
              </>
            )}
          </motion.div>

          {/* Hero mockup */}
          <motion.div
            variants={scaleIn} initial="hidden" animate="visible" custom={4}
            className="mt-16 relative mx-auto max-w-3xl"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl" />
            <div className="relative rounded-2xl border border-white/10 bg-gray-900 overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-gray-900">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
                <div className="flex-1 mx-4 h-6 rounded bg-gray-800 flex items-center px-3">
                  <span className="text-xs text-gray-500">app.creatorworkspace.com/dashboard</span>
                </div>
              </div>
              <div className="p-5 grid grid-cols-4 gap-3">
                {["Total Visitors", "Files Stored", "Messages", "Automations"].map((label, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.08 }}
                    className="bg-gray-800 rounded-lg p-3 border border-white/5"
                  >
                    <div className="w-6 h-6 rounded bg-indigo-500/20 mb-2" />
                    <div className="text-xs text-gray-500 mb-1">{label}</div>
                    <div className="text-sm font-bold text-white">{["4,862", "324", "89", "12"][i]}</div>
                    <div className="text-xs text-emerald-400 mt-1">↑ {[12, 8, 24, 0][i]}%</div>
                  </motion.div>
                ))}
                <div className="col-span-3 bg-gray-800 rounded-lg p-3 border border-white/5">
                  <div className="text-xs text-gray-500 mb-3">Recent Activity</div>
                  {["New file uploaded", "Design updated", "Message received"].map((a, i) => (
                    <motion.div
                      key={a}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.1 + i * 0.1 }}
                      className="flex items-center gap-2 py-1.5 border-b border-white/5 last:border-0"
                    >
                      <div className="w-5 h-5 rounded bg-indigo-500/20 flex-shrink-0" />
                      <span className="text-xs text-gray-400">{a}</span>
                      <span className="text-xs text-gray-600 ml-auto">{["2h", "1d", "2d"][i]}</span>
                    </motion.div>
                  ))}
                </div>
                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg p-3 flex flex-col justify-between">
                  <div className="text-xs text-indigo-100">Upgrade to Pro</div>
                  <div className="mt-2 text-xs bg-white/20 rounded px-2 py-1 text-white text-center">Upgrade →</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── STATS BAND ─── */}
      <section className="py-16 px-6 border-y border-white/5 bg-gray-900/40">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
                {s.value}
              </div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} custom={0} className="text-indigo-400 text-sm font-medium mb-3 uppercase tracking-widest">
              Everything you need
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-bold text-white">
              Built for creators
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-gray-400 mt-4 max-w-xl mx-auto">
              A complete platform to launch, manage, and scale your web presence — without stitching together a dozen tools.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, borderColor: "rgba(99,102,241,0.4)" }}
                className="group p-6 rounded-2xl border border-white/8 bg-gray-900/60 backdrop-blur-sm transition-all duration-300 cursor-default"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-2xl">{f.icon}</div>
                  <span className="text-xs font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-2 py-0.5">
                    {f.badge}
                  </span>
                </div>
                <h3 className="text-white font-semibold mb-2 group-hover:text-indigo-300 transition-colors">
                  {f.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="py-24 px-6 bg-gray-900/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} custom={0} className="text-indigo-400 text-sm font-medium mb-3 uppercase tracking-widest">
              Simple setup
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-bold text-white">
              Up and running in minutes
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-gray-400 mt-4 max-w-lg mx-auto">
              The entire onboarding flow — from signup to published site — is designed to take less than five minutes.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, x: i % 2 === 0 ? -24 : 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="flex gap-5 p-6 rounded-2xl border border-white/8 bg-gray-900/60"
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center">
                  <span className="text-indigo-400 font-mono font-bold">{s.step}</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{s.title}</h3>
                  <p className="text-gray-300 text-sm mb-2">{s.desc}</p>
                  <p className="text-gray-500 text-xs leading-relaxed border-l border-indigo-500/30 pl-3">{s.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BUILDER SPOTLIGHT ─── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-indigo-400 text-sm font-medium mb-3 uppercase tracking-widest">The Builder</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">
              Pages made from<br />
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">structured data</span>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              Unlike traditional CMS platforms that store pages as blobs of HTML, Creator Workspace stores your entire page as a clean JSON structure. Each component — header, hero, section, footer — is a typed object with properties you define.
            </p>
            <p className="text-gray-400 leading-relaxed mb-8">
              This makes pages portable, version-friendly, and easy to render anywhere. The renderer reads the layout and outputs the page dynamically — no static export required.
            </p>
            <div className="space-y-3">
              {[
                "Add, remove, and reorder components visually",
                "Each component has typed properties (text, images, links)",
                "Layouts saved instantly — no publish step needed",
                "Render your site anywhere via the public tenant URL",
              ].map((point, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className="flex items-start gap-3 text-sm text-gray-300"
                >
                  <div className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  </div>
                  {point}
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="absolute -inset-2 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-3xl blur-xl" />
            <div className="relative bg-gray-900 rounded-2xl border border-white/10 overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                <span className="text-xs text-gray-600 ml-2">page-layout.json</span>
              </div>
              <pre className="p-5 text-xs leading-6 overflow-x-auto">
                <code className="text-gray-300">{`{
  `}<span className="text-indigo-400">"page"</span>{`: {
    `}<span className="text-indigo-400">"title"</span>{`: `}<span className="text-emerald-400">"My Portfolio"</span>{`,
    `}<span className="text-indigo-400">"slug"</span>{`: `}<span className="text-emerald-400">"/"</span>{`,
    `}<span className="text-indigo-400">"components"</span>{`: [
      {
        `}<span className="text-indigo-400">"type"</span>{`: `}<span className="text-emerald-400">"header"</span>{`,
        `}<span className="text-indigo-400">"props"</span>{`: {
          `}<span className="text-indigo-400">"logo"</span>{`: `}<span className="text-emerald-400">"My Brand"</span>{`,
          `}<span className="text-indigo-400">"links"</span>{`: [`}<span className="text-emerald-400">"About"</span>{`, `}<span className="text-emerald-400">"Work"</span>{`]
        }
      },
      {
        `}<span className="text-indigo-400">"type"</span>{`: `}<span className="text-emerald-400">"hero"</span>{`,
        `}<span className="text-indigo-400">"props"</span>{`: {
          `}<span className="text-indigo-400">"headline"</span>{`: `}<span className="text-emerald-400">"Hello World"</span>{`,
          `}<span className="text-indigo-400">"cta"</span>{`: `}<span className="text-emerald-400">"See my work"</span>{`
        }
      },
      {
        `}<span className="text-indigo-400">"type"</span>{`: `}<span className="text-emerald-400">"footer"</span>{`,
        `}<span className="text-indigo-400">"props"</span>{`: {
          `}<span className="text-indigo-400">"text"</span>{`: `}<span className="text-emerald-400">"© 2025 My Brand"</span>{`
        }
      }
    ]
  }
}`}
                </code>
              </pre>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── ARCHITECTURE ─── */}
      <section id="architecture" className="py-24 px-6 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} custom={0} className="text-indigo-400 text-sm font-medium mb-3 uppercase tracking-widest">
              Under the hood
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-bold text-white">
              How it's built
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-gray-400 mt-4 max-w-xl mx-auto">
              Creator Workspace is engineered for scalability from day one. Each layer has a clear responsibility and clean separation from the others.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {architecture.map((a, i) => (
              <motion.div
                key={a.layer}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                whileHover={{ y: -3 }}
                className={`p-6 rounded-2xl border ${a.border} bg-gradient-to-br ${a.color} backdrop-blur-sm`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-2 h-2 rounded-full ${a.dot}`} />
                  <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">{a.layer}</span>
                </div>
                <h3 className="text-white font-semibold text-sm mb-2">{a.tech}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{a.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Auth flow diagram */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 p-8 rounded-2xl border border-white/8 bg-gray-900/60"
          >
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-6 text-center">Authentication Flow</p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-3 flex-wrap">
              {[
                { label: "Register", color: "bg-blue-500/20 border-blue-500/30 text-blue-300" },
                { label: "→", plain: true },
                { label: "Email Dispatched", color: "bg-orange-500/20 border-orange-500/30 text-orange-300" },
                { label: "→", plain: true },
                { label: "Redis Queue", color: "bg-red-500/20 border-red-500/30 text-red-300" },
                { label: "→", plain: true },
                { label: "Worker Sends", color: "bg-yellow-500/20 border-yellow-500/30 text-yellow-300" },
                { label: "→", plain: true },
                { label: "User Verifies", color: "bg-emerald-500/20 border-emerald-500/30 text-emerald-300" },
                { label: "→", plain: true },
                { label: "Dashboard Access", color: "bg-indigo-500/20 border-indigo-500/30 text-indigo-300" },
              ].map((item, i) =>
                item.plain ? (
                  <span key={i} className="text-lg font-light text-gray-600">{item.label}</span>
                ) : (
                  <span key={i} className={`px-3 py-1.5 rounded-lg border text-xs font-medium ${item.color}`}>
                    {item.label}
                  </span>
                )
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <motion.p variants={fadeUp} custom={0} className="text-indigo-400 text-sm font-medium mb-3 uppercase tracking-widest">
              Common questions
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-bold text-white">
              FAQ
            </motion.h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="border border-white/8 rounded-xl overflow-hidden bg-gray-900/40"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/3 transition-colors"
                >
                  <span className="text-white font-medium text-sm pr-4">{faq.q}</span>
                  <motion.span
                    animate={{ rotate: openFaq === i ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-gray-400 text-xl flex-shrink-0"
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-sm text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center relative"
        >
          <div className="absolute -inset-8 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10 rounded-3xl blur-2xl" />
          <div className="relative p-12 rounded-3xl border border-white/10 bg-gray-900/80">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Free to start
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to build?
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Create your account, verify your email, and have your first website live — in under five minutes.
            </p>
            {user ? (
              <motion.a
                href="/dashboard"
                whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(99,102,241,0.5)" }}
                whileTap={{ scale: 0.97 }}
                className="inline-block px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors"
              >
                Go to Dashboard →
              </motion.a>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.a
                  href="/register"
                  whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(99,102,241,0.5)" }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors"
                >
                  Create free account
                </motion.a>
                <motion.button
                  onClick={loginUser}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-4 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white rounded-xl transition-all bg-white/5"
                >
                  Sign in
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                  C
                </div>
                <span className="font-semibold text-sm text-white">Creator Workspace</span>
              </div>
              <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                A multi-tenant platform for creators and businesses to build and manage websites from one dashboard.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 text-sm">
              <div>
                <p className="text-gray-300 font-medium mb-3">Platform</p>
                <div className="space-y-2 text-gray-500">
                  <a href="#features" className="block hover:text-gray-300 transition-colors">Features</a>
                  <a href="#how-it-works" className="block hover:text-gray-300 transition-colors">How it works</a>
                  <a href="#architecture" className="block hover:text-gray-300 transition-colors">Architecture</a>
                  <a href="#faq" className="block hover:text-gray-300 transition-colors">FAQ</a>
                </div>
              </div>
              <div>
                <p className="text-gray-300 font-medium mb-3">Account</p>
                <div className="space-y-2 text-gray-500">
                  <a href="/register" className="block hover:text-gray-300 transition-colors">Register</a>
                  <button onClick={loginUser} className="block hover:text-gray-300 transition-colors">Sign in</button>
                  {user && <a href="/dashboard" className="block hover:text-gray-300 transition-colors">Dashboard</a>}
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-600">© {new Date().getFullYear()} Creator Workspace. All rights reserved.</p>
            <p className="text-xs text-gray-700">Built with React · Redis · JSON-driven layouts</p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default HomePage;