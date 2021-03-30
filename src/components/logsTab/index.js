
import './index.css';

function LogsTab({ logs }) {

  return (
    <div className="logs-tab">
      {logs.map((log, idx) => (
        <>
          <code>{idx+1}. {log}</code>
          <br/>
        </>
      ))}
    </div>
  )
}

export default LogsTab;