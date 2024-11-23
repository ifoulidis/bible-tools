import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserRoleScalarFieldEnumSchema = z.enum(['userId','role']);

export const CharacterScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','name','lengthOfReign','startOfReign','endOfReign','relationToPredecessor','kingdom']);

export const BiblePassageScalarFieldEnumSchema = z.enum(['id','book','chapter','verses','characterId']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const RoleSchema = z.enum(['Admin','Staff']);

export type RoleType = `${z.infer<typeof RoleSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER ROLE SCHEMA
/////////////////////////////////////////

export const UserRoleSchema = z.object({
  role: RoleSchema,
  userId: z.string(),
})

export type UserRole = z.infer<typeof UserRoleSchema>

/////////////////////////////////////////
// CHARACTER SCHEMA
/////////////////////////////////////////

export const CharacterSchema = z.object({
  id: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
  name: z.string(),
  lengthOfReign: z.string(),
  startOfReign: z.number().int(),
  endOfReign: z.number().int(),
  relationToPredecessor: z.string().nullable(),
  kingdom: z.string(),
})

export type Character = z.infer<typeof CharacterSchema>

/////////////////////////////////////////
// BIBLE PASSAGE SCHEMA
/////////////////////////////////////////

export const BiblePassageSchema = z.object({
  id: z.number().int(),
  book: z.string(),
  chapter: z.string(),
  verses: z.string(),
  characterId: z.number().int(),
})

export type BiblePassage = z.infer<typeof BiblePassageSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER ROLE
//------------------------------------------------------

export const UserRoleSelectSchema: z.ZodType<Prisma.UserRoleSelect> = z.object({
  userId: z.boolean().optional(),
  role: z.boolean().optional(),
}).strict()

// CHARACTER
//------------------------------------------------------

export const CharacterIncludeSchema: z.ZodType<Prisma.CharacterInclude> = z.object({
  keyPassages: z.union([z.boolean(),z.lazy(() => BiblePassageFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CharacterCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const CharacterArgsSchema: z.ZodType<Prisma.CharacterDefaultArgs> = z.object({
  select: z.lazy(() => CharacterSelectSchema).optional(),
  include: z.lazy(() => CharacterIncludeSchema).optional(),
}).strict();

export const CharacterCountOutputTypeArgsSchema: z.ZodType<Prisma.CharacterCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CharacterCountOutputTypeSelectSchema).nullish(),
}).strict();

export const CharacterCountOutputTypeSelectSchema: z.ZodType<Prisma.CharacterCountOutputTypeSelect> = z.object({
  keyPassages: z.boolean().optional(),
}).strict();

export const CharacterSelectSchema: z.ZodType<Prisma.CharacterSelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  name: z.boolean().optional(),
  lengthOfReign: z.boolean().optional(),
  startOfReign: z.boolean().optional(),
  endOfReign: z.boolean().optional(),
  relationToPredecessor: z.boolean().optional(),
  kingdom: z.boolean().optional(),
  keyPassages: z.union([z.boolean(),z.lazy(() => BiblePassageFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CharacterCountOutputTypeArgsSchema)]).optional(),
}).strict()

// BIBLE PASSAGE
//------------------------------------------------------

export const BiblePassageIncludeSchema: z.ZodType<Prisma.BiblePassageInclude> = z.object({
  character: z.union([z.boolean(),z.lazy(() => CharacterArgsSchema)]).optional(),
}).strict()

export const BiblePassageArgsSchema: z.ZodType<Prisma.BiblePassageDefaultArgs> = z.object({
  select: z.lazy(() => BiblePassageSelectSchema).optional(),
  include: z.lazy(() => BiblePassageIncludeSchema).optional(),
}).strict();

export const BiblePassageSelectSchema: z.ZodType<Prisma.BiblePassageSelect> = z.object({
  id: z.boolean().optional(),
  book: z.boolean().optional(),
  chapter: z.boolean().optional(),
  verses: z.boolean().optional(),
  characterId: z.boolean().optional(),
  character: z.union([z.boolean(),z.lazy(() => CharacterArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const UserRoleWhereInputSchema: z.ZodType<Prisma.UserRoleWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserRoleWhereInputSchema),z.lazy(() => UserRoleWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserRoleWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserRoleWhereInputSchema),z.lazy(() => UserRoleWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumRoleFilterSchema),z.lazy(() => RoleSchema) ]).optional(),
}).strict();

export const UserRoleOrderByWithRelationInputSchema: z.ZodType<Prisma.UserRoleOrderByWithRelationInput> = z.object({
  userId: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserRoleWhereUniqueInputSchema: z.ZodType<Prisma.UserRoleWhereUniqueInput> = z.object({
  userId: z.string()
})
.and(z.object({
  userId: z.string().optional(),
  AND: z.union([ z.lazy(() => UserRoleWhereInputSchema),z.lazy(() => UserRoleWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserRoleWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserRoleWhereInputSchema),z.lazy(() => UserRoleWhereInputSchema).array() ]).optional(),
  role: z.union([ z.lazy(() => EnumRoleFilterSchema),z.lazy(() => RoleSchema) ]).optional(),
}).strict());

export const UserRoleOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserRoleOrderByWithAggregationInput> = z.object({
  userId: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserRoleCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserRoleMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserRoleMinOrderByAggregateInputSchema).optional()
}).strict();

export const UserRoleScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserRoleScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserRoleScalarWhereWithAggregatesInputSchema),z.lazy(() => UserRoleScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserRoleScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserRoleScalarWhereWithAggregatesInputSchema),z.lazy(() => UserRoleScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumRoleWithAggregatesFilterSchema),z.lazy(() => RoleSchema) ]).optional(),
}).strict();

export const CharacterWhereInputSchema: z.ZodType<Prisma.CharacterWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CharacterWhereInputSchema),z.lazy(() => CharacterWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CharacterWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CharacterWhereInputSchema),z.lazy(() => CharacterWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lengthOfReign: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  startOfReign: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  endOfReign: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  relationToPredecessor: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  kingdom: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  keyPassages: z.lazy(() => BiblePassageListRelationFilterSchema).optional()
}).strict();

export const CharacterOrderByWithRelationInputSchema: z.ZodType<Prisma.CharacterOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  lengthOfReign: z.lazy(() => SortOrderSchema).optional(),
  startOfReign: z.lazy(() => SortOrderSchema).optional(),
  endOfReign: z.lazy(() => SortOrderSchema).optional(),
  relationToPredecessor: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  kingdom: z.lazy(() => SortOrderSchema).optional(),
  keyPassages: z.lazy(() => BiblePassageOrderByRelationAggregateInputSchema).optional()
}).strict();

export const CharacterWhereUniqueInputSchema: z.ZodType<Prisma.CharacterWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => CharacterWhereInputSchema),z.lazy(() => CharacterWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CharacterWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CharacterWhereInputSchema),z.lazy(() => CharacterWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lengthOfReign: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  startOfReign: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  endOfReign: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  relationToPredecessor: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  kingdom: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  keyPassages: z.lazy(() => BiblePassageListRelationFilterSchema).optional()
}).strict());

export const CharacterOrderByWithAggregationInputSchema: z.ZodType<Prisma.CharacterOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  lengthOfReign: z.lazy(() => SortOrderSchema).optional(),
  startOfReign: z.lazy(() => SortOrderSchema).optional(),
  endOfReign: z.lazy(() => SortOrderSchema).optional(),
  relationToPredecessor: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  kingdom: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => CharacterCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => CharacterAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CharacterMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CharacterMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => CharacterSumOrderByAggregateInputSchema).optional()
}).strict();

export const CharacterScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CharacterScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => CharacterScalarWhereWithAggregatesInputSchema),z.lazy(() => CharacterScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CharacterScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CharacterScalarWhereWithAggregatesInputSchema),z.lazy(() => CharacterScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  lengthOfReign: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  startOfReign: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  endOfReign: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  relationToPredecessor: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  kingdom: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const BiblePassageWhereInputSchema: z.ZodType<Prisma.BiblePassageWhereInput> = z.object({
  AND: z.union([ z.lazy(() => BiblePassageWhereInputSchema),z.lazy(() => BiblePassageWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BiblePassageWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BiblePassageWhereInputSchema),z.lazy(() => BiblePassageWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  book: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  chapter: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  verses: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  characterId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  character: z.union([ z.lazy(() => CharacterRelationFilterSchema),z.lazy(() => CharacterWhereInputSchema) ]).optional(),
}).strict();

export const BiblePassageOrderByWithRelationInputSchema: z.ZodType<Prisma.BiblePassageOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  book: z.lazy(() => SortOrderSchema).optional(),
  chapter: z.lazy(() => SortOrderSchema).optional(),
  verses: z.lazy(() => SortOrderSchema).optional(),
  characterId: z.lazy(() => SortOrderSchema).optional(),
  character: z.lazy(() => CharacterOrderByWithRelationInputSchema).optional()
}).strict();

export const BiblePassageWhereUniqueInputSchema: z.ZodType<Prisma.BiblePassageWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => BiblePassageWhereInputSchema),z.lazy(() => BiblePassageWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BiblePassageWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BiblePassageWhereInputSchema),z.lazy(() => BiblePassageWhereInputSchema).array() ]).optional(),
  book: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  chapter: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  verses: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  characterId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  character: z.union([ z.lazy(() => CharacterRelationFilterSchema),z.lazy(() => CharacterWhereInputSchema) ]).optional(),
}).strict());

export const BiblePassageOrderByWithAggregationInputSchema: z.ZodType<Prisma.BiblePassageOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  book: z.lazy(() => SortOrderSchema).optional(),
  chapter: z.lazy(() => SortOrderSchema).optional(),
  verses: z.lazy(() => SortOrderSchema).optional(),
  characterId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => BiblePassageCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => BiblePassageAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => BiblePassageMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => BiblePassageMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => BiblePassageSumOrderByAggregateInputSchema).optional()
}).strict();

export const BiblePassageScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.BiblePassageScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => BiblePassageScalarWhereWithAggregatesInputSchema),z.lazy(() => BiblePassageScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => BiblePassageScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BiblePassageScalarWhereWithAggregatesInputSchema),z.lazy(() => BiblePassageScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  book: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  chapter: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  verses: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  characterId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const UserRoleCreateInputSchema: z.ZodType<Prisma.UserRoleCreateInput> = z.object({
  userId: z.string(),
  role: z.lazy(() => RoleSchema)
}).strict();

export const UserRoleUncheckedCreateInputSchema: z.ZodType<Prisma.UserRoleUncheckedCreateInput> = z.object({
  userId: z.string(),
  role: z.lazy(() => RoleSchema)
}).strict();

export const UserRoleUpdateInputSchema: z.ZodType<Prisma.UserRoleUpdateInput> = z.object({
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserRoleUncheckedUpdateInputSchema: z.ZodType<Prisma.UserRoleUncheckedUpdateInput> = z.object({
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserRoleCreateManyInputSchema: z.ZodType<Prisma.UserRoleCreateManyInput> = z.object({
  userId: z.string(),
  role: z.lazy(() => RoleSchema)
}).strict();

export const UserRoleUpdateManyMutationInputSchema: z.ZodType<Prisma.UserRoleUpdateManyMutationInput> = z.object({
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserRoleUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserRoleUncheckedUpdateManyInput> = z.object({
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CharacterCreateInputSchema: z.ZodType<Prisma.CharacterCreateInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  name: z.string(),
  lengthOfReign: z.string(),
  startOfReign: z.number().int(),
  endOfReign: z.number().int(),
  relationToPredecessor: z.string().optional().nullable(),
  kingdom: z.string(),
  keyPassages: z.lazy(() => BiblePassageCreateNestedManyWithoutCharacterInputSchema).optional()
}).strict();

export const CharacterUncheckedCreateInputSchema: z.ZodType<Prisma.CharacterUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  name: z.string(),
  lengthOfReign: z.string(),
  startOfReign: z.number().int(),
  endOfReign: z.number().int(),
  relationToPredecessor: z.string().optional().nullable(),
  kingdom: z.string(),
  keyPassages: z.lazy(() => BiblePassageUncheckedCreateNestedManyWithoutCharacterInputSchema).optional()
}).strict();

export const CharacterUpdateInputSchema: z.ZodType<Prisma.CharacterUpdateInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lengthOfReign: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startOfReign: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endOfReign: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  relationToPredecessor: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  kingdom: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  keyPassages: z.lazy(() => BiblePassageUpdateManyWithoutCharacterNestedInputSchema).optional()
}).strict();

export const CharacterUncheckedUpdateInputSchema: z.ZodType<Prisma.CharacterUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lengthOfReign: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startOfReign: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endOfReign: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  relationToPredecessor: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  kingdom: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  keyPassages: z.lazy(() => BiblePassageUncheckedUpdateManyWithoutCharacterNestedInputSchema).optional()
}).strict();

export const CharacterCreateManyInputSchema: z.ZodType<Prisma.CharacterCreateManyInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  name: z.string(),
  lengthOfReign: z.string(),
  startOfReign: z.number().int(),
  endOfReign: z.number().int(),
  relationToPredecessor: z.string().optional().nullable(),
  kingdom: z.string()
}).strict();

export const CharacterUpdateManyMutationInputSchema: z.ZodType<Prisma.CharacterUpdateManyMutationInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lengthOfReign: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startOfReign: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endOfReign: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  relationToPredecessor: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  kingdom: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CharacterUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CharacterUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lengthOfReign: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startOfReign: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endOfReign: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  relationToPredecessor: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  kingdom: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BiblePassageCreateInputSchema: z.ZodType<Prisma.BiblePassageCreateInput> = z.object({
  book: z.string(),
  chapter: z.string(),
  verses: z.string(),
  character: z.lazy(() => CharacterCreateNestedOneWithoutKeyPassagesInputSchema)
}).strict();

export const BiblePassageUncheckedCreateInputSchema: z.ZodType<Prisma.BiblePassageUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  book: z.string(),
  chapter: z.string(),
  verses: z.string(),
  characterId: z.number().int()
}).strict();

export const BiblePassageUpdateInputSchema: z.ZodType<Prisma.BiblePassageUpdateInput> = z.object({
  book: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  chapter: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  verses: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  character: z.lazy(() => CharacterUpdateOneRequiredWithoutKeyPassagesNestedInputSchema).optional()
}).strict();

export const BiblePassageUncheckedUpdateInputSchema: z.ZodType<Prisma.BiblePassageUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  book: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  chapter: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  verses: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  characterId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BiblePassageCreateManyInputSchema: z.ZodType<Prisma.BiblePassageCreateManyInput> = z.object({
  id: z.number().int().optional(),
  book: z.string(),
  chapter: z.string(),
  verses: z.string(),
  characterId: z.number().int()
}).strict();

export const BiblePassageUpdateManyMutationInputSchema: z.ZodType<Prisma.BiblePassageUpdateManyMutationInput> = z.object({
  book: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  chapter: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  verses: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BiblePassageUncheckedUpdateManyInputSchema: z.ZodType<Prisma.BiblePassageUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  book: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  chapter: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  verses: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  characterId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const EnumRoleFilterSchema: z.ZodType<Prisma.EnumRoleFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NestedEnumRoleFilterSchema) ]).optional(),
}).strict();

export const UserRoleCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserRoleCountOrderByAggregateInput> = z.object({
  userId: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserRoleMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserRoleMaxOrderByAggregateInput> = z.object({
  userId: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserRoleMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserRoleMinOrderByAggregateInput> = z.object({
  userId: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const EnumRoleWithAggregatesFilterSchema: z.ZodType<Prisma.EnumRoleWithAggregatesFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NestedEnumRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumRoleFilterSchema).optional()
}).strict();

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const BiblePassageListRelationFilterSchema: z.ZodType<Prisma.BiblePassageListRelationFilter> = z.object({
  every: z.lazy(() => BiblePassageWhereInputSchema).optional(),
  some: z.lazy(() => BiblePassageWhereInputSchema).optional(),
  none: z.lazy(() => BiblePassageWhereInputSchema).optional()
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();

export const BiblePassageOrderByRelationAggregateInputSchema: z.ZodType<Prisma.BiblePassageOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CharacterCountOrderByAggregateInputSchema: z.ZodType<Prisma.CharacterCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  lengthOfReign: z.lazy(() => SortOrderSchema).optional(),
  startOfReign: z.lazy(() => SortOrderSchema).optional(),
  endOfReign: z.lazy(() => SortOrderSchema).optional(),
  relationToPredecessor: z.lazy(() => SortOrderSchema).optional(),
  kingdom: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CharacterAvgOrderByAggregateInputSchema: z.ZodType<Prisma.CharacterAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  startOfReign: z.lazy(() => SortOrderSchema).optional(),
  endOfReign: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CharacterMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CharacterMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  lengthOfReign: z.lazy(() => SortOrderSchema).optional(),
  startOfReign: z.lazy(() => SortOrderSchema).optional(),
  endOfReign: z.lazy(() => SortOrderSchema).optional(),
  relationToPredecessor: z.lazy(() => SortOrderSchema).optional(),
  kingdom: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CharacterMinOrderByAggregateInputSchema: z.ZodType<Prisma.CharacterMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  lengthOfReign: z.lazy(() => SortOrderSchema).optional(),
  startOfReign: z.lazy(() => SortOrderSchema).optional(),
  endOfReign: z.lazy(() => SortOrderSchema).optional(),
  relationToPredecessor: z.lazy(() => SortOrderSchema).optional(),
  kingdom: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CharacterSumOrderByAggregateInputSchema: z.ZodType<Prisma.CharacterSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  startOfReign: z.lazy(() => SortOrderSchema).optional(),
  endOfReign: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const CharacterRelationFilterSchema: z.ZodType<Prisma.CharacterRelationFilter> = z.object({
  is: z.lazy(() => CharacterWhereInputSchema).optional(),
  isNot: z.lazy(() => CharacterWhereInputSchema).optional()
}).strict();

export const BiblePassageCountOrderByAggregateInputSchema: z.ZodType<Prisma.BiblePassageCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  book: z.lazy(() => SortOrderSchema).optional(),
  chapter: z.lazy(() => SortOrderSchema).optional(),
  verses: z.lazy(() => SortOrderSchema).optional(),
  characterId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BiblePassageAvgOrderByAggregateInputSchema: z.ZodType<Prisma.BiblePassageAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  characterId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BiblePassageMaxOrderByAggregateInputSchema: z.ZodType<Prisma.BiblePassageMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  book: z.lazy(() => SortOrderSchema).optional(),
  chapter: z.lazy(() => SortOrderSchema).optional(),
  verses: z.lazy(() => SortOrderSchema).optional(),
  characterId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BiblePassageMinOrderByAggregateInputSchema: z.ZodType<Prisma.BiblePassageMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  book: z.lazy(() => SortOrderSchema).optional(),
  chapter: z.lazy(() => SortOrderSchema).optional(),
  verses: z.lazy(() => SortOrderSchema).optional(),
  characterId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BiblePassageSumOrderByAggregateInputSchema: z.ZodType<Prisma.BiblePassageSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  characterId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const EnumRoleFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumRoleFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => RoleSchema).optional()
}).strict();

export const BiblePassageCreateNestedManyWithoutCharacterInputSchema: z.ZodType<Prisma.BiblePassageCreateNestedManyWithoutCharacterInput> = z.object({
  create: z.union([ z.lazy(() => BiblePassageCreateWithoutCharacterInputSchema),z.lazy(() => BiblePassageCreateWithoutCharacterInputSchema).array(),z.lazy(() => BiblePassageUncheckedCreateWithoutCharacterInputSchema),z.lazy(() => BiblePassageUncheckedCreateWithoutCharacterInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BiblePassageCreateOrConnectWithoutCharacterInputSchema),z.lazy(() => BiblePassageCreateOrConnectWithoutCharacterInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BiblePassageCreateManyCharacterInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => BiblePassageWhereUniqueInputSchema),z.lazy(() => BiblePassageWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const BiblePassageUncheckedCreateNestedManyWithoutCharacterInputSchema: z.ZodType<Prisma.BiblePassageUncheckedCreateNestedManyWithoutCharacterInput> = z.object({
  create: z.union([ z.lazy(() => BiblePassageCreateWithoutCharacterInputSchema),z.lazy(() => BiblePassageCreateWithoutCharacterInputSchema).array(),z.lazy(() => BiblePassageUncheckedCreateWithoutCharacterInputSchema),z.lazy(() => BiblePassageUncheckedCreateWithoutCharacterInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BiblePassageCreateOrConnectWithoutCharacterInputSchema),z.lazy(() => BiblePassageCreateOrConnectWithoutCharacterInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BiblePassageCreateManyCharacterInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => BiblePassageWhereUniqueInputSchema),z.lazy(() => BiblePassageWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional().nullable()
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const BiblePassageUpdateManyWithoutCharacterNestedInputSchema: z.ZodType<Prisma.BiblePassageUpdateManyWithoutCharacterNestedInput> = z.object({
  create: z.union([ z.lazy(() => BiblePassageCreateWithoutCharacterInputSchema),z.lazy(() => BiblePassageCreateWithoutCharacterInputSchema).array(),z.lazy(() => BiblePassageUncheckedCreateWithoutCharacterInputSchema),z.lazy(() => BiblePassageUncheckedCreateWithoutCharacterInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BiblePassageCreateOrConnectWithoutCharacterInputSchema),z.lazy(() => BiblePassageCreateOrConnectWithoutCharacterInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => BiblePassageUpsertWithWhereUniqueWithoutCharacterInputSchema),z.lazy(() => BiblePassageUpsertWithWhereUniqueWithoutCharacterInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BiblePassageCreateManyCharacterInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => BiblePassageWhereUniqueInputSchema),z.lazy(() => BiblePassageWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => BiblePassageWhereUniqueInputSchema),z.lazy(() => BiblePassageWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => BiblePassageWhereUniqueInputSchema),z.lazy(() => BiblePassageWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => BiblePassageWhereUniqueInputSchema),z.lazy(() => BiblePassageWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => BiblePassageUpdateWithWhereUniqueWithoutCharacterInputSchema),z.lazy(() => BiblePassageUpdateWithWhereUniqueWithoutCharacterInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => BiblePassageUpdateManyWithWhereWithoutCharacterInputSchema),z.lazy(() => BiblePassageUpdateManyWithWhereWithoutCharacterInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => BiblePassageScalarWhereInputSchema),z.lazy(() => BiblePassageScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const BiblePassageUncheckedUpdateManyWithoutCharacterNestedInputSchema: z.ZodType<Prisma.BiblePassageUncheckedUpdateManyWithoutCharacterNestedInput> = z.object({
  create: z.union([ z.lazy(() => BiblePassageCreateWithoutCharacterInputSchema),z.lazy(() => BiblePassageCreateWithoutCharacterInputSchema).array(),z.lazy(() => BiblePassageUncheckedCreateWithoutCharacterInputSchema),z.lazy(() => BiblePassageUncheckedCreateWithoutCharacterInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BiblePassageCreateOrConnectWithoutCharacterInputSchema),z.lazy(() => BiblePassageCreateOrConnectWithoutCharacterInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => BiblePassageUpsertWithWhereUniqueWithoutCharacterInputSchema),z.lazy(() => BiblePassageUpsertWithWhereUniqueWithoutCharacterInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BiblePassageCreateManyCharacterInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => BiblePassageWhereUniqueInputSchema),z.lazy(() => BiblePassageWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => BiblePassageWhereUniqueInputSchema),z.lazy(() => BiblePassageWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => BiblePassageWhereUniqueInputSchema),z.lazy(() => BiblePassageWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => BiblePassageWhereUniqueInputSchema),z.lazy(() => BiblePassageWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => BiblePassageUpdateWithWhereUniqueWithoutCharacterInputSchema),z.lazy(() => BiblePassageUpdateWithWhereUniqueWithoutCharacterInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => BiblePassageUpdateManyWithWhereWithoutCharacterInputSchema),z.lazy(() => BiblePassageUpdateManyWithWhereWithoutCharacterInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => BiblePassageScalarWhereInputSchema),z.lazy(() => BiblePassageScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CharacterCreateNestedOneWithoutKeyPassagesInputSchema: z.ZodType<Prisma.CharacterCreateNestedOneWithoutKeyPassagesInput> = z.object({
  create: z.union([ z.lazy(() => CharacterCreateWithoutKeyPassagesInputSchema),z.lazy(() => CharacterUncheckedCreateWithoutKeyPassagesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CharacterCreateOrConnectWithoutKeyPassagesInputSchema).optional(),
  connect: z.lazy(() => CharacterWhereUniqueInputSchema).optional()
}).strict();

export const CharacterUpdateOneRequiredWithoutKeyPassagesNestedInputSchema: z.ZodType<Prisma.CharacterUpdateOneRequiredWithoutKeyPassagesNestedInput> = z.object({
  create: z.union([ z.lazy(() => CharacterCreateWithoutKeyPassagesInputSchema),z.lazy(() => CharacterUncheckedCreateWithoutKeyPassagesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CharacterCreateOrConnectWithoutKeyPassagesInputSchema).optional(),
  upsert: z.lazy(() => CharacterUpsertWithoutKeyPassagesInputSchema).optional(),
  connect: z.lazy(() => CharacterWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CharacterUpdateToOneWithWhereWithoutKeyPassagesInputSchema),z.lazy(() => CharacterUpdateWithoutKeyPassagesInputSchema),z.lazy(() => CharacterUncheckedUpdateWithoutKeyPassagesInputSchema) ]).optional(),
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedEnumRoleFilterSchema: z.ZodType<Prisma.NestedEnumRoleFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NestedEnumRoleFilterSchema) ]).optional(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedEnumRoleWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumRoleWithAggregatesFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NestedEnumRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumRoleFilterSchema).optional()
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const BiblePassageCreateWithoutCharacterInputSchema: z.ZodType<Prisma.BiblePassageCreateWithoutCharacterInput> = z.object({
  book: z.string(),
  chapter: z.string(),
  verses: z.string()
}).strict();

export const BiblePassageUncheckedCreateWithoutCharacterInputSchema: z.ZodType<Prisma.BiblePassageUncheckedCreateWithoutCharacterInput> = z.object({
  id: z.number().int().optional(),
  book: z.string(),
  chapter: z.string(),
  verses: z.string()
}).strict();

export const BiblePassageCreateOrConnectWithoutCharacterInputSchema: z.ZodType<Prisma.BiblePassageCreateOrConnectWithoutCharacterInput> = z.object({
  where: z.lazy(() => BiblePassageWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => BiblePassageCreateWithoutCharacterInputSchema),z.lazy(() => BiblePassageUncheckedCreateWithoutCharacterInputSchema) ]),
}).strict();

export const BiblePassageCreateManyCharacterInputEnvelopeSchema: z.ZodType<Prisma.BiblePassageCreateManyCharacterInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => BiblePassageCreateManyCharacterInputSchema),z.lazy(() => BiblePassageCreateManyCharacterInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const BiblePassageUpsertWithWhereUniqueWithoutCharacterInputSchema: z.ZodType<Prisma.BiblePassageUpsertWithWhereUniqueWithoutCharacterInput> = z.object({
  where: z.lazy(() => BiblePassageWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => BiblePassageUpdateWithoutCharacterInputSchema),z.lazy(() => BiblePassageUncheckedUpdateWithoutCharacterInputSchema) ]),
  create: z.union([ z.lazy(() => BiblePassageCreateWithoutCharacterInputSchema),z.lazy(() => BiblePassageUncheckedCreateWithoutCharacterInputSchema) ]),
}).strict();

export const BiblePassageUpdateWithWhereUniqueWithoutCharacterInputSchema: z.ZodType<Prisma.BiblePassageUpdateWithWhereUniqueWithoutCharacterInput> = z.object({
  where: z.lazy(() => BiblePassageWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => BiblePassageUpdateWithoutCharacterInputSchema),z.lazy(() => BiblePassageUncheckedUpdateWithoutCharacterInputSchema) ]),
}).strict();

export const BiblePassageUpdateManyWithWhereWithoutCharacterInputSchema: z.ZodType<Prisma.BiblePassageUpdateManyWithWhereWithoutCharacterInput> = z.object({
  where: z.lazy(() => BiblePassageScalarWhereInputSchema),
  data: z.union([ z.lazy(() => BiblePassageUpdateManyMutationInputSchema),z.lazy(() => BiblePassageUncheckedUpdateManyWithoutCharacterInputSchema) ]),
}).strict();

export const BiblePassageScalarWhereInputSchema: z.ZodType<Prisma.BiblePassageScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => BiblePassageScalarWhereInputSchema),z.lazy(() => BiblePassageScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BiblePassageScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BiblePassageScalarWhereInputSchema),z.lazy(() => BiblePassageScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  book: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  chapter: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  verses: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  characterId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
}).strict();

export const CharacterCreateWithoutKeyPassagesInputSchema: z.ZodType<Prisma.CharacterCreateWithoutKeyPassagesInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  name: z.string(),
  lengthOfReign: z.string(),
  startOfReign: z.number().int(),
  endOfReign: z.number().int(),
  relationToPredecessor: z.string().optional().nullable(),
  kingdom: z.string()
}).strict();

export const CharacterUncheckedCreateWithoutKeyPassagesInputSchema: z.ZodType<Prisma.CharacterUncheckedCreateWithoutKeyPassagesInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional().nullable(),
  name: z.string(),
  lengthOfReign: z.string(),
  startOfReign: z.number().int(),
  endOfReign: z.number().int(),
  relationToPredecessor: z.string().optional().nullable(),
  kingdom: z.string()
}).strict();

export const CharacterCreateOrConnectWithoutKeyPassagesInputSchema: z.ZodType<Prisma.CharacterCreateOrConnectWithoutKeyPassagesInput> = z.object({
  where: z.lazy(() => CharacterWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CharacterCreateWithoutKeyPassagesInputSchema),z.lazy(() => CharacterUncheckedCreateWithoutKeyPassagesInputSchema) ]),
}).strict();

export const CharacterUpsertWithoutKeyPassagesInputSchema: z.ZodType<Prisma.CharacterUpsertWithoutKeyPassagesInput> = z.object({
  update: z.union([ z.lazy(() => CharacterUpdateWithoutKeyPassagesInputSchema),z.lazy(() => CharacterUncheckedUpdateWithoutKeyPassagesInputSchema) ]),
  create: z.union([ z.lazy(() => CharacterCreateWithoutKeyPassagesInputSchema),z.lazy(() => CharacterUncheckedCreateWithoutKeyPassagesInputSchema) ]),
  where: z.lazy(() => CharacterWhereInputSchema).optional()
}).strict();

export const CharacterUpdateToOneWithWhereWithoutKeyPassagesInputSchema: z.ZodType<Prisma.CharacterUpdateToOneWithWhereWithoutKeyPassagesInput> = z.object({
  where: z.lazy(() => CharacterWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CharacterUpdateWithoutKeyPassagesInputSchema),z.lazy(() => CharacterUncheckedUpdateWithoutKeyPassagesInputSchema) ]),
}).strict();

export const CharacterUpdateWithoutKeyPassagesInputSchema: z.ZodType<Prisma.CharacterUpdateWithoutKeyPassagesInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lengthOfReign: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startOfReign: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endOfReign: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  relationToPredecessor: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  kingdom: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CharacterUncheckedUpdateWithoutKeyPassagesInputSchema: z.ZodType<Prisma.CharacterUncheckedUpdateWithoutKeyPassagesInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lengthOfReign: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startOfReign: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  endOfReign: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  relationToPredecessor: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  kingdom: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BiblePassageCreateManyCharacterInputSchema: z.ZodType<Prisma.BiblePassageCreateManyCharacterInput> = z.object({
  id: z.number().int().optional(),
  book: z.string(),
  chapter: z.string(),
  verses: z.string()
}).strict();

export const BiblePassageUpdateWithoutCharacterInputSchema: z.ZodType<Prisma.BiblePassageUpdateWithoutCharacterInput> = z.object({
  book: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  chapter: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  verses: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BiblePassageUncheckedUpdateWithoutCharacterInputSchema: z.ZodType<Prisma.BiblePassageUncheckedUpdateWithoutCharacterInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  book: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  chapter: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  verses: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BiblePassageUncheckedUpdateManyWithoutCharacterInputSchema: z.ZodType<Prisma.BiblePassageUncheckedUpdateManyWithoutCharacterInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  book: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  chapter: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  verses: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const UserRoleFindFirstArgsSchema: z.ZodType<Prisma.UserRoleFindFirstArgs> = z.object({
  select: UserRoleSelectSchema.optional(),
  where: UserRoleWhereInputSchema.optional(),
  orderBy: z.union([ UserRoleOrderByWithRelationInputSchema.array(),UserRoleOrderByWithRelationInputSchema ]).optional(),
  cursor: UserRoleWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserRoleScalarFieldEnumSchema,UserRoleScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserRoleFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserRoleFindFirstOrThrowArgs> = z.object({
  select: UserRoleSelectSchema.optional(),
  where: UserRoleWhereInputSchema.optional(),
  orderBy: z.union([ UserRoleOrderByWithRelationInputSchema.array(),UserRoleOrderByWithRelationInputSchema ]).optional(),
  cursor: UserRoleWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserRoleScalarFieldEnumSchema,UserRoleScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserRoleFindManyArgsSchema: z.ZodType<Prisma.UserRoleFindManyArgs> = z.object({
  select: UserRoleSelectSchema.optional(),
  where: UserRoleWhereInputSchema.optional(),
  orderBy: z.union([ UserRoleOrderByWithRelationInputSchema.array(),UserRoleOrderByWithRelationInputSchema ]).optional(),
  cursor: UserRoleWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserRoleScalarFieldEnumSchema,UserRoleScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserRoleAggregateArgsSchema: z.ZodType<Prisma.UserRoleAggregateArgs> = z.object({
  where: UserRoleWhereInputSchema.optional(),
  orderBy: z.union([ UserRoleOrderByWithRelationInputSchema.array(),UserRoleOrderByWithRelationInputSchema ]).optional(),
  cursor: UserRoleWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserRoleGroupByArgsSchema: z.ZodType<Prisma.UserRoleGroupByArgs> = z.object({
  where: UserRoleWhereInputSchema.optional(),
  orderBy: z.union([ UserRoleOrderByWithAggregationInputSchema.array(),UserRoleOrderByWithAggregationInputSchema ]).optional(),
  by: UserRoleScalarFieldEnumSchema.array(),
  having: UserRoleScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserRoleFindUniqueArgsSchema: z.ZodType<Prisma.UserRoleFindUniqueArgs> = z.object({
  select: UserRoleSelectSchema.optional(),
  where: UserRoleWhereUniqueInputSchema,
}).strict() ;

export const UserRoleFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserRoleFindUniqueOrThrowArgs> = z.object({
  select: UserRoleSelectSchema.optional(),
  where: UserRoleWhereUniqueInputSchema,
}).strict() ;

export const CharacterFindFirstArgsSchema: z.ZodType<Prisma.CharacterFindFirstArgs> = z.object({
  select: CharacterSelectSchema.optional(),
  include: CharacterIncludeSchema.optional(),
  where: CharacterWhereInputSchema.optional(),
  orderBy: z.union([ CharacterOrderByWithRelationInputSchema.array(),CharacterOrderByWithRelationInputSchema ]).optional(),
  cursor: CharacterWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CharacterScalarFieldEnumSchema,CharacterScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CharacterFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CharacterFindFirstOrThrowArgs> = z.object({
  select: CharacterSelectSchema.optional(),
  include: CharacterIncludeSchema.optional(),
  where: CharacterWhereInputSchema.optional(),
  orderBy: z.union([ CharacterOrderByWithRelationInputSchema.array(),CharacterOrderByWithRelationInputSchema ]).optional(),
  cursor: CharacterWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CharacterScalarFieldEnumSchema,CharacterScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CharacterFindManyArgsSchema: z.ZodType<Prisma.CharacterFindManyArgs> = z.object({
  select: CharacterSelectSchema.optional(),
  include: CharacterIncludeSchema.optional(),
  where: CharacterWhereInputSchema.optional(),
  orderBy: z.union([ CharacterOrderByWithRelationInputSchema.array(),CharacterOrderByWithRelationInputSchema ]).optional(),
  cursor: CharacterWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CharacterScalarFieldEnumSchema,CharacterScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CharacterAggregateArgsSchema: z.ZodType<Prisma.CharacterAggregateArgs> = z.object({
  where: CharacterWhereInputSchema.optional(),
  orderBy: z.union([ CharacterOrderByWithRelationInputSchema.array(),CharacterOrderByWithRelationInputSchema ]).optional(),
  cursor: CharacterWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CharacterGroupByArgsSchema: z.ZodType<Prisma.CharacterGroupByArgs> = z.object({
  where: CharacterWhereInputSchema.optional(),
  orderBy: z.union([ CharacterOrderByWithAggregationInputSchema.array(),CharacterOrderByWithAggregationInputSchema ]).optional(),
  by: CharacterScalarFieldEnumSchema.array(),
  having: CharacterScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CharacterFindUniqueArgsSchema: z.ZodType<Prisma.CharacterFindUniqueArgs> = z.object({
  select: CharacterSelectSchema.optional(),
  include: CharacterIncludeSchema.optional(),
  where: CharacterWhereUniqueInputSchema,
}).strict() ;

export const CharacterFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CharacterFindUniqueOrThrowArgs> = z.object({
  select: CharacterSelectSchema.optional(),
  include: CharacterIncludeSchema.optional(),
  where: CharacterWhereUniqueInputSchema,
}).strict() ;

export const BiblePassageFindFirstArgsSchema: z.ZodType<Prisma.BiblePassageFindFirstArgs> = z.object({
  select: BiblePassageSelectSchema.optional(),
  include: BiblePassageIncludeSchema.optional(),
  where: BiblePassageWhereInputSchema.optional(),
  orderBy: z.union([ BiblePassageOrderByWithRelationInputSchema.array(),BiblePassageOrderByWithRelationInputSchema ]).optional(),
  cursor: BiblePassageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BiblePassageScalarFieldEnumSchema,BiblePassageScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const BiblePassageFindFirstOrThrowArgsSchema: z.ZodType<Prisma.BiblePassageFindFirstOrThrowArgs> = z.object({
  select: BiblePassageSelectSchema.optional(),
  include: BiblePassageIncludeSchema.optional(),
  where: BiblePassageWhereInputSchema.optional(),
  orderBy: z.union([ BiblePassageOrderByWithRelationInputSchema.array(),BiblePassageOrderByWithRelationInputSchema ]).optional(),
  cursor: BiblePassageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BiblePassageScalarFieldEnumSchema,BiblePassageScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const BiblePassageFindManyArgsSchema: z.ZodType<Prisma.BiblePassageFindManyArgs> = z.object({
  select: BiblePassageSelectSchema.optional(),
  include: BiblePassageIncludeSchema.optional(),
  where: BiblePassageWhereInputSchema.optional(),
  orderBy: z.union([ BiblePassageOrderByWithRelationInputSchema.array(),BiblePassageOrderByWithRelationInputSchema ]).optional(),
  cursor: BiblePassageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BiblePassageScalarFieldEnumSchema,BiblePassageScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const BiblePassageAggregateArgsSchema: z.ZodType<Prisma.BiblePassageAggregateArgs> = z.object({
  where: BiblePassageWhereInputSchema.optional(),
  orderBy: z.union([ BiblePassageOrderByWithRelationInputSchema.array(),BiblePassageOrderByWithRelationInputSchema ]).optional(),
  cursor: BiblePassageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const BiblePassageGroupByArgsSchema: z.ZodType<Prisma.BiblePassageGroupByArgs> = z.object({
  where: BiblePassageWhereInputSchema.optional(),
  orderBy: z.union([ BiblePassageOrderByWithAggregationInputSchema.array(),BiblePassageOrderByWithAggregationInputSchema ]).optional(),
  by: BiblePassageScalarFieldEnumSchema.array(),
  having: BiblePassageScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const BiblePassageFindUniqueArgsSchema: z.ZodType<Prisma.BiblePassageFindUniqueArgs> = z.object({
  select: BiblePassageSelectSchema.optional(),
  include: BiblePassageIncludeSchema.optional(),
  where: BiblePassageWhereUniqueInputSchema,
}).strict() ;

export const BiblePassageFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.BiblePassageFindUniqueOrThrowArgs> = z.object({
  select: BiblePassageSelectSchema.optional(),
  include: BiblePassageIncludeSchema.optional(),
  where: BiblePassageWhereUniqueInputSchema,
}).strict() ;

export const UserRoleCreateArgsSchema: z.ZodType<Prisma.UserRoleCreateArgs> = z.object({
  select: UserRoleSelectSchema.optional(),
  data: z.union([ UserRoleCreateInputSchema,UserRoleUncheckedCreateInputSchema ]),
}).strict() ;

export const UserRoleUpsertArgsSchema: z.ZodType<Prisma.UserRoleUpsertArgs> = z.object({
  select: UserRoleSelectSchema.optional(),
  where: UserRoleWhereUniqueInputSchema,
  create: z.union([ UserRoleCreateInputSchema,UserRoleUncheckedCreateInputSchema ]),
  update: z.union([ UserRoleUpdateInputSchema,UserRoleUncheckedUpdateInputSchema ]),
}).strict() ;

export const UserRoleCreateManyArgsSchema: z.ZodType<Prisma.UserRoleCreateManyArgs> = z.object({
  data: z.union([ UserRoleCreateManyInputSchema,UserRoleCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserRoleCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserRoleCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserRoleCreateManyInputSchema,UserRoleCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserRoleDeleteArgsSchema: z.ZodType<Prisma.UserRoleDeleteArgs> = z.object({
  select: UserRoleSelectSchema.optional(),
  where: UserRoleWhereUniqueInputSchema,
}).strict() ;

export const UserRoleUpdateArgsSchema: z.ZodType<Prisma.UserRoleUpdateArgs> = z.object({
  select: UserRoleSelectSchema.optional(),
  data: z.union([ UserRoleUpdateInputSchema,UserRoleUncheckedUpdateInputSchema ]),
  where: UserRoleWhereUniqueInputSchema,
}).strict() ;

export const UserRoleUpdateManyArgsSchema: z.ZodType<Prisma.UserRoleUpdateManyArgs> = z.object({
  data: z.union([ UserRoleUpdateManyMutationInputSchema,UserRoleUncheckedUpdateManyInputSchema ]),
  where: UserRoleWhereInputSchema.optional(),
}).strict() ;

export const UserRoleDeleteManyArgsSchema: z.ZodType<Prisma.UserRoleDeleteManyArgs> = z.object({
  where: UserRoleWhereInputSchema.optional(),
}).strict() ;

export const CharacterCreateArgsSchema: z.ZodType<Prisma.CharacterCreateArgs> = z.object({
  select: CharacterSelectSchema.optional(),
  include: CharacterIncludeSchema.optional(),
  data: z.union([ CharacterCreateInputSchema,CharacterUncheckedCreateInputSchema ]),
}).strict() ;

export const CharacterUpsertArgsSchema: z.ZodType<Prisma.CharacterUpsertArgs> = z.object({
  select: CharacterSelectSchema.optional(),
  include: CharacterIncludeSchema.optional(),
  where: CharacterWhereUniqueInputSchema,
  create: z.union([ CharacterCreateInputSchema,CharacterUncheckedCreateInputSchema ]),
  update: z.union([ CharacterUpdateInputSchema,CharacterUncheckedUpdateInputSchema ]),
}).strict() ;

export const CharacterCreateManyArgsSchema: z.ZodType<Prisma.CharacterCreateManyArgs> = z.object({
  data: z.union([ CharacterCreateManyInputSchema,CharacterCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CharacterCreateManyAndReturnArgsSchema: z.ZodType<Prisma.CharacterCreateManyAndReturnArgs> = z.object({
  data: z.union([ CharacterCreateManyInputSchema,CharacterCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CharacterDeleteArgsSchema: z.ZodType<Prisma.CharacterDeleteArgs> = z.object({
  select: CharacterSelectSchema.optional(),
  include: CharacterIncludeSchema.optional(),
  where: CharacterWhereUniqueInputSchema,
}).strict() ;

export const CharacterUpdateArgsSchema: z.ZodType<Prisma.CharacterUpdateArgs> = z.object({
  select: CharacterSelectSchema.optional(),
  include: CharacterIncludeSchema.optional(),
  data: z.union([ CharacterUpdateInputSchema,CharacterUncheckedUpdateInputSchema ]),
  where: CharacterWhereUniqueInputSchema,
}).strict() ;

export const CharacterUpdateManyArgsSchema: z.ZodType<Prisma.CharacterUpdateManyArgs> = z.object({
  data: z.union([ CharacterUpdateManyMutationInputSchema,CharacterUncheckedUpdateManyInputSchema ]),
  where: CharacterWhereInputSchema.optional(),
}).strict() ;

export const CharacterDeleteManyArgsSchema: z.ZodType<Prisma.CharacterDeleteManyArgs> = z.object({
  where: CharacterWhereInputSchema.optional(),
}).strict() ;

export const BiblePassageCreateArgsSchema: z.ZodType<Prisma.BiblePassageCreateArgs> = z.object({
  select: BiblePassageSelectSchema.optional(),
  include: BiblePassageIncludeSchema.optional(),
  data: z.union([ BiblePassageCreateInputSchema,BiblePassageUncheckedCreateInputSchema ]),
}).strict() ;

export const BiblePassageUpsertArgsSchema: z.ZodType<Prisma.BiblePassageUpsertArgs> = z.object({
  select: BiblePassageSelectSchema.optional(),
  include: BiblePassageIncludeSchema.optional(),
  where: BiblePassageWhereUniqueInputSchema,
  create: z.union([ BiblePassageCreateInputSchema,BiblePassageUncheckedCreateInputSchema ]),
  update: z.union([ BiblePassageUpdateInputSchema,BiblePassageUncheckedUpdateInputSchema ]),
}).strict() ;

export const BiblePassageCreateManyArgsSchema: z.ZodType<Prisma.BiblePassageCreateManyArgs> = z.object({
  data: z.union([ BiblePassageCreateManyInputSchema,BiblePassageCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const BiblePassageCreateManyAndReturnArgsSchema: z.ZodType<Prisma.BiblePassageCreateManyAndReturnArgs> = z.object({
  data: z.union([ BiblePassageCreateManyInputSchema,BiblePassageCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const BiblePassageDeleteArgsSchema: z.ZodType<Prisma.BiblePassageDeleteArgs> = z.object({
  select: BiblePassageSelectSchema.optional(),
  include: BiblePassageIncludeSchema.optional(),
  where: BiblePassageWhereUniqueInputSchema,
}).strict() ;

export const BiblePassageUpdateArgsSchema: z.ZodType<Prisma.BiblePassageUpdateArgs> = z.object({
  select: BiblePassageSelectSchema.optional(),
  include: BiblePassageIncludeSchema.optional(),
  data: z.union([ BiblePassageUpdateInputSchema,BiblePassageUncheckedUpdateInputSchema ]),
  where: BiblePassageWhereUniqueInputSchema,
}).strict() ;

export const BiblePassageUpdateManyArgsSchema: z.ZodType<Prisma.BiblePassageUpdateManyArgs> = z.object({
  data: z.union([ BiblePassageUpdateManyMutationInputSchema,BiblePassageUncheckedUpdateManyInputSchema ]),
  where: BiblePassageWhereInputSchema.optional(),
}).strict() ;

export const BiblePassageDeleteManyArgsSchema: z.ZodType<Prisma.BiblePassageDeleteManyArgs> = z.object({
  where: BiblePassageWhereInputSchema.optional(),
}).strict() ;