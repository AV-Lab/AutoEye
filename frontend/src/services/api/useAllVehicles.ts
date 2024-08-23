import { useEffect, useState } from "react";
import { Vehicle } from "./types/vehicle";
import { useVehicleListQuery } from "@/app/[language]/admin-panel/vehicles/queries/vehicles-queries";

export function useAllVehicles() {
  const [vehicles, setVehicles] = useState<Array<{ id: Vehicle["id"]; name: Vehicle["name"] }>>([]);
  const { data, fetchNextPage, hasNextPage } = useVehicleListQuery();

  useEffect(() => {
    if (data) {
      // Concatenate all pages of data and map to only include id and name
      const allVehicles = data.pages.flatMap(page =>
        page?.data?.map(vehicle => ({
          id: vehicle.id,
          name: vehicle.name,
        })) || []
      );
      setVehicles(allVehicles);

      // Fetch next page if there are more pages
      if (hasNextPage) {
        fetchNextPage();
      }
    }
  }, [data, fetchNextPage, hasNextPage]);

  return { vehicles };
}
