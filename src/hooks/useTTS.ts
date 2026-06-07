import { useEffect, useRef, useState } from 'react';
import { BN_W, toBN } from '../utils/bengali';

const EN_W: Record<string, string> = {
  '0': 'zero', '1': 'one', '2': 'two', '3': 'three', '4': 'four',
  '5': 'five', '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine',
};

export function useTTS() {
  const [rate, setRate] = useState(0.75);
  const [supported] = useState(() => 'speechSynthesis' in window);
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (!supported) return;

    function loadVoices() {
      const voices = speechSynthesis.getVoices();
      const bnVoice =
        voices.find(v => v.lang === 'bn-BD') ??
        voices.find(v => v.lang === 'bn-IN') ??
        voices.find(v => v.lang.startsWith('bn')) ??
        null;
      if (bnVoice) {
        voiceRef.current = bnVoice;
        setLang('bn');
      } else {
        voiceRef.current =
          voices.find(v => v.lang === 'en-US') ??
          voices.find(v => v.lang.startsWith('en')) ??
          null;
        setLang('en');
      }
    }

    speechSynthesis.addEventListener('voiceschanged', loadVoices);
    loadVoices();
    return () => speechSynthesis.removeEventListener('voiceschanged', loadVoices);
  }, [supported]);

  function say(text: string, overrideRate?: number) {
    if (!supported) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === 'bn' ? 'bn-BD' : 'en-US';
    u.rate = overrideRate ?? rate;
    if (voiceRef.current) u.voice = voiceRef.current;
    speechSynthesis.speak(u);
  }

  function sayGroup(group: string) {
    const W = lang === 'bn' ? BN_W : EN_W;
    say(group.split('').map(d => W[d] ?? d).join(', '), rate);
  }

  function sayTokenAndGroup(n: number, total: number, group: string) {
    if (!supported) return;
    speechSynthesis.cancel();
    const text = lang === 'bn'
      ? `টোকেন ${toBN(n)}, মোট ${toBN(total)} এর মধ্যে।`
      : `Token ${n}, of ${total}.`;
    const u1 = new SpeechSynthesisUtterance(text);
    u1.lang = lang === 'bn' ? 'bn-BD' : 'en-US';
    u1.rate = rate * 1.1;
    if (voiceRef.current) u1.voice = voiceRef.current;
    u1.onend = () => sayGroup(group);
    speechSynthesis.speak(u1);
  }

  function cancel() {
    if (supported) speechSynthesis.cancel();
  }

  return { supported, lang, rate, setRate, say, sayGroup, sayTokenAndGroup, cancel };
}
