export type PlayerName = string | null;

export type Player = {
  id: string;
  name: string;
  previousScore: number;
  roundPoints: number | null;
};

export type Players = Player[];
