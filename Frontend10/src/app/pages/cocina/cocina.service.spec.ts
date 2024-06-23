import { TestBed } from '@angular/core/testing';

import { CocinaService } from './cocina.service';

describe('CocinaService', () => {
  let service: CocinaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CocinaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
