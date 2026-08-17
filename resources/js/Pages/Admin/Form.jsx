import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Check, ChevronDown, FileText, Search, StickyNote, Upload, X } from 'lucide-react';
import { useMemo, useEffect, useRef, useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/PageHeader';
import { departmentMeta } from '@/Components/DepartmentIdentity';

function FileInput({ id, label, icon: Icon, value, onChange, error, currentUrl, hint }) {
    const [fileName, setFileName] = useState(null);

    return (
        <div>
            <label
                htmlFor={id}
                className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-3 transition hover:border-brand-400 hover:bg-brand-50/40"
            >
                <span className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-white text-brand-500 shadow-sm">
                        <Icon className="h-4 w-4" />
                    </span>
                    <span>
                        <span className="block text-sm font-bold text-navy-700">{label}</span>
                        <span className="block text-xs font-medium text-slate-400">
                            {fileName || hint}
                        </span>
                    </span>
                </span>
                <Upload className="h-5 w-5 text-slate-400" />
            </label>
            <input
                id={id}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    setFileName(file?.name ?? null);
                    onChange(file);
                }}
            />
            {value && (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                    <Check className="h-3.5 w-3.5" />
                    تم اختيار: {value.name}
                </p>
            )}
            {!value && currentUrl && (
                <p className="mt-1.5 text-xs font-bold text-navy-600">
                    الملف الحالي:{' '}
                    <a href={currentUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-brand-600">
                        فتح الملف
                    </a>
                </p>
            )}
            {error && <p className="mt-1.5 text-xs font-bold text-brand-600">{error}</p>}
        </div>
    );
}

function EmployeePicker({ groups, selected, onToggle, error }) {
    const [query, setQuery] = useState('');
    const [openIds, setOpenIds] = useState(() => new Set());

    const filtered = useMemo(() => {
        const term = query.trim();
        if (!term) {
            return groups;
        }
        return groups
            .map((group) => ({
                ...group,
                employees: group.employees.filter((employee) =>
                    employee.name.includes(term),
                ),
            }))
            .filter((group) => group.employees.length > 0);
    }, [groups, query]);

    // When searching, auto-expand the matching departments so results are visible.
    useEffect(() => {
        if (query.trim()) {
            setOpenIds(new Set(filtered.map((group) => group.department_id)));
        }
    }, [query, filtered]);

    const toggleOpen = (departmentId) => {
        setOpenIds((current) => {
            const next = new Set(current);
            if (next.has(departmentId)) {
                next.delete(departmentId);
            } else {
                next.add(departmentId);
            }
            return next;
        });
    };

    return (
        <div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="بحث عن موظف..."
                        className="h-10 w-full rounded-lg border-slate-300 pe-10 ps-3 text-sm font-medium shadow-sm focus:border-brand-400 focus:ring-brand-400"
                    />
                    <Search className="absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
            </div>

            <p className="mt-2 text-xs font-bold text-slate-500">
                تم اختيار {selected.length} موظف
            </p>

            <div className="mt-3 space-y-3">
                {filtered.map((group, groupIndex) => {
                    const meta = departmentMeta(group.department, groupIndex);
                    const isOpen = openIds.has(group.department_id);
                    const allSelected =
                        group.employees.length > 0 &&
                        group.employees.every((employee) => selected.includes(employee.id));

                    return (
                        <div
                            key={group.department_id}
                            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                        >
                            {/* Clickable department header */}
                            <button
                                type="button"
                                onClick={() => toggleOpen(group.department_id)}
                                className={
                                    'flex w-full items-center justify-between gap-3 px-4 py-3 text-start transition ' +
                                    meta.tint
                                }
                            >
                                <div className="flex items-center gap-2.5">
                                    <span
                                        className={
                                            'grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br text-white shadow-sm ' +
                                            meta.gradient
                                        }
                                    >
                                        {meta.icon}
                                    </span>
                                    <div>
                                        <p className="text-sm font-extrabold">{group.department}</p>
                                        <p className="text-[11px] font-bold opacity-70">
                                            {group.employees.length} موظف
                                        </p>
                                    </div>
                                </div>
                                <span className="flex items-center gap-2">
                                    {selected.some((id) =>
                                        group.employees.some((employee) => employee.id === id),
                                    ) && (
                                        <span className="rounded-md bg-white/70 px-2 py-0.5 text-[11px] font-extrabold">
                                            {group.employees.filter((employee) =>
                                                selected.includes(employee.id),
                                            ).length}{' '}
                                            مختار
                                        </span>
                                    )}
                                    <ChevronDown
                                        className={
                                            'h-5 w-5 transition-transform duration-200 ' +
                                            (isOpen ? 'rotate-180' : '')
                                        }
                                    />
                                </span>
                            </button>

                            {isOpen && (
                                <div className="border-t border-slate-100">
                                    <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/60 px-4 py-2">
                                        <p className="text-[11px] font-bold text-slate-500">
                                            قائمة الموظفين
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => onToggle(group.employees.map((e) => e.id), allSelected)}
                                            className="rounded-md bg-white px-2.5 py-1 text-[11px] font-bold text-brand-600 shadow-sm transition hover:bg-brand-50"
                                        >
                                            {allSelected ? 'إلغاء تحديد الكل' : 'تحديد الكل'}
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 gap-1.5 bg-slate-50/60 p-3 sm:grid-cols-2">
                                        {group.employees.map((employee) => {
                                            const isSelected = selected.includes(employee.id);
                                            return (
                                                <button
                                                    key={employee.id}
                                                    type="button"
                                                    onClick={() =>
                                                        onToggle([employee.id], isSelected)
                                                    }
                                                    className={
                                                        'flex items-center gap-2.5 rounded-xl border px-3 py-2 text-start text-sm transition ' +
                                                        (isSelected
                                                            ? 'border-brand-400 bg-brand-500 text-white shadow-sm'
                                                            : 'border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:shadow-sm')
                                                    }
                                                >
                                                    <span
                                                        className={
                                                            'grid h-5 w-5 shrink-0 place-items-center rounded-md ' +
                                                            (isSelected
                                                                ? 'bg-white/25'
                                                                : 'border border-slate-300 bg-slate-50')
                                                        }
                                                    >
                                                        {isSelected && <Check className="h-3 w-3" />}
                                                    </span>
                                                    <span className="min-w-0">
                                                        <span className="block truncate font-bold">
                                                            {employee.name}
                                                        </span>
                                                        {employee.job_title && (
                                                            <span
                                                                className={
                                                                    'block truncate text-[11px] font-medium ' +
                                                                    (isSelected ? 'text-white/80' : 'text-slate-400')
                                                                }
                                                            >
                                                                {employee.job_title}
                                                            </span>
                                                        )}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {filtered.length === 0 && (
                    <p className="py-4 text-center text-sm font-medium text-slate-400">
                        لا توجد نتائج مطابقة
                    </p>
                )}
            </div>

            {error && <p className="mt-1.5 text-xs font-bold text-brand-600">{error}</p>}
        </div>
    );
}

const MESSAGES = {
    title_required: 'عنوان التكليف مطلوب.',
    title_max: 'يجب ألا يتجاوز العنوان 255 حرفاً.',
    date_required: 'التاريخ مطلوب.',
    date_future: 'لا يمكن أن يكون التاريخ بعد تاريخ اليوم.',
    management_required: 'اختر الإدارة.',
    office_required: 'اختر المكتب.',
    pdf_required: 'ملف PDF الخاص بالمستند مطلوب.',
    employees_required: 'اختر موظفاً واحداً على الأقل.',
};

/**
 * Create/Edit record form. Uploads the main PDF (required) and optionally a
 * "تهميش" PDF, and assigns the record to one or many employees. The
 * "الإدارة الموجّه لها" is chosen through two cascading combo boxes:
 * management (الإدارة) then the office (المكتب) related to it.
 */
export default function Form({ mode, record, initialType, managements, offices, employeeGroups }) {
    const isEdit = mode === 'edit';

    const form = useForm({
        title: record?.title ?? '',
        type: record?.type ?? initialType ?? 'assignment',
        date: record?.date ?? new Date().toISOString().slice(0, 10),
        management_id: record?.office?.id
            ? offices.find((office) => office.id === record.office.id)?.management_id ?? ''
            : '',
        office_id: record?.office?.id ?? '',
        pdf: null,
        tahmish: null,
        employee_ids: record?.employees?.map((employee) => employee.id) ?? [],
    });

    const [touched, setTouched] = useState({});

    const validateField = (field) => {
        if (field === 'title') {
            if (!form.data.title.trim()) return MESSAGES.title_required;
            if (form.data.title.length > 255) return MESSAGES.title_max;
        }
        if (field === 'date') {
            if (!form.data.date) return MESSAGES.date_required;
            if (form.data.date > new Date().toISOString().slice(0, 10)) return MESSAGES.date_future;
        }
        if (field === 'management_id') {
            if (!form.data.management_id) return MESSAGES.management_required;
        }
        if (field === 'office_id') {
            if (!form.data.office_id) return MESSAGES.office_required;
        }
        if (field === 'pdf') {
            if (!isEdit && !form.data.pdf) return MESSAGES.pdf_required;
        }
        if (field === 'employee_ids') {
            if (!form.data.employee_ids || form.data.employee_ids.length === 0) {
                return MESSAGES.employees_required;
            }
        }
        return null;
    };

    const errors = useMemo(
        () => ({
            title: validateField('title'),
            date: validateField('date'),
            management_id: validateField('management_id'),
            office_id: validateField('office_id'),
            pdf: validateField('pdf'),
            employee_ids: validateField('employee_ids'),
        }),
        [form.data, isEdit],
    );

    const fieldError = (field) =>
        touched[field] ? errors[field] : (form.errors[field] ?? null);

    const markTouched = (field) =>
        setTouched((current) => ({ ...current, [field]: true }));

    const isFormValid =
        !errors.title &&
        !errors.date &&
        !errors.management_id &&
        !errors.office_id &&
        !errors.pdf &&
        !errors.employee_ids;

    const submit = (e) => {
        e.preventDefault();
        setTouched({
            title: true,
            date: true,
            management_id: true,
            office_id: true,
            pdf: true,
            employee_ids: true,
        });
        if (!isFormValid) return;

        if (isEdit) {
            form.put(route('admin.records.update', record.id), { preserveScroll: true });
        } else {
            form.post(route('admin.records.store'), { preserveScroll: true });
        }
    };

    const toggleEmployees = (ids, remove) => {
        const next = new Set(form.data.employee_ids);
        ids.forEach((id) => (remove ? next.delete(id) : next.add(id)));
        form.setData('employee_ids', [...next]);
        markTouched('employee_ids');
    };

    const officesForManagement = useMemo(
        () => offices.filter((office) => Number(office.management_id) === Number(form.data.management_id)),
        [offices, form.data.management_id],
    );

    const inputClass =
        'w-full rounded-lg border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm focus:border-brand-400 focus:ring-brand-400';

    const labelClass = 'mb-1.5 block text-sm font-extrabold text-navy-700';

    const selectManagement = (value) => {
        form.setData((data) => ({ ...data, management_id: value, office_id: '' }));
    };

    const directedToLabel = useMemo(() => {
        if (!form.data.office_id) return null;
        const office = offices.find((o) => Number(o.id) === Number(form.data.office_id));
        return office?.directed_to ?? null;
    }, [offices, form.data.office_id]);

    return (
        <AppLayout>
            <Link
                href={route('admin.index')}
                className="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 transition hover:text-brand-600"
            >
                <ArrowLeft className="h-4 w-4" />
                العودة إلى لوحة التحكم
            </Link>

            <PageHeader
                title={isEdit ? 'تعديل سجل' : 'إضافة سجل جديد'}
                subtitle={
                    isEdit
                        ? `تعديل: ${record.title}`
                        : 'أدخل بيانات التكليف أو المهمة وارفق المستندات'
                }
            />

            <form
                onSubmit={submit}
                className="mx-auto max-w-3xl space-y-6"
            >
                <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
                    <div>
                        <label htmlFor="title" className={labelClass}>
                            العنوان
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={form.data.title}
                            onChange={(e) => {
                                form.setData('title', e.target.value);
                                markTouched('title');
                            }}
                            className={inputClass}
                            placeholder="مثال: تكليف بفحص ملفات شركة..."
                        />
                        {fieldError('title') && (
                            <p className="mt-1.5 text-xs font-bold text-brand-600">
                                {fieldError('title')}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                            <span className={labelClass}>نوع السجل</span>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { value: 'assignment', label: 'تكليف عمل' },
                                    { value: 'task', label: 'مهمة عمل' },
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => form.setData('type', option.value)}
                                        className={
                                            'rounded-xl border px-3 py-2.5 text-sm font-bold transition ' +
                                            (form.data.type === option.value
                                                ? 'border-brand-500 bg-brand-50 text-brand-600'
                                                : 'border-slate-200 bg-white text-slate-500 hover:border-brand-200')
                                        }
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="date" className={labelClass}>
                                التاريخ
                            </label>
                            <input
                                id="date"
                                type="date"
                                value={form.data.date}
                                max={new Date().toISOString().slice(0, 10)}
                                onChange={(e) => {
                                    form.setData('date', e.target.value);
                                    markTouched('date');
                                }}
                                className={inputClass}
                            />
                            {fieldError('date') && (
                                <p className="mt-1.5 text-xs font-bold text-brand-600">
                                    {fieldError('date')}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <span className={labelClass}>الإدارة الموجّه لها</span>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="management_id" className="mb-1.5 block text-xs font-bold text-slate-500">
                                    الإدارة
                                </label>
                                <div className="relative">
                                    <select
                                        id="management_id"
                                        value={form.data.management_id}
                                        onChange={(e) => {
                                            selectManagement(e.target.value);
                                            markTouched('management_id');
                                            markTouched('office_id');
                                        }}
                                        className={inputClass + ' appearance-none pe-12'}
                                    >
                                        <option value="">اختر الإدارة...</option>
                                        {managements.map((management) => (
                                            <option key={management.id} value={management.id}>
                                                {management.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                </div>
                                {fieldError('management_id') && (
                                    <p className="mt-1.5 text-xs font-bold text-brand-600">
                                        {fieldError('management_id')}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="office_id" className="mb-1.5 block text-xs font-bold text-slate-500">
                                    المكتب
                                </label>
                                <div className="relative">
                                    <select
                                        id="office_id"
                                        value={form.data.office_id}
                                        disabled={!form.data.management_id}
                                        onChange={(e) => {
                                            form.setData('office_id', e.target.value);
                                            markTouched('office_id');
                                        }}
                                        className={inputClass + ' appearance-none pe-12' + (form.data.management_id ? '' : ' opacity-50')}
                                    >
                                        <option value="">
                                            {form.data.management_id ? 'اختر المكتب...' : 'اختر الإدارة أولاً'}
                                        </option>
                                        {officesForManagement.map((office) => (
                                            <option key={office.id} value={office.id}>
                                                {office.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown
                                        className={
                                            'pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 ' +
                                            (form.data.management_id ? 'text-slate-400' : 'text-slate-300')
                                        }
                                    />
                                </div>
                                {fieldError('office_id') && (
                                    <p className="mt-1.5 text-xs font-bold text-brand-600">
                                        {fieldError('office_id')}
                                    </p>
                                )}
                            </div>
                        </div>
                        {directedToLabel && (
                            <p className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-extrabold text-brand-600">
                                الإدارة الموجّه لها: {directedToLabel}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <FileInput
                            id="pdf"
                            label="ملف المستند (PDF)"
                            hint={isEdit ? 'اضغط لاستبدال ملف PDF' : 'اضغط لرفع ملف PDF'}
                            icon={FileText}
                            value={form.data.pdf}
                            onChange={(file) => {
                                form.setData('pdf', file);
                                markTouched('pdf');
                            }}
                            error={fieldError('pdf')}
                            currentUrl={isEdit ? record.pdf_url : null}
                        />
                        <FileInput
                            id="tahmish"
                            label="التهميش (اختياري)"
                            hint="ملف PDF إضافي إن وجد"
                            icon={StickyNote}
                            value={form.data.tahmish}
                            onChange={(file) => {
                                form.setData('tahmish', file);
                                markTouched('tahmish');
                            }}
                            error={fieldError('tahmish')}
                            currentUrl={isEdit ? record.tahmish_url : null}
                        />
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
                    <h2 className="mb-1 text-sm font-extrabold text-navy-700">
                        الموظفون المكلفون
                    </h2>
                    <p className="mb-3 text-xs font-medium text-slate-400">
                        يمكن تكليف موظف واحد أو أكثر بهذا السجل
                    </p>
                    <EmployeePicker
                        groups={employeeGroups}
                        selected={form.data.employee_ids}
                        onToggle={toggleEmployees}
                        error={fieldError('employee_ids')}
                    />
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
                    <Link
                        href={route('admin.index')}
                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                    >
                        إلغاء
                    </Link>
                    <button
                        type="submit"
                        disabled={form.processing}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-2.5 text-sm font-bold text-white shadow-card transition hover:bg-brand-600 disabled:opacity-60"
                    >
                        {form.processing ? 'جارٍ الحفظ...' : isEdit ? 'حفظ التعديلات' : 'إضافة السجل'}
                    </button>
                </div>
            </form>
        </AppLayout>
    );
}
