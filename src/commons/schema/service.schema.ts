
import * as z from "zod";
    
export const inputServiceSchema = (zod:typeof z) => zod.object({
  name:zod.string().nonempty(),
slug:zod.string().nonempty(),
description:zod.string().optional().nullish(),
providerName:zod.string().nonempty(),
contactNumber:zod.string().optional().nullish(),
price:zod.number().optional().nullish().default(0),
logoUrl:zod.string().optional().nullish(),
profileImage:zod.string().optional().nullish(),
createdAt:zod.string(),
updatedAt:zod.string().nonempty(),
category:zod.any(),
seo:zod.any(),
tags:zod.any(),
images:zod.any()
});

export type InputServiceSchema = z.infer<ReturnType<typeof inputServiceSchema>>;

