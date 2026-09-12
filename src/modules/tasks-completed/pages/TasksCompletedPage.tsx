import { useTranslation } from "react-i18next";
import MainLayout from "../../../layouts/MainLayout";
import "../../../modules/start-development/pages/StartDevelopmentPage.scss";

export default function TasksCompletedPage() {
  const { t } = useTranslation();

  return (
    <MainLayout>
      <div className="placeholder-page">
        <div className="placeholder-page__card">
          <h1 className="placeholder-page__title">
            {t("tasksCompleted.title")}
          </h1>
          <p className="placeholder-page__message">
            {t("tasksCompleted.message")}
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
