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
    @Res() res: Response,
  ) {
    try {
      const user = await this.authService.validateUser(
        body.email,
        body.password,
      );
      const { access_token } = await this.authService.login(user);

      res.cookie('token', access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 días
      });

      return res.json({ message: 'Login exitoso' });
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

  @UseGuards(AuthGuard('google'))
  @Get('google')
  async googleAuth() {
    /* Passport redirige a Google automáticamente */
  }

  @UseGuards(AuthGuard('google'))
  @Get('google/redirect')
  async googleAuthRedirect(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    // req.user viene del strategy
    const { access_token } = await this.authService.login(req.user);

    res.cookie('token', access_token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });

    // Redirige a tu frontend
    res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173');
  }
}
