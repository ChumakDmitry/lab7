import { Injectable } from "@nestjs/common/decorators";
import { UsersService } from "src/users/users.service";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {

	constructor(private userService: UsersService,
							private jwtService: JwtService
	) {}

	async validateUser(dto: CreateUserDto): Promise<any> {
		console.log(1);
		
		const user = await this.userService.getUserByEmail(dto.email);
		if (user && user.password === dto.password) {
				const { password, ...result } = user;
				return result;
		}

		return null;
	}

	async login(dto: CreateUserDto) {
		const payload = {dto};
		return { 
				accessToken: this.jwtService.sign(payload), 
		};
	}
}