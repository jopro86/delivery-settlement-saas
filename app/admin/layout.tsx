import AdminLayout from "@/components/layouts/AdminLayout";
import { ReactNode } from "react";

export default function LayoutForAdminPages({ children }: { children: ReactNode }) {
    return (
        <AdminLayout>
            {children}
        </AdminLayout>
    );
} 