import { Users, UserPlus, TrendingUp, Activity } from 'lucide-react'

interface ClientStatsProps {
  stats: {
    total: number
    active: number
    newThisMonth: number
    growth: number
  }
  loading?: boolean
}

export function ClientStats({ stats, loading }: ClientStatsProps) {
  const statCards = [
    {
      title: 'Total de Clientes',
      value: stats.total,
      icon: Users,
      color: 'bg-blue-600',
      bgColor: 'bg-blue-600/10',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Clientes Ativos',
      value: stats.active,
      icon: Activity,
      color: 'bg-green-600',
      bgColor: 'bg-green-600/10',
      iconColor: 'text-green-600',
    },
    {
      title: 'Novos este Mês',
      value: stats.newThisMonth,
      icon: UserPlus,
      color: 'bg-purple-600',
      bgColor: 'bg-purple-600/10',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Crescimento Mensal',
      value: `${stats.growth > 0 ? '+' : ''}${stats.growth}%`,
      icon: TrendingUp,
      color: 'bg-orange-600',
      bgColor: 'bg-orange-600/10',
      iconColor: 'text-orange-600',
    },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 h-32"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:border-slate-600"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
            </div>
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium mb-1">{stat.title}</p>
            <p className="text-white text-3xl font-bold">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
