import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Nav } from './components/Nav';
import { About, Contact, Experience, Projects, Resume, Skills } from './components/Sections';
import { LensProvider } from './features/skill-lens/LensContext';
import { LensPill } from './features/skill-lens/LensPill';
import { useReveal } from './hooks/useReveal';

export default function App() {
  useReveal();
  return (
    <LensProvider>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Resume />
        <Contact />
      </main>
      <Footer />
      <LensPill />
    </LensProvider>
  );
}
