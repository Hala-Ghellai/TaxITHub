/**
 * Shared visual identity per department: accent colors, gradient, and a
 * Flaticon-style icon. Matched by name, falling back to index.
 * Used by DepartmentCard (home page) and the employee picker (record form).
 */
export const DEPARTMENTS = [
    {
        name: 'قسم البرمجة والتطوير',
        gradient: 'from-brand-500 to-brand-600',
        tint: 'bg-brand-50 text-brand-600',
        glow: 'bg-brand-400/30',
        hoverText: 'group-hover:text-brand-500',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <path d="m8 6-6 6 6 6" />
                <path d="m16 6 6 6-6 6" />
                <path d="m13 4-2 16" />
            </svg>
        ),
    },
    {
        name: 'قسم الشبكات',
        gradient: 'from-sky-500 to-blue-600',
        tint: 'bg-sky-50 text-sky-600',
        glow: 'bg-sky-400/30',
        hoverText: 'group-hover:text-sky-500',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <circle cx="5" cy="12" r="2.4" />
                <circle cx="19" cy="12" r="2.4" />
                <circle cx="12" cy="5" r="2.4" />
                <circle cx="12" cy="19" r="2.4" />
                <path d="M7.4 11 9.8 6.6M16.6 11l-2.4-4.4M7.4 13l2.4 4.4M16.6 13l-2.4 4.4" />
            </svg>
        ),
    },
    {
        name: 'قسم التوثيق والمعلومات',
        gradient: 'from-amber-400 to-orange-500',
        tint: 'bg-amber-50 text-amber-600',
        glow: 'bg-amber-400/30',
        hoverText: 'group-hover:text-amber-500',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <path d="M6 3h9l3 3v15H6Z" />
                <path d="M9 10h6M9 14h6M9 18h3" />
            </svg>
        ),
    },
    {
        name: 'قسم أمن المعلومات',
        gradient: 'from-emerald-500 to-teal-600',
        tint: 'bg-emerald-50 text-emerald-600',
        glow: 'bg-emerald-400/30',
        hoverText: 'group-hover:text-emerald-500',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <path d="M12 3 5 6v5c0 4.4 2.9 8.6 7 9.7 4.1-1.1 7-5.3 7-9.7V6Z" />
                <path d="m9.5 11.5 1.8 1.8 3.7-4" />
            </svg>
        ),
    },
    {
        name: 'قسم الخدمات الإلكترونية',
        gradient: 'from-violet-500 to-purple-600',
        tint: 'bg-violet-50 text-violet-600',
        glow: 'bg-violet-400/30',
        hoverText: 'group-hover:text-violet-500',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <rect x="3" y="4" width="18" height="14" rx="2" />
                <path d="M8 21h8M12 18v3" />
            </svg>
        ),
    },
];

export const FALLBACK_DEPARTMENT = {
    name: '',
    gradient: 'from-slate-400 to-slate-500',
    tint: 'bg-slate-100 text-slate-500',
    glow: 'bg-slate-400/30',
    hoverText: 'group-hover:text-slate-500',
    icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
            <path d="M3 7h18M3 7c0 6 1 14 1 14h16s1-8 1-14M9 11h6M9 15h6" />
        </svg>
    ),
};

export function departmentMeta(name, index = 0) {
    const match = DEPARTMENTS.find((d) => d.name === name);
    return match || FALLBACK_DEPARTMENT;
}