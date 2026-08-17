import { usePage } from '@inertiajs/react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useState, useEffect } from 'react';

/**
 * Global success/error banners driven by the `flash` shared prop.
 */
export default function FlashMessage() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    const message = flash?.success || flash?.error;
    const type = flash?.success ? 'success' : 'error';

    useEffect(() => {
        if (message) {
            setVisible(true);
            setDismissed(false);
            const timer = setTimeout(() => setVisible(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    if (!message || !visible || dismissed) {
        return null;
    }

    return (
        <div
            className={
                'mb-6 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-card ' +
                (type === 'success'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : 'border-red-200 bg-red-50 text-red-800')
            }
            role="status"
        >
            {type === 'success' ? (
                <CheckCircle2 className="h-5 w-5 shrink-0" />
            ) : (
                <AlertCircle className="h-5 w-5 shrink-0" />
            )}
            <p className="flex-1 text-sm font-bold">{message}</p>
            <button
                type="button"
                onClick={() => setDismissed(true)}
                className="rounded p-1 transition hover:bg-black/5"
                aria-label="إغلاق"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}
