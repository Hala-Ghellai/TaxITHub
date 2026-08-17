import Brand from '@/Components/Brand';

/**
 * Modern, minimal layout for the authentication pages: soft gradient mesh
 * background, frosted-glass card, centered.
 */
export default function GuestLayout({ children }) {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10">
            {/* Decorative gradient blobs */}
            <div className="pointer-events-none absolute -top-40 -start-40 h-[28rem] w-[28rem] rounded-full bg-brand-200/50 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -end-40 h-[28rem] w-[28rem] rounded-full bg-navy-200/40 blur-3xl" />
            <div className="pointer-events-none absolute top-1/3 start-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-100/40 blur-3xl" />

            <div className="relative w-full max-w-md">
                <div className="mb-8 flex justify-center">
                    <Brand />
                </div>

                <div className="rounded-3xl border border-white/70 bg-white/85 p-8 shadow-card-hover backdrop-blur">
                    {children}
                </div>
            </div>
        </div>
    );
}
