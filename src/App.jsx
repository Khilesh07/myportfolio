import { useState, useEffect, useRef } from "react";

const NAV_LINKS = ["Home", "About", "Skills", "Projects", "Contact"];

const SKILLS = [
  { name: "Node.js", level: 90, color: "#68a063" },
  { name: "React.js", level: 88, color: "#61dafb" },
  { name: "MySQL", level: 82, color: "#00758f" },
  { name: "Express.js", level: 85, color: "#ffffff" },
  { name: "React Native", level: 75, color: "#61dafb" },
  { name: "HTML / CSS", level: 92, color: "#e34f26" },
  { name: "Data Analytics", level: 70, color: "#f7df1e" },
  { name: "Machine Learning", level: 65, color: "#ff6b6b" },
];

const PROJECTS = [
  {
    title: "Wintech-Bharat Website",
    tech: ["HTML", "CSS", "JavaScript"],
    desc: "Official company website for Wintech-Bharat Pvt Ltd. Focused on pixel-perfect front-end development with responsive layouts and smooth UX.",
    link: "https://www.wintechbharat.com",
    icon: "🌐",
    tag: "Live",
  },
  {
    title: "ZeRugged",
    tech: ["Node.js", "MySQL", "React.js"],
    desc: "Product-based e-commerce platform for rugged tablets, handhelds, and PDAs. Full-stack solution with dynamic product catalog and backend APIs.",
    link: "#",
    icon: "📱",
    tag: "Full Stack",
  },
  {
    title: "Acumen Mobile App",
    tech: ["React Native", "Expo"],
    desc: "Cross-platform mobile application built with React Native and Expo. Clean UI/UX for seamless mobile experience on iOS and Android.",
    link: "#",
    icon: "⚡",
    tag: "Mobile",
  },
  {
    title: "CRM Web Application",
    tech: ["Node.js", "React.js", "MySQL"],
    desc: "Internal Customer Relationship Management system for Wintech-Bharat. Streamlines sales pipeline, client tracking, and team workflows.",
    link: "#",
    icon: "🏢",
    tag: "Internal",
  },
  {
    title: "TechXpert Ticketing Tool",
    tech: ["Node.js", "Express", "MySQL"],
    desc: "Support ticketing platform for TechXpert Services. Enables efficient issue tracking, assignment, and resolution across teams.",
    link: "#",
    icon: "🎫",
    tag: "Tool",
  },
];

function useTypingEffect(words, speed = 100) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex % words.length];
    const timeout = setTimeout(
      () => {
        if (!deleting) {
          setText(current.slice(0, charIndex + 1));
          if (charIndex + 1 === current.length) {
            setTimeout(() => setDeleting(true), 1200);
          } else {
            setCharIndex((c) => c + 1);
          }
        } else {
          setText(current.slice(0, charIndex - 1));
          if (charIndex - 1 === 0) {
            setDeleting(false);
            setWordIndex((w) => (w + 1) % words.length);
            setCharIndex(0);
          } else {
            setCharIndex((c) => c - 1);
          }
        }
      },
      deleting ? speed / 2 : speed
    );
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, wordIndex, words, speed]);

  return text;
}

function Cursor3D() {
  const cursorRef = useRef(null);
  const trailRef = useRef(null);

  useEffect(() => {
    const move = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + "px";
        cursorRef.current.style.top = e.clientY + "px";
      }
      setTimeout(() => {
        if (trailRef.current) {
          trailRef.current.style.left = e.clientX + "px";
          trailRef.current.style.top = e.clientY + "px";
        }
      }, 80);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      <div ref={cursorRef} style={styles.cursor} />
      <div ref={trailRef} style={styles.cursorTrail} />
    </>
  );
}

function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    const particles = [];
    const W = (canvas.width = window.innerWidth);
    const H = (canvas.height = window.innerHeight);

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.5 + 0.3,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.6 + 0.2,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,255,200,${p.alpha})`;
        ctx.fill();
      });
      // draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,255,200,${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} style={styles.particleCanvas} />;
}

function Section({ id, children, style }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVis(true); },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id={id}
      ref={ref}
      style={{
        ...styles.section,
        ...style,
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(40px)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
      }}
    >
      {children}
    </section>
  );
}

function SkillBar({ name, level, color, delay }) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setTimeout(() => setAnimated(true), delay); },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [delay]);

  return (
    <div ref={ref} style={{ marginBottom: "18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ color: "#e0e0e0", fontSize: "0.85rem", letterSpacing: "0.05em" }}>{name}</span>
        <span style={{ color, fontSize: "0.8rem", fontWeight: 700 }}>{level}%</span>
      </div>
      <div style={styles.skillTrack}>
        <div
          style={{
            ...styles.skillFill,
            width: animated ? `${level}%` : "0%",
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            boxShadow: animated ? `0 0 12px ${color}66` : "none",
            transition: "width 1.2s cubic-bezier(0.4,0,0.2,1), box-shadow 1.2s ease",
          }}
        />
      </div>
    </div>
  );
}

function ProjectCard({ project, index }) {
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
    const y = ((e.clientX - rect.left) / rect.width - 0.5) * -20;
    setTilt({ x, y });
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }); }}
      onMouseMove={handleMouseMove}
      style={{
        ...styles.card,
        transform: hovered
          ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(20px) scale(1.02)`
          : "rotateX(0) rotateY(0) translateZ(0) scale(1)",
        borderColor: hovered ? "#00ffc8" : "#1a2a3a",
        boxShadow: hovered
          ? "0 30px 60px rgba(0,255,200,0.15), 0 0 0 1px rgba(0,255,200,0.3)"
          : "0 8px 32px rgba(0,0,0,0.4)",
        transition: "transform 0.3s ease, border-color 0.3s, box-shadow 0.3s",
        animationDelay: `${index * 0.1}s`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
        <span style={{ fontSize: "2rem" }}>{project.icon}</span>
        <span style={{
          fontSize: "0.65rem",
          padding: "3px 10px",
          borderRadius: "20px",
          background: "rgba(0,255,200,0.1)",
          color: "#00ffc8",
          border: "1px solid rgba(0,255,200,0.3)",
          letterSpacing: "0.1em",
          fontWeight: 700,
        }}>
          {project.tag}
        </span>
      </div>
      <h3 style={{ color: "#fff", fontSize: "1.05rem", marginBottom: "8px", letterSpacing: "0.03em" }}>{project.title}</h3>
      <p style={{ color: "#8899aa", fontSize: "0.82rem", lineHeight: 1.6, marginBottom: "16px" }}>{project.desc}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
        {project.tech.map((t) => (
          <span key={t} style={styles.techBadge}>{t}</span>
        ))}
      </div>
      {project.link !== "#" && (
        <a href={project.link} target="_blank" rel="noreferrer" style={styles.cardLink}>
          View Live →
        </a>
      )}
    </div>
  );
}

export default function App() {
  const [activeNav, setActiveNav] = useState("Home");
  const [menuOpen, setMenuOpen] = useState(false);
  const typed = useTypingEffect(["Full Stack Developer", "Node.js Engineer", "React Specialist", "MCA Student", "Problem Solver"]);

  const scrollTo = (id) => {
    const el = document.getElementById(id.toLowerCase());
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setActiveNav(id);
    setMenuOpen(false);
  };

  return (
    <div style={styles.root}>
      <style>{CSS}</style>
      <Cursor3D />
      <ParticleCanvas />

      {/* NAV */}
      <nav style={styles.nav}>
        <div style={styles.navLogo} onClick={() => scrollTo("Home")}>
          <span style={styles.logoAccent}>K</span>B
        </div>
        <div style={{ ...styles.navLinks, ...(menuOpen ? styles.navLinksOpen : {}) }}>
          {NAV_LINKS.map((l) => (
            <button
              key={l}
              onClick={() => scrollTo(l)}
              style={{
                ...styles.navBtn,
                color: activeNav === l ? "#00ffc8" : "#aabbc8",
                borderBottom: activeNav === l ? "2px solid #00ffc8" : "2px solid transparent",
              }}
            >
              {l}
            </button>
          ))}
        </div>
        <button style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* HERO */}
      <section id="home" style={styles.hero}>
        <div style={styles.heroGlow} />
        <div style={styles.heroContent}>
          <p style={styles.heroGreet}>Hello, World! 👋</p>
          <h1 style={styles.heroName}>Khilesh<br /><span style={styles.heroNameAccent}>Bhangale</span></h1>
          <div style={styles.heroTyped}>
            <span style={{ color: "#00ffc8" }}>{typed}</span>
            <span style={styles.blink}>|</span>
          </div>
          <p style={styles.heroSub}>
            Full Stack Developer @ <a href="https://www.wintechbharat.com" target="_blank" rel="noreferrer" style={{ color: "#00ffc8", textDecoration: "none" }}>Wintech-Bharat Pvt Ltd</a>
            <br />MCA · University of Mumbai &nbsp;|&nbsp; PG Diploma in Data Analytics & ML
          </p>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <button onClick={() => scrollTo("Projects")} style={styles.ctaPrimary}>View Projects</button>
            <button onClick={() => scrollTo("Contact")} style={styles.ctaSecondary}>Contact Me</button>
          </div>
        </div>
        <div style={styles.heroVisual}>
          <div style={styles.orb}>
            <div style={styles.orbInner}>
              <span style={{ fontSize: "3rem" }}>⚡</span>
            </div>
          </div>
          <div style={styles.floatingBadge1} className="float1">Node.js</div>
          <div style={styles.floatingBadge2} className="float2">React.js</div>
          <div style={styles.floatingBadge3} className="float3">MySQL</div>
          <div style={styles.floatingBadge4} className="float4">Express</div>
        </div>
      </section>

      {/* ABOUT */}
      <Section id="about">
        <div style={styles.sectionHeader}>
          <span style={styles.sectionNum}>01.</span>
          <h2 style={styles.sectionTitle}>About Me</h2>
          <div style={styles.sectionLine} />
        </div>
        <div style={styles.aboutGrid}>
          <div style={styles.aboutAvatar}>
            <div style={styles.avatarBox}>
              <span style={{ fontSize: "4rem" }}>👨‍💻</span>
              <div style={styles.avatarGlow} />
            </div>
          </div>
          <div style={styles.aboutText}>
            <p style={styles.aboutPara}>
              I'm <strong style={{ color: "#00ffc8" }}>Khilesh Bhangale</strong>, a passionate Full Stack Developer with hands-on experience building enterprise-grade web and mobile applications. Currently working at <strong style={{ color: "#00ffc8" }}>Wintech-Bharat Pvt Ltd</strong>, I architect and ship products that solve real business problems.
            </p>
            <p style={styles.aboutPara}>
              My stack centers around <strong style={{ color: "#61dafb" }}>Node.js</strong>, <strong style={{ color: "#61dafb" }}>React.js</strong>, <strong style={{ color: "#00758f" }}>MySQL</strong>, and <strong style={{ color: "#fff" }}>Express.js</strong>. I also explore React Native for mobile and data analytics with ML.
            </p>
            <div style={styles.infoGrid}>
              {[
                { label: "Role", val: "Full Stack Developer" },
                { label: "Company", val: "Wintech-Bharat Pvt Ltd" },
                { label: "Education", val: "MCA – Univ. of Mumbai" },
                { label: "Specialization", val: "Data Analytics & ML" },
              ].map((i) => (
                <div key={i.label} style={styles.infoItem}>
                  <span style={styles.infoLabel}>{i.label}</span>
                  <span style={styles.infoVal}>{i.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* SKILLS */}
      <Section id="skills" style={{ background: "rgba(0,255,200,0.02)" }}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionNum}>02.</span>
          <h2 style={styles.sectionTitle}>Skills</h2>
          <div style={styles.sectionLine} />
        </div>
        <div style={styles.skillsGrid}>
          {SKILLS.map((s, i) => (
            <SkillBar key={s.name} {...s} delay={i * 100} />
          ))}
        </div>
      </Section>

      {/* PROJECTS */}
      <Section id="projects">
        <div style={styles.sectionHeader}>
          <span style={styles.sectionNum}>03.</span>
          <h2 style={styles.sectionTitle}>Projects</h2>
          <div style={styles.sectionLine} />
        </div>
        <div style={styles.projectsGrid}>
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.title} project={p} index={i} />
          ))}
        </div>
      </Section>

      {/* CONTACT */}
      <Section id="contact">
        <div style={styles.sectionHeader}>
          <span style={styles.sectionNum}>04.</span>
          <h2 style={styles.sectionTitle}>Contact</h2>
          <div style={styles.sectionLine} />
        </div>
        <div style={styles.contactBox}>
          <div style={styles.contactGlow} />
          <h3 style={{ color: "#fff", fontSize: "1.6rem", marginBottom: "12px" }}>Let's Build Something <span style={{ color: "#00ffc8" }}>Amazing</span></h3>
          <p style={{ color: "#8899aa", marginBottom: "32px", maxWidth: "480px", margin: "0 auto 32px" }}>
            Open to freelance projects, collaborations, or exciting job opportunities. Let's talk!
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="mailto:khileshbhangale7297@gmail.com" style={styles.ctaPrimary}>📧 Send Email</a>
            <a href="https://www.linkedin.com/in/khilesh-bhangale-b8b147190" target="_blank" rel="noreferrer" style={styles.ctaSecondary}>💼 LinkedIn</a>
            <a href="https://github.com/khilesh07" target="_blank" rel="noreferrer" style={styles.ctaSecondary}>🐙 GitHub</a>
          </div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <p style={{ color: "#4a5a6a", fontSize: "0.8rem" }}>
          Designed & Built by <span style={{ color: "#00ffc8" }}>Khilesh Bhangale</span> · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}

const styles = {
  root: {
    background: "#050d15",
    minHeight: "100vh",
    fontFamily: "'Fira Code', 'Courier New', monospace",
    color: "#c8d8e8",
    overflowX: "hidden",
    cursor: "none",
  },
  cursor: {
    position: "fixed",
    width: "10px",
    height: "10px",
    background: "#00ffc8",
    borderRadius: "50%",
    pointerEvents: "none",
    zIndex: 9999,
    transform: "translate(-50%,-50%)",
    transition: "transform 0.1s",
    mixBlendMode: "screen",
  },
  cursorTrail: {
    position: "fixed",
    width: "30px",
    height: "30px",
    border: "1.5px solid rgba(0,255,200,0.4)",
    borderRadius: "50%",
    pointerEvents: "none",
    zIndex: 9998,
    transform: "translate(-50%,-50%)",
    transition: "left 0.12s ease, top 0.12s ease",
  },
  particleCanvas: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    zIndex: 0,
    pointerEvents: "none",
  },
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 5%",
    height: "64px",
    background: "rgba(5,13,21,0.85)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(0,255,200,0.08)",
  },
  navLogo: {
    fontSize: "1.4rem",
    fontWeight: 900,
    color: "#fff",
    cursor: "pointer",
    letterSpacing: "0.1em",
  },
  logoAccent: { color: "#00ffc8" },
  navLinks: {
    display: "flex",
    gap: "8px",
  },
  navLinksOpen: {},
  navBtn: {
    background: "none",
    border: "none",
    borderBottom: "2px solid transparent",
    padding: "8px 14px",
    cursor: "none",
    fontSize: "0.8rem",
    letterSpacing: "0.08em",
    transition: "color 0.2s, border-color 0.2s",
    fontFamily: "inherit",
  },
  hamburger: {
    display: "none",
    background: "none",
    border: "none",
    color: "#00ffc8",
    fontSize: "1.3rem",
    cursor: "none",
  },
  hero: {
    position: "relative",
    zIndex: 1,
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    padding: "80px 5% 40px",
    gap: "60px",
    flexWrap: "wrap",
  },
  heroGlow: {
    position: "absolute",
    top: "20%",
    left: "10%",
    width: "500px",
    height: "500px",
    background: "radial-gradient(circle, rgba(0,255,200,0.06) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  heroContent: {
    flex: "1 1 340px",
    zIndex: 2,
  },
  heroGreet: {
    color: "#00ffc8",
    fontSize: "0.9rem",
    letterSpacing: "0.2em",
    marginBottom: "12px",
    fontWeight: 500,
  },
  heroName: {
    fontSize: "clamp(2.5rem, 6vw, 5rem)",
    fontWeight: 900,
    color: "#fff",
    lineHeight: 1.1,
    margin: "0 0 16px",
    fontFamily: "'Fira Code', monospace",
  },
  heroNameAccent: { color: "#00ffc8", textShadow: "0 0 30px rgba(0,255,200,0.4)" },
  heroTyped: {
    fontSize: "1.2rem",
    marginBottom: "20px",
    minHeight: "2rem",
    color: "#8899aa",
  },
  blink: {
    animation: "blink 1s infinite",
    color: "#00ffc8",
  },
  heroSub: {
    color: "#6a7f90",
    fontSize: "0.9rem",
    lineHeight: 1.8,
    marginBottom: "32px",
  },
  heroVisual: {
    flex: "1 1 280px",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "340px",
  },
  orb: {
    width: "220px",
    height: "220px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, rgba(0,255,200,0.1), rgba(97,218,251,0.05))",
    border: "1px solid rgba(0,255,200,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    animation: "rotate3d 8s linear infinite",
    boxShadow: "0 0 60px rgba(0,255,200,0.1), inset 0 0 40px rgba(0,255,200,0.05)",
  },
  orbInner: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    background: "rgba(0,255,200,0.05)",
    border: "1px solid rgba(0,255,200,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    animation: "rotate3d 4s linear infinite reverse",
  },
  floatingBadge1: { position: "absolute", top: "5%", right: "10%", ...badgeStyle("#68a063") },
  floatingBadge2: { position: "absolute", top: "30%", right: "-5%", ...badgeStyle("#61dafb") },
  floatingBadge3: { position: "absolute", bottom: "25%", right: "5%", ...badgeStyle("#00758f") },
  floatingBadge4: { position: "absolute", bottom: "5%", right: "20%", ...badgeStyle("#ffffff") },
  ctaPrimary: {
    padding: "12px 28px",
    background: "linear-gradient(135deg, #00ffc8, #00b894)",
    color: "#050d15",
    border: "none",
    borderRadius: "4px",
    fontWeight: 800,
    fontSize: "0.85rem",
    cursor: "none",
    letterSpacing: "0.08em",
    textDecoration: "none",
    display: "inline-block",
    transition: "transform 0.2s, box-shadow 0.2s",
    fontFamily: "inherit",
  },
  ctaSecondary: {
    padding: "12px 28px",
    background: "transparent",
    color: "#00ffc8",
    border: "1.5px solid rgba(0,255,200,0.4)",
    borderRadius: "4px",
    fontWeight: 700,
    fontSize: "0.85rem",
    cursor: "none",
    letterSpacing: "0.08em",
    textDecoration: "none",
    display: "inline-block",
    transition: "border-color 0.2s, background 0.2s",
    fontFamily: "inherit",
  },
  section: {
    position: "relative",
    zIndex: 1,
    padding: "100px 5%",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "60px",
  },
  sectionNum: {
    color: "#00ffc8",
    fontSize: "0.9rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
  },
  sectionTitle: {
    color: "#fff",
    fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
    fontWeight: 800,
    margin: 0,
  },
  sectionLine: {
    flex: 1,
    height: "1px",
    background: "linear-gradient(90deg, rgba(0,255,200,0.3), transparent)",
  },
  aboutGrid: {
    display: "flex",
    gap: "60px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  aboutAvatar: {
    display: "flex",
    justifyContent: "center",
    flex: "0 0 auto",
  },
  avatarBox: {
    position: "relative",
    width: "180px",
    height: "180px",
    borderRadius: "20px",
    background: "rgba(0,255,200,0.05)",
    border: "1px solid rgba(0,255,200,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 20px 60px rgba(0,255,200,0.08)",
  },
  avatarGlow: {
    position: "absolute",
    inset: "-2px",
    borderRadius: "22px",
    background: "linear-gradient(135deg, rgba(0,255,200,0.3), transparent, rgba(97,218,251,0.2))",
    zIndex: -1,
    animation: "borderGlow 3s ease infinite alternate",
  },
  aboutText: { flex: "1 1 300px" },
  aboutPara: {
    color: "#8899aa",
    lineHeight: 1.8,
    marginBottom: "20px",
    fontSize: "0.92rem",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginTop: "24px",
  },
  infoItem: {
    padding: "12px 16px",
    background: "rgba(0,255,200,0.04)",
    borderRadius: "8px",
    border: "1px solid rgba(0,255,200,0.08)",
  },
  infoLabel: {
    display: "block",
    fontSize: "0.68rem",
    color: "#00ffc8",
    letterSpacing: "0.15em",
    marginBottom: "4px",
  },
  infoVal: {
    display: "block",
    fontSize: "0.82rem",
    color: "#c8d8e8",
    fontWeight: 600,
  },
  skillsGrid: { maxWidth: "700px", margin: "0 auto" },
  skillTrack: {
    height: "6px",
    background: "rgba(255,255,255,0.06)",
    borderRadius: "3px",
    overflow: "hidden",
  },
  skillFill: {
    height: "100%",
    borderRadius: "3px",
  },
  projectsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "24px",
  },
  card: {
    background: "rgba(10,22,35,0.8)",
    border: "1px solid #1a2a3a",
    borderRadius: "16px",
    padding: "28px",
    perspective: "800px",
    transformStyle: "preserve-3d",
    cursor: "none",
  },
  techBadge: {
    padding: "3px 10px",
    background: "rgba(97,218,251,0.08)",
    border: "1px solid rgba(97,218,251,0.2)",
    borderRadius: "20px",
    fontSize: "0.68rem",
    color: "#61dafb",
    letterSpacing: "0.05em",
  },
  cardLink: {
    color: "#00ffc8",
    textDecoration: "none",
    fontSize: "0.82rem",
    fontWeight: 700,
    letterSpacing: "0.05em",
    display: "inline-block",
    borderBottom: "1px solid rgba(0,255,200,0.3)",
    paddingBottom: "2px",
  },
  contactBox: {
    position: "relative",
    textAlign: "center",
    padding: "80px 40px",
    background: "rgba(0,255,200,0.02)",
    border: "1px solid rgba(0,255,200,0.1)",
    borderRadius: "24px",
    overflow: "hidden",
  },
  contactGlow: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "400px",
    height: "200px",
    background: "radial-gradient(ellipse, rgba(0,255,200,0.06) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  footer: {
    position: "relative",
    zIndex: 1,
    textAlign: "center",
    padding: "32px",
    borderTop: "1px solid rgba(255,255,255,0.04)",
  },
};

function badgeStyle(color) {
  return {
    padding: "6px 14px",
    background: `rgba(${hexToRgb(color)},0.1)`,
    border: `1px solid rgba(${hexToRgb(color)},0.3)`,
    borderRadius: "20px",
    fontSize: "0.72rem",
    color,
    fontWeight: 700,
    letterSpacing: "0.08em",
    backdropFilter: "blur(8px)",
  };
}

function hexToRgb(hex) {
  if (hex === "#ffffff") return "255,255,255";
  if (hex === "#68a063") return "104,160,99";
  if (hex === "#61dafb") return "97,218,251";
  if (hex === "#00758f") return "0,117,143";
  return "200,200,200";
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { overflow-x: hidden; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #050d15; }
  ::-webkit-scrollbar-thumb { background: #00ffc8; border-radius: 2px; }
  
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  @keyframes rotate3d {
    from { transform: rotateY(0deg) rotateX(10deg); }
    to { transform: rotateY(360deg) rotateX(10deg); }
  }
  @keyframes borderGlow {
    from { opacity: 0.5; }
    to { opacity: 1; }
  }
  @keyframes float1 {
    0%, 100% { transform: translateY(0px) rotate(-3deg); }
    50% { transform: translateY(-12px) rotate(3deg); }
  }
  @keyframes float2 {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-18px); }
  }
  .float1 { animation: float1 4s ease-in-out infinite; }
  .float2 { animation: float2 5s ease-in-out infinite 0.5s; }
  .float3 { animation: float1 3.5s ease-in-out infinite 1s; }
  .float4 { animation: float2 4.5s ease-in-out infinite 0.2s; }

  @media (max-width: 768px) {
    nav { padding: 0 4%; }
    .navLinks { display: none; }
    button[style*="display: none"] { display: none; }
  }
`;
