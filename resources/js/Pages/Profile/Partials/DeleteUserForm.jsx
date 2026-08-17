import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm() {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({ password: '' });

    const confirmUserDeletion = () => setConfirmingUserDeletion(true);

    const deleteUser = (e) => {
        e.preventDefault();
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    const inputClass =
        'w-full rounded-lg border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm focus:border-brand-400 focus:ring-brand-400';

    return (
        <div>
            <p className="mb-4 text-sm text-slate-500">
                عند حذف حسابك، ستُحذف جميع بياناته نهائيًا. لا يمكن التراجع عن هذا
                الإجراء.
            </p>

            <button
                type="button"
                onClick={confirmUserDeletion}
                className="rounded-xl border border-brand-300 bg-white px-5 py-2.5 text-sm font-bold text-brand-600 transition hover:bg-brand-50"
            >
                حذف الحساب
            </button>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-lg font-extrabold text-navy-700">
                        هل أنت متأكد من حذف حسابك؟
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        سيتم حذف الحساب وجميع بياناته نهائيًا. أدخل كلمة المرور
                        لتأكيد الحذف.
                    </p>

                    <div className="mt-6">
                        <input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className={inputClass}
                            autoFocus
                            placeholder="كلمة المرور"
                        />
                        {errors.password && (
                            <p className="mt-1.5 text-xs font-bold text-brand-600">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-bold text-white shadow-card transition hover:bg-brand-600 disabled:opacity-60"
                        >
                            {processing ? 'جارٍ الحذف...' : 'حذف الحساب'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
