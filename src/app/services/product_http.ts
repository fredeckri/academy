import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { CartItem } from '../models/cart.model';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  //private apiUrl = 'https://fakestoreapi.com/products'; // antes no projeto inicial
  
   private apiUrl = 'https://dummyjson.com/products';
  private carrinho: Product[] = [];
  private carrinhoSubject = new BehaviorSubject<CartItem[]>([]);
  
  carrinho$ = this.carrinhoSubject.asObservable();

  constructor(private http: HttpClient) {  }

  getProducts(): Observable<Product[]> {
    // Faz a requisição HTTP GET para a API
    //return this.http.get<any[]>(this.apiUrl).pipe( //fakestoreapi
    return this.http.get<{ products: any[] }>(this.apiUrl).pipe(
      // Mapeia a resposta da API para o seu modelo Product
      
      //map(products => products.map(product => ({//fakestoreapi
       map(response => response.products.map(product => ({
        id: product.id,
        name: product.title,
        description: product.description,
        price: product.price,
        available: true, // default
        imageUrl: product.images[0],
        //imageUrl: product.image,//fakestoreapi
        //onSale: product.id % 3 === 0 //produtos impares em promocao
      })))
    );
  }

  getCarrinho(): Observable<Product[]> {
    return of(this.carrinho);
  }
  setCarrinho(newCarrinho: Product[]): void {
    this.carrinho = newCarrinho;
  }

  getProductById(id: number): Observable<Product | undefined> {
    // Faz uma requisição para um produto específico da API
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(product => ({
        id: product.id,
        name: product.title,
        description: product.description,
        price: product.price,
        available: true,
        imageUrl: product.images[0  ],     //imageUrl: product.image,//fakestoreapi
        onSale: product.id % 3 === 0
      }))
    );
  }

  addProduct(productData: Omit<Product, 'id'>): void {
    
    const newId = this.carrinho.length > 0 ? Math.max(...this.carrinho.map(p => p.id)) + 1 : 1;
    const newProduct: Product = {
      id: newId,
      ...productData
    };
    this.carrinho.push(newProduct);
  }
  adicionarAoCarrinho(produto: Product): void {
    const carrinhoAtual = this.carrinhoSubject.getValue();
    const itemExistente = carrinhoAtual.find(item => item.product.id === produto.id);

    if (itemExistente) {
      // Se o item já existe, apenas incrementa a quantidade
      itemExistente.quantidade++;
    } else {
      // Se não existe, adiciona o novo item
      carrinhoAtual.push({ product: produto, quantidade: 1 });
    }
    
    // Emite o novo estado do carrinho para todos os inscritos
    this.carrinhoSubject.next([...carrinhoAtual]);
  }
  // adicionarAoCarrinho(produto: Product): void {
  //   const carrinhoAtual = this.getCarrinhoAtual();
  //   const novoCarrinho = [...carrinhoAtual, produto];
  //   this.carrinhoSubject.next(novoCarrinho);
  //   console.log('Produto adicionado, novo estado do carrinho:', novoCarrinho);
  // }
  // removerDoCarrinho(productId: number): void {
  //   const index = this.carrinho.findIndex(p => p.id === productId);

  //   if (index !== -1) {
  //     this.carrinho.splice(index, 1);
  //   }
  // }
  removerDoCarrinho(productId: number): void {
    const carrinhoAtual = this.carrinhoSubject.getValue();
    const itemExistente = carrinhoAtual.find(item => item.product.id === productId);

    if (itemExistente) {
      if (itemExistente.quantidade > 1) {
        // Se a quantidade for maior que 1, apenas decrementa
        itemExistente.quantidade--;
        this.carrinhoSubject.next([...carrinhoAtual]);
      } else {
        // Se a quantidade for 1, remove o item completamente do array
        const novoCarrinho = carrinhoAtual.filter(item => item.product.id !== productId);
        this.carrinhoSubject.next(novoCarrinho);
      }
    }
  }

  esvaziarCarrinho(): void {
    this.carrinhoSubject.next([]); // Emite um array vazio, limpando o carrinho
    console.log('Carrinho esvaziado!');
  }
  getDesconto(price: number, desconto: number = 5): number {
    const discount = desconto / 100;
    return price * (1 - discount);
  }
}
