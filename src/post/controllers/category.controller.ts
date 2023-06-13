/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/category.dto';
import { CategoryService } from '../services/category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Get(':id')
  getCategoryDetail(@Param('id') id: string) {
    return this.categoryService.getCategoryById(id);
  }

  @Post()
  createCategory(@Body() category: CreateCategoryDto) {
    return this.categoryService.createCategory(category);
  }
}
