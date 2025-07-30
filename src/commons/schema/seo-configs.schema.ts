
import * as z from "zod";
    
export const inputSeoConfigsSchema = (zod:typeof z) => zod.object({
  title:zod.string().nonempty(),
description:zod.string().optional().nullish(),
keywords:zod.string().optional().nullish(),
ogTitle:zod.string().optional().nullish(),
ogDescription:zod.string().optional().nullish(),
ogImage:zod.string().optional().nullish(),
createdAt:zod.string(),
updatedAt:zod.string().nonempty(),
Service:zod.any()
});

export type InputSeoConfigsSchema = z.infer<ReturnType<typeof inputSeoConfigsSchema>>;

