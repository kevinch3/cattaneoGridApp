import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { scaleLinear } from 'd3-scale';
import { map, tap } from 'rxjs'
import { EpisodePlayerComponent } from '../episode-player/episode-player.component'
import { PlayerService } from '../../services/player/player.service'
import { Episode } from '../../models/episode.model'
import { PlayableContent } from '../../models/playable.model'

const dataPath = 'assets/db.json'

@Component({
  selector: 'app-episodes-grid',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    EpisodePlayerComponent
  ],
  templateUrl: './episodes-grid.component.html',
  styleUrl: './episodes-grid.component.scss'
})
export class EpisodesGridComponent implements OnInit {
  episodes: Episode[] = [];
  colorScale: any;
  selectedIndex: number | null = null;
  sortBy: keyof Episode = 'episodio'; // valor por defecto
  maxValues: { [key: string]: number } = {}; // Almacena los valores máximos

  constructor(
    private httpClient: HttpClient,
    private playerService: PlayerService
  ) {
    // Definir la escala de colores
    this.colorScale = scaleLinear<string>()
                      .domain([0, 50, 100]) // Rango de "likes"
                      .range(['red', 'yellow', 'green']); // Colores correspondientes
  }

  ngOnInit(): void {
    this.httpClient.get<Episode[]>(dataPath)
      .pipe(
        tap(episodes => {
          // Calcula los valores máximos para los campos relevantes
          // Calcula los valores máximos para los campos relevantes
          this.maxValues['likes'] = Math.max(...episodes.map(e => parseInt(e.likes)));
          this.maxValues['descargas'] = Math.max(...episodes.map(e => parseInt(e.descargas)));
          // Agrega aquí el cálculo para otros campos si es necesario
        }),
        map(episodes => this.sortEpisodes(episodes, this.sortBy))
      )
      .subscribe({
        next: (data) => {
          this.episodes = data
        }
      })
  }

  getColor(episode: Episode): string {
    const value = episode[this.sortBy];
    if (!value) return 'transparent'; // Si no hay valor, devuelve transparente
  
    const valueInt = this.sortBy === 'likes' || this.sortBy === 'descargas' ? parseInt(value) : 0; // Solo convierte a entero si es likes o descargas
    if (isNaN(valueInt)) return 'transparent'; // Si no es un número, devuelve transparente
  
    const maxValue = this.maxValues[this.sortBy] || 100; // Usa 100 como fallback
    const normalizedValue = (valueInt / maxValue) * 100;
  
    return this.colorScale(normalizedValue);
  }
  

  onSortChange(target: any): void {
    this.sortBy = target.value;
    this.fetchEpisodes(); // Refetch and sort the episodes
  }  

  sortEpisodes(episodes: Episode[], sortBy: keyof Episode): Episode[] {
    return episodes.sort((a, b) => {
      if (sortBy === 'likes' || sortBy === 'descargas') {
        // Asumiendo que likes y descargas son numéricos y almacenados como strings
        return parseInt(a[sortBy]) - parseInt(b[sortBy]);
      } else if (sortBy === 'fecha' || sortBy === 'fechasubida') {
        // Ordena las fechas como strings; considera parsearlas si son fechas reales
        return a[sortBy].localeCompare(b[sortBy]);
      } else {
        // Ordena alfabéticamente para el resto de los campos
        return a[sortBy]?.localeCompare(b[sortBy]);
      }
    });
  }

  fetchEpisodes(): void {
    this.httpClient.get<Episode[]>(dataPath)
      .pipe(
        map(episodes => this.sortEpisodes(episodes, this.sortBy as keyof Episode))
      )
      .subscribe(episodes => {
        this.episodes = episodes;
      });
  }


  onEpisodeClick(index: number) {
    this.selectedIndex = this.selectedIndex === index ? null : index; // Esto permite alternar la fila al hacer clic

    const episode = this.episodes[index]; // Asegúrate de tener acceso a la lista de episodios
    this.playContent({ title: episode.titulo, link: episode.link, id: episode.episodio });
  }

  playContent(content: PlayableContent) {
    this.playerService.performAction('play', content);
  }
  
  tracklistWithBreaks(tracklist: string): string {
    return tracklist.replace(/\n/g, '<br>');
  }
}
