import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroUpload } from './components/HeroUpload';
import { WorkspaceEditor } from './components/WorkspaceEditor';
import { BatchProcessor } from './components/BatchProcessor';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { HowItWorks } from './components/HowItWorks';
import { BeforeAfterShowcase } from './components/BeforeAfterShowcase';
import { Features } from './components/Features';
import { UseCases } from './components/UseCases';
import { PricingSection } from './components/PricingSection';
import { FAQSection } from './components/FAQSection';
import { SeoArticlesSection } from './components/SeoArticlesSection';
import { Footer } from './components/Footer';
import { AdBanner } from './components/AdBanner';
import { LegalModals, LegalModalType } from './components/LegalModals';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { ProcessedImage, SampleImageItem, ProcessingMode } from './types';
import { removeImageBackground, warmUpNeuralEngine } from './utils/segmentation';

export const App: React.FC = () => {
  // Theme Dark Mode state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('cutout_theme') === 'dark' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Editor State
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progressStep, setProgressStep] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals
  const [showBatchModal, setShowBatchModal] = useState<boolean>(false);
  const [showMetricsModal, setShowMetricsModal] = useState<boolean>(false);
  const [activeLegalModal, setActiveLegalModal] = useState<LegalModalType>(null);

  // Pre-warm neural engine in the background for instantaneous <1s execution
  useEffect(() => {
    warmUpNeuralEngine();
    
    // Dynamic SEO landing page metadata based on path
    const path = window.location.pathname;
    const metaDescTag = document.querySelector('meta[name="description"]');
    
    if (path.includes('background-remover')) {
      document.title = 'Free Background Remover Online | AI Cutout Tool - BgRemoverX';
      if (metaDescTag) metaDescTag.setAttribute('content', 'Use BgRemoverX free online background remover to instantly extract subjects, remove photo backgrounds, and download 4K transparent PNGs with no sign-up.');
    } else if (path.includes('remove-background')) {
      document.title = 'Remove Background from Image Online Free | BgRemoverX';
      if (metaDescTag) metaDescTag.setAttribute('content', 'Remove image background online in 1 second. Free AI background eraser for PNG, JPG and WebP photos with crystal clear hair and fur matting.');
    } else if (path.includes('ai-background-remover')) {
      document.title = 'AI Background Remover | Professional Image Cutout - BgRemoverX';
      if (metaDescTag) metaDescTag.setAttribute('content', 'Advanced AI background remover powered by neural IS-Net technology. Automatically isolate product photos, portraits, and graphics with zero manual tracing.');
    } else if (path.includes('free-background-remover')) {
      document.title = '100% Free Background Remover | No Watermark - BgRemoverX';
      if (metaDescTag) metaDescTag.setAttribute('content', 'Enjoy 100% free background removal with unlimited 4K high-resolution downloads, e-commerce white backdrops, and batch processing.');
    } else if (path.includes('transparent-background')) {
      document.title = 'Transparent Background Maker | PNG Cutout - BgRemoverX';
      if (metaDescTag) metaDescTag.setAttribute('content', 'Make image backgrounds transparent instantly. Download professional transparent PNG files for logos, stickers, and graphic design.');
    } else if (path.includes('remove-white-background')) {
      document.title = 'Remove White Background from Image Online - BgRemoverX';
      if (metaDescTag) metaDescTag.setAttribute('content', 'Quickly remove solid white or colored backgrounds from product photos. Perfect for Amazon, Shopify, and eBay listings.');
    } else if (path.includes('blog')) {
      document.title = 'AI Image Editing & E-Commerce Photography Blog - BgRemoverX';
      if (metaDescTag) metaDescTag.setAttribute('content', 'Explore expert guides on e-commerce photography, background removal tutorials, AI computer vision models, and transparent PNG creation.');
    }
  }, []);

  // Synchronize Dark Mode Class on Document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('cutout_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('cutout_theme', 'light');
    }
  }, [darkMode]);

  // Auto-scroll to top when a new result is ready
  useEffect(() => {
    if (processedImage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [processedImage]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // Scroll smoothly to a section on the page
  const scrollToSection = (sectionId: string) => {
    if (processedImage) {
      setProcessedImage(null);
    }
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 60);
  };

  // Handle uploaded file
  const handleFileSelected = async (file: File, mode: ProcessingMode = 'hd') => {
    try {
      setIsProcessing(true);
      setErrorMessage(null);
      setProgressStep('Uploading and reading image...');
      setProgressPercent(10);

      const result = await removeImageBackground(
        file,
        file.name,
        (step, percent) => {
          setProgressStep(step);
          setProgressPercent(percent);
        },
        { mode }
      );

      setProcessedImage(result);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Error processing file:', err);
      setErrorMessage(err?.message || 'Failed to remove background. Please try another image.');
    } finally {
      setIsProcessing(false);
      setProgressStep('');
      setProgressPercent(0);
    }
  };

  // Load sample image directly from external/preset URL
  const handleLoadSampleUrl = async (imageUrl: string, sampleName: string = 'sample_image.jpg', mode: ProcessingMode = 'hd') => {
    try {
      setIsProcessing(true);
      setErrorMessage(null);
      setProgressStep('Fetching high-resolution sample...');
      setProgressPercent(15);

      let response: Response;
      try {
        response = await fetch(imageUrl);
        if (!response.ok) {
          throw new Error(`Direct fetch failed with status ${response.status}`);
        }
      } catch (fetchErr) {
        // Fallback to local server proxy if direct fetch is blocked by CORS or referrer policies
        const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
        response = await fetch(proxyUrl);
        if (!response.ok) {
          throw new Error('Failed to load sample image via proxy');
        }
      }

      const blob = await response.blob();
      const file = new File([blob], sampleName, { type: blob.type || 'image/jpeg' });

      setProgressStep('Extracting foreground with AI edge matting...');
      setProgressPercent(40);

      const result = await removeImageBackground(
        file,
        sampleName,
        (step, percent) => {
          setProgressStep(step);
          setProgressPercent(percent);
        },
        { mode }
      );

      setProcessedImage(result);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Error processing sample:', err);
      setErrorMessage('Could not load sample image. Please try uploading an image directly from your device.');
    } finally {
      setIsProcessing(false);
      setProgressStep('');
      setProgressPercent(0);
    }
  };

  const handleSampleSelected = (sample: SampleImageItem, mode: ProcessingMode = 'hd') => {
    handleLoadSampleUrl(sample.originalUrl, `${sample.id}.jpg`, mode);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 flex flex-col font-sans">
      {/* Global Navigation Header */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        toggleDarkMode={toggleDarkMode}
        onOpenBatch={() => setShowBatchModal(true)}
        onOpenAdmin={() => setShowMetricsModal(true)}
        onOpenMetrics={() => setShowMetricsModal(true)}
        onScrollToSection={scrollToSection}
        hasActiveProject={Boolean(processedImage)}
        onResetProject={() => setProcessedImage(null)}
      />

      {/* Main App Content Body */}
      <main className="flex-1">
        {/* View Switching: Workspace Editor vs Hero Landing with Upload */}
        {processedImage ? (
          <div className="pt-4 pb-16 animate-in fade-in duration-300">
            <WorkspaceEditor
              processedImage={processedImage}
              onUploadAnother={() => setProcessedImage(null)}
              darkMode={darkMode}
            />
          </div>
        ) : (
          <div>
            {/* Top Leaderboard Ad Slot */}
            <div className="pt-1">
              <AdBanner type="leaderboard" slotId="ad-top-leaderboard" />
            </div>

            {/* Hero Upload Section with drag-and-drop and instant sample selector */}
            <HeroUpload
              onFileSelected={handleFileSelected}
              onSampleSelected={handleSampleSelected}
              isProcessing={isProcessing}
              progressStep={progressStep}
              progressPercent={progressPercent}
              errorMessage={errorMessage}
              onClearError={() => setErrorMessage(null)}
            />

            {/* 3-Step Simple Workflow */}
            <HowItWorks />

            {/* Interactive Before & After Quality Showcase Slider */}
            <BeforeAfterShowcase
              darkMode={darkMode}
              onTrySample={(url) => handleLoadSampleUrl(url, 'showcase_sample.jpg')}
            />

            {/* Comprehensive Features Grid */}
            <Features />

            {/* In-Feed Billboard / High-Impact Sponsor Ad Slot */}
            <AdBanner type="billboard" slotId="ad-mid-billboard" />

            {/* Tailored Industry Use Cases */}
            <UseCases
              onSelectUseCase={(sampleUrl) => handleLoadSampleUrl(sampleUrl, 'industry_sample.jpg')}
            />

            {/* 100% Free Forever Ad-Supported Section */}
            <PricingSection />

            {/* SEO Knowledge Base & Mastery Guides */}
            <SeoArticlesSection />

            {/* FAQ Accordion Section */}
            <FAQSection />

            {/* Bottom Leaderboard Ad Slot */}
            <div className="pb-3 sm:pb-4">
              <AdBanner type="leaderboard" slotId="ad-bottom-leaderboard" />
            </div>
          </div>
        )}
      </main>

      {/* Floating Sticky Bottom Ad Strip */}
      {!processedImage && (
        <AdBanner type="sticky-bottom" slotId="ad-floating-bottom" />
      )}

      {/* GDPR / Google AdSense Cookie Consent Banner */}
      <CookieConsentBanner
        onOpenLegalModal={(type) => setActiveLegalModal(type)}
      />

      {/* Global Modals */}
      {showBatchModal && (
        <BatchProcessor
          onClose={() => setShowBatchModal(false)}
          darkMode={darkMode}
        />
      )}

      {showMetricsModal && (
        <AdminDashboardModal
          onClose={() => setShowMetricsModal(false)}
          darkMode={darkMode}
          onOpenAdSenseChecker={() => {
            setShowMetricsModal(false);
            setActiveLegalModal('adsense-checker');
          }}
        />
      )}

      {/* Legal & Compliance Modals (Privacy, Terms, About, Contact, AdSense Checklist) */}
      <LegalModals
        activeModal={activeLegalModal}
        onClose={() => setActiveLegalModal(null)}
        onOpenModal={(type) => setActiveLegalModal(type)}
      />

      {/* Global Footer */}
      <Footer
        onOpenBatch={() => setShowBatchModal(true)}
        onOpenMetrics={() => setShowMetricsModal(true)}
        onOpenLegalModal={(type) => setActiveLegalModal(type)}
      />
    </div>
  );
};

export default App;
