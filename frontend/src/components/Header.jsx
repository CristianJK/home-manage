export function Header() {
    return (
        <header className="sticky top-0 z-40 flex justify-between items-center px-6 h-16 w-full max-w-7xl mx-auto bg-surface border-b border-outline shadow-sm">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <input className="pl-10 pr-4 py-1.5 bg-surface-variant border border-outline rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-48 md:w-64 transition-all" placeholder="Search data..." type="text" />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-primary text-on-primary rounded-lg font-bold active:scale-95 transition-transform">
                    <span className="material-symbols-outlined text-[20px]" data-icon="add">add</span>
                    <span className="text-sm font-medium">Add New</span>
                </button>
                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-surface-variant rounded-full transition-colors relative">
                        <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
                        <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
                    </button>
                    <button className="p-2 hover:bg-surface-variant rounded-full transition-colors">
                        <span className="material-symbols-outlined" data-icon="account_circle">account_circle</span>
                    </button>
                </div>
            </div>
        </header>
    )
}
