import { Request, Response,NextFunction } from "express";
import {JWTManager} from "@utils/JWTManager"
async function authMidleware(req:Request,res:Response,next:NextFunction) : Promise<void>
{
    const token = req.headers.authorization?.split(' ')[1]; // Extraer el token Bearer

    if (!token) {
      res.status(401).json({ message: 'Token no proporcionado' });
      return
    }
  
    try {
      const decoded = JWTManager.decodeToken(token)
      req.body.tokenData = decoded 
     //console.log(decoded)
      next();
    } catch (error) {
      res.status(403).json({ message: 'Token inválido o expirado' });
      return
    }
}

export default  authMidleware