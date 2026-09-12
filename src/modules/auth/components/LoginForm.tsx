import { type FormEvent, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Input from "../../../components/ui/Input/Input";
import Button from "../../../components/ui/Button/Button";
import { useForm } from "../../../hooks/useForm";
import { useAuth } from "../../../context/AuthContext";
import { authService } from "../../../services/authService";
import { applyTheme } from "../../../config/themes";
import { required, validEmail, minLength } from "../../../utils/validators";
import "./LoginForm.scss";

export default function LoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const loginFields = useMemo(
    () => ({
      email: {
        rules: [required(t("auth.login.emailLabel")), validEmail],
      },
      password: {
        rules: [
          required(t("auth.login.passwordLabel")),
          minLength(8, t("auth.login.passwordLabel")),
        ],
      },
    }),
    [t]
  );

  const {
    values,
    errors,
    touched,
    isFormValid,
    setValue,
    setTouched,
    validateAll,
  } = useForm(loginFields);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validateAll()) return;

    setLoading(true);

    const { data, error } = await authService.login({
      email: values.email,
      password: values.password,
    });

    setLoading(false);

    if (error) {
      setApiError(error);
      return;
    }

    if (data) {
      login(data.user, data.accessToken, data.refreshToken);
      applyTheme(data.user.theme || "default");
      navigate("/dashboard");
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="login-form__header">
        <h2 className="login-form__title">{t("auth.login.title")}</h2>
        <p className="login-form__subtitle">{t("auth.login.subtitle")}</p>
      </div>

      {apiError && <div className="login-form__error">{apiError}</div>}

      <div className="login-form__fields">
        <Input
          label={t("auth.login.emailLabel")}
          type="email"
          placeholder={t("auth.login.emailPlaceholder")}
          value={values.email}
          onChange={(e) => setValue("email", e.target.value)}
          onBlur={() => setTouched("email")}
          error={touched.email ? errors.email : null}
          autoComplete="email"
        />

        <Input
          label={t("auth.login.passwordLabel")}
          type="password"
          placeholder={t("auth.login.passwordPlaceholder")}
          value={values.password}
          onChange={(e) => setValue("password", e.target.value)}
          onBlur={() => setTouched("password")}
          error={touched.password ? errors.password : null}
          autoComplete="current-password"
        />
      </div>

      <div className="login-form__actions">
        <button type="button" className="login-form__forgot-btn">
          {t("auth.login.forgotPassword")}
        </button>
      </div>

      <Button type="submit" fullWidth disabled={!isFormValid} loading={loading}>
        {t("auth.login.submitButton")}
      </Button>
    </form>
  );
}
