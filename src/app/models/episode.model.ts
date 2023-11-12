
export interface Episode {
    titulo: string
    descripcion: string
    link: string
    likes: string
    descargas: string
    fecha: string
    episodio: string
    fechasubida: string
  }

  export interface EpisodeSort extends Episode {
    _fechasubida: number
    _fecha: number
    _descargas: number
    _likes: number
  }