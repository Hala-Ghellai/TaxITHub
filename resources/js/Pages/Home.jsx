import { Link } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    Building2,
    ClipboardList,
    ListTodo,
    Users,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/PageHeader';
import DepartmentCard from '@/Components/DepartmentCard';

/**
 * Modern dashboard home: a gradient hero with live stats, then the
 * departments presented as a clean, responsive grid of cards.
 */
export default function Home({ departments, stats }) {
    const trackRef = useRef(null);
    const [page, setPage] = useState(0);
    const total = departments.length;

    const CARD = 320; // fixed card width (w-80)
    const GAP = 20; // gap-5

    const perView = () => {
        const track = trackRef.current;
        if (!track) return 3;
        return Math.max(1, Math.floor((track.clientWidth + GAP) / (CARD + GAP)));
    };

    const pages = () => Math.max(1, Math.ceil(total / perView()));

    const scrollToPage = (index) => {
        const track = trackRef.current;
        if (!track) return;
        const firstCard = track.querySelectorAll(':scope > div')[index * perView()];
        if (firstCard) firstCard.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
        setPage(index);
    };

    const onScroll = () => {
        const track = trackRef.current;
        if (!track) return;
        // RTL: scrollLeft is negative; use absolute distance.
        const idx = Math.round(Math.abs(track.scrollLeft) / (CARD + GAP));
        const p = Math.min(Math.max(0, Math.floor(idx / perView())), pages() - 1);
        setPage((cur) => (cur === p ? cur : p));
    };

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;
        const onResize = () => setPage((p) => Math.min(p, pages() - 1));
        window.addEventListener('resize', onResize);
        track.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            window.removeEventListener('resize', onResize);
            track.removeEventListener('scroll', onScroll);
        };
    }, [total]);

    const statCards = [
        {
            label: 'الأقسام',
            value: stats.departments,
            icon: Building2,
            gradient: 'from-brand-500 to-brand-600',
            tint: 'bg-brand-50 text-brand-600',
        },
        {
            label: 'الموظفون',
            value: stats.employees,
            icon: Users,
            gradient: 'from-navy-600 to-navy-800',
            tint: 'bg-navy-50 text-navy-700',
        },
        {
            label: 'تكاليف عمل',
            value: stats.assignments,
            icon: ClipboardList,
            gradient: 'from-emerald-500 to-teal-600',
            tint: 'bg-emerald-50 text-emerald-600',
        },
        {
            label: 'مهام عمل',
            value: stats.tasks,
            icon: ListTodo,
            gradient: 'from-amber-400 to-orange-500',
            tint: 'bg-amber-50 text-amber-600',
        },
    ];

    return (
        <AppLayout>
            {/* Hero */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-bl from-navy-800 via-navy-900 to-brand-900 px-6 py-10 sm:px-10 sm:py-12">
                {/* Decorative blobs */}
                <div className="pointer-events-none absolute -top-20 -end-20 h-64 w-64 rounded-full bg-brand-500/25 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 -start-16 h-64 w-64 rounded-full bg-navy-400/20 blur-3xl" />
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.07]"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)',
                        backgroundSize: '26px 26px',
                    }}
                />

                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs font-bold text-white/90 backdrop-blur">
                            <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
                            إدارة نظم المعلومات
                        </span>
                        <h1 className="mt-4 text-2xl font-extrabold leading-snug text-white sm:text-3xl">
                            مرحباً بك في نظام إدارة
                            <br className="hidden sm:block" /> تكاليف العمل ومهام العمل
                        </h1>
                        <p className="mt-3 max-w-xl text-sm font-medium leading-relaxed text-white/70">
                            تابع التكليفات والمهام الخاصة بالموظفين عبر جميع أقسام
                            مصلحة الضرائب الليبية من مكان واحد.
                        </p>
                    </div>

                    <Link
                        href={route('employees.index')}
                        className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-navy-800 shadow-card-hover transition hover:bg-slate-100"
                    >
                        <Users className="h-4 w-4" />
                        استعراض الموظفين
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </div>
            </section>

            {/* Stats */}
            <section className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={card.label}
                            className="flex items-center gap-4 rounded-2xl border border-slate-200/70 bg-white p-5 shadow-card transition hover:shadow-card-hover"
                        >
                            <span
                                className={
                                    'grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-lg ' +
                                    card.gradient
                                }
                            >
                                <Icon className="h-6 w-6" />
                            </span>
                            <div>
                                <p className="text-2xl font-extrabold leading-none text-slate-800">
                                    {card.value}
                                </p>
                                <p className="mt-1 text-xs font-bold text-slate-500">
                                    {card.label}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </section>

            {/* Departments — swipeable */}
            <section className="mt-10">
                <PageHeader
                    title="أقسام الإدارة"
                    subtitle="اسحب البطاقات أو استخدم الأسهم للتنقل بين الأقسام"
                />

                <div className="relative">
                    {/* Arrow navigation */}
                    <div className="mb-3 flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() => scrollToPage(Math.max(0, page - 1))}
                            disabled={page === 0}
                            aria-label="السابق"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-card transition hover:border-brand-300 hover:text-brand-500 disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600"
                        >
                            <ArrowRight className="h-4 w-4" />
                        </button>
                        <span className="text-xs font-bold text-slate-400">
                            {page + 1} / {pages()}
                        </span>
                        <button
                            type="button"
                            onClick={() => scrollToPage(Math.min(pages() - 1, page + 1))}
                            disabled={page >= pages() - 1}
                            aria-label="التالي"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-card transition hover:border-brand-300 hover:text-brand-500 disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Swipe track */}
                    <div
                        ref={trackRef}
                        className="no-scrollbar flex snap-x snap-mandatory items-stretch gap-5 overflow-x-auto pb-1"
                    >
                        {departments.map((department, index) => (
                            <div
                                key={department.id}
                                className="w-80 max-w-[85vw] shrink-0 snap-start"
                            >
                                <DepartmentCard
                                    department={department}
                                    index={index}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Page dots */}
                    <div className="mt-5 flex items-center justify-center gap-2.5">
                        {Array.from({ length: pages() }).map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                aria-label={`الصفحة ${i + 1}`}
                                onClick={() => scrollToPage(i)}
                                className={
                                    'h-2.5 rounded-full transition-all duration-300 ' +
                                    (i === page
                                        ? 'w-7 bg-brand-500'
                                        : 'w-2.5 bg-slate-300 hover:bg-slate-400')
                                }
                            />
                        ))}
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}