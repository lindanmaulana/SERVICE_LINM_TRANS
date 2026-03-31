import z from 'zod';

export const BasePaginationDto = z.object({
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().min(1).max(100).default(5),
});

export const BaseMetaDto = z.object({
	total: z.number(),
	page: z.number(),
	limit: z.number(),
	totalPage: z.number(),
	links: z.array(z.number()),
});

export type TypeBaseMetaDto = z.infer<typeof BaseMetaDto>
