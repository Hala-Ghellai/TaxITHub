import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, LockKeyhole, Mail } from 'lucide-react';
import Brand from '@/Components/Brand';

const inputClass =
    'h-11 w-full rounded-xl border-slate-200 bg-slate-50 pe-11 ps-4 text-sm font-medium text-slate-800 shadow-sm transition placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:ring-brand-400';

function Field({ id, type, value, onChange, label, icon: Icon, autoComplete }) {
    return (
        <div>
            <label htmlFor={id} className="mb-2 block text-sm font-bold text-slate-700">
                {label}
            </label>
            <div className="relative">
                <input
                    id={id}
                    type={type}
                    value={value}
                    onChange={onChange}
                    autoComplete={autoComplete}
                    className={inputClass}
                />
                <Icon className="pointer-events-none absolute end-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
        </div>
    );
}

/**
 * Modern, minimal centered login screen: soft gradient background with a
 * frosted-glass card holding the brand and a compact form.
 */
export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10">
            <Head title="تسجيل الدخول" />

            {/* Decorative gradient blobs */}
            <div className="pointer-events-none absolute -top-40 -start-40 h-[28rem] w-[28rem] rounded-full bg-brand-200/50 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -end-40 h-[28rem] w-[28rem] rounded-full bg-navy-200/40 blur-3xl" />
            <div className="pointer-events-none absolute top-1/3 start-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-100/40 blur-3xl" />

            <div className="relative w-full max-w-md">
                <div className="mb-8 flex justify-center">
                    <Brand />
                </div>

                <div className="rounded-3xl border border-white/70 bg-white/85 p-8 shadow-card-hover backdrop-blur">
                    <h1 className="text-center text-2xl font-extrabold text-navy-800">
                        مرحباً بعودتك
                    </h1>
                    <p className="mt-1 text-center text-sm font-medium text-slate-500">
                        سجّل دخولك للوصول إلى النظام
                    </p>

                    {status && (
                        <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="mt-8 space-y-5">
                        <Field
                            id="email"
                            type="email"
                            label="البريد الإلكتروني"
                            icon={Mail}
                            autoComplete="username"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        {errors.email && (
                            <p className="-mt-3 text-xs font-bold text-brand-600">{errors.email}</p>
                        )}

                        <Field
                            id="password"
                            type="password"
                            label="كلمة المرور"
                            icon={LockKeyhole}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        {errors.password && (
                            <p className="-mt-3 text-xs font-bold text-brand-600">{errors.password}</p>
                        )}

                        <div className="flex items-center justify-between">
                            <label className="flex cursor-pointer items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-slate-300 text-brand-500 focus:ring-brand-400"
                                />
                                <span className="text-sm font-medium text-slate-600">تذكرني</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="inline-flex items-center gap-1 text-sm font-bold text-brand-600 transition hover:text-brand-700"
                                >
                                    نسيت كلمة المرور؟
                                    <ArrowLeft className="h-3.5 w-3.5" />
                                </Link>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-brand-500 to-brand-600 text-sm font-extrabold text-white shadow-card transition hover:from-brand-600 hover:to-brand-700 disabled:opacity-60"
                        >
                            {processing ? 'جارٍ تسجيل الدخول...' : 'تسجيل الدخول'}
                        </button>
                    </form>
                </div>

                <p className="mt-6 text-center text-sm font-medium text-slate-400">
                    © {new Date().getFullYear()} مصلحة الضرائب الليبية
                </p>
            </div>
        </div>
    );
}
