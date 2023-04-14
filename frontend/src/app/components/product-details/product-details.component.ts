import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/models/product';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { getSafeImage, sanitizeProduct } from 'src/app/utils/utils';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  product: Product | undefined;
  editMode: boolean = false;
  isUserLoggedIn: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private authService: AuthService,
    private sanitizer: DomSanitizer
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

    this.authService.isLoggedIn().subscribe((isLoggedIn) => {
      this.isUserLoggedIn = isLoggedIn;
    });
  }

  getImage(): SafeUrl {
    return getSafeImage(this.sanitizer, this.product?.image ?? '');
  }

  enableEditMode(): void {
    this.editMode = true;
  }

  disableEditMode(): void {
    this.editMode = false;
  }

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

    this.productService.updateProduct(sanitizedProduct._id || '', sanitizedProduct)?.subscribe((product: Product) => {
      this.product = product;
      this.disableEditMode();
    });
  }
}
