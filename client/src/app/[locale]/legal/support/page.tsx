import { LegalPageLayout } from "@/components/LegalPageLayout";
import { useTranslations } from "next-intl";

export default function SupportPolicyPage() {
  const t = useTranslations("Legal.Support");

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
    </LegalPageLayout>
  );
}
