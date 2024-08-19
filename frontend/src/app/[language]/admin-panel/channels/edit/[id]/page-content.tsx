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
  useGetChannelService,
  usePatchChannelService,
} from "@/services/api/services/channels";
import { useParams } from "next/navigation";

type EditChannelFormData = {
  name: string;
};

const useValidationEditChannelSchema = () => {
  const { t } = useTranslation("admin-panel-channels-edit");

  return yup.object().shape({
    name: yup
      .string()
      .required(t("admin-panel-channels-edit:inputs.name.validation.required")),
  });
};

function EditChannelFormActions() {
  const { t } = useTranslation("admin-panel-channels-edit");
  const { isSubmitting, isDirty } = useFormState();
  useLeavePage(isDirty);

  return (
    <Button
      variant="contained"
      color="primary"
      type="submit"
      disabled={isSubmitting}
    >
      {t("admin-panel-channels-edit:actions.submit")}
    </Button>
  );
}

function FormEditChannel() {
  const params = useParams();
  const fetchGetChannel = useGetChannelService();
  const fetchPatchChannel = usePatchChannelService();
  const { t } = useTranslation("admin-panel-channels-edit");
  const validationSchema = useValidationEditChannelSchema();
  const channelId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm<EditChannelFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "",
    },
  });

  const { handleSubmit, setError, reset } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    const { data, status } = await fetchPatchChannel({
      id: channelId,
      data: formData,
    });
    if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      (Object.keys(data.errors) as Array<keyof EditChannelFormData>).forEach(
        (key) => {
          setError(key, {
            type: "manual",
            message: t(
              `admin-panel-channels-edit:inputs.${key}.validation.server.${data.errors[key]}`
            ),
          });
        }
      );
      return;
    }
    if (status === HTTP_CODES_ENUM.OK) {
      reset(formData);
      enqueueSnackbar(t("admin-panel-channels-edit:alerts.channel.success"), {
        variant: "success",
      });
    }
  });

  useEffect(() => {
    const getInitialDataForEdit = async () => {
      const { status, data: channel } = await fetchGetChannel({
        id: channelId,
      });

      if (status === HTTP_CODES_ENUM.OK) {
        reset({
          name: channel?.name ?? "",
        });
      }
    };

    getInitialDataForEdit();
  }, [channelId, reset, fetchGetChannel]);

  return (
    <FormProvider {...methods}>
      <Container maxWidth="xs">
        <form onSubmit={onSubmit}>
          <Grid container spacing={2} mb={3} mt={3}>
            <Grid item xs={12}>
              <Typography variant="h6">
                {t("admin-panel-channels-edit:title1")}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <FormTextInput<EditChannelFormData>
                name="name"
                testId="name"
                label={t("admin-panel-channels-edit:inputs.name.label")}
              />
            </Grid>

            <Grid item xs={12}>
              <EditChannelFormActions />
              <Box ml={1} component="span">
                <Button
                  variant="contained"
                  color="inherit"
                  LinkComponent={Link}
                  href="/admin-panel/channels"
                >
                  {t("admin-panel-channels-edit:actions.cancel")}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Container>
    </FormProvider>
  );
}

function EditChannel() {
  return <FormEditChannel />;
}

export default withPageRequiredAuth(EditChannel);
