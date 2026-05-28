
import { useMousePosition } from './hooks/useMousePosition';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import ResumePreview from './components/ResumePreview';
import Contact from './components/Contact';
import CustomCursor from './components/CustomCursor';
import ScrollProgress from './components/ScrollProgress';

function App() {

  const mousePosition = useMousePosition();

  return (
    <>
      {/* Global CSS variables for cursor tracking */}
      <style>
        {`
          :root {
            --mouse-x: ${mousePosition.x}px;
            --mouse-y: ${mousePosition.y}px;
            --mouse-normalized-x: ${mousePosition.normalizedX};
            --mouse-normalized-y: ${mousePosition.normalizedY};
          }
        `}
      </style>

      <CustomCursor />
      <ScrollProgress />
      <Navbar />

      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <ResumePreview />
        <Contact />
      </main>
    </>
  );
}

export default App;
