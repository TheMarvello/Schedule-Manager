import { hashPassword } from '../helpers/authHelper.js';
import userModel from '../models/users.js';

export const createEmployee = async(req, res) => {
    const { name, email, password, phone } = req.body;
    console.log(name, email, password, phone);

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


    try {
        //FIND USER IN THE USER MODEL
        const existingUser = await userModel.findOne({ email });
        //IF USER ALREADY EXISTS
        if (existingUser) {
            return res.status(200).send({
                success: true,
                message: 'Already registered!',
            })
        }
        //ESLE WE WILL ADD THE USER
        //HASHING THE PASSWORD USING BCRYPT
        const hashedPassword = await hashPassword(password);

        //SAVING THE USER IN THE USERMODEL DATABASE
        const user = await new userModel({ name, email, phone, password: hashedPassword }).save(); //key: value
        console.log(user)
        res.status(201).send({
            success: true,
            message: 'User Registered Successfully!!',
            user
        })

    } catch (error) {
        return res.status(500).json({ message: 'Server error!', error });
    }
};

export const editEmployee = async(req, res) => {
    const { id } = req.params;
    const { name, email, phone, role } = req.body;
    console.log(id, name, email, phone, role);

    try {
        const employee = await userModel.findById(id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found.' });
        }

        // Update employee details
        employee.name = name || employee.name;
        employee.email = email || employee.email;
        employee.phone = phone || employee.phone;
        employee.role = role || employee.role;

        await employee.save();
        return res.status(200).json({ message: 'Employee updated successfully.', employee });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};

export const deleteEmployee = async(req, res) => {
    const { id } = req.params;

    try {
        const employee = await userModel.findById(id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found.' });
        }

        await userModel.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Employee deleted successfully.' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};