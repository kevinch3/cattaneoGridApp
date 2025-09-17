import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EpisodePlayerComponent } from './components/episode-player/episode-player.component'

@Component({
    selector: 'app-root',
    imports: [
    RouterOutlet,
    EpisodePlayerComponent
],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'cattaneoGridApp';
}
