import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import MainLayout from "../../../layouts/MainLayout";
import Input from "../../../components/ui/Input/Input";
import Button from "../../../components/ui/Button/Button";
import Snackbar, {
  type SnackbarData,
} from "../../../components/ui/Snackbar/Snackbar";
import { useAuth } from "../../../context/AuthContext";
import { userService } from "../../../services/userService";
import { themes, applyTheme } from "../../../config/themes";
import "./AccountPage.scss";

const themeOptions = Object.entries(themes).map(([key, theme]) => ({
  value: key,
  label: theme.name,
}));

export default function AccountPage() {
  const { t } = useTranslation();
  const { user, login } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [theme, setTheme] = useState("default");
  const [changePassword, setChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarData | null>(null);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setPhone(user.phone);
      setEmail(user.email);
      setTheme(user.theme || "default");
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setError(null);
    setLoading(true);

    const { data, error: profileError } = await userService.update(
      user.userId,
      {
        firstName,
        lastName,
        phone,
        email,
        roleId: user.roleId,
        theme,
      }
    );

    if (profileError) {
      setLoading(false);
      setError(profileError);
      return;
    }

    if (data) {
      const accessToken = localStorage.getItem("accessToken") || "";
      const refreshToken = localStorage.getItem("refreshToken") || "";
      login(data, accessToken, refreshToken);
      applyTheme(data.theme || "default");
    }

    if (changePassword) {
      const { error: pwError } = await userService.changePassword(user.userId, {
        oldPassword,
        newPassword,
      });

      if (pwError) {
        setLoading(false);
        setError(pwError);
        return;
      }
    }

    setLoading(false);
    setChangePassword(false);
    setOldPassword("");
    setNewPassword("");
    setSnackbar({
      message: changePassword
        ? t("account.passwordChanged")
        : t("account.updatedSuccess"),
      type: "success",
    });
  };

  const isFormValid =
    firstName.trim() &&
    lastName.trim() &&
    phone.trim() &&
    email.trim() &&
    (!changePassword || (oldPassword.trim() && newPassword.trim().length >= 8));

  const selectStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1.5px solid #d1d5db",
    fontSize: "15px",
    color: "var(--color-text-primary)",
    backgroundColor: "var(--color-surface)",
    outline: "none",
  };

  return (
    <MainLayout>
      <h1 className="account-page__title">{t("account.title")}</h1>

      <div className="account-page__card">
        <div className="account-page__form">
          {error && <div className="account-page__error">{error}</div>}

          <div className="account-page__row">
            <Input
              label={t("users.firstName")}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              label={t("users.lastName")}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <Input
            label={t("users.phone")}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <Input
            label={t("users.email")}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 500,
                color: "var(--color-text-primary)",
                marginBottom: "6px",
              }}
            >
              {t("users.theme")}
            </label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              style={selectStyle}
            >
              {themeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <label className="account-page__checkbox">
            <input
              type="checkbox"
              checked={changePassword}
              onChange={(e) => {
                setChangePassword(e.target.checked);
                if (!e.target.checked) {
                  setOldPassword("");
                  setNewPassword("");
                }
              }}
            />
            {t("account.changePassword")}
          </label>

          {changePassword && (
            <div className="account-page__password-section">
              <Input
                label={t("account.oldPassword")}
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder={t("account.oldPasswordPlaceholder")}
              />
              <Input
                label={t("account.newPassword")}
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t("account.newPasswordPlaceholder")}
              />
            </div>
          )}

          <div className="account-page__actions">
            <Button
              onClick={handleSave}
              loading={loading}
              disabled={!isFormValid}
            >
              {t("common.save")}
            </Button>
          </div>
        </div>
      </div>

      <Snackbar data={snackbar} onClose={() => setSnackbar(null)} />
    </MainLayout>
  );
}
