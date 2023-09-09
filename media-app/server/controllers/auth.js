import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import User from '../models/user.js';

process.on('uncaughtException', (err, origin) => {
    console.log(err);
});
export const Register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation,

        } = req.body;
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)
        })
        const savedUser = await newUser.save();
        res.status(201).json(savedUser)
    } catch (error) {
        res.status(500).json({ error: error.messge })
    }
}

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({email:email});
        if(!user){
            res.status(400).json({ msg: "User not found" })
        }
        const match = await bcrypt.compare(password,user.password);
        if(!match){
            res.status(400).json({ msg: "Invalid Credentials" })
        }
        const token = jwt.sign({id:user._id},process.env.SECRET_KEY)
        user.password=undefined;
        res.status(200).json({token,user})
    } catch (error) {
        res.status(500).json({ error: error.messge })
    }
}