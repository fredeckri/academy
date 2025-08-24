import { ComponentFixture, TestBed } from '@angular/core/testing';


import { ProductAddFormComponent } from './product-add-form';


describe('ProductAddFormComponent', () => {
  
  let component: ProductAddFormComponent;
  let fixture: ComponentFixture<ProductAddFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      
      imports: [ProductAddFormComponent]
    })
    .compileComponents();

    
    fixture = TestBed.createComponent(ProductAddFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});