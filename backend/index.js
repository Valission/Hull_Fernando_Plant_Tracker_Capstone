import express from 'express'
import cors from 'cors'

import 'dotenv/config'

import connectDb from './db.js'

import plantinfo from './plantSchema.js'

const app = express()

const port = process.env.PORT

app.use(cors())

app.get('/planti', async (req, res) =>{
    try{
        const info = await plantinfo.find()

        res.status(200).json(info)
    }catch (e){
        console.log(e)
        res.status(400).json(e)
    }
   
})

app.listen(port, () => {
    console.log(`Listening on port: ${port}`)
    connectDb()
})

