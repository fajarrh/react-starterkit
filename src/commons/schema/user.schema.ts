
import * as z from "zod";
    
export const inputUserSchema = (zod:typeof z) => zod.object({
  name:zod.string().nonempty(),
email:zod.string().nonempty(),
password:zod.string().optional().nullish(),
isActive:zod.boolean().optional().nullish().default(false),
type:zod.enum(['DEV', 'PROD']).optional().nullish(),
createdAt:zod.string().optional().nullish(),
updatedAt:zod.string().optional().nullish()
});

export type InputUserSchema = z.infer<ReturnType<typeof inputUserSchema>>;

