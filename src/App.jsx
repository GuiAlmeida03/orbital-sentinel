// App.jsx — Componente raiz da aplicação OrbitalMind AI
// Gerencia a navegação entre seções e renderização condicional de componentes

import { useState } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Monitor from './components/Monitor';
import ChatBot from './components/ChatBot';
import Footer from './components/Footer';
import './styles/global.css';

export default function App() {
  // Estado de navegação — controla qual seção está ativa
  const [activeSection, setActiveSection] = useState('dashboard');

  // Handler de navegação passado como prop para o Header
  function handleNavigate(section) {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Renderiza a seção correta com base no estado (renderização condicional)
  function renderSection() {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'monitor':
        return <Monitor />;
      case 'assistant':
        return <ChatBot />;
      default:
        return <Dashboard />;
    }
  }

  return (
    <div style={styles.app}>
      {/* Header recebe props: activeSection e callback de navegação */}
      <Header activeSection={activeSection} onNavigate={handleNavigate} />

      {/* Conteúdo principal — renderização condicional baseada em activeSection */}
      <main style={styles.main}>
        {renderSection()}
      </main>

      <Footer />
    </div>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  main: {
    flex: 1,
  },
};
