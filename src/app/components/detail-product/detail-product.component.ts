import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { environment } from '../../../environments/environment';
import { ProductImage } from '../../models/product.image';
import { AuthGuard } from 'src/app/guards/auth.guard';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.scss']
})

export class DetailProductComponent implements OnInit {
  product?: Product;
  productId: number = 0;
  currentImageIndex: number = 0;
  quantity: number = 1;
  isPressedAddToCart: boolean = false;
  products: Product[] = [];
  selectedCategoryId: number = 0; // Giá trị category được chọn
  currentPage: number = 0;
  itemsPerPage: number = 4;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = "";

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    // private categoryService: CategoryService,
    // private router: Router,
    private authGuard: AuthGuard,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {

  }
  ngOnInit() {
    // Lấy productId từ URL      
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    const categoryParam = this.activatedRoute.snapshot.paramMap.get('category');

    console.log(categoryParam);
    //this.cartService.clearCart();
    //const idParam = 9 //fake tạm 1 giá trị
    if (idParam !== null) {
      this.productId = +idParam;
    }
    if (categoryParam !== null) {
      this.selectedCategoryId = +categoryParam;
    }
    if (!isNaN(this.productId)) {
      this.productService.getDetailProduct(this.productId).subscribe({
        next: (response: any) => {
          // Lấy danh sách ảnh sản phẩm và thay đổi URL
          console.log(response);

          if (response.product_images && response.product_images.length > 0) {
            response.product_images.forEach((product_image: ProductImage) => {
              product_image.image_url = `${environment.apiBaseUrl}/products/images/${product_image.image_url}`;
            });
          }
          // response.category_id =  this.selectedCategoryId;   

          this.product = response


          // this.product?.category_id = this.selectedCategoryId;
          // Bắt đầu với ảnh đầu tiên
          this.showImage(0);
        },
        complete: () => {
          ;
        },
        error: (error: any) => {
          ;
          console.error('Error fetching detail:', error);
        }
      });
    } else {
      console.error('Invalid productId:', idParam);
    }
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
  }
  showImage(index: number): void {
    if (this.product && this.product.product_images &&
      this.product.product_images.length > 0) {
      // Đảm bảo index nằm trong khoảng hợp lệ        
      if (index < 0) {
        index = 0;
      } else if (index >= this.product.product_images.length) {
        index = this.product.product_images.length - 1;
      }
      // Gán index hiện tại và cập nhật ảnh hiển thị
      this.currentImageIndex = index;
    }
  }
  thumbnailClick(index: number) {
    // Gọi khi một thumbnail được bấm
    this.currentImageIndex = index; // Cập nhật currentImageIndex
  }
  nextImage(): void {
    this.showImage(this.currentImageIndex + 1);
  }

  previousImage(): void {
    this.showImage(this.currentImageIndex - 1);
  }
  addToCart(): void {
    this.isPressedAddToCart = true;
    if (this.authGuard.isLoggedIn) {
      if (this.product) {
        this.cartService.addToCart(this.product.id, this.quantity);
        alert('Thêm vào giỏ hàng thành công');
      } else {
        // Xử lý khi product là null
        console.error('Không thể thêm sản phẩm vào giỏ hàng vì product là null.');
      }
    }
    else
      this.router.navigate(['/login']);
  }


  addToCartid(id: any): void {
    // this.isPressedAddToCart = true;
    if (this.authGuard.isLoggedIn) {

      this.cartService.addToCart(id, 1);
      alert('Thêm vào giỏ hàng thành công');
    }
    else
      this.router.navigate(['/login']);
  }


  onProduct(productId: number, category: number) {

    // Điều hướng đến trang detail-product với productId là tham số
    this.router.navigate(['/products', productId, category]);
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
  getTotalPrice(): number {
    if (this.product) {
      return this.product.price * this.quantity;
    }
    return 0;
  }
  buyNow(): void {
    if (this.isPressedAddToCart == false) {
      this.addToCart();
    }
    this.router.navigate(['/orders']);
  }

  searchProducts1(category: number) {
    this.currentPage = 0;
    this.itemsPerPage = 4;

    this.getProducts(this.keyword, category, this.currentPage, this.itemsPerPage);
  }

  getProducts(keyword: string, selectedCategoryId: number, page: number, limit: number) {

    this.productService.getProducts(keyword, selectedCategoryId, page, limit).subscribe({
      next: (response: any) => {


        response.products.forEach((product: Product) => {
          product.url = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
        });
        this.products = response.products;
        this.totalPages = response.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      },
      complete: () => {


      },
      error: (error: any) => {


        console.error('Error fetching products:', error);
      }
    });
  }

  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    return new Array(endPage - startPage + 1).fill(0)
      .map((_, index) => startPage + index);
  }

  onProductClick(productId: number) {

    // Điều hướng đến trang detail-product với productId là tham số
    this.router.navigate(['/products', productId]);
  }
}
