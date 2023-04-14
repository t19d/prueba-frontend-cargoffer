import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss']
})
export class ProductCreateComponent {

  constructor(
    private productService: ProductService,
    private router: Router
  ) {
  }

  saveChanges(product: Product): void {
    this.productService.createProduct(product)?.subscribe(() => {
      this.redirectToProducts();
    });
  }

  cancelChanges() {
    this.redirectToProducts();
  }

  redirectToProducts(): void {
    this.router.navigate(['/products']);
  }
}
