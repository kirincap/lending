# Interest Rate Models

## Overview

The protocol implements dynamic interest rates that automatically adjust based on supply and demand. This creates an efficient market where rates incentivize optimal liquidity levels.

## Base Model: Kinked Rate Curve

### Formula

```
Utilization Rate (U) = Total Borrowed / Total Deposited

if U <= Ukink:
    Borrow Rate = Rbase + U × Slope1
else:
    Borrow Rate = Rbase + Ukink × Slope1 + (U - Ukink) × Slope2

Supply Rate = Borrow Rate × U × (1 - Reserve Factor)
```

### Parameters

| Parameter | Default Value | Description |
|-----------|--------------|-------------|
| Rbase | 2% | Base interest rate |
| Ukink | 80% | Optimal utilization point |
| Slope1 | 10% | Rate increase below kink |
| Slope2 | 100% | Rate increase above kink |
| Reserve Factor | 10% | Protocol fee percentage |

### Visual Representation

```
Interest Rate
    |
100%|                                    /
    |                                   /
    |                                  /
 50%|                                 /
    |                               /|
    |                              / |
 20%|                        _____/  |
    |                   ____/        |
  2%|______________/                 |
    |                                |
    0%              80%             100%
                Utilization Rate
```

## Advanced Models

### 1. Volatility-Adjusted Model

For conditional tokens with high price volatility:

```
Volatility Multiplier = 1 + (σ × Risk Factor)
Adjusted Rate = Base Rate × Volatility Multiplier
```

Where:
- σ = 30-day price volatility
- Risk Factor = Protocol-defined parameter (0.5 - 2.0)

### 2. Time-Decay Model

For markets approaching resolution:

```
Time Factor = 1 + (1 / Days Until Resolution)
Final Rate = Base Rate × Time Factor
```

This increases rates as markets approach resolution, compensating for increased risk.

### 3. Volume-Weighted Model

For markets with varying liquidity:

```
Liquidity Score = Daily Volume / Total Market Cap
Rate Adjustment = Base Rate × (2 - Liquidity Score)
```

Less liquid markets have higher rates to compensate for risk.

## Implementation Details

### Rate Calculation Contract

```solidity
contract InterestRateModel {
    struct RateParams {
        uint256 baseRate;        // 2e16 (2%)
        uint256 kink;            // 8e17 (80%)
        uint256 slope1;          // 1e17 (10%)
        uint256 slope2;          // 1e18 (100%)
        uint256 reserveFactor;   // 1e17 (10%)
    }
    
    function calculateRates(
        uint256 totalBorrowed,
        uint256 totalDeposited
    ) external view returns (
        uint256 borrowRate,
        uint256 supplyRate
    ) {
        uint256 utilization = totalBorrowed * 1e18 / totalDeposited;
        
        if (utilization <= params.kink) {
            borrowRate = params.baseRate + utilization * params.slope1 / 1e18;
        } else {
            borrowRate = params.baseRate 
                + params.kink * params.slope1 / 1e18
                + (utilization - params.kink) * params.slope2 / 1e18;
        }
        
        supplyRate = borrowRate * utilization * (1e18 - params.reserveFactor) / 1e36;
    }
}
```

### Compound Interest Accrual

Interest compounds continuously using exponential approximation:

```solidity
function accrueInterest(uint256 principal, uint256 rate, uint256 time) 
    returns (uint256) {
    // Using e^x ≈ 1 + x + x²/2 for small x
    uint256 rateTime = rate * time / SECONDS_PER_YEAR;
    uint256 interestMultiplier = 1e18 + rateTime + (rateTime * rateTime) / (2 * 1e18);
    return principal * interestMultiplier / 1e18;
}
```

## Market-Specific Configurations

### High-Volume Markets
- Lower base rate (1%)
- Higher kink (85%)
- Gentler slopes

### Binary Outcome Markets
- Standard configuration
- Additional volatility adjustment

### Multi-Outcome Markets
- Higher base rate (3%)
- Lower kink (75%)
- Steeper slope2

### Near-Resolution Markets
- Time-decay factor applied
- Increased reserve factor (15%)

## Rate Limits and Safeguards

### Maximum Rates
- Borrow APY cap: 1000%
- Supply APY cap: 800%

### Rate Change Limits
- Maximum increase per update: 10%
- Cooldown period: 1 hour

### Emergency Controls
- Pause rate updates
- Manual rate override (governance only)
- Rate rollback capability

## Optimization Strategies

### For Lenders
1. Monitor utilization rates
2. Deposit when rates are high
3. Consider rate trends

### For Borrowers
1. Borrow at low utilization
2. Monitor rate changes
3. Plan for rate increases

### For the Protocol
1. Adjust parameters based on market conditions
2. Fine-tune reserve factors
3. Implement seasonal adjustments

## Future Enhancements

### Dynamic Parameter Adjustment
- ML-based rate optimization
- Real-time market condition response
- Automated parameter tuning

### Cross-Market Rate Correlation
- Rates influenced by related markets
- Portfolio-based pricing
- Risk correlation factors

### Yield Curve Implementation
- Different rates for different loan durations
- Term structure modeling
- Forward rate agreements

## Monitoring and Analytics

Key metrics to track:
- Average utilization rate
- Rate volatility
- Spread between borrow/supply rates
- Reserve accumulation
- User behavior patterns

### Example Dashboard Queries

```sql
-- Average utilization over time
SELECT 
    DATE_TRUNC('hour', timestamp) as hour,
    AVG(total_borrowed / total_deposited) as avg_utilization,
    AVG(borrow_rate) as avg_borrow_rate
FROM pool_stats
GROUP BY hour;

-- Rate efficiency
SELECT 
    market_type,
    AVG(supply_rate / borrow_rate) as efficiency,
    AVG(utilization) as avg_utilization
FROM market_stats
GROUP BY market_type;
```

## Conclusion

The interest rate model is designed to:
1. Maintain optimal liquidity levels
2. Fairly compensate lenders for risk
3. Provide predictable costs for borrowers
4. Generate sustainable protocol revenue

Regular monitoring and adjustment ensure the model remains effective across different market conditions.
