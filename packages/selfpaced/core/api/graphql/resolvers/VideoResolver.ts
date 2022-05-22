import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { AppDataSource } from '../../db/data-source';
import { Course } from '../../db/entity/Course';
import { Video } from '../../db/entity/Video';
import CreateVideoInput from '../models/video/CreateVideoInput';
import EditVideoInput from '../models/video/EditVideoInput';

@Resolver()
export default class VideoResolver {
  @Query(() => [Video])
  async listCourseVideos(@Arg('courseId') courseId: number): Promise<Video[]> {
    const course = await Course.findOne({
      where: { id: courseId },
      relations: { videos: true },
    });
    if (!course) return [];
    return course.videos;
  }

  @Query(() => Video, { nullable: true })
  async getVideo(@Arg('id') id: number): Promise<Video | null> {
    return await Video.findOneBy({ id });
  }

  @Mutation(() => Video)
  async createVideo(
    @Arg('input') { courseId, ...input }: CreateVideoInput
  ): Promise<Video> {
    const course: Course = (await Course.findOneBy({ id: courseId }))!;
    const video: Video = await Video.create({ ...input, course }).save();
    return video;
  }

  @Mutation(() => Video)
  async editVideo(
    @Arg('input') { id, ...input }: EditVideoInput
  ): Promise<Video> {
    await AppDataSource.createQueryBuilder()
      .update(Video)
      .set(input)
      .where('id = :id', { id })
      .execute();
    const video = await Video.findOneBy({ id });
    return video!;
  }

  @Mutation(() => Boolean)
  async deleteVideo(@Arg('id') id: number): Promise<boolean> {
    await Video.create({ id }).remove();
    return true;
  }
}
