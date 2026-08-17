import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { LogOut, MailCheck } from 'lucide-react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="توثيق البريد الإلكتروني" />

            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50">
                <MailCheck className="h-7 w-7 text-brand-500" />
            </span>

            <h1 className="mt-4 text-center text-lg font-extrabold text-navy-700">
                تحقق من بريدك الإلكتروني
            </h1>
            <p className="mt-1 text-sm leading-relaxed text-slate-500">
                شكرًا لتسجيلك! قبل البدء، يرجى توثيق بريدك الإلكتروني بالنقر على
                الرابط المرسل إليك. إن لم تستلم الرسالة، يمكننا إعادة إرسالها.
            </p>

            {status === 'verification-link-sent' && (
                <div className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700">
                    تم إرسال رابط توثيق جديد إلى بريدك الإلكتروني.
                </div>
            )}

            <form onSubmit={submit} className="mt-6 space-y-3">
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded-xl bg-brand-500 py-2.5 text-sm font-extrabold text-white shadow-card transition hover:bg-brand-600 disabled:opacity-60"
                >
                    {processing ? 'جارٍ الإرسال...' : 'إعادة إرسال رابط التوثيق'}
                </button>

                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                >
                    <LogOut className="h-4 w-4" />
                    تسجيل الخروج
                </Link>
            </form>
        </GuestLayout>
    );
}
