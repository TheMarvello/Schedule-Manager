import express from 'express';
import {
    registerController,
    loginController,
    forgotPasswordController,
    verifyOtpAndResetPassword,
    resendOtp
} from "../controllers/authController.js";


//router object
const router = express.Router();

//ROUTE DEFINITIONS
//routing
// REGISTER || METHOD POST
router.post("/register", registerController);

//LOGIN || METHOD POST
router.post("/login", loginController);

//Forgot Password || METHOD POST
router.post("/forgot-password", forgotPasswordController);

//Forgot Password || METHOD POST
router.post("/reset-password", verifyOtpAndResetPassword);

//Forgot Password || METHOD POST
router.post("/resend-otp", resendOtp);

// //test routes || METHOD GET
// router.get("/test", requireSignIn, isAdmin, testController);

// //protected user route auth
// router.get("/user-auth", requireSignIn, (req, res) => {
//     res.status(200).send({ ok: true });
// });

// //protected admin route auth
// router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
//     res.status(200).send({ ok: true });
// });
export default router;