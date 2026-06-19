import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { SplashScreen } from "./components/layout/SplashScreen";
import { AnimatePresence } from "motion/react";
import { Home } from "./pages/Home";
import { AboutUs } from "./pages/AboutUs";
import { Services } from "./pages/Services";
import { WebService } from "./pages/WebService";
import { MobileService } from "./pages/MobileService";
import { AIService } from "./pages/AIService";
import { GameService } from "./pages/GameService";
import { Portfolio } from "./pages/Portfolio";
import { Gallery } from "./pages/Gallery";
import { ProcessPage } from "./pages/ProcessPage";
import { Blog } from "./pages/Blog";
import { Docs } from "./pages/Docs";
import { Training } from "./pages/Training";
import { Events } from "./pages/Events";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminPanel } from "./pages/AdminPanel";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { TermsOfService } from "./pages/TermsOfService";
import { StudentDashboard } from "./pages/StudentDashboard";
import { ClientDashboard } from "./pages/ClientDashboard";
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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<AboutUs />} />
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
      </Layout>
    </BrowserRouter>
  );
}
