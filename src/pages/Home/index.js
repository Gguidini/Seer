import { AppBar, Tabs, Tab } from '@material-ui/core';
import Simulator from '../../components/simulator';
import TabPanel from '../../components/TabPanel';
import firebase from '../../services/firebase';
import { useEffect, useState } from 'react';
import './index.css';
import LogsTab from '../../components/logsTab';


function Home() {
  const [details, setDetails] = useState();
  const [steps, setSteps] = useState([]);
  const [user, setUser] = useState('');
  const [usersList, setUsersList] = useState([]);
  const [tab, setTab] = useState(0);


  useEffect(() => {
    const root = firebase.database().ref()
    const u = root.on('value', (snapshot) => {
      if(snapshot === undefined) return;
      const data = snapshot.val()? snapshot.val() : [];
      let list = []
      for(const u in data) {
        list.push(u);
      }
      setUsersList(list)
    })
    return () => u();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firebase]);
  
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
        {usersList.length !== 0 && (
          <>
          <b>Usuário:</b>
          <select defaultValue={'DEFAULT'} onChange={event => setUser(event.target.value)}>
          <option value="DEFAULT" disabled>Selecione um usuário ...</option>
          {usersList.map(item => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}
          </select>
          {user !== '' && (
            <div className="tabs">
              <Tabs value={tab} onChange={(e, n) => setTab(n)}>
                <Tab label="Simulação" value={0} />
                <Tab label="Logs" value={1} />
              </Tabs>
              <TabPanel value={tab} index={0}>
                <Simulator details={details} steps={steps} user={user}/>
              </TabPanel>
              <TabPanel value={tab} index={1}>
                <LogsTab/>
              </TabPanel>
            </div>
          )}
          </>
        )}
      </header>
    </div>
  );
}

export default Home;
