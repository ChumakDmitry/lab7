import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
    controllers: [AuthController],
    imports: [
        UsersModule,
        JwtModule.register({
            secret: process.env.PRIVATE_KEY || "SECRET",
            signOptions: {
                expiresIn: '60s'
            }
        }),
        PassportModule
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy],
})

export class AuthModule {}
