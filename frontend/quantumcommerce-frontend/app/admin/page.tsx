"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useState } from "react";
import CreateProductForm from "./_components/CreateProductForm";
import UsersTable from "./_components/UsersTable";

type AdminTab = "create-product" | "manage-users";

// ── Access Denied ─────────────────────────────────────────────────────────────

function AccessDenied() {
  return (
    <div className="min-h-screen bg-qc-bg flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        {/* Lock icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-16 h-16 border border-qc-border flex items-center justify-center">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-qc-muted"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
        </div>

        <p className="text-xs tracking-[0.25em] uppercase text-qc-muted mb-4">
          403 — Forbidden
        </p>

        <h1
          className="font-display text-qc-text tracking-[-0.02em] mb-5"
          style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
        >
          Access Restricted
        </h1>

        <p className="text-qc-muted text-sm leading-relaxed mb-10">
          You don&apos;t have permission to view this page. This area is
          reserved for administrator accounts only.
        </p>

        <Link
          href="/products"
          className="inline-block px-8 py-3 border border-qc-accent text-qc-accent text-sm tracking-wide uppercase hover:bg-qc-accent hover:text-qc-accent-on transition-all duration-300"
        >
          Browse Products
        </Link>
      </div>
    </div>
  );
}

// ── Sidebar Nav Item ──────────────────────────────────────────────────────────

interface NavItemProps {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

function NavItem({ label, icon, active, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-6 py-3.5 text-sm text-left transition-colors duration-200 ${
        active
          ? "text-qc-accent bg-qc-accent/5 border-r-2 border-qc-accent"
          : "text-qc-muted hover:text-qc-text hover:bg-qc-bg/50"
      }`}
    >
      <span className={active ? "text-qc-accent" : "text-qc-muted"}>
        {icon}
      </span>
      {label}
    </button>
  );
}

// ── Admin Dashboard ───────────────────────────────────────────────────────────

function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("create-product");

  return (
    <div
      className="flex bg-qc-bg"
      style={{ minHeight: "calc(100vh - 68px)", marginTop: "68px" }}
    >
      {/* Sidebar */}
      <aside
        className="w-60 border-r border-qc-border bg-qc-surface shrink-0 flex flex-col"
        style={{
          position: "sticky",
          top: "68px",
          height: "calc(100vh - 68px)",
        }}
      >
        {/* Sidebar header */}
        <div className="px-6 py-7 border-b border-qc-border">
          <p className="text-[10px] tracking-[0.2em] uppercase text-qc-muted mb-1">
            Control Panel
          </p>
          <h2 className="font-display text-qc-text text-lg leading-tight">
            Admin
          </h2>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3">
          <NavItem
            label="Create Product"
            active={activeTab === "create-product"}
            onClick={() => setActiveTab("create-product")}
            icon={
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            }
          />
          <NavItem
            label="Manage Users"
            active={activeTab === "manage-users"}
            onClick={() => setActiveTab("manage-users")}
            icon={
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            }
          />
        </nav>

        {/* Sidebar footer — logged-in admin info */}
        <div className="px-6 py-4 border-t border-qc-border">
          <p className="text-[10px] tracking-[0.15em] uppercase text-qc-accent mb-0.5">
            Administrator
          </p>
          <p className="text-xs text-qc-muted truncate">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-[11px] text-qc-muted/60 truncate mt-0.5">
            {user?.email}
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10 overflow-y-auto">
        {activeTab === "create-product" ? (
          <CreateProductForm />
        ) : (
          <UsersTable />
        )}
      </main>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      {user?.userType !== "ADMIN" ? <AccessDenied /> : <AdminDashboard />}
    </ProtectedRoute>
  );
}
