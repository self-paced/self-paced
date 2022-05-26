import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { AppDataSource } from '../../db/data-source';
import { Course } from '../../db/entity/Course';
import CreateCourseInput from '../models/course/CreateCourseInput';
import EditCourseInput from '../models/course/EditCourseInput';

@Resolver()
export default class CourseResolver {
  @Query(() => [Course])
  async listCourses(): Promise<Course[]> {
    return await Course.find();
  }

  @Query(() => Course, { nullable: true })
  async getCourse(@Arg('id') id: number): Promise<Course | null> {
    return await Course.findOne({ where: { id }, relations: { videos: true } });
  }

  @Mutation(() => Course)
  async createCourse(@Arg('input') input: CreateCourseInput): Promise<Course> {
    const course: Course = await Course.create({ ...input }).save();
    return course;
  }

  @Mutation(() => Course)
  async editCourse(
    @Arg('input') { id, ...input }: EditCourseInput
  ): Promise<Course> {
    await AppDataSource.createQueryBuilder()
      .update(Course)
      .set(input)
      .where('id = :id', { id })
      .execute();
    const course = await Course.findOneBy({ id });
    return course!;
  }

  @Mutation(() => Boolean)
  async deleteCourse(@Arg('id') id: number): Promise<boolean> {
    await Course.create({ id }).remove();
    return true;
  }
}
