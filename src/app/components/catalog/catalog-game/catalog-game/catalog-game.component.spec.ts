import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogGameComponent } from './catalog-game.component';

describe('CatalogGameComponent', () => {
  let component: CatalogGameComponent;
  let fixture: ComponentFixture<CatalogGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogGameComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CatalogGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
