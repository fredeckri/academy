import { Component, ChangeDetectionStrategy, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { TranslationService } from '../../services/translation.service';
import { GlobalStateService } from '../../services/global-state.service';

const BASE_URL = 'http://localhost:3000';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: 'catalog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogComponent implements OnInit {
  products = signal<Product[]>([]);
  api = inject(ApiService);
  auth = inject(AuthService);
  cart = inject(CartService);
  i18n = inject(TranslationService);
  globalState = inject(GlobalStateService);

  t = this.i18n.t.bind(this.i18n);

  ngOnInit() {
    this.loadProducts();
  }

  async loadProducts() {
    try {
      const prods = await this.api.getProducts();
      this.products.set(prods.map(p => (p.image && p.image.startsWith('/uploads/') ? { ...p, image: `${BASE_URL}${p.image}` } : p)));
    } catch (error) {
      console.error('Falha ao carregar produtos', error);
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat(this.i18n.locale(), { style: 'currency', currency: this.i18n.locale() === 'pt' ? 'BRL' : 'USD' }).format(value);
  }

  addToCart(product: Product) {
    this.cart.addToCart(product);
  }

  confirmDelete(product: Product) {
    this.globalState.showModal({ 
      title: this.t('confirmAction'), 
      body: this.t('areYouSureDelete'), 
      confirm: async () => { 
        await this.api.deleteProduct(product.id); 
        this.loadProducts(); 
      } 
    });
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'https://placehold.co/600x400/cccccc/ffffff?text=Image+Error';
  }
}
