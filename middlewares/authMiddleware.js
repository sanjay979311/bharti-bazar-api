// import jwt from "jsonwebtoken";

// export const authMiddleware = (req, res, next) => {
//     try {
//         const token = req.cookies.accessToken;

//         if (!token) {
//             return res.status(401).json({ error: "Please Login First" });
//         }

//        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET );

//         req.user = {
//             id: decoded.id,
//             role: decoded.role
//         };

//         next();
//     } catch (error) {
//         return res.status(403).json({ error: "Invalid or expired token" });
//     }
// };


import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};