"use client";

import {
  DELETE_USER_MUTATION,
  GET_USERS,
  UPDATE_USER_MUTATION,
} from "@/graphql/gql";
import { IGetUsersResponse, IUpdateUserResponse, IUser } from "@/models";
import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";

const USER_TYPES = ["BUYER", "ADMIN", "G_BUYER"] as const;

const TYPE_LABELS: Record<string, string> = {
  ADMIN: "Admin",
  BUYER: "Buyer",
  G_BUYER: "Google",
};

const TYPE_STYLES: Record<string, string> = {
  ADMIN: "text-qc-accent border-qc-accent/40 bg-qc-accent/10",
  BUYER: "text-qc-muted border-qc-border bg-qc-surface",
  G_BUYER: "text-blue-400 border-blue-400/40 bg-blue-400/10",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ── Edit Modal ────────────────────────────────────────────────────────────────

interface EditModalProps {
  user: IUser;
  onClose: () => void;
  onSaved: (updated: IUser) => void;
}

function EditModal({ user, onClose, onSaved }: EditModalProps) {
  const [form, setForm] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    userType: user.userType,
  });
  const [errorMsg, setErrorMsg] = useState("");

  const [updateUser, { loading }] =
    useMutation<IUpdateUserResponse>(UPDATE_USER_MUTATION);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrorMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const { data } = await updateUser({
        variables: {
          id: user.id,
          input: {
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            email: form.email.trim(),
            userType: form.userType,
          },
        },
      });
      if (data?.updateUser) {
        onSaved(data.updateUser);
      }
    } catch (err: any) {
      setErrorMsg(err.message ?? "Failed to update user.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-qc-surface border border-qc-border w-full max-w-md p-8 z-10">
        <div className="mb-6">
          <h3 className="font-display text-qc-text text-2xl mb-1">
            Edit User
          </h3>
          <p className="text-qc-muted text-sm truncate">{user.email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs tracking-[0.12em] uppercase text-qc-muted">
                First Name
              </label>
              <input
                name="firstName"
                type="text"
                value={form.firstName}
                onChange={handleChange}
                required
                className="w-full bg-qc-bg border border-qc-border text-qc-text px-4 py-2.5 text-sm focus:outline-none focus:border-qc-accent transition-colors duration-200"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs tracking-[0.12em] uppercase text-qc-muted">
                Last Name
              </label>
              <input
                name="lastName"
                type="text"
                value={form.lastName}
                onChange={handleChange}
                required
                className="w-full bg-qc-bg border border-qc-border text-qc-text px-4 py-2.5 text-sm focus:outline-none focus:border-qc-accent transition-colors duration-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs tracking-[0.12em] uppercase text-qc-muted">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full bg-qc-bg border border-qc-border text-qc-text px-4 py-2.5 text-sm focus:outline-none focus:border-qc-accent transition-colors duration-200"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs tracking-[0.12em] uppercase text-qc-muted">
              User Type
            </label>
            <select
              name="userType"
              value={form.userType}
              onChange={handleChange}
              className="w-full bg-qc-bg border border-qc-border text-qc-text px-4 py-2.5 text-sm focus:outline-none focus:border-qc-accent transition-colors duration-200 cursor-pointer"
            >
              {USER_TYPES.map((t) => (
                <option key={t} value={t}>
                  {TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </div>

          {errorMsg && (
            <p className="text-red-400 text-sm border border-red-400/30 bg-red-400/5 px-4 py-3">
              {errorMsg}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-qc-accent text-qc-accent-on text-sm tracking-wide uppercase hover:bg-qc-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-qc-border text-qc-muted text-sm tracking-wide uppercase hover:text-qc-text hover:border-qc-muted transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Delete Modal ──────────────────────────────────────────────────────────────

interface DeleteModalProps {
  user: IUser;
  onClose: () => void;
  onDeleted: (id: string) => void;
}

function DeleteModal({ user, onClose, onDeleted }: DeleteModalProps) {
  const [errorMsg, setErrorMsg] = useState("");
  const [deleteUser, { loading }] = useMutation(DELETE_USER_MUTATION);

  const handleDelete = async () => {
    setErrorMsg("");
    try {
      await deleteUser({ variables: { id: user.id } });
      onDeleted(user.id);
    } catch (err: any) {
      setErrorMsg(err.message ?? "Failed to delete user.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-qc-surface border border-qc-border w-full max-w-sm p-8 z-10">
        <div className="mb-6">
          <h3 className="font-display text-qc-text text-2xl mb-1">
            Delete User
          </h3>
          <p className="text-qc-muted text-sm">This action cannot be undone.</p>
        </div>

        <p className="text-qc-text text-sm mb-6">
          Are you sure you want to delete{" "}
          <span className="text-qc-accent font-medium">
            {user.firstName} {user.lastName}
          </span>
          ? Their account and all associated data will be permanently removed.
        </p>

        {errorMsg && (
          <p className="text-red-400 text-sm border border-red-400/30 bg-red-400/5 px-4 py-3 mb-4">
            {errorMsg}
          </p>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 py-2.5 bg-red-500/90 text-white text-sm tracking-wide uppercase hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-qc-border text-qc-muted text-sm tracking-wide uppercase hover:text-qc-text hover:border-qc-muted transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── UsersTable ────────────────────────────────────────────────────────────────

export default function UsersTable() {
  const { data, loading, error } = useQuery<IGetUsersResponse>(GET_USERS);
  const [users, setUsers] = useState<IUser[] | null>(null);
  const [editTarget, setEditTarget] = useState<IUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IUser | null>(null);

  // Use local state once data arrives
  const displayUsers = users ?? data?.users ?? [];

  const handleSaved = (updated: IUser) => {
    setUsers((prev) =>
      (prev ?? data?.users ?? []).map((u) =>
        u.id === updated.id ? updated : u,
      ),
    );
    setEditTarget(null);
  };

  const handleDeleted = (id: string) => {
    setUsers((prev) =>
      (prev ?? data?.users ?? []).filter((u) => u.id !== id),
    );
    setDeleteTarget(null);
  };

  return (
    <div>
      <div className="mb-8">
        <h2
          className="font-display text-qc-text tracking-[-0.02em] mb-1"
          style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
        >
          Manage Users
        </h2>
        <p className="text-qc-muted text-sm">
          View, edit, or remove user accounts.
        </p>
      </div>

      {loading && (
        <p className="text-qc-muted text-sm">Loading users...</p>
      )}

      {error && (
        <p className="text-red-400 text-sm border border-red-400/30 bg-red-400/5 px-4 py-3">
          {error.message}
        </p>
      )}

      {!loading && !error && displayUsers.length === 0 && (
        <p className="text-qc-muted text-sm">No users found.</p>
      )}

      {!loading && displayUsers.length > 0 && (
        <div className="border border-qc-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-qc-border bg-qc-surface">
                <th className="px-5 py-3 text-left text-xs tracking-[0.12em] uppercase text-qc-muted font-normal">
                  Name
                </th>
                <th className="px-5 py-3 text-left text-xs tracking-[0.12em] uppercase text-qc-muted font-normal">
                  Email
                </th>
                <th className="px-5 py-3 text-left text-xs tracking-[0.12em] uppercase text-qc-muted font-normal">
                  Type
                </th>
                <th className="px-5 py-3 text-left text-xs tracking-[0.12em] uppercase text-qc-muted font-normal">
                  Joined
                </th>
                <th className="px-5 py-3 text-right text-xs tracking-[0.12em] uppercase text-qc-muted font-normal">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {displayUsers.map((user, i) => (
                <tr
                  key={user.id}
                  className={`border-b border-qc-border last:border-b-0 hover:bg-qc-surface/50 transition-colors duration-150 ${
                    i % 2 === 0 ? "bg-qc-bg" : "bg-qc-surface/20"
                  }`}
                >
                  <td className="px-5 py-4 text-qc-text font-medium">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-5 py-4 text-qc-muted">{user.email}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 text-xs tracking-wide border ${
                        TYPE_STYLES[user.userType] ?? TYPE_STYLES["BUYER"]
                      }`}
                    >
                      {TYPE_LABELS[user.userType] ?? user.userType}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-qc-muted">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => setEditTarget(user)}
                        className="text-xs tracking-wide text-qc-muted hover:text-qc-accent transition-colors duration-150 uppercase"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(user)}
                        className="text-xs tracking-wide text-qc-muted hover:text-red-400 transition-colors duration-150 uppercase"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-5 py-3 border-t border-qc-border bg-qc-surface">
            <p className="text-xs text-qc-muted">
              {displayUsers.length} user{displayUsers.length !== 1 ? "s" : ""}{" "}
              total
            </p>
          </div>
        </div>
      )}

      {editTarget && (
        <EditModal
          user={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={handleSaved}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          user={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}
