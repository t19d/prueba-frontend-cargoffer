import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { AuthService } from './auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { sanitizeProduct } from '../utils/utils';

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
    const body = sanitizeProduct(this.sanitizer, product);
    return this.http.post<Product>(this.baseUrl, body, { headers });
  }

  updateProduct(id: string, product: Product): Observable<Product> | undefined {
    if (!id || !product) return;
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.baseUrl}/${this.sanitizer.sanitize(4, id.trim())}`;
    const body = sanitizeProduct(this.sanitizer, product);
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
}
