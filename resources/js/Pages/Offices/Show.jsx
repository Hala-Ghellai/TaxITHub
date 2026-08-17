import { Link } from '@inertiajs/react';
import { ArrowLeft, ClipboardList, ListTodo, Building2 } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/PageHeader';

/**
 * Office page: shows the office's tax departments (الأقسام) and the two
 * record-type selector cards (Work Assignments and Work Tasks) with counts.
 */
export default function Show({ office, departments, assignment_count, task_count }) {
    const options = [
        {
            type: 'assignment',
            title: 'تكاليف العمل',
            subtitle: 'خطابات التكليف والندب الرسمية الموجهة للموظفين',
            count: assignment_count,
            icon: ClipboardList,
            color: 'brand',
        },
        {
            type: 'task',
            title: 'مهام العمل',
            subtitle: 'المهام التشغيلية المكلف بها الموظفون',
            count: task_count,
            icon: ListTodo,
            color: 'navy',
        },
    ];

    return (
        <AppLayout>
            <div className="mb-6">
                <Link
                    href={route('offices.index')}
                    className="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 transition hover:text-brand-600"
                >
                    <ArrowLeft className="h-4 w-4" />
                    العودة إلى المكاتب
                </Link>
                <PageHeader
                    title={office.name}
                    subtitle={office.directed_to}
                />
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {options.map((option) => {
                    const Icon = option.icon;
                    const isBrand = option.color === 'brand';

                    return (
                        <Link
                            key={option.type}
                            href={route('records.index', {
                                office: office.id,
                                type: option.type,
                            })}
                            className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-7 shadow-card transition duration-300 hover:-translate-y-1.5 hover:shadow-card-hover"
                        >
                            <div
                                className={
                                    'pointer-events-none absolute -end-12 -top-12 h-36 w-36 rounded-full opacity-20 blur-2xl transition duration-300 group-hover:opacity-50 ' +
                                    (isBrand ? 'bg-brand-400/30' : 'bg-navy-400/30')
                                }
                            />

                            <div className="relative">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <span
                                            className={
                                                'grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-lg ' +
                                                (isBrand
                                                    ? 'from-brand-500 to-brand-600'
                                                    : 'from-navy-600 to-navy-800')
                                            }
                                        >
                                            <Icon className="h-7 w-7" />
                                        </span>
                                        <div>
                                            <h2
                                                className={
                                                    'text-lg font-extrabold ' +
                                                    (isBrand ? 'text-brand-600' : 'text-navy-700')
                                                }
                                            >
                                                {option.title}
                                            </h2>
                                            <p className="mt-1 text-sm font-medium text-slate-500">
                                                {option.subtitle}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                                    <span
                                        className={
                                            'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-extrabold ' +
                                            (isBrand
                                                ? 'bg-brand-50 text-brand-600'
                                                : 'bg-navy-50 text-navy-700')
                                        }
                                    >
                                        {option.count}
                                        <span className="text-xs font-medium text-slate-500">سجل</span>
                                    </span>
                                    <ArrowLeft
                                        className={
                                            'h-4 w-4 text-slate-300 transition group-hover:-translate-x-1 ' +
                                            (isBrand
                                                ? 'group-hover:text-brand-500'
                                                : 'group-hover:text-navy-500')
                                        }
                                    />
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {departments.length > 0 && (
                <section className="mt-8">
                    <h2 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-navy-700">
                        <span className="grid h-8 w-8 place-items-center rounded-lg bg-navy-50 text-navy-700">
                            <Building2 className="h-4 w-4" />
                        </span>
                        أقسام المكتب
                        <span className="text-xs font-medium text-slate-400">
                            ({departments.length})
                        </span>
                    </h2>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {departments.map((department) => (
                            <div
                                key={department.id}
                                className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-card"
                            >
                                <p className="min-w-0 truncate text-sm font-bold text-slate-700">
                                    {department.name}
                                </p>
                                <span
                                    className={
                                        'shrink-0 rounded-md px-2 py-0.5 text-[11px] font-bold ' +
                                        (department.state === 'مفعل'
                                            ? 'bg-emerald-50 text-emerald-600'
                                            : 'bg-slate-100 text-slate-500')
                                    }
                                >
                                    {department.state}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </AppLayout>
    );
}