"use client";

import { RoleEnum } from "@/services/api/types/role";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { useTranslation } from "@/services/i18n/client";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {
  PropsWithChildren,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  useChannelListQuery,
  channelsQueryKeys,
} from "./queries/channels-queries";
import { TableVirtuoso } from "react-virtuoso";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import LinearProgress from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import TableComponents from "@/components/table/table-components";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import { Channel } from "@/services/api/types/channel";
import Link from "@/components/link";
import useConfirmDialog from "@/components/confirm-dialog/use-confirm-dialog";
import { useDeleteChannelService } from "@/services/api/services/channels";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-of-objects";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import ChannelFilter from "./channel-filter";
import { useRouter, useSearchParams } from "next/navigation";
import TableSortLabel from "@mui/material/TableSortLabel";
import { ChannelFilterType, ChannelSortType } from "./channel-filter-types";
import { SortEnum } from "@/services/api/types/sort-type";

type ChannelsKeys = keyof Channel;

const TableCellLoadingContainer = styled(TableCell)(() => ({
  padding: 0,
}));

function TableSortCellWrapper(
  props: PropsWithChildren<{
    width?: number;
    orderBy: ChannelsKeys;
    order: SortEnum;
    column: ChannelsKeys;
    handleRequestSort: (
      event: React.MouseEvent<unknown>,
      property: ChannelsKeys
    ) => void;
  }>
) {
  return (
    <TableCell
      style={{ width: props.width }}
      sortDirection={props.orderBy === props.column ? props.order : false}
    >
      <TableSortLabel
        active={props.orderBy === props.column}
        direction={props.orderBy === props.column ? props.order : SortEnum.ASC}
        onClick={(event) => props.handleRequestSort(event, props.column)}
      >
        {props.children}
      </TableSortLabel>
    </TableCell>
  );
}

function Actions({ channel }: { channel: Channel }) {
  const [open, setOpen] = useState(false);
  const { confirmDialog } = useConfirmDialog();
  const fetchChannelDelete = useDeleteChannelService();
  const queryClient = useQueryClient();
  const anchorRef = useRef<HTMLDivElement>(null);
  const { t: tChannels } = useTranslation("admin-panel-channels");

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  const handleDelete = async () => {
    const isConfirmed = await confirmDialog({
      title: tChannels("admin-panel-channels:confirm.delete.title"),
      message: tChannels("admin-panel-channels:confirm.delete.message"),
    });

    if (isConfirmed) {
      setOpen(false);

      const searchParams = new URLSearchParams(window.location.search);
      const searchParamsFilter = searchParams.get("filter");
      const searchParamsSort = searchParams.get("sort");

      let filter: ChannelFilterType | undefined = undefined;
      let sort: ChannelSortType | undefined = {
        order: SortEnum.DESC,
        orderBy: "id",
      };

      if (searchParamsFilter) {
        filter = JSON.parse(searchParamsFilter);
      }

      if (searchParamsSort) {
        sort = JSON.parse(searchParamsSort);
      }

      const previousData = queryClient.getQueryData<
        InfiniteData<{ nextPage: number; data: Channel[] }>
      >(channelsQueryKeys.list().sub.by({ sort, filter }).key);

      await queryClient.cancelQueries({
        queryKey: channelsQueryKeys.list().key,
      });

      const newData = {
        ...previousData,
        pages: previousData?.pages.map((page) => ({
          ...page,
          data: page?.data.filter((item) => item.id !== channel.id),
        })),
      };

      queryClient.setQueryData(
        channelsQueryKeys.list().sub.by({ sort, filter }).key,
        newData
      );

      await fetchChannelDelete({
        id: channel.id,
      });
    }
  };

  const mainButton = (
    <Button
      size="small"
      variant="contained"
      LinkComponent={Link}
      href={`/admin-panel/channels/edit/${channel.id}`}
    >
      {tChannels("admin-panel-channels:actions.edit")}
    </Button>
  );

  return (
    <>
      <ButtonGroup
        variant="contained"
        ref={anchorRef}
        aria-label="split button"
        size="small"
      >
        {mainButton}

        <Button
          size="small"
          aria-controls={open ? "split-button-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  <MenuItem
                    sx={{
                      bgcolor: "error.main",
                      "&:hover": {
                        bgcolor: "error.light",
                      },
                    }}
                    onClick={handleDelete}
                  >
                    {tChannels("admin-panel-channels:actions.delete")}
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}

function Channels() {
  const { t: tChannels } = useTranslation("admin-panel-channels");
  const searchParams = useSearchParams();
  const router = useRouter();
  const [{ order, orderBy }, setSort] = useState<{
    order: SortEnum;
    orderBy: ChannelsKeys;
  }>(() => {
    const searchParamsSort = searchParams.get("sort");
    if (searchParamsSort) {
      return JSON.parse(searchParamsSort);
    }
    return { order: SortEnum.DESC, orderBy: "id" };
  });

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: ChannelsKeys
  ) => {
    const isAsc = orderBy === property && order === SortEnum.ASC;
    const searchParams = new URLSearchParams(window.location.search);
    const newOrder = isAsc ? SortEnum.DESC : SortEnum.ASC;
    const newOrderBy = property;
    searchParams.set(
      "sort",
      JSON.stringify({ order: newOrder, orderBy: newOrderBy })
    );
    setSort({
      order: newOrder,
      orderBy: newOrderBy,
    });
    router.push(window.location.pathname + "?" + searchParams.toString());
  };

  const filter = useMemo(() => {
    const searchParamsFilter = searchParams.get("filter");
    if (searchParamsFilter) {
      return JSON.parse(searchParamsFilter) as ChannelFilterType;
    }

    return undefined;
  }, [searchParams]);

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useChannelListQuery({ filter, sort: { order, orderBy } });

  const handleScroll = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const result = useMemo(() => {
    const result =
      (data?.pages.flatMap((page) => page?.data) as Channel[]) ??
      ([] as Channel[]);
    return removeDuplicatesFromArrayObjects(result, "id");
  }, [data]);

  return (
    <Container maxWidth="md">
      <Grid container spacing={3} pt={3}>
        <Grid container item spacing={3} xs={12}>
          <Grid item xs>
            <Typography variant="h3">
              {tChannels("admin-panel-channels:title")}
            </Typography>
          </Grid>
          <Grid container item xs="auto" wrap="nowrap" spacing={2}>
            {/* <Grid item xs="auto">
              <ChannelFilter />
            </Grid> */}
            <Grid item xs="auto">
              <Button
                variant="contained"
                LinkComponent={Link}
                href="/admin-panel/channels/create"
                color="success"
              >
                {tChannels("admin-panel-channels:actions.create")}
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} mb={2}>
          <TableVirtuoso
            style={{ height: 500 }}
            data={result}
            components={TableComponents}
            endReached={handleScroll}
            overscan={20}
            fixedHeaderContent={() => (
              <>
                <TableRow>
                  <TableCell style={{ width: 50 }}></TableCell>
                  {/* <TableSortCellWrapper
                    width={100}
                    orderBy={orderBy}
                    order={order}
                    column="id"
                    handleRequestSort={handleRequestSort}
                  >
                    {tChannels("admin-panel-channels:table.id")}
                  </TableSortCellWrapper> */}
                  <TableCell style={{ width: 200 }}>
                    {tChannels("admin-panel-channels:table.column2")}
                  </TableCell>
                  <TableSortCellWrapper
                    orderBy={orderBy}
                    order={order}
                    column="createdAt"
                    handleRequestSort={handleRequestSort}
                  >
                    {tChannels("admin-panel-channels:table.column3")}
                  </TableSortCellWrapper>
                  <TableSortCellWrapper
                    orderBy={orderBy}
                    order={order}
                    column="updatedAt"
                    handleRequestSort={handleRequestSort}
                  >
                    {tChannels("admin-panel-channels:table.column4")}
                  </TableSortCellWrapper>
                  <TableCell style={{ width: 130 }}></TableCell>
                </TableRow>
                {isFetchingNextPage && (
                  <TableRow>
                    <TableCellLoadingContainer colSpan={6}>
                      <LinearProgress />
                    </TableCellLoadingContainer>
                  </TableRow>
                )}
              </>
            )}
            itemContent={(index, channel) => (
              <>
                <TableCell style={{ width: 50 }}>
                  {/* Add any channel-specific image or icon here if needed */}
                </TableCell>
                {/* <TableCell style={{ width: 100 }}>{channel.id}</TableCell> */}
                <TableCell style={{ width: 200 }}>{channel.name}</TableCell>
                <TableCell style={{ width: 200 }}>
                  {new Date(channel.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell style={{ width: 200 }}>
                  {new Date(channel.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell style={{ width: 130 }}>
                  {!!channel && <Actions channel={channel} />}
                </TableCell>
              </>
            )}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default withPageRequiredAuth(Channels, { roles: [RoleEnum.ADMIN] });
