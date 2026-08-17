import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    const inputClass =
        'w-full rounded-lg border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm focus:border-brand-400 focus:ring-brand-400';
    const labelClass = 'mb-1.5 block text-sm font-extrabold text-navy-700';

    return (
        <form onSubmit={submit} className="space-y-5">
            <div>
                <label htmlFor="name" className={labelClass}>الاسم</label>
                <input
                    id="name"
                    className={inputClass}
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                    autoFocus
                    autoComplete="name"
                />
                {errors.name && (
                    <p className="mt-1.5 text-xs font-bold text-brand-600">{errors.name}</p>
                )}
            </div>

            <div>
                <label htmlFor="email" className={labelClass}>البريد الإلكتروني</label>
                <input
                    id="email"
                    type="email"
                    className={inputClass}
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    required
                    autoComplete="username"
                />
                {errors.email && (
                    <p className="mt-1.5 text-xs font-bold text-brand-600">{errors.email}</p>
                )}
            </div>

            {mustVerifyEmail && user.email_verified_at === null && (
                <div>
                    <p className="text-sm text-slate-600">
                        بريدك الإلكتروني غير موثّق.
                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            className="ms-1 rounded-md text-sm font-bold text-brand-600 underline hover:text-brand-700"
                        >
                            اضغط لإعادة إرسال رابط التوثيق.
                        </Link>
                    </p>
                    {status === 'verification-link-sent' && (
                        <div className="mt-2 text-sm font-bold text-emerald-600">
                            تم إرسال رابط توثيق جديد إلى بريدك الإلكتروني.
                        </div>
                    )}
                </div>
            )}

            <div className="flex items-center gap-4">
                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-bold text-white shadow-card transition hover:bg-brand-600 disabled:opacity-60"
                >
                    {processing ? 'جارٍ الحفظ...' : 'حفظ'}
                </button>

                <Transition
                    show={recentlySuccessful}
                    enter="transition ease-in-out"
                    enterFrom="opacity-0"
                    leave="transition ease-in-out"
                    leaveTo="opacity-0"
                >
                    <p className="text-sm font-bold text-emerald-600">تم الحفظ.</p>
                </Transition>
            </div>
        </form>
    );
}
