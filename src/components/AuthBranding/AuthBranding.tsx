import { useTranslation } from "react-i18next";
import "./AuthBranding.scss";

export default function AuthBranding() {
  const { t } = useTranslation();

  const titleLines = t("auth.branding.title").split("\n");

  const LogoIcon = ({ size = 24 }: { size?: number }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    </svg>
  );

  return (
    <>
      {/* Desktop Branding Panel */}
      <div className="auth-branding">
        <div className="auth-branding__shape auth-branding__shape--top" />
        <div className="auth-branding__shape auth-branding__shape--bottom" />
        <div className="auth-branding__shape auth-branding__shape--center" />

        <div className="auth-branding__logo">
          <div className="auth-branding__logo-icon">
            <LogoIcon />
          </div>
          <span className="auth-branding__logo-text">{t("app.name")}</span>
        </div>

        <div className="auth-branding__tagline">
          <h1 className="auth-branding__title">
            {titleLines.map((line, i) => (
              <span key={i}>
                {line}
                {i < titleLines.length - 1 && <br />}
              </span>
            ))}
          </h1>
          <p className="auth-branding__subtitle">
            {t("auth.branding.subtitle")}
          </p>
        </div>

        <p className="auth-branding__footer">{t("app.copyright")}</p>
      </div>

      {/* Mobile Header */}
      <div className="auth-mobile-header">
        <div className="auth-mobile-header__inner">
          <div className="auth-mobile-header__icon">
            <LogoIcon size={20} />
          </div>
          <span className="auth-mobile-header__text">{t("app.name")}</span>
        </div>
      </div>
    </>
  );
}
