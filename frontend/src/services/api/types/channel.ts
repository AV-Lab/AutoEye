export type Channel = {
  id: number | string;
  name: string;
  vehicles?: string;
  vehiclesCount: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};
