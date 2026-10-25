// import express from 'express';
// import { register, login,me, logout, changePassword, updateStudentPassword } from '../controllers/authControllers.js'
// import { authMiddleware } from '../middlewares/authMiddleware.js';
// import { roleMiddleware } from '../middlewares/roleMiddleware.js';

// const router = express.Router();

// // GET /api/


// // POST /api/create
// router.post("/register", register);


// router.post("/login", login);
// router.get("/me", authMiddleware, me);
// // router.post("/change-password", authMiddleware, roleMiddleware(['admin']), changePassword);
// router.post("/change-password", authMiddleware, changePassword);
// router.post("/update-customer-password", authMiddleware, roleMiddleware(['admin']), updateStudentPassword);
// router.get("/logout", logout);


// export default router;



import express from 'express';
import { register, login, me, logout, refresh } from '../controllers/authControllers.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout); // Always use POST for logout to prevent CSRF
router.post("/refresh", refresh); // Standard is POST, though GET is common

router.get("/me", authMiddleware, me);

export default router;