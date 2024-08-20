"use client";

import Button from "@mui/material/Button";
import { useForm, FormProvider, useFormState } from "react-hook-form";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FormTextInput from "@/components/form/text-input/form-text-input";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { useEffect } from "react";
import { useSnackbar } from "notistack";
import Link from "@/components/link";
import useLeavePage from "@/services/leave-page/use-leave-page";
import Box from "@mui/material/Box";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { useTranslation } from "@/services/i18n/client";
import {
  useGetVehicleService,
  usePatchVehicleService,
} from "@/services/api/services/vehicles";
import { useParams } from "next/navigation";
import { useAllChannels } from "@/services/api/useAllChannels"; // Assuming you have this hook
import FormSelectInput from "@/components/form/select/form-select";
import { Channel, ChannelData } from "@/services/api/types/channel";

type EditVehicleFormData = {
  name: string;
  channel: {
    id: string | number;
    name?: string;
  }; // Include channel information
};

const useValidationEditVehicleSchema = () => {
  const { t } = useTranslation("admin-panel-vehicles-edit");

  return yup.object().shape({
    name: yup
      .string()
      .required(t("admin-panel-vehicles-edit:inputs.name.validation.required")),
    channel: yup.object().shape({
      id: yup.mixed<string | number>().required(),
      name: yup.string(),
    }),
  });
};

function EditVehicleFormActions() {
  const { t } = useTranslation("admin-panel-vehicles-edit");
  const { isSubmitting, isDirty } = useFormState();
  useLeavePage(isDirty);

  return (
    <Button
      variant="contained"
      color="primary"
      type="submit"
      disabled={isSubmitting}
    >
      {t("admin-panel-vehicles-edit:actions.submit")}
    </Button>
  );
}

function FormEditVehicle() {
  const params = useParams();
  const fetchGetVehicle = useGetVehicleService();
  const fetchPatchVehicle = usePatchVehicleService();
  const { t } = useTranslation("admin-panel-vehicles-edit");
  const validationSchema = useValidationEditVehicleSchema();
  const vehicleId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm<EditVehicleFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "",
      channel: {
        id: "",
      }, // Initialize with empty channel
    },
  });

  const { handleSubmit, setError, reset } = methods;

  const { channels } = useAllChannels(); // Fetch channels

  const onSubmit = handleSubmit(async (formData) => {
    const ID = formData.channel.id as unknown as Channel;
    const transformedData = {
      name: formData.name,
      channel: {
        id: ID.id,
      }, // Include channel in the payload
    };
    const { data, status } = await fetchPatchVehicle({
      id: vehicleId,
      data: transformedData,
    });

    if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      (Object.keys(data.errors) as Array<keyof EditVehicleFormData>).forEach(
        (key) => {
          setError(key, {
            type: "manual",
            message: t(
              `admin-panel-vehicles-edit:inputs.${key}.validation.server.${data.errors[key]}`
            ),
          });
        }
      );
      return;
    }

    if (status === HTTP_CODES_ENUM.OK) {
      reset(formData);
      enqueueSnackbar(t("admin-panel-vehicles-edit:alerts.vehicle.success"), {
        variant: "success",
      });
    }
  });

  useEffect(() => {
    const getInitialDataForEdit = async () => {
      const { status, data: vehicle } = await fetchGetVehicle({
        id: vehicleId,
      });

      if (status === HTTP_CODES_ENUM.OK) {
        reset({
          name: vehicle?.name ?? "",
          channel: vehicle?.channel ?? { id: "" }, // Set the channel data
        });
      }
    };

    getInitialDataForEdit();
  }, [vehicleId, reset, fetchGetVehicle]);

  return (
    <FormProvider {...methods}>
      <Container maxWidth="xs">
        <form onSubmit={onSubmit}>
          <Grid container spacing={2} mb={3} mt={3}>
            <Grid item xs={12}>
              <Typography variant="h6">
                {t("admin-panel-vehicles-edit:title1")}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <FormTextInput<EditVehicleFormData>
                name="name"
                testId="name"
                label={t("admin-panel-vehicles-edit:inputs.name.label")}
              />
            </Grid>

            <Grid item xs={12}>
              <FormSelectInput<EditVehicleFormData, Channel>
                name="channel.id" // Adjust to match the form state structure
                testId="channel"
                label={t("admin-panel-vehicles-edit:inputs.channel.label")}
                options={channels || []}
                keyValue="id"
                renderOption={(option) =>
                  option.name ||
                  t("admin-panel-vehicles-edit:inputs.channel.unknown")
                }
              />
            </Grid>

            <Grid item xs={12}>
              <EditVehicleFormActions />
              <Box ml={1} component="span">
                <Button
                  variant="contained"
                  color="inherit"
                  LinkComponent={Link}
                  href="/admin-panel/vehicles"
                >
                  {t("admin-panel-vehicles-edit:actions.cancel")}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Container>
    </FormProvider>
  );
}

function EditVehicle() {
  return <FormEditVehicle />;
}

export default withPageRequiredAuth(EditVehicle);
