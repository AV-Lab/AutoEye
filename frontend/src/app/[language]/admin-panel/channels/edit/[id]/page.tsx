import type { Metadata } from "next";
import EditChannel from "./page-content";
import { getServerTranslation } from "@/services/i18n";

type Props = {
  params: { language: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { t } = await getServerTranslation(
    params.language,
    "admin-panel-channels-edit"
  );

  return {
    title: t("title1"),
  };
}

export default EditChannel;
