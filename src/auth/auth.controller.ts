import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    // @UseGuards(LocalAuthGuard)
    @Post('/login')
    login(@Body() userDto: CreateUserDto) {       
        return this.authService.login(userDto)
    }

    // @Post('/registration')
    // registration(@Body() userDto: CreateUserDto) {
    //     return this.authService.registration()
    // }
}