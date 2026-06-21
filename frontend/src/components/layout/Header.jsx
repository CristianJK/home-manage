import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'

export function Header() {
    const { user, logout } = useAuth()
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <header className="sticky top-0 z-40 flex justify-between items-center px-6 h-16 w-full max-w-7xl mx-auto bg-surface border-b border-outline shadow-sm">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <input className="pl-10 pr-4 py-1.5 bg-surface-variant border border-outline rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-48 md:w-64 transition-all" placeholder="Search data..." type="text" />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-primary text-white rounded-lg font-bold active:scale-95 transition-transform">
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    <span className="text-sm font-medium">Add New</span>
                </button>
                <div className="flex items-center gap-2 relative" ref={dropdownRef}>
                    <button className="p-2 hover:bg-surface-variant rounded-full transition-colors relative">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
                    </button>
                    <button
                        className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold hover:ring-2 hover:ring-primary/30 transition-all"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        {user?.name ? user.name.charAt(0).toUpperCase() : <span className="material-symbols-outlined text-[18px]">person</span>}
                    </button>
                    {dropdownOpen && (
                        <div className="absolute right-0 top-12 w-56 bg-surface border border-outline rounded-xl shadow-lg p-4 z-50">
                            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-outline">
                                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-base font-bold">
                                    {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-text-primary truncate">{user?.name || 'Usuario'}</p>
                                    <p className="text-xs text-text-secondary truncate">{user?.email || ''}</p>
                                </div>
                            </div>
                            <button
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-error hover:bg-error/5 rounded-lg transition-colors"
                                onClick={logout}
                            >
                                <span className="material-symbols-outlined text-[18px]">logout</span>
                                Cerrar sesión
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
