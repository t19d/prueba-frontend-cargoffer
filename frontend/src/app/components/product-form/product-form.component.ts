import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent {
  @Input() product: Product | undefined;
  @Output() onSave = new EventEmitter<Product>();
  @Output() onCancel = new EventEmitter<void>();

  productForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private productService: ProductService,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, Validators.required],
      image: [''],
      category: [''],
      size: [''],
      color: [''],
      material: [''],
      brand: [''],
      stock: [0, Validators.required],
    });
  }

  ngOnInit(): void {
    this.setInitialValues();
  }

  private setInitialValues() {
    if (this.product) {
      this.productForm.setValue({
        name: this.product.name || '',
        description: this.product.description || '',
        price: this.product.price || 0,
        image: this.product.image || '',
        category: this.product.category || '',
        size: this.product.size || '',
        color: this.product.color || '',
        material: this.product.material || '',
        brand: this.product.brand || '',
        stock: this.product.stock || 0,
      });
    }
  }

  saveChanges() {
    if (this.productForm.invalid) {
      this.errorMessage = 'Please fill out all required fields.';
      return;
    }

    const updatedProduct = { ...this.product, ...this.productForm.value };
    this.onSave.emit(updatedProduct);
  }

  disableEditMode() {
    this.onCancel.emit();
  }

  deleteProduct(): void {
    if (!this.product) return;

    this.productService.deleteProduct(this.product._id ?? '')?.subscribe(
      () => {
        console.log('Product deleted');
        this.router.navigate(['/products']);
      }
    );
  }
}
