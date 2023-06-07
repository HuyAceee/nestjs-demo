/* eslint-disable prettier/prettier */
import { Document, Schema } from 'mongoose';
import { Post } from 'src/post/models/post.model';

const CategorySchema = new Schema(
  {
    title: String,
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
  },
  {
    timestamps: true,
    collection: 'categories',
  },
);

export { CategorySchema };

export interface Category extends Document {
  title: string;
  posts: [Post];
}
