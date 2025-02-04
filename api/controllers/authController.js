import User from '../models/userModel.js'
import bcryptjs from 'bcryptjs'
import {errorHandler} from '../utils/error.js'
import jwt from 'jsonwebtoken'

export const signup = async (req,res, next) => {
  try {
    const {username, email, password} = req.body
    const hashedPassword = bcryptjs.hashSync(password, 10)
    const newUser = new User({username, email, password: hashedPassword})
    await newUser.save()
    res.status(200).json({message: 'user created successfully'})
  } catch (error) {
    next(error)
  }
}

export const signin = async (req,res, next) => {
  try {
    const {email, password} = req.body
    const validUser = await User.findOne({email})
    if (!validUser) {
      return next(errorHandler(401, 'User not found'))
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password)
    if (!validPassword) {
      return next(errorHandler(401, 'Wrong credentials'))
    }
    const { password: hashedPassword, ...rest} = validUser._doc
    const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET)
    const expiryDate = new Date(Date.now() + 3600000)
    res.cookie('access_token', token, {httpOnly: true, expires: expiryDate}).status(200).json(rest)
  } catch (error) {
    next(error)
  }
}