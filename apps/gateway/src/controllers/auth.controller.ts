import { Controller, Post, Get, Req, Res, Body } from '@nestjs/common';
import { MessagingService } from 'libs/messaging';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthGatewayController {
  constructor(private readonly messagingService: MessagingService) { }

  @Post('login')
  async login(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    const response = await this.messagingService.sendMessage(
      'auth',
      { cmd: 'auth_login' },
      body,
    );

    // Seteás la cookie localmente en el Gateway
    res.cookie('token', response.access_token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });

    return { message: 'Login exitoso', user: response.user };
  }

  @Get('me')
  async me(@Req() req: Request) {
    const token = req.cookies?.token;
    console.log('🔑 TOKEN en /auth/me:', token);
    return this.messagingService.sendMessage(
      'auth',
      { cmd: 'auth_me' },
      { token },
    );
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('token');
    return res.json({ message: 'Logout exitoso' });
  }

  // 🟢 GOOGLE WEB
  @Get('google/web')
  async googleWebInit(@Res() res: Response) {
    const result = await this.messagingService.sendMessage(
      'auth',
      { cmd: 'google_web_init' },
      {},
    );

    // Redireccionás desde el Gateway (no desde el microservicio)
    return res.redirect(result.redirectUrl);
  }


  @Get('google/web/callback')
  async googleWebCallback(@Req() req: Request, @Res() res: Response) {
    const { code, state } = req.query;

    const result = await this.messagingService.sendMessage(
      'auth',
      { cmd: 'google_web_callback' },
      { code, state },
    );

    const { token, name, userId } = result;

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });

    return res.redirect(`http://localhost:5005/`);
  }




  @Get('google')
  async googleMobileInit(@Res() res: Response) {
    const result = await this.messagingService.sendMessage(
      'auth',
      { cmd: 'google_mobile_init' },
      {},
    );

    return res.redirect(result.redirectUrl);
  }

  @Get('google/callback')
  async googleMobileCallback(@Req() req: Request, @Res() res: Response) {
    const { code, state } = req.query;

    const result = await this.messagingService.sendMessage(
      'auth',
      { cmd: 'google_mobile_callback' },
      { code, state },
    );

    return res.redirect(result.redirectUrl);
  }
}