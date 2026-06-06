import { useEffect, useRef, useState } from 'react';
import { BN_W, toBN } from '../utils/bengali';

export function useTTS() {
  const [rate, setRate] = useState(0.75);
  const [supported] = useState(() => 'speechSynthesis' in window);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (!supported) return;

    function loadVoices() {
      const voices = speechSynthesis.getVoices();
      voiceRef.current =
        voices.find(v => v.lang === 'bn-BD') ??
        voices.find(v => v.lang === 'bn-IN') ??
        voices.find(v => v.lang.startsWith('bn')) ??
        null;
    }

    speechSynthesis.addEventListener('voiceschanged', loadVoices);
    loadVoices();
    return () => speechSynthesis.removeEventListener('voiceschanged', loadVoices);
  }, [supported]);

  function say(text: string, overrideRate?: number) {
    if (!supported) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'bn-BD';
    u.rate = overrideRate ?? rate;
    if (voiceRef.current) u.voice = voiceRef.current;
    speechSynthesis.speak(u);
  }

  function sayGroup(group: string) {
    say(group.split('').map(d => BN_W[d] ?? d).join(', '), rate);
  }

  function sayTokenAndGroup(n: number, total: number, group: string) {
    if (!supported) return;
    speechSynthesis.cancel();
    const u1 = new SpeechSynthesisUtterance(
      `টোকেন ${toBN(n)}, মোট ${toBN(total)} এর মধ্যে।`
    );
    u1.lang = 'bn-BD';
    u1.rate = rate * 1.1;
    if (voiceRef.current) u1.voice = voiceRef.current;
    u1.onend = () => sayGroup(group);
    speechSynthesis.speak(u1);
  }

  function cancel() {
    if (supported) speechSynthesis.cancel();
  }

  return { supported, rate, setRate, say, sayGroup, sayTokenAndGroup, cancel };
}
