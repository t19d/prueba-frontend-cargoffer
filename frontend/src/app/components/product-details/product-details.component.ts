import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  product: Product | undefined;
  editMode: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {
    this.getProduct();
  }

  ngOnInit(): void {
  }

  getProduct(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.productService.getProductById(id)?.subscribe(product => {
      this.product = product;
    });
  }

  enableEditMode(): void {
    this.editMode = true;
  }

  disableEditMode(): void {
    this.editMode = false;
  }

  saveChanges(product: Product): void {
    this.productService.updateProduct(product._id || '', product)?.subscribe((product: Product) => {
      this.product = product;
      this.disableEditMode();
    });
  }

}
