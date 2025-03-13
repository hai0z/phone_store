import { BaseService } from "./base.service";
import { Categories } from "@prisma/client";

export class CategoryService extends BaseService {
  async getAllCategories() {
    return this.prisma.categories.findMany({});
  }

  async getCategoryById(categoryId: number) {
    return this.prisma.categories.findUnique({
      where: { category_id: categoryId },
    });
  }

  async createCategory(data: Omit<Categories, "category_id">) {
    return this.prisma.categories.create({
      data,
    });
  }

  async updateCategory(categoryId: number, data: Partial<Categories>) {
    return this.prisma.categories.update({
      where: { category_id: categoryId },
      data,
    });
  }

  async deleteCategory(categoryId: number) {
    return this.prisma.categories.delete({
      where: { category_id: categoryId },
    });
  }
}
