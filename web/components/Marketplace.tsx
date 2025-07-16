'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DollarSign, Percent, Clock, Search, TrendingUp, Plus } from 'lucide-react'
import { useAccount } from 'wagmi'

// Mock data for open offers
const mockOffers = [
  {
    id: '1',
    type: 'lend',
    lender: '0x1234...5678',
    amount: '10000',
    apy: 5.5,
    duration: 30,
    utilization: 75,
    status: 'active',
    market: 'Presidential Election 2024',
    collateralRequired: '15000',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    type: 'lend',
    lender: '0xabcd...efgh',
    amount: '5000',
    apy: 4.2,
    duration: 14,
    utilization: 50,
    status: 'active',
    market: 'Super Bowl Winner',
    collateralRequired: '7500',
    createdAt: new Date('2024-01-14'),
  },
  {
    id: '3',
    type: 'lend',
    lender: '0x9876...5432',
    amount: '25000',
    apy: 6.8,
    duration: 60,
    utilization: 90,
    status: 'active',
    market: 'Fed Rate Decision',
    collateralRequired: '37500',
    createdAt: new Date('2024-01-13'),
  },
]

export function Marketplace() {
  const { isConnected, address } = useAccount()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMarket, setSelectedMarket] = useState('all')
  const [sortBy, setSortBy] = useState('apy')
  const [isCreateOfferOpen, setIsCreateOfferOpen] = useState(false)

  // Filter and sort offers
  const filteredOffers = mockOffers.filter(offer => {
    if (searchTerm && !offer.market.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }
    if (selectedMarket !== 'all' && offer.market !== selectedMarket) {
      return false
    }
    return true
  }).sort((a, b) => {
    switch (sortBy) {
      case 'apy':
        return b.apy - a.apy
      case 'amount':
        return Number(b.amount) - Number(a.amount)
      case 'duration':
        return a.duration - b.duration
      case 'recent':
        return b.createdAt.getTime() - a.createdAt.getTime()
      default:
        return 0
    }
  })

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Marketplace</CardTitle>
          <CardDescription>
            Connect your wallet to view and create lending offers
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Lending Marketplace</CardTitle>
              <CardDescription>
                Browse and create lending offers for conditional tokens
              </CardDescription>
            </div>
            <Dialog open={isCreateOfferOpen} onOpenChange={setIsCreateOfferOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Offer
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Create Lending Offer</DialogTitle>
                  <DialogDescription>
                    Set your lending terms for conditional token borrowers
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="market">Market</Label>
                    <select
                      id="market"
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      <option>Presidential Election 2024</option>
                      <option>Super Bowl Winner</option>
                      <option>Fed Rate Decision</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="offer-amount">Amount (USDC)</Label>
                    <Input
                      id="offer-amount"
                      type="number"
                      placeholder="0.00"
                      className="text-lg"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="offer-apy">APY (%)</Label>
                    <Input
                      id="offer-apy"
                      type="number"
                      placeholder="0.0"
                      step="0.1"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="offer-duration">Duration (days)</Label>
                    <Input
                      id="offer-duration"
                      type="number"
                      placeholder="30"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="ltv">Loan-to-Value Ratio (%)</Label>
                    <Input
                      id="ltv"
                      type="number"
                      placeholder="75"
                      max="100"
                    />
                    <p className="text-sm text-muted-foreground">
                      Maximum percentage of collateral value that can be borrowed
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateOfferOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsCreateOfferOpen(false)}>
                    Create Offer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search markets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              className="h-10 px-3 rounded-md border border-input bg-background text-sm"
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value)}
            >
              <option value="all">All Markets</option>
              <option value="Presidential Election 2024">Presidential Election 2024</option>
              <option value="Super Bowl Winner">Super Bowl Winner</option>
              <option value="Fed Rate Decision">Fed Rate Decision</option>
            </select>
            <select
              className="h-10 px-3 rounded-md border border-input bg-background text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="apy">Sort by APY</option>
              <option value="amount">Sort by Amount</option>
              <option value="duration">Sort by Duration</option>
              <option value="recent">Sort by Recent</option>
            </select>
          </div>

          {/* Market Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Total Value Locked</div>
                <div className="text-2xl font-bold flex items-center">
                  <DollarSign className="h-4 w-4" />
                  2.5M
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Average APY</div>
                <div className="text-2xl font-bold flex items-center">
                  <Percent className="h-4 w-4 mr-1" />
                  5.5%
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Active Offers</div>
                <div className="text-2xl font-bold">{mockOffers.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Avg Utilization</div>
                <div className="text-2xl font-bold">71.7%</div>
              </CardContent>
            </Card>
          </div>

          {/* Offers List */}
          <div className="space-y-4">
            {filteredOffers.map((offer) => (
              <Card key={offer.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{offer.market}</h3>
                        <Badge variant="secondary">
                          {offer.status === 'active' ? 'Active' : 'Filled'}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span>Lender: {offer.lender}</span>
                        <span>Created: {offer.createdAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6">
                      <div>
                        <div className="text-sm text-muted-foreground">Amount</div>
                        <div className="font-semibold flex items-center">
                          <DollarSign className="h-3 w-3" />
                          {Number(offer.amount).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">APY</div>
                        <div className="font-semibold flex items-center text-green-600">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {offer.apy}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Duration</div>
                        <div className="font-semibold flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {offer.duration}d
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Utilization</div>
                        <div className="font-semibold">{offer.utilization}%</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm">
                        Accept Offer
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Collateral Required: ${Number(offer.collateralRequired).toLocaleString()} in conditional tokens
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredOffers.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">No offers found matching your criteria</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
