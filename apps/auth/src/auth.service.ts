import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject('USER_SERVICE') private readonly userService: ClientProxy, 
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.userService
        .send({ cmd: 'get_user_by_email' }, { email })
        .toPromise();

      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException('Error al validar el usuario');
    }
  }

  async login(user: any) {
    const payload = { id: user._id, email: user.email, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }

  async verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }
  async validateGoogleUser(data: {
    googleId: string;
    email: string;
    name: string;
    photo: string; // ⬅️ Agregado
  }) {
    const user = await lastValueFrom(
      this.userService.send({ cmd: 'find_or_create_google' }, data),
    );
    return user;
  }


  async handleGoogleCallback(code: string) {
    // 1. Intercambiamos el code por un access_token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: process.env.GOOGLE_WEB_CALLBACK_URL!,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();
    if (tokenData.error) {
      console.error('❌ Error al obtener access_token:', tokenData);
      throw new Error('Error al obtener access_token de Google');
    }

    const accessToken = tokenData.access_token;

    // 2. Obtenemos los datos del usuario
    const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const userInfo = await userInfoRes.json();

    if (!userInfo?.id || !userInfo?.email) {
      console.error('❌ Datos incompletos del usuario:', userInfo);
      throw new Error('Datos de usuario inválidos desde Google');
    }

    // 3. Registramos o encontramos el usuario en nuestra DB
    const user = await this.validateGoogleUser({
      googleId: userInfo.id,
      email: userInfo.email,
      name: userInfo.name || userInfo.email.split('@')[0],
      photo: userInfo.picture,
    });

    return user;
  }

  
  async generateToken(user: any) {
    const payload = { id: user._id || user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload);
  }
  
}
