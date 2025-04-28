import { Test, TestingModule } from '@nestjs/testing';
import { GooglecalenderService } from './googlecalender.service';

describe('GooglecalenderService', () => {
  let service: GooglecalenderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GooglecalenderService],
    }).compile();

    service = module.get<GooglecalenderService>(GooglecalenderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
