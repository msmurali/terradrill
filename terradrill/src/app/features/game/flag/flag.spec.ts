import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Flag } from './flag';

describe('Flag', () => {
  let component: Flag;
  let fixture: ComponentFixture<Flag>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Flag],
    }).compileComponents();

    fixture = TestBed.createComponent(Flag);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
