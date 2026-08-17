import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Mail, Paperclip } from 'lucide-react';

const inputClass =
    'w-full rounded-lg border-slate-300 pe-10 ps-3 py-2.5 text-sm font-medium text-slate-700 shadow-sm focus:border-brand-400 focus:ring-brand-400';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({ email: '' });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="نسيت كلمة المرور" />

            <h1 className="text-center text-lg font-extrabold text-navy-700">
                استعادة كلمة المرور
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
                أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور
            </p>

            {status && (
                <div className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="mt-6 space-y-4">
                <div>
                    <label htmlFor="email" className="mb-1.5 block text-sm font-extrabold text-navy-700">
                        البريد الإلكتروني
                    </label>
                    <div className="relative">
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className={inputClass}
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <Mail className="absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                    {errors.email && (
                        <p className="mt-1.5 text-xs font-bold text-brand-600">{errors.email}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 py-2.5 text-sm font-extrabold text-white shadow-card transition hover:bg-brand-600 disabled:opacity-60"
                >
                    <Paperclip className="h-4 w-4" />
                    {processing ? 'جارٍ الإرسال...' : 'إرسال رابط الاستعادة'}
                </button>
            </form>

            <Link
                href={route('login')}
                className="mt-6 flex items-center justify-center gap-1.5 text-sm font-bold text-slate-500 hover:text-brand-600"
            >
                <ArrowLeft className="h-4 w-4" />
                العودة إلى تسجيل الدخول
            </Link>
        </GuestLayout>
    );
}
