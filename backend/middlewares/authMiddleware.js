import jwt from 'jsonwebtoken';
import user from "../models/uesrModel.js";
import asyncHandler from './asyncHandler.js';

const authenticate = asyncHandler(async (req, res, next) => {
    let token;

    // read jwt from the 'jwt' cookie

    token = req.cookies.jwt;

    if(token){
        
        try {

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await user.findById(decoded.userId).select("-password");
            next();

        } catch (error) {
            res.Status(401).send("Not authorized, token failed")
           
            
        }

    }else{
        res.Status(401).send("Not authorised, no token");
       

    }
   
});

// cheak for the admin 

const authorizeAdmin = (req, res, next) => {
    if(req.user && req.user.isAdmin) {
       return next();
    }else {
       return res.send(401).send("Not authorised as an admin");
    }
}

export  {authenticate, authorizeAdmin};