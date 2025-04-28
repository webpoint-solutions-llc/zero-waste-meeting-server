import { Test, TestingModule } from '@nestjs/testing';
import { GooglecalenderController } from './googlecalender.controller';
import { GooglecalenderService } from './googlecalender.service';

describe('GooglecalenderController', () => {
  let controller: GooglecalenderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GooglecalenderController],
      providers: [GooglecalenderService],
    }).compile();

    controller = module.get<GooglecalenderController>(GooglecalenderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
