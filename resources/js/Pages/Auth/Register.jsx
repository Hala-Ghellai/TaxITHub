import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { KeyRound, LockKeyhole, Mail, UserRound } from 'lucide-react';

const inputClass =
    'w-full rounded-lg border-slate-300 pe-10 ps-3 py-2.5 text-sm font-medium text-slate-700 shadow-sm focus:border-brand-400 focus:ring-brand-400';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const field = (id, label, Icon, props = {}, autoFocus = false) => (
        <div>
            <label htmlFor={id} className="mb-1.5 block text-sm font-extrabold text-navy-700">
                {label}
            </label>
            <div className="relative">
                <input
                    id={id}
                    {...props}
                    autoFocus={autoFocus}
                    className={inputClass}
                />
                <Icon className="absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
            {errors[id] && (
                <p className="mt-1.5 text-xs font-bold text-brand-600">{errors[id]}</p>
            )}
        </div>
    );

    return (
        <GuestLayout>
            <Head title="إنشاء حساب" />

            <h1 className="text-center text-lg font-extrabold text-navy-700">إنشاء حساب</h1>
            <p className="mt-1 text-center text-sm font-medium text-slate-500">
                الحسابات الجديدة تُنشأ بصلاحية المشاهدة فقط
            </p>

            <form onSubmit={submit} className="mt-6 space-y-4">
                {field(
                    'name',
                    'الاسم',
                    UserRound,
                    {
                        name: 'name',
                        type: 'text',
                        value: data.name,
                        onChange: (e) => setData('name', e.target.value),
                        autoComplete: 'name',
                        required: true,
                    },
                    true,
                )}

                {field('email', 'البريد الإلكتروني', Mail, {
                    name: 'email',
                    type: 'email',
                    value: data.email,
                    onChange: (e) => setData('email', e.target.value),
                    autoComplete: 'username',
                    required: true,
                })}

                {field('password', 'كلمة المرور', LockKeyhole, {
                    name: 'password',
                    type: 'password',
                    value: data.password,
                    onChange: (e) => setData('password', e.target.value),
                    autoComplete: 'new-password',
                    required: true,
                })}

                {field('password_confirmation', 'تأكيد كلمة المرور', LockKeyhole, {
                    name: 'password_confirmation',
                    type: 'password',
                    value: data.password_confirmation,
                    onChange: (e) => setData('password_confirmation', e.target.value),
                    autoComplete: 'new-password',
                    required: true,
                })}

                <button
                    type="submit"
                    disabled={processing}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 py-2.5 text-sm font-extrabold text-white shadow-card transition hover:bg-brand-600 disabled:opacity-60"
                >
                    <KeyRound className="h-4 w-4" />
                    {processing ? 'جارٍ الإنشاء...' : 'إنشاء الحساب'}
                </button>
            </form>

            <p className="mt-6 text-center text-sm font-medium text-slate-500">
                لديك حساب بالفعل؟{' '}
                <Link href={route('login')} className="font-extrabold text-brand-600 hover:underline">
                    تسجيل الدخول
                </Link>
            </p>
        </GuestLayout>
    );
}
