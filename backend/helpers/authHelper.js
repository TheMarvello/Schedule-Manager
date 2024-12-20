import bcryptjs from 'bcryptjs';

export const hashPassword = async(password) => {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcryptjs.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.log(error);
    }
};

export const comparePassword = async(password, hashedPassword) => {
    return await bcryptjs.compare(password, hashedPassword);
};