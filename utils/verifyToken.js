import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import Child from '../models/Child.js'
//custom middlewares

import { ApiResponse } from '../utils/ApiResponse.js';
import Enrollment from '../models/enrollment.js';
//1) TO VERIFY TOKEN
export const verifyToken = (req, res, next)=>{
    const token = req.cookies.accessToken
    if(!token){
        return res.status(401).json({status: "failed", success:"false", 
                         message: "You are not authorized"})
    }

    //if token exits then verifying it
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user)=>{
        if(err){
            return res.status(401).json({status: "failed", success:"false", 
                                         message: "Invalid Token"})
        }

        req.user = user
        next()
    })
}
export const verifyJWT = async (req, res, next) => {
    try {
     
        // Extract token from cookies or Authorization header
        const token =
            req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
  
        if (!token) {
            throw new ApiResponse(401, "Unauthorized request - No token provided");
        }
       
        // Verify the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        // Fetch the user from the database
     const { id, role } = decodedToken;
   

    let user;

    if (role =="user") {
      user = await User.findById(id).select("-password");
    } 
    else if (role =="child") {
        console.log("childdddddd")
      user = await Child.findById(id).select("-password");
    }
    else {
    
      user = await User.findById(id).select("-password");
    }
        if (!user) {
            throw new ApiResponse(401, "Unauthorized request - User not found");
        }

      
        req.user = user;
  
        next(); 
    } catch (error) {
     
        next(new ApiResponse(401, error?.message || "Unauthorized request"));
    }}


//2) TO VERIFY USER
export const verifyUser = (req, res, next)=>{

    verifyToken(req, res, next, ()=>{
        if(req.user.id === req.params.id || req.user.role === 'admin'){
            next()
        }else{
            return res.status(401).json({status: "failed", success:"false", 
                                         message: "You are not Authenticated"})
        }
    })

}


export const verifyAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        return next();
    } 
    return res.status(401).json({
        status: "failed",
        success: false,
        message: "You are not Authorized",
    });
};

export const checkEnrollment = async (req, res, next) => {
  try {

    const userId = req.user._id;
    const role = req.user.role;
    const { courseId } = req.params;

    // ✅ Admin can access without enrollment
    if (role === "admin") {
      return next();
    }

    // ✅ Check enrollment for normal users
    const enrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: "User not enrolled in this course",
      });
    }

    next();

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};