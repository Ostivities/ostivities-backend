import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/auth/schema/auth.schema';
import { DatabaseModule } from 'src/database/database.module';
import { Security, SecuritySchema } from './schema/security.schema';
import { SecurityController } from './security.controller';
import { securityProviders } from './security.provider';
import { SecurityService } from './security.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '24h' },
    }),
    MongooseModule.forFeature([
      { name: Security.name, schema: SecuritySchema },
      { name: User.name, schema: UserSchema },
    ]),
    DatabaseModule,
  ],
  providers: [SecurityService, Security, ...securityProviders],
  controllers: [SecurityController],
})
export class SecurityModule {}
