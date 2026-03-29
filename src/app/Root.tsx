import { Outlet } from 'react-router';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

interface RootProps {
  lang: string;
  setLang?: (l: string) => void;
}

// Root layout: Navbar + page content + Footer
// setLang is passed from App via router re-creation
export function Root({ lang, setLang }: RootProps & { setLang?: (l: string) => void }) {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar lang={lang} setLang={setLang || (() => {})} />
      <main style={{ flex: 1, paddingTop: '80px' }}>
        <Outlet />
      </main>
      <Footer lang={lang} />
    </div>
  );
}
