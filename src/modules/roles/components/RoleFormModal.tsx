import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Modal from "../../../components/ui/Modal/Modal";
import Input from "../../../components/ui/Input/Input";
import Button from "../../../components/ui/Button/Button";
import {
  roleService,
  type Role,
  type Permission,
} from "../../../services/roleService";
import "./RoleFormModal.scss";

interface RoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  editRole?: Role | null;
}

export default function RoleFormModal({
  isOpen,
  onClose,
  onSuccess,
  editRole,
}: RoleFormModalProps) {
  const { t } = useTranslation();
  const isEdit = !!editRole;

  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      roleService.getPermissions().then(({ data }) => {
        if (data) setAllPermissions(data);
      });

      if (editRole) {
        setRoleName(editRole.roleName);
        setSelectedPermissions(editRole.permissions.map((p) => p.permissionId));
      } else {
        setRoleName("");
        setSelectedPermissions([]);
      }
      setError(null);
    }
  }, [isOpen, editRole]);

  const togglePermission = (permId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permId)
        ? prev.filter((id) => id !== permId)
        : [...prev, permId]
    );
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    const payload = { roleName, permissionIds: selectedPermissions };

    if (isEdit && editRole) {
      const { error: apiError } = await roleService.update(
        editRole.roleId,
        payload
      );
      setLoading(false);
      if (apiError) {
        setError(apiError);
        return;
      }
      onSuccess(t("roles.updatedSuccess"));
    } else {
      const { error: apiError } = await roleService.create(payload);
      setLoading(false);
      if (apiError) {
        setError(apiError);
        return;
      }
      onSuccess(t("roles.createdSuccess"));
    }

    onClose();
  };

  const isFormValid = roleName.trim() && selectedPermissions.length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? t("roles.editRole") : t("roles.addRole")}
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
      <div className="role-form">
        {error && <div className="role-form__error">{error}</div>}

        <Input
          label={t("roles.roleName")}
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          placeholder={t("roles.roleName")}
        />

        <div className="role-form__permissions">
          <span className="role-form__permissions-label">
            {t("roles.permissions")}
          </span>
          {allPermissions.map((perm) => (
            <label
              key={perm.permissionId}
              className={`role-form__permission-item ${
                selectedPermissions.includes(perm.permissionId)
                  ? "role-form__permission-item--selected"
                  : ""
              }`}
            >
              <input
                type="checkbox"
                checked={selectedPermissions.includes(perm.permissionId)}
                onChange={() => togglePermission(perm.permissionId)}
              />
              {perm.permissionName}
            </label>
          ))}
        </div>
      </div>
    </Modal>
  );
}
