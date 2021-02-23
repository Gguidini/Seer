import { useEffect, useState } from 'react';
import Simulator from '../../components/simulator';
import firebase from '../../services/firebase';
import './index.css';

function Home() {
  const [details, setDetails] = useState();
  const [steps, setSteps] = useState([]);
  const [user, setUser] = useState('');
  
  useEffect(() => {
    const live_report = firebase.database().ref(`${user}/live_report/`)
        
    const listener = live_report.on('value', (snapshot) => {
      if(snapshot === undefined) return;
      if(snapshot.ref.path.pieces_[0] === user){
        const data = snapshot.val()? snapshot.val() : [undefined, []];
        setDetails(data[0]);
        setSteps(data.slice(1))
      }
    })

    return () => listener();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firebase, user]);
  
  return (
    <div className="Home">
      <header className="Home-header">
        <h1>Simulador</h1>
        <b>Usuário:</b>
        <input
          type="text"
          value={user}
          onChange={event => setUser(event.target.value)}
        />
        <Simulator details={details} steps={steps} />
      </header>
    </div>
  );
}

export default Home;
