import { type Ref, ref } from 'vue';
export type Players = Player[];
export type Player = {
  id: number;
  name: PlayerName;
  points: number;
  roundPoints: number;
  tempInputPoints: number | null;
};
export type PlayerName = string | null;
