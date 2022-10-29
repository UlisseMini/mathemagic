import React, { useEffect } from 'react';
import {useState} from 'react';

const desiredVoice = 'Google US English'
type Voice = SpeechSynthesisVoice;

// Generate a random integer in the range [a,b)
function randint(a: number, b: number) {
    return Math.floor(Math.random()*(b-a) + a)
}

function newProblem() {
    return `${randint(10, 100)} + ${randint(10, 100)}`;
}

function ActiveTrainer({voice} : {voice: Voice}) {
    const [answer, setAnswer] = useState('');
    const [problem, setProblem] = useState('');

    if (answer == eval(problem) || problem == '') {
        setProblem(newProblem())
        setAnswer('')
    }

    // TODO: 2x speed setting for the madlads out there
    useEffect(() => {
        let utterance = new SpeechSynthesisUtterance(problem);
        utterance.voice = voice;
        speechSynthesis.speak(utterance);
    }, [problem])
    
    // TODO: wait for return and measure success rate
    return <>
        <input
            type="number"
            placeholder="Answer"
            onChange={(e) => setAnswer(e.target.value)}
            value={answer}
        />
    </>
}

function Trainer({voice} : {voice: Voice}) {
    // TODO: Use space to play/pause
    const [paused, setPaused] = useState(true);
    useEffect(() => {
        document.body.onkeydown = (e) => {
            console.log(e.key)
            if (e.key == ' ') setPaused(!paused)
        }
    }, [paused])


    return <>
        {paused
            ? <h1>Paused</h1>
            : <ActiveTrainer voice={voice}/>
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

