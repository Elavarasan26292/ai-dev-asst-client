import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import MainLayout from "../../../layouts/MainLayout";
import Button from "../../../components/ui/Button/Button";
import Modal from "../../../components/ui/Modal/Modal";
import Snackbar, {
  type SnackbarData,
} from "../../../components/ui/Snackbar/Snackbar";
import UserFormModal from "../components/UserFormModal";
import { userService, type User } from "../../../services/userService";
import "./UsersPage.scss";

export default function UsersPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarData | null>(null);

  const loadUsers = useCallback(async () => {
    const { data } = await userService.getAll();
    if (data) setUsers(data);
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleAdd = () => {
    setEditUser(null);
    setModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditUser(user);
    setModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteUser) return;
    setDeleteLoading(true);

    const { error } = await userService.delete(deleteUser.userId);
    setDeleteLoading(false);

    if (error) {
      setDeleteUser(null);
      setSnackbar({ message: error, type: "error" });
      return;
    }

    setDeleteUser(null);
    setSnackbar({ message: t("users.deletedSuccess"), type: "success" });
    loadUsers();
  };

  const handleSuccess = (message: string) => {
    setSnackbar({ message, type: "success" });
    loadUsers();
  };

  return (
    <MainLayout>
      <div className="users-page__header">
        <h1 className="users-page__title">{t("users.title")}</h1>
        <Button onClick={handleAdd}>{t("users.addUser")}</Button>
      </div>

      <div className="users-page__table-wrapper">
        {users.length === 0 ? (
          <div className="users-page__empty">{t("users.noUsers")}</div>
        ) : (
          <table className="users-page__table">
            <thead>
              <tr>
                <th>{t("users.firstName")}</th>
                <th>{t("users.lastName")}</th>
                <th>{t("users.email")}</th>
                <th>{t("users.phone")}</th>
                <th>{t("users.role")}</th>
                <th>{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.userId}>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.roleName}</td>
                  <td>
                    <div className="users-page__actions">
                      <button
                        className="users-page__edit-btn"
                        onClick={() => handleEdit(user)}
                      >
                        {t("common.edit")}
                      </button>
                      <button
                        className="users-page__delete-btn"
                        onClick={() => setDeleteUser(user)}
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

      <UserFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleSuccess}
        editUser={editUser}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteUser}
        onClose={() => setDeleteUser(null)}
        title={t("common.deleteConfirmTitle")}
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteUser(null)}>
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
