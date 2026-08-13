import { LegalPageLayout } from "@/components/LegalPageLayout";
import { useTranslations } from "next-intl";

export default function PrivacyPage() {
  const t = useTranslations("Legal.Privacy");

  return (
    <LegalPageLayout title={t("title")} lastUpdated={t("lastUpdated")}>
      <h2>{t("h1")}</h2>
      <p>{t("p1")}</p>
      
      <h2>{t("h2")}</h2>
      <p>{t("p2")}</p>

      <h2>{t("h3")}</h2>
      <p>{t("p3")}</p>

      <h2>{t("h4")}</h2>
      <p>{t("p4")}</p>

      <h2>{t("h5")}</h2>
      <p>{t("p5")}</p>
    </LegalPageLayout>
  );
}
