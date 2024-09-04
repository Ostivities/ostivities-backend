import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/auth/schema/auth.schema';
import { Revoked, RevokedSchema } from 'src/auth/schema/revoked.schema';
import { DatabaseModule } from 'src/database/database.module';
import {
  SettlementAccount,
  SettlementAccountSchema,
} from './schema/settlement.schema';
import { SettleAccountsController } from './settle_accounts.controller';
import { settlementProviders } from './settle_accounts.provider';
import { SettleAccountsService } from './settle_accounts.service';

@Module({
  providers: [SettleAccountsService, SettlementAccount, ...settlementProviders],
  controllers: [SettleAccountsController],
  imports: [
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '24h' },
    }),
    MongooseModule.forFeature([
      { name: SettlementAccount.name, schema: SettlementAccountSchema },
      { name: User.name, schema: UserSchema },
      { name: Revoked.name, schema: RevokedSchema },
    ]),
    DatabaseModule,
  ],
})
export class SettleAccountsModule {}
