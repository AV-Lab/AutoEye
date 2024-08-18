import { useGetChannelsService } from "@/services/api/services/channels";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { createQueryKeys } from "@/services/react-query/query-key-factory";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ChannelFilterType, ChannelSortType } from "../channel-filter-types"; // Define these types similarly to UserFilterType and UserSortType

export const channelsQueryKeys = createQueryKeys(["channels"], {
  list: () => ({
    key: [],
    sub: {
      by: ({
        sort,
        filter,
      }: {
        filter: ChannelFilterType | undefined;
        sort?: ChannelSortType | undefined;
      }) => ({
        key: [sort, filter],
      }),
    },
  }),
});

export const useChannelListQuery = ({
  sort,
  filter,
}: {
  filter?: ChannelFilterType | undefined;
  sort?: ChannelSortType | undefined;
} = {}) => {
  const fetch = useGetChannelsService();

  const query = useInfiniteQuery({
    queryKey: channelsQueryKeys.list().sub.by({ sort, filter }).key,
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
