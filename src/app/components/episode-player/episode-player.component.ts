import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../services/player/player.service'
import { PlayableContent } from '../../models/playable.model'

@Component({
  selector: 'app-episode-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './episode-player.component.html',
  styleUrl: './episode-player.component.scss'
})
export class EpisodePlayerComponent implements OnInit {
  @ViewChild('audioPlayer') audioPlayerRef!: ElementRef<HTMLAudioElement>;

  currentContent: PlayableContent | null = null;
  isPlaying: boolean = false;
  currentTime: number = 0;

  constructor(private playerService: PlayerService) { }

  ngOnInit(): void {
    this.playerService.getState()
      .subscribe(state => {
        this.currentContent = state.content;
        this.isPlaying = state.isPlaying;
        this.currentTime = state.currentTime;
      
        const audioElement = this.audioPlayerRef?.nativeElement;
        if (audioElement) {
          // Si hay un nuevo episodio, actualiza la fuente y reproduce
          if (this.currentContent && audioElement.src !== this.currentContent.link) {
            audioElement.src = this.currentContent.link;
            audioElement.load(); // Cargar la nueva fuente
          }
      
          // Manejar play/pause según el estado
          if (this.isPlaying && audioElement.paused) {
            audioElement.play();
          } else if (!this.isPlaying && !audioElement.paused) {
            audioElement.pause();
          }
      
          // Actualizar tiempo si es necesario
          if (Math.abs(audioElement.currentTime - this.currentTime) > 1) {
            audioElement.currentTime = this.currentTime;
          }
        }
      });
  }
  
  onTimeUpdate(event: Event) {
    const audio = event.target as HTMLAudioElement;
    // Actualizar solo si la diferencia de tiempo es significativa
    if (Math.abs(audio.currentTime - this.currentTime) > 1) {
      this.playerService.performAction('seek', undefined, audio.currentTime);
    }
  }
  
  onAudioEnded() {
    this.playerService.performAction('stop');
  }

  playContent(content: PlayableContent) {
    this.playerService.performAction('play', content);
  }
}
