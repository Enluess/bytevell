import { LegalPageLayout } from "@/components/LegalPageLayout";
import { useTranslations } from "next-intl";

export default function RefundPage() {
  const t = useTranslations("Legal.Refund");

  return (
    <LegalPageLayout title={t("title")} lastUpdated={t("lastUpdated")}>
      <h2>{t("h1")}</h2>
      <p>{t("p1")}</p>
      
      <h2>{t("h2")}</h2>
      <p>{t("p2")}</p>

      <h2>{t("h3")}</h2>
      <ul>
        <li>{t("l1")}</li>
        <li>{t("l2")}</li>
        <li>{t("l3")}</li>
        <li>{t("l4")}</li>
      </ul>

      <h2>{t("h4")}</h2>
      <p>{t("p4")}</p>
    </LegalPageLayout>
  );
}
