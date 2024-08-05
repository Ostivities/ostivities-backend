import { Module } from '@nestjs/common';
import { SettleAccountsService } from './settle_accounts.service';
import { SettleAccountsController } from './settle_accounts.controller';
import { SettleAccounts } from './settle_accounts';

@Module({
  providers: [SettleAccountsService, SettleAccounts],
  controllers: [SettleAccountsController]
})
export class SettleAccountsModule {}
