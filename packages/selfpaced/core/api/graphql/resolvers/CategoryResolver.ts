import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { AppDataSource } from '../../db/data-source';
import { Category } from '../../db/entity/Category';
import CreateCategoryInput from '../models/category/CreateCategoryInput';
import EditCategoryInput from '../models/category/EditCategoryInput';

@Resolver()
export default class CategoryResolver {
  @Query(() => [Category])
  async listCategories(): Promise<Category[]> {
    return await Category.find();
  }

  @Query(() => Category, { nullable: true })
  async getCategory(@Arg('id') id: number): Promise<Category | null> {
    return await Category.findOneBy({ id });
  }

  @Mutation(() => Category)
  async createCategory(
    @Arg('input') input: CreateCategoryInput
  ): Promise<Category> {
    const category: Category = await Category.create({ ...input }).save();
    return category;
  }

  @Mutation(() => Category)
  async editCategory(
    @Arg('input') { id, ...input }: EditCategoryInput
  ): Promise<Category> {
    await AppDataSource.createQueryBuilder()
      .update(Category)
      .set(input)
      .where('id = :id', { id })
      .execute();
    const category = await Category.findOneBy({ id });
    return category!;
  }

  @Mutation(() => Category)
  async deleteCategory(@Arg('id') id: number): Promise<Category> {
    const category: Category = await Category.create({ id }).remove();
    return category;
  }
}
