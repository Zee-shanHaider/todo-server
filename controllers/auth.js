const User = require('../model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator/check')


exports.postSignup = async (req,res,next)=>{
    console.log(req.body)
    const image = req.file;
    const errors = validationResult(req);
    console.log('validation errors',errors.array().length >0)
    if(errors.array().length > 0){
     return  res.status(400).send({msg:errors.array(), status:'danger',code:400})
    }
    try{   
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const image = req.file;
        console.log('image',image)
        const imageUrl = image.filename;
        const hashedPassword =await bcrypt.hash(password, 12)
       
            const user = new User({
                username: username,
                email: email,
                imageUrl: imageUrl,
                password: hashedPassword
        
            })
            const createdUser = await user.save()
            console.log( createdUser)
            if(createdUser){
                return res.status(200).send({status: 'ok'})
            }
    }
    
    catch(error){
        console.log(error)
    //   res.status(400).send({msg:error.message})
    }


}

exports.postLogin =async (req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    const user =await User.findOne({email: email});
    if(!user){
        const error = new Error('User does not exist');
        error.statusCode = 404;
        next(error)
    }
    let loadedUser = user;
    const doMatch = await bcrypt.compare(password, user.password)
        if(doMatch){
            const token = jwt.sign({
                email: loadedUser.email,
                userId:loadedUser._id.toString()
            },
            'thisIsTheSecretKeyPart',
            {
                expiresIn:'3600000'
            }
        )
            var url = req.protocol + '://' + req.get('host');
            const imageUrl = url+'/images/'+loadedUser.imageUrl;
            console.log('imageUrl',imageUrl)
            console.log('loadeduser', loadedUser)
            res.status(201).json({
                'result': 'User successfully loged in',
                token:token,
                user: loadedUser,
                userImage: imageUrl
            })
    }
        else{
           const error = new Error('Password does not match');
           error.statusCode = 400;
           next(error); 
        }
}

exports.logout = (req,res,next)=>{

    
    req.session.destroy(err => {
        if(err){
            console.log(err);
        } else {
            res.send('Session is destroyed')
        }
    })
}

exports.reload = async (req,res)=>{
    const token = req.get('Authorization');
    try{
        const decodedToken = jwt.verify(token, 'thisIsTheSecretKeyPart')
        const userId = decodedToken.userId;
        const user =await User.findById(userId);
        var url = req.protocol + '://' + req.get('host');
        const imageUrl = url+'/images/'+user.imageUrl;
        if(user)
        {
            res.status(200).send({message: 'User find', user: user, imageUrl: imageUrl})
        }
    }
    catch(err){
        res.status(400).send({error: err})
    }

  }
