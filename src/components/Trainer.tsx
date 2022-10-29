import React, { useEffect } from 'react';
import {useState} from 'react';

const desiredVoice = 'Google US English'
type Voice = SpeechSynthesisVoice;

// Generate a random integer in the range [a,b)
function randint(a: number, b: number) {
    return Math.floor(Math.random()*(b-a) + a)
}

function ActiveTrainer({voice} : {voice: Voice}) {
    // const problem = `${randint(10, 100)} + ${randint(10, 100)}`
    // const answer = eval(problem)
    const problem = '4 + 2'

    // TODO: 2x speed setting for the madlads out there
    let utterance = new SpeechSynthesisUtterance(problem);
    utterance.voice = voice;
    speechSynthesis.speak(utterance);
    
    return <>
        <input type="number" placeholder="Answer" />
    </>
}

function Trainer({voice} : {voice: Voice}) {
    // TODO: Use space to play/pause
    const [started, setStarted] = useState(false);
    return <>
        {started
            ? <ActiveTrainer voice={voice}/>
            : <button onClick={() => setStarted(true)}>Start</button>
        }
    </>
}

function VoiceLoader() {
    const [voice, setVoice] = useState<Voice>();

    useEffect(() => {
        speechSynthesis.onvoiceschanged = () => {
            const voices = speechSynthesis.getVoices()
            const voice = voices.find(v => v.name == desiredVoice)
            if (voice) setVoice(voice)
        }
    }, [])
    const loadingText = `Loading ${desiredVoice}... (Must use Google Chrome)`;
    return (voice ? <Trainer voice={voice} />: <p>{loadingText}</p>)
}

export default VoiceLoader

