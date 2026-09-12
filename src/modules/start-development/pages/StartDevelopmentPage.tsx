import { useState } from "react";
import { useTranslation } from "react-i18next";
import MainLayout from "../../../layouts/MainLayout";
import Input from "../../../components/ui/Input/Input";
import Button from "../../../components/ui/Button/Button";
import {
  agentService,
  type TicketAnalysisResult,
} from "../../../services/agentService";
import "./StartDevelopmentPage.scss";

export default function StartDevelopmentPage() {
  const { t } = useTranslation();
  const [ticketId, setTicketId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TicketAnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!ticketId.trim()) return;
    setError(null);
    setResult(null);
    setLoading(true);

    const { data, error: apiError } = await agentService.analyzeTicket(
      ticketId.trim()
    );
    setLoading(false);

    if (apiError) {
      setError(apiError);
      return;
    }

    if (data) {
      setResult(data);
    }
  };

  return (
    <MainLayout>
      <div className="start-dev__header">
        <h1 className="start-dev__title">{t("startDevelopment.title")}</h1>
        <p className="start-dev__subtitle">{t("startDevelopment.subtitle")}</p>
      </div>

      {/* Ticket ID Input */}
      <div className="start-dev__input-section">
        <div className="start-dev__input-row">
          <div className="start-dev__input-field">
            <Input
              label={t("startDevelopment.ticketId")}
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              placeholder={t("startDevelopment.ticketIdPlaceholder")}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
            />
          </div>
          <Button
            onClick={handleAnalyze}
            disabled={!ticketId.trim()}
            loading={loading}
          >
            {t("startDevelopment.analyzeButton")}
          </Button>
        </div>
      </div>

      {/* Error */}
      {error && <div className="start-dev__error">{error}</div>}

      {/* Loading */}
      {loading && (
        <div className="start-dev__loading">
          <div className="start-dev__spinner" />
          <span className="start-dev__loading-text">
            {t("startDevelopment.analyzing")}
          </span>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="start-dev__results">
          {/* Ticket Header */}
          <div className="start-dev__ticket-header">
            <span className="start-dev__ticket-title">
              {result.ticketTitle}
            </span>
            <div className="start-dev__ticket-meta">
              {result.ticketType && (
                <span className="start-dev__badge start-dev__badge--type">
                  {result.ticketType}
                </span>
              )}
              {result.state && (
                <span className="start-dev__badge start-dev__badge--state">
                  {result.state}
                </span>
              )}
              {result.estimatedComplexity && (
                <span className="start-dev__badge start-dev__badge--complexity">
                  {t("startDevelopment.complexity")}:{" "}
                  {result.estimatedComplexity}
                </span>
              )}
            </div>
          </div>

          {/* Summary */}
          {result.summary && (
            <div className="start-dev__card">
              <div className="start-dev__card-title">
                <svg
                  className="start-dev__card-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                {t("startDevelopment.summary")}
              </div>
              <p className="start-dev__summary-text">{result.summary}</p>
            </div>
          )}

          {/* Tasks */}
          {result.tasks.length > 0 && (
            <div className="start-dev__card">
              <div className="start-dev__card-title">
                <svg
                  className="start-dev__card-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
                {t("startDevelopment.tasks")}
              </div>
              <ul className="start-dev__task-list">
                {result.tasks.map((task, i) => (
                  <li key={i} className="start-dev__task-item">
                    <span className="start-dev__task-number">{i + 1}</span>
                    {task}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Screenshot Analysis */}
          {result.screenshotAnalysis.length > 0 && (
            <div className="start-dev__card">
              <div className="start-dev__card-title">
                <svg
                  className="start-dev__card-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {t("startDevelopment.screenshots")}
              </div>
              <ul className="start-dev__task-list">
                {result.screenshotAnalysis.map((item, i) => (
                  <li key={i} className="start-dev__task-item">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Questions */}
          {result.questions.length > 0 && (
            <div className="start-dev__card">
              <div className="start-dev__card-title">
                <svg
                  className="start-dev__card-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {t("startDevelopment.questions")}
              </div>
              <ul className="start-dev__question-list">
                {result.questions.map((q, i) => (
                  <li key={i} className="start-dev__question-item">
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Proceed Button */}
          <div className="start-dev__proceed">
            <Button>{t("startDevelopment.proceedButton")}</Button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!result && !loading && !error && (
        <div className="start-dev__empty">
          <p>{t("startDevelopment.noResults")}</p>
        </div>
      )}
    </MainLayout>
  );
}
