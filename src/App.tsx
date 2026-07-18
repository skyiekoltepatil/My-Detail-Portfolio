import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useIsMobile } from './hooks/useIsMobile';
import { SpeedInsights } from '@vercel/speed-insights/react';

// Desktop Pages
import { Layout as DesktopLayout } from './components/layout/Layout';
import { Home as HomeDesktop } from './pages/Home';
import { About as AboutDesktop } from './pages/About';
import { Experience as ExperienceDesktop } from './pages/Experience';
import { Hobbies as HobbiesDesktop } from './pages/Hobbies';
import { FunGames as FunGamesDesktop } from './pages/FunGames';
import { Contact as ContactDesktop } from './pages/Contact';
import { Quote as QuoteDesktop } from './pages/Quote';

// Mobile Pages
import { Home as HomeMobile } from './mobile-ui-ux/pages/Home';
import { About as AboutMobile } from './mobile-ui-ux/pages/About';
import { Experience as ExperienceMobile } from './mobile-ui-ux/pages/Experience';
import { Hobbies as HobbiesMobile } from './mobile-ui-ux/pages/Hobbies';
import { FunGames as FunGamesMobile } from './mobile-ui-ux/pages/FunGames';
import { Contact as ContactMobile } from './mobile-ui-ux/pages/Contact';
import { Quote as QuoteMobile } from './mobile-ui-ux/pages/Quote';

// Shared Sections for Full Home Page
import { ContactSection } from './components/sections/ContactSection';
import { QuoteSection } from './components/sections/QuoteSection';
import { AboutSection } from './components/sections/AboutSection';
import { PhotoGallery } from './components/sections/PhotoGallery';

const FullHomePageDesktop = () => (
  <>
    <HomeDesktop />
    <PhotoGallery />
    <QuoteSection />
    <AboutSection />
    <ExperienceDesktop />
    <ContactSection />
  </>
);

const FullHomePageMobile = () => (
  <>
    <HomeMobile />
    <PhotoGallery />
    <QuoteSection />
    <AboutSection />
    <ExperienceMobile />
    <ContactSection />
  </>
);

export default function App() {
  const isMobile = useIsMobile();

  return (
    <>
      <BrowserRouter>
        {isMobile ? (
          <Routes>
            {/* Reusing DesktopLayout for now since we didn't clone the Layout component */}
            <Route path="/" element={<DesktopLayout />}>
              <Route index element={<FullHomePageMobile />} />
              <Route path="about" element={<AboutMobile />} />
              <Route path="experience" element={<ExperienceMobile />} />
              <Route path="hobbies" element={<HobbiesMobile />} />
              <Route path="fun-games" element={<FunGamesMobile />} />
              <Route path="contact" element={<ContactMobile />} />
              <Route path="quote" element={<QuoteMobile />} />
            </Route>
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<DesktopLayout />}>
              <Route index element={<FullHomePageDesktop />} />
              <Route path="about" element={<AboutDesktop />} />
              <Route path="experience" element={<ExperienceDesktop />} />
              <Route path="hobbies" element={<HobbiesDesktop />} />
              <Route path="fun-games" element={<FunGamesDesktop />} />
              <Route path="contact" element={<ContactDesktop />} />
              <Route path="quote" element={<QuoteDesktop />} />
            </Route>
          </Routes>
        )}
      </BrowserRouter>
      <SpeedInsights />
    </>
  );
}