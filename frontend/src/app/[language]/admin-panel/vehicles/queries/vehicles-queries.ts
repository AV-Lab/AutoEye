import { useGetVehiclesService } from "@/services/api/services/vehicles";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { createQueryKeys } from "@/services/react-query/query-key-factory";
import { useInfiniteQuery } from "@tanstack/react-query";
import { VehicleFilterType, VehicleSortType } from "../vehicle-filter-types"; // Define these types similarly to ChannelFilterType and ChannelSortType

export const vehiclesQueryKeys = createQueryKeys(["vehicles"], {
  list: () => ({
    key: [],
    sub: {
      by: ({
        sort,
        filter,
      }: {
        filter: VehicleFilterType | undefined;
        sort?: VehicleSortType | undefined;
      }) => ({
        key: [sort, filter],
      }),
    },
  }),
});

export const useVehicleListQuery = ({
  sort,
  filter,
}: {
  filter?: VehicleFilterType | undefined;
  sort?: VehicleSortType | undefined;
} = {}) => {
  const fetch = useGetVehiclesService();

  const query = useInfiniteQuery({
    queryKey: vehiclesQueryKeys.list().sub.by({ sort, filter }).key,
    initialPageParam: 1,
    queryFn: async ({ pageParam, signal }) => {
      const { status, data } = await fetch(
        {
          page: pageParam,
          limit: 10,
          filters: filter,
          sort: sort ? [sort] : undefined,
        },
        {
          signal,
        }
      );

      if (status === HTTP_CODES_ENUM.OK) {
        return {
          data: data.data,
          nextPage: data.hasNextPage ? pageParam + 1 : undefined,
        };
      }
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.nextPage;
    },
    gcTime: 0,
  });

  return query;
};
