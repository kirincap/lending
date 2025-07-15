# Automated Lending Pool for Conditional Tokens

An automated money market protocol for Polymarket conditional tokens, enabling instant liquidity and algorithmic interest rates.

## Overview

This project reimagines peer-to-peer lending for conditional tokens as an automated lending pool, similar to Aave or Compound. Users can:

- **Lend**: Deposit USDC to earn yield from borrowers
- **Borrow**: Use conditional tokens as collateral to borrow USDC instantly
- **Liquidate**: Maintain protocol health by liquidating undercollateralized positions

## Key Features

### 🏊 Liquidity Pool Model
- Shared USDC pool eliminates P2P matching
- Instant borrowing without waiting for offers
- Lenders earn continuous yield from pool utilization

### 📈 Algorithmic Interest Rates
- Dynamic rates based on supply and demand
- Utilization-based pricing model
- No manual rate negotiation needed

### 🔒 Automated Risk Management
- Loan-to-Value (LTV) ratios per token type
- Health factor monitoring
- Efficient liquidation mechanism

### ⚡ Capital Efficiency
- Pooled liquidity serves multiple borrowers
- Partial liquidations minimize losses
- Market-driven rate discovery

## Architecture

```
┌─────────────────┐     ┌─────────────────┐
│    Lenders      │     │    Borrowers    │
└────────┬────────┘     └────────┬────────┘
         │ USDC                  │ Conditional
         ▼                       │ Tokens
┌─────────────────────────────────────────┐
│          Lending Pool Contract          │
├─────────────────────────────────────────┤
│ • Interest Rate Model                   │
│ • Collateral Management                 │
│ • Liquidation Engine                    │
└─────────────────────────────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│  Price Oracle   │     │ Conditional     │
│                 │     │ Tokens Contract │
└─────────────────┘     └─────────────────┘
```

## Interest Rate Model

The protocol uses a kinked interest rate model:

```
if (utilization <= kink):
    rate = baseRate + utilization * slope1
else:
    rate = baseRate + kink * slope1 + (utilization - kink) * slope2
```

This creates efficient markets by:
- Encouraging deposits when utilization is high
- Providing competitive rates at optimal utilization
- Preventing excessive borrowing

## Risk Parameters

### Collateral Types
Different conditional tokens have different risk profiles:

| Market Type | LTV | Liquidation Threshold | Liquidation Bonus |
|-------------|-----|-----------------------|-------------------|
| High Volume | 80% | 85%                   | 5%                |
| Medium Volume | 65% | 75%                  | 7.5%              |
| Low Volume | 50% | 60%                   | 10%               |
| Near Resolution | 30% | 40%                | 15%               |

### Health Factor
Positions are monitored using a health factor:

```
Health Factor = (Collateral Value × Liquidation Threshold) / Borrowed Amount
```

When Health Factor < 1, the position can be liquidated.

## Development Status

⚠️ **This is a conceptual design and research project**

Current phase:
- [x] Architecture design
- [x] Interest rate model
- [x] Risk framework
- [ ] Smart contract implementation
- [ ] Oracle integration
- [ ] Testing suite
- [ ] Audit

## Technical Stack

- **Smart Contracts**: Solidity ^0.8.26
- **Development Framework**: Foundry
- **Conditional Tokens**: Polymarket CTF (ERC1155)
- **Stablecoin**: USDC

## Documentation

Detailed documentation available in `/docs`:
- [Architecture Overview](docs/architecture.md)
- [Interest Rate Models](docs/interest-rates.md)
- [Liquidation Mechanics](docs/liquidations.md)
- [Risk Parameters](docs/risk-parameters.md)

## Security Considerations

This protocol design addresses several security concerns:
- Oracle manipulation resistance
- Flash loan attack mitigation
- Efficient liquidation incentives
- Isolated risk per token type

## Contributing

This is an open research project. Contributions welcome:
- Protocol design improvements
- Risk model enhancements
- Implementation suggestions
- Security analysis

## License

MIT License - see LICENSE file for details

## Disclaimer

This is an experimental design. No smart contracts have been audited. Use any implementations at your own risk.
