import { Channel } from "./channel";

export type Vehicle = {
  id: number | string;
  name: string;
  channel?: Channel;
  createdAt: string;
  updatedAt: string;
};
