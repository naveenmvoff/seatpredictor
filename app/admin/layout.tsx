"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

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
          icon: "",
          description: "Analytics Overview",
        },
        {
          name: "Data Upload",
          href: "/admin/data-upload",
          icon: "",
          description: "Import Excel/CSV",
        },
        {
          name: "User Searches",
          href: "/admin/user-searches",
          icon: "",
          description: "Search History",
        },
        {
          name: "Settings",
          href: "/admin/settings",
          icon: "",
          description: "Configuration",
        },
      ],
    },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-slate-800 text-white flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-slate-800 font-bold text-sm">🎓</span>
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
                      <span className="text-base">{item.icon}</span>
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
            </div>
            <div className="text-sm text-gray-600">Welcome, Admin</div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
