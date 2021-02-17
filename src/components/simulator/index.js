import { FaStepForward, FaStepBackward, FaPlayCircle, FaStopCircle } from 'react-icons/fa'

import factory from 'mxgraph'
import { useEffect, useState } from 'react'

import './index.css';

// Extra shapes
import { registerFloorplanWallU } from './models/wallU'
import { registerFloorplanWall } from './models/wall'
import { registerFloorplanRoom } from './models/room'

const mx = factory();

let graph;

// Register extra floorplan shapes
registerFloorplanWallU(mx.mxUtils, mx.mxCellRenderer, mx.mxShape);
registerFloorplanWall(mx.mxUtils, mx.mxCellRenderer, mx.mxShape);
registerFloorplanRoom(mx.mxUtils, mx.mxCellRenderer, mx.mxShape);

function Simulator( { details, steps } ) {
  const [step, updateStep] = useState(0)
  const [timestamp, updateTimestamp] = useState()
  const [title, updateTitle] = useState("")
  const [maxStep, updateMaxStep] = useState(0)
  const [running, updateRunning] = useState(false)
  const [playInterval, updatePlayInterval] = useState(undefined)


  const processStep = (currStep) => {
    const model = graph.getModel()
    const parent = graph.getDefaultParent();
    updateTimestamp(currStep?.timestamp)
    model.beginUpdate()
    for (const ent in currStep) {

      if(!currStep.hasOwnProperty(ent) || ent === 'timestamp') continue
      
      const cell = model.getCell(ent)
      const {x, y, width, height, value, style} = currStep[ent]
      const cleanValue = value ? value.match(/>(.*)</) : ''
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
      else{
        processStep(steps[step]);
      }
    } 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  useEffect(() => {
    if(details === undefined) {
      updateStep(0);
    }
    if(details !== undefined) {
      const container = document.getElementById('mxContainer')
      mx.mxEvent.disableContextMenu(container);
      updateMaxStep(steps.length)
      updateTitle(details?.window_name)
      
      graph = new mx.mxGraph(container)
      graph.setPanning(true);
      graph.setTooltips(true);
      // Custom tooltip for cells
      graph.getTooltipForCell = function(cell) {
        return `Position: (${cell.geometry.x}, ${cell.geometry.y})`
      }
      // prevent styles been overwritten
      container.setAttribute('style', `width:${details?.dimensions.width};height:${details?.dimensions.height}`)
    }
  }, [details, steps])
  
  useEffect(() => {
    if (!running) {
      clearInterval(playInterval);
      updatePlayInterval(undefined);
    } else if(playInterval === undefined) {
      updatePlayInterval(setInterval(() => updateStep(step => step + 1), 200))
    }
    return () => clearInterval(playInterval)
  }, [running, playInterval])

  console.log(details);

  return (
  <div id="Simulator">
      <h2>
        {title}
      </h2>
      <p>TimeStamp: {timestamp} • Step: {step}/{maxStep}</p>
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

      <div id="mxContainer" />
  </div>
  );
}

export default Simulator;