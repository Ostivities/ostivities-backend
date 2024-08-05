import { Test, TestingModule } from '@nestjs/testing';
import { SettleAccounts } from './settle_accounts';

describe('SettleAccounts', () => {
  let provider: SettleAccounts;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SettleAccounts],
    }).compile();

    provider = module.get<SettleAccounts>(SettleAccounts);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
