import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { EvmService } from '../evm.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  isSlideOver = false;
  wallet: string | undefined;

  constructor(
    private evmService: EvmService,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    this.evmService.getSigner();
    this.evmService.account.subscribe(async (account) => {
      this.wallet = account;

      this.cdr.detectChanges();
      // console.log(this.wallet);
    });
  }
  
  toggleMenuOpen(){
    this.isMenuOpen = !this.isMenuOpen;
  }
  toggleSlideOver(){
    this.isSlideOver = !this.isSlideOver;
  }

  async connectWallet() {
    await this.evmService.getSigner();
  }
}
