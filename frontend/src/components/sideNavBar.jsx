import { NavLink } from 'react-router'

const navItems = [
  { to: '/', icon: 'dashboard', label: 'Dashboard' },
  { to: '/tasks', icon: 'assignment', label: 'Tasks' },
  { to: '/shared-finances', icon: 'account_balance_wallet', label: 'Shared Finances' },
  { to: '/savings', icon: 'savings', label: 'Savings' },
  { to: '/calendar', icon: 'calendar_month', label: 'Logistics Calendar' },
]

export function SideNavBar() {
  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen p-4 bg-surface border-r border-outline shadow-md w-64 z-50">
      <div className="flex flex-col mb-8 px-2">
        <h1 className="text-lg font-bold text-primary">HomeManage</h1>
        <p className="text-xs text-text-secondary">Domestic Efficiency</p>
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all duration-200 ${
                isActive
                  ? 'bg-primary-light text-primary'
                  : 'text-text-secondary hover:bg-surface-variant active:translate-x-1'
              }`
            }
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-2 border-t border-outline pt-4">
        <button className="mb-4 w-full py-2 px-4 bg-primary text-on-primary rounded-lg font-bold hover:opacity-90 transition-opacity">
          Quick Action
        </button>
        <NavLink
          to="/settings"
          className="flex items-center gap-3 px-4 py-2 text-text-secondary hover:bg-surface-variant transition-all rounded-lg"
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="text-sm">Settings</span>
        </NavLink>
        <NavLink
          to="/help"
          className="flex items-center gap-3 px-4 py-2 text-text-secondary hover:bg-surface-variant transition-all rounded-lg"
        >
          <span className="material-symbols-outlined">help</span>
          <span className="text-sm">Help</span>
        </NavLink>
      </div>
    </aside>
  )
}
