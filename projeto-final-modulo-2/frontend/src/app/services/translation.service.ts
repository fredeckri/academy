import { Injectable, signal, effect } from '@angular/core';


const messages = { 
  pt: { 
    home: 'Início', 
    cart: 'Carrinho', 
    addProduct: 'Adicionar Produto', 
    login: 'Entrar', 
    logout: 'Sair', 
    addToCart: 'Adicionar ao Carrinho', 
    edit: 'Editar', 
    remove: 'Remover', 
    email: 'E-mail', 
    password: 'Senha', 
    dontHaveAccount: 'Não tem uma conta?', 
    register: 'Cadastre-se', 
    loginError: 'E-mail ou senha inválidos.', 
    shoppingCart: 'Carrinho de Compras', 
    product: 'Produto', 
    quantity: 'Quantidade', 
    price: 'Preço', 
    total: 'Total', 
    emptyCart: 'Seu carrinho está vazio.', 
    checkout: 'Finalizar Compra', 
    productRegistration: 'Cadastro de Produto', 
    productEditing: 'Edição de Produto', 
    name: 'Nome', 
    description: 'Descrição', 
    stock: 'Estoque', 
    image: 'Imagem', 
    save: 'Salvar', 
    imagePreview: 'Pré-visualização da Imagem:', 
    confirmAction: 'Confirmar Ação', 
    areYouSureDelete: 'Você tem certeza que deseja remover este item?', 
    cancel: 'Cancelar', 
    confirm: 'Confirmar', 
    paymentGateway: 'Gateway de Pagamento', 
    paymentDetails: 'Detalhes do Pagamento', 
    cardNumber: 'Número do Cartão', 
    cardHolder: 'Nome no Cartão', 
    expiryDate: 'Data de Validade', 
    cvv: 'CVV', 
    payNow: 'Pagar Agora', 
    paymentSuccess: 'Pagamento realizado com sucesso!', 
    backToHome: 'Voltar para o Início',
    
    creditCard: 'Cartão de Crédito',
    pix: 'PIX',
    scanQRCode: 'Leia o QR Code abaixo',
    orCopyCode: 'Ou copie o código:',
    copyCode: 'Copiar Código',
    codeCopied: 'Copiado!',
    developedBy: 'Desenvolvido por',
    angularLink: 'Visitar site oficial do Angular',
    html5Link: 'Saber mais sobre HTML5',
    css3Link: 'Saber mais sobre CSS3',
    bootstrapLink: 'Visitar site oficial do Bootstrap',
  }, 
  en: { 
    home: 'Home', 
    cart: 'Cart', 
    addProduct: 'Add Product', 
    login: 'Login', 
    logout: 'Logout', 
    addToCart: 'Add to Cart', 
    edit: 'Edit', 
    remove: 'Remove', 
    email: 'Email', 
    password: 'Password', 
    dontHaveAccount: "Don't have an account?", 
    register: 'Register', 
    loginError: 'Invalid email or password.', 
    shoppingCart: 'Shopping Cart', 
    product: 'Product', 
    quantity: 'Quantity', 
    price: 'Price', 
    total: 'Total', 
    emptyCart: 'Your cart is empty.', 
    checkout: 'Checkout', 
    productRegistration: 'Product Registration', 
    productEditing: 'Product Editing', 
    name: 'Name', 
    description: 'Description', 
    stock: 'Stock', 
    image: 'Image', 
    save: 'Save', 
    imagePreview: 'Image Preview:', 
    confirmAction: 'Confirm Action', 
    areYouSureDelete: 'Are you sure you want to remove this item?', 
    cancel: 'Cancel', 
    confirm: 'Confirm', 
    paymentGateway: 'Payment Gateway', 
    paymentDetails: 'Payment Details', 
    cardNumber: 'Card Number', 
    cardHolder: 'Cardholder Name', 
    expiryDate: 'Expiry Date', 
    cvv: 'CVV', 
    payNow: 'Pay Now', 
    paymentSuccess: 'Payment successful!', 
    backToHome: 'Back to Home',
    
    creditCard: 'Credit Card',
    pix: 'PIX',
    scanQRCode: 'Scan the QR Code below',
    orCopyCode: 'Or copy the code:',
    copyCode: 'Copy Code',
    codeCopied: 'Copied!',
    developedBy: 'Developed by',
    angularLink: 'Visit official Angular website',
    html5Link: 'Learn more about HTML5',
    css3Link: 'Learn more about CSS3',
    bootstrapLink: 'Visit official Bootstrap website',
    
  } 
};


export type TranslationKey = keyof typeof messages['pt'];

@Injectable({ providedIn: 'root' })
export class TranslationService {
  locale = signal<'pt' | 'en'>(localStorage.getItem('angular-ecommerce-locale') as 'pt' | 'en' || 'pt');

  constructor() {
    effect(() => {
      localStorage.setItem('angular-ecommerce-locale', this.locale());
      document.documentElement.lang = this.locale();
    });
  }
  
  setLocale(locale: 'pt' | 'en') {
    this.locale.set(locale);
  }

  t(key: TranslationKey): string {
    const lang = this.locale();
    return messages[lang][key] || key;
  }
}

