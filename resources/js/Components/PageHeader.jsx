/**
 * Consistent page header: title, optional subtitle, and optional actions.
 */
export default function PageHeader({ title, subtitle, actions }) {
    return (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-2xl font-extrabold text-navy-700">{title}</h1>
                {subtitle && (
                    <p className="mt-1 text-sm font-medium text-slate-500">{subtitle}</p>
                )}
            </div>
            {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
    );
}
