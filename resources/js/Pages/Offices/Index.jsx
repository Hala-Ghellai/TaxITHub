import { Link } from '@inertiajs/react';
import { Building2, ChevronLeft } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/PageHeader';

/**
 * Offices browse page: the tax-authority structure (managements -> offices).
 * Each office links to its page where records are browsed by type.
 */
export default function Index({ managements }) {
    return (
        <AppLayout>
            <PageHeader
                title="المكاتب"
                subtitle="تصفح هيكل مصلحة الضرائب الليبية حسب الإدارة والمكتب"
            />

            {managements.length === 0 ? (
                <p className="py-10 text-center text-sm font-medium text-slate-400">
                    لا توجد إدارات بعد
                </p>
            ) : (
                <div className="space-y-8">
                    {managements.map((management) => (
                        <div key={management.id}>
                            <h2 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-navy-700">
                                <span className="grid h-7 w-7 place-items-center rounded-lg bg-navy-50 text-navy-700">
                                    <Building2 className="h-3.5 w-3.5" />
                                </span>
                                {management.name}
                                <span className="text-xs font-medium text-slate-400">
                                    ({management.offices.length} مكتب)
                                </span>
                            </h2>

                            {management.offices.length === 0 ? (
                                <p className="text-xs font-medium text-slate-400">
                                    لا توجد مكاتب لهذه الإدارة
                                </p>
                            ) : (
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {management.offices.map((office) => (
                                        <Link
                                            key={office.id}
                                            href={route('offices.show', office.id)}
                                            className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card-hover"
                                        >
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-extrabold text-slate-800 group-hover:text-brand-600">
                                                    {office.name}
                                                </p>
                                                <p className="mt-0.5 text-xs font-medium text-slate-400">
                                                    {office.records_count} سجل
                                                </p>
                                            </div>
                                            <ChevronLeft className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:-translate-x-0.5 group-hover:text-brand-500" />
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </AppLayout>
    );
}