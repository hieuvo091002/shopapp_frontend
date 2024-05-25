import { Component, OnInit } from '@angular/core';
import { Category } from '../../../../models/category';
import { CategoryService } from '../../../../services/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UpdateCategoryDTO } from '../../../../dtos/category/update.category.dto';
import { InsertCategoryDTO } from 'src/app/dtos/category/insert.category.dto';


@Component({
  selector: 'app-detail.category.admin',
  templateUrl: './update.category.admin.component.html',
  styleUrls: ['./update.category.admin.component.scss']
})

export class UpdateCategoryAdminComponent implements OnInit {
  categoryId: number;
  updatedCategory: Category;

  updateCategoryDTO: InsertCategoryDTO = {
    name: '',    
  };
  
  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
  
  ) {
    this.categoryId = 0;    
    this.updatedCategory = {} as Category;  
  }

  ngOnInit(): void {    
    this.route.paramMap.subscribe(params => {
      
      this.categoryId = Number(params.get('id'));
      console.log( 'đây là id'+this.categoryId)
      this.getCategoryDetails();
    });
    
  }
  
  getCategoryDetails(): void {
    this.categoryService.getDetailCategory(this.categoryId).subscribe({
      next: (category: Category) => {        
        this.updatedCategory = { ...category };                        
      },
      complete: () => {
        
      },
      error: (error: any) => {
        
      }
    });     
  }
  updateCategory() {
    // Implement your update logic here

    const updateCategoryDTO: UpdateCategoryDTO = {
      name: this.updateCategoryDTO.name,      
    };
    console.log('đây là id'+this.categoryId);
    console.log('đây là name '+ this.updateCategoryDTO.name)
    this.categoryService.updateCategory(this.categoryId, updateCategoryDTO).subscribe({
      next: (response: any) => {  
                
      },
      complete: () => {
        ;
        this.router.navigate(['/admin/categories']);        
      },
      error: (error: any) => {
        ;
        console.error('Error fetching categorys:', error);
      }
    });  
  }  
}
