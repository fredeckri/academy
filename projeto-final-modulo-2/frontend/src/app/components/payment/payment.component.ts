import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslationService, TranslationKey } from '../../services/translation.service';
import { CartService } from '../../services/cart.service';
import { GlobalStateService } from '../../services/global-state.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: `./payment.component.html`,
  styleUrls: ['./payment.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentComponent {
  paymentSuccess = signal(false);
  paymentMethod = signal<'card' | 'pix'>('card');
  pixQRCode = signal('');
  pixCode = signal('');
  showCopiedMessage = signal(false);
  cardNumber = signal('');

  i18n = inject(TranslationService);
  cart = inject(CartService);
  globalState = inject(GlobalStateService);
  t = (key: TranslationKey) => this.i18n.t(key);

  selectPaymentMethod(method: 'card' | 'pix') {
    this.paymentMethod.set(method);
    if (method === 'pix' && !this.pixCode()) {
      this.generatePix();
    }
  }

  generatePix() {
    // Gerar um código PIX fake
    const fakePixCode = '00020126330014br.gov.bcb.pix0111' + Math.random().toString(36).substring(2, 15) + '5204000053039865802BR5913' + Math.random().toString(36).substring(2, 15).toUpperCase() + '6009BRASILIADF62070503***6304E4A7';
    this.pixCode.set(fakePixCode);
    this.pixQRCode.set(`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(fakePixCode)}`);
  }
  
  formatCardNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Remove tudo que não é dígito
    value = value.replace(/(\d{4})(?=\d)/g, '$1 '); // Adiciona espaço a cada 4 dígitos
    this.cardNumber.set(value.slice(0, 19)); // Limita a 16 dígitos + 3 espaços
    input.value = this.cardNumber();
  }

  copyPixCode(): void {
    navigator.clipboard.writeText(this.pixCode()).then(() => {
      this.showCopiedMessage.set(true);
      setTimeout(() => this.showCopiedMessage.set(false), 2000);
    });
  }

  processPayment() {
    this.globalState.isLoading.set(true);
    setTimeout(() => {
      this.paymentSuccess.set(true);
      this.cart.clearCart();
      this.globalState.isLoading.set(false);
    }, 1500);
  }
}

