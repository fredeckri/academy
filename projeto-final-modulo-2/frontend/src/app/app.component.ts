import {
  Component,
  ChangeDetectionStrategy,
  signal,
  ViewChild,
  ElementRef,
  AfterViewInit,
  inject,
  HostListener, // Importar HostListener
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { GlobalStateService } from './services/global-state.service';
import {
  TranslationService,
  TranslationKey,
} from './services/translation.service';

declare var bootstrap: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements AfterViewInit {
  i18n = inject(TranslationService);

  t = (key: TranslationKey) => this.i18n.t(key);
  currentYear = new Date().getFullYear();

  // Signal para o botão de voltar ao topo
  showScrollButton = signal(false);

  modalData = signal({
    title: '',
    body: '',
    onConfirm: () => {},
  });

  @ViewChild('confirmationModal') modalElement!: ElementRef;
  private bsModal: any;

  constructor(public globalState: GlobalStateService) {
    this.globalState.showModal = this.showModal.bind(this);
  }

  // Listener para o evento de scroll da janela
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const offset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.showScrollButton.set(offset > 300); // Mostra o botão após 300px de scroll
  }

  ngAfterViewInit() {
    if (this.modalElement) {
      this.bsModal = new bootstrap.Modal(this.modalElement.nativeElement);
    }
  }

  showModal(data: { title: string; body: string; confirm: () => void }) {
    this.modalData.set({
      title: data.title,
      body: data.body,
      onConfirm: data.confirm,
    });
    if (this.bsModal) {
      this.bsModal.show();
    }
  }

  confirmModal() {
    this.modalData().onConfirm();
    if (this.bsModal) {
      this.bsModal.hide();
    }
  }

  closeModal() {
    if (this.bsModal) {
      this.bsModal.hide();
    }
  }

  // Método para rolar a página para o topo
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

