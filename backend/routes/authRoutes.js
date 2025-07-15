import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../userSchema.js'

const userRouter = express.Router()

userRouter.post('/register', async(req, res) =>{
    try{
        //get username and password from request body
        const {username, password} = req.body

        //checks if username exists and gives error if it does
        const existingUser = await User.findOne({username})
        if (existingUser) {
            return res.status(400).json({message: 'Username already exists'})
        }
        //hashes the password
        const hashedPassword = await bcrypt.hash(password, 10) 
        //creates a new User using a the username and new hashed password
        const newUser = new User({username, password: hashedPassword})
       //add newuser to the database lets the user know it went through
        await newUser.save()
        res.status(201).json({message: 'User Created'})
    } catch(e){
        res.status(500).json({message: e.message})
    }
})

userRouter.post('/login', async(req, res) =>{
    try{
        // get username and password from request body
        const {username, password} = req.body
        //look up the user by username in the database
        const user = await User.findOne({username})
        //if user doesn't exist return and error
        if(!user){
            return res.status(400).json({message: 'User not found'})
        }
        // compares given password to hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password)
        if(!passwordMatch){
            return res.status(400).json({message: "Invalid password"})
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
            expiresIn: '1d'
        })
        //send token back to client
        res.status(200).json({token})
    }catch(e){
        res.status(500).json({message: e.message})
    }
})

export default userRouter