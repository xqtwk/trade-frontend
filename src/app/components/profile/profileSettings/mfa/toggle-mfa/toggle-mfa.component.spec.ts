import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleMfaComponent } from './toggle-mfa.component';

describe('ToggleMfaComponent', () => {
  let component: ToggleMfaComponent;
  let fixture: ComponentFixture<ToggleMfaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleMfaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ToggleMfaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
