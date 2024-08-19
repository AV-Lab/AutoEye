import { SortEnum } from "@/services/api/types/sort-type";
import { Vehicle } from "@/services/api/types/vehicle";

export type VehicleFilterType = {
  name?: string;
};

export type VehicleSortType = {
  orderBy: keyof Vehicle;
  order: SortEnum;
};
