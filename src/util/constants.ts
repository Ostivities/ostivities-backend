import { ConfigService } from '@nestjs/config';

export const jwtConstants = {
  secret: (config: ConfigService): any => config.get('JWT_SECRET'),
};
