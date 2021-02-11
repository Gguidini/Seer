import { useEffect, useState } from 'react';
import firebase from '../../services/firebase';
import './index.css';

function Home() {

  const [dataList, setDataList] = useState([]);

  useEffect(() => {
      const live_report = firebase.database().ref('live_report/')
      
      const listener = live_report.on('value', (snapshot) => {
        if(snapshot === undefined) return;
        const data = snapshot.val();
        const updateDataList = [...dataList, data];
        setDataList(updateDataList);
      })

      return () => listener();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firebase]);

  return (
    <div className="Home">
      <header className="Home-header">
        <h1>Simulador</h1>
        {dataList.map((data) => (
          <p>{JSON.stringify(data)}</p>
        ))}
      </header>
    </div>
  );
}

export default Home;
