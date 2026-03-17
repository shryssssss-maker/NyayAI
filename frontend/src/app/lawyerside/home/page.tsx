'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';
import { Sidebar } from '../../../../components/sidebar';
import type { NavItem } from '../../../../components/sidebar';
import gsap from 'gsap';
import { Menu, Home, Compass, Store, Gavel } from 'lucide-react';

const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8001').replace(/\/$/, '')

const LAWYER_NAV_ITEMS: NavItem[] = [
  { id: 'menu', icon: Menu, label: 'Menu' },
  { id: 'home', icon: Home, label: 'Home', href: '/lawyerside/home' },
  { id: 'explorer', icon: Compass, label: 'Explorer', href: '/lawyerside/explorer' },
  { id: 'marketplace', icon: Store, label: 'Marketplace', href: '/lawyerside/marketplace' },
  { id: 'my-cases', icon: Gavel, label: 'My Cases', href: '/lawyerside/my-cases' },
];

export default function LawyerHome() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const chatBubbleRef = useRef<HTMLDivElement>(null);
  const inputBarRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);

  const {
    isRecording,
    audioBlob,
    error: recorderError,
    startRecording,
    stopRecording,
    resetRecording
  } = useVoiceRecorder();

  const router = useRouter();

  useEffect(() => {
    if (recorderError) {
      toast.error(recorderError);
      resetRecording();
    }
  }, [recorderError, resetRecording]);

  useEffect(() => {
    if (audioBlob) {
      handleTranscription(audioBlob);
    }
  }, [audioBlob]);

  const handleTranscription = async (blob: Blob) => {
    setIsTranscribing(true);
    resetRecording();

    try {
      const formData = new FormData();
      formData.append('file', blob, 'voice_recording.webm');

      const transcribeUrl = `${BACKEND_URL}/transcribe`;
      
      const response = await axios.post(transcribeUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data?.text) {
        setInput(prev => prev ? `${prev} ${response.data.text}` : response.data.text);
      } else {
        toast.error("Could not transcribe audio. Please try again.");
      }
    } catch (err) {
      console.error("Transcription error:", err);
      toast.error("Failed to process voice input. Please ensure backend is running.");
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleProfileClick = () => {
    router.push('/lawyerside/profile');
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from(iconsRef.current, {
        opacity: 0,
        y: -15,
        duration: 0.6,
        ease: 'power3.out'
      })
      .from(headerRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power3.out'
      }, "-=0.4")
      .from(chatBubbleRef.current, {
        opacity: 0,
        y: 20,
        scale: 0.98,
        duration: 0.8,
        ease: 'power3.out'
      }, "-=0.6")
      .from(inputBarRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out'
      }, "-=0.6");
      
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#0f1e3f] overflow-hidden" ref={containerRef}>
      {/* Sidebar */}
      <div className="shrink-0 h-screen z-50 md:sticky md:top-0 shadow-[4px_0_24px_rgba(0,0,0,0.05)] dark:shadow-none bg-white dark:bg-[#0a152e]">
        <Sidebar navItems={LAWYER_NAV_ITEMS} showProfileButton={true} onProfileClick={handleProfileClick} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative h-full w-full">
        {/* Top Right Icons */}
        <div ref={iconsRef} className="absolute top-6 right-6 md:top-8 md:right-8 flex items-center gap-4 z-10 cursor-pointer">
          <button className="flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full border border-gray-300 dark:border-white/5 dark:bg-[#213a56]/20 bg-white text-gray-700 dark:text-[#cdaa80] hover:bg-gray-100 dark:hover:bg-[#213a56]/60 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm">
            <svg className="w-5 h-5 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               {/* User plus icon */}
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </button>
          <button className="flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full border border-gray-300 dark:border-white/5 dark:bg-[#213a56]/20 bg-white text-gray-700 dark:text-[#cdaa80] hover:bg-gray-100 dark:hover:bg-[#213a56]/60 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm">
            <svg className="w-5 h-5 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               {/* Bell icon */}
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
        </div>

        {/* Scrollable Chat Area */}
        <div className="flex-1 overflow-y-auto px-6 pt-24 pb-40 custom-scrollbar">
          <div className="max-w-4xl mx-auto flex flex-col gap-8 md:px-6">
            
            {/* Header */}
            <div ref={headerRef} className="text-left cursor-default">
              <h1 className="text-[26px] md:text-[28px] lg:text-[32px] font-medium tracking-wide text-[#997953] dark:text-[#cdaa80] mb-2 font-serif transition-colors duration-500 hover:text-[#7a6042] dark:hover:text-[#e0c3a0]">
                NyayaAI Legal Assistant
              </h1>
              <p className="text-gray-600 dark:text-white/60 text-[15px] font-sans user-select-none hover:text-gray-800 dark:hover:text-white/80 transition-colors duration-300">
                Manage your cases and connect with clients using AI-powered legal tools.
              </p>
            </div>

            {/* Chat Bubble Layout */}
            <div ref={chatBubbleRef} className="bg-white dark:bg-[#213a56]/40 rounded-xl rounded-tl-sm border border-gray-200 dark:border-transparent p-6 shadow-sm dark:shadow-xl dark:shadow-[#000000]/20 hover:border-[#997953]/30 dark:hover:bg-[#213a56]/60 transition-all duration-300 cursor-pointer group mt-2 backdrop-blur-sm">
              <h2 className="text-[14px] font-medium text-[#997953] dark:text-[#cdaa80] flex items-center gap-2 mb-2 group-hover:text-[#7a6042] dark:group-hover:text-[#e0c3a0] transition-colors">
                Namaste! <span role="img" aria-label="waving hand" className="group-hover:scale-110 transition-transform origin-bottom inline-block">👋</span> I&apos;m NyayaAI.
              </h2>
              <p className="text-gray-700 dark:text-white/85 text-[15px] leading-relaxed font-sans">
                Describe your legal query, and I will analyze the applicable laws, case precedents, and suggest the best course of action. You can also upload case documents for review!
              </p>
            </div>

          </div>
        </div>

        {/* Fixed Input Area at Bottom */}
        <div ref={inputBarRef} className="absolute bottom-0 left-0 right-0 p-6 md:p-10 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent dark:from-[#0f1e3f] dark:via-[#0f1e3f] dark:to-transparent z-20">
          <div className="max-w-4xl mx-auto md:px-6">
            <div className="flex items-center gap-4 w-full group relative">
              
              {/* Plus Button */}
              <button 
                type="button"
                className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full border border-gray-300 dark:border-white/10 dark:bg-transparent bg-white text-gray-500 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/5 active:bg-gray-200 hover:scale-105 active:scale-95 transition-all duration-300 shrink-0 cursor-pointer shadow-sm z-10 outline-none focus:ring-2 focus:ring-[#997953]/50 dark:focus:ring-white/20"
                aria-label="Add attachment"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              
              {/* Input Field */}
              <div className="flex-1 relative cursor-text transition-transform duration-300">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isTranscribing}
                  placeholder={isTranscribing ? "Processing voice input..." : "Describe your legal query..."}
                  className="w-full bg-white dark:bg-transparent border border-gray-300 dark:border-[#cdaa80]/30 rounded-full pl-6 pr-16 py-4 md:py-[18px] text-[15px] outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/40 focus:border-[#997953] dark:focus:border-[#cdaa80] focus:ring-1 focus:ring-[#997953] dark:focus:ring-[#cdaa80] transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:border-gray-400 dark:hover:border-[#cdaa80]/60 hover:bg-white/50 dark:hover:bg-[#213a56]/20 focus:bg-white dark:focus:bg-[#1a2c47]/50 disabled:opacity-70 disabled:cursor-wait"
                />
                
                {/* Voice Input Button Inside the Input Field */}
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isTranscribing}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-wait ${
                    isTranscribing 
                      ? 'bg-transparent text-[#997953] dark:text-[#cdaa80]' // loader state
                      : isRecording 
                        ? 'bg-red-500 text-white animate-pulse-ring' // recording state
                        : 'bg-transparent text-gray-400 hover:text-[#997953] dark:text-white/40 dark:hover:text-[#cdaa80] hover:bg-gray-100 dark:hover:bg-white/5' // idle state
                  }`}
                  aria-label={isRecording ? "Stop recording" : "Start recording"}
                >
                  {isTranscribing ? (
                    <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isRecording ? 2 : 1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  )}
                </button>
              </div>
              
              {/* Send Button */}
              <button 
                type="button"
                className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#997953] dark:bg-[#cdaa80] text-white dark:text-[#0f1e3f] hover:bg-[#7a6042] dark:hover:bg-[#e0c3a0] hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-[#cdaa80]/20 transition-all duration-300 shrink-0 cursor-pointer shadow-md z-10 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#997953] dark:focus:ring-[#cdaa80] dark:focus:ring-offset-[#0f1e3f]"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6 ml-1 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {/* custom send icon like image, plane */}
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10l8-2 10-5-5 10-2 8-3-8-8-3z" />
                </svg>
              </button>

            </div>
          </div>
        </div>
      </div>
      
      {/* Global CSS for the custom scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(205, 170, 128, 0.2);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(205, 170, 128, 0.5);
        }
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        .animate-pulse-ring {
          animation: pulse-ring 2s infinite;
        }
      `}} />
    </div>
  );
}
