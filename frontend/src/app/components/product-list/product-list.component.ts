import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  searchTerm: string = '';

  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    if (this.searchTerm) {
      this.productService.searchProducts(this.searchTerm).subscribe((data: Product[]) => {
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
