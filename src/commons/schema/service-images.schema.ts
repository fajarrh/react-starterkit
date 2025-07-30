
import * as z from "zod";
    
export const inputServiceImagesSchema = (zod:typeof z) => zod.object({
  url:zod.string().nonempty(),
alt:zod.string().optional().nullish(),
order:zod.number().default(0),
createdAt:zod.string(),
updatedAt:zod.string().nonempty(),
service:zod.any()
});

export type InputServiceImagesSchema = z.infer<ReturnType<typeof inputServiceImagesSchema>>;

