
export interface Episode {
    titulo: string
    tracklist: string
    link: string
    likes: string
    descargas: string
    fecha: string
    episodio: string
    fechasubida: string
  }

  export interface EpisodeSort extends Episode {
    _fechasubida: EpisodeExtended
    _fecha: EpisodeExtended
    _descargas: EpisodeExtended
    _likes: EpisodeExtended
    [key: string]: EpisodeExtended | any; // Permite indexar con cualquier string
  }

  export interface EpisodeExtended {
    value: string
    number: number
    color: string
  }