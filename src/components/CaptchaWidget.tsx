import React, { useState, useEffect } from 'react';
import { API_BASE } from '../apiConfig';
import { ShieldCheck, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

interface CaptchaWidgetProps {
  onVerified: (verifiedToken: string) => void;
  onReset?: () => void;
}

export const CaptchaWidget: React.FC<CaptchaWidgetProps> = ({ onVerified, onReset }) => {
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [challengeNumberA, setChallengeNumberA] = useState(4);
  const [challengeNumberB, setChallengeNumberB] = useState(7);
  const [userMathAnswer, setUserMathAnswer] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'slider' | 'math'>('slider');

  const generateNewChallenge = () => {
    setVerified(false);
    setSliderPosition(0);
    setUserMathAnswer('');
    setError(null);
    const a = Math.floor(Math.random() * 8) + 2;
    const b = Math.floor(Math.random() * 9) + 1;
    setChallengeNumberA(a);
    setChallengeNumberB(b);
    if (onReset) onReset();
  };

  useEffect(() => {
    generateNewChallenge();
  }, []);

  const handleSliderComplete = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/auth/verify-captcha`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: `wejobs_token_${Date.now()}`,
          answer: 'HUMAN_CONFIRMED',
        }),
      });
      const data = await response.json();
      if (data.success && data.verifiedToken) {
        setVerified(true);
        onVerified(data.verifiedToken);
      } else {
        setError(data.error || 'Verification failed. Please try again.');
        setSliderPosition(0);
      }
    } catch (err) {
      setError('Network error verifying challenge.');
      setSliderPosition(0);
    } finally {
      setLoading(false);
    }
  };

  const handleMathVerify = async () => {
    const expected = challengeNumberA + challengeNumberB;
    if (parseInt(userMathAnswer, 10) !== expected) {
      setError('Incorrect math answer. Please try again.');
      setUserMathAnswer('');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/auth/verify-captcha`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: `wejobs_token_${Date.now()}`,
          answer: userMathAnswer,
        }),
      });
      const data = await response.json();
      if (data.success && data.verifiedToken) {
        setVerified(true);
        onVerified(data.verifiedToken);
      } else {
        setError(data.error || 'Verification failed.');
      }
    } catch (err) {
      setError('Network error verifying security token.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="captcha-widget"
      className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/70 dark:bg-neutral-800/60"
    >
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
          <ShieldCheck className="w-4 h-4 text-orange-500" />
          <span>Security Verification</span>
          <span className="text-[10px] text-neutral-400 font-normal">(Anti-Bot Shield)</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'slider' ? 'math' : 'slider');
              generateNewChallenge();
            }}
            className="text-[11px] text-orange-600 dark:text-orange-400 hover:underline cursor-pointer"
          >
            {mode === 'slider' ? 'Switch to Math' : 'Switch to Slide'}
          </button>

          <button
            type="button"
            onClick={generateNewChallenge}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1 rounded transition-colors"
            title="Refresh Challenge"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {verified ? (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span>Human verification confirmed. Ready to proceed.</span>
        </div>
      ) : mode === 'slider' ? (
        <div className="space-y-2">
          <div
            className="relative h-10 w-full rounded-lg bg-neutral-200 dark:bg-neutral-700/80 overflow-hidden cursor-pointer flex items-center select-none"
            onMouseMove={(e) => {
              if (isDragging) {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
                setSliderPosition(pct);
                if (pct >= 92) {
                  setIsDragging(false);
                  handleSliderComplete();
                }
              }
            }}
            onMouseUp={() => {
              if (isDragging) {
                setIsDragging(false);
                if (sliderPosition < 92) {
                  setSliderPosition(0);
                }
              }
            }}
            onTouchMove={(e) => {
              if (isDragging && e.touches[0]) {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.touches[0].clientX - rect.left;
                const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
                setSliderPosition(pct);
                if (pct >= 92) {
                  setIsDragging(false);
                  handleSliderComplete();
                }
              }
            }}
            onTouchEnd={() => {
              if (isDragging) {
                setIsDragging(false);
                if (sliderPosition < 92) {
                  setSliderPosition(0);
                }
              }
            }}
          >
            {/* Progress Fill */}
            <div
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-orange-400 to-orange-500 opacity-30 transition-all duration-75"
              style={{ width: `${sliderPosition}%` }}
            />

            {/* Prompt label */}
            <div className="w-full text-center text-xs font-medium text-neutral-500 dark:text-neutral-400 pointer-events-none">
              {loading ? 'Verifying token...' : 'Slide right to verify human →'}
            </div>

            {/* Slider Knob */}
            <div
              onMouseDown={() => setIsDragging(true)}
              onTouchStart={() => setIsDragging(true)}
              style={{ left: `calc(${sliderPosition}% - ${sliderPosition > 80 ? 40 : 0}px)` }}
              className={`absolute top-1 bottom-1 w-10 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white rounded-md shadow flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform ${
                isDragging ? 'scale-105' : ''
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="px-3 py-2 rounded-lg bg-neutral-200 dark:bg-neutral-700 text-xs font-bold text-neutral-800 dark:text-neutral-200">
            {challengeNumberA} + {challengeNumberB} = ?
          </div>
          <input
            type="number"
            value={userMathAnswer}
            onChange={(e) => setUserMathAnswer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleMathVerify();
              }
            }}
            placeholder="Result"
            className="w-24 px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            type="button"
            onClick={handleMathVerify}
            disabled={loading}
            className="px-3 py-2 text-xs font-semibold rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-colors cursor-pointer"
          >
            {loading ? 'Checking...' : 'Verify'}
          </button>
        </div>
      )}

      {error && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-500 dark:text-rose-400">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
