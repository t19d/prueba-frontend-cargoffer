import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
})
export class ProductFormComponent {
  @Input() product: Product | undefined;
  @Output() onSave = new EventEmitter<Product>();
  @Output() onCancel = new EventEmitter<void>();

  productForm: FormGroup;

  constructor(private fb: FormBuilder) {
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
    const updatedProduct = { ...this.product, ...this.productForm.value };
    this.onSave.emit(updatedProduct);
  }

  disableEditMode() {
    this.onCancel.emit();
  }
}
