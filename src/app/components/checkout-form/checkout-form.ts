import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProductService } from '../../services/product_http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-checkout-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './checkout-form.html',
  styleUrl: './checkout-form.css',
})
export class CheckoutFormComponent implements OnInit, OnDestroy {
  checkoutForm!: FormGroup;
  submitted = false;
  carrinhoEstaVazio = true; // verdadeiro por padrão

  private unsubscribe$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Inscreve-se no observable do carrinho para saber seu estado
    this.productService.carrinho$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(itens => {
        this.carrinhoEstaVazio = itens.length === 0;
         this.cdr.markForCheck(); //usado para controlar atualização de componentes
      });
    
    this.checkoutForm = this.formBuilder.group({
      nomeCompleto: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      endereco: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  get nomeCompleto() { return this.checkoutForm.get('nomeCompleto'); }
  get email() { return this.checkoutForm.get('email'); }
  get endereco() { return this.checkoutForm.get('endereco'); }

  onSubmit(): void {
    this.submitted = true;

    if (this.checkoutForm.invalid || this.carrinhoEstaVazio) {
      console.log('Ação bloqueada: Formulário inválido ou carrinho vazio.');
      return;
    }

    console.log('Formulário válido! Enviando dados...');
    console.log(this.checkoutForm.value);
    
     Swal.fire({
          title: 'Pedido finalizado!',
          text: `Compra finalizada com sucesso!`,
          icon: 'info',
          showConfirmButton: false, 
          timer: 3000, 
          timerProgressBar: true, 
        }).then(() => { //redirecionamento adicionado 24-08
      // Este código será executado DEPOIS que o alerta de 3 segundos fechar
      this.productService.esvaziarCarrinho();
      this.router.navigate(['/products']); // Redireciona para a página de produtos
    });


       
    
    this.productService.esvaziarCarrinho();
    this.checkoutForm.reset();
    this.submitted = false;
  }
}
