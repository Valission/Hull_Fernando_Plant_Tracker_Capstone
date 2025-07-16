import express from 'express'
import cors from 'cors'

import 'dotenv/config'

import connectDb from './db.js'

import PlantInfo from './plantSchema.js'
import userLog from './trackerSchema.js'

import authMiddleware from './Middleware/authMiddleware.js'
import userRouter from './routes/authRoutes.js'
import uploadRouter from './routes/uploadPhoto.js'

const app = express()

const port = process.env.PORT

//middleware
app.use(cors())
app.use(express.json())
//Routes
app.use('/auth', userRouter)
app.use('upload', uploadRouter)

app.get('/planti', async (req, res) =>{
    try{
        const info = await PlantInfo.find()

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

app.post('/plant', authMiddleware, async (req, res) => {
    try{
        const newPlant = new userLog({
            //get fields from the trackerSchema
            ...req.body,
            //grabs the user ID from the token
            belongedTo: req.user
        })

        await newPlant.save()

        //return created plant
        res.status(201).json(newPlant)
    }
    catch(e){
        res.status(400).json({message: e.message})
    }
})

app.listen(port, () => {
    console.log(`Listening on port: ${port}`)
    connectDb()
})

