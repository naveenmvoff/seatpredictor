"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { 
  BarChart3, 
  Upload, 
  Search, 
  Settings, 
  User, 
  LogOut, 
  Bell,
  Shield,
  Database,
  Users,
  FileText,
  TrendingUp,
  AlertCircle
} from "lucide-react"

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()

  const navigationItems = [
    {
      title: "Main Navigation",
      items: [
        {
          name: "Dashboard",
          href: "/admin",
          icon: <BarChart3 className="w-5 h-5" />,
          description: "Analytics Overview",
        },
        {
          name: "Data Upload",
          href: "/admin/data-upload",
          icon: <Upload className="w-5 h-5" />,
          description: "Import Excel/CSV",
        },
        {
          name: "User Searches",
          href: "/admin/user-searches",
          icon: <Search className="w-5 h-5" />,
          description: "Search History",
        },
        {
          name: "Settings",
          href: "/admin/settings",
          icon: <Settings className="w-5 h-5" />,
          description: "Configuration",
        },
      ],
    },
  ]

  const handleLogout = () => {
    // Implement logout logic
    console.log("Logging out...")
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-slate-800 text-white flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-lg">Admin Portal</h1>
              <p className="text-slate-400 text-sm">Seat Predictor System</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4">
          {navigationItems.map((section) => (
            <div key={section.title} className="mb-6">
              <h2 className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-3">{section.title}</h2>
              <nav className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive ? "bg-slate-700 text-white" : "text-slate-300 hover:bg-slate-700 hover:text-white"
                      }`}
                    >
                      <span className="text-base flex-shrink-0">{item.icon}</span>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-slate-400">{item.description}</div>
                      </div>
                    </Link>
                  )
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="p-4 border-t border-slate-700">
          <div className="bg-slate-700 rounded-lg p-3 mb-4">
            <h3 className="text-xs font-medium text-slate-300 mb-2">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <Database className="w-3 h-3 text-blue-400" />
                <span className="text-slate-300">45.2K</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3 text-green-400" />
                <span className="text-slate-300">8.2K</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="w-3 h-3 text-purple-400" />
                <span className="text-slate-300">12.5K</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-orange-400" />
                <span className="text-slate-300">94.2%</span>
              </div>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                Admin User
              </p>
              <p className="text-xs text-slate-400 truncate">admin@seatpredictor.com</p>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-400">Online</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-slate-700 rounded-lg transition-colors">
              <Bell className="w-4 h-4" />
              Notifications
            </button>
            <button 
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700">
          <p className="text-slate-400 text-xs">© 2025 Doc Tutorials Edutech</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-gray-900">Seat Predictor Admin Portal</h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>System Online</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Bell className="w-4 h-4" />
                <span>3</span>
              </div>
              <div className="text-sm text-gray-600">Welcome, Admin</div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
