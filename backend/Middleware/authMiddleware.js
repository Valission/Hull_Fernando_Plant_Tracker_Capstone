import jwt from "jsonwebtoken"

function authMiddleware(req, res, next){
    //get token from Authorizaation
    const token = req.headers.authorization
    if(!token){
        return res.status(401).json({message: 'No token provided'})
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded.id
        next()
    }
    catch(e) {
        res.status(401).json({message: 'invalid token'})
    }
}

export default authMiddleware