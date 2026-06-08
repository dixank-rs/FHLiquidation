import AppContainer, { contentPanelClass } from "@/components/layout/AppContainer";
import PageHeader from "@/components/layout/PageHeader";
import PageLayout from "@/components/layout/PageLayout";
import UnderConstructionState from "@/components/layout/UnderConstructionState";

type PlaceholderPageProps = {
  title: string;
  activeKey?: string;
  description?: string;
};

export default function PlaceholderPage({
  title,
  activeKey,
  description,
}: PlaceholderPageProps) {
  return (
    <PageLayout activeKey={activeKey}>
      <AppContainer className="flex w-full min-w-0 flex-col">
        <PageHeader title={title} />
        <div
          className={[
            contentPanelClass,
            "mb-4 flex min-h-[clamp(240px,calc(100dvh-var(--fhi-header-height)-var(--fhi-page-gap)-14rem),620px)] min-w-0 flex-col sm:mb-8",
          ].join(" ")}
        >
          <UnderConstructionState description={description} />
        </div>
      </AppContainer>
    </PageLayout>
  );
}
