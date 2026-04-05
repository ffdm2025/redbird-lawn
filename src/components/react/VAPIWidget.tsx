// src/components/react/VAPIWidget.tsx
// !! MUST use client:only="react" in parent .astro — NEVER client:load !!
// WebRTC APIs (RTCPeerConnection, navigator.mediaDevices) are browser-only.
// client:load would trigger SSR and crash the build with ReferenceError: window is not defined.

import { useRef, useEffect, useState } from 'react';
import Vapi from '@vapi-ai/web';
import { Phone, PhoneOff, Mic } from 'lucide-react';
import { NAP } from '../../lib/constants';

type CallStatus = 'idle' | 'connecting' | 'active' | 'error';

export default function VAPIWidget() {
  const vapiRef = useRef<InstanceType<typeof Vapi> | null>(null);
  const [status, setStatus] = useState<CallStatus>('idle');
  const [micDenied, setMicDenied] = useState(false);

  useEffect(() => {
    // Initialize inside useEffect — never at module scope
    // useRef prevents re-initialization on re-renders
    const vapi = new Vapi(import.meta.env.PUBLIC_VAPI_KEY);
    vapiRef.current = vapi;

    vapi.on('call-start', () => setStatus('active'));
    vapi.on('call-end', () => {
      setStatus('idle');
      setMicDenied(false);
    });
    vapi.on('error', (err: unknown) => {
      // Check both error shapes defensively — SDK documentation does not specify
      const name = (err as any)?.error?.name ?? (err as any)?.name ?? '';
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        setMicDenied(true);
      }
      setStatus('error');
    });

    return () => {
      // Cleanup: stop any active call on unmount
      vapi.stop();
    };
  }, []); // Run once on mount

  const handleToggle = async () => {
    if (status === 'active') {
      vapiRef.current?.stop();
    } else {
      setStatus('connecting');
      setMicDenied(false);
      try {
        await vapiRef.current?.start(import.meta.env.PUBLIC_VAPI_ASSISTANT_ID);
      } catch {
        setStatus('error');
      }
    }
  };

  const isConnecting = status === 'connecting';
  const isActive = status === 'active';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Mic denied fallback panel */}
      {micDenied && (
        <div
          role="alert"
          className="bg-white dark:bg-dark-bg rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-4 max-w-[260px] text-sm"
        >
          <p className="text-gray-700 dark:text-gray-300 mb-2 leading-snug">
            Please enable your microphone to speak with Vivian.
          </p>
          <a
            href={NAP.phoneHref}
            className="text-redbird-red font-semibold hover:underline"
          >
            Or call us instead
          </a>
        </div>
      )}

      {/* Active call expanded panel */}
      {isActive && (
        <div className="bg-white dark:bg-dark-bg rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-4 w-56">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Speaking with Vivian…
          </p>
          {/* Waveform indicator — CSS animated bars */}
          <div className="flex items-end gap-0.5 h-6 mb-3" aria-hidden="true">
            {[1, 2, 3, 4, 5].map(i => (
              <div
                key={i}
                className="w-1.5 bg-redbird-red rounded-sm animate-pulse"
                style={{ height: `${(i % 3 + 1) * 25}%`, animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
          <button
            onClick={() => vapiRef.current?.stop()}
            className="w-full text-xs text-red-500 font-semibold hover:text-red-700 transition-colors py-1"
          >
            End call
          </button>
        </div>
      )}

      {/* Main floating button — red circle, pulse animation when active */}
      <button
        onClick={handleToggle}
        disabled={isConnecting}
        aria-label={isActive ? 'End call with Vivian' : 'Speak with Vivian AI assistant'}
        className={`w-14 h-14 rounded-full bg-[#C41E3A] text-white shadow-lg flex items-center justify-center
          hover:bg-[#a01830] transition-all duration-200
          disabled:opacity-70 disabled:cursor-not-allowed
          focus:outline-none focus:ring-4 focus:ring-redbird-red/30
          ${isActive ? 'animate-pulse' : 'hover:scale-110 hover:shadow-xl'}`}
      >
        {isActive ? (
          <PhoneOff size={22} aria-hidden="true" />
        ) : isConnecting ? (
          <Mic size={22} aria-hidden="true" className="animate-pulse" />
        ) : (
          <Phone size={22} aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
