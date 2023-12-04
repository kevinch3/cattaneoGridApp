import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { scaleLinear } from 'd3-scale'
import { Observable, Subject, Subscription, map, startWith, tap } from 'rxjs'
import { EpisodePlayerComponent } from '../episode-player/episode-player.component'
import { PlayerService } from '../../services/player/player.service'
import { Episode, EpisodeSort } from '../../models/episode.model'
import { PlayableContent } from '../../models/playable.model'
import { EpisodesService } from '../../services/episode/episode.service'

const dataPath = 'assets/db.json'

@Component({
  selector: 'app-episodes-grid',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    EpisodePlayerComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './episodes-grid.component.html',
  styleUrl: './episodes-grid.component.scss'
})
export class EpisodesGridComponent implements OnInit {
  public selectedIndex: number | null = null;
  public episodes: EpisodeSort[] = [];
  selectedSortField: string = '_likes'; // Campo de ordenación seleccionado por defecto

  constructor(
    private playerService: PlayerService,
    private episodesService: EpisodesService
  ) { }

  ngOnInit(): void {
    this.episodesService.fetchEpisodes()
      .subscribe({
        next: (data: EpisodeSort[]) => { // Asegúrate de que sea EpisodeSort[]
          this.episodes = data;
        },
        error: (error) => {
          console.error('Error fetching episodes:', error);
        }
      });
  }

public onSortChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedSortField = selectElement.value;
    console.log('change', this.selectedSortField);
  }
  
  public onEpisodeClick(index: number) {
    this.selectedIndex = this.selectedIndex === index ? null : index // Esto permite alternar la fila al hacer clic

    const episode = this.episodes[index] // Asegúrate de tener acceso a la lista de episodios
    this.playContent({ title: episode.titulo, link: episode.link, id: episode.episodio })
  }

  public playContent(content: PlayableContent) {
    this.playerService.performAction('play', content)
  }

  public tracklistWithBreaks(tracklist: string): string {
    return tracklist.replace(/\n/g, '<br>')
  }
}
