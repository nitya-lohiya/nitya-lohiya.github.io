import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Nav } from './components/Nav';
import { About, Beyond, Contact, Experience, Projects, Resume, Skills } from './components/Sections';
import { useReveal } from './hooks/useReveal';

export default function App() {
  useReveal();
  return (
    <>
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
        <Beyond />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
