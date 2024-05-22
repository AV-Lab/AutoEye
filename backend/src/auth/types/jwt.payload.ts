export type JwtPayload = {
  jti: String;
  sub: String;
  username: String;
};

export type JwtPayloadWithRefreshToken = JwtPayload & { refreshToken: String };
