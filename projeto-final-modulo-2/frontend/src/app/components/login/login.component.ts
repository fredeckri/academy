import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: `login.component.html`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  auth = inject(AuthService);
  router = inject(Router);
  i18n = inject(TranslationService);
  
  email = ''; 
  password = ''; 
  error = signal('');
  t = this.i18n.t.bind(this.i18n);

  async handleLogin() {
    this.error.set('');
    try {
      const res = await this.auth.login(this.email, this.password);
      if (res.success) {
        this.router.navigate(['/']);
      } else {
        this.error.set(this.t('loginError'));
      }
    } catch (e) {
      this.error.set(this.t('loginError'));
    }
  }
}
