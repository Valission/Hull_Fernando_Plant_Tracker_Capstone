import express from 'express'
import cors from 'cors'

import 'dotenv/config'

import connectDb from './db.js'

import plantinfo from './plantSchema.js'

import authMiddleware from './Middleware/authMiddleware.js'
import userRouter from './routes/authRoutes.js'

const app = express()

const port = process.env.PORT

app.use(cors())
app.use('/auth', userRouter)

app.get('/planti', async (req, res) =>{
    try{
        const info = await plantinfo.find()

        res.status(200).json(info)
    }catch (e){
        console.log(e)
        res.status(400).json(e)
    }
   
})
/*proteced route that is only availiable once the user
logs in and used correct jwt token, authmiddleware 
checks for token before letting the route handler run*/

app.get('/private', authMiddleware, (req, res) =>{
    res.json({message: `Welcome ${req.user}`})
})

app.listen(port, () => {
    console.log(`Listening on port: ${port}`)
    connectDb()
})

