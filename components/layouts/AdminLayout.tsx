// components/layouts/AdminLayout.tsx (관리자 전용 탭 네비게이션)
'use client';
import Link from 'next/link';
import { useRouter } from 'next/router'; // pages 디렉토리에서는 useRouter 사용
import { ReactNode } from 'react';
import { LayoutDashboard, Users, ClipboardList, DollarSign } from 'lucide-react';

export default function AdminLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = router.pathname; // pages 디렉토리에서는 router.pathname 사용
    
    const adminNavs = [
        { href: '/admin/dashboard', label: '관리자 홈', icon: LayoutDashboard },
        { href: '/admin/payroll', label: '기사 급여 관리', icon: Users },
        { href: '/admin/branch-profit', label: '지점 수익내역', icon: ClipboardList },
        { href: '/admin/payment-management', label: '급여 지급 관리', icon: DollarSign },
    ];

    return (
        <div>
            <div className="mb-8 border-b border-gray-200">
                <nav className="flex items-center gap-2 -mb-px">
                    {adminNavs.map(nav => {
                        const isActive = pathname === nav.href;
                        return (
                            <Link key={nav.label} href={nav.href}
                                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-semibold transition-colors
                                    ${isActive 
                                        ? 'border-blue-600 text-blue-600' 
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                                    }>
                                <nav.icon className="w-5 h-5" />
                                {nav.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <div>{children}</div>
        </div>
    );
} 