import { ConfigService } from '@nestjs/config';
import {
  Args,
  Context,
  GqlExecutionContext,
  Mutation,
  Resolver,
} from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { IsPublic } from './decorators/is-public.decorator';
import { AuthInput } from './dto/auth.input';
import { AuthPayload } from './dto/auth.payload';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @IsPublic()
  @Mutation(() => AuthPayload)
  async authenticate(
    @Context() ctx: GqlExecutionContext,
    @Args('authInput') authInput: AuthInput,
  ) {
    const { user, accessToken, refreshToken, refreshTokenExpiration } =
      await this.authService.authenticate(authInput);

    const payload = new AuthPayload();
    payload.accessToken = accessToken;
    payload.user = user;

    const exp = await this.configService.get('security.jwt.refresh.expiration');

    // @ts-ignore
    ctx.res.cookie('token', refreshToken, {
      sameSite: 'strict',
      httpOnly: true,
      secure: true,
      expires: refreshTokenExpiration,
    });

    return payload;
  }
}
