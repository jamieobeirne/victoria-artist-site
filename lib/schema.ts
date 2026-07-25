import { z } from 'zod'

export const categorySchema = z.enum(['trabajo', 'proyectos'])

export const imageItemSchema = z.object({
  id: z.string().min(1),
  url: z.string().url(),
  caption: z.string().max(150),
})

export const entrySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(80),
  description: z.string().min(1).max(500),
  images: z.array(imageItemSchema).min(1),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const manifestSchema = z.object({
  trabajo: z.array(entrySchema),
  proyectos: z.array(entrySchema),
})

export const createEntryRequestSchema = z.object({
  category: categorySchema,
  title: z.string().min(1).max(80),
  description: z.string().min(1).max(500),
  images: z.array(imageItemSchema).min(1),
})

export type Category = z.infer<typeof categorySchema>
export type ImageItem = z.infer<typeof imageItemSchema>
export type Entry = z.infer<typeof entrySchema>
export type Manifest = z.infer<typeof manifestSchema>
export type CreateEntryRequest = z.infer<typeof createEntryRequestSchema>
