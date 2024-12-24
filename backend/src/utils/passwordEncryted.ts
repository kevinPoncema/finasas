import bcrypt from "bcrypt";

/**
 * Encripta una contraseña utilizando bcrypt.
 * @param password La contraseña a encriptar.
 * @param saltRounds El número de rondas de sal (por defecto, 10).
 * @returns El hash encriptado de la contraseña.
 */
export async function hashPassword(password: string, saltRounds: number = 10): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error:any) {
    throw new Error("Error al encriptar la contraseña: " + error.message);
  }
}

/**
 * Verifica si una contraseña coincide con su hash encriptado.
 * @param password La contraseña en texto plano.
 * @param hashedPassword El hash encriptado almacenado.
 * @returns `true` si la contraseña coincide, `false` en caso contrario.
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error:any) {
    throw new Error("Error al verificar la contraseña: " + error.message);
  }
}
