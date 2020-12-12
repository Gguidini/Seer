import fs from 'fs'

export const simulation = {
    details: {stepCount: 0},
    steps: [{}]
}

fs.readFile('./assets/report.txt', (err, data) => {
    if (err) {
        console.log(`Didn't read the file correctly!!!`)
    }
    const lines = data.toString('utf8').split('\n')
    if (lines[lines.length - 1].length === 0) lines.pop()
    const entMap: any = {}
    const steps = lines.slice(1).map(l => JSON.parse(l))
    for (const p in steps[0]) {
        if(!steps[0].hasOwnProperty(p) || p === 'timestamp') continue
        entMap[p] = steps[0][p]
    }
    const finalSteps = [steps[0]]
    for (const step of steps.slice(1)) {
        for (const p in step) {
            if(!step.hasOwnProperty(p) || p === 'timestamp') continue
            entMap[p] = step[p]

        }
        finalSteps.push({...entMap, timestamp: step.timestamp})
    }
    simulation.steps = finalSteps
    simulation.details = JSON.parse(lines[0])
    simulation.details.stepCount = finalSteps.length
})