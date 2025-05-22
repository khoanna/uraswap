import React, { useEffect, useState } from "react";
import {
    BadgeDollarSign,
    Vault,
    AlertTriangle,
    TrendingUp,
    PlusCircle,
    ArrowDownCircle,
    ArrowUpCircle,
} from "lucide-react";
import { Card, CardContent, Loader, Notification } from "../components";
import { useStateContext } from '../context';
import { ethers, formatEther } from "ethers";
import { contract } from "../constants";

function ActionBox({ label, placeholder, onClick, buttonText, icon, value, onChange }) {
    return (
        <div className="flex flex-col items-start w-full">
            <label className="mb-1 text-sm text-gray-300">{label}</label>
            <input
                type="number"
                placeholder={placeholder}
                className="bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                value={value}
                onChange={onChange}
            />
            <button
                onClick={onClick}
                className={` bg-gray-600 hover:bg-gray-700 text-gray-200 hover:text-white border border-gray-700  mt-3 px-4 py-2 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold shadow-md w-full transition`}
            >
                {icon} {buttonText}
            </button>
        </div>
    );
}

export default function LendingDashboard() {
    const { address, getDebtInfo, getMaxBorrow, deposit, repay, isConnected, borrow, VBTC, VNST, withdraw, lendingDeposit, lendingWithdraw, getAsset, getAPY } = useStateContext();

    const [collateralAmount, setCollateralAmount] = useState(0);
    const [collateralAmountUSD, setCollateralAmountUSD] = useState(0);
    const [debtAmount, setDebtAmount] = useState(0);
    const [currentLTV, setCurrentLTV] = useState(0);
    const [liquidationPrice, setLiquidationPrice] = useState(0)
    const [maxBorrow, setMaxBorrow] = useState(0);
    const [notification, setNotification] = useState(null);
    const [APY, setAPY] = useState(0);
    const [asset, setAsset] = useState(0);

    const [collateral, setCollateral] = useState();
    const [loan, setLoan] = useState();
    const [repayAmount, setRepayAmount] = useState();
    const [withdrawAmount, setWithdrawAmount] = useState();
    const [depositAmount, setDepositAmount] = useState();

    const [activeTab, setActiveTab] = useState("lending");
    const [loading, setLoading] = useState(false);

    const getDebt = async () => {
        const data = await getDebtInfo(address);
        setCollateralAmount(data[0]);
        setCollateralAmountUSD(data[1]);
        setDebtAmount(data[2]);
        setCurrentLTV(data[3]);
        setLiquidationPrice(data[4]);
        const maxBorrow = await getMaxBorrow(address);
        setMaxBorrow(maxBorrow);
        const APY = await getAPY()
        setAPY(APY);
        const asset = await getAsset(address);
        setAsset(asset);
    }

    useEffect(() => {
        getDebt();
    }, [isConnected, address])

    const handleDeposit = async () => {
        if (!collateral || Number(collateral) == 0) return;
        setLoading(true)
        try {
            const tx = await VBTC.approve(contract.lending, ethers.parseEther(String(collateral)))
            await tx.wait();
            await deposit(collateral);
            await getDebt();
            setCollateral('');
        } catch (error) {
        }
        setLoading(false);
    };

    const handleBorrow = async () => {
        if (!loan || Number(loan) == 0) return;
        setLoading(true)
        try {
            await borrow(loan);
            await getDebt();
            setLoan('');
            setLoading(false);
        } catch (error) {
            showNotification('error', 'Max borrow reached or insufficient liquidity in pool!')
            setLoading(false);
        }
    };

    const handleRepay = async () => {
        if (!repayAmount || Number(repayAmount) == 0) return;
        setLoading(true)
        try {
            const tx = await VNST.approve(contract.lending, ethers.parseEther(String(repayAmount)))
            await tx.wait();
            await repay(repayAmount);
            await getDebt();
            setRepayAmount('');
        } catch (error) {
        }
        setLoading(false);
    };

    const handleWithdraw = async () => {
        if (!withdrawAmount || Number(withdrawAmount) == 0) return;
        setLoading(true);
        try {
            await withdraw(withdrawAmount);
            await getDebt();
            setWithdrawAmount('');
        } catch (error) {
            showNotification('error', 'LTV too high after withdraw!')
        }
        setLoading(false);
    }

    const handleLending = async () => {
        setLoading(true);
        try {
            const tx = await VNST.approve(contract.lending, ethers.parseEther(String(depositAmount)))
            await tx.wait();
            await lendingDeposit(depositAmount);
            await getDebt();
            setDepositAmount('')
        } catch (error) {
        }
        setLoading(false);
    }

    const handleWithdrawAsset = async () => {
        setLoading(true);
        try {
            await lendingWithdraw();
            await getDebt();
            setDepositAmount('')
        } catch (error) {
        }
        setLoading(false);
    }

    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => {
            setNotification(null);
        }, 4000);
    };

    return (
        <div className="min-h-screen p-6 text-white flex flex-col items-center ">
            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}
            {loading && <Loader />}
            <h1 className="text-4xl font-bold pb-8 mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500">
                Lending and Borrowing Dashboard
            </h1>

            <div className="w-full mb-12 max-w-sm mx-auto">
                <div className="flex rounded-2xl bg-gradient-to-r from-indigo-800 via-purple-800 to-pink-800 p-1 shadow-lg">
                    <button
                        onClick={() => setActiveTab("lending")}
                        className={`w-1/2 py-2 text-center rounded-xl transition-all duration-300 ${activeTab === "lending"
                            ? "bg-gray-900 text-white shadow-md"
                            : "bg-transparent text-white/70 hover:text-white"
                            }`}
                    >
                        Lending
                    </button>
                    <button
                        onClick={() => setActiveTab("borrowing")}
                        className={`w-1/2 py-2 text-center rounded-xl transition-all duration-300 ${activeTab === "borrowing"
                            ? "bg-gray-900 text-white shadow-md"
                            : "bg-transparent text-white/70 hover:text-white"
                            }`}
                    >
                        Borrowing
                    </button>
                </div>
            </div>


            {address ? (
                <>
                    {activeTab == "borrowing" ? (
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
                                <Card className="bg-gray-900 border border-gray-800 rounded-2xl">
                                    <CardContent className="p-5">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Vault className="text-yellow-400" />
                                            <h3 className="text-lg font-semibold">Collateral</h3>
                                        </div>
                                        <p>{formatEther(collateralAmount)} vBTC</p>
                                        <p className="text-sm text-gray-400">
                                            Value: {Number(formatEther(collateralAmountUSD)).toFixed(2)} VNST
                                        </p>
                                        <input
                                            type="number"
                                            placeholder="vBTC amount"
                                            className="mt-4 bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                                            value={withdrawAmount}
                                            onChange={(e) => setWithdrawAmount(e.target.value)}
                                        />
                                        <button
                                            className="mt-4 w-full py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white border border-gray-700 shadow-md transition duration-300 ease-in-out"
                                            onClick={() => handleWithdraw()}
                                        >
                                            🔓 Withdraw Collateral
                                        </button>
                                    </CardContent>
                                </Card>

                                <Card className="bg-gray-900 border border-gray-800 rounded-2xl">
                                    <CardContent className="p-5">
                                        <div className="flex items-center gap-3 mb-2">
                                            <BadgeDollarSign className="text-green-400" />
                                            <h3 className="text-lg font-semibold">Outstanding Debt</h3>
                                        </div>
                                        <p>{formatEther(debtAmount)} VNST</p>
                                        <p className="text-sm text-gray-400">Current LTV: {Number(currentLTV)} %</p>
                                    </CardContent>
                                </Card>

                                <Card className="bg-gray-900 border border-gray-800 rounded-2xl">
                                    <CardContent className="p-5">
                                        <div className="flex items-center gap-3 mb-2">
                                            <TrendingUp className="text-blue-400" />
                                            <h3 className="text-lg font-semibold">Max Borrow</h3>
                                        </div>
                                        <p>{Number(formatEther(maxBorrow)).toFixed(2)} VNST</p>
                                        <p className="text-sm text-gray-400">Max LTV: 70%</p>

                                    </CardContent>
                                </Card>

                                <Card className="bg-gray-900 border border-gray-800 rounded-2xl">
                                    <CardContent className="p-5">
                                        <div className="flex items-center gap-3 mb-2">
                                            <AlertTriangle className="text-red-500" />
                                            <h3 className="text-lg font-semibold">Liquidation Price</h3>
                                        </div>
                                        <p>{Number(liquidationPrice)} VNST</p>
                                        <p className="text-sm text-gray-400">
                                            Your position will be liquidated if vBTC drops to this price.
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-6 mt-10 justify-center w-full max-w-4xl">
                                <ActionBox
                                    label="Deposit Collateral"
                                    placeholder="vBTC Amount"
                                    onClick={() => handleDeposit()}
                                    buttonText="Deposit"
                                    icon={<PlusCircle className="w-4 h-4" />}
                                    value={collateral}
                                    onChange={(e) => setCollateral(e.target.value)}
                                />

                                <ActionBox
                                    label="Borrow VNST"
                                    placeholder="VNST amount to borrow"
                                    onClick={() => handleBorrow()}
                                    buttonText="Borrow VNST"
                                    icon={<ArrowDownCircle className="w-4 h-4" />}
                                    value={loan}
                                    onChange={(e) => setLoan(e.target.value)}
                                />

                                <ActionBox
                                    label="Repay Amount"
                                    placeholder="VNST amount to repay"
                                    onClick={handleRepay}
                                    buttonText="Repay"
                                    icon={<ArrowUpCircle className="w-4 h-4" />}
                                    value={repayAmount}
                                    onChange={(e) => setRepayAmount(e.target.value)}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
                            <Card className="bg-gray-900 border border-gray-800 rounded-2xl">
                                <CardContent className="p-5">
                                    <div className="flex items-center gap-3 mb-2">
                                        <BadgeDollarSign className="text-green-400" />
                                        <h3 className="text-lg font-semibold">Lending</h3>
                                    </div>
                                    <p className="text-sm text-gray-400">Current APY: {Number(formatEther(APY)) * 100}%</p>

                                    <input
                                        type="number"
                                        placeholder="Enter amount to lend"
                                        className="mt-4 bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                                        value={depositAmount}
                                        onChange={(e) => setDepositAmount(e.target.value)}
                                    />
                                    <button
                                        className="mt-4 w-full py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white border border-gray-700 shadow-md transition duration-300 ease-in-out"
                                        onClick={() => handleLending()}
                                    >
                                        Deposit
                                    </button>
                                </CardContent>
                            </Card>
                            <Card className="bg-gray-900 border border-gray-800 rounded-2xl">
                                <CardContent className="p-5">
                                    <div className="flex items-center gap-3 mb-2">
                                        <BadgeDollarSign className="text-green-400" />
                                        <h3 className="text-lg font-semibold">Total Assets</h3>
                                    </div>
                                    <p>{Number(formatEther(asset)).toFixed(4)} VNST</p>
                                    <p className="text-sm text-gray-400">Including interest earned</p>

                                    <button
                                        className="mt-4 w-full py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white border border-gray-700 shadow-md transition duration-300 ease-in-out"
                                        onClick={() => handleWithdrawAsset()}
                                    >
                                        Withdraw All Assets
                                    </button>
                                </CardContent>
                            </Card>

                        </div>
                    )}
                </>
            ) : (<w3m-button />)}

        </div>
    );
}


