import { FileText, StickyNote } from 'lucide-react';

/**
 * Opens/downloads a secure PDF via the authenticated streaming route.
 */
export default function PdfButton({ url, label, variant = 'document' }) {
    if (!url) {
        return null;
    }

    const isTahmish = variant === 'tahmish';

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title={label}
            className={
                isTahmish
                    ? 'inline-flex items-center gap-1.5 rounded-lg border border-navy-200 bg-navy-50 px-3 py-1.5 text-xs font-bold text-navy-700 transition hover:bg-navy-100'
                    : 'inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-bold text-white shadow-card transition hover:bg-brand-600'
            }
        >
            {isTahmish ? <StickyNote className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
            <span className="whitespace-nowrap">{label}</span>
        </a>
    );
}
