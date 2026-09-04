import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  ExternalLink, 
  Sparkles, 
  AlertCircle, 
  X,
  Volume2,
  Lock,
  Unlock,
  Check
} from 'lucide-react';
import { ShortLink, AdSettings } from '../types';

interface ThreeStepVisitorProps {
  link: ShortLink;
  adSettings: AdSettings;
  onCompleteView: (linkId: string, earnedAmount: number) => void;
  onClose: () => void;
}

export const ThreeStepVisitor: React.FC<ThreeStepVisitorProps> = ({
  link,
  adSettings,
  onCompleteView,
  onClose
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 'done'>(1);
  
  // Timers for each step
  const [timeLeft, setTimeLeft] = useState<number>(adSettings.step1Timer);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  // Anti-bot check state for step 2
  const [captchaChecked, setCaptchaChecked] = useState<boolean>(false);
  const [captchaError, setCaptchaError] = useState<string>('');

  // Step 2 popunder simulation indicator
  const [showPopunderNotice, setShowPopunderNotice] = useState<boolean>(false);

  // Final view credited state
  const [earnedCredit, setEarnedCredit] = useState<number>(0);

  // Timer countdown hook
  useEffect(() => {
    if (!isTimerRunning || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isTimerRunning, currentStep]);

  // Handle proceeding to Step 2
  const handleProceedToStep2 = () => {
    setCurrentStep(2);
    setTimeLeft(adSettings.step2Timer);
    setIsTimerRunning(true);
    if (adSettings.enablePopunder) {
      setShowPopunderNotice(true);
      setTimeout(() => setShowPopunderNotice(false), 3500);
    }
  };

  // Handle proceeding to Step 3
  const handleProceedToStep3 = () => {
    if (adSettings.enableCaptcha && !captchaChecked) {
      setCaptchaError('Please verify you are human by ticking the box below.');
      return;
    }
    setCaptchaError('');
    setCurrentStep(3);
    setTimeLeft(adSettings.step3Timer);
    setIsTimerRunning(true);
  };

  // Handle Final Completion
  const handleFinishAndRedirect = () => {
    const earned = parseFloat((adSettings.cpmRate / 1000).toFixed(3));
    setEarnedCredit(earned);
    onCompleteView(link.id, earned);
    setCurrentStep('done');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-start overflow-y-auto p-2 sm:p-4">
      <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto relative">
        {/* Top Header Bar */}
        <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-white tracking-wide">
              {currentStep === 'done' ? 'Link Ready' : `Step ${currentStep} of 3 — Secure Gateway`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-amber-400 font-mono bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full font-bold">
              3-Step Monetized
            </span>
            <button 
              id="close-visitor-flow"
              onClick={onClose}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              title="Close Gateway"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Progress Indicator Bar */}
        <div className="w-full bg-slate-900 h-1.5 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 via-indigo-500 to-emerald-500 transition-all duration-500"
            style={{ 
              width: currentStep === 1 ? '33%' : currentStep === 2 ? '66%' : currentStep === 3 ? '95%' : '100%' 
            }}
          />
        </div>

        {/* Popunder notice banner simulation */}
        {showPopunderNotice && (
          <div className="bg-amber-500/90 text-slate-950 text-xs font-bold px-4 py-1.5 flex items-center justify-between animate-in slide-in-from-top">
            <span>⚡ Sponsored Ad Opened in New Background Window (Popunder)</span>
            <button onClick={() => setShowPopunderNotice(false)}><X className="w-3.5 h-3.5" /></button>
          </div>
        )}

        <div className="p-4 space-y-4">
          {/* STEP 1 / 3 */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in">
              {/* AdSlot 1 (Top Banner) */}
              <div 
                className="ad-slot-1 w-full"
                dangerouslySetInnerHTML={{ __html: adSettings.step1TopAd }} 
              />

              {/* Countdown Timer Block */}
              <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 text-center space-y-3 shadow-inner">
                <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Clock className="w-8 h-8 animate-spin" style={{ animationDuration: '4s' }} />
                </div>

                <div>
                  <h2 className="text-sm font-bold text-white">
                    {timeLeft > 0 ? `Please wait ${timeLeft} seconds...` : "Your verification link is ready!"}
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {timeLeft > 0 
                      ? "Scroll down and view sponsored sponsor offers to unlock Step 2."
                      : "Click the continue button below to proceed to Step 2/3."
                    }
                  </p>
                </div>

                {/* Animated Circular / Badge display */}
                <div className="text-3xl font-black text-amber-400 tracking-wider font-mono">
                  00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                </div>
              </div>

              {/* AdSlot 2 (Bottom Native Ad) */}
              <div 
                className="ad-slot-2 w-full"
                dangerouslySetInnerHTML={{ __html: adSettings.step1BottomAd }} 
              />

              {/* Next Button */}
              <div>
                <button
                  id="btn-step-1-continue"
                  onClick={handleProceedToStep2}
                  disabled={timeLeft > 0}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition duration-200 ${
                    timeLeft === 0
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-indigo-500/25 active:scale-95 animate-pulse'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  {timeLeft > 0 ? (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Continue (Locked - Wait {timeLeft}s)</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Click Here to Continue (Step 1 of 3) →</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 / 3 */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in">
              {/* AdSlot 3 (Interstitial Ad) */}
              <div 
                className="ad-slot-3 w-full"
                dangerouslySetInnerHTML={{ __html: adSettings.step2MidAd }} 
              />

              {/* Countdown Timer Block */}
              <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-white">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Step 2 of 3: Bot Verification</span>
                </div>
                
                <div className="text-2xl font-black text-amber-400 font-mono">
                  {timeLeft > 0 ? `00:0${timeLeft}` : "Verification Unlocked"}
                </div>
              </div>

              {/* Anti-Bot Captcha Box */}
              {adSettings.enableCaptcha && (
                <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <div 
                      onClick={() => setCaptchaChecked(!captchaChecked)}
                      className={`w-6 h-6 rounded-md border flex items-center justify-center transition ${
                        captchaChecked ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'bg-slate-950 border-slate-700'
                      }`}
                    >
                      {captchaChecked && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                    <span className="text-xs font-semibold text-slate-200">I am not a robot</span>
                  </label>
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                </div>
              )}

              {captchaError && (
                <p className="text-xs text-rose-400 bg-rose-950/40 p-2 rounded-lg border border-rose-800/50">
                  {captchaError}
                </p>
              )}

              {/* Next Button */}
              <div>
                <button
                  id="btn-step-2-continue"
                  onClick={handleProceedToStep3}
                  disabled={timeLeft > 0}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition duration-200 ${
                    timeLeft === 0
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-indigo-500/25 active:scale-95'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  {timeLeft > 0 ? (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Generating Step 3 (Wait {timeLeft}s)</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Proceed to Final Step 3 →</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 / 3 (FINAL STEP) */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in">
              {/* AdSlot 4 (Final Top Banner) */}
              <div 
                className="ad-slot-4 w-full"
                dangerouslySetInnerHTML={{ __html: adSettings.step3TopAd }} 
              />

              {/* Countdown Timer Block */}
              <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 text-center space-y-2">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-400">
                  <Sparkles className="w-4 h-4" />
                  <span>Final Step 3 of 3: Unlocking Destination Link</span>
                </div>
                
                <div className="text-3xl font-black text-white font-mono">
                  {timeLeft > 0 ? `00:0${timeLeft}` : "🎉 Link Ready!"}
                </div>
                <p className="text-[11px] text-slate-400">
                  {timeLeft > 0 ? "Preparing high-speed direct redirect..." : "Click the button below to get your final link."}
                </p>
              </div>

              {/* AdSlot 5 (Final Download Banner) */}
              <div 
                className="ad-slot-5 w-full"
                dangerouslySetInnerHTML={{ __html: adSettings.step3FinalAd }} 
              />

              {/* Get Link Button */}
              <div>
                <button
                  id="btn-step-3-get-link"
                  onClick={handleFinishAndRedirect}
                  disabled={timeLeft > 0}
                  className={`w-full py-3.5 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-xl transition duration-200 ${
                    timeLeft === 0
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-emerald-500/30 active:scale-95 animate-bounce'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  {timeLeft > 0 ? (
                    <>
                      <Clock className="w-4 h-4" />
                      <span>Unlocking Link in {timeLeft}s...</span>
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      <span>Get Final Link (Direct Redirect)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* COMPLETED / REDIRECT READY */}
          {currentStep === 'done' && (
            <div className="space-y-4 text-center py-4 animate-in zoom-in-95">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h2 className="text-base font-bold text-white">3-Step Ad Bypass Completed!</h2>
                <div className="mt-2 inline-block px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold">
                  +{adSettings.currency}{earnedCredit.toFixed(2)} Credited to Publisher's UPI Wallet
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Destination target link is ready to open:
                </p>
                <div className="mt-1 p-2 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono text-indigo-300 break-all max-w-sm mx-auto">
                  {link.originalUrl}
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                <a
                  id="btn-open-destination"
                  href={link.originalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Destination in New Tab</span>
                </a>
                <button
                  id="btn-close-completed-flow"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
