import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { EpisodesGridComponent } from './components/episodes-grid/episodes-grid.component'
import { EpisodePlayerComponent } from './components/episode-player/episode-player.component'

@Component({
    selector: 'app-root',
    imports: [
    RouterOutlet,
    EpisodesGridComponent,
    EpisodePlayerComponent
],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'cattaneoGridApp';
}
