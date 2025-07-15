'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { DollarSign, Percent, Clock } from 'lucide-react'
import { useAccount } from 'wagmi'

export function LendingInterface() {
  const { isConnected } = useAccount()

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connect Wallet</CardTitle>
          <CardDescription>
            Please connect your wallet to access the lending platform
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Tabs defaultValue="lend" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="lend">Lend</TabsTrigger>
        <TabsTrigger value="borrow">Borrow</TabsTrigger>
      </TabsList>
      
      <TabsContent value="lend">
        <Card>
          <CardHeader>
            <CardTitle>Supply Liquidity</CardTitle>
            <CardDescription>
              Deposit USDC to earn interest from borrowers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lend-amount">Amount (USDC)</Label>
              <Input
                id="lend-amount"
                type="number"
                placeholder="0.00"
                className="text-lg"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4 py-4">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Current APY</div>
                <div className="text-2xl font-bold flex items-center justify-center">
                  <Percent className="h-4 w-4 mr-1" />
                  0.00%
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Pool Size</div>
                <div className="text-2xl font-bold flex items-center justify-center">
                  <DollarSign className="h-4 w-4" />
                  0.00
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Utilization</div>
                <div className="text-2xl font-bold">0.00%</div>
              </div>
            </div>
            
            <Button className="w-full" size="lg">
              Supply USDC
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="borrow">
        <Card>
          <CardHeader>
            <CardTitle>Borrow Against Conditional Tokens</CardTitle>
            <CardDescription>
              Use your conditional tokens as collateral to borrow USDC
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="market-select">Select Market</Label>
              <select 
                id="market-select"
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option>Select a prediction market...</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="collateral-amount">Collateral Amount</Label>
              <Input
                id="collateral-amount"
                type="number"
                placeholder="0.00"
                className="text-lg"
              />
              <p className="text-sm text-muted-foreground">
                Available: 0.00 tokens
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="borrow-amount">Borrow Amount (USDC)</Label>
              <Input
                id="borrow-amount"
                type="number"
                placeholder="0.00"
                className="text-lg"
              />
              <p className="text-sm text-muted-foreground">
                Max borrow: $0.00 (LTV: 0%)
              </p>
            </div>
            
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Interest Rate</span>
                <span className="font-medium">0.00% APY</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Health Factor</span>
                <Badge variant="secondary">--</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Liquidation Price</span>
                <span className="font-medium">--</span>
              </div>
            </div>
            
            <Button className="w-full" size="lg" disabled>
              Select Market First
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
