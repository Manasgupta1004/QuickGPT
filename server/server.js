import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './configs/db.js'
import userRouter from './routes/userRoute.js'
import chatRouter from './routes/chatRoute.js'
import aiRouter from './routes/aiuRoute.js'
import creditRouter from './routes/creditRoute.js'
import { stripeWebHooks } from './controllers/webHook.js'
const app = express()

await connectDB()
// stripe webhook
app.post('/api/stripe', express.raw({ type: 'application/json' }), stripeWebHooks)
app.use(express.json())

const PORT = process.env.PORT || 3000

app.use('/api/user', userRouter)
app.use('/api/chat', chatRouter)
app.use('/api/message', aiRouter)
app.use('/api/credit', creditRouter)

app.get('/', (req, res) => {
    res.send('server is live!')
})

app.listen(PORT, () => {
    console.log('server is running port:', PORT)
})