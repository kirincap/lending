'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, DollarSign, Users } from 'lucide-react'

export function Dashboard() {
  const stats = [
    {
      title: 'Total Value Locked',
      value: '$0.00',
      change: '+0%',
      trend: 'up',
      icon: DollarSign,
    },
    {
      title: 'Active Loans',
      value: '0',
      change: '+0%',
      trend: 'up',
      icon: Users,
    },
    {
      title: 'Average APY',
      value: '0.00%',
      change: '+0%',
      trend: 'up',
      icon: TrendingUp,
    },
    {
      title: 'Utilization Rate',
      value: '0.00%',
      change: '+0%',
      trend: 'up',
      icon: TrendingUp,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              {stat.trend === 'up' ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className={stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                {stat.change}
              </span>
              <span>from last week</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
