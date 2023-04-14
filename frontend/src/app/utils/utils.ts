import { DomSanitizer } from '@angular/platform-browser';
import { Product } from '../models/product';

export function sanitizeProduct(sanitizer: DomSanitizer, product: Product): Product {
  const sanitizedProduct: Product = Object.assign({}, product);
  sanitizedProduct.name = sanitizer.sanitize(4, product.name.trim()) ?? '';
  sanitizedProduct.description = sanitizer.sanitize(4, product.description.trim()) ?? '';
  sanitizedProduct.image = sanitizer.sanitize(4, product.image!.trim()) ?? undefined;
  sanitizedProduct.category = sanitizer.sanitize(4, product.category!.trim()) ?? undefined;
  sanitizedProduct.size = sanitizer.sanitize(4, product.size!.trim()) ?? undefined;
  sanitizedProduct.color = sanitizer.sanitize(4, product.color!.trim()) ?? undefined;
  sanitizedProduct.material = sanitizer.sanitize(4, product.material!.trim()) ?? undefined;
  sanitizedProduct.brand = sanitizer.sanitize(4, product.brand!.trim()) ?? undefined;
  return sanitizedProduct;
}
