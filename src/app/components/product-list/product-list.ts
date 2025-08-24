import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Product } from '../../models/product.model';
import { CartItem } from '../../models/cart.model';
import { ProductService } from '../../services/product_http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Importe o FormsModule
import { ProductAddFormComponent } from '../product-add-form/product-add-form';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductAddFormComponent, FontAwesomeModule, FormsModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  carrinho: CartItem[] = [];
  filtroProdutos: string = '';
  percentualDesconto: number = 5;
  private unsubscribe$ = new Subject<void>(); // Controle de estado do carrinho recurso adicionado pois no get não estava funcionando para resgatar o produto/carrinho
  constructor(private productService: ProductService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadProducts();
    console.log('iniciou o produto');
    this.loadCarrinho();

    this.productService.carrinho$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((itensDoCarrinho) => {
        this.carrinho = itensDoCarrinho;
      });
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
      this.cdr.markForCheck(); // atualizar tela
    });
  }

  loadCarrinho(): void {
    this.productService.getCarrinho().subscribe((data) => {
      this.carrinho = data.map((product) => ({ product, quantidade: 1 }));
      this.cdr.markForCheck(); // atualizar carrinho
    });
  }

  onProductAdded(newProductData: Omit<Product, 'id'>): void {
    this.productService.addProduct(newProductData);
    this.loadProducts();
  }

  getDescontoProduto(price: number): number {
    return this.productService.getDesconto(price);
  }

  // adicionarAoCarrinho(produto: Product): void {
  //   const itemExistente = this.carrinho.find(item => item.product.id === produto.id);

  //   if (itemExistente) {
  //     itemExistente.quantidade++;
  //   } else {
  //     this.carrinho.push({ product: produto, quantidade: 1 });
  //   }
  //   this.updateServiceCarrinho();
  // }

  adicionarAoCarrinho(produto: Product): void {
    this.productService.adicionarAoCarrinho(produto);
    this.cdr.markForCheck(); // atualizar carrinho
    Swal.fire({
      title: 'Adicionado!',
      text: `${produto.name} foi adicionado ao carrinho.`,
      icon: 'success',
      toast: true, // Mostra um alerta mais discreto no canto
      position: 'top-end', // Posição do alerta
      showConfirmButton: false, // Esconde o botão de confirmação
      timer: 3000, // Fecha automaticamente após 3 segundos
      timerProgressBar: true, // Mostra uma barra de progresso
    });
  }
  removerDoCarrinho(produtoId: number): void {
    this.productService.removerDoCarrinho(produtoId);
  }
  // removerDoCarrinho(produtoId: number): void {
  //   const itemExistente = this.carrinho.find(item => item.product.id === produtoId);

  //   if (itemExistente) {
  //     if (itemExistente.quantidade > 0) {
  //       itemExistente.quantidade--;
  //     } else {
  //       // Remove o item do array se a quantidade for > q 0
  //       this.carrinho = this.carrinho.filter(item => item.product.id !== produtoId);
  //     }
  //   }
  //   this.updateServiceCarrinho();
  // }

  getTotalCarrinho(): number {
    return this.carrinho.reduce((total, item) => total + item.product.price * item.quantidade, 0);
  }

  updateServiceCarrinho(): void {
    this.productService.setCarrinho(this.carrinho.map((item) => item.product));
  }

  get filteredProducts(): Product[] {
    if (!this.filtroProdutos) {
      return this.products;
    }
    const texto = this.filtroProdutos.toLowerCase();
    return this.products.filter(
      (product) =>
        product.name.toLowerCase().includes(texto) ||
        product.description.toLowerCase().includes(texto)
    );
  }
}
