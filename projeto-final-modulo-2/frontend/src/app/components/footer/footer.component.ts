import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService, TranslationKey } from '../../services/translation.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: `footer.component.html`,
  styleUrls: [`footer.component.css`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  i18n = inject(TranslationService);
  t = (key: TranslationKey) => this.i18n.t(key);
  currentYear = new Date().getFullYear();
}
