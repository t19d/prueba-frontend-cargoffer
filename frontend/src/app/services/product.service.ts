import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { AuthService } from './auth.service';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://127.0.0.1:3000/products';

  constructor(private http: HttpClient, private authService: AuthService, private sanitizer: DomSanitizer) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  getProductById(id: string | null): Observable<Product> | undefined {
    if (!id) return;
    const url = `${this.baseUrl}/${this.sanitizer.sanitize(4, id.trim())}`;
    return this.http.get<Product>(url);
  }

  createProduct(product: Product): Observable<Product> | undefined {
    if (!product) return;
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = this.sanitizeProduct(product);
    return this.http.post<Product>(this.baseUrl, body, { headers });
  }

  updateProduct(id: string, product: Product): Observable<Product> | undefined {
    if (!id || !product) return;
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.baseUrl}/${this.sanitizer.sanitize(4, id.trim())}`;
    const body = this.sanitizeProduct(product);
    return this.http.put<Product>(url, body, { headers });
  }

  deleteProduct(id: string): Observable<Product> | undefined {
    if (!id) return;
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.baseUrl}/${this.sanitizer.sanitize(4, id.trim())}`;
    return this.http.delete<Product>(url, { headers });
  }

  searchProducts(searchTerm: string): Observable<Product[]> {
    const url = `${this.baseUrl}?name=${this.sanitizer.sanitize(4, searchTerm.trim())}`;
    return this.http.get<Product[]>(url);
  }

  private sanitizeProduct(product: Product): Product {
    const body: Product = Object.assign({}, product);
    body.name = this.sanitizer.sanitize(4, product.name.trim()) ?? '';
    body.description = this.sanitizer.sanitize(4, product.description.trim()) ?? '';
    body.image = this.sanitizer.sanitize(4, product.image!.trim()) ?? undefined;
    body.category = this.sanitizer.sanitize(4, product.category!.trim()) ?? undefined;
    body.size = this.sanitizer.sanitize(4, product.size!.trim()) ?? undefined;
    body.color = this.sanitizer.sanitize(4, product.color!.trim()) ?? undefined;
    body.material = this.sanitizer.sanitize(4, product.material!.trim()) ?? undefined;
    body.brand = this.sanitizer.sanitize(4, product.brand!.trim()) ?? undefined;
    return body;
  }
}
