import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import { sanitizeInput } from 'src/app/utils/utils';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  searchTerm: string = '';

  constructor(private productService: ProductService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    const sanitizedSearchTerm = sanitizeInput(this.sanitizer, this.searchTerm);
    if (sanitizedSearchTerm) {
      this.productService.searchProducts(sanitizedSearchTerm).subscribe((data: Product[]) => {
        this.products = data;
      });
    } else {
      this.productService.getProducts().subscribe((data: Product[]) => {
        this.products = data;
      });
    }
  }

  searchProducts(): void {
    this.getProducts();
  }
}
