import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpisodesGridComponent } from './episodes-grid.component';

describe('EpisodesGridComponent', () => {
  let component: EpisodesGridComponent;
  let fixture: ComponentFixture<EpisodesGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpisodesGridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EpisodesGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
