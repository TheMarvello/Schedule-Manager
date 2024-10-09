import { hashPassword, comparePassword } from "../helpers/authHelper.js";
import userModel from "../models/users.js";
import JWT from "jsonwebtoken";
import crypto from 'crypto';
import nodemailer from 'nodemailer';


//CALLBACK REGISTERCONTROLLER FUNCTION FOR REGISTER OR SIGNUP POST METHOD
export const registerController = async(req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        //VALIDATIONS
        if (!name) {
            return res.send({ message: "Name is required!" })
        }
        if (!email) {
            return res.send({ message: "Email is required!" })
        }
        if (!password) {
            return res.send({ message: "Password is required" })
        }
        if (!phone) {
            return res.send({ message: "Phone No. is required!" })
        }
        if (password && password.length < 6) {
            return res.send({ message: "Password should be atleast 6 characters long!" })
        }
        //FIND USER IN THE USER MODEL
        const existingUser = await userModel.findOne({ email });
        //IF USER ALREADY EXISTS
        if (existingUser) {
            return res.status(200).send({
                success: true,
                message: 'Already registered, Please Login!',
            })
        }
        //ESLE WE WILL ADD THE USER
        //HASHING THE PASSWORD USING BCRYPT
        const hashedPassword = await hashPassword(password);

        //SAVING THE USER IN THE USERMODEL DATABASE
        const user = await new userModel({ name, email, phone, password: hashedPassword }).save(); //key: value

        res.status(201).send({
            success: true,
            message: 'User Registered Successfully!!',
            user
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Registration!",
            error
        });
    }
};


//CALLBACK LOGINCONTROLLER FUNCTION FOR SIGNIN POST METHOD
export const loginController = async(req, res) => {
    try {
        const { email, password } = req.body;

        //VALIDATING EMAIL AND PASSWORD
        if (!email) {
            return res.status(404).send({
                success: false,
                message: 'Email is Required'
            })
        }
        if (!password) {
            return res.status(404).send({
                success: false,
                message: 'Password is Required'
            })
        }


        //CHECKING USER
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(200).send({
                success: false,
                message: "Email is not registered"
            })
        }
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(200).send({
                success: false,
                message: "Invalid Password"
            })
        }

        //TOKEN
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.status(200).send({
            success: true,
            message: "Login Successful",
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
            },
            token,
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in login!',
            error
        })
    }
};

//CALLBACK FUNCTION FORGOTPASSWORDCONTROLLER FOR FORGOTPASSWORD POST REQUEST
export const forgotPasswordController = async(req, res) => {
    try {
        const { email } = req.body;
        console.log(email);
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a random OTP
        const otp = crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
        const otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

        // Save OTP and expiration to user's record
        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        // Send email with OTP
        const transporter = nodemailer.createTransport({
            service: 'Gmail', // or another SMTP provider
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'OTP sent to your email.' });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Something went wrong!",
            error
        })
    }
}

import bcryptjs from 'bcryptjs';

// POST /verify-otp: Verify OTP and reset password
export const verifyOtpAndResetPassword = async(req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if OTP is correct and not expired
        if (user.otp !== otp || Date.now() > user.otpExpires) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Hash the new password
        const hashedPassword = await hashPassword(newPassword);

        // Update the user's password and clear the OTP fields
        user.password = hashedPassword;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password successfully reset' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// POST /resend-otp: Resend OTP if requested by the user
export const resendOtp = async(req, res) => {
    const { email } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a new OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000;

        // Save new OTP and expiration
        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        // Send email with new OTP
        const transporter = nodemailer.createTransport({
            service: 'Gmail', // or another SMTP provider
            auth: {
                user: 'schedulemanagerhr@gmail.com',
                pass: 'iwhl wzvd ayox kogp'
            }
        });

        const mailOptions = {
            from: 'schedulemanagerhr@gmail.com',
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}`
        };


        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'OTP resent to your email.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};