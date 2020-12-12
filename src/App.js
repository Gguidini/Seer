import './App.css';
import factory from 'mxgraph'
import axios from 'axios'
import lru from 'lru-cache'
import { useEffect, useState } from 'react'

import { FaStepForward, FaStepBackward, FaPlayCircle, FaStopCircle } from 'react-icons/fa'


// Extra shapes
import { registerFloorplanWallU } from './models/wallU'
import { registerFloorplanWall } from './models/wall'
import { registerFloorplanRoom } from './models/room'

const mx = factory();

let graph;
// Cache for the steps we fetch from the server.
// Saves some time for steps that are close by,
// Because we don't have to fetch them again.
const cache = new lru(5);

// Register extra floorplan shapes
registerFloorplanWallU(mx.mxUtils, mx.mxCellRenderer, mx.mxShape);
registerFloorplanWall(mx.mxUtils, mx.mxCellRenderer, mx.mxShape);
registerFloorplanRoom(mx.mxUtils, mx.mxCellRenderer, mx.mxShape);

// TODO: Fetch next steps ahead of time to increase speed
function App() {
  const [err, updateErr] = useState('')
  const [step, updateStep] = useState(-1)
  const [timestamp, updateTimestamp] = useState()
  const [title, updateTitle] = useState("")
  const [maxStep, updateMaxStep] = useState(-1)
  const [running, updateRunning] = useState(false)
  const [playInterval, updatePlayInterval] = useState(undefined)

  // Processes currStep.
  // currStep is a JSON object with the position of all entities
  // And the timestamp for the current simulation step.
  // @param {currStep} object
  const processStep = (currStep) => {
    const model = graph.getModel()
    const parent = graph.getDefaultParent();
    updateTimestamp(currStep.timestamp)
    model.beginUpdate()
    for (const ent in currStep) {

      if(!currStep.hasOwnProperty(ent) || ent === 'timestamp') continue
      
      const cell = model.getCell(ent)
      const {x, y, width, height, value, style} = currStep[ent]
      const cleanValue = value.match(/>(.*)</)
      if (cell) {
        // Entity already there, just update
        cell.geometry.x = x
        cell.geometry.y = y
        cell.geometry.width = width
        cell.geometry.height = height
        cell.value = cleanValue ? cleanValue[1] : value
        cell.style = style
      } else {
        graph.insertVertex(parent, ent, cleanValue ? cleanValue[1] : value, x, y, width, height, style)
      }
    }
    model.endUpdate()
    graph.refresh()
  }

  useEffect( () => {
    if (step >= 0 && step <= maxStep){
      if (step === maxStep) updateRunning(false);
      const cachedStep = cache.get(step)
      if (cachedStep) {
        processStep(cachedStep);
      } else {
        axios.get(`http://localhost:3005/${step}`)
        .then(response => {
          const currStep = response.data
          cache.set(step, currStep)
          processStep(currStep)
        })
        .catch(err => {
          updateErr(err.message)
        })
      }
    } 
  }, [step])

  useEffect(() => {
    axios.get('http://localhost:3005/').then(response => {
      const details = response.data
      const container = document.getElementById('mxContainer')
      if (container === null) {
        updateErr("Can't find graph container")
        return
      }
      container.setAttribute('style', `width:${details.dimensions.width};height:${details.dimensions.height}`)
      mx.mxEvent.disableContextMenu(container);
      updateMaxStep(details.stepCount)
      updateTitle(details.window_name)
    
      graph = new mx.mxGraph(container)
      graph.setPanning(true);
      graph.setTooltips(true);
      // Custom tooltip for cells
      graph.getTooltipForCell = function(cell) {
        return `Position: (${cell.geometry.x}, ${cell.geometry.y})`
      }
      updateStep(step => step + 1)
    }).catch(err => {
      updateErr(err.message)
    })
  }, [])
  
  useEffect(() => {
    if (!running) {
      console.log('clear')
      clearInterval(playInterval);
      updatePlayInterval(undefined);
    } else if(playInterval === undefined) {
      updatePlayInterval(setInterval(() => updateStep(step => step + 1), 500))
    }
    return () => clearInterval(playInterval)
  }, [running, playInterval])

  return (
  <div className="App">
    <header className="AppHeader">
      <h2>
        {title}
      </h2>
      <p>TimeStamp: {timestamp} • Step: {step}/{maxStep}</p>
      <p>{err}</p>
      <button 
        className="control"
        disabled={step === 0}
        onClick={() => updateStep(step => step -1)}
        >
        < FaStepBackward />
      </button>

      <button 
        className="control"
        disabled={step === maxStep}
        onClick={() => updateRunning(running => !running)}
        >
          {
            running ? <FaStopCircle /> : < FaPlayCircle />
          }
      </button>

      <button 
        className="control"
        disabled={step === maxStep}
        onClick={() => updateStep(step => step + 1)}
        >
        <FaStepForward />
      </button>
    </header>

    <div id="mxContainer" >
    </div>

  </div>);
}

export default App;
