import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: 'register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  router = inject(Router);
  api = inject(ApiService);
  i18n = inject(TranslationService);
  
  form = { name: '', email: '', password: '' };
  error = signal('');
  t = this.i18n.t.bind(this.i18n);

  async handleRegister() {
    this.error.set('');
    try {
      const res = await this.api.register(this.form);
      if (res.success) {
        alert('Usuário cadastrado com sucesso! Por favor, faça o login.');
        this.router.navigate(['/login']);
      }
    } catch (e: any) {
      this.error.set(e.message);
    }
  }
}
