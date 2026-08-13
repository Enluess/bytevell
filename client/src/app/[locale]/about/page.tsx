import { LegalPageLayout } from "@/components/LegalPageLayout";
import { useTranslations } from "next-intl";

export default function AboutPage() {
  const t = useTranslations("About");

  return (
    <LegalPageLayout title={t("title")} lastUpdated={t("lastUpdated")}>
      <h2>{t("whoAreWe")}</h2>
      <p>{t("whoAreWeDesc")}</p>
      
      <h2>{t("mission")}</h2>
      <p>{t("missionDesc")}</p>

      <h2>{t("infrastructure")}</h2>
      <p>{t("infrastructureDesc")}</p>

      <h2>{t("whyBytevell")}</h2>
      <ul>
        <li><strong>{t("featurePerformanceTitle")}</strong> {t("featurePerformanceDesc")}</li>
        <li><strong>{t("featureReliabilityTitle")}</strong> {t("featureReliabilityDesc")}</li>
        <li><strong>{t("featureSupportTitle")}</strong> {t("featureSupportDesc")}</li>
        <li><strong>{t("featureTransparencyTitle")}</strong> {t("featureTransparencyDesc")}</li>
      </ul>
    </LegalPageLayout>
  );
}
