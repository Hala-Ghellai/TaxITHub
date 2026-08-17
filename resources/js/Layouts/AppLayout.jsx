import { usePage, Link } from '@inertiajs/react';
import { useState } from 'react';
import { ChevronDown, Menu, Plus, X } from 'lucide-react';
import Brand from '@/Components/Brand';
import NavLink from '@/Components/NavLink';
import FlashMessage from '@/Components/FlashMessage';

/**
 * Shared authenticated layout: top navigation bar with the brand, primary
 * navigation, admin quick-action, and the user menu.
 */
export default function AppLayout({ children }) {
    const user = usePage().props.auth.user;
    const isAdmin = user?.role === 'admin';
    const [menuOpen, setMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="h-1 w-full bg-gradient-to-l from-brand-500 via-brand-600 to-navy-700" />

            <nav className="relative z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between gap-4">
                        <div className="flex items-center gap-8">
                            <Brand />

                            <div className="hidden items-center gap-1 lg:flex">
                                <NavLink href={route('home')} active={route().current('home')}>
                                    الرئيسية
                                </NavLink>
                                <NavLink
                                    href={route('offices.index')}
                                    active={route().current('offices.*')}
                                >
                                    المكاتب
                                </NavLink>
                                <NavLink
                                    href={route('employees.index')}
                                    active={route().current('employees.*')}
                                >
                                    الموظفون
                                </NavLink>
                                {isAdmin && (
                                    <NavLink
                                        href={route('admin.index')}
                                        active={route().current('admin.*') && !route().current('admin.employees.*')}
                                    >
                                        لوحة التحكم
                                    </NavLink>
                                )}
                                {isAdmin && (
                                    <NavLink
                                        href={route('admin.employees.index')}
                                        active={route().current('admin.employees.*')}
                                    >
                                        إدارة الموظفين
                                    </NavLink>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {isAdmin && (
                                <Link
                                    href={route('admin.records.create')}
                                    className="hidden items-center gap-1.5 rounded-lg bg-navy-700 px-4 py-2 text-sm font-bold text-white shadow-card transition hover:bg-navy-800 sm:inline-flex"
                                >
                                    <Plus className="h-4 w-4" />
                                    سجل جديد
                                </Link>
                            )}

                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setUserMenuOpen((v) => !v)}
                                    className="flex items-center gap-2 rounded-full border border-slate-200 py-1 ps-1 pe-3 transition hover:border-brand-200 hover:bg-brand-50"
                                >
                                    <span className="grid h-8 w-8 place-items-center rounded-full bg-navy-700 text-sm font-bold text-white">
                                        {user?.name?.charAt(0) || 'م'}
                                    </span>
                                    <span className="hidden text-start sm:block">
                                        <span className="block max-w-40 truncate text-sm font-bold text-slate-800">
                                            {user?.name}
                                        </span>
                                        <span className="block text-[11px] font-medium text-brand-600">
                                            {isAdmin ? 'مسؤول النظام' : 'مشاهدة فقط'}
                                        </span>
                                    </span>
                                    <ChevronDown className="h-4 w-4 text-slate-400" />
                                </button>

                                {userMenuOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setUserMenuOpen(false)}
                                        />
                                        <div className="absolute end-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card-hover">
                                            <div className="border-b border-slate-100 px-4 py-3 sm:hidden">
                                                <p className="text-sm font-bold text-slate-800">
                                                    {user?.name}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {user?.email}
                                                </p>
                                            </div>
                                            <Link
                                                href={route('profile.edit')}
                                                className="block px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                            >
                                                الملف الشخصي
                                            </Link>
                                            <Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                                className="block w-full px-4 py-2.5 text-start text-sm font-medium text-brand-600 transition hover:bg-brand-50"
                                            >
                                                تسجيل الخروج
                                            </Link>
                                        </div>
                                    </>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() => setMenuOpen((v) => !v)}
                                className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-600 lg:hidden"
                                aria-label="القائمة"
                            >
                                {menuOpen ? (
                                    <X className="h-5 w-5" />
                                ) : (
                                    <Menu className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {menuOpen && (
                    <div className="border-t border-slate-100 px-4 py-3 lg:hidden">
                        <div className="flex flex-col gap-1">
                            <NavLink href={route('home')} active={route().current('home')}>
                                الرئيسية
                            </NavLink>
                            <NavLink
                                href={route('offices.index')}
                                active={route().current('offices.*')}
                            >
                                المكاتب
                            </NavLink>
                            <NavLink
                                href={route('employees.index')}
                                active={route().current('employees.*')}
                            >
                                الموظفون
                            </NavLink>
                            {isAdmin && (
                                <>
                                    <NavLink
                                        href={route('admin.index')}
                                        active={route().current('admin.index')}
                                    >
                                        لوحة التحكم
                                    </NavLink>
                                    <NavLink
                                        href={route('admin.employees.index')}
                                        active={route().current('admin.employees.*')}
                                    >
                                        إدارة الموظفين
                                    </NavLink>
                                    <NavLink
                                        href={route('admin.records.create')}
                                        active={route().current('admin.records.create')}
                                    >
                                        إضافة سجل جديد
                                    </NavLink>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                <FlashMessage />
                {children}
            </main>

            <footer className="mt-10 border-t border-slate-200 bg-white py-5">
                <p className="px-4 text-center text-xs font-medium text-slate-400">
                    نظام إدارة تكاليف العمل ومهام العمل — مصلحة الضرائب الليبية ©{' '}
                    {new Date().getFullYear()}
                </p>
            </footer>
        </div>
    );
}
