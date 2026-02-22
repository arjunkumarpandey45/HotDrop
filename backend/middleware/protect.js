import jwt from "jsonwebtoken";
import User from "../model/userModel.js";
import response from "../utils/responseHandler.js";

export const protect = async (req, res, next) => {
  try {
     console.log("🟡 PROTECT middleware entered");

    const token = req.cookies.auth_token;

    if (!token) {
      return response(res, 401, "Session expired, please login again");
    }

  
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

   
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return response(res, 404, "User not found with this session");
    }

  
    req.user = user;
    
    next(); 
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    
   
    const errorMsg = error.name === "TokenExpiredError" 
      ? "Session expired, login again" 
      : "Invalid authentication";
      
    return response(res, 401, errorMsg);
  }
};