import express from 'express'
import { simulation } from './parseReport'

const app: express.Application = express();

const cors = (req: express.Request, res: express.Response, next: Function) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
    //intercepts OPTIONS method (preflight requests)
    if ('OPTIONS' === req.method) {
        res.sendStatus(200)
    } else {
        next()
    }
}

app.use(cors)
app.get('/:n', (req, res) => {
    const idx: number = parseInt(req.params.n)
    if (idx > simulation.steps.length) {
        res.end(`Index out of range`)
    } else {
        res.json(simulation.steps[idx])
    }
})

app.get('/', (req, res) => {
    res.json(simulation.details)
})


app.listen(3005, function () {
    console.log(`App is listening on port 3005!`);
});