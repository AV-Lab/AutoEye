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
import { useSnackbar } from "notistack";
import Link from "@/components/link";
import useLeavePage from "@/services/leave-page/use-leave-page";
import Box from "@mui/material/Box";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { useTranslation } from "@/services/i18n/client";
import { usePostChannelService } from "@/services/api/services/channels";
import { useRouter } from "next/navigation";

type CreateChannelFormData = {
  name: string;
};

const useValidationSchema = () => {
  const { t } = useTranslation("admin-panel-channels-create");

  return yup.object().shape({
    name: yup
      .string()
      .required(
        t("admin-panel-channels-create:inputs.name.validation.required")
      ),
  });
};

function CreateChannelFormActions() {
  const { t } = useTranslation("admin-panel-channels-create");
  const { isSubmitting, isDirty } = useFormState();
  useLeavePage(isDirty);

  return (
    <Button
      variant="contained"
      color="primary"
      type="submit"
      disabled={isSubmitting}
    >
      {t("admin-panel-channels-create:actions.submit")}
    </Button>
  );
}

function FormCreateChannel() {
  const router = useRouter();
  const fetchPostChannel = usePostChannelService();
  const { t } = useTranslation("admin-panel-channels-create");
  const validationSchema = useValidationSchema();

  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm<CreateChannelFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "",
    },
  });

  const { handleSubmit, setError } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    const { data, status } = await fetchPostChannel(formData);
    if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      (Object.keys(data.errors) as Array<keyof CreateChannelFormData>).forEach(
        (key) => {
          setError(key, {
            type: "manual",
            message: t(
              `admin-panel-channels-create:inputs.${key}.validation.server.${data.errors[key]}`
            ),
          });
        }
      );
      return;
    }
    if (status === HTTP_CODES_ENUM.CREATED) {
      enqueueSnackbar(t("admin-panel-channels-create:alerts.channel.success"), {
        variant: "success",
      });
      router.push("/admin-panel/vehicles-manager");
    }
  });

  return (
    <FormProvider {...methods}>
      <Container maxWidth="xs">
        <form onSubmit={onSubmit} autoComplete="create-new-channel">
          <Grid container spacing={2} mb={3} mt={3}>
            <Grid item xs={12}>
              <Typography variant="h6">
                {t("admin-panel-channels-create:title")}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <FormTextInput<CreateChannelFormData>
                name="name"
                testId="new-channel-name"
                label={t("admin-panel-channels-create:inputs.name.label")}
              />
            </Grid>

            <Grid item xs={12}>
              <CreateChannelFormActions />
              <Box ml={1} component="span">
                <Button
                  variant="contained"
                  color="inherit"
                  LinkComponent={Link}
                  href="/admin-panel/vehicles-manager"
                >
                  {t("admin-panel-channels-create:actions.cancel")}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Container>
    </FormProvider>
  );
}

function CreateChannel() {
  return <FormCreateChannel />;
}

export default withPageRequiredAuth(CreateChannel);
