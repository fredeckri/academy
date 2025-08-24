import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Input,ChangeDetectorRef 
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Product } from '../../models/product.model';

import { ProductService } from '../../services/product_http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],

  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetailComponent implements OnInit, OnChanges {
  @Input() product: Product | undefined;
  discountPercentage: number = 15;
  isLoading = true;
  ProductNot:String = "Produto não encontrado.";
  textoLoading: String = "Carregando detalhes do produto...";
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.isLoading = true;
      this.productService.getProductById(id).subscribe((data) => {
        this.product = data;
        this.cdr.markForCheck(); // atualizar tela
        this.isLoading = false;
      });
    } else {
      this.isLoading = false; 
    }
    
  }
  adicionarAoCarrinho(produto: Product): void {
    console.log('Adicionando ao carrinho:', produto);
    this.productService.adicionarAoCarrinho(produto);
    alert(`${produto.name} foi adicionado ao carrinho!`);
  }

  getDescontoProduto(price: number): number {
    return this.productService.getDesconto(price);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product']) {
      console.log('O produto foi alterado:', this.product);
    }
  }
}
