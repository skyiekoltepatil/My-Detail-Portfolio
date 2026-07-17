import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Experience } from './pages/Experience';
import { Hobbies } from './pages/Hobbies';
import { FunGames } from './pages/FunGames';
import { Contact } from './pages/Contact';
import { Quote } from './pages/Quote';
import { ContactSection } from './components/ContactSection';
import { QuoteSection } from './components/QuoteSection';
import { AboutSection } from './components/AboutSection';

import { PhotoGallery } from './components/PhotoGallery';

const FullHomePage = () => (
  <>
    <Home />
    <PhotoGallery />
    <QuoteSection />
    <AboutSection />
    <Experience />
    <ContactSection />
  </>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<FullHomePage />} />
          <Route path="about" element={<About />} />
          <Route path="experience" element={<Experience />} />
          <Route path="hobbies" element={<Hobbies />} />
          <Route path="fun-games" element={<FunGames />} />
          <Route path="contact" element={<Contact />} />
          <Route path="quote" element={<Quote />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}