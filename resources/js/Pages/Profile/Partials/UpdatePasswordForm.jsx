import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';

export default function UpdatePasswordForm() {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }
                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    const inputClass =
        'w-full rounded-lg border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm focus:border-brand-400 focus:ring-brand-400';
    const labelClass = 'mb-1.5 block text-sm font-extrabold text-navy-700';

    return (
        <form onSubmit={updatePassword} className="space-y-5">
            <div>
                <label htmlFor="current_password" className={labelClass}>
                    كلمة المرور الحالية
                </label>
                <input
                    id="current_password"
                    ref={currentPasswordInput}
                    value={data.current_password}
                    onChange={(e) => setData('current_password', e.target.value)}
                    type="password"
                    className={inputClass}
                    autoComplete="current-password"
                />
                {errors.current_password && (
                    <p className="mt-1.5 text-xs font-bold text-brand-600">
                        {errors.current_password}
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="password" className={labelClass}>
                    كلمة المرور الجديدة
                </label>
                <input
                    id="password"
                    ref={passwordInput}
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    type="password"
                    className={inputClass}
                    autoComplete="new-password"
                />
                {errors.password && (
                    <p className="mt-1.5 text-xs font-bold text-brand-600">{errors.password}</p>
                )}
            </div>

            <div>
                <label htmlFor="password_confirmation" className={labelClass}>
                    تأكيد كلمة المرور الجديدة
                </label>
                <input
                    id="password_confirmation"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    type="password"
                    className={inputClass}
                    autoComplete="new-password"
                />
                {errors.password_confirmation && (
                    <p className="mt-1.5 text-xs font-bold text-brand-600">
                        {errors.password_confirmation}
                    </p>
                )}
            </div>

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
