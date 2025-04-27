"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Briefcase,
  Users,
  FileText,
  Calendar,
  PieChart,
  MessageSquare,
  Settings,
  LogOut,
  X,
} from "lucide-react";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Jobs", href: "/dashboard/jobs", icon: Briefcase },
    { name: "Candidates", href: "/dashboard/candidates", icon: Users },
    { name: "Applications", href: "/dashboard/applications", icon: FileText },
    { name: "Interviews", href: "/dashboard/interviews", icon: Calendar },
    { name: "Analytics", href: "/dashboard/analytics", icon: PieChart },
    { name: "TalentTalk", href: "/dashboard/talenttalk", icon: MessageSquare },
  ];

  return (
    <>
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <Link href="/dashboard" className="flex-shrink-0 flex items-center">
            <span className="text-xl font-bold text-blue-600">CandidAI</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-4 px-2 space-y-1">
          {renderNavItems(navigation, pathname)}
        </nav>
        <div className="absolute bottom-0 w-full border-t border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-medium">HR</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">HR Manager</p>
                <p className="text-xs text-gray-500">hr@company.com</p>
              </div>
            </div>
            <button className="text-gray-500 hover:text-gray-700">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Link href="/dashboard" className="flex-shrink-0 flex items-center">
            <span className="text-xl font-bold text-blue-600">CandidAI</span>
          </Link>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-4 py-4 space-y-1">
            {renderNavItems(navigation, pathname)}
          </nav>
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-medium">HR</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">
                    HR Manager
                  </p>
                  <p className="text-xs text-gray-500">hr@company.com</p>
                </div>
              </div>
              <button className="text-gray-500 hover:text-gray-700">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function renderNavItems(navigation, pathname) {
  return navigation.map((item) => {
    const isActive = pathname === item.href;
    const Icon = item.icon;

    return (
      <Link
        key={item.name}
        href={item.href}
        className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
          isActive
            ? "bg-blue-50 text-blue-600"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`}
      >
        <Icon
          className={`mr-3 h-5 w-5 ${
            isActive ? "text-blue-600" : "text-gray-400"
          }`}
        />
        {item.name}
      </Link>
    );
  });
}
