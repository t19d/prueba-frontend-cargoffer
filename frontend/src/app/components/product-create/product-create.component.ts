import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss']
})
export class ProductCreateComponent {
  productForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      image: [''],
      category: [''],
      size: [''],
      color: [''],
      material: [''],
      brand: [''],
      stock: ['']
    });
  }

  onSubmit(): void {
    const productData = this.productForm.value;
    this.productService.createProduct(productData)?.subscribe((product) => {
      console.log(`Product created: ${product}`);
      this.router.navigate(['/products']);
    });
  }
}
