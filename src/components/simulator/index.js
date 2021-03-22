import { FaFastForward, FaFastBackward, FaStepForward, FaStepBackward, FaPlayCircle, FaStopCircle } from 'react-icons/fa'

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

function Simulator( { details, steps, user } ) {
  const [step, updateStep] = useState(-1)
  const [timestamp, updateTimestamp] = useState()
  const [title, updateTitle] = useState("")
  const [maxStep, updateMaxStep] = useState(0)
  const [running, updateRunning] = useState(false)
  const [playInterval, updatePlayInterval] = useState(undefined)

  useEffect(() => {
    updateStep(-1);
    document.getElementById('mxContainer').textContent = '';
    graph = undefined;
  }, [user])

  const processStep = (currStep) => {
    if (graph !== undefined){
      const model = graph?.getModel()
      const parent = graph?.getDefaultParent();
      updateTimestamp(currStep?.timestamp)
      model.beginUpdate()
  
      for (const ent in currStep) {
        if(step === 0){
          const objeto = Object.entries(currStep[ent]);
          const aux = objeto[0];

          if(aux[0] === 'timestamp') continue

          const {x, y, width, height, value, style} = aux[1];
          const cleanValue = value ? value.match(/>(.*)</) : ''

          graph.insertVertex(parent, aux[0], cleanValue ? cleanValue[1] : value, x, y, width, height, style?.startsWith('ellipse') ? "shape=" + style   : style)
        } else {

          if(!currStep.hasOwnProperty(ent) || ent === 'timestamp') continue
          var cell = model.getCell(ent)
          var {x, y, width, height, value, style} = currStep[ent]
          var cleanValue = value ? value.match(/>(.*)</) : ''
          
          if(ent === 'deleted') {
            const remove = model.getCell(currStep[ent][0]);
            remove.style = "display:none;"
          
          }
          
          if (cell) {
            // Entity already there, just update
            cell.geometry.x = x
            cell.geometry.y = y
            cell.geometry.width = width
            cell.geometry.height = height
            cell.value = cleanValue ? cleanValue[1] : value
            style?.startsWith('ellipse') ? cell.style = "shape=" + style : cell.style = style
          } else {
            graph.insertVertex(parent, ent, cleanValue ? cleanValue[1] : value, x, y, width, height, style?.startsWith('ellipse') ? "shape=" + style   : style)
          }
        }
      }
      model.endUpdate()
      graph.refresh()
    }
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
      updateStep(-1);
      document.getElementById('mxContainer').textContent = '';
      graph = undefined;
    }
    if(details !== undefined) {
      const container = document.getElementById('mxContainer')
      
      mx.mxEvent.disableContextMenu(container);
      updateMaxStep(steps.length)
      updateTitle(details?.window_name)
      
      if(graph === undefined) {
        graph = new mx.mxGraph(container)
        graph.setPanning(true);
        graph.setTooltips(true);
        // Custom tooltip for cells
        graph.getTooltipForCell = function(cell) {
          return `Position: (${cell.geometry.x}, ${cell.geometry.y})`
        }
      }
      // prevent styles been overwritten
      container.setAttribute('style', `width:${details?.dimensions.width}px;height:${details?.dimensions.height}px`)
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

  return (
  <div id="Simulator">
      <h2>
        {title}
      </h2>
      <p>TimeStamp: {timestamp} • Step: {step}/{maxStep}</p>
      <button 
        className="control"
        disabled={step-10 < 0}
        onClick={() => updateStep(step => step - 10)}
        >
        <FaFastBackward />
      </button>
      <button 
        className="control"
        disabled={step === 0 || step === -1}
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
        disabled={step === maxStep || maxStep === 0}
        onClick={() => updateStep(step => step + 1)}
        >
        <FaStepForward />
      </button>
      <button 
        className="control"
        disabled={step+10 > maxStep || maxStep === 0 || step === -1}
        onClick={() => updateStep(step => step + 10)}
        >
        <FaFastForward />
      </button>

      <div id="mxContainer" />
  </div>
  );
}

export default Simulator;