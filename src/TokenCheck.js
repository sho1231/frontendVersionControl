// import jwt from 'jsonwebtoken';
import { isExpired } from "react-jwt";
export const TokenCheck = () => {
    const Token = localStorage.getItem('token');
    // console.log("123",Token);
    // // console.log(Token);
    // console.log(231);
    // console.log("1231",isExpired(Token));
    if (Token && !isExpired(Token))
        return true;
    return false;
}