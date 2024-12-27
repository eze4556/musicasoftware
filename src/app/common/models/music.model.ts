// src/app/common/models/music.model.ts
export interface Music {
  id: string;
  title: string;
  artist: string;
  genre: string;
  releaseDate: Date;
  audioUrls: string[];
}
