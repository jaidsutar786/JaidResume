import { useEffect, useState } from 'react'
import { Briefcase, Code, Download, ExternalLink, Eye, Folder, GraduationCap, House, Mail, MapPin, Menu, Moon, Phone, Sun, X } from 'lucide-react'
import profilePhoto from './assets/Jaidphoto.jpg'
import germanCertificate from './assets/german.pdf'
import resumePdf from './assets/JAIDSUTAR.pdf'

const composeEmailUrl = 'https://mail.google.com/mail/?view=cm&fs=1&to=sutarjaid970%40gmail.com&su=Project%20Inquiry'

const routeTargets = {
  '/home': 'top',
  '/experience': 'experience',
  '/projects': 'projects',
  '/skills': 'skills',
  '/education': 'education',
  '/contact': 'contact',
}

const navigationItems = [
  { path: '/home', label: 'Home', Icon: House },
  { path: '/experience', label: 'Experience', Icon: Briefcase },
  { path: '/projects', label: 'Projects', Icon: Folder },
  { path: '/skills', label: 'Skills', Icon: Code },
  { path: '/education', label: 'Education', Icon: GraduationCap },
  { path: '/contact', label: 'Contact', Icon: Mail },
]

function scrollToRoute(path) {
  if (path === '/home') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  const targetId = routeTargets[path] ?? 'top'
  document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const experience = [
  { period: 'Jan 2025 — Present', role: 'Full-Stack Developer', company: 'Teople Technologies', text: 'Building responsive web applications and frontend experiences for solar plant monitoring and digital kiosk systems.' },
]

const projects = [
  {
    title: 'Solar Plant Monitoring System',
    points: [
      'Developed responsive React.js interfaces for monitoring solar plant and generation data.',
      'Built reusable components and integrated third-party inverter APIs for real-time and historical generation data.',
      'Created interactive ECharts dashboards with REST API integration and dynamic data rendering.',
    ],
    technologies: 'React.js · JavaScript · REST APIs · ECharts · Inverter API Integration',
  },
  {
    title: 'Digital Kiosk System',
    points: [
      'Developed responsive React.js interfaces, reusable components, and configurable kiosk templates.',
      'Implemented dynamic content rendering for different kiosk display requirements.',
      'Improved usability through frontend performance optimization.',
    ],
    technologies: 'React.js · JavaScript · Responsive UI · Component-Based Development',
  },
]

const technicalSkills = [
  { label: 'Frontend Development', value: 'React.js, React Router, JavaScript (ES6+), HTML5, CSS3, Material UI, Ant Design, GSAP, responsive UI, component-based architecture' },
  { label: 'Backend Development', value: 'Python, Django, Django REST Framework, RESTful APIs, API development, backend services' },
  { label: 'API & Integration', value: 'REST APIs, third-party API integration, Axios, Nexar API, inverter API integration' },
  { label: 'Authentication & Security', value: 'Django authentication, JWT authentication, role-based access control (RBAC)' },
  { label: 'Database', value: 'MySQL, MariaDB, SQLite' },
  { label: 'Visualization', value: 'ECharts, interactive dashboards, data visualization' },
  { label: 'Tools & Cloud', value: 'Git, GitHub, Bitbucket, Postman, VS Code, Maven, AWS S3' },
]

function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('resume-theme') === 'dark')
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeRoute, setActiveRoute] = useState(() => routeTargets[window.location.pathname] ? window.location.pathname : '/home')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('resume-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  useEffect(() => {
    const currentRoute = () => {
      let path = window.location.pathname
      if (!routeTargets[path]) {
        path = '/home'
        window.history.replaceState({}, '', path)
      }
      setActiveRoute(path)
      return path
    }
    const normalizePath = () => {
      scrollToRoute(currentRoute())
    }
    const handlePopState = () => scrollToRoute(currentRoute())

    const navigationType = performance.getEntriesByType('navigation')[0]?.type
    if (navigationType === 'reload') {
      window.history.replaceState({}, '', '/home')
      setActiveRoute('/home')
      window.scrollTo({ top: 0, behavior: 'instant' })
    } else {
      normalizePath()
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  function navigate(event, path) {
    event.preventDefault()
    window.history.pushState({}, '', path)
    setActiveRoute(path)
    scrollToRoute(path)
    setMenuOpen(false)
  }

  return (
    <div className="resume-app">
      <header className="resume-header">
        <a href="/home" onClick={(event) => navigate(event, '/home')} className="header-brand"><span>JS</span><strong>Jaid Sutar</strong></a>
        <Navigation className={menuOpen ? 'header-nav desktop-nav is-open' : 'header-nav desktop-nav'} activeRoute={activeRoute} navigate={navigate} />
        <div className="header-actions"><button className="round-button" type="button" aria-label="Toggle theme" onClick={() => setDarkMode(!darkMode)}>{darkMode ? <Sun size={16} /> : <Moon size={16} />}</button><a className="download-button" href={resumePdf} download="JAIDSUTAR.pdf"><Download size={15} /> <span>Download CV</span></a><button className="round-button menu-button" type="button" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={17} /> : <Menu size={17} />}</button></div>
      </header>
      <Navigation className="header-nav mobile-nav" activeRoute={activeRoute} navigate={navigate} />

      <main id="top" className="resume-layout">
        <aside className="resume-sidebar">
          <div className="photo-box"><img src={profilePhoto} alt="Jaid Sutar" /></div>
          <div className="sidebar-block"><p className="sidebar-label">Contact</p><a href={composeEmailUrl} target="_blank" rel="noreferrer"><Mail size={14} /> sutarjaid970@gmail.com</a><a href="tel:+918956063127"><Phone size={14} /> 8956063127</a><span><MapPin size={14} /> Pune, India</span><a href="https://www.linkedin.com/in/jaid-sutar-6b5601262/" target="_blank" rel="noreferrer"><ExternalLink size={14} /> LinkedIn profile</a></div>
          <div className="sidebar-block"><p className="sidebar-label">Core stack</p><div className="tool-list"><span>React.js</span><span>Python</span><span>Django</span><span>JavaScript</span><span>MySQL</span><span>REST APIs</span></div></div>
          <div className="sidebar-block languages"><p className="sidebar-label">Languages</p><span>English</span><span>Hindi</span><span>German</span><div className="certificate-links"><a href={germanCertificate} target="_blank" rel="noreferrer"><Eye size={13} /> View certificate</a><a href={germanCertificate} download><Download size={13} /> Download</a></div></div>
        </aside>

        <section className="resume-content">
          <section className="resume-intro" id="profile"><p className="eyebrow"><i /> Full-Stack Developer | React.js | Python | Django</p><h1>Jaid <em>Sutar</em></h1><p className="intro-summary">Full-Stack Developer with professional experience building responsive web applications using React.js, JavaScript, Python, and Django. Experienced in reusable components, interactive dashboards, RESTful APIs, third-party integrations, authentication, role-based access control, and database-driven applications.</p></section>
          <section className="resume-section" id="experience"><SectionHeading number="01" title="Professional Experience" /><div className="experience-list">{experience.map((item) => <article className="experience-item" key={item.role}><time>{item.period}</time><div><h2>{item.role}</h2><p className="company">{item.company}</p><p>{item.text}</p></div></article>)}</div></section>
          <section className="resume-section" id="projects"><SectionHeading number="02" title="Projects" /><div className="project-list">{projects.map((project) => <Project key={project.title} {...project} />)}</div></section>
          <section className="resume-section" id="skills"><SectionHeading number="03" title="Technical Skills" /><div className="skills-list">{technicalSkills.map((skill) => <div className="technical-skill" key={skill.label}><h3>{skill.label}</h3><p>{skill.value}</p></div>)}</div></section>
          <section className="resume-section" id="education"><SectionHeading number="04" title="Education & Certifications" /><div className="education-grid"><div><h2>B.Tech — Computer Science and Engineering (CSE)</h2><p className="company">Dr. Babasaheb Ambedkar Technological University</p><p>2021 — 2025 · CGPA: 7.8 / 10</p></div><div><h2>German Language Course (A1)</h2><p className="company">Shri Mahalaxmi Academy, Kolhapur</p><p>40 hours · Certificate of Completion</p><div className="certificate-links"><a href={germanCertificate} target="_blank" rel="noreferrer"><Eye size={13} /> View certificate</a><a href={germanCertificate} download><Download size={13} /> Download certificate</a></div></div></div></section>
          <section className="resume-contact" id="contact">
            <p className="eyebrow"><i /> Let&apos;s connect</p>
            <h2>Have a project in mind?</h2>
            <div className="form-actions">
              <a className="submit-button" href={composeEmailUrl} target="_blank" rel="noreferrer">
                <Mail size={15} aria-hidden="true" /> Email me
              </a>
              <a className="mail-link" href={composeEmailUrl} target="_blank" rel="noreferrer">sutarjaid970@gmail.com</a>
            </div>
          </section>
        </section>
      </main>
      <footer className="resume-footer"><span>© 2026 Jaid Sutar</span><span>Full-Stack Developer · Pune</span></footer>
    </div>
  )
}

function SectionHeading({ number, title }) { return <div className="section-heading"><span>{number}</span><h2>{title}</h2></div> }
function Project({ title, points, technologies }) { return <article className="project-detail"><div className="project-detail-heading"><div className="project-mark">{title.slice(0, 1)}</div><h2>{title}</h2></div><ul>{points.map((point) => <li key={point}>{point}</li>)}</ul><p className="project-technologies"><strong>Technologies:</strong> {technologies}</p></article> }
function Navigation({ className, activeRoute, navigate }) { return <nav className={className} aria-label="Resume sections">{navigationItems.map(({ path, label, Icon }) => <a key={path} href={path} aria-current={activeRoute === path ? 'page' : undefined} className={activeRoute === path ? 'is-active' : undefined} onClick={(event) => navigate(event, path)}><Icon size={18} aria-hidden="true" /><span>{label}</span></a>)}</nav> }

export default App
