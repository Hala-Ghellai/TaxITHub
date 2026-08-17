import { ChevronDown, RotateCcw, Search, UserSearch } from 'lucide-react';

const MONTHS = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];

function Select({ value, onChange, placeholder, children, disabled = false }) {
    return (
        <div className="relative">
            <select
                value={value ?? ''}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value || null)}
                className="h-10 w-full appearance-none rounded-lg border-slate-300 bg-white ps-3 pe-9 text-sm font-medium text-slate-700 shadow-sm focus:border-brand-400 focus:ring-brand-400"
            >
                <option value="">{placeholder}</option>
                {children}
            </select>
            <ChevronDown className="pointer-events-none absolute end-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
    );
}

/**
 * Reusable live filter bar. All filters combine with AND logic and are
 * pushed up to the parent (which performs debounced server-side requests).
 */
export default function FilterBar({
    filters = {},
    onChange,
    offices = [],
    availableYears = [],
    showSearch = false,
    showEmployeeName = true,
    showOffice = true,
    showYearMonth = true,
    showType = false,
    types = [
        { value: 'assignment', label: 'تكاليف العمل' },
        { value: 'task', label: 'مهام العمل' },
    ],
}) {
    const hasFilters = Object.values(filters).some((v) => v !== null && v !== undefined && v !== '');

    const inputClass =
        'h-10 w-full rounded-lg border-slate-300 bg-white pe-10 text-sm font-medium text-slate-700 shadow-sm placeholder:font-normal focus:border-brand-400 focus:ring-brand-400';

    return (
        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                {showSearch && (
                    <div className="relative sm:col-span-2 lg:col-span-1 xl:col-span-2">
                        <input
                            type="text"
                            value={filters.search ?? ''}
                            onChange={(e) => onChange({ search: e.target.value || null })}
                            placeholder="ابحث بالاسم أو العنوان..."
                            className={inputClass}
                        />
                        <Search className="absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                )}

                {showEmployeeName && (
                    <div className="relative">
                        <input
                            type="text"
                            value={filters.employee_name ?? ''}
                            onChange={(e) => onChange({ employee_name: e.target.value || null })}
                            placeholder="اسم الموظف"
                            className={inputClass}
                        />
                        <UserSearch className="absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                )}

                {showType && (
                    <Select
                        value={filters.type}
                        onChange={(value) => onChange({ type: value })}
                        placeholder="النوع"
                    >
                        {types.map((type) => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </Select>
                )}

                {showOffice && (
                    <Select
                        value={filters.office_id}
                        onChange={(value) => onChange({ office_id: value })}
                        placeholder="الإدارة الموجّه لها"
                    >
                        {offices.map((office) => (
                            <option key={office.id} value={office.id}>
                                {office.name}
                            </option>
                        ))}
                    </Select>
                )}

                {showYearMonth && (
                    <>
                        <Select
                            value={filters.year}
                            onChange={(value) => onChange({ year: value })}
                            placeholder="السنة"
                        >
                            {availableYears.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </Select>
                        <Select
                            value={filters.month}
                            onChange={(value) => onChange({ month: value })}
                            placeholder="الشهر"
                        >
                            {MONTHS.map((month, index) => (
                                <option key={month} value={index + 1}>
                                    {month}
                                </option>
                            ))}
                        </Select>
                    </>
                )}

                {hasFilters && (
                    <button
                        type="button"
                        onClick={() => onChange(resetFilters(filters))}
                        className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 text-sm font-bold text-slate-500 transition hover:bg-slate-50"
                    >
                        <RotateCcw className="h-4 w-4" />
                        مسح التصفية
                    </button>
                )}
            </div>
        </div>
    );
}

function resetFilters(filters) {
    return Object.fromEntries(Object.keys(filters).map((key) => [key, null]));
}
