import { router, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/PageHeader';
import FilterBar from '@/Components/FilterBar';
import RecordsTable from '@/Components/RecordsTable';

/**
 * Records table page for one office + one type. Filters are combined
 * with AND logic and applied server-side, updated live (debounced).
 */
export default function Index({ office, type, type_label, records, filters, availableYears }) {
    const [values, setValues] = useState(filters);
    const debounceRef = useRef(null);

    const applyFilters = (next) => {
        router.get(
            route('records.index', { office: office.id, type }),
            next,
            {
                preserveState: true,
                preserveScroll: true,
                only: ['records', 'filters'],
            },
        );
    };

    const handleChange = (patch) => {
        const next = { ...values, ...patch };
        setValues(next);

        const hasText = Object.keys(patch).some(
            (key) => ['employee_name'].includes(key),
        );

        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => applyFilters(next), hasText ? 350 : 0);
    };

    useEffect(() => {
        return () => clearTimeout(debounceRef.current);
    }, []);

    return (
        <AppLayout>
            <Link
                href={route('offices.show', office.id)}
                className="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 transition hover:text-brand-600"
            >
                <ArrowLeft className="h-4 w-4" />
                العودة إلى {office.name}
            </Link>

            <PageHeader
                title={`${type_label} — ${office.directed_to}`}
                subtitle={`عرض أحدث ${type_label} الموجهة لهذه الإدارة، مرتبة حسب التاريخ`}
            />

            <FilterBar
                filters={values}
                onChange={handleChange}
                availableYears={availableYears}
                showOffice={false}
            />

            <p className="mb-3 text-sm font-bold text-slate-500">
                عدد النتائج: <span className="text-brand-600">{records.length}</span>
            </p>

            <RecordsTable records={records} />
        </AppLayout>
    );
}