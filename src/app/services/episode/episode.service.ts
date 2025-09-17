import { Injectable } from '@angular/core';
import { Observable,  map, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Episode, EpisodeExtended, EpisodeSort } from '../../models/episode.model'
import { scaleLinear, scaleLog } from 'd3-scale';

@Injectable({
  providedIn: 'root'
})

export class EpisodesService {
  constructor(private httpClient: HttpClient) {}

  public fetchEpisodes(): Observable<EpisodeSort[]> {
    const dataPath = 'assets/db.json';

    return this.httpClient.get<Episode[]>(dataPath).pipe(
      map(episodes => {
        const maxLikes = Math.max(...episodes.map(e => parseInt(e.likes, 10)));
        const maxDescargas = Math.max(...episodes.map(e => this.parseDescargas(e.descargas)));
        const maxFecha = Math.max(...episodes.map(e => new Date(e.fecha).getTime()));
        const maxFechasubida = Math.max(...episodes.map(e => new Date(e.fechasubida).getTime()));
        const maxEpisodio = Math.max(...episodes.map(e => parseInt(e.episodio, 10)));

        const colorScaleLikes = scaleLinear<string>().domain([0, maxLikes]).range(['green', 'red']);
        const colorScaleDescargas = scaleLinear<string>().domain([0, maxDescargas]).range(['green', 'red']);
        const colorScaleFecha = scaleLinear<string>().domain([0, maxFecha]).range(['green', 'red']);
        const colorScaleFechasubida = scaleLinear<string>().domain([0, maxFechasubida]).range(['green', 'red']);

        const colorScaleEpisodio = scaleLinear<string>()
          .domain([1, maxEpisodio]) // Asegúrate de que el dominio comience en 1 y termine en el valor máximo
          .range(['green', 'red']); // De verde para el valor más bajo a rojo para el más alto
        
          return episodes.map(episode => this.convertToEpisodeSort(episode, colorScaleLikes, colorScaleDescargas, colorScaleFecha, colorScaleFechasubida, colorScaleEpisodio));      }),
      // tap(data => console.log(data))
    );
  }


  private convertToEpisodeSort(episode: Episode, colorScaleLikes: any, colorScaleDescargas: any, colorScaleFecha: any, colorScaleFechasubida: any, colorScaleEpisodio: any): EpisodeSort {    const likesNumber = parseInt(episode.likes, 10);
    const descargasNumber = this.parseDescargas(episode.descargas);
    const fechaTimestamp = new Date(episode.fecha).getTime();
    const fechasubidaTimestamp = new Date(episode.fechasubida).getTime();
    const episodioNumber = parseInt(episode.episodio, 10);
    
    return {
      ...episode,
      _fechasubida: this.createExtendedField(episode.fechasubida, fechasubidaTimestamp, colorScaleFechasubida(fechasubidaTimestamp)),
      _fecha: this.createExtendedField(episode.fecha, fechaTimestamp, colorScaleFecha(fechaTimestamp)),
      _descargas: this.createExtendedField(episode.descargas, descargasNumber, colorScaleDescargas(descargasNumber)),
      _likes: this.createExtendedField(episode.likes, likesNumber, colorScaleLikes(likesNumber)),
      _episodio: this.createExtendedField(episode.episodio, episodioNumber, colorScaleEpisodio(episodioNumber))
    };
  }


  private createExtendedField(value: string, number: any = null, color: string = 'grey'): EpisodeExtended {
    return { value, number, color };
  }

  private parseDescargas(descargas: string): number {
    if (descargas?.toLowerCase().endsWith('k')) {
      return parseFloat(descargas) * 1000;
    }
    return parseFloat(descargas);
  }
}