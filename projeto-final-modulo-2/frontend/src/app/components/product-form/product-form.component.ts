import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { TranslationService } from '../../services/translation.service';
import { Product } from '../../models/product.model';

const BASE_URL = 'http://localhost:3000';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFormComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  api = inject(ApiService);
  i18n = inject(TranslationService);

  product: Partial<Product> = { name: '', description: '', price: 0, stock: 0 };
  imageFile: File | null = null;
  imagePreview = signal<string | null>(null);
  isEditMode = signal(false);

  t = this.i18n.t.bind(this.i18n);

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.isEditMode.set(true);
      this.loadProduct(productId);
    }
  }

  async loadProduct(id: string) {
    try {
      const p = await this.api.getProduct(id);
      this.product = p;
      if (p.image) {
        const imageUrl = p.image.startsWith('http') ? p.image : `${BASE_URL}${p.image}`;
        this.imagePreview.set(imageUrl);
      }
    } catch {
      this.router.navigate(['/']);
    }
  }

  handleImageUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = (e) => this.imagePreview.set(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }

  async handleSubmit() {
    const formData = new FormData();
    Object.keys(this.product).forEach(keyStr => {
      const key = keyStr as keyof Product;
      if (key !== 'id' && key !== 'image' && this.product[key] != null) {
          formData.append(key, String(this.product[key]));
      }
    });

    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }
    
    try {
      if (this.isEditMode() && this.product.id) {
        await this.api.updateProduct(this.product.id, formData);
      } else {
        await this.api.addProduct(formData);
      }
      this.router.navigate(['/']);
    } catch (error) {
      console.error("Falha ao salvar produto", error);
      alert("Falha ao salvar produto. Verifique o console para mais detalhes.");
    }
  }
}

