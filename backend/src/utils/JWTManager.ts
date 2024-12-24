import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

export class JWTManager {
  private static secretKey =process.env.TOKENT_SECRET_KEY; // Cambia esto por una clave segura
  private static expiresIn = '1h'; // Cambia esto según el tiempo de expiración deseado

  /**
   * Crea un token JWT basado en el payload proporcionado.
   * @param payload Objeto con los datos a incluir en el token.
   * @returns Token JWT como cadena.
   */

  public static createToken(payload: object): string {
    try {
      const token = jwt.sign(payload, this.secretKey, { expiresIn: this.expiresIn });
      return token;
    } catch (error:any) {
      throw new Error(`Error al crear el token: ${error.message}`);
    }
  }

  /**
   * Decodifica un token JWT y devuelve el objeto contenido en él.
   * @param token Token JWT a decodificar.
   * @returns Objeto contenido en el token.
   */
  public static decodeToken(token: string): object {
    try {
      const decoded = jwt.verify(token, this.secretKey);
      return decoded as object;
    } catch (error:any) {
      throw new Error(`Error al decodificar el token: ${error.message}`);
    }
  }
}
