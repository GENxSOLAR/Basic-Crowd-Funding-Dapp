import { ethers } from "./ethers-5.7.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const withdrawButton = document.getElementById("withdrawButton");
const getBalanceButton = document.getElementById("getBalanceButton");
connectButton.onclick = connect;
fundButton.onclick = fund;
withdrawButton.onclick = withdraw;
getBalanceButton.onclick = getBalance;

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.log(error);
    }
    connectButton.innerHTML = "Connected to MetaMask!";
    alert("Connected to MetaMask!");
    const accounts = await ethereum.request({ method: "eth_accounts" });
    console.log(accounts);
  } else {
    connectButton.innerHTML = "Please install MetaMask!";
    alert("Please install MetaMask!");
  }
}

async function fund() {
  const ethAmount = document.getElementById("ethAmount").value;
  console.log(`Funding with ${ethAmount}...`);
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    console.log(signer);
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
      await listenForTransactionMine(transactionResponse, provider);
      console.log("Done!");
      alert("Transaction Successful :)");
    } catch (error) {
      console.log(error);
      alert("Transaction Failed :(");
    }
  } else {
    fundButton.innerHTML = "Please install MetaMask!";
    alert("Please install MetaMask!");
  }
}

async function withdraw() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.withdraw();
      await listenForTransactionMine(transactionResponse, provider);
      alert(`Withdraw was successful`);
    } catch (error) {
      console.log(error);
      alert("Withdraw failed :(");
    }
  } else {
    fundButton.innerHTML = "Please install MetaMask!";
    alert("Please install MetaMask!");
  }
}

async function getBalance() {
  if (window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    try {
      const Balance = await provider.getBalance(contractAddress);
      const balance = ethers.utils.formatEther(Balance);
      console.log(`Contract balance is ${balance}`);
      alert(`Contract balance is ${balance}`);
    } catch (error) {
      console.log(error);
      alert("Failed to get Contract balance :(");
    }
  } else {
    fundButton.innerHTML = "Please install MetaMask!";
    alert("Please install MetaMask!");
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}...`);
  return new Promise((resolve, reject) => {
    try {
      provider.once(transactionResponse.hash, (transactionRecipt) => {
        console.log(
          `Completed with ${transactionRecipt.confirmations} confirmations.`
        );
        resolve();
      });
    } catch (error) {
      reject(error);
      alert("Transaction Failed :(");
    }
  });
  // listen for this transation to finish
}
