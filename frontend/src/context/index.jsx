import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers, formatEther } from 'ethers';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import { contract } from '../constants'

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const { address, isConnected } = useWeb3ModalAccount();

    const [VNST, setVNST] = useState(null)
    const [VBTC, setVBTC] = useState(null)
    const [AMM, setAMM] = useState(null)
    const [DAO, setDAO] = useState(null)
    const [faucet, setFaucet] = useState(null)
    const [stake, setStake] = useState(null)
    const [lending, setLending] = useState(null)
    const [network, setNetwork] = useState(null)

    useEffect(() => {
        const connect = async () => {
            if (isConnected && address) {
                if (window.ethereum) {
                    const provider = new ethers.BrowserProvider(window.ethereum);
                    const signer = await provider.getSigner();
                    const network = await provider.getNetwork();

                    const VNST = new ethers.Contract(contract.VNST, contract.VNSTABI, signer)
                    const VBTC = new ethers.Contract(contract.VBTC, contract.VBTCABI, signer)
                    const AMM = new ethers.Contract(contract.AMM, contract.AMMABI, signer)
                    const stake = new ethers.Contract(contract.stake, contract.stakeABI, signer)
                    const DAO = new ethers.Contract(contract.DAO, contract.DAOABI, signer)
                    const faucet = new ethers.Contract(contract.faucet, contract.faucetABI, signer)
                    const lending = new ethers.Contract(contract.lending, contract.lendingABI, signer)

                    setNetwork(network);

                    setVNST(VNST);
                    setVBTC(VBTC);
                    setAMM(AMM);
                    setStake(stake);
                    setDAO(DAO);
                    setFaucet(faucet);
                    setLending(lending);
                } else {
                    throw error;
                }
            }
        };
        connect();
    }, [isConnected, address, network]);

    const approveLiquidity = async (vnst, vbtc) => {
        try {
            if (VNST && VBTC) {
                const VNSTtx = await VNST.approve(contract.AMM, ethers.parseEther(String(vnst)));
                await VNSTtx.wait();
                const VBTCtx = await VBTC.approve(contract.AMM, ethers.parseEther(String(vbtc)));
                await VBTCtx.wait();
            }
        } catch (error) {
            throw error;
        }
    }

    const approveVBTC = async (amount) => {
        try {
            if (VBTC) {
                const VBTCtx = await VBTC.approve(contract.AMM, ethers.parseEther(String(amount)));
                await VBTCtx.wait();
            }
        } catch (error) {
            throw error;
        }
    }

    const approveVNST = async (amount) => {
        try {
            if (VNST) {
                const VNSTtx = await VNST.approve(contract.AMM, ethers.parseEther(String(amount)));
                await VNSTtx.wait();
            }
        } catch (error) {
            throw error;
        }
    }

    const approveShares = async (amount) => {
        try {
            if (AMM) {
                const AMMtx = await AMM.approve(contract.stake, ethers.parseEther(String(amount)));
                await AMMtx.wait();
            }
        } catch (error) {
            throw error;
        }
    }

    const addLiquidity = async (vnst, vbtc) => {
        try {
            if (AMM) {
                await approveLiquidity(vnst, vbtc);
                const tx = await AMM.addLiquidity(ethers.parseEther(String(vnst)), ethers.parseEther(String(vbtc)))
                await tx.wait();
            }
        } catch (error) {
            throw error;
        }
    }

    const getVBTCPrice = async () => {
        try {
            if (AMM) {
                const price = await AMM.getLatestBTCPrice();
                return (Number(price) - Number(price) % 1000) / 1000;
            }
        } catch (error) {
            throw error;
        }
    }

    const getSharesBalance = async () => {
        try {
            if (AMM && address) {
                const shares = await AMM.balanceOf(address);
                return Number(ethers.formatEther(shares));
            }
        } catch (error) {
            throw error;
        }
    }

    const removeLiquidity = async (shares) => {
        try {
            if (AMM) {
                const tx = await AMM.removeLiquidity(ethers.parseEther(String(shares)));
                await tx.wait();
            }
        } catch (error) {
            throw error;
        }
    }

    const swap = async (addressIn, amountIn) => {
        try {
            if (AMM) {
                const tx = await AMM.swap(addressIn, ethers.parseEther(String(amountIn)));
                await tx.wait();
            }
        } catch (error) {
            throw error;
        }
    }

    const staking = async (amount, duration) => {
        try {
            if (stake) {
                const tx = await stake.stake(amount, duration);
                await tx.wait();
            }
        } catch (error) {
            throw error;
        }
    }

    const getUserStakes = async (address) => {
        try {
            if (stake) {
                const users = await stake.getUserStakes(address);
                return users;
            }
        } catch (error) {
            throw error;
        }
    }

    const hasVoted = async (id, add) => {
        try {
            if (DAO) {
                const hasVote = await DAO.hasVoted(id, add);
                return hasVote;
            }
        } catch (error) {
            throw error;
        }
    }

    const getAllProposals = async (id, add) => {
        try {
            if (DAO) {
                const data = await DAO.getAllProposals();
                return data;
            }
        } catch (error) {
            throw error;
        }
    }

    const vote = async (id, sup) => {
        try {
            if (DAO) {
                const tx = await DAO.vote(id, sup);
                await tx.wait();
            }
        } catch (error) {
            throw error;
        }
    }

    const claim = async () => {
        try {
            if (faucet) {
                const tx = await faucet.claim();
                await tx.wait();
            }
        } catch (error) {
            throw error;
        }
    }

    const getDebtInfo = async (address) => {
        try {
            if (lending) {
                const info = await lending.getDebtInfo(address);
                return info;
            }
        } catch (error) {
            throw error;
        }
    }

    const getMaxBorrow = async (address) => {
        try {
            if (lending) {
                const info = await lending.maxBorrowable(address);
                return info;
            }
        } catch (error) {
            throw error;
        }
    }

    const deposit = async (amount) => {
        try {
            if (lending) {
                console.log(ethers.parseEther(String(amount)));
                const tx = await lending.depositCollateral(ethers.parseEther(String(amount)));
                await tx.wait();
            }
        } catch (error) {
            throw error;
        }
    }

    const repay = async (amount) => {
        try {
            if (lending) {
                const tx = await lending.repay(ethers.parseEther(String(amount)));
                await tx.wait();
            }
        } catch (error) {
            throw error;
        }
    }

    const borrow = async (amount) => {
        try {
            if (lending) {
                const tx = await lending.borrow(ethers.parseEther(String(amount)));
                await tx.wait();
            }
        } catch (error) {
            throw error;
        }
    }

    const withdraw = async (amount) => {
        try {
            if (lending) {
                const tx = await lending.withdrawCollateral(ethers.parseEther(String(amount)));
                await tx.wait();
            }
        } catch (error) {
            throw error;
        }
    }

    const lendingDeposit = async (amount) => {
        try {
            if (lending) {
                const tx = await lending.depositVNST(ethers.parseEther(String(amount)));
                await tx.wait();
            }
        } catch (error) {
            throw error;
        }
    }

    const lendingWithdraw = async () => {
        try {
            if (lending) {
                const tx = await lending.withdrawVNST();
                await tx.wait();
            }
        } catch (error) {
            throw error;
        }
    }

    const getAsset = async (address) => {
        try {
            if (lending) {
                const data = await lending.getAsset(address);
                return data;
            }
        } catch (error) {
            throw error;
        }
    }

    const getAPY = async () => {
        try {
            if (lending) {
                const data = await lending.getCurrentAPY();
                return data;
            }
        } catch (error) {
            throw error;
        }
    }

    return (
        <StateContext.Provider
            value={{
                getDebtInfo,
                getMaxBorrow,
                deposit,
                repay,
                borrow,
                approveLiquidity,
                addLiquidity,
                getVBTCPrice,
                getSharesBalance,
                removeLiquidity,
                address,
                isConnected,
                swap,
                approveVBTC,
                approveVNST,
                staking,
                getUserStakes,
                approveShares,
                hasVoted,
                getAllProposals,
                vote,
                claim,
                VBTC,
                VNST,
                withdraw,
                lendingDeposit,
                lendingWithdraw,
                getAsset,
                getAPY
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
