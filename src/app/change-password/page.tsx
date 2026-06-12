import ChangePasswordForm from "@/components/auth/ChangePasswordForm";
import AppContainer, { contentPanelClass } from "@/components/layout/AppContainer";
import PageHeader from "@/components/layout/PageHeader";
import PageLayout from "@/components/layout/PageLayout";

export default function ChangePasswordPage() {
  return (
    <PageLayout activeKey="change-password">
      <AppContainer>
        <PageHeader title="Change Password" />

        <div className={contentPanelClass}>
          <ChangePasswordForm />
        </div>
      </AppContainer>
    </PageLayout>
  );
}
