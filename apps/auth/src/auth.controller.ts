import { Controller, Post, Get, Body, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const user = await this.authService.validateUser(
        body.email,
        body.password,
      );
      const { access_token } = await this.authService.login(user);

      res.cookie('token', access_token, {
        httpOnly: true,
        secure: false, // ✅ asegurate de que sea false en desarrollo
        sameSite: 'lax', // ✅ para que funcione en desarrollo local
        maxAge: 15 * 24 * 60 * 60 * 1000,
      });

      return { message: 'Login exitoso', user };
    } catch (error) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
  }

  @Get('me')
  async getProfile(@Req() req: Request) {
    const token = req.cookies?.token;
    if (!token) {
      throw new UnauthorizedException(
        'No autenticado (Token no encontrado en cookies)',
      );
    }

    try {
      const decoded = await this.authService.verifyToken(token);
      console.log('Decoded token:', decoded); // Verifica el contenido del token
      return { id: decoded.id, email: decoded.email, role: decoded.role };
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('token');
    return res.json({ message: 'Logout exitoso' });
  }

  // 🔵 GOOGLE MOBILE
  @UseGuards(AuthGuard('google'))
  @Get('google')
  async googleMobileInit() {
    // Passport redirige automáticamente a Google
  }

  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
  async googleMobileCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as any;
    const token = await this.authService.generateToken(user);
    const name = encodeURIComponent(user.name);
    const userId = user._id || user.id;
    res.redirect(
      `exp://192.168.0.6:8081?token=${token}&name=${name}&user_id=${userId}`,
    );
  }

  // 🟢 GOOGLE WEB
  @UseGuards(AuthGuard('google-web'))
  @Get('google/web')
  async googleWebInit() {
    // Passport redirige automáticamente a Google
  }

  @UseGuards(AuthGuard('google-web'))
  @Get('google/web/callback')
  async googleWebCallback(@Req() req: Request, @Res() res: Response) {
    try {
      const user = req.user as any;
      const access_token = await this.authService.generateToken(user);
      const name = encodeURIComponent(user.name);
      res.cookie('token', access_token, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 15 * 24 * 60 * 60 * 1000,
      });
      res.redirect(`http://localhost:5005/`);
    } catch (error) {
      console.error('Error en Google Web callback:', error);
      res.redirect(`http://localhost:5005/?error=authentication_failed`);
    }
  }
}