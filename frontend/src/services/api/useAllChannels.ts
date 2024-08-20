// services/api/hooks/useAllChannels.ts
import { useEffect, useState } from "react";
import { Channel } from "@/services/api/types/channel";
import { useChannelListQuery } from "@/app/[language]/admin-panel/channels/queries/channels-queries";

export function useAllChannels() {
  const [channels, setChannels] = useState<Array<{ id: Channel["id"]; name: Channel["name"] }>>([]);
  const { data, fetchNextPage, hasNextPage } = useChannelListQuery();

  useEffect(() => {
    if (data) {
      // Concatenate all pages of data and map to only include id and name
      const allChannels = data.pages.flatMap(page =>
        page?.data?.map(channel => ({
          id: channel.id,
          name: channel.name,
        })) || []
      );
      setChannels(allChannels);

      // Fetch next page if there are more pages
      if (hasNextPage) {
        fetchNextPage();
      }
    }
  }, [data, fetchNextPage, hasNextPage]);

  return { channels };
}
