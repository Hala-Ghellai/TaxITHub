import { Link, router } from '@inertiajs/react';
import {
    Ban,
    CheckCircle2,
    Pencil,
    Plus,
    Search,
    UserRound,
    UserX,
    Users,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/PageHeader';
import EmptyState from '@/Components/EmptyState';

const ACTION_LABELS = {
    added: 'إضافة',
    updated: 'تعديل',
    disabled: 'تعطيل',
    enabled: 'تفعيل',
};

const ACTION_COLORS = {
    added: 'bg-emerald-50 text-emerald-600',
    updated: 'bg-sky-50 text-sky-600',
    disabled: 'bg-brand-50 text-brand-600',
    enabled: 'bg-emerald-50 text-emerald-600',
};

/**
 * Admin employee management: list of employees with add/edit/disable actions,
 * plus a log of recently added employees and currently disabled ones.
 */
export default function Index({ employees, filters, stats, log }) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? 'all');
    const debounceRef = useRef(null);

    const applyFilters = (next) => {
        router.get(route('admin.employees.index'), next, {
            preserveState: true,
            preserveScroll: true,
            only: ['employees', 'filters', 'stats', 'log'],
        });
    };

    const handleSearch = (value) => {
        setSearch(value);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            applyFilters({ search: value || null, status });
        }, 350);
    };

    const handleStatus = (value) => {
        setStatus(value);
        applyFilters({ search: search || null, status: value });
    };

    const toggleEmployee = (employee) => {
        if (
            confirm(
                employee.is_active
                    ? `هل تريد تعطيل الموظف «${employee.name}»؟ سيُخفى من قوائم الموظفين.`
                    : `هل تريد إعادة تفعيل الموظف «${employee.name}»؟`,
            )
        ) {
            router.post(route('admin.employees.toggle', employee.id));
        }
    };

    useEffect(() => {
        return () => clearTimeout(debounceRef.current);
    }, []);

    const statCards = [
        { label: 'إجمالي الموظفين', value: stats.total, icon: Users, tint: 'bg-navy-50 text-navy-700' },
        { label: 'نشطون', value: stats.active, icon: UserRound, tint: 'bg-emerald-50 text-emerald-600' },
    ];

    return (
        <AppLayout>
            <PageHeader
                title="إدارة الموظفين"
                subtitle="إضافة وتعديل وتعطيل الموظفين مع سجل بالعمليات"
                actions={
                    <Link
                        href={route('admin.employees.create')}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-bold text-white shadow-card transition hover:bg-brand-600"
                    >
                        <Plus className="h-4 w-4" />
                        إضافة موظف
                    </Link>
                }
            />

            {/* Stats */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={card.label}
                            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card"
                        >
                            <span
                                className={
                                    'grid h-12 w-12 shrink-0 place-items-center rounded-2xl ' +
                                    card.tint
                                }
                            >
                                <Icon className="h-6 w-6" />
                            </span>
                            <div>
                                <p className="text-2xl font-extrabold leading-none text-navy-700">
                                    {card.value}
                                </p>
                                <p className="mt-1 text-xs font-bold text-slate-500">{card.label}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Filters */}
            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="ابحث باسم الموظف..."
                            className="h-11 w-full rounded-xl border-slate-300 pe-11 ps-4 text-sm font-medium text-slate-700 shadow-sm placeholder:font-normal focus:border-brand-400 focus:ring-brand-400"
                        />
                        <Search className="absolute end-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                    <div className="flex items-center gap-2">
                        {[
                            { value: 'all', label: 'الكل' },
                            { value: 'active', label: 'النشطون' },
                            { value: 'disabled', label: 'المعطلون' },
                        ].map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => handleStatus(option.value)}
                                className={
                                    'rounded-lg px-3.5 py-2 text-sm font-bold transition ' +
                                    (status === option.value
                                        ? 'bg-navy-700 text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200')
                                }
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Employees list */}
                <div className="lg:col-span-2">
                    {employees.length === 0 ? (
                        <EmptyState
                            title="لا يوجد موظفون مطابقون"
                            hint="جرّب تغيير البحث أو الفلتر"
                        />
                    ) : (
                        <div className="space-y-3">
                            {employees.map((employee) => (
                                <div
                                    key={employee.id}
                                    className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:flex-row sm:items-center"
                                >
                                    <span
                                        className={
                                            'grid h-11 w-11 shrink-0 place-items-center rounded-full text-base font-extrabold text-white ' +
                                            (employee.is_active ? 'bg-navy-700' : 'bg-slate-400')
                                        }
                                    >
                                        {employee.name.charAt(0)}
                                    </span>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="text-sm font-extrabold text-navy-700">
                                                {employee.name}
                                            </h3>
                                            {!employee.is_active && (
                                                <span className="inline-flex items-center gap-1 rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-bold text-brand-600">
                                                    <Ban className="h-3 w-3" />
                                                    معطل
                                                </span>
                                            )}
                                        </div>
                                        <p className="truncate text-xs font-medium text-slate-500">
                                            {employee.job_title || 'موظف'}
                                            <span className="mx-1 text-slate-300">·</span>
                                            {employee.department || 'بدون إدارة'}
                                        </p>
                                    </div>

                                    <span className="shrink-0 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                                        {employee.records_count} سجل
                                    </span>

                                    <div className="flex shrink-0 items-center gap-2">
                                        <Link
                                            href={route('admin.employees.edit', employee.id)}
                                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:border-navy-300 hover:text-navy-700"
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                            تعديل
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => toggleEmployee(employee)}
                                            className={
                                                'inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold transition ' +
                                                (employee.is_active
                                                    ? 'border border-brand-200 bg-brand-50 text-brand-600 hover:bg-brand-100'
                                                    : 'border border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100')
                                            }
                                        >
                                            {employee.is_active ? (
                                                <>
                                                    <Ban className="h-3.5 w-3.5" />
                                                    تعطيل
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                    تفعيل
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar: recent additions + disabled + activity */}
                <div className="space-y-6">
                    {/* Recently added */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
                        <h2 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-navy-700">
                            <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                                <UserRound className="h-4 w-4" />
                            </span>
                            أحدث الموظفين إضافةً
                        </h2>
                        <ul className="space-y-2.5">
                            {log.recentAdded.map((entry) => (
                                <li key={entry.id} className="flex items-center gap-3">
                                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-100 text-xs font-extrabold text-emerald-700">
                                        {entry.employee?.name?.charAt(0)}
                                    </span>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-bold text-slate-700">
                                            {entry.employee?.name}
                                        </p>
                                        <p className="text-[11px] font-medium text-slate-400">
                                            {entry.created_at}
                                        </p>
                                    </div>
                                </li>
                            ))}
                            {log.recentAdded.length === 0 && (
                                <li className="text-sm font-medium text-slate-400">
                                    لا توجد إضافات حديثة
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Disabled */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
                        <h2 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-navy-700">
                            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-50 text-brand-600">
                                <UserX className="h-4 w-4" />
                            </span>
                            الموظفون المعطلون
                        </h2>
                        <ul className="space-y-2.5">
                            {log.disabled.map((employee) => (
                                <li key={employee.id} className="flex items-center gap-3">
                                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-200 text-xs font-extrabold text-slate-500">
                                        {employee.name.charAt(0)}
                                    </span>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-bold text-slate-700">
                                            {employee.name}
                                        </p>
                                        <p className="text-[11px] font-medium text-brand-500">
                                            عُطّل في {employee.disabled_at}
                                        </p>
                                    </div>
                                </li>
                            ))}
                            {log.disabled.length === 0 && (
                                <li className="text-sm font-medium text-slate-400">
                                    لا يوجد موظفون معطلون
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Activity log */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
                        <h2 className="mb-3 text-sm font-extrabold text-navy-700">
                            سجل العمليات
                        </h2>
                        <ul className="space-y-2.5">
                            {log.activities.map((entry) => (
                                <li key={entry.id} className="flex items-start gap-2.5">
                                    <span
                                        className={
                                            'mt-0.5 inline-flex shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold ' +
                                            (ACTION_COLORS[entry.action] || 'bg-slate-100 text-slate-500')
                                        }
                                    >
                                        {ACTION_LABELS[entry.action] || entry.action}
                                    </span>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-slate-700">
                                            {entry.employee?.name}
                                            <span className="mx-1 font-medium text-slate-400">
                                                {entry.performer ? `بواسطة ${entry.performer}` : ''}
                                            </span>
                                        </p>
                                        <p className="text-[11px] font-medium text-slate-400">
                                            {entry.created_at}
                                        </p>
                                    </div>
                                </li>
                            ))}
                            {log.activities.length === 0 && (
                                <li className="text-sm font-medium text-slate-400">
                                    لا توجد عمليات بعد
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}