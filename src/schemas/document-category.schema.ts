import { z } from 'zod';

const CategoryTranslationsSchema = z.object({
  en: z.object({
    name: z.string().trim().min(1, 'Falta el nombre en inglés'),
  }),
  es: z.object({
    name: z.string().trim().min(1, 'Falta el nombre en español'),
  }),
});

export const CreateDocumentCategorySchema = z.object({
  translations: CategoryTranslationsSchema,
});

export type CreateDocumentCategoryInput = z.infer<
  typeof CreateDocumentCategorySchema
>;

export const UpdateDocumentCategorySchema = z.object({
  id: z.number().int().positive(),
  translations: CategoryTranslationsSchema,
});

export type UpdateDocumentCategoryInput = z.infer<
  typeof UpdateDocumentCategorySchema
>;
