# System Architecture

## Overview

The Automated Lending Pool for Conditional Tokens is designed as a modular, upgradeable system that enables efficient lending and borrowing using Polymarket conditional tokens as collateral.

## Core Components

### 1. Lending Pool Contract

The main contract that manages all lending operations:

```solidity
contract AutomatedPolyLend {
    // Core state variables
    mapping(address => UserAccount) public accounts;
    mapping(uint256 => CollateralConfig) public collateralConfigs;
    
    // Pool state
    uint256 public totalDeposited;
    uint256 public totalBorrowed;
    uint256 public reserveFactor;
}
```

**Key Functions:**
- `deposit()`: Add USDC to the lending pool
- `withdraw()`: Remove USDC from the pool
- `borrow()`: Borrow USDC against conditional tokens
- `repay()`: Repay borrowed USDC
- `liquidate()`: Liquidate undercollateralized positions

### 2. Interest Rate Model

Implements dynamic interest rates based on pool utilization:

```solidity
interface IInterestRateModel {
    function calculateBorrowRate(
        uint256 totalBorrowed,
        uint256 totalDeposited
    ) external view returns (uint256);
    
    function calculateSupplyRate(
        uint256 totalBorrowed,
        uint256 totalDeposited,
        uint256 reserveFactor
    ) external view returns (uint256);
}
```

### 3. Price Oracle

Provides real-time pricing for conditional tokens:

```solidity
interface IPriceOracle {
    function getPrice(uint256 positionId) external view returns (uint256);
    function getReliability(uint256 positionId) external view returns (uint8);
}
```

### 4. Liquidation Engine

Handles the liquidation of unhealthy positions:

```solidity
struct LiquidationParams {
    uint256 healthFactorThreshold;
    uint256 liquidationBonus;
    uint256 maxLiquidationAmount;
}
```

## Data Flow

### Deposit Flow
```
User → deposit(amount) → LendingPool
                         ├─ Update totalDeposited
                         ├─ Calculate shares
                         ├─ Transfer USDC
                         └─ Mint LP tokens
```

### Borrow Flow
```
User → borrow(positionId, amount) → LendingPool
                                    ├─ Check collateral value
                                    ├─ Verify health factor
                                    ├─ Update user debt
                                    ├─ Transfer USDC
                                    └─ Lock collateral
```

### Liquidation Flow
```
Liquidator → liquidate(user, positionId) → LendingPool
                                           ├─ Verify health < 1
                                           ├─ Calculate repay amount
                                           ├─ Transfer USDC
                                           ├─ Transfer collateral + bonus
                                           └─ Update positions
```

## State Management

### User Account Structure
```solidity
struct UserAccount {
    // Deposits
    uint256 depositedAmount;
    uint256 shares;
    
    // Borrows
    mapping(uint256 => Position) positions;
    uint256 totalBorrowed;
    
    // Timestamps
    uint256 lastUpdateTime;
}

struct Position {
    uint256 collateralAmount;
    uint256 borrowedAmount;
    uint256 accumulatedInterest;
}
```

### Global State Updates

The protocol maintains global state that updates on every interaction:
- Interest accrual
- Utilization rates
- Reserve accumulation

## Security Architecture

### Access Control
- Role-based permissions for admin functions
- Emergency pause mechanism
- Timelock for parameter changes

### Reentrancy Protection
- Check-Effects-Interactions pattern
- Reentrancy guards on all external functions

### Oracle Security
- Multiple price sources
- TWAP for manipulation resistance
- Staleness checks

## Upgrade Pattern

The protocol uses a proxy pattern for upgradeability:

```
User → Proxy Contract → Implementation Contract
         ├─ Storage
         └─ Delegatecall
```

This allows:
- Bug fixes without migration
- Feature additions
- Parameter adjustments

## Gas Optimization

### Storage Patterns
- Packed structs for efficiency
- Minimal storage reads/writes
- Batch operations support

### Calculation Optimization
- Fixed-point math library
- Caching frequently used values
- Lazy evaluation where possible

## Integration Points

### External Contracts
1. **Conditional Tokens (ERC1155)**
   - Token transfers
   - Balance queries
   - Approval management

2. **USDC (ERC20)**
   - Transfer operations
   - Allowance handling

3. **Price Feeds**
   - Polymarket orderbook
   - External oracles
   - Fallback mechanisms

### Events and Monitoring

Critical events for off-chain monitoring:
```solidity
event Deposit(address user, uint256 amount, uint256 shares);
event Borrow(address user, uint256 positionId, uint256 amount);
event Liquidation(address liquidator, address user, uint256 repaid, uint256 seized);
event InterestAccrued(uint256 borrowRate, uint256 supplyRate);
```

## Failure Modes and Recovery

### Circuit Breakers
- Pause on abnormal utilization
- Rate limits on large operations
- Oracle failure handling

### Recovery Mechanisms
- Admin debt forgiveness (emergency only)
- Collateral recovery functions
- Reserve fund for bad debt

## Future Extensibility

The architecture supports:
- New collateral types
- Alternative interest models
- Cross-chain functionality
- Flash loan integration
- Yield optimization strategies
