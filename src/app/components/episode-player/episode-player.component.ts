import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'

import { PlayerService } from '../../services/player/player.service'
import { PlayableContent } from '../../models/playable.model'
import { MatProgressBarModule } from '@angular/material/progress-bar'

@Component({
    selector: 'app-episode-player',
    imports: [MatProgressBarModule],
    templateUrl: './episode-player.component.html',
    styleUrl: './episode-player.component.scss'
})
export class EpisodePlayerComponent implements OnInit {
  @ViewChild('audioPlayer') audioPlayerRef!: ElementRef<HTMLAudioElement>
  currentContent: PlayableContent | null = null;
  isPlaying: boolean = false;
  currentTime: number = 0;
  duration: number = 0;
  volume: number = 1; // Default volume
  progress: number = 0;
  constructor(private playerService: PlayerService) { }

  ngOnInit(): void {
    this.playerService.getState()
      .subscribe(state => {
        this.currentContent = state.content
        this.isPlaying = state.isPlaying
        this.currentTime = state.currentTime

        const audioElement = this.audioPlayerRef?.nativeElement
        if (audioElement) {
          // Si hay un nuevo episodio, actualiza la fuente y reproduce
          if (this.currentContent && audioElement.src !== this.currentContent.link) {
            audioElement.src = this.currentContent.link
            audioElement.load() // Cargar la nueva fuente
          }

          // Manejar play/pause según el estado
          if (this.isPlaying && audioElement.paused) {
            audioElement.play()
          } else if (!this.isPlaying && !audioElement.paused) {
            audioElement.pause()
          }

          // Actualizar tiempo si es necesario
          if (Math.abs(audioElement.currentTime - this.currentTime) > 1) {
            audioElement.currentTime = this.currentTime
          }
        }
      })
  }

  onPlayerReady(event: Event) {
    const audio = event.target as HTMLAudioElement
    this.duration = audio.duration
  }

  onVolumeChange(newVolume: number) {
    const audioElement = this.audioPlayerRef.nativeElement
    audioElement.volume = newVolume
  }

  onTimeUpdate(event: Event) {
    const audio = event.target as HTMLAudioElement
    this.progress = (audio.currentTime / audio.duration) * 100
    // Actualizar solo si la diferencia de tiempo es significativa
    if (Math.abs(audio.currentTime - this.currentTime) > 1) {
      this.playerService.performAction('seek', undefined, audio.currentTime)
    }
  }

  public onAudioEnded() {
    this.playerService.performAction('stop')
  }

  public playContent(content: PlayableContent) {
    this.playerService.performAction('play', content)
  }

  public stopAudio() {
    const audioElement = this.audioPlayerRef.nativeElement
    audioElement.pause()
    audioElement.currentTime = 0
  }

  public seekAudio(event: MouseEvent) {
    const progressBar = event.currentTarget as HTMLElement;
    const clickX = event.offsetX;
    const totalWidth = progressBar.clientWidth;
    const clickRatio = clickX / totalWidth;
    const audioElement = this.audioPlayerRef.nativeElement;
    const newTime = clickRatio * audioElement.duration;

    audioElement.currentTime = newTime;
  }

}
