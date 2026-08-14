import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './configs/db.js'
import userRouter from './routes/userRoute.js'
const app = express()
app.use(express.json())
await connectDB()
const PORT = process.env.PORT || 3000

app.use('/user', userRouter)

app.get('/', (req, res) => {
    res.send('server is live!')
})

app.listen(PORT, () => {
    console.log('server is running port:', PORT)
})