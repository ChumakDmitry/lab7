import { Injectable } from "@nestjs/common/decorators";
import { UsersService } from "src/users/users.service";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { JwtService } from "@nestjs/jwt";
import { HttpException, HttpStatus } from "@nestjs/common";
import *as bcrypt from 'bcryptjs';
import { User } from "src/users/users.models";
import { UnauthorizedException } from "@nestjs/common/exceptions";

@Injectable()
export class AuthService {

	constructor(private userService: UsersService,
							private jwtService: JwtService) {}

	async registration(userDto: CreateUserDto) {
		const candidate = await this.userService.getUserByEmail(userDto.email);
		if (candidate) {
			throw new HttpException('Пользователь с такой почтой уже существует', HttpStatus.BAD_REQUEST);
		}

		const hashPassword = await bcrypt.hash(userDto.password, 5);
		const user = await this.userService.createUser({...userDto, password: hashPassword});
		return this.generateToken(user);
	}

	async login(userDto: CreateUserDto) {
		const user = await this.validateUser(userDto);
		return this.generateToken(user);
	}

	private async generateToken(user: User) {
		const payload = {email: user.email, id: user.id}
		return {
			token: this.jwtService.sign(payload)
		}
	}

	private async validateUser(userDto: CreateUserDto) {
		const user = await this.userService.getUserByEmail(userDto.email);
		if (!user) {
			throw new UnauthorizedException({message: "Неверная почта"})
		}

		const passwordEquals = await bcrypt.compare(userDto.password, user.password);

		if(passwordEquals) {
			return user;
		}

		throw new UnauthorizedException({message: "Неверный пароль"});
	}
}