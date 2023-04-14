import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product: Product | undefined;

  constructor(private router: Router) { }

  goToProductDetails(productId: string | null | undefined) {
    if (!productId) return;
    this.router.navigate(['/products', productId]);
  }
}
