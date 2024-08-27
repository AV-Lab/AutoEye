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
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import TableSortLabel from "@mui/material/TableSortLabel";
import { SortEnum } from "@/services/api/types/sort-type";
import {
  Collapse,
  Table,
  TableBody,
  TableContainer,
  TableHead,
} from "@mui/material";
import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Vehicle } from "@/services/api/types/vehicle";
import {
  useVehicleListQuery,
  vehiclesQueryKeys,
} from "../vehicles/queries/vehicles-queries";
import { useDeleteVehicleService } from "@/services/api/services/vehicles";
import {
  VehicleFilterType,
  VehicleSortType,
} from "../vehicles/vehicle-filter-types";
import { Update } from "@mui/icons-material";
import {
  ChannelFilterType,
  ChannelSortType,
} from "../channels/channel-filter-types";
import { useSearchParams } from "next/navigation";
import {
  channelsQueryKeys,
  useChannelListQuery,
} from "../channels/queries/channels-queries";

// data for the new table

interface SubDataRow {
  id: number;
  vehicleName: string;
  location: string;
}

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

function ChannelActions({ channel }: { channel: Channel }) {
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

function VehicleActions({ vehicle }: { vehicle: Vehicle }) {
  const [open, setOpen] = useState(false);
  const { confirmDialog } = useConfirmDialog();
  const fetchVehicleDelete = useDeleteVehicleService();
  const queryClient = useQueryClient();
  const anchorRef = useRef<HTMLDivElement>(null);
  const { t: tVehicles } = useTranslation("admin-panel-vehicles");

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
      title: tVehicles("admin-panel-vehicles:confirm.delete.title"),
      message: tVehicles("admin-panel-vehicles:confirm.delete.message"),
    });

    if (isConfirmed) {
      setOpen(false);

      const searchParams = new URLSearchParams(window.location.search);
      const searchParamsFilter = searchParams.get("filter");
      const searchParamsSort = searchParams.get("sort");

      let filter: VehicleFilterType | undefined = undefined;
      let sort: VehicleSortType | undefined = {
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
        InfiniteData<{ nextPage: number; data: Vehicle[] }>
      >(vehiclesQueryKeys.list().sub.by({ sort, filter }).key);

      await queryClient.cancelQueries({
        queryKey: vehiclesQueryKeys.list().key,
      });

      const newData = {
        ...previousData,
        pages: previousData?.pages.map((page) => ({
          ...page,
          data: page?.data.filter((item) => item.id !== vehicle.id),
        })),
      };

      queryClient.setQueryData(
        vehiclesQueryKeys.list().sub.by({ sort, filter }).key,
        newData
      );

      await fetchVehicleDelete({
        id: vehicle.id,
      });
    }
  };

  const mainButton = (
    <Button
      size="small"
      variant="contained"
      LinkComponent={Link}
      href={`/admin-panel/vehicles/edit/${vehicle.id}`}
      color="success"
    >
      {tVehicles("admin-panel-vehicles:actions.edit")}
    </Button>
  );

  return (
    <>
      <ButtonGroup
        variant="contained"
        ref={anchorRef}
        aria-label="split button"
        size="small"
        color="success"
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
                    {tVehicles("admin-panel-vehicles:actions.delete")}
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

function VehiclesManagement() {
  const { data: vehicleData } = useVehicleListQuery();

  const { t: tVehiclesManagement } = useTranslation(
    "admin-panel-vehicles-management"
  );
  const searchParams = useSearchParams();
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

  const filter = useMemo(() => {
    const searchParamsFilter = searchParams.get("filter");
    if (searchParamsFilter) {
      return JSON.parse(searchParamsFilter) as ChannelFilterType;
    }

    return undefined;
  }, [searchParams]);

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useChannelListQuery({ filter, sort: { order, orderBy } });

  const result = useMemo(() => {
    const result =
      (data?.pages.flatMap((page) => page?.data) as Channel[]) ??
      ([] as Channel[]);
    return removeDuplicatesFromArrayObjects(result, "id");
  }, [data]);

  const [openRows, setOpenRows] = useState<Set<string | number>>(new Set());
  const handleToggle = (id: string | number) => {
    setOpenRows((prev) => {
      const newOpenRows = new Set(prev);
      if (newOpenRows.has(id)) {
        newOpenRows.delete(id);
      } else {
        newOpenRows.add(id);
      }
      return newOpenRows;
    });
  };

  const flattenedVehicleData =
    vehicleData?.pages.flatMap((page) =>
      page?.data.map((vehicle) => ({
        id: vehicle.id,
        name: vehicle.name,
        createdAt: vehicle.createdAt,
        channelId: vehicle.channel?.id,
      }))
    ) || [];

  const allVehicleData =
    vehicleData?.pages.flatMap((page) =>
      page?.data.map((vehicle) => ({
        id: vehicle.id,
        name: vehicle.name,
        createdAt: vehicle.createdAt,
        updatedAt: vehicle.updatedAt,
        channelId: vehicle.channel,
      }))
    ) || [];

  return (
    <Container maxWidth="md">
      <Grid container spacing={3} pt={3}>
        <Grid container item spacing={3} xs={12}>
          <Grid item xs>
            <Typography variant="h3">
              {tVehiclesManagement("admin-panel-vehicles-management:title")}
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
                sx={{ marginRight: 2 }}
              >
                {tVehiclesManagement(
                  "admin-panel-vehicles-management:actions.createC"
                )}
              </Button>

              <Button
                variant="contained"
                LinkComponent={Link}
                href="/admin-panel/vehicles/create"
                color="success"
              >
                {tVehiclesManagement(
                  "admin-panel-vehicles-management:actions.createV"
                )}
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} mb={2}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: "#121212" }}>
                  <TableCell></TableCell>
                  <TableCell>Channel Name</TableCell>
                  <TableCell>Vehicles</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {result.map((channel) => (
                  <React.Fragment key={channel.id}>
                    <TableRow>
                      <TableCell>
                        <span onClick={() => handleToggle(channel.id)}>
                          {openRows.has(channel.id) ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </span>
                      </TableCell>
                      <TableCell>{channel.name}</TableCell>
                      <TableCell>{channel.vehiclesCount}</TableCell>
                      <TableCell style={{ width: 200 }}>
                        {new Date(channel.createdAt || "").toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )}
                      </TableCell>
                      <TableCell style={{ width: 130 }}>
                        {!!channel && <ChannelActions channel={channel} />}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={5} style={{ padding: 0 }}>
                        <Collapse in={openRows.has(channel.id)}>
                          <Table>
                            <TableBody>
                              {flattenedVehicleData.map((subRow) => {
                                const specificVehicle = allVehicleData.filter(
                                  (vehicle) => vehicle?.id === subRow?.id
                                );

                                const v =
                                  specificVehicle[0] as unknown as Vehicle;

                                if (subRow?.channelId != channel.id) {
                                  return null; // Skip rendering this row
                                }

                                return (
                                  <TableRow key={subRow.id}>
                                    <TableCell
                                      style={{ width: 175 }}
                                    ></TableCell>
                                    <TableCell
                                      style={{ width: 175 }}
                                    ></TableCell>
                                    <TableCell>{subRow.name}</TableCell>
                                    <TableCell style={{ width: 200 }}>
                                      {new Date(
                                        subRow.createdAt || ""
                                      ).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                      })}
                                    </TableCell>
                                    <TableCell style={{ width: 130 }}>
                                      {!!v && <VehicleActions vehicle={v} />}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  );
}

export default withPageRequiredAuth(VehiclesManagement, {
  roles: [RoleEnum.ADMIN],
});
