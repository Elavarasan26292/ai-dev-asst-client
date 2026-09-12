import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import MainLayout from "../../../layouts/MainLayout";
import Button from "../../../components/ui/Button/Button";
import Modal from "../../../components/ui/Modal/Modal";
import Snackbar, {
  type SnackbarData,
} from "../../../components/ui/Snackbar/Snackbar";
import RoleFormModal from "../components/RoleFormModal";
import { roleService, type Role } from "../../../services/roleService";
import "./RolesPage.scss";

export default function RolesPage() {
  const { t } = useTranslation();
  const [roles, setRoles] = useState<Role[]>([]);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [deleteRole, setDeleteRole] = useState<Role | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarData | null>(null);

  const loadRoles = useCallback(async () => {
    const { data } = await roleService.getAll();
    if (data) setRoles(data);
  }, []);

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  const handleAdd = () => {
    setEditRole(null);
    setFormModalOpen(true);
  };

  const handleEdit = (role: Role) => {
    setEditRole(role);
    setFormModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteRole) return;
    setDeleteLoading(true);

    const { error } = await roleService.delete(deleteRole.roleId);
    setDeleteLoading(false);

    if (error) {
      setDeleteRole(null);
      setSnackbar({ message: error, type: "error" });
      return;
    }

    setDeleteRole(null);
    setSnackbar({ message: t("roles.deletedSuccess"), type: "success" });
    loadRoles();
  };

  const handleSuccess = (message: string) => {
    setSnackbar({ message, type: "success" });
    loadRoles();
  };

  return (
    <MainLayout>
      <div className="roles-page__header">
        <h1 className="roles-page__title">{t("roles.title")}</h1>
        <Button onClick={handleAdd}>{t("roles.addRole")}</Button>
      </div>

      <div className="roles-page__table-wrapper">
        {roles.length === 0 ? (
          <div className="roles-page__empty">{t("roles.noRoles")}</div>
        ) : (
          <table className="roles-page__table">
            <thead>
              <tr>
                <th>{t("roles.roleName")}</th>
                <th>{t("roles.permissions")}</th>
                <th>{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.roleId}>
                  <td>{role.roleName}</td>
                  <td>
                    {role.permissions.map((perm) => (
                      <span
                        key={perm.permissionId}
                        className="roles-page__permission-badge"
                      >
                        {perm.permissionName}
                      </span>
                    ))}
                  </td>
                  <td>
                    <div className="roles-page__actions">
                      <button
                        className="roles-page__edit-btn"
                        onClick={() => handleEdit(role)}
                      >
                        {t("common.edit")}
                      </button>
                      <button
                        className="roles-page__delete-btn"
                        onClick={() => setDeleteRole(role)}
                      >
                        {t("common.delete")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <RoleFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSuccess={handleSuccess}
        editRole={editRole}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteRole}
        onClose={() => setDeleteRole(null)}
        title={t("common.deleteConfirmTitle")}
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteRole(null)}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleDeleteConfirm} loading={deleteLoading}>
              {t("common.confirm")}
            </Button>
          </>
        }
      >
        <p>{t("common.deleteConfirmMessage")}</p>
      </Modal>

      <Snackbar data={snackbar} onClose={() => setSnackbar(null)} />
    </MainLayout>
  );
}
