import React, { useState, useEffect, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { SplashScreen } from "./components/layout/SplashScreen";
import { AnimatePresence } from "motion/react";

// Lazy load route pages for faster initial load on slow connections
const Home = React.lazy(() => import("./pages/Home").then(m => ({ default: m.Home })));
const AboutUs = React.lazy(() => import("./pages/AboutUs").then(m => ({ default: m.AboutUs })));
const PartnersPage = React.lazy(() => import("./pages/PartnersPage").then(m => ({ default: m.PartnersPage })));
const Services = React.lazy(() => import("./pages/Services").then(m => ({ default: m.Services })));
const WebService = React.lazy(() => import("./pages/WebService").then(m => ({ default: m.WebService })));
const MobileService = React.lazy(() => import("./pages/MobileService").then(m => ({ default: m.MobileService })));
const AIService = React.lazy(() => import("./pages/AIService").then(m => ({ default: m.AIService })));
const GameService = React.lazy(() => import("./pages/GameService").then(m => ({ default: m.GameService })));
const Portfolio = React.lazy(() => import("./pages/Portfolio").then(m => ({ default: m.Portfolio })));
const Gallery = React.lazy(() => import("./pages/Gallery").then(m => ({ default: m.Gallery })));
const ProcessPage = React.lazy(() => import("./pages/ProcessPage").then(m => ({ default: m.ProcessPage })));
const Blog = React.lazy(() => import("./pages/Blog").then(m => ({ default: m.Blog })));
const Docs = React.lazy(() => import("./pages/Docs").then(m => ({ default: m.Docs })));
const Training = React.lazy(() => import("./pages/Training").then(m => ({ default: m.Training })));
const Events = React.lazy(() => import("./pages/Events").then(m => ({ default: m.Events })));
const Login = React.lazy(() => import("./pages/Login").then(m => ({ default: m.Login })));
const Signup = React.lazy(() => import("./pages/Signup").then(m => ({ default: m.Signup })));
const AdminLogin = React.lazy(() => import("./pages/AdminLogin").then(m => ({ default: m.AdminLogin })));
const AdminPanel = React.lazy(() => import("./pages/AdminPanel").then(m => ({ default: m.AdminPanel })));
const PrivacyPolicy = React.lazy(() => import("./pages/PrivacyPolicy").then(m => ({ default: m.PrivacyPolicy })));
const TermsOfService = React.lazy(() => import("./pages/TermsOfService").then(m => ({ default: m.TermsOfService })));
const StudentDashboard = React.lazy(() => import("./pages/StudentDashboard").then(m => ({ default: m.StudentDashboard })));
const ClientDashboard = React.lazy(() => import("./pages/ClientDashboard").then(m => ({ default: m.ClientDashboard })));

import { useAntiCopyProtection } from "./hooks/useAntiCopyProtection";

export default function App() {
  useAntiCopyProtection();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Show splash screen every time the app loads
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3500); // 3.5 seconds for a cinematic entrance
    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        {showSplash && <SplashScreen key="splash" />}
      </AnimatePresence>
      <Layout>
        <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-[#050505] text-white">Chargement...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/partners" element={<PartnersPage />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/web-design" element={<WebService />} />
            <Route path="/services/app-dev" element={<MobileService />} />
            <Route path="/services/ai-automation" element={<AIService />} />
            <Route path="/services/game-dev" element={<GameService />} />
            <Route path="/services/:serviceId" element={<Services />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/process" element={<ProcessPage />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/training" element={<Training />} />
            <Route path="/events" element={<Events />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/client-portal" element={<ClientDashboard />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}
