export type Players = Player[];
export type Player = {
  id: string;
  name: PlayerName;
  previousScore: number;
  roundScore: number;
  roundPoints: number | null;
} | null;
export type PlayerName = string | null;
