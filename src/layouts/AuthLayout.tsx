import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import AuthBranding from "../components/AuthBranding/AuthBranding";
import Select from "../components/ui/Select/Select";
import "./AuthLayout.scss";

const languages = [
  { value: "en", label: "EN" },
  { value: "es", label: "ES" },
];

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { i18n } = useTranslation();

  return (
    <div className="auth-layout">
      <AuthBranding />

      <div className="auth-form-panel">
        <div className="auth-form-panel__lang">
          <Select
            options={languages}
            value={i18n.language}
            onChange={(value) => i18n.changeLanguage(value)}
          />
        </div>
        <div className="auth-form-panel__inner">{children}</div>
      </div>
    </div>
  );
}
