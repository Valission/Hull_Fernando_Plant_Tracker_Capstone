import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../userSchema'

const router = express.Router()

router.post('/register', async(req, res) =>{
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