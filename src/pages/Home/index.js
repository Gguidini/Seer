import { FormControl, Tabs, Tab, InputLabel, MenuItem, Select } from '@material-ui/core';
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
  const [logs, setLogs] = useState([]);


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

  useEffect(() => {
    const logs = firebase.database().ref(`${user}/logs/`);

    const listener = logs.on('value', (snapshot) => {
      if(snapshot === undefined) return;
      if(snapshot.ref.path.pieces_[0] === user){
        const data = snapshot.val()? snapshot.val() : [];
        setLogs(data);
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
          <FormControl>
            <InputLabel>Selecione um usuário...</InputLabel>
            <Select
              className="select-field"
              value={user}
              onChange={event => setUser(event.target.value)}
            >
              {usersList.map(item => (
                <MenuItem
                  key={item}
                  value={item}
                >
                  {item}
                  </MenuItem>
              ))}
            </Select>
          </FormControl>
          {user !== '' && (
            <div className="tabs">
              <Tabs value={tab} onChange={(e, n) => setTab(n)}>
                <Tab label="Simulação" value={0} />
                {logs.length !== 0 && (
                  <Tab label="Logs" value={1} />
                )}
              </Tabs>
              <TabPanel value={tab} index={0}>
                <Simulator details={details} steps={steps} user={user}/>
              </TabPanel>
              <TabPanel value={tab} index={1}>
                <LogsTab logs={logs} />
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
