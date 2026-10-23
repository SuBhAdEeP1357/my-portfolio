import Preloader from "./components/Preloader/Preloader";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import About from "./components/About/About";
import Skills from "./components/Skills/Skills";
import Projects from "./components/Projects/Projects";
import Experience from "./components/Experience/Experience";
import Certifications from "./components/Certifications/Certifications";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";

const DesktopApp = () => {
  return (
    <>
      {/* =========================================================
          GLOBAL DESKTOP UI
      ========================================================== */}

      <Preloader />

      <Navbar />

      {/* =========================================================
          MAIN CONTENT
          
          All desktop portfolio sections are rendered in a
          predictable document order for navigation, SEO,
          accessibility, and scroll-based animations.
      ========================================================== */}

      <main id="main-content" tabIndex={-1}>
        <Hero />

        <About />

        <Skills />

        <Projects />

        <Experience />

        <Certifications />

        <Contact />
      </main>

      {/* =========================================================
          FOOTER
      ========================================================== */}

      <Footer />
    </>
  );
};

export default DesktopApp;
