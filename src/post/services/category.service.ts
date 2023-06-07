import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';
import { CreateCategoryDto } from '../dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async getAllCategories() {
    return this.categoryRepository.getByCondition({});
  }

  async getCategoryById(id: string) {
    const category = await this.categoryRepository.findById(id);
    if (category) {
      await category
        .populate({
          path: 'posts',
        })
        .execPopulate();
      return category;
    }
    return new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  async createCategory(data: CreateCategoryDto) {
    return this.categoryRepository.create(data);
  }
}
