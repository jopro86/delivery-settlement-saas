// components/layouts/AppLayout.tsx (프로필 메뉴 추가 버전)
'use client';

import React, { ReactNode, createContext, useContext, useState, Fragment } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router'; // pages 디렉토리에서는 useRouter 사용
import { Home, FileText, UserCog } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { UserCircleIcon } from '@heroicons/react/24/solid';

// Auth Context 및 Provider 생성
interface User {
    id: string;
    name: string;
    role: 'RIDER' | 'ADMIN' | 'SUPER_ADMIN';
}

interface AuthContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>({
        id: '1',
        name: '조호상',
        role: 'RIDER' // 기본값으로 RIDER 설정
    });

    const login = (user: User) => setUser(user);
    const logout = () => setUser(null);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// --- ProfileDropdown 컴포넌트 새로 추가 ---
const ProfileDropdown = () => {
    const { user, logout } = useAuth();
    
    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button className="flex items-center rounded-full bg-gray-100 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    <span className="sr-only">Open user menu</span>
                    <UserCircleIcon className="h-9 w-9" aria-hidden="true" />
                </Menu.Button>
            </div>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                    <div className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="truncate text-sm text-gray-500">test@example.com</p>
                    </div>
                    <div className="py-1">
                        <Menu.Item>
                            {({ active }) => (
                                <a
                                    href="#"
                                    className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700`}
                                >
                                    내 정보 설정
                                </a>
                            )}
                        </Menu.Item>
                    </div>
                    <div className="py-1">
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={logout}
                                    className={`${active ? 'bg-gray-100' : ''} block w-full text-left px-4 py-2 text-sm text-red-600`}
                                >
                                    로그아웃
                                </button>
                            )}
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
};

export default function AppLayout({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const router = useRouter();
    const pathname = router.pathname; // pages 디렉토리에서는 router.pathname 사용
    if (!user) return null;

    const navLinks = [
        { href: '/dashboard', label: '홈', icon: Home, roles: ['RIDER', 'ADMIN', 'SUPER_ADMIN'] },
        { href: '/rider/statement', label: '급여 확인', icon: FileText, roles: ['RIDER', 'SUPER_ADMIN'] },
        { href: '/admin/dashboard', label: '관리자', icon: UserCog, roles: ['ADMIN', 'SUPER_ADMIN'] },
    ];

    return (
        <div className="bg-gray-100 min-h-screen">
            <header className="bg-white shadow-sm sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/dashboard" className="text-xl font-bold text-blue-600">배달TIPPICK</Link>
                        <nav className="flex items-center gap-4">
                            {navLinks.map(link => {
                                // 사용자의 역할이 링크를 볼 수 있는 역할 목록에 포함되는지 확인
                                if (user.role && link.roles.includes(user.role)) {
                                    const isActive = pathname.startsWith(link.href);
                                    return (
                                        <Link key={link.label} href={link.href}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors text-sm
                                                ${isActive ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-600 hover:bg-gray-100'}`
                                            }>
                                            <link.icon className="w-5 h-5" />
                                            {link.label}
                                        </Link>
                                    );
                                }
                                return null;
                            })}
                            <div className="w-px h-6 bg-gray-200"></div> {/* 구분선 */}
                            <ProfileDropdown />
                        </nav>
                    </div>
                </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
        </div>
    );
}