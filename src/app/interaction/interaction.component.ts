import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EvmService } from '../evm.service';
import { FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-interaction',
  templateUrl: './interaction.component.html',
  styleUrls: ['./interaction.component.scss']
})
export class InteractionComponent implements OnInit {
  depositForms: FormGroup = new FormGroup({
    depositForm: new FormControl(''),
  });

  withdrawForms: FormGroup = new FormGroup({
    withdrawForm: new FormControl(''),
  });


  providerWeb3: any | undefined;
  contract: any | undefined;
  wallet: string | undefined;
  saldo: number = 0;
  saldobank: number = 0;

  constructor(
    private evmService: EvmService,
    private cdr: ChangeDetectorRef
  ) { }
  
  async ngOnInit() {
    this.providerWeb3 = await this.evmService.getProvider();
    this.contract = await this.evmService.setContract(this.providerWeb3);

    // console.log(this.contract, "contract")

    this.evmService.getSigner();
    this.evmService.account.subscribe(async (account) => {
      this.wallet = account;

      if (this.wallet !== '') {
        await this.getBalance(this.providerWeb3, this.wallet!);
        await this.getBankBalance(this.contract, this.wallet!);
      }

      this.cdr.detectChanges();
      // console.log(this.wallet);
    });
  }

  async getBalance(provider: any, account: string) {
    const getBalance = await this.evmService.getAccountBalance(provider, account);
    const humanBalance = this.evmService.formatether(getBalance);
  
    this.saldo = humanBalance;
  }

  async getBankBalance(contract: any, account: string) {
    const balancebank = await this.evmService.readContract(contract, 'simpanan', account);
    const humanBalancebank = this.evmService.formatether(balancebank);

    this.saldobank = humanBalancebank;
  }

  async deposit() {
    const data = this.depositForms.value.depositForm;
    // console.log(data)
    const value = this.evmService.parseether(data);
    // console.log(value)
    
    const result = await this.evmService.writeContract(this.wallet!, this.contract, 'simpan', value);
    console.log(result)

    if (result) {
      await this.getBalance(this.providerWeb3, this.wallet!);
      await this.getBankBalance(this.contract, this.wallet!);
    }
  }

  async tarik() {
    const data = this.withdrawForms.value.withdrawForm;
    // console.log(data)
    const value = this.evmService.parseether(data);
    // console.log(value)
    
    const result = await this.evmService.writeContract(this.wallet!, this.contract, 'tarik', 0, value);
    console.log(result)

    if (result) {
      await this.getBalance(this.providerWeb3, this.wallet!);
      await this.getBankBalance(this.contract, this.wallet!);
    }
  }
}
