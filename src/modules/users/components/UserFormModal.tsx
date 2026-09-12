import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Modal from "../../../components/ui/Modal/Modal";
import Input from "../../../components/ui/Input/Input";
import Button from "../../../components/ui/Button/Button";
import {
  userService,
  type User,
  type CreateUserPayload,
  type UpdateUserPayload,
} from "../../../services/userService";
import { roleService, type Role } from "../../../services/roleService";
import { themes } from "../../../config/themes";
import "./UserFormModal.scss";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  editUser?: User | null;
}

const themeOptions = Object.entries(themes).map(([key, theme]) => ({
  value: key,
  label: theme.name,
}));

export default function UserFormModal({
  isOpen,
  onClose,
  onSuccess,
  editUser,
}: UserFormModalProps) {
  const { t } = useTranslation();
  const isEdit = !!editUser;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState<number>(0);
  const [theme, setTheme] = useState("default");
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      roleService.getAll().then(({ data }) => {
        if (data) setRoles(data);
      });

      if (editUser) {
        setFirstName(editUser.firstName);
        setLastName(editUser.lastName);
        setPhone(editUser.phone);
        setEmail(editUser.email);
        setRoleId(editUser.roleId);
        setTheme(editUser.theme || "default");
        setPassword("");
      } else {
        setFirstName("");
        setLastName("");
        setPhone("");
        setEmail("");
        setPassword("");
        setRoleId(0);
        setTheme("default");
      }
      setError(null);
    }
  }, [isOpen, editUser]);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    if (isEdit && editUser) {
      const payload: UpdateUserPayload = {
        firstName,
        lastName,
        phone,
        email,
        roleId,
        theme,
      };
      const { error: apiError } = await userService.update(
        editUser.userId,
        payload
      );
      setLoading(false);
      if (apiError) {
        setError(apiError);
        return;
      }
      onSuccess(t("users.updatedSuccess"));
    } else {
      const payload: CreateUserPayload = {
        firstName,
        lastName,
        phone,
        email,
        password,
        roleId,
        theme,
      };
      const { error: apiError } = await userService.create(payload);
      setLoading(false);
      if (apiError) {
        setError(apiError);
        return;
      }
      onSuccess(t("users.createdSuccess"));
    }

    onClose();
  };

  const isFormValid =
    firstName.trim() &&
    lastName.trim() &&
    phone.trim() &&
    email.trim() &&
    roleId > 0 &&
    (isEdit || password.trim().length >= 8);

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

  const labelStyle = {
    display: "block",
    fontSize: "14px",
    fontWeight: 500 as const,
    color: "var(--color-text-primary)",
    marginBottom: "6px",
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? t("users.editUser") : t("users.addUser")}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            loading={loading}
            disabled={!isFormValid}
          >
            {t("common.save")}
          </Button>
        </>
      }
    >
      <div className="user-form">
        {error && <div className="user-form__error">{error}</div>}

        <div className="user-form__row">
          <Input
            label={t("users.firstName")}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder={t("users.firstName")}
          />
          <Input
            label={t("users.lastName")}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder={t("users.lastName")}
          />
        </div>

        <Input
          label={t("users.phone")}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={t("users.phone")}
        />

        <Input
          label={t("users.email")}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("users.email")}
        />

        <Input
          label={t("users.password")}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t("users.password")}
          disabled={isEdit}
        />

        <div>
          <label style={labelStyle}>{t("users.role")}</label>
          <select
            value={roleId}
            onChange={(e) => setRoleId(Number(e.target.value))}
            style={selectStyle}
          >
            <option value={0}>-- {t("users.role")} --</option>
            {roles.map((role) => (
              <option key={role.roleId} value={role.roleId}>
                {role.roleName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle}>{t("users.theme")}</label>
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
      </div>
    </Modal>
  );
}
