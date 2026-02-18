import jwt from 'jsonwebtoken'
export const generateToken = (user) => {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT_SECRET_KEY is not defined in environment variables");
  }
  
  return jwt.sign(
    {
      userId: user._id,
      hotdropId: user.hotdropId,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "15d" }
  );
};