import { Request, Response } from 'express';
import { registerSchema, loginSchema } from './auth.schema';
import { registerUser, loginUser, refreshAccessToken, revokeRefreshToken } from './auth.service';
import { z } from 'zod';
import { env } from '../../config/env';
import { mailService } from '../mail/mail.service';
import { db } from '../../db/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const refreshSchema = z.object({
  refreshToken: z.string().optional(),
});

const confirmUpdateSchema = z.object({
  token: z.string()
});

// Configuración de cookies compartida para consistencia
const getCookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: true, // Requerido para sameSite: 'none'
  sameSite: 'none' as const,
  domain: env.NODE_ENV === 'production' ? '.monilab.com.mx' : undefined,
  maxAge,
});

function generateResetCode() {
  // Genera un código numérico de 6 dígitos (ej. 482910)
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function register(req: Request, res: Response) {
  try {
    const data = registerSchema.parse(req.body);
    const result = await registerUser(data);

    //  Disparar correo de bienvenida (Sin await para no retrasar la respuesta al cliente)
    mailService.sendWelcomeEmail(data.email, data.nombre).catch(err => {
      console.error('Error enviando correo de bienvenida:', err);
    });
    
    res.cookie('refreshToken', result.refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));
    res.status(201).json({ accessToken: result.accessToken, user: result.user });
  } catch (err: any) {
    if (err.code === 'UNIQUE constraint failed: usuarios.email') {
      return res.status(409).json({ error: 'Email already registered' });
    }
    res.status(400).json({ error: err.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const data = loginSchema.parse(req.body);
    const result = await loginUser(data.nombre, data.password);
    
    res.cookie('refreshToken', result.refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));
    res.json({ accessToken: result.accessToken, user: result.user });
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
}

export async function refresh(req: Request, res: Response) {
  try {
    const body = req.body || {};
    const data = refreshSchema.parse(body);
    const token = data.refreshToken || req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({ error: 'No hay sesión activa' });
    }

    const result = await refreshAccessToken(token);
    res.json(result);
  } catch (err: any) {
    res.status(401).json({ error: 'Sesión inválida' });
  }
}

/**
 * POST /auth/logout
 * Revoca el refresh token y limpia la cookie
 */
export async function logout(req: Request, res: Response) {
  try {
    const body = req.body || {};
    const data = refreshSchema.parse(body);
    const token = data.refreshToken || req.cookies?.refreshToken;

    // Si hay un token, intentamos revocarlo en la base de datos
    if (token) {
      await revokeRefreshToken(token).catch(() => {
        // Ignoramos errores si el token ya expiró o no existe en la BD
      });
    }

    // Limpiamos la cookie usando las mismas opciones que al crearla (maxAge: 0)
    res.clearCookie('refreshToken', getCookieOptions(0));
    
    // Devolvemos 200 porque, haya habido token o no, la sesión ahora está cerrada
    res.json({ message: 'Sesión cerrada correctamente' });
  } catch (err: any) {
    // Solo enviamos error si algo realmente falló en el servidor
    res.status(500).json({ error: 'Error al procesar el cierre de sesión' });
  }
}

export async function requestProfileUpdate(req: Request, res: Response) {
  try {
    const { id_usuario, nuevo_nombre, nueva_password } = req.body;
    
    const result = await db.execute({
      sql: 'SELECT email, nombre FROM usuarios WHERE id = ?',
      args: [id_usuario]
    });

    const user = result.rows[0];
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const nombreActual = String(user.nombre);
    const tieneNuevaPass = !!nueva_password;

    const token = jwt.sign(
      { 
        id_usuario, 
        nuevo_nombre, 
        nueva_password, 
        nombre_actual: nombreActual,
        cambia_pass: tieneNuevaPass,
        type: 'PROFILE_UPDATE' 
      },
      env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Enviamos todos los datos al servicio de correo
    await mailService.sendConfirmUpdateEmail(
      String(user.email), 
      nombreActual, 
      nuevo_nombre, 
      token, 
      tieneNuevaPass
    );
    
    res.json({ message: 'Correo de confirmación enviado' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// Paso 1 PARA RECUPERAR CONTRASEÑA: Solicitar código
export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email, nombre } = req.body;
    const result = await db.execute({
      sql: 'SELECT id FROM usuarios WHERE email = ? AND nombre = ?',
      args: [email, nombre]
    });

    if (result.rows.length === 0) return res.status(404).json({ error: 'Datos incorrectos' });

    const code = generateResetCode();
    
    // Este token guarda el código temporalmente (expira en 5 minutos)
    const token = jwt.sign(
      { id_usuario: String(result.rows[0].id), code, type: 'PASSWORD_RESET_REQ' },
      env.JWT_SECRET,
      { expiresIn: '5m' }
    );

    // Enviamos el código por correo
    await mailService.sendResetPasswordEmail(email, nombre, code);
    
    // Le enviamos el token al frontend para que lo devuelva con el código que escriba el usuario
    res.json({ message: 'Código enviado al correo', token });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

// Paso 2 PARA RECUPERAR CONTRASEÑA: Verificar el código
export async function verifyResetCode(req: Request, res: Response) {
  try {
    const { token, code } = req.body;
    const decoded = jwt.verify(token, env.JWT_SECRET) as any;

    if (decoded.type !== 'PASSWORD_RESET_REQ' || decoded.code !== code) {
      return res.status(400).json({ error: 'Código incorrecto.' });
    }

    // Si el código es correcto, generamos un token de autorización para cambiar la pass (expira en 10 min)
    const allowToken = jwt.sign(
      { id_usuario: decoded.id_usuario, type: 'PASSWORD_RESET_ALLOW' },
      env.JWT_SECRET,
      { expiresIn: '10m' }
    );

    res.json({ message: 'Código verificado', allowToken });
  } catch (err) {
    res.status(400).json({ error: 'El código ha expirado. Solicita uno nuevo.' });
  }
}

// Paso 3 PARA RECUPERAR CONTRASEÑA: Establecer nueva contraseña
export async function resetPassword(req: Request, res: Response) {
  try {
    const { allowToken, newPassword } = req.body;
    const decoded = jwt.verify(allowToken, env.JWT_SECRET) as any;

    if (decoded.type !== 'PASSWORD_RESET_ALLOW') {
      return res.status(403).json({ error: 'Acceso denegado.' });
    }

    // Validación extra en backend por seguridad
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!regex.test(newPassword)) {
      return res.status(400).json({ error: 'La contraseña no cumple con los requisitos de seguridad.' });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    
    await db.execute({
      sql: 'UPDATE usuarios SET password = ? WHERE id = ?',
      args: [hash, decoded.id_usuario]
    });

    res.json({ message: 'Contraseña actualizada correctamente.' });
  } catch (err) {
    res.status(400).json({ error: 'La sesión ha expirado. Repite el proceso.' });
  }
}

export async function confirmAction(req: Request, res: Response) {
  try {
    const { token } = confirmUpdateSchema.parse(req.body);
    const decoded = jwt.verify(token, env.JWT_SECRET) as any;

    if (decoded.type === 'PROFILE_UPDATE') {
      if (decoded.nueva_password) {
        const hash = await bcrypt.hash(decoded.nueva_password, 10);
        await db.execute({
          sql: 'UPDATE usuarios SET nombre = ?, password = ? WHERE id = ?',
          args: [decoded.nuevo_nombre, hash, decoded.id_usuario]
        });
      } else {
        await db.execute({
          sql: 'UPDATE usuarios SET nombre = ? WHERE id = ?',
          args: [decoded.nuevo_nombre, decoded.id_usuario]
        });
      }
      return res.json({ message: 'Perfil actualizado correctamente' });
    }
    
    res.json({ message: 'Acción verificada' });
  } catch (err) {
    res.status(400).json({ error: 'El enlace ha expirado o es inválido.' });
  }
}