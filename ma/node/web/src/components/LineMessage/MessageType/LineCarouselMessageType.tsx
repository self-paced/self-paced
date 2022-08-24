import { z } from 'zod';
import { InputLabel, TextField, Button } from '@super_studio/ecforce_ui_albers';
import { MessageComponent } from '.';
import { ChangeEvent, useState } from 'react';
import {
  MdAdd,
  MdArrowDropDown,
  MdArrowDropUp,
  MdDelete,
} from 'react-icons/md';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import v from '../../../utils/validation';

export const MAX_COLUMNS = 10;
export const MAX_ACTIONS = 3;

export const lineCarouselMessageSchema = z.object({
  type: z.literal('template'),
  altText: z.string().min(1),
  template: z.object({
    type: z.literal('carousel'),
    columns: z
      .array(
        z.object({
          thumbnailImageUrl: z
            .string()
            .min(1, { message: v.MESSAGES.required('画像URL') })
            .url({ message: v.MESSAGES.url('画像URL') }),
          imageBackgroundColor: z.string().optional(),
          title: z
            .string()
            .min(1, { message: v.MESSAGES.required('タイトル') }),
          text: z
            .string()
            .min(1, { message: v.MESSAGES.required('カラムの詳細') }),
          defaultAction: z.object({
            type: z.literal('uri'),
            label: z
              .string()
              .min(1, { message: v.MESSAGES.required('ラベル') }),
            uri: z
              .string()
              .min(1, {
                message: v.MESSAGES.required('デフォルトアクションのURL'),
              })
              .url({ message: v.MESSAGES.url('デフォルトアクションのURL') }),
          }),
          actions: z
            .array(
              z.object({
                type: z.literal('uri'),
                label: z.string().min(1, {
                  message: v.MESSAGES.required('アクションのラベル'),
                }),
                uri: z
                  .string()
                  .min(1, {
                    message: v.MESSAGES.required('アクションのURL'),
                  })
                  .url({ message: v.MESSAGES.url('アクションのURL') }),
              })
            )
            .min(1)
            .max(MAX_ACTIONS),
        })
      )
      .min(1)
      .max(MAX_COLUMNS)
      .refine(
        (columns) => {
          // すべてのカラムは同じアクション数になっていることを確認
          const numberOfActions = columns[0].actions.length;
          for (let i = 0; i < columns.length; i++) {
            if (columns[i].actions.length !== numberOfActions) {
              return false;
            }
          }
          return true;
        },
        { message: 'カルーセルのカラムのアクション数を揃えてください。' }
      ),
  }),
});

type LineCarouselMessageType = z.infer<typeof lineCarouselMessageSchema>;

export default LineCarouselMessageType;
