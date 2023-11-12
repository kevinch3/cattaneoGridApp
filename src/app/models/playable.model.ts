export interface PlayableContent {
    id: string
    title: string
    link: string
}

export class PlayerState {
    content: PlayableContent | null = null;
    isPlaying: boolean = false;
    currentTime: number = 0;
}