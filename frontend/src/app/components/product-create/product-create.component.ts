import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import { DomSanitizer } from '@angular/platform-browser';
import { sanitizeProduct } from 'src/app/utils/utils';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss']
})
export class ProductCreateComponent {

  constructor(
    private productService: ProductService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }

  saveChanges(product: Product): void {
    const sanitizedProduct = sanitizeProduct(this.sanitizer, product);

    if (
      !sanitizedProduct.name.trim() ||
      !sanitizedProduct.description.trim() ||
      sanitizedProduct.stock < 0 ||
      sanitizedProduct.price < 0
    ) {
      return;
    }

    this.productService.createProduct(sanitizedProduct)?.subscribe(() => {
      this.redirectToProducts();
    });
  }

  cancelChanges(): void {
    this.redirectToProducts();
  }

  redirectToProducts(): void {
    this.router.navigate(['/products']);
  }
}
