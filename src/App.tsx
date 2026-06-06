import { useState } from 'react';
import PasteScreen from './components/PasteScreen';
import ReadingScreen from './components/ReadingScreen';
import DoneScreen from './components/DoneScreen';
import { useTTS } from './hooks/useTTS';
import { useTokens } from './hooks/useTokens';

type Screen = 'paste' | 'reading' | 'done';

export default function App() {
  const [screen, setScreen] = useState<Screen>('paste');
  const tts = useTTS();
  const tok = useTokens();

  function handleStart(text: string) {
    const result = tok.start(text);
    if (!result) return;
    setScreen('reading');
    tts.sayTokenAndGroup(1, result.parsed.length, result.firstGroup);
  }

  function handleNext() {
    const result = tok.next();
    switch (result.action) {
      case 'next-group':
        tts.sayGroup(result.group);
        break;
      case 'await-enter':
        tts.say('এখন মিটারে Enter চাপুন, তারপর নিচের বোতাম চাপুন।');
        break;
      case 'next-token':
        tts.sayTokenAndGroup(result.tokenNum, result.total, result.group);
        break;
      case 'done':
        tts.say('সব টোকেন দেওয়া হয়ে গেছে। মিটারের ডিসপ্লে দেখুন।');
        setScreen('done');
        break;
    }
  }

  function handleRepeat() {
    if (tok.awaitEnter) {
      tts.say('মিটারে Enter চাপুন।');
    } else {
      tts.sayGroup(tok.curGrp);
    }
  }

  function handleBack() {
    tts.cancel();
    setScreen('paste');
  }

  function handleNewSession() {
    tok.reset();
    setScreen('paste');
  }

  if (screen === 'paste') {
    return <PasteScreen onStart={handleStart} ttsSupported={tts.supported} />;
  }

  if (screen === 'reading') {
    return (
      <ReadingScreen
        tokens={tok.tokens}
        tIdx={tok.tIdx}
        curGrps={tok.curGrps}
        curGrp={tok.curGrp}
        gIdx={tok.gIdx}
        doneSet={tok.doneSet}
        awaitEnter={tok.awaitEnter}
        isLastTok={tok.isLastTok}
        ttsRate={tts.rate}
        onNext={handleNext}
        onRepeat={handleRepeat}
        onBack={handleBack}
        onSetSpeed={tts.setRate}
      />
    );
  }

  return <DoneScreen tokenCount={tok.tokens.length} onNewSession={handleNewSession} />;
}
