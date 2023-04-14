import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product: Product | undefined;

  constructor(private router: Router, private sanitizer: DomSanitizer) { }

  goToProductDetails(productId: string | null | undefined) {
    if (!productId) return;
    const sanitizedProductId = this.sanitizer.sanitize(4, productId.trim());
    this.router.navigate(['/products', sanitizedProductId]);
  }
}
