import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-list-api',
  standalone: true,
  imports: [CommonModule, FormsModule,  FontAwesomeModule, RouterLink],
  template: `
    <div class="container-fluid py-5">
      <div class="row">
        
        <main class="col-12 col-lg-9">
          <div class="text-center mb-4">
            <h1 class="display-5 fw-bolder">Produtos da API (Exemplo)</h1>
            <p class="lead fw-normal text-muted-50 mb-0">
              Produtos carregados diretamente de uma API.
            </p>
          </div>

        
          <div class="mb-4">
            <input
              type="text"
              class="form-control"
              placeholder="Buscar produtos..."
              [(ngModel)]="filtroProdutos"
            />
          </div>

        
          <div class="product-list-container">
            <div class="d-flex flex-nowrap overflow-auto py-3">
              @for (product of filteredProducts(); track product.id) {
              <div class="col-sm-6 m-2 col-md-4 col-lg-3 flex-shrink-0">
                <div class="card  product-card">
                  <!-- Badge de Promoção -->
                  @if (product.onSale) {
                  <div
                    class="badge bg-danger text-white position-absolute"
                    style="top: 0.5rem; left: 0.5rem; z-index: 1"
                  >
                    Promoção
                  </div>
                  } @if (!product.available) {
                  <div
                    class="badge bg-dark text-white position-absolute"
                    style="top: 0.5rem; right: 0.5rem; z-index: 1"
                  >
                    Indisponível
                  </div>
                  }
                  <img
                    class="card-img-top"
                    [src]="product.imageUrl"
                    [alt]="product.name"
                  />
                  <div class="card-body p-4">
                    <div class="text-center">
                      <h5 class="fw-bolder">{{ product.name }}</h5>
                      <!-- Preço com promoção -->
                      @if (product.onSale) {
                      <span class="text-muted text-decoration-line-through"
                        >R$ {{ product.price.toFixed(2) }}</span
                      >
                      R$ {{ getDescontoProduto(product.price) | number : "1.2-2" }} } @else { R$
                      {{ product.price.toFixed(2) }}
                      }
                    </div>
                  </div>
                  <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                    <div class="text-center">
                      <a
                        class="btn btn-outline-dark mt-auto"
                        [routerLink]="['/product', product.id]"
                        >Ver Detalhes</a
                      >
                    </div>
                  </div>
                </div>
                <div class="w-100 d-flex justify-content-between align-items-center mt-2">
                 
                </div>
              </div>
              } @empty {
                <div class="w-100 text-center py-5">
                  <p class="lead text-muted">Nenhum produto encontrado.</p>
                </div>
              }
            </div>
          </div>
        </main>
      </div>
    </div>
  `,
  
})
export class ProductListApiComponent implements OnInit {

  products = signal<Product[]>([]);
  filtroProdutos: string = '';
  private apiUrl = 'https://fakestoreapi.com/products';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<any[]>(this.apiUrl).subscribe(data => {
      const mappedProducts: Product[] = data.map(product => ({
        id: product.id,
        name: product.title,
        description: product.description,
        price: product.price,
        available: true,
        imageUrl: product.image,
        onSale: product.id % 3 === 0
      }));
      this.products.set(mappedProducts);
    });
  }

  getDescontoProduto(price: number): number {
    const desconto = 5;
    const discount = desconto / 100;
    return price * (1 - discount);
  }

  filteredProducts() {
    if (!this.filtroProdutos) {
      return this.products();
    }
    const texto = this.filtroProdutos.toLowerCase();
    return this.products().filter(product =>
      product.name.toLowerCase().includes(texto) ||
      product.description.toLowerCase().includes(texto)
    );
  }
}
