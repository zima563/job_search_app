import bcrypt from "bcrypt";

export const hash = ({ plaintext , salt = process.env.SALT_ROUND}={}) =>{
    const hashResult = bcrypt.hashSync(plaintext,Number(salt));
    return hashResult;
}

export const compare = ({plaintext,hashvalue}={}) =>{
    const match = bcrypt.compareSync(plaintext,hashvalue);
    return match
}