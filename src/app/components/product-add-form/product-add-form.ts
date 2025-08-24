import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // add ReactiveFomsModule
  templateUrl: './product-add-form.html',
  styleUrl: './product-add-form.css'
})
export class ProductAddFormComponent {
  // @Output cria um evento que o componente pai pode ouvir
  @Output() productAdded = new EventEmitter<Omit<Product, 'id'>>();
  
  productForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      imageUrl: ['#'],
      available: [true]
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      // Emite o evento com os dados do formulário
      this.productAdded.emit(this.productForm.value);
      this.productForm.reset({ available: true }); // Limpa o formulário após o envio
    }
  }
}
