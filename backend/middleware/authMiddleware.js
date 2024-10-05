const catchAsyncError = require("../utils/catchAsyncError");
require("dotenv").config();
const authMiddleware = catchAsyncError(async (req, res, next) => {
    const { authorization } = req.headers;
    
    if (!authorization || !authorization.startsWith("Bearer")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token required"
      });
    }
    
    const token = authorization.split(" ")[1];
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route"
      });
    }
  });

module.exports=authMiddleware;