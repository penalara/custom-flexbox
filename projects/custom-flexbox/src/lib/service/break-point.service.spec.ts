import { TestBed } from '@angular/core/testing';

import { BreakPointService } from './break-point.service';

describe('Test BreakPointService', () => {
    let service: BreakPointService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(BreakPointService);
    });

    it('BreakPointService debe instanciarse', () => {
        expect(service).toBeTruthy();
    });
});
