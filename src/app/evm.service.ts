import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { BehaviorSubject } from 'rxjs';

declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class EvmService {
  contractbank: string = "0x34ce335A3364B22261282408Ba217843928d8C3f";
  contractbankABI: any = [
    "function simpan (  ) external payable",
    "function simpanan ( address ) external view returns ( uint256 )",
    "function tarik ( uint256 wd ) external",
  ]

  provider: any | undefined;
  account: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor() {
    this.provider = this.getProvider();
    this.getSigner();

    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      if (accounts[0] === undefined) {
        this.account.next('');
      } else {
        this.account.next(accounts[0]);
      }
    });
    window.ethereum.on('disconnect', () => {
      this.account.next('');
    });
    window.ethereum.on('chainChanged', async () => {
      this.account.next('');
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x13881' }],
      });
    });
  }

  async getProvider() {
    return new ethers.providers.Web3Provider(window.ethereum);
  }
  
  async getSigner() {
    const wallet = await window.ethereum.request({ method: 'eth_requestAccounts' });
    this.account.next(wallet[0]);
  }

  async setContract(provider: any) {
    // const signer = await provider.getSigner();

    // console.log(signer, "signer")

    return new ethers.Contract(this.contractbank, this.contractbankABI, provider);
  }

  async readContract(contract: any, method: string, ...params: any) {
    return await contract[method](...params);
  }

  async writeContract(from: string, contract: any, method: string, value: any, ...params: any) {
    const populate = await contract.populateTransaction[method](...params, { value: value });
    const tx = await contract.provider.getSigner(from).sendTransaction(populate);
    const waiting = await tx.wait();

    return waiting;
  }

  // async deposit(contract: any, value: any) {
  //   await contract.deposit({ value: value }); 
  // }

  async getAccountBalance(provider: any, account: string) {
    const address = ethers.utils.getAddress(account);
    
    return await provider.getBalance(address);
  }

  formatether(balance: any) {
    return parseFloat(ethers.utils.formatEther(balance));
  }

  parseether(input: any) {
    return ethers.utils.parseEther(input);
  }
}