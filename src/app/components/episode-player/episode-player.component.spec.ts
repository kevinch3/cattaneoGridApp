import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpisodePlayerComponent } from './episode-player.component';

describe('EpisodePlayerComponent', () => {
  let component: EpisodePlayerComponent;
  let fixture: ComponentFixture<EpisodePlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpisodePlayerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EpisodePlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
