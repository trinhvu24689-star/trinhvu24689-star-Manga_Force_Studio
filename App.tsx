import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Screenwriter from './components/Screenwriter';
import CharacterLab from './components/CharacterLab';
import Storyboard from './components/Storyboard';
import ComicViewer from './components/ComicViewer';
import Shop from './components/Shop';
import AdminGrant from './components/AdminGrant';
import { AppMode, ComicProject, Language, UserProfile, SubscriptionPlan } from './types';
import { PLANS } from './data';
import { translations } from './translations';
import { saveUserToDB, loadUserFromDB } from './services/neon';

const INITIAL_PROJECT: ComicProject = {
  title: "",
  genre: "",
  premise: "",
  style: "",
  characters: [],
  panels: []
};

// Initial GUEST User
const INITIAL_USER: UserProfile = {
  plan: PLANS[0], // GUEST
  diamonds: 30,
  rubies: 0,
};

type AppView = 'dashboard' | 'workspace' | 'shop' | 'adminGrant';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('dashboard');
  const [mode, setMode] = useState<AppMode>(AppMode.Screenwriter);
  const [lang, setLang] = useState<Language>('vi'); 
  const [project, setProject] = useState<ComicProject>(INITIAL_PROJECT);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load user data on startup
  useEffect(() => {
    const init = async () => {
      const savedUser = await loadUserFromDB();
      if (savedUser) {
        setUser(savedUser);
      }
      setIsLoaded(true);
    };
    init();
  }, []);

  // Save user data whenever it changes (auto-save to DB)
  useEffect(() => {
    if (isLoaded) {
      saveUserToDB(user);
    }
  }, [user, isLoaded]);

  const updateProject = (updates: Partial<ComicProject>) => {
    setProject(prev => ({ ...prev, ...updates }));
  };

  const handleStartManual = () => {
    setProject(INITIAL_PROJECT);
    setView('workspace');
    setMode(AppMode.Screenwriter);
  };

  const handleStartAuto = (autoProject: ComicProject) => {
    setProject(autoProject);
    setView('workspace');
    setMode(AppMode.Screenwriter); 
  };

  const handleGoHome = () => {
    setView('dashboard');
  };

  const handleSetMode = (newMode: AppMode) => {
    if (newMode === AppMode.Shop) {
        setView('shop');
    } else if (newMode === AppMode.AdminGrant) {
        setView('adminGrant');
    } else {
        if (view === 'shop' || view === 'adminGrant') setView('workspace');
        setMode(newMode);
    }
  };

  const handleConsumeCurrency = (cost: number): boolean => {
    if (user.diamonds === Infinity) return true;

    if (user.diamonds >= cost) {
        setUser(prev => ({ ...prev, diamonds: prev.diamonds - cost }));
        return true;
    } else {
        alert(translations[lang].common.insufficientFunds);
        // Optional: Redirect to shop
        // setView('shop');
        return false;
    }
  };

  const handleUpgradePlan = (newPlan: SubscriptionPlan) => {
    let newDiamonds = user.diamonds;
    let newRubies = user.rubies;

    // Logic for upgrading: 
    // If upgrading to a higher plan, we add the resources of that plan.
    // If user already has Unlimited, we keep it.
    
    // Grant diamonds
    if (newPlan.diamonds === 'Unlimited') {
        newDiamonds = Infinity;
    } else if (typeof newPlan.diamonds === 'number') {
         // If previous was finite, add new. If previous infinite, keep infinite.
         if (newDiamonds !== Infinity) {
             newDiamonds = newDiamonds + newPlan.diamonds;
         }
    }

    // Grant rubies
    if (newPlan.rubies === 'Unlimited') {
        newRubies = Infinity;
    } else if (typeof newPlan.rubies === 'number') {
         if (newRubies !== Infinity) {
             newRubies = newRubies + newPlan.rubies;
         }
    }

    setUser({
        plan: newPlan,
        diamonds: newDiamonds,
        rubies: newRubies,
    });
  };

  // Content Renderer
  const renderContent = () => {
    if (view === 'shop') {
        return <Shop user={user} onUpgrade={handleUpgradePlan} lang={lang} />;
    }

    if (view === 'adminGrant') {
        return <AdminGrant user={user} onUpgrade={handleUpgradePlan} lang={lang} />;
    }

    if (view === 'dashboard') {
        return (
          <Dashboard 
            lang={lang} 
            setLang={setLang} 
            onStartManual={handleStartManual} 
            onStartAuto={handleStartAuto} 
            consumeCurrency={handleConsumeCurrency}
          />
        );
    }

    switch (mode) {
      case AppMode.Screenwriter:
        return <Screenwriter project={project} updateProject={updateProject} lang={lang} consumeCurrency={handleConsumeCurrency} />;
      case AppMode.CharacterDesign:
        return <CharacterLab project={project} updateProject={updateProject} lang={lang} consumeCurrency={handleConsumeCurrency} />;
      case AppMode.Storyboard:
        return <Storyboard project={project} updateProject={updateProject} lang={lang} consumeCurrency={handleConsumeCurrency} />;
      case AppMode.Preview:
        return <ComicViewer project={project} lang={lang} />;
      default:
        return <Screenwriter project={project} updateProject={updateProject} lang={lang} consumeCurrency={handleConsumeCurrency} />;
    }
  };

  if (!isLoaded) {
      return (
        <div className="h-screen w-screen bg-black flex items-center justify-center text-white">
            Loading Universe...
        </div>
      )
  }

  return (
    <Layout 
      currentMode={view === 'shop' ? AppMode.Shop : (view === 'adminGrant' ? AppMode.AdminGrant : mode)} 
      setMode={handleSetMode} 
      lang={lang} 
      setLang={setLang} 
      goHome={handleGoHome}
      user={user}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;