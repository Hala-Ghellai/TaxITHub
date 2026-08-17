import { Link, router } from '@inertiajs/react';
import { Building2, ChevronLeft, Search, UserRound } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/PageHeader';
import EmptyState from '@/Components/EmptyState';

/**
 * Global employees list. The search box matches employee names OR the
 * titles of their assigned records (assignments/tasks).
 */
export default function Index({ employees, filters }) {
    const [search, setSearch] = useState(filters.search ?? '');
    const debounceRef = useRef(null);

    const handleChange = (value) => {
        setSearch(value);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            router.get(route('employees.index'), { search: value || null }, {
                preserveState: true,
                preserveScroll: true,
                only: ['employees', 'filters'],
            });
        }, 350);
    };

    useEffect(() => {
        return () => clearTimeout(debounceRef.current);
    }, []);

    return (
        <AppLayout>
            <PageHeader
                title="الموظفون"
                subtitle="بحث شامل في جميع الموظفين وتكاليفهم ومهامهم"
            />

            <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
                <div className="relative mx-auto max-w-2xl">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => handleChange(e.target.value)}
                        placeholder="ابحث باسم الموظف أو اسم التكليف/المهمة..."
                        className="h-12 w-full rounded-xl border-slate-300 pe-12 ps-4 text-sm font-medium text-slate-700 shadow-sm placeholder:font-normal focus:border-brand-400 focus:ring-brand-400"
                    />
                    <Search className="absolute end-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                </div>
            </div>

            {employees.length === 0 ? (
                <EmptyState
                    title="لا يوجد موظفون مطابقون"
                    hint="جرّب كلمة بحث مختلفة"
                />
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {employees.map((employee) => (
                        <Link
                            key={employee.id}
                            href={route('employees.show', employee.id)}
                            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
                        >
                            <div className="flex items-center gap-3">
                                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-navy-700 text-base font-extrabold text-white">
                                    {employee.name.charAt(0)}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <h3 className="truncate text-sm font-extrabold text-navy-700 group-hover:text-brand-600">
                                        {employee.name}
                                    </h3>
                                    <p className="truncate text-xs font-medium text-slate-500">
                                        {employee.job_title || 'موظف'}
                                    </p>
                                </div>
                                <ChevronLeft className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:-translate-x-0.5 group-hover:text-brand-500" />
                            </div>

                            <div className="mt-4 flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                                    <Building2 className="h-3.5 w-3.5" />
                                    {employee.department || 'بدون إدارة'}
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-md bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-600">
                                    <UserRound className="h-3.5 w-3.5" />
                                    {employee.records_count} سجل
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </AppLayout>
    );
}
