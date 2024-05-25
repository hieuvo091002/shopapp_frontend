import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from '../../../models/category';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-category-admin',
  templateUrl: './category.admin.component.html',
  styleUrls: [
    './category.admin.component.scss',        
  ]
})
export class CategoryAdminComponent implements OnInit {
  categories: Category[] = []; // Dữ liệu động từ categoryService
  constructor(    
    private categoryService: CategoryService,    
    private router: Router,    
    ) {}
    
    ngOnInit() {      
      this.getCategories(0, 100);
    }
    getCategories(page: number, limit: number) {
      this.categoryService.getCategories(page, limit).subscribe({
        next: (categories: Category[]) => {
          ;
          this.categories = categories;
        },
        complete: () => {
          ;
        },
        error: (error: any) => {
          console.error('Error fetching categories:', error);
        }
      });
    }
    insertCategory() {
      
      // Điều hướng đến trang detail-category với categoryId là tham số
      this.router.navigate(['/admin/categories/insert']);
    } 

    // Hàm xử lý sự kiện khi sản phẩm được bấm vào
    updateCategory(categoryId: number) {
            
      this.router.navigate(['/admin/categories/update', categoryId]);
    }  
    deleteCategory(category: Category) {      
      const confirmation = window
      .confirm('Are you sure you want to delete this category?');
      if (confirmation) {
        
        this.categoryService.deleteCategory(category.id).subscribe({
          next: (response: string) => {
             
            alert('Xóa thành công')
            location.reload();          
          },
          complete: () => {
            ;          
          },
          error: (error: any) => {
            ;
            // alert(error.error)
            // console.error('Error fetching categories:', error);
            location.reload(); 
          }
        });  
      }      
    }
}