export type Players = Player[];
export type Player = {
  id: string;
  name: PlayerName;
  points: number;
  roundPoints: number;
  tempInputPoints: number | null;
};
export type PlayerName = string | null;
