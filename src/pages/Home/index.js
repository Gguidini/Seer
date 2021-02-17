import { useEffect, useState } from 'react';
import Simulator from '../../components/simulator';
import firebase from '../../services/firebase';
import './index.css';

function Home() {
  const [details, setDetails] = useState();
  const [steps, setSteps] = useState([]);
  
  useEffect(() => {
    const live_report = firebase.database().ref('live_report/')
        
    const listener = live_report.on('value', (snapshot) => {
      if(snapshot === undefined) return;
      const data = snapshot.val()? snapshot.val() : [undefined, []];
      setDetails(data[0]);
      setSteps(data.slice(1))
    })

    return () => listener();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firebase]);
  
  return (
    <div className="Home">
      <header className="Home-header">
        <h1>Simulador</h1>
        <Simulator details={details} steps={steps} />
      </header>
    </div>
  );
}

export default Home;
