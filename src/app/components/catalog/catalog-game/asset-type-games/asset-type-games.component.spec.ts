import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTypeGamesComponent } from './asset-type-games.component';

describe('AssetTypeGamesComponent', () => {
  let component: AssetTypeGamesComponent;
  let fixture: ComponentFixture<AssetTypeGamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetTypeGamesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssetTypeGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
