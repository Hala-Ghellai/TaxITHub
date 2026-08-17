import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { UserCog, LockKeyhole, Trash2 } from 'lucide-react';
import PageHeader from '@/Components/PageHeader';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AppLayout>
            <Head title="الملف الشخصي" />
            <PageHeader title="الملف الشخصي" subtitle="إدارة بيانات حسابك وكلمة المرور" />

            <div className="mx-auto max-w-3xl space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
                    <div className="mb-4 flex items-center gap-2 text-navy-700">
                        <UserCog className="h-5 w-5 text-brand-500" />
                        <h2 className="text-base font-extrabold">معلومات الحساب</h2>
                    </div>
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                    />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
                    <div className="mb-4 flex items-center gap-2 text-navy-700">
                        <LockKeyhole className="h-5 w-5 text-brand-500" />
                        <h2 className="text-base font-extrabold">تغيير كلمة المرور</h2>
                    </div>
                    <UpdatePasswordForm />
                </div>

                <div className="rounded-2xl border border-red-100 bg-red-50/40 p-6 shadow-card">
                    <div className="mb-4 flex items-center gap-2 text-navy-700">
                        <Trash2 className="h-5 w-5 text-brand-500" />
                        <h2 className="text-base font-extrabold">حذف الحساب</h2>
                    </div>
                    <DeleteUserForm />
                </div>
            </div>
        </AppLayout>
    );
}
