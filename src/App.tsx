import Home from './components/Home.tsx'
import Attendence from "./components/Attendence.tsx";
import D2D from "./components/D2D.tsx";
import Result from "./components/Result.tsx";
import {useState} from "react";

export default function App() {

  const [currentPhase, setCurrentPhase] = useState<string>('home');
  const [present, setPresent] = useState<number[]>([]);
  const [absent, setAbsent] = useState<number[]>([]);
  const [presentD2D, setPresentD2D] = useState<number[]>([]);
 const [absentD2D, setAbsentD2D] = useState<number[]>([]);

  const setState = {
    setCurrentPhase,
    setPresent,
    setAbsent,
    setPresentD2D,
    setAbsentD2D
  }
  const getState = {
    currentPhase,
    present,
    absent,
    presentD2D,
    absentD2D
  }

  if (currentPhase === 'home') return <Home setState={setState} getState={getState}/>
  else if (currentPhase === 'at-1') return <Attendence setState={setState} getState={getState} />
  else if (currentPhase === 'd2d') return <D2D setState={setState} getState={getState}/>
  else if (currentPhase === 'result') return <Result setState={setState} getState={getState}/>
  else return <span>Pretty sure you are not suppose to be here</span>
}

