import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import * as d3 from 'd3-scale';
import { Episode, EpisodeSort } from '../../models/episode.model'

@Injectable({
  providedIn: 'root'
})
export class EpisodesService {


  constructor(private httpClient: HttpClient) {}


  public fetchEpisodes(): Observable<Episode[]> {
    const dataPath = 'assets/db.json'

    return this.httpClient.get<Episode[]>(dataPath)
  }
  
}