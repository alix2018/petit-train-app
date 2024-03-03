export type Players = Player[];
export type Player = { id: number; name: PlayerName; points: number; roundPoints?: number };
export type PlayerName = string | null;
