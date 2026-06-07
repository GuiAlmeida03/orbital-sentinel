// App.jsx
import { useState } from 'react';
import Header from './components/Header';
import SentinelHub from './components/SentinelHub';
import Footer from './components/Footer';
import './styles/global.css';

export default function App() {
  const [activeSection, setActiveSection] = useState('sentinel');

  function handleNavigate(section) {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header activeSection={activeSection} onNavigate={handleNavigate} />
      <main style={{ flex: 1 }}>
        <SentinelHub />
      </main>
      <Footer />
    </div>
  );
}
