'use client';

import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { User, Mail, Phone, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from '../themeprovider';
import { 
  signInWithGoogle, 
  citizenSignupWithPhone, 
  verifyCitizenOtp, 
  lawyerSignup, 
  lawyerSignin, 
  forgotPassword 
} from '@/lib/auth';

// Register the hook to ensure proper cleanup in React strict mode
gsap.registerPlugin(useGSAP);

export interface AnimatedAuthProps {
  themeColor?: string;
  themeColorDark?: string;
  glowColor?: string;
  glowColorDark?: string;
  backgroundColor?: string;
  backgroundColorDark?: string;
  backdrop?: string;
  backdropDark?: string;
  placeholderColor?: string;
  placeholderColorDark?: string;
  textColor?: string;
  textColorDark?: string;
  secondaryTextColor?: string;
  secondaryTextColorDark?: string;
  borderColor?: string;
  borderColorDark?: string;
  transitionTintColor?: string;
  transitionTintColorDark?: string;
  leftPanelTitle?: string;
  leftPanelSubtitle?: string;
  rightPanelTitle?: string;
  rightPanelSubtitle?: string;
  leftPanelTitleColor?: string;
  leftPanelSubtitleColor?: string;
  rightPanelTitleColor?: string;
  rightPanelSubtitleColor?: string;
  loginTitle?: string;
  signupTitle?: string;
  leftPanelImage?: string;
  rightPanelImage?: string;
}

const roles = ['citizen', 'lawyer'] as const;
type Role = (typeof roles)[number];

export const ANIMATED_AUTH_TRANSITION_TINT_COLOR = '#d2b48c';

export const AUTH_COLORS_LIGHT = {
  themeColor: '#cbae86',
  glowColor: 'rgba(32, 10, 8, 0.46)',
  backgroundColor: '#e4e3e1',
  backdrop: '#f4f0d9',
  placeholderColor: 'rgb(0, 0, 0)',
  textColor: '#000000',
  secondaryTextColor: '#6b7280',
  borderColor: '#d1d5db',
  transitionTintColor: '#d2b48c',
  themeColorDark: '#8c6a5d',
  glowColorDark: 'rgba(16, 5, 4, 0.6)',
  backgroundColorDark: '#2c241b',
  backdropDark: '#1f1515',
  placeholderColorDark: 'rgba(255, 255, 255, 1)',
  textColorDark: '#ffffff',
  secondaryTextColorDark: '#9ca3af',
  borderColorDark: '#4b5563',
  transitionTintColorDark: '#2c241b',
};

export const AUTH_COLORS_DARK = {
  themeColor: '#8c6a5d',
  glowColor: 'rgba(16, 5, 4, 0.6)',
  backgroundColor: '#2c241b',
  backdrop: '#1f1515',
  placeholderColor: 'rgba(255, 255, 255, 1)',
  textColor: '#ffffff',
  secondaryTextColor: '#9ca3af',
  borderColor: '#4b5563',
  transitionTintColor: '#2c241b',
  themeColorDark: '#8c6a5d',
  glowColorDark: 'rgba(16, 5, 4, 0.6)',
  backgroundColorDark: '#2c241b',
  backdropDark: '#1f1515',
  placeholderColorDark: 'rgba(255, 255, 255, 1)',
  textColorDark: '#ffffff',
  secondaryTextColorDark: '#9ca3af',
  borderColorDark: '#4b5563',
  transitionTintColorDark: '#2c241b',
};

export default function AnimatedAuth({
  themeColor = AUTH_COLORS_LIGHT.themeColor,
  themeColorDark = AUTH_COLORS_DARK.themeColor,
  glowColor = AUTH_COLORS_LIGHT.glowColor,
  glowColorDark = AUTH_COLORS_DARK.glowColor,
  backgroundColor = AUTH_COLORS_LIGHT.backgroundColor,
  backgroundColorDark = AUTH_COLORS_DARK.backgroundColor,
  backdrop = AUTH_COLORS_LIGHT.backdrop,
  backdropDark = AUTH_COLORS_DARK.backdrop,
  placeholderColor = AUTH_COLORS_LIGHT.placeholderColor,
  placeholderColorDark = AUTH_COLORS_DARK.placeholderColor,
  textColor = AUTH_COLORS_LIGHT.textColor,
  textColorDark = AUTH_COLORS_DARK.textColor,
  secondaryTextColor = AUTH_COLORS_LIGHT.secondaryTextColor,
  secondaryTextColorDark = AUTH_COLORS_DARK.secondaryTextColor,
  borderColor = AUTH_COLORS_LIGHT.borderColor,
  borderColorDark = AUTH_COLORS_DARK.borderColor,
  transitionTintColor = AUTH_COLORS_LIGHT.transitionTintColor,
  transitionTintColorDark = AUTH_COLORS_DARK.transitionTintColor,
  leftPanelTitle = 'WELCOME BACK!',
  leftPanelSubtitle = 'Lorem ipsum dolor sit amet consectetur adipisicing.',
  rightPanelTitle = 'HELLO FRIEND!',
  rightPanelSubtitle = 'Enter your personal details and start your journey with us.',
  leftPanelTitleColor = '#ffffff',
  leftPanelSubtitleColor = 'rgb(209 213 219)',
  rightPanelTitleColor = '#ffffff',
  rightPanelSubtitleColor = 'rgb(209 213 219)',
  loginTitle = 'Login',
  signupTitle = 'Sign Up',
  leftPanelImage = '/Authsideimage.jpeg',
  rightPanelImage = '/Authsideimage.jpeg',
}: AnimatedAuthProps) {
  const { theme } = useTheme();

  useEffect(() => {
    if (window.location.hash.includes('access_token')) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  // Role toggles
  const [authRole, setAuthRole] = useState<Role>('citizen');

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginPhone, setLoginPhone] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Signup State
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // OTP State (for Citizen)
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const overlayTintRef = useRef<HTMLDivElement>(null);
  const leftBgRef = useRef<HTMLDivElement>(null);
  const rightBgRef = useRef<HTMLDivElement>(null);
  const overlayLeftTextRef = useRef<HTMLDivElement>(null);
  const overlayRightTextRef = useRef<HTMLDivElement>(null);
  const loginFormRef = useRef<HTMLDivElement>(null);
  const signupFormRef = useRef<HTMLDivElement>(null);

  const isDark = theme === 'dark';
  const activeThemeColor = isDark ? themeColorDark : themeColor;
  const activeGlowColor = isDark ? glowColorDark : glowColor;
  const activeBackgroundColor = isDark ? backgroundColorDark : backgroundColor;
  const activeBackdrop = isDark ? backdropDark : backdrop;
  const activePlaceholderColor = isDark ? placeholderColorDark : placeholderColor;
  const activeTextColor = isDark ? textColorDark : textColor;
  const activeSecondaryTextColor = isDark ? secondaryTextColorDark : secondaryTextColor;
  const activeBorderColor = isDark ? borderColorDark : borderColor;
  const activeTransitionTintColor = isDark ? transitionTintColorDark : transitionTintColor;

  useGSAP(() => {
    gsap.fromTo(
      containerRef.current,
      { autoAlpha: 0, y: 40, scale: 0.98 },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
      }
    );
  }, { scope: containerRef });

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.inOut', duration: 0.8 } });

    if (isLogin) {
      tl.to(overlayTintRef.current, { autoAlpha: 1, duration: 0.25, ease: 'power1.out' }, 0)
      tl.to(overlayRef.current, {
        left: '45%',
        clipPath: 'polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)',
      }, 0)
        .to(overlayTintRef.current, { autoAlpha: 0, duration: 0.35, ease: 'power1.in' }, 0.55)
        .to(overlayLeftTextRef.current, { autoAlpha: 0, x: -50 }, 0)
        .to(overlayRightTextRef.current, { autoAlpha: 1, x: 0 }, 0.2)
        .to(leftBgRef.current, { autoAlpha: 0 }, 0)
        .to(rightBgRef.current, { autoAlpha: 1 }, 0)
        .to(signupFormRef.current, { autoAlpha: 0, x: 50 }, 0)
        .to(loginFormRef.current, { autoAlpha: 1, x: 0 }, 0.2);
    } else {
      tl.to(overlayTintRef.current, { autoAlpha: 1, duration: 0.25, ease: 'power1.out' }, 0)
      tl.to(overlayRef.current, {
        left: '0%',
        clipPath: 'polygon(0% 0%, 100% 0%, 80% 100%, 0% 100%)',
      }, 0)
        .to(overlayTintRef.current, { autoAlpha: 0, duration: 0.35, ease: 'power1.in' }, 0.55)
        .to(overlayRightTextRef.current, { autoAlpha: 0, x: 50 }, 0)
        .to(overlayLeftTextRef.current, { autoAlpha: 1, x: 0 }, 0.2)
        .to(rightBgRef.current, { autoAlpha: 0 }, 0)
        .to(leftBgRef.current, { autoAlpha: 1 }, 0)
        .to(loginFormRef.current, { autoAlpha: 0, x: -50 }, 0)
        .to(signupFormRef.current, { autoAlpha: 1, x: 0 }, 0.2);
    }
    
    // Reset OTP state when switching forms
    setOtpSent(false);
    setOtp('');
    setError(null);
    setMessage('');
  }, { dependencies: [isLogin], scope: containerRef });

  const handleSendOtp = async (phone: string, isSignup = false) => {
    if (!phone) {
      setError('Phone number is required');
      return;
    }
    setError('');
    setMessage('');
    setLoading(true);

    const { error: otpError } = await citizenSignupWithPhone(phone, signupName || 'Citizen');

    setLoading(false);
    if (otpError) {
      setError(otpError.message);
    } else {
      setOtpSent(true);
      setMessage('OTP sent! Please check your messages.');
    }
  };

  const handleVerifyOtp = async (phone: string) => {
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }
    setError('');
    setMessage('');
    setLoading(true);

    const { error: verifyError } = await verifyCitizenOtp(phone, otp);

    setLoading(false);
    if (verifyError) {
      setError(verifyError.message);
    } else {
      router.push('/citizen');
    }
  };

  const handleLogin = async () => {
    setError('');
    setMessage('');

    if (authRole === 'citizen') {
      if (!otpSent) {
        handleSendOtp(loginPhone, false);
      } else {
        handleVerifyOtp(loginPhone);
      }
      return;
    }

    if (authRole === 'lawyer') {
      if (!loginEmail || !loginPassword) {
        setError('Email and password are required.');
        return;
      }
      setLoading(true);
      const { data, error: loginError } = await lawyerSignin(loginEmail.trim(), loginPassword);

      if (loginError) {
        setError(loginError.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      router.push('/lawyer');
    }
  };

  const handleSignup = async () => {
    setError('');
    setMessage('');

    if (authRole === 'citizen') {
      if (!signupPhone || !signupName) {
        setError('Full name and phone are required.');
        return;
      }
      if (!otpSent) {
        handleSendOtp(signupPhone, true);
      } else {
        handleVerifyOtp(signupPhone);
      }
      return;
    }

    if (authRole === 'lawyer') {
      if (!signupEmail || !signupPassword || !signupName) {
        setError('Name, email, and password are required.');
        return;
      }
      setLoading(true);

      const { data, error: signupError } = await lawyerSignup(
        signupEmail.trim(),
        signupPassword,
        signupName
      );

      setLoading(false);
      
      if (signupError) {
        setError(signupError.message);
        return;
      }

      setMessage('Account created! Please check your email to verify.');
      setIsLogin(true);
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setMessage('');
    setLoading(true);

    const { error: googleError } = await signInWithGoogle(authRole);

    if (googleError) {
      setError(googleError.message);
      setLoading(false);
    }
  };

  const handleForgotPasswordAction = async () => {
    if (authRole === 'citizen') {
      setError('Password reset is not applicable for Citizens (OTP based).');
      return;
    }
    if (!loginEmail.trim()) {
      setError('Please enter your email address first.');
      return;
    }
    setError('');
    setMessage('');
    setLoading(true);

    const { error: resetError } = await forgotPassword(loginEmail.trim());

    setLoading(false);
    if (resetError) {
      setError(resetError.message);
    } else {
      setMessage('Password reset link sent! Check your email.');
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen p-4 bg-cover bg-center"
      style={{ background: activeBackdrop }}
    >
      <div
        ref={containerRef}
        className="relative w-full max-w-4xl h-[650px] md:h-[550px] rounded-xl overflow-hidden flex"
        style={{
          backgroundColor: activeBackgroundColor,
          boxShadow: `0 0 20px ${activeGlowColor}, inset 0 0 0 1px ${activeThemeColor}40`,
          '--auth-placeholder': activePlaceholderColor,
          '--auth-text': activeTextColor,
          '--auth-text-secondary': activeSecondaryTextColor,
          '--auth-border': activeBorderColor,
        } as React.CSSProperties}
      >
        {(error || message) && (
          <div className="absolute left-1/2 top-4 z-30 -translate-x-1/2 px-4 py-2 text-sm rounded-lg border border-white/20 bg-black/80 text-white shadow-xl max-w-[90%] text-center">
            {error || message}
          </div>
        )}

        {/* === LOGIN FORM (Left Side) === */}
        <div
          ref={loginFormRef}
          className="absolute left-0 top-0 w-full md:w-1/2 h-full flex flex-col justify-center px-8 md:px-12 opacity-0 -translate-x-12 pointer-events-auto z-10 overflow-y-auto"
        >
          <h2 className="text-3xl font-bold text-[var(--auth-text)] mb-6">{loginTitle}</h2>
          
          {/* Role Selector */}
          <div className="flex bg-black/5 rounded-full p-1 mb-6 border border-[var(--auth-border)]">
            <button
              onClick={() => { setAuthRole('citizen'); setOtpSent(false); setError(null); }}
              className={`flex-1 py-1.5 text-xs font-medium rounded-full transition-all ${authRole === 'citizen' ? 'bg-white shadow-sm text-black' : 'text-[var(--auth-text-secondary)] hover:text-[var(--auth-text)]'}`}
            >
              Citizen
            </button>
            <button
              onClick={() => { setAuthRole('lawyer'); setOtpSent(false); setError(null); }}
              className={`flex-1 py-1.5 text-xs font-medium rounded-full transition-all ${authRole === 'lawyer' ? 'bg-white shadow-sm text-black' : 'text-[var(--auth-text-secondary)] hover:text-[var(--auth-text)]'}`}
            >
              Lawyer
            </button>
          </div>

          <div className="space-y-4">
            {authRole === 'citizen' ? (
              <>
                <div className="relative border-b border-[var(--auth-border)] pb-2 transition-all">
                  <input
                    type="tel"
                    placeholder="Phone Number (e.g. +1234567890)"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    disabled={otpSent}
                    className="w-full bg-transparent outline-none text-[var(--auth-text)] text-sm placeholder-[var(--auth-placeholder)] disabled:opacity-50"
                  />
                  <span className="absolute right-0 text-[var(--auth-text-secondary)]">
                    <Phone size={16} />
                  </span>
                </div>
                {otpSent && (
                  <div className="relative border-b border-[var(--auth-border)] pb-2 transition-all">
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full bg-transparent outline-none text-[var(--auth-text)] text-sm placeholder-[var(--auth-placeholder)]"
                    />
                    <span className="absolute right-0 text-[var(--auth-text-secondary)]">
                      <ShieldCheck size={16} />
                    </span>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="relative border-b border-[var(--auth-border)] pb-2 transition-all">
                  <input
                    type="email"
                    placeholder="Lawyer Email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-transparent outline-none text-[var(--auth-text)] text-sm placeholder-[var(--auth-placeholder)]"
                  />
                  <span className="absolute right-0 text-[var(--auth-text-secondary)]">
                    <Mail size={16} />
                  </span>
                </div>
                <div className="relative border-b border-[var(--auth-border)] pb-2 transition-all">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-transparent outline-none text-[var(--auth-text)] text-sm placeholder-[var(--auth-placeholder)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword((prev) => !prev)}
                    className="absolute right-0 text-xs text-[var(--auth-text-secondary)] hover:text-[var(--auth-text)]"
                  >
                    {showLoginPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <div className="flex justify-end mt-1">
                  <button
                    type="button"
                    onClick={handleForgotPasswordAction}
                    className="relative text-xs transition-colors"
                    style={{ color: activeThemeColor }}
                  >
                    Forgot Password?
                  </button>
                </div>
              </>
            )}
          </div>
          
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full mt-6 py-3 rounded-full text-white font-semibold transition-transform hover:scale-105"
            style={{ backgroundColor: activeThemeColor }}
          >
            {loading ? 'Please wait...' : (authRole === 'citizen' ? (otpSent ? 'Verify OTP' : 'Send OTP') : loginTitle)}
          </button>
          
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full mt-3 py-3 rounded-full text-[var(--auth-text)] text-sm font-semibold border bg-transparent transition-transform transition-colors hover:scale-105 hover:bg-black/5 flex items-center justify-center space-x-2"
            style={{ borderColor: activeThemeColor }}
          >
            {loading ? (
              'Please wait...'
            ) : (
              <>
                <img
                  src="/google_icon.svg"
                  alt="Google logo"
                  className="h-5 w-5"
                />
                <span>Login via Google</span>
              </>
            )}
          </button>
          <p className="text-xs text-[var(--auth-text-secondary)] mt-6 text-center">
            Don&apos;t have an account?{' '}
            <button onClick={() => {setIsLogin(false); setOtpSent(false);}} style={{ color: activeThemeColor }} className="hover:underline font-semibold">
              Sign Up
            </button>
          </p>
        </div>

        {/* === SIGN UP FORM (Right Side) === */}
        <div
          ref={signupFormRef}
          className="absolute right-0 top-0 w-full md:w-1/2 h-full flex flex-col justify-start px-8 md:px-12 pointer-events-auto z-10 overflow-y-auto pb-8 pt-6"
        >
          <h2 className="text-2xl font-bold text-[var(--auth-text)] mb-4">{signupTitle}</h2>
          
          {/* Role Selector */}
          <div className="flex bg-black/5 rounded-full p-1 mb-5 border border-[var(--auth-border)] shrink-0">
            <button
              onClick={() => { setAuthRole('citizen'); setOtpSent(false); setError(null); }}
              className={`flex-1 py-1.5 text-xs font-medium rounded-full transition-all ${authRole === 'citizen' ? 'bg-white shadow-sm text-black' : 'text-[var(--auth-text-secondary)] hover:text-[var(--auth-text)]'}`}
            >
              Citizen
            </button>
            <button
              onClick={() => { setAuthRole('lawyer'); setOtpSent(false); setError(null); }}
              className={`flex-1 py-1.5 text-xs font-medium rounded-full transition-all ${authRole === 'lawyer' ? 'bg-white shadow-sm text-black' : 'text-[var(--auth-text-secondary)] hover:text-[var(--auth-text)]'}`}
            >
              Lawyer
            </button>
          </div>

          <div className="space-y-3.5">
            <div className="relative border-b border-[var(--auth-border)] pb-1.5">
              <input
                type="text"
                placeholder="Full name"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                disabled={otpSent && authRole === 'citizen'}
                className="w-full bg-transparent outline-none text-[var(--auth-text)] text-xs placeholder-[var(--auth-placeholder)] disabled:opacity-50"
              />
              <span className="absolute right-0 top-0 text-[var(--auth-text-secondary)]">
                <User size={14} />
              </span>
            </div>

            {authRole === 'citizen' ? (
              <>
                <div className="relative border-b border-[var(--auth-border)] pb-1.5">
                  <input
                    type="tel"
                    placeholder="Phone (e.g. +1234567890)"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    disabled={otpSent}
                    className="w-full bg-transparent outline-none text-[var(--auth-text)] text-xs placeholder-[var(--auth-placeholder)] disabled:opacity-50"
                  />
                  <span className="absolute right-0 top-0 text-[var(--auth-text-secondary)]">
                    <Phone size={14} />
                  </span>
                </div>
                {otpSent && (
                  <div className="relative border-b border-[var(--auth-border)] pb-1.5">
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full bg-transparent outline-none text-[var(--auth-text)] text-xs placeholder-[var(--auth-placeholder)]"
                    />
                    <span className="absolute right-0 top-0 text-[var(--auth-text-secondary)]">
                      <ShieldCheck size={14} />
                    </span>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="relative border-b border-[var(--auth-border)] pb-1.5">
                  <input
                    type="email"
                    placeholder="Lawyer Email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full bg-transparent outline-none text-[var(--auth-text)] text-xs placeholder-[var(--auth-placeholder)]"
                  />
                  <span className="absolute right-0 top-0 text-[var(--auth-text-secondary)]">
                    <Mail size={14} />
                  </span>
                </div>
                <div className="relative border-b border-[var(--auth-border)] pb-1.5">
                  <input
                    type={showSignupPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full bg-transparent outline-none text-[var(--auth-text)] text-xs placeholder-[var(--auth-placeholder)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword((prev) => !prev)}
                    className="absolute right-0 top-0 text-[10px] text-[var(--auth-text-secondary)] hover:text-[var(--auth-text)]"
                  >
                    {showSignupPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </>
            )}
          </div>

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full mt-5 py-2.5 rounded-full text-white text-sm font-semibold transition-transform hover:scale-105"
            style={{ backgroundColor: activeThemeColor }}
          >
            {loading ? 'Please wait...' : (authRole === 'citizen' ? (otpSent ? 'Verify OTP' : 'Send OTP') : signupTitle)}
          </button>
          
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full mt-3 py-2.5 rounded-full text-[var(--auth-text)] text-sm font-semibold border bg-transparent transition-transform transition-colors hover:scale-105 hover:bg-black/5 flex items-center justify-center space-x-2"
            style={{ borderColor: activeThemeColor }}
          >
            {loading ? (
              'Please wait...'
            ) : (
              <>
                <img
                  src="/google_icon.svg"
                  alt="Google logo"
                  className="h-4 w-4"
                />
                <span>Signup via Google</span>
              </>
            )}
          </button>
          <p className="text-[11px] text-[var(--auth-text-secondary)] mt-5 text-center shrink-0">
            Already have an account?{' '}
            <button onClick={() => {setIsLogin(true); setOtpSent(false);}} style={{ color: activeThemeColor }} className="hover:underline font-semibold">
              Login
            </button>
          </p>
        </div>

        {/* === ANIMATED OVERLAY === */}
        <div
          ref={overlayRef}
          className="absolute top-0 h-full w-[55%] z-20 hidden md:flex overflow-hidden shadow-2xl"
          style={{
            // Initial state: Covering left side (Sign Up mode)
            left: '0%',
            clipPath: 'polygon(0% 0%, 100% 0%, 80% 100%, 0% 100%)',
          }}
        >
          <div
            ref={leftBgRef}
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{ backgroundImage: `url('${leftPanelImage}')` }}
          />
          <div
            ref={rightBgRef}
            className="absolute inset-0 bg-cover bg-center z-0 opacity-0 invisible"
            style={{ backgroundImage: `url('${rightPanelImage}')` }}
          />
          <div
            ref={overlayTintRef}
            className="absolute inset-0 opacity-0 z-10"
            style={{ backgroundColor: activeTransitionTintColor }}
          />

          {/* Overlay Content Left (Visible when overlay is on the left) */}
          <div
            ref={overlayLeftTextRef}
            className="absolute inset-0 z-20 flex flex-col justify-between pt-8 pb-8 items-start px-12 w-[calc(100%/0.55*0.5)]"
          >
            <h1
              className="text-4xl font-bold leading-tight"
              style={{ color: leftPanelTitleColor }}
            >
              {leftPanelTitle}
            </h1>
            <p
              className="text-sm max-w-[260px] leading-relaxed mt-3"
              style={{ color: leftPanelSubtitleColor }}
            >
              {leftPanelSubtitle}
            </p>
          </div>

          {/* Overlay Content Right (Visible when overlay is on the right) */}
          <div
            ref={overlayRightTextRef}
            className="absolute right-0 inset-y-0 z-20 flex flex-col justify-between pt-8 pb-8 items-end px-12 w-[calc(100%/0.55*0.5)] text-right opacity-0"
          >
            <h1
              className="text-4xl font-bold leading-tight"
              style={{ color: rightPanelTitleColor }}
            >
              {rightPanelTitle}
            </h1>
            <p
              className="text-sm max-w-[260px] leading-relaxed mt-3"
              style={{ color: rightPanelSubtitleColor }}
            >
              {rightPanelSubtitle}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
