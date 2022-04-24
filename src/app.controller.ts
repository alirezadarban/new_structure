import { Body, Controller, Get, Param, Post, UseGuards, Request } from "@nestjs/common";
import { AppService } from './app.service';
import { LocalAuthGuard } from "./auth/local-auth.guard";
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from "./auth/jwt-auth.guard";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
              private authService: AuthService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get(':key')
  async getKey(@Param('key') key: string): Promise<string> {
    return await this.appService.getKey(key)
  }

  @Post()
  async setKey(@Body('key') key: string, @Body('value') value: string): Promise<any> {
    return await this.appService.setKey(key, value);
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
