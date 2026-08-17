import { Link } from '@inertiajs/react';
import { Building2, Calendar, PenLine, Trash2, UserRound } from 'lucide-react';
import PdfButton from '@/Components/PdfButton';
import EmptyState from '@/Components/EmptyState';

function EmployeeChips({ employees, limit = 2 }) {
    if (!employees?.length) {
        return <span className="text-sm text-slate-400">—</span>;
    }

    const visible = employees.slice(0, limit);
    const extra = employees.length - visible.length;

    return (
        <div className="flex flex-wrap items-center gap-1.5">
            {visible.map((employee) => (
                <Link
                    key={employee.id}
                    href={route('employees.show', employee.id)}
                    className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-navy-700 transition hover:bg-brand-50 hover:text-brand-600"
                >
                    {employee.name}
                </Link>
            ))}
            {extra > 0 && (
                <span className="rounded-md bg-navy-50 px-2 py-0.5 text-xs font-bold text-navy-500">
                    +{extra}
                </span>
            )}
        </div>
    );
}

function Actions({ record }) {
    return (
        <div className="flex items-center gap-1">
            <Link
                href={route('admin.records.edit', record.id)}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-600 transition hover:border-navy-200 hover:bg-navy-50 hover:text-navy-700"
            >
                <PenLine className="h-3.5 w-3.5" />
                تعديل
            </Link>
            <Link
                href={route('admin.records.destroy', record.id)}
                method="delete"
                as="button"
                onBefore={() => window.confirm('هل أنت متأكد من حذف هذا السجل؟')}
                className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-bold text-brand-600 transition hover:bg-brand-50"
            >
                <Trash2 className="h-3.5 w-3.5" />
                حذف
            </Link>
        </div>
    );
}

/**
 * Responsive records table: full table on desktop, stacked cards on small
 * screens. Columns adapt via the props below.
 */
export default function RecordsTable({
    records,
    showDepartment = true,
    showEmployees = true,
    showActions = false,
    emptyTitle = 'لا توجد سجلات',
    emptyHint = 'جرّب تعديل عوامل التصفية.',
}) {
    if (!records?.length) {
        return <EmptyState title={emptyTitle} hint={emptyHint} />;
    }

    const columns = [
        { key: 'title', label: 'العنوان', className: 'min-w-56' },
        { key: 'date', label: 'التاريخ', className: 'min-w-32' },
        ...(showDepartment ? [{ key: 'directed_to', label: 'الإدارة الموجّه لها', className: 'min-w-40' }] : []),
        ...(showEmployees ? [{ key: 'employees', label: 'الموظفون', className: 'min-w-44' }] : []),
        { key: 'pdf', label: 'ملف المستند', className: 'min-w-28' },
        { key: 'tahmish', label: 'التهميش', className: 'min-w-28' },
        ...(showActions ? [{ key: 'actions', label: 'إجراءات', className: 'min-w-32' }] : []),
    ];

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
            {/* Desktop table */}
            <div className="hidden overflow-x-auto lg:block">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b-2 border-slate-200 bg-slate-50">
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={`whitespace-nowrap px-4 py-3.5 text-start text-xs font-extrabold text-slate-500 ${column.className}`}
                                >
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {records.map((record) => (
                            <tr key={record.id} className="align-top transition hover:bg-slate-50/60">
                                <td className="px-4 py-3.5">
                                    <p className="font-bold text-navy-700">{record.title}</p>
                                    <p className="mt-0.5 text-xs font-medium text-slate-400">
                                        {record.type_label}
                                    </p>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3.5 align-middle font-medium text-slate-600">
                                    {record.date_label}
                                </td>
                                {showDepartment && (
                                    <td className="px-4 py-3.5">
                                        <span className="inline-flex items-center gap-1.5 rounded-md bg-navy-50 px-2.5 py-1 text-xs font-bold text-navy-700">
                                            <Building2 className="h-3.5 w-3.5" />
                                            {record.directed_to}
                                        </span>
                                    </td>
                                )}
                                {showEmployees && (
                                    <td className="px-4 py-3.5">
                                        <EmployeeChips employees={record.employees} />
                                    </td>
                                )}
                                <td className="px-4 py-3.5 align-middle">
                                    <PdfButton
                                        url={record.pdf_url}
                                        label="فتح PDF"
                                        variant="document"
                                    />
                                </td>
                                <td className="px-4 py-3.5 align-middle">
                                    <PdfButton
                                        url={record.tahmish_url}
                                        label="التهميش"
                                        variant="tahmish"
                                    />
                                </td>
                                {showActions && (
                                    <td className="px-4 py-3.5">
                                        <Actions record={record} />
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile stacked cards */}
            <div className="divide-y divide-slate-100 lg:hidden">
                {records.map((record) => (
                    <div key={record.id} className="space-y-3 p-4">
                        <div>
                            <p className="font-bold text-navy-700">{record.title}</p>
                            <p className="mt-0.5 text-xs font-medium text-brand-600">
                                {record.type_label}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div>
                                <p className="text-[11px] font-extrabold text-slate-400">
                                    التاريخ
                                </p>
                                <p className="mt-0.5 flex items-center gap-1.5 text-sm font-medium text-slate-700">
                                    <Calendar className="h-4 w-4 shrink-0 text-slate-400" />
                                    {record.date_label}
                                </p>
                            </div>
                            {showDepartment && (
                                <div>
                                    <p className="text-[11px] font-extrabold text-slate-400">
                                        الإدارة الموجّه لها
                                    </p>
                                    <p className="mt-0.5 flex items-center gap-1.5 text-sm font-medium text-slate-700">
                                        <Building2 className="h-4 w-4 shrink-0 text-slate-400" />
                                        {record.directed_to}
                                    </p>
                                </div>
                            )}
                            {showEmployees && (
                                <div className="sm:col-span-2">
                                    <p className="text-[11px] font-extrabold text-slate-400">
                                        الموظفون
                                    </p>
                                    <div className="mt-0.5 flex items-start gap-1.5 text-sm font-medium text-slate-700">
                                        <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                                        <div className="flex flex-wrap items-center gap-1.5">
                                            <EmployeeChips employees={record.employees} limit={3} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <PdfButton url={record.pdf_url} label="ملف المستند" variant="document" />
                            <PdfButton url={record.tahmish_url} label="التهميش" variant="tahmish" />
                            {showActions && <Actions record={record} />}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
