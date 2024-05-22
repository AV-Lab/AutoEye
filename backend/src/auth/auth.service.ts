import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { isEmail } from 'class-validator';
import { UsersService } from 'src/users/users.service';
import { IsNull, Not, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { AuthInput } from './dto/auth.input';
import { Token, TokenType } from './entities/token.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    @InjectRepository(Token)
    private readonly tokensRepository: Repository<Token>,
  ) {}

  async authenticate(authInput: AuthInput) {
    const { username, password } = authInput;

    let findBy = 'username';
    if (isEmail(username)) findBy = 'email';

    const user = await this.usersService.findOneBy({ [findBy]: username });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordMatches = await bcrypt.compare(
      password.toString(),
      user.password.toString(),
    );

    if (!passwordMatches)
      throw new UnauthorizedException('Invalid credentials');

    const { accessToken, refreshToken } = await this.generateTokens(
      user.id,
      username,
    );

    const savedTokens = await this.saveTokens(user, accessToken, refreshToken);
    const refreshTokenExpiration = new Date(+(await savedTokens.rt).exp * 1000);

    return { user, accessToken, refreshToken, refreshTokenExpiration };
  }

  async generateTokens(sub: String, username: String) {
    const accessToken = await this.jwtService.signAsync(
      { jti: uuidv4(), sub, username },
      {
        secret: this.configService.get('security.jwt.access.secret'),
        expiresIn: this.configService.get('security.jwt.access.expiration'),
      },
    );
    const refreshToken = await this.jwtService.signAsync(
      { jti: uuidv4(), sub, username, accessToken },
      {
        secret: this.configService.get('security.jwt.refresh.secret'),
        expiresIn: this.configService.get('security.jwt.refresh.expiration'),
      },
    );

    return { accessToken, refreshToken };
  }

  async saveTokens(user: User, accessToken: String, refreshToken: String) {
    const batchRef = uuidv4();
    const at = this.saveToken(user, accessToken, TokenType.ACCESS, batchRef);
    const rt = this.saveToken(user, refreshToken, TokenType.REFRESH, batchRef);

    return { at, rt };
  }

  async saveToken(
    user: User,
    token: String,
    tokenType: TokenType,
    batchRef: String,
  ) {
    const decodedToken = this.jwtService.decode(token.toString());

    const tokenModel: Token = await this.tokensRepository.create({
      jti: decodedToken.jti,
      sub: user.id,
      username: decodedToken.username,
      iat: decodedToken.iat,
      exp: decodedToken.exp,
      tokenType,
      batchRef,
      user,
    });

    return await this.tokensRepository.save(tokenModel);
  }

  async checkTokenRevoked(tokenOrJti: String, decoded: Boolean) {
    let jti = tokenOrJti;

    if (!decoded) {
      const decodedToken = this.jwtService.decode(tokenOrJti.toString());
      jti = decodedToken.jti;
    }

    const revoked =
      (await this.tokensRepository.count({
        where: { jti, revokedAt: Not(IsNull()) },
      })) > 0;

    return revoked ? true : false;
  }
}
