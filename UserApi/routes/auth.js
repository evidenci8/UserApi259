const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require ('jsonwebtoken');
const User = require('../models/User');


router.post('/register', async(req, res)=>{
    const {username, email, password} = req.body;

    try{
        let user= await User.findOne({where: {email}});
        if(user){
            return res.status(400).json({message: 'Email already exists'});
        }

       const salt = await bcrypt.genSalt(10); 
       const hashedPassword = await bcrypt.hash(password, salt);


        user = await User.create({
            username,
            email,
            password:hashedPassword   
        })

        const payload = {
            user: {
                id:user.id
        }
        }

        jwt.sign(payload, 'secret',{expiresIn: 300}, (erro, token)=>{
            if(erro) return res.status(400).json({message: erro});
            return res.json({token})
        })


    }catch(error){
        console.error(error.message)
        res.status(500).send('error al registar')

    }
   
    });

    router.post('/login', async(req, res)=>{
        const {email, password} = req.body;

    try{
        let user= await User.findOne({where: {email}});
        if(!user){
            return res.status(400).json({message: 'Usuario no encontrado'});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: 'Contraseña incorrecta'});
        }

        const payload = {
            user: {
                id:user.id
        }
        }

        jwt.sign(payload, 'secret',{expiresIn: 300}, (erro, token)=>{
            if(erro) return res.status(400).json({message: erro});
            return res.json({token})
        })

    }catch(error){
        console.error(error.message)
        res.status(500).send('error en el servidor')
    }

}); 

module.exports = router;
