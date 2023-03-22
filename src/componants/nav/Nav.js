import { ethers } from "ethers";
import "react-toastify/dist/ReactToastify.css";
import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';

import Logo from '../../assets/logo.png'
import Image from '../../assets/metabillionaire-entrepreneurial.gif';


const Nav = ({ account, setAccount, balanceOfAccount, setAccountBalance }) => {
    const StorageABI = [{ "inputs": [], "name": "retrieveData", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "num", "type": "uint256" }], "name": "storeData", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]
    let signer = null;
    const [currentContractVal, setCurrentContractVal] = useState("");

    const contractAddress = '0xFEbEFA3E0EFC4F4AAddcEf56aa1f63C5158b0114';
    const provider = new ethers.BrowserProvider(window.ethereum);

    window.ethereum.on("accountsChanged", function (accounts) {
        setAccount(accounts[0]);
        getBalanceOfUser(accounts[0])
    });

    // CONNECT WALLET
    const connectWallet = async () => {
        try {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            setAccount(accounts[0]);
            getBalanceOfUser(accounts[0])

            toast.warn("Wallet " + accounts[0].slice(0, 4) + '....' + accounts[0].slice(accounts[0].length - 5, accounts[0].length) + " connected!");

        } catch (error) {
            console.log('Error connecting...');
        }
    };

    // logout meta
    const logoutMeta = async () => {
        toast.success("Wallet Disconnected!");
        setAccount("");
        setAccountBalance('');
    };

    // // Balance
    const getBalanceOfUser = async (account) => {

        const balance = await provider.getBalance(account);

        const balance_format = ethers.formatEther(balance)
        setAccountBalance(balance_format)
        console.log(balanceOfAccount)
    };

    // Write to contract
    const setHandler = async (event) => {
        event.preventDefault();
        signer = await provider.getSigner();

        let tempContract = new ethers.Contract(contractAddress, StorageABI, signer);

        await tempContract.storeData(event.target.fieldPush.value);

        toast.success("Data \" " + event.target.fieldPush.value + " \" will be add to Chain.");
    }

    // Read from contract
    const getCurrentVal = async () => {
        let tempContract = new ethers.Contract(contractAddress, StorageABI, provider);
        let val = await tempContract.retrieveData();

        console.log(val);
        setCurrentContractVal(val);
        toast.success("Data \" " + val + " \" from the Chain.");
    }

    return (
        <div>
            <header class="text-gray-400 bg-gray-900 body-font">
                <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} draggable theme="dark" />

                <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                    <a class="flex title-font font-medium items-center text-white mb-4 md:mb-0">
                        <img src={Logo} class="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" alt="Logo" />
                        <span class="ml-3 text-xl">Simple Project</span>
                    </a>
                    <nav class="md:ml-auto flex flex-wrap items-center text-base justify-center">
                    </nav>
                    <button onClick={connectWallet}
                        disabled={account ? true : false}
                        class="inline-flex items-center bg-gray-800 border-0 py-1 px-3 focus:outline-none hover:bg-gray-700 rounded-2xl text-base mt-4 md:mt-0">
                        {account ? "Connected " : "Connect Wallet "}
                        <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-1" viewBox="0 0 24 24">
                            <path d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>

                    </button>
                    <div className="ml-3">
                        {account ? (
                            <button
                                class="inline-flex items-center bg-gray-800 border-0 py-1 px-3 focus:outline-none hover:bg-gray-700 rounded-2xl text-base mt-4 md:mt-0"
                                onClick={logoutMeta}
                            >
                                Disconnect
                                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-1" viewBox="0 0 24 24">
                                    <path d="M5 12h14M12 5l7 7-7 7"></path>
                                </svg>
                            </button>
                        ) : (
                            ""
                        )}
                    </div>
                </div>
            </header>
            <section class="text-gray-400 bg-gray-900 body-font">
                <div class="container mx-auto flex px-5 py-10 md:flex-row flex-col items-center">
                    <div class="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0">
                        <img class="object-cover object-center rounded-3xl" alt="Hero" src={Image} />
                    </div>
                    <div class="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
                        <h1 class="title-font sm:text-4xl text-3xl mb-4 font-medium text-white">
                            Address: {account ? account.slice(0, 4) + "..." + account.slice(account.length - 4, account.length) : "Connect Wallet First"}
                        </h1>
                        <h3 class="title-font sm:text-2xl text-sm mb-4 font-medium text-white">
                            Balance: {balanceOfAccount ? balanceOfAccount.slice(0, 6) : ''}
                        </h3>
                        {account ? (
                            <div>
                                <div class="flex w-full md:justify-start justify-center items-end">
                                    <form onSubmit={setHandler}>
                                        <div class="relative mr-4 lg:w-full xl:w-1/2 w-2/4 text-center">
                                            <label for="fieldPush" class="leading-7 text-sm text-gray-400">Update To Contract:
                                                <input type="number" id="fieldPush" name="fieldPush" class="w-full bg-gray-800 rounded-xl border bg-opacity-40 border-gray-700 focus:ring-2 focus:ring-indigo-900 focus:bg-transparent focus:border-indigo-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                            </label>
                                            <button type={"submit"} class="mt-3 inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded-2xl text-lg">Push to Chain</button>
                                        </div>
                                    </form>
                                </div>
                                <div class="flex w-full md:justify-start justify-center items-end mt-12">
                                    <div class="relative mr-4 lg:w-full xl:w-1/2 w-2/4 text-center">
                                        <button onClick={getCurrentVal} class="mt-4 inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded-2xl text-lg">Pop From Chain</button>
                                    </div>
                                </div>
                            </div>
                        ) : ''}
                    </div >
                </div >
            </section >
        </div >
    );
}

export default Nav;
