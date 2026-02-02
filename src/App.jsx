import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import avatar from "./assets/avatar.jpg";

/**
 * Simple-but-impressive React portfolio.
 * No UI frameworks, no extra animation/chart libraries.
 *
 * Interactivity:
 * - Accent color picker (moved to the top bar; persisted in localStorage)
 * - Cursor spotlight effect (CSS + JS)
 * - ScrollSpy navigation
 * - Project filter + modal
 * - Copy email/phone + toast
 */

const PROFILE = {
  name: "Ivan Sharh",
  role: "Front-End Developer",
  tagline:
    "Web Architect | Product Developer",
  location: "Ukraine",
  email: "ivansersharg@gmail.com",
  links: {
    artstation: "https://www.artstation.com/ivsh",
    telegram: "https://t.me/ivansh123",
    github: "https://github.com/IvanSh-dev",
  },
};

const ACCENTS = [
  { name: "Neon", value: "#7C3AED" },
  { name: "Ocean", value: "#06B6D4" },
  { name: "Lime", value: "#84CC16" },
  { name: "Sunset", value: "#FB7185" },
  { name: "Gold", value: "#F59E0B" },
  { name: "Blue", value: "#3B82F6" },
];

const SKILLS = [
  { name: "HTML", level: 60},
  { name: "CSS", level: 60},
  { name: "JavaScript", level: 55},
  { name: "Python", level: 50},
  { name: "C++", level: 40},
  { name: "Blender 3D ", level: 65},
];

const PROJECTS = [
  {
    title: "Pc Pricer",
    short: "React + Vite",
    description:
      "PcPricer is a high-performance web application designed to simplify the PC building",
    tags: ["HTML", "CSS", "JS"],
    links: {
      live: "https://pc-pricer.vercel.app/",
      code: "https://github.com/IvanSh-dev/pc-pricer",
    },
  },
  {
    title: "Kinematic Analysis",
    short: "Maths + Physics",
    description:
      "A desktop application built with Python and Tkinter for calculating and visualizing the velocity vector diagrams of a slider-crank mechanism.",
    tags: ["Python", "Tkinter"],
    links: {
      code: "https://github.com/IvanSh-dev/kinematic-analysis-python",
    },
  },
  {
    title: "3D Design projects",
    short: "Low poly + Textures",
    description:
      "Bringing concepts to life through 3D visualization and lighting.",
    tags: ["Blender", "Cycles", "Animation"],
    links: {
      artstation: "https://www.artstation.com/ivsh",
    },
  },
];

const EXPERIENCE = [
  {
    period: "2023 — now",
    title: "HTML | CSS | JS",
    detail:
      "Projects with responsive layout, tasteful animation, and clean component structure.",
  },
  {
    period: "2024 — now",
    title: "C++",
    detail:
      "Solved algorithmic problems on the e-olymp platform, focusing on efficiency and logical optimization.",
  },
  {
    period: "2022 — 2024",
    title: "Python",
    detail:
      "Developed a strong foundation in algorithmic thinking and data structures using Python.",
  },
  {
    period: "2023 — now",
    title: "Blender 3D",
    detail:
      "Developed high-quality 3D assets and environments with a focus on visual impact.",
  },
];

function cn(...xs) {
  return xs.filter(Boolean).join(" ");
}

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0] ?? "home");

  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);

    const obs = new IntersectionObserver(
      (entries) => {
        const v = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));
        if (v[0]?.target?.id) setActive(v[0].target.id);
      },
      { threshold: [0.15, 0.3, 0.5], rootMargin: "-10% 0px -70% 0px" }
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [ids]);

  return active;
}

function Toast({ text, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 1800);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="toast" role="status" aria-live="polite">
      <div className="toast__dot" />
      <div className="toast__text">{text}</div>
      <button className="toast__x" onClick={onClose} aria-label="Close">
        ✕
      </button>
    </div>
  );
}

function Modal({ project, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal" onMouseDown={onClose}>
      <div className="modal__card" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal__top">
          <div>
            <div className="modal__title">{project.title}</div>
            <div className="modal__sub">{project.short}</div>
          </div>
          <button className="iconbtn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="modal__body">
          <p>{project.description}</p>
          <div className="chips">
            {project.tags.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="modal__actions">
          {project.links.artstation ? (
            <a className="btn" href={project.links.artstation} target="_blank" rel="noreferrer">
              ArtStation ↗
            </a>
          ) : (
            <>
              {project.links.code ? (
                <a className="btn btn--ghost" href={project.links.code} target="_blank" rel="noreferrer">
                  Code ↗
                </a>
              ) : null}

              {project.links.live ? (
                <a className="btn" href={project.links.live} target="_blank" rel="noreferrer">
                  Live →
                </a>
              ) : null}
            </>
          )}
        </div>

      </div>
    </div>
  );
}

export default function App() {
  const sections = ["home", "about", "skills", "projects", "experience", "contact"];
  const active = useScrollSpy(sections);

  const [accent, setAccent] = useState(() => {
    return window.localStorage.getItem("accent") || ACCENTS[0].value;
  });

  const [filter, setFilter] = useState("All");
  const [toast, setToast] = useState(null);
  const [openProject, setOpenProject] = useState(null);

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", accent);
    window.localStorage.setItem("accent", accent);
  }, [accent]);

  useEffect(() => {
    const onMove = (e) => {
      document.documentElement.style.setProperty("--mx", `${e.clientX}px`);
      document.documentElement.style.setProperty("--my", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const allTags = useMemo(() => {
    const s = new Set();
    PROJECTS.forEach((p) => p.tags.forEach((t) => s.add(t)));
    return ["All", ...Array.from(s)];
  }, []);

  const visibleProjects = useMemo(() => {
    if (filter === "All") return PROJECTS;
    return PROJECTS.filter((p) => p.tags.includes(filter));
  }, [filter]);

  async function copy(text, label) {
    try {
      await navigator.clipboard.writeText(text);
      setToast(`${label} copied`);
    } catch {
      setToast("Copy failed");
    }
  }

  return (
    <div className="page">
      <div className="bg" />

      <header className="top">
        <button className="brand" onClick={() => scrollToId("home")}> 
          <img className="brand__logo" src={avatar} alt="Avatar" />
          <span className="brand__text">
            <span className="brand__name">{PROFILE.name}</span>
            <span className="brand__role">{PROFILE.role}</span>
          </span>
        </button>

        <nav className="nav">
          {sections.map((id) => (
            <button
              key={id}
              onClick={() => scrollToId(id)}
              className={cn("nav__item", active === id && "nav__item--active")}
            >
              {id === "home" ? "Home" : id[0].toUpperCase() + id.slice(1)}
            </button>
          ))}
        </nav>

        <div className="topRight">
          <div className="accentBar" aria-label="Accent picker">
            <span className="accentLabel">Accent</span>
            {ACCENTS.map((c) => (
              <button
                key={c.value}
                className={cn("accentDot", accent === c.value && "accentDot--on")}
                style={{ background: c.value }}
                onClick={() => setAccent(c.value)}
                aria-label={`Set accent ${c.name}`}
                title={c.name}
              />
            ))}
          </div>

        </div>
      </header>

      <main className="wrap">
        <section id="home" className="section hero">
          <div className="hero__left">
            <div className="pills">
              <span className="pill">● Open to work</span>
            </div>

            <h1 className="h1">{PROFILE.tagline}</h1>
            <p className="lead">
              Front-end Developer focused on building clean, interactive, and performant web applications.
            </p>

            <div className="cta">
              <button className="btn" onClick={() => scrollToId("projects")}>
                Projects →
              </button>
              <button className="btn btn--ghost" onClick={() => scrollToId("contact")}>
                Contact
              </button>

            </div>


          </div>

          <div className="hero__right">
            <div className="showcase">
              <div className="showcase__card">
                <div className="showcase__title">Core Tech Stack</div>
                <div className="showcase__sub">Primary tools for software development and 3D visualization</div>

                <div className="showcase__grid">
                  <div className="showcase__tile">
                    <div className="showcase__k">Systems</div>
                    <div className="showcase__v">C++ | Python</div>
                  </div>
                  <div className="showcase__tile">
                    <div className="showcase__k">Web</div>
                    <div className="showcase__v">React | Vite</div>
                  </div>
                  <div className="showcase__tile">
                    <div className="showcase__k">3D</div>
                    <div className="showcase__v">Blender | Cycles</div>
                  </div>
                </div>

                <div className="showcase__note">
                  ⚡Building fast and accessible interfaces with a focus on performance
                </div>
              </div>
            </div>

            <div className="blob" aria-hidden />
          </div>
        </section>

        <section id="about" className="section">
          <div className="head">
            <div className="kicker">About</div>
            <h2 className="h2">About me</h2>
            <p className="muted">
              I like interfaces that feel alive. My journey started with 3D modeling in Blender, 
              which taught me the importance of visual aesthetics and detail. 
              Now, I apply those principles to Front-end development, 
              building polished web apps with React and Framer Motion.
            </p>
          </div>

          <div className="grid2">
            <div className="panel">
              <div className="panel__title">How I build projects</div>
              <ul className="list">
                <li>● Start with structure (content + sections)</li>
                <li>● Then design (grid, typography, color)</li>
                <li>● Then interactivity (states, animation)</li>
                <li>● Finish with responsiveness + optimization</li>
              </ul>
            </div>
            <div className="panel">
              <div className="panel__title">What I care about</div>
              <div className="chips">
                {[
                  "Semantics",
                  "Responsive",
                  "Accessibility",
                  "Animation",
                  "Clean JS",
                  "Structure",
                ].map((t) => (
                  <span className="chip" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="section">
          <div className="head">
            <div className="kicker">Skills</div>
            <h2 className="h2">Skills</h2>
          </div>

          <div className="skills">
            {SKILLS.map((s) => (
              <button key={s.name} className="skill">
                <div className="skill__top">
                  <span className="skill__name">{s.name}</span>
                  <span className="skill__lvl">{s.level}%</span>
                </div>
                <div className="bar">
                  <div className="bar__fill" style={{ width: `${s.level}%` }} />
                </div>
              </button>
            ))}
          </div>
        </section>

        <section id="projects" className="section">
          <div className="head head--row">
            <div>
              <div className="kicker">Projects</div>
              <h2 className="h2">Projects</h2>
            </div>

            <div className="filters">
              {allTags.map((t) => (
                <button
                  key={t}
                  className={cn("tag", filter === t && "tag--on")}
                  onClick={() => setFilter(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="cards">
            {visibleProjects.map((p) => (
              <button key={p.title} className="proj" onClick={() => setOpenProject(p)}>
                <div className="proj__top">
                  <div className="proj__title">{p.title}</div>
                  <div className="proj__short">{p.short}</div>
                </div>
                <div className="chips">
                  {p.tags.map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="proj__hint">Click to open →</div>
              </button>
            ))}
          </div>
        </section>

        <section id="experience" className="section">
          <div className="head">
            <div className="kicker">Experience</div>
            <h2 className="h2">Experience</h2>
          </div>

          <div className="timeline">
            {EXPERIENCE.map((e) => (
              <div key={e.period} className="step">
                <div className="step__dot" />
                <div className="step__body">
                  <div className="step__top">
                    <span className="step__title">{e.title}</span>
                    <span className="step__period">{e.period}</span>
                  </div>
                  <div className="step__text">{e.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="section">
          <div className="head">
            <div className="kicker">Contact</div>
            <h2 className="h2">Contact</h2>
          </div>

          <div className="grid2">
            <div className="panel">
              <div className="panel__title">Contacts</div>
              <div className="contactRow">
                <span className="contactRow__k">Email</span>
                <span className="contactRow__v">{PROFILE.email}</span>
                <button
                  className="iconbtn"
                  onClick={() => copy(PROFILE.email, "Email")}
                  aria-label="Copy email"
                >
                  ⧉
                </button>
              </div>
              <div className="rowBtns">
                <a className="btn btn--ghost" href={PROFILE.links.artstation} target="_blank" rel="noreferrer">
                  ArtStation ↗
                </a>

                <a className="btn btn--ghost" href={PROFILE.links.telegram} target="_blank" rel="noreferrer">
                  Telegram ↗
                </a>

                <a className="btn btn--ghost" href={PROFILE.links.github} target="_blank" rel="noreferrer">
                  GitHub ↗
                </a>

              </div>
            </div>

            <form
              className="panel"
              onSubmit={(e) => {
                e.preventDefault();
                setToast("Message sent");
              }}
            >
              <div className="panel__title">Form</div>
              <label className="field">
                <span>Name</span>
                <input placeholder="Your name" required />
              </label>
              <label className="field">
                <span>Email</span>
                <input placeholder="name@email.com" type="email" required />
              </label>
              <label className="field">
                <span>Message</span>
                <textarea placeholder="Write a message..." rows={5} required />
              </label>
              <button className="btn" type="submit">
                Send →
              </button>
            </form>
          </div>

          <footer className="footer">
            © {new Date().getFullYear()} {PROFILE.name}.
          </footer>
        </section>
      </main>

      <div className="mobileNav">
        {sections.map((id) => (
          <button
            key={id}
            onClick={() => scrollToId(id)}
            className={cn("mobileNav__item", active === id && "mobileNav__item--active")}
          >
            {id === "home" ? "Home" : id.slice(0, 1).toUpperCase()}
          </button>
        ))}
      </div>

      {toast ? <Toast text={toast} onClose={() => setToast(null)} /> : null}
      {openProject ? <Modal project={openProject} onClose={() => setOpenProject(null)} /> : null}
    </div>
  );
}