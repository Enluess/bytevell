import { LegalPageLayout } from "@/components/LegalPageLayout";
import { useTranslations } from "next-intl";

export default function FairUsePage() {
  const t = useTranslations("Legal.FairUse");
  const sections = t.raw("sections");
  
  return (
    <LegalPageLayout title={t("title")} lastUpdated={t("lastUpdated")}>
      {sections.map((section: any, idx: number) => (
        <div key={idx} className="mb-8">
          {section.title !== "Giriş" && (
            <h2 className="text-2xl font-bold text-white mb-4">{section.title}</h2>
          )}
          <div className="text-foreground-secondary leading-relaxed space-y-4">
            {section.content.split('\n\n').map((paragraph: string, pIdx: number) => (
              <p key={pIdx}>{paragraph}</p>
            ))}
          </div>
        </div>
      ))}
    </LegalPageLayout>
  );
}
