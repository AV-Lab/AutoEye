import { SortEnum } from "@/services/api/types/sort-type";
import { Channel } from "@/services/api/types/channel";

export type ChannelFilterType = {
  name?: string;
};

export type ChannelSortType = {
  orderBy: keyof Channel;
  order: SortEnum;
};
