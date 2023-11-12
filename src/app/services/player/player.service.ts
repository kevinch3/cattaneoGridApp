import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'
import { PlayableContent, PlayerState } from '../../models/playable.model'



@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private state = new BehaviorSubject<PlayerState>(new PlayerState());

  constructor() { }

  performAction(action: 'play' | 'pause' | 'stop' | 'seek', content?: PlayableContent, time?: number) {
    const currentState = this.state.value;
  
    switch (action) {
      case 'play':
        if (content) {
          // Si se proporciona contenido, reproduce y actualiza el estado
          this.state.next({ content: content, isPlaying: true, currentTime: 0 });
        }
        break;
      case 'pause':
        // Actualiza el estado a pausa
        this.state.next({ ...currentState, isPlaying: false });
        break;
      case 'stop':
        // Detiene y reinicia el tiempo
        this.state.next({ ...currentState, isPlaying: false, currentTime: 0 });
        break;
      case 'seek':
        if (typeof time === 'number') {
          // Cambia el tiempo de reproducción actual
          this.state.next({ ...currentState, currentTime: time });
        }
        break;
    }
  }

  // Observables para suscribirse
  getState() {
    return this.state.asObservable();
  }
}