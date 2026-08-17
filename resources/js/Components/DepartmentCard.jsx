import { Link } from '@inertiajs/react';
import { ArrowLeft, FolderOpen } from 'lucide-react';
import { departmentMeta } from '@/Components/DepartmentIdentity';

export default function DepartmentCard({ department, index = 0 }) {
    const { gradient, glow, hoverText, icon } = departmentMeta(department.name, index);

    return (
        <Link
            href={route('departments.show', department.id)}
            className="group relative block overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1.5 hover:shadow-card-hover"
        >
            {/* Soft corner glow */}
            <div
                className={
                    'pointer-events-none absolute -end-12 -top-12 h-32 w-32 rounded-full opacity-20 blur-2xl transition duration-300 group-hover:opacity-50 ' +
                    glow
                }
            />

            <div className="relative">
                <div className="flex items-start justify-between gap-3">
                    <span
                        className={
                            'grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-lg ' +
                            gradient
                        }
                    >
                        {icon}
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500 transition group-hover:bg-slate-50">
                        <FolderOpen className="h-3.5 w-3.5" />
                        {department.employees_count} موظف
                    </span>
                </div>

                <h2 className="mt-5 text-lg font-extrabold text-slate-800">
                    {department.name}
                </h2>
                {department.description && (
                    <p className="mt-1.5 line-clamp-2 text-sm font-medium leading-relaxed text-slate-500">
                        {department.description}
                    </p>
                )}

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-xs font-bold text-slate-400 transition group-hover:text-slate-500">
                        استعراض الموظفين
                    </span>
                    <ArrowLeft
                        className={
                            'h-4 w-4 text-slate-300 transition group-hover:-translate-x-1 ' +
                            hoverText
                        }
                    />
                </div>
            </div>
        </Link>
    );
}

