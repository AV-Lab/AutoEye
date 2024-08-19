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
import { usePostVehicleService } from "@/services/api/services/vehicles";
import { useRouter } from "next/navigation";

type CreateVehicleFormData = {
  name: string;
};

const useValidationSchema = () => {
  const { t } = useTranslation("admin-panel-vehicles-create");

  return yup.object().shape({
    name: yup
      .string()
      .required(
        t("admin-panel-vehicles-create:inputs.name.validation.required")
      ),
  });
};

function CreateVehicleFormActions() {
  const { t } = useTranslation("admin-panel-vehicles-create");
  const { isSubmitting, isDirty } = useFormState();
  useLeavePage(isDirty);

  return (
    <Button
      variant="contained"
      color="primary"
      type="submit"
      disabled={isSubmitting}
    >
      {t("admin-panel-vehicles-create:actions.submit")}
    </Button>
  );
}

function FormCreateVehicle() {
  const router = useRouter();
  const fetchPostVehicle = usePostVehicleService();
  const { t } = useTranslation("admin-panel-vehicles-create");
  const validationSchema = useValidationSchema();

  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm<CreateVehicleFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "",
    },
  });

  const { handleSubmit, setError } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    const { data, status } = await fetchPostVehicle(formData);
    if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      (Object.keys(data.errors) as Array<keyof CreateVehicleFormData>).forEach(
        (key) => {
          setError(key, {
            type: "manual",
            message: t(
              `admin-panel-vehicles-create:inputs.${key}.validation.server.${data.errors[key]}`
            ),
          });
        }
      );
      return;
    }
    if (status === HTTP_CODES_ENUM.CREATED) {
      enqueueSnackbar(t("admin-panel-vehicles-create:alerts.vehicle.success"), {
        variant: "success",
      });
      router.push("/admin-panel/vehicles");
    }
  });

  return (
    <FormProvider {...methods}>
      <Container maxWidth="xs">
        <form onSubmit={onSubmit} autoComplete="create-new-vehicle">
          <Grid container spacing={2} mb={3} mt={3}>
            <Grid item xs={12}>
              <Typography variant="h6">
                {t("admin-panel-vehicles-create:title")}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <FormTextInput<CreateVehicleFormData>
                name="name"
                testId="new-vehicle-name"
                label={t("admin-panel-vehicles-create:inputs.name.label")}
              />
            </Grid>

            <Grid item xs={12}>
              <CreateVehicleFormActions />
              <Box ml={1} component="span">
                <Button
                  variant="contained"
                  color="inherit"
                  LinkComponent={Link}
                  href="/admin-panel/vehicles"
                >
                  {t("admin-panel-vehicles-create:actions.cancel")}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Container>
    </FormProvider>
  );
}

function CreateVehicle() {
  return <FormCreateVehicle />;
}

export default withPageRequiredAuth(CreateVehicle);
