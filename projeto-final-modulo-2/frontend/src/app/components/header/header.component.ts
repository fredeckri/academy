import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: `header.component.html`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  auth = inject(AuthService);
  cart = inject(CartService);
  i18n = inject(TranslationService);
  router = inject(Router);
  
  currentLang = computed(() => this.i18n.locale() === 'pt' ? 'PT-BR' : 'EN-US');
  
  t = this.i18n.t.bind(this.i18n);
  setLocale = this.i18n.setLocale.bind(this.i18n);

  handleLogout() {
    this.auth.logout();
    this.cart.clearCart();
    this.router.navigate(['/login']);
  }
}
