import { Inbox } from 'lucide-react';

/**
 * Empty-state placeholder shown when a filtered list has no results.
 */
export default function EmptyState({ title = 'لا توجد نتائج', hint }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-slate-100">
                <Inbox className="h-7 w-7 text-slate-400" />
            </span>
            <h3 className="mt-4 text-base font-bold text-slate-700">{title}</h3>
            {hint && <p className="mt-1 text-sm font-medium text-slate-400">{hint}</p>}
        </div>
    );
}
