import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject('USER_SERVICE') private readonly userService: ClientProxy, // 🔥 Inyectamos RabbitMQ
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
  }) {
    const user = await lastValueFrom(
      this.userService.send({ cmd: 'find_or_create_google' }, data),
    );

    return user;
  }
  async handleGoogleCallback(query: any) {
    // validás el código, obtenés datos desde Google y encontrás o creás el usuario
    return this.validateGoogleUser({
      googleId: query.code, // adaptá según qué datos Google te devuelva
      email: 'ejemplo@correo.com',
      name: 'Usuario',
    });
  }
  
  async generateToken(user: any) {
    const payload = { id: user._id || user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload);
  }
  
}
