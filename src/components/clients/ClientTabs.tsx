import { Search } from 'lucide-react'
import { Input } from '../ui/input'

interface ClientTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  searchValue: string
  onSearchChange: (value: string) => void
  totalCount: number
  statusCounts: {
    all: number
    active: number
    inactive: number
  }
}

export function ClientTabs({
  activeTab,
  onTabChange,
  searchValue,
  onSearchChange,
  totalCount,
  statusCounts
}: ClientTabsProps) {
  const tabs = [
    { id: 'all', label: 'Todos', count: statusCounts.all },
    { id: 'active', label: 'Ativos', count: statusCounts.active },
    { id: 'inactive', label: 'Inativos', count: statusCounts.inactive },
  ]

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 mb-6 shadow-lg">
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Buscar clientes por nome, email ou telefone..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-slate-800 border-slate-700 text-white placeholder-slate-400 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        />
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              px-6 py-3 rounded-xl font-medium transition-all duration-200
              ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }
            `}
          >
            <span>{tab.label}</span>
            <span className={`ml-2 px-2 py-1 rounded-lg text-xs font-bold ${
              activeTab === tab.id
                ? 'bg-blue-700 text-white'
                : 'bg-slate-700 text-slate-300'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
