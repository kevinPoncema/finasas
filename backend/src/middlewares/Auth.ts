import { Request, Response,NextFunction } from "express";
import {JWTManager} from "@utils/JWTManager"
async function authMidleware(req:Request,res:Response,next:NextFunction) : Promise<void>
{
    const token = req.headers.authorization?.split(' ')[1]; // Extraer el token Bearer

    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }
  
    try {
      const decoded = JWTManager.decodeToken(token)
      console.log("decode",decoded)
      req.body.tokenData = decoded 
     //console.log(decoded)
      next();
    } catch (error) {
      return res.status(403).json({ message: 'Token inválido o expirado' });
    }
}

export default  authMidleware