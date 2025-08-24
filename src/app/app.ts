import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { icons } from './icons';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('meu-projeto-novo');
    constructor(library: FaIconLibrary) {
    
    library.addIcons(
      icons.faShoppingCart,
      icons.faPlus,
      icons.faTrashAlt
    );
  }
}
