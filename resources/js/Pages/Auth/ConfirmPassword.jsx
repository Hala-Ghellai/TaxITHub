import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { KeyRound, LockKeyhole } from 'lucide-react';

const inputClass =
    'w-full rounded-lg border-slate-300 pe-10 ps-3 py-2.5 text-sm font-medium text-slate-700 shadow-sm focus:border-brand-400 focus:ring-brand-400';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="تأكيد كلمة المرور" />

            <h1 className="text-center text-lg font-extrabold text-navy-700">
                تأكيد كلمة المرور
            </h1>
            <p className="mt-1 text-center text-sm font-medium text-slate-500">
                هذه منطقة آمنة، يرجى تأكيد كلمة المرور للمتابعة
            </p>

            <form onSubmit={submit} className="mt-6 space-y-4">
                <div>
                    <label htmlFor="password" className="mb-1.5 block text-sm font-extrabold text-navy-700">
                        كلمة المرور
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className={inputClass}
                            autoFocus
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <LockKeyhole className="absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                    {errors.password && (
                        <p className="mt-1.5 text-xs font-bold text-brand-600">
                            {errors.password}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 py-2.5 text-sm font-extrabold text-white shadow-card transition hover:bg-brand-600 disabled:opacity-60"
                >
                    <KeyRound className="h-4 w-4" />
                    {processing ? 'جارٍ التأكيد...' : 'تأكيد'}
                </button>
            </form>
        </GuestLayout>
    );
}
