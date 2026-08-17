import { router, Link } from '@inertiajs/react';
import { ArrowLeft, Building2, BriefcaseBusiness } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import FilterBar from '@/Components/FilterBar';
import RecordsTable from '@/Components/RecordsTable';

/**
 * Employee profile: every work assignment and task assigned to the employee,
 * across all departments, with filters.
 */
export default function Show({ employee, records, filters, offices, availableYears }) {
    const [values, setValues] = useState(filters);
    const debounceRef = useRef(null);

    const applyFilters = (next) => {
        router.get(route('employees.show', employee.id), next, {
            preserveState: true,
            preserveScroll: true,
            only: ['records', 'filters'],
        });
    };

    const handleChange = (patch) => {
        const next = { ...values, ...patch };
        setValues(next);

        const hasText = Object.keys(patch).some((key) => ['search'].includes(key));
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => applyFilters(next), hasText ? 350 : 0);
    };

    useEffect(() => {
        return () => clearTimeout(debounceRef.current);
    }, []);

    return (
        <AppLayout>
            <Link
                href={route('employees.index')}
                className="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 transition hover:text-brand-600"
            >
                <ArrowLeft className="h-4 w-4" />
                العودة إلى الموظفين
            </Link>

            <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
                <div className="h-1.5 w-full bg-gradient-to-l from-brand-500 via-brand-600 to-navy-700" />
                <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-navy-700 text-xl font-extrabold text-white">
                            {employee.name.charAt(0)}
                        </span>
                        <div>
                            <h1 className="text-2xl font-extrabold text-navy-700">
                                {employee.name}
                            </h1>
                            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm font-medium text-slate-500">
                                <span className="inline-flex items-center gap-1.5">
                                    <BriefcaseBusiness className="h-4 w-4 text-slate-400" />
                                    {employee.job_title || 'موظف'}
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <Building2 className="h-4 w-4 text-slate-400" />
                                    {employee.department || 'بدون إدارة'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <span className="inline-flex w-fit items-center gap-2 rounded-xl bg-brand-50 px-4 py-2 text-sm font-extrabold text-brand-600">
                        <span className="text-2xl">{records.length}</span>
                        تكليف ومهمة
                    </span>
                </div>
            </div>

            <FilterBar
                filters={values}
                onChange={handleChange}
                offices={offices}
                availableYears={availableYears}
                showSearch
                showEmployeeName={false}
                showType
                types={[
                    { value: 'assignment', label: 'تكاليف العمل' },
                    { value: 'task', label: 'مهام العمل' },
                ]}
            />

            <RecordsTable
                records={records}
                showEmployees={false}
                emptyTitle="لا توجد تكاليف أو مهام لهذا الموظف"
                emptyHint="جرّب تعديل عوامل التصفية"
            />
        </AppLayout>
    );
}
