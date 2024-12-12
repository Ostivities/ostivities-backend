import {
  ExecutionContext,
  NotFoundException,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export type JwtPayload = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  accountType?: string;
  createdAt?: string;
};

export type JwtPayloadWithRt = JwtPayload & { refreshToken: string };

export const GetCurrentUser = createParamDecorator(
  (data: keyof JwtPayloadWithRt | undefined, context: ExecutionContext) => {
    const request = context?.switchToHttp()?.getRequest();

    const jwt = new JwtService();

    if (request.headers && request.headers.authorization) {
      const authorization = request.headers.authorization.split(' ')[1];

      if (!authorization) {
        throw new NotFoundException('You are not logged in');
      }

      let decoded: any;
      try {
        decoded = jwt.verify(authorization, {
          secret: process.env.JWT_SECRET,
          ignoreExpiration: false,
        });

        console.log(decoded, 'decoded');
        console.log(data, 'decoded data');

        return data ? decoded?._doc : decoded;
      } catch (error) {
        if (
          error?.name?.toLowerCase().includes('token') ||
          error?.message?.toLowerCase().includes('expired')
        ) {
          throw new UnauthorizedException('Session Expired!');
        }
      }
    } else {
      throw new NotFoundException('Access Token not present');
    }
  },
);
