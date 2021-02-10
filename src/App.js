import { live_report } from './firebase';
import './App.css';

function App() {

  live_report.on('value', (snapshot) => {
    console.log(snapshot.val());
  })
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>Simulador</h1>
      </header>
    </div>
  );
}

export default App;
