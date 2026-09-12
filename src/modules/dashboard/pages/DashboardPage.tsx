import { useTranslation } from "react-i18next";
import { useAuth } from "../../../context/AuthContext";
import MainLayout from "../../../layouts/MainLayout";
import "./DashboardPage.scss";

export default function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <MainLayout>
      <div className="dashboard">
        <div className="dashboard__card">
          <h1 className="dashboard__greeting">
            {t("dashboard.welcome", { name: user?.firstName })}
          </h1>
          <p className="dashboard__message">{t("dashboard.message")}</p>
        </div>
      </div>
    </MainLayout>
  );
}
