import { Link } from '@inertiajs/react';
import { ArrowLeft, UserRound } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/PageHeader';
import EmptyState from '@/Components/EmptyState';

/**
 * IT department page: shows the employees whose home department is this IT
 * department.
 */
export default function Show({ department, employees }) {
    return (
        <AppLayout>
            <div className="mb-6">
                <Link
                    href={route('home')}
                    className="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 transition hover:text-brand-600"
                >
                    <ArrowLeft className="h-4 w-4" />
                    العودة إلى الأقسام
                </Link>
                <PageHeader
                    title={department.name}
                    subtitle={department.description || 'موظفو هذا القسم'}
                />
            </div>

            {employees.length === 0 ? (
                <EmptyState
                    title="لا يوجد موظفون في هذا القسم"
                    hint="أضف موظفين من لوحة التحكم لإظهارهم هنا"
                />
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {employees.map((employee) => (
                        <Link
                            key={employee.id}
                            href={route('employees.show', employee.id)}
                            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
                        >
                            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-navy-700 text-base font-extrabold text-white">
                                {employee.name.charAt(0)}
                            </span>
                            <div className="min-w-0 flex-1">
                                <h2 className="truncate text-sm font-extrabold text-navy-700 group-hover:text-brand-600">
                                    {employee.name}
                                </h2>
                                <p className="truncate text-xs font-medium text-slate-500">
                                    {employee.job_title || 'موظف'}
                                </p>
                            </div>
                            <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-600">
                                <UserRound className="h-3.5 w-3.5" />
                                {employee.records_count} سجل
                            </span>
                        </Link>
                    ))}
                </div>
            )}
        </AppLayout>
    );
}