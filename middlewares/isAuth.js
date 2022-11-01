const jwt = require('jsonwebtoken');
module.exports = (req,res,next)=>{
    // const authHeader= req.get('Authorization');
    // if(!authHeader){
    //     const error = new Error('Not authenticated!')
    //     return res.status(401).json({message: 'Not Authenticated!'})
    // }
    const token = req.get('Authorization');

    let decodedToken;
    try{
        decodedToken = jwt.verify(token, process.env.SecretKey)
    }
    catch(err){
        return res.status(401).json({message: err})
    }
    if(!decodedToken){
        return res.status(401).json({message: 'Not Authenticated!'})
    }
    req.userId = decodedToken.userId;
    next()

}