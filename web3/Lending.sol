// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract LendingVault {
    address owner;

    IERC20 public vBTC;
    IERC20 public VNST;
    AggregatorV3Interface public priceFeed;

    uint256 public constant LTV = 70;
    uint256 public constant LIQUIDATION_THRESHOLD = 85;

    struct UserVault {
        uint256 collateralAmount;
        uint256 debtAmount;
    }

    mapping(address => UserVault) public vaults;

    constructor(
        address _vBTC,
        address _VNST,
        address _priceFeed
    ) {
        vBTC = IERC20(_vBTC);
        VNST = IERC20(_VNST);
        priceFeed = AggregatorV3Interface(_priceFeed);
        owner = msg.sender;
    }

    function depositCollateral(uint256 _amount) external {
        require(_amount > 0, "Invalid amount");
        vBTC.transferFrom(msg.sender, address(this), _amount);
        vaults[msg.sender].collateralAmount += _amount;
    }

    function borrow(uint256 _amount) external {
        require(_amount > 0, "Invalid borrow amount");
        uint256 maxBorrow = maxBorrowable(msg.sender);
        require(
            vaults[msg.sender].debtAmount + _amount <= maxBorrow,
            "Exceeds borrow limit"
        );

        vaults[msg.sender].debtAmount += _amount;
        VNST.transfer(msg.sender, _amount);
    }

    function repay(uint256 _amount) external {
        require(_amount > 0, "Invalid amount");

        VNST.transferFrom(msg.sender, address(this), _amount);

        if (_amount >= vaults[msg.sender].debtAmount) {
            vaults[msg.sender].debtAmount = 0;
        } else {
            vaults[msg.sender].debtAmount -= _amount;
        }
    }

    function withdrawCollateral(uint256 _amount) external {
        require(_amount > 0, "Invalid amount");
        require(
            _amount <= vaults[msg.sender].collateralAmount,
            "Exceeds collateral"
        );

        uint256 remainingCollateral = vaults[msg.sender].collateralAmount -
            _amount;

        (, int256 price, , , ) = priceFeed.latestRoundData();
        require(price > 0, "Invalid price");
        uint256 btcPrice = uint256(price);
        require(btcPrice > 0, "Invalid price");

        uint256 collateralValueUSD = (btcPrice * remainingCollateral) /
            (1e8 * 1000);
        uint256 debt = vaults[msg.sender].debtAmount;

        uint256 newLTV = collateralValueUSD == 0
            ? 100
            : (debt * 100) / collateralValueUSD;
        require(newLTV <= LIQUIDATION_THRESHOLD, "LTV too high after withdraw");

        vaults[msg.sender].collateralAmount = remainingCollateral;
        vBTC.transfer(msg.sender, _amount);
    }

    function liquidate(address user) external {
        require(msg.sender == owner, "Only owner!");
        require(!_isSafe(user), "User not eligible for liquidation");
        uint256 seizedCollateral = vaults[user].collateralAmount;
        vaults[user].collateralAmount = 0;
        vaults[user].debtAmount = 0;

        vBTC.transfer(msg.sender, seizedCollateral);
    }

    function getDebtInfo(address user)
        external
        view
        returns (
            uint256 collateralAmount,
            uint256 collateralValueUSD,
            uint256 debtAmount,
            uint256 currentLTV,
            uint256 liquidationPrice
        )
    {
        collateralAmount = vaults[user].collateralAmount;
        debtAmount = vaults[user].debtAmount;
        collateralValueUSD = _getCollateralValueUSD(user);

        if (collateralValueUSD == 0) {
            currentLTV = 0;
        } else {
            currentLTV = (debtAmount * 100) / collateralValueUSD;
        }

        if (collateralAmount == 0) {
            liquidationPrice = 0;
        } else {
            liquidationPrice =
                (debtAmount * 100) /
                (collateralAmount * LIQUIDATION_THRESHOLD);
        }
    }

    function maxBorrowable(address user) public view returns (uint256) {
        uint256 collateralValueUSD = _getCollateralValueUSD(user);
        return (collateralValueUSD * LTV) / 100;
    }

    function _isSafe(address user) internal view returns (bool) {
        uint256 collateralValue = _getCollateralValueUSD(user);
        uint256 debt = vaults[user].debtAmount;

        if (debt == 0) return true;

        uint256 ratio = (debt * 100) / collateralValue;
        return ratio <= LIQUIDATION_THRESHOLD;
    }

    function _getCollateralValueUSD(address user)
        internal
        view
        returns (uint256)
    {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        require(price > 0, "Invalid price");

        uint256 btcPrice = uint256(price);
        uint256 vbtcAmount = vaults[user].collateralAmount;

        return (btcPrice * vbtcAmount) / (1e8 * 1000);
    }
}
