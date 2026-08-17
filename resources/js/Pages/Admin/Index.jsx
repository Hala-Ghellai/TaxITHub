import { Link, router } from '@inertiajs/react';
import { ClipboardList, ListTodo, Plus, UserRound, FileStack } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/PageHeader';
import FilterBar from '@/Components/FilterBar';
import RecordsTable from '@/Components/RecordsTable';

/**
 * Admin dashboard: stats, filterable list of every record, and management
 * actions (edit/delete). Creating a new record starts from this page.
 */
export default function Index({ records, filters, stats, offices, availableYears }) {
    const [values, setValues] = useState(filters);
    const debounceRef = useRef(null);

    const applyFilters = (next) => {
        router.get(route('admin.index'), next, {
            preserveState: true,
            preserveScroll: true,
            only: ['records', 'filters'],
        });
    };

    const handleChange = (patch) => {
        const next = { ...values, ...patch };
        setValues(next);

        const hasText = Object.keys(patch).some((key) => ['search', 'employee_name'].includes(key));
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => applyFilters(next), hasText ? 350 : 0);
    };

    useEffect(() => {
        return () => clearTimeout(debounceRef.current);
    }, []);

    const cards = [
        { label: 'إجمالي السجلات', value: stats.total, icon: FileStack, color: 'navy' },
        { label: 'تكاليف العمل', value: stats.assignments, icon: ClipboardList, color: 'brand' },
        { label: 'مهام العمل', value: stats.tasks, icon: ListTodo, color: 'brand' },
        { label: 'الموظفون', value: stats.employees, icon: UserRound, color: 'navy' },
    ];

    return (
        <AppLayout>
            <PageHeader
                title="لوحة التحكم"
                subtitle="إدارة جميع سجلات تكاليف العمل ومهام العمل"
                actions={
                    <Link
                        href={route('admin.records.create')}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-bold text-white shadow-card transition hover:bg-brand-600"
                    >
                        <Plus className="h-4 w-4" />
                        إضافة سجل جديد
                    </Link>
                }
            />

            <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {cards.map((card) => {
                    const Icon = card.icon;
                    const isBrand = card.color === 'brand';
                    return (
                        <div
                            key={card.label}
                            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card"
                        >
                            <span
                                className={
                                    'grid h-10 w-10 place-items-center rounded-xl ' +
                                    (isBrand
                                        ? 'bg-brand-50 text-brand-600'
                                        : 'bg-navy-50 text-navy-700')
                                }
                            >
                                <Icon className="h-5 w-5" />
                            </span>
                            <p className="mt-3 text-2xl font-extrabold text-navy-700">
                                {card.value}
                            </p>
                            <p className="text-sm font-bold text-slate-500">{card.label}</p>
                        </div>
                    );
                })}
            </div>

            <FilterBar
                filters={values}
                onChange={handleChange}
                offices={offices}
                availableYears={availableYears}
                showSearch
                showType
                types={[
                    { value: 'assignment', label: 'تكاليف العمل' },
                    { value: 'task', label: 'مهام العمل' },
                ]}
            />

            <p className="mb-3 text-sm font-bold text-slate-500">
                عدد النتائج: <span className="text-brand-600">{records.length}</span>
            </p>

            <RecordsTable records={records} showActions />
        </AppLayout>
    );
}
