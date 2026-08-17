import { Link } from '@inertiajs/react';

/**
 * Brand mark used in the navbar and auth pages.
 */
export default function Brand({ compact = false }) {
    return (
        <Link href="/" className="group inline-flex items-center gap-3">
            <img
                src="/images/logo.jpg"
                alt="شعار مصلحة الضرائب الليبية"
                className="h-10 w-10 shrink-0 rounded-xl object-cover shadow-card transition group-hover:scale-105"
            />
            {!compact && (
                <span className="leading-tight">
                    <span className="block text-base font-extrabold text-navy-700">
                        مصلحة الضرائب الليبية
                    </span>
                    <span className="block text-xs font-medium text-slate-500">
                        إدارة نظم المعلومات
                    </span>
                </span>
            )}
        </Link>
    );
}
