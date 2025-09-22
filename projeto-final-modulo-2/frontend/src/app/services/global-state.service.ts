import { Injectable, signal, inject } from '@angular/core';
import { TranslationService } from './translation.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalStateService {
  isLoading = signal<boolean>(false);
  translationService = inject(TranslationService);
  
  showModal: (data: { title: string; body: string; confirm: () => void; }) => void = () => {
    console.error('Teste Global');
  };
}
