import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: 'cart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartComponent {
  cart = inject(CartService);
  i18n = inject(TranslationService);
  t = this.i18n.t.bind(this.i18n);

  formatCurrency(value: number): string {
    return new Intl.NumberFormat(this.i18n.locale(), { style: 'currency', currency: this.i18n.locale() === 'pt' ? 'BRL' : 'USD' }).format(value);
  }
}
