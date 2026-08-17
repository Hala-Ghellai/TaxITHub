import { Link, useForm } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, CheckCircle2, ChevronDown, UserRound } from 'lucide-react';
import { useMemo, useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/PageHeader';

const MESSAGES = {
    name_required: 'حقل الاسم مطلوب.',
    name_max: 'يجب ألا يتجاوز الاسم 255 حرفاً.',
    job_title_required: 'حقل المسمى الوظيفي مطلوب.',
    job_title_max: 'يجب ألا يتجاوز المسمى الوظيفي 255 حرفاً.',
    department_required: 'حقل القسم مطلوب.',
};

/**
 * Create / edit employee form with live Arabic validation.
 */
export default function Form({ mode, employee, departments }) {
    const isEdit = mode === 'edit';

    const form = useForm({
        name: employee?.name ?? '',
        job_title: employee?.job_title ?? '',
        department_id: employee?.department_id ?? '',
    });

    const [touched, setTouched] = useState({ name: false, job_title: false, department_id: false });

    const validateField = (field) => {
        if (field === 'name') {
            if (!form.data.name.trim()) return MESSAGES.name_required;
            if (form.data.name.length > 255) return MESSAGES.name_max;
        }
        if (field === 'job_title') {
            if (!form.data.job_title.trim()) return MESSAGES.job_title_required;
            if (form.data.job_title.length > 255) return MESSAGES.job_title_max;
        }
        if (field === 'department_id') {
            if (!form.data.department_id) return MESSAGES.department_required;
        }
        return null;
    };

    const errors = useMemo(
        () => ({
            name: validateField('name'),
            job_title: validateField('job_title'),
            department_id: validateField('department_id'),
        }),
        [form.data],
    );

    const fieldError = (field) =>
        touched[field] ? errors[field] : null;

    const handleChange = (field, value) => {
        form.setData(field, value);
        setTouched((current) => ({ ...current, [field]: true }));
    };

    const isFormValid =
        !errors.name && !errors.job_title && !errors.department_id;

    const submit = (e) => {
        e.preventDefault();
        setTouched({ name: true, job_title: true, department_id: true });
        if (!isFormValid) return;

        if (isEdit) {
            form.put(route('admin.employees.update', employee.id), { preserveScroll: true });
        } else {
            form.post(route('admin.employees.store'), { preserveScroll: true });
        }
    };

    const inputClass = (field) =>
        'w-full rounded-xl border px-4 py-2.5 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 ' +
        (fieldError(field)
            ? 'border-brand-400 bg-brand-50/40 text-slate-700 focus:border-brand-400 focus:ring-brand-100'
            : 'border-slate-300 text-slate-700 focus:border-brand-400 focus:ring-brand-100');

    const labelClass = 'mb-1.5 block text-sm font-extrabold text-navy-700';

    const FieldError = ({ message }) =>
        message ? (
            <p className="mt-1.5 flex items-center gap-1 text-xs font-bold text-brand-600">
                <AlertCircle className="h-3.5 w-3.5" />
                {message}
            </p>
        ) : null;

    return (
        <AppLayout>
            <Link
                href={route('admin.employees.index')}
                className="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 transition hover:text-brand-600"
            >
                <ArrowLeft className="h-4 w-4" />
                العودة إلى إدارة الموظفين
            </Link>

            <PageHeader
                title={isEdit ? 'تعديل موظف' : 'إضافة موظف جديد'}
                subtitle={
                    isEdit
                        ? `تعديل بيانات: ${employee.name}`
                        : 'أدخل بيانات الموظف الجديد ليتمكن من استقبال تكاليف العمل ومهام العمل'
                }
            />

            <form onSubmit={submit} className="mx-auto max-w-xl" noValidate>
                <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
                    <div className="mb-1 flex items-center gap-3">
                        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-navy-50 text-navy-700">
                            <UserRound className="h-6 w-6" />
                        </span>
                        <div>
                            <p className="text-sm font-bold text-slate-500">
                                {isEdit ? 'بيانات الموظف الحالية' : 'بيانات الموظف الجديد'}
                            </p>
                            <p className="text-xs font-medium text-slate-400">
                                جميع الحقول التالية مطلوبة
                            </p>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="name" className={labelClass}>
                            الاسم
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={form.data.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            onBlur={() => setTouched((c) => ({ ...c, name: true }))}
                            className={inputClass('name')}
                            placeholder="الاسم الكامل للموظف"
                        />
                        <FieldError message={fieldError('name')} />
                        {touched.name && !errors.name && (
                            <p className="mt-1.5 flex items-center gap-1 text-xs font-bold text-emerald-600">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                تم إدخال القيمة بشكل صحيح
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="job_title" className={labelClass}>
                            المسمى الوظيفي
                        </label>
                        <input
                            id="job_title"
                            type="text"
                            value={form.data.job_title}
                            onChange={(e) => handleChange('job_title', e.target.value)}
                            onBlur={() => setTouched((c) => ({ ...c, job_title: true }))}
                            className={inputClass('job_title')}
                            placeholder="مثال: مهندس شبكات أول"
                        />
                        <FieldError message={fieldError('job_title')} />
                        {touched.job_title && !errors.job_title && (
                            <p className="mt-1.5 flex items-center gap-1 text-xs font-bold text-emerald-600">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                تم إدخال القيمة بشكل صحيح
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="department_id" className={labelClass}>
                            القسم
                        </label>
                        <div className="relative">
                            <select
                                id="department_id"
                                value={form.data.department_id}
                                onChange={(e) => handleChange('department_id', e.target.value)}
                                onBlur={() => setTouched((c) => ({ ...c, department_id: true }))}
                                className={inputClass('department_id') + ' appearance-none pe-10'}
                            >
                                <option value="">اختر القسم</option>
                                {departments.map((department) => (
                                    <option key={department.id} value={department.id}>
                                        {department.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        </div>
                        <FieldError message={fieldError('department_id')} />
                        {touched.department_id && !errors.department_id && (
                            <p className="mt-1.5 flex items-center gap-1 text-xs font-bold text-emerald-600">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                تم إدخال القيمة بشكل صحيح
                            </p>
                        )}
                    </div>
                </div>

                {touched.name && touched.job_title && touched.department_id && !isFormValid && (
                    <div className="mt-4 flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-bold text-brand-700">
                        <AlertCircle className="h-4 w-4" />
                        يرجى إكمال الحقول المطلوبة قبل الحفظ.
                    </div>
                )}

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
                    <Link
                        href={route('admin.employees.index')}
                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                    >
                        إلغاء
                    </Link>
                    <button
                        type="submit"
                        disabled={form.processing}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-2.5 text-sm font-bold text-white shadow-card transition hover:bg-brand-600 disabled:opacity-60"
                    >
                        {form.processing ? 'جارٍ الحفظ...' : isEdit ? 'حفظ التعديلات' : 'إضافة الموظف'}
                    </button>
                </div>
            </form>
        </AppLayout>
    );
}