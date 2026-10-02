import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','email','passwordHash','role','createdAt']);

export const SessionScalarFieldEnumSchema = z.enum(['id','userId','expiresAt','createdAt']);

export const PersonScalarFieldEnumSchema = z.enum(['id','name','altNames','summary']);

export const ReignScalarFieldEnumSchema = z.enum(['personId','kingdom','predecessorId','successorId','relationToPredecessor']);

export const MinistryScalarFieldEnumSchema = z.enum(['personId','audience','hasBook']);

export const DatingScalarFieldEnumSchema = z.enum(['id','personId','role','position','label','spanFrom','spanTo','approx','coregencyFrom','confidence','notes']);

export const EvidenceScalarFieldEnumSchema = z.enum(['id','datingId','position','kind','book','fromChapter','fromVerse','toChapter','toVerse','note','artifact','contemporaryIds']);

export const SourceScalarFieldEnumSchema = z.enum(['id','author','title','year','kind','publisher','url']);

export const CitationScalarFieldEnumSchema = z.enum(['id','datingId','sourceId','pages']);

export const PassageScalarFieldEnumSchema = z.enum(['id','personId','position','book','fromChapter','fromVerse','toChapter','toVerse','kind','note']);

export const FamilyMemberScalarFieldEnumSchema = z.enum(['id','personId','position','relation','name','relatedPersonId']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const RoleSchema = z.enum(['Admin','Staff']);

export type RoleType = `${z.infer<typeof RoleSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  /**
   * null for ordinary users; set Admin/Staff directly in the database
   */
  role: RoleSchema.nullable(),
  id: z.uuid(),
  email: z.string(),
  /**
   * scrypt hash with its salt, see src/lib/server/password.ts; never the password itself
   */
  passwordHash: z.string(),
  createdAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// SESSION SCHEMA
/////////////////////////////////////////

export const SessionSchema = z.object({
  /**
   * SHA-256 of the token in the session cookie, so a leaked table can't be used to log in
   */
  id: z.string(),
  userId: z.string(),
  expiresAt: z.coerce.date(),
  createdAt: z.coerce.date(),
})

export type Session = z.infer<typeof SessionSchema>

/////////////////////////////////////////
// PERSON SCHEMA
/////////////////////////////////////////

export const PersonSchema = z.object({
  id: z.string(),
  name: z.string(),
  altNames: z.string().array(),
  summary: z.string(),
})

export type Person = z.infer<typeof PersonSchema>

/////////////////////////////////////////
// REIGN SCHEMA
/////////////////////////////////////////

export const ReignSchema = z.object({
  personId: z.string(),
  kingdom: z.string(),
  predecessorId: z.string().nullable(),
  successorId: z.string().nullable(),
  relationToPredecessor: z.string().nullable(),
})

export type Reign = z.infer<typeof ReignSchema>

/////////////////////////////////////////
// MINISTRY SCHEMA
/////////////////////////////////////////

export const MinistrySchema = z.object({
  personId: z.string(),
  audience: z.string().array(),
  hasBook: z.boolean(),
})

export type Ministry = z.infer<typeof MinistrySchema>

/////////////////////////////////////////
// DATING SCHEMA
/////////////////////////////////////////

/**
 * One row per dating: position 0 is the primary dating for that role, later ones are alternatives
 */
export const DatingSchema = z.object({
  id: z.string(),
  personId: z.string(),
  role: z.string(),
  position: z.number().int(),
  label: z.string().nullable(),
  spanFrom: z.number().int(),
  spanTo: z.number().int(),
  approx: z.boolean(),
  coregencyFrom: z.number().int().nullable(),
  confidence: z.string(),
  notes: z.string().nullable(),
})

export type Dating = z.infer<typeof DatingSchema>

/////////////////////////////////////////
// EVIDENCE SCHEMA
/////////////////////////////////////////

export const EvidenceSchema = z.object({
  id: z.string(),
  datingId: z.string(),
  position: z.number().int(),
  kind: z.string(),
  book: z.string().nullable(),
  fromChapter: z.number().int().nullable(),
  fromVerse: z.number().int().nullable(),
  toChapter: z.number().int().nullable(),
  toVerse: z.number().int().nullable(),
  note: z.string().nullable(),
  artifact: z.string().nullable(),
  contemporaryIds: z.string().array(),
})

export type Evidence = z.infer<typeof EvidenceSchema>

/////////////////////////////////////////
// SOURCE SCHEMA
/////////////////////////////////////////

export const SourceSchema = z.object({
  id: z.string(),
  author: z.string(),
  title: z.string(),
  year: z.number().int(),
  kind: z.string(),
  publisher: z.string().nullable(),
  url: z.string().nullable(),
})

export type Source = z.infer<typeof SourceSchema>

/////////////////////////////////////////
// CITATION SCHEMA
/////////////////////////////////////////

export const CitationSchema = z.object({
  id: z.string(),
  datingId: z.string(),
  sourceId: z.string(),
  pages: z.string().nullable(),
})

export type Citation = z.infer<typeof CitationSchema>

/////////////////////////////////////////
// PASSAGE SCHEMA
/////////////////////////////////////////

export const PassageSchema = z.object({
  id: z.string(),
  personId: z.string(),
  position: z.number().int(),
  book: z.string(),
  fromChapter: z.number().int(),
  fromVerse: z.number().int().nullable(),
  toChapter: z.number().int().nullable(),
  toVerse: z.number().int().nullable(),
  kind: z.string(),
  note: z.string().nullable(),
})

export type Passage = z.infer<typeof PassageSchema>

/////////////////////////////////////////
// FAMILY MEMBER SCHEMA
/////////////////////////////////////////

export const FamilyMemberSchema = z.object({
  id: z.string(),
  personId: z.string(),
  position: z.number().int(),
  relation: z.string(),
  name: z.string(),
  relatedPersonId: z.string().nullable(),
})

export type FamilyMember = z.infer<typeof FamilyMemberSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  sessions: z.union([z.boolean(),z.lazy(() => SessionFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  sessions: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  email: z.boolean().optional(),
  passwordHash: z.boolean().optional(),
  role: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  sessions: z.union([z.boolean(),z.lazy(() => SessionFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// SESSION
//------------------------------------------------------

export const SessionIncludeSchema: z.ZodType<Prisma.SessionInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict();

export const SessionArgsSchema: z.ZodType<Prisma.SessionDefaultArgs> = z.object({
  select: z.lazy(() => SessionSelectSchema).optional(),
  include: z.lazy(() => SessionIncludeSchema).optional(),
}).strict();

export const SessionSelectSchema: z.ZodType<Prisma.SessionSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  expiresAt: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// PERSON
//------------------------------------------------------

export const PersonIncludeSchema: z.ZodType<Prisma.PersonInclude> = z.object({
  reign: z.union([z.boolean(),z.lazy(() => ReignArgsSchema)]).optional(),
  ministry: z.union([z.boolean(),z.lazy(() => MinistryArgsSchema)]).optional(),
  datings: z.union([z.boolean(),z.lazy(() => DatingFindManyArgsSchema)]).optional(),
  family: z.union([z.boolean(),z.lazy(() => FamilyMemberFindManyArgsSchema)]).optional(),
  passages: z.union([z.boolean(),z.lazy(() => PassageFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => PersonCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const PersonArgsSchema: z.ZodType<Prisma.PersonDefaultArgs> = z.object({
  select: z.lazy(() => PersonSelectSchema).optional(),
  include: z.lazy(() => PersonIncludeSchema).optional(),
}).strict();

export const PersonCountOutputTypeArgsSchema: z.ZodType<Prisma.PersonCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => PersonCountOutputTypeSelectSchema).nullish(),
}).strict();

export const PersonCountOutputTypeSelectSchema: z.ZodType<Prisma.PersonCountOutputTypeSelect> = z.object({
  datings: z.boolean().optional(),
  family: z.boolean().optional(),
  passages: z.boolean().optional(),
}).strict();

export const PersonSelectSchema: z.ZodType<Prisma.PersonSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  altNames: z.boolean().optional(),
  summary: z.boolean().optional(),
  reign: z.union([z.boolean(),z.lazy(() => ReignArgsSchema)]).optional(),
  ministry: z.union([z.boolean(),z.lazy(() => MinistryArgsSchema)]).optional(),
  datings: z.union([z.boolean(),z.lazy(() => DatingFindManyArgsSchema)]).optional(),
  family: z.union([z.boolean(),z.lazy(() => FamilyMemberFindManyArgsSchema)]).optional(),
  passages: z.union([z.boolean(),z.lazy(() => PassageFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => PersonCountOutputTypeArgsSchema)]).optional(),
}).strict()

// REIGN
//------------------------------------------------------

export const ReignIncludeSchema: z.ZodType<Prisma.ReignInclude> = z.object({
  person: z.union([z.boolean(),z.lazy(() => PersonArgsSchema)]).optional(),
}).strict();

export const ReignArgsSchema: z.ZodType<Prisma.ReignDefaultArgs> = z.object({
  select: z.lazy(() => ReignSelectSchema).optional(),
  include: z.lazy(() => ReignIncludeSchema).optional(),
}).strict();

export const ReignSelectSchema: z.ZodType<Prisma.ReignSelect> = z.object({
  personId: z.boolean().optional(),
  kingdom: z.boolean().optional(),
  predecessorId: z.boolean().optional(),
  successorId: z.boolean().optional(),
  relationToPredecessor: z.boolean().optional(),
  person: z.union([z.boolean(),z.lazy(() => PersonArgsSchema)]).optional(),
}).strict()

// MINISTRY
//------------------------------------------------------

export const MinistryIncludeSchema: z.ZodType<Prisma.MinistryInclude> = z.object({
  person: z.union([z.boolean(),z.lazy(() => PersonArgsSchema)]).optional(),
}).strict();

export const MinistryArgsSchema: z.ZodType<Prisma.MinistryDefaultArgs> = z.object({
  select: z.lazy(() => MinistrySelectSchema).optional(),
  include: z.lazy(() => MinistryIncludeSchema).optional(),
}).strict();

export const MinistrySelectSchema: z.ZodType<Prisma.MinistrySelect> = z.object({
  personId: z.boolean().optional(),
  audience: z.boolean().optional(),
  hasBook: z.boolean().optional(),
  person: z.union([z.boolean(),z.lazy(() => PersonArgsSchema)]).optional(),
}).strict()

// DATING
//------------------------------------------------------

export const DatingIncludeSchema: z.ZodType<Prisma.DatingInclude> = z.object({
  person: z.union([z.boolean(),z.lazy(() => PersonArgsSchema)]).optional(),
  evidence: z.union([z.boolean(),z.lazy(() => EvidenceFindManyArgsSchema)]).optional(),
  citations: z.union([z.boolean(),z.lazy(() => CitationFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => DatingCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const DatingArgsSchema: z.ZodType<Prisma.DatingDefaultArgs> = z.object({
  select: z.lazy(() => DatingSelectSchema).optional(),
  include: z.lazy(() => DatingIncludeSchema).optional(),
}).strict();

export const DatingCountOutputTypeArgsSchema: z.ZodType<Prisma.DatingCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => DatingCountOutputTypeSelectSchema).nullish(),
}).strict();

export const DatingCountOutputTypeSelectSchema: z.ZodType<Prisma.DatingCountOutputTypeSelect> = z.object({
  evidence: z.boolean().optional(),
  citations: z.boolean().optional(),
}).strict();

export const DatingSelectSchema: z.ZodType<Prisma.DatingSelect> = z.object({
  id: z.boolean().optional(),
  personId: z.boolean().optional(),
  role: z.boolean().optional(),
  position: z.boolean().optional(),
  label: z.boolean().optional(),
  spanFrom: z.boolean().optional(),
  spanTo: z.boolean().optional(),
  approx: z.boolean().optional(),
  coregencyFrom: z.boolean().optional(),
  confidence: z.boolean().optional(),
  notes: z.boolean().optional(),
  person: z.union([z.boolean(),z.lazy(() => PersonArgsSchema)]).optional(),
  evidence: z.union([z.boolean(),z.lazy(() => EvidenceFindManyArgsSchema)]).optional(),
  citations: z.union([z.boolean(),z.lazy(() => CitationFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => DatingCountOutputTypeArgsSchema)]).optional(),
}).strict()

// EVIDENCE
//------------------------------------------------------

export const EvidenceIncludeSchema: z.ZodType<Prisma.EvidenceInclude> = z.object({
  dating: z.union([z.boolean(),z.lazy(() => DatingArgsSchema)]).optional(),
}).strict();

export const EvidenceArgsSchema: z.ZodType<Prisma.EvidenceDefaultArgs> = z.object({
  select: z.lazy(() => EvidenceSelectSchema).optional(),
  include: z.lazy(() => EvidenceIncludeSchema).optional(),
}).strict();

export const EvidenceSelectSchema: z.ZodType<Prisma.EvidenceSelect> = z.object({
  id: z.boolean().optional(),
  datingId: z.boolean().optional(),
  position: z.boolean().optional(),
  kind: z.boolean().optional(),
  book: z.boolean().optional(),
  fromChapter: z.boolean().optional(),
  fromVerse: z.boolean().optional(),
  toChapter: z.boolean().optional(),
  toVerse: z.boolean().optional(),
  note: z.boolean().optional(),
  artifact: z.boolean().optional(),
  contemporaryIds: z.boolean().optional(),
  dating: z.union([z.boolean(),z.lazy(() => DatingArgsSchema)]).optional(),
}).strict()

// SOURCE
//------------------------------------------------------

export const SourceIncludeSchema: z.ZodType<Prisma.SourceInclude> = z.object({
  citations: z.union([z.boolean(),z.lazy(() => CitationFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => SourceCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const SourceArgsSchema: z.ZodType<Prisma.SourceDefaultArgs> = z.object({
  select: z.lazy(() => SourceSelectSchema).optional(),
  include: z.lazy(() => SourceIncludeSchema).optional(),
}).strict();

export const SourceCountOutputTypeArgsSchema: z.ZodType<Prisma.SourceCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => SourceCountOutputTypeSelectSchema).nullish(),
}).strict();

export const SourceCountOutputTypeSelectSchema: z.ZodType<Prisma.SourceCountOutputTypeSelect> = z.object({
  citations: z.boolean().optional(),
}).strict();

export const SourceSelectSchema: z.ZodType<Prisma.SourceSelect> = z.object({
  id: z.boolean().optional(),
  author: z.boolean().optional(),
  title: z.boolean().optional(),
  year: z.boolean().optional(),
  kind: z.boolean().optional(),
  publisher: z.boolean().optional(),
  url: z.boolean().optional(),
  citations: z.union([z.boolean(),z.lazy(() => CitationFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => SourceCountOutputTypeArgsSchema)]).optional(),
}).strict()

// CITATION
//------------------------------------------------------

export const CitationIncludeSchema: z.ZodType<Prisma.CitationInclude> = z.object({
  dating: z.union([z.boolean(),z.lazy(() => DatingArgsSchema)]).optional(),
  source: z.union([z.boolean(),z.lazy(() => SourceArgsSchema)]).optional(),
}).strict();

export const CitationArgsSchema: z.ZodType<Prisma.CitationDefaultArgs> = z.object({
  select: z.lazy(() => CitationSelectSchema).optional(),
  include: z.lazy(() => CitationIncludeSchema).optional(),
}).strict();

export const CitationSelectSchema: z.ZodType<Prisma.CitationSelect> = z.object({
  id: z.boolean().optional(),
  datingId: z.boolean().optional(),
  sourceId: z.boolean().optional(),
  pages: z.boolean().optional(),
  dating: z.union([z.boolean(),z.lazy(() => DatingArgsSchema)]).optional(),
  source: z.union([z.boolean(),z.lazy(() => SourceArgsSchema)]).optional(),
}).strict()

// PASSAGE
//------------------------------------------------------

export const PassageIncludeSchema: z.ZodType<Prisma.PassageInclude> = z.object({
  person: z.union([z.boolean(),z.lazy(() => PersonArgsSchema)]).optional(),
}).strict();

export const PassageArgsSchema: z.ZodType<Prisma.PassageDefaultArgs> = z.object({
  select: z.lazy(() => PassageSelectSchema).optional(),
  include: z.lazy(() => PassageIncludeSchema).optional(),
}).strict();

export const PassageSelectSchema: z.ZodType<Prisma.PassageSelect> = z.object({
  id: z.boolean().optional(),
  personId: z.boolean().optional(),
  position: z.boolean().optional(),
  book: z.boolean().optional(),
  fromChapter: z.boolean().optional(),
  fromVerse: z.boolean().optional(),
  toChapter: z.boolean().optional(),
  toVerse: z.boolean().optional(),
  kind: z.boolean().optional(),
  note: z.boolean().optional(),
  person: z.union([z.boolean(),z.lazy(() => PersonArgsSchema)]).optional(),
}).strict()

// FAMILY MEMBER
//------------------------------------------------------

export const FamilyMemberIncludeSchema: z.ZodType<Prisma.FamilyMemberInclude> = z.object({
  person: z.union([z.boolean(),z.lazy(() => PersonArgsSchema)]).optional(),
}).strict();

export const FamilyMemberArgsSchema: z.ZodType<Prisma.FamilyMemberDefaultArgs> = z.object({
  select: z.lazy(() => FamilyMemberSelectSchema).optional(),
  include: z.lazy(() => FamilyMemberIncludeSchema).optional(),
}).strict();

export const FamilyMemberSelectSchema: z.ZodType<Prisma.FamilyMemberSelect> = z.object({
  id: z.boolean().optional(),
  personId: z.boolean().optional(),
  position: z.boolean().optional(),
  relation: z.boolean().optional(),
  name: z.boolean().optional(),
  relatedPersonId: z.boolean().optional(),
  person: z.union([z.boolean(),z.lazy(() => PersonArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  passwordHash: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumRoleNullableFilterSchema), z.lazy(() => RoleSchema) ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  sessions: z.lazy(() => SessionListRelationFilterSchema).optional(),
});

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  passwordHash: z.lazy(() => SortOrderSchema).optional(),
  role: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  sessions: z.lazy(() => SessionOrderByRelationAggregateInputSchema).optional(),
});

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.uuid(),
    email: z.string(),
  }),
  z.object({
    id: z.uuid(),
  }),
  z.object({
    email: z.string(),
  }),
])
.and(z.strictObject({
  id: z.uuid().optional(),
  email: z.string().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  passwordHash: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumRoleNullableFilterSchema), z.lazy(() => RoleSchema) ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  sessions: z.lazy(() => SessionListRelationFilterSchema).optional(),
}));

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  passwordHash: z.lazy(() => SortOrderSchema).optional(),
  role: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional(),
});

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema), z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema), z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  passwordHash: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumRoleNullableWithAggregatesFilterSchema), z.lazy(() => RoleSchema) ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
});

export const SessionWhereInputSchema: z.ZodType<Prisma.SessionWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => SessionWhereInputSchema), z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionWhereInputSchema), z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
});

export const SessionOrderByWithRelationInputSchema: z.ZodType<Prisma.SessionOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
});

export const SessionWhereUniqueInputSchema: z.ZodType<Prisma.SessionWhereUniqueInput> = z.object({
  id: z.string(),
})
.and(z.strictObject({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => SessionWhereInputSchema), z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionWhereInputSchema), z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
}));

export const SessionOrderByWithAggregationInputSchema: z.ZodType<Prisma.SessionOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => SessionCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => SessionMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => SessionMinOrderByAggregateInputSchema).optional(),
});

export const SessionScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.SessionScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => SessionScalarWhereWithAggregatesInputSchema), z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionScalarWhereWithAggregatesInputSchema), z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
});

export const PersonWhereInputSchema: z.ZodType<Prisma.PersonWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => PersonWhereInputSchema), z.lazy(() => PersonWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PersonWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PersonWhereInputSchema), z.lazy(() => PersonWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  altNames: z.lazy(() => StringNullableListFilterSchema).optional(),
  summary: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  reign: z.union([ z.lazy(() => ReignNullableScalarRelationFilterSchema), z.lazy(() => ReignWhereInputSchema) ]).optional().nullable(),
  ministry: z.union([ z.lazy(() => MinistryNullableScalarRelationFilterSchema), z.lazy(() => MinistryWhereInputSchema) ]).optional().nullable(),
  datings: z.lazy(() => DatingListRelationFilterSchema).optional(),
  family: z.lazy(() => FamilyMemberListRelationFilterSchema).optional(),
  passages: z.lazy(() => PassageListRelationFilterSchema).optional(),
});

export const PersonOrderByWithRelationInputSchema: z.ZodType<Prisma.PersonOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  altNames: z.lazy(() => SortOrderSchema).optional(),
  summary: z.lazy(() => SortOrderSchema).optional(),
  reign: z.lazy(() => ReignOrderByWithRelationInputSchema).optional(),
  ministry: z.lazy(() => MinistryOrderByWithRelationInputSchema).optional(),
  datings: z.lazy(() => DatingOrderByRelationAggregateInputSchema).optional(),
  family: z.lazy(() => FamilyMemberOrderByRelationAggregateInputSchema).optional(),
  passages: z.lazy(() => PassageOrderByRelationAggregateInputSchema).optional(),
});

export const PersonWhereUniqueInputSchema: z.ZodType<Prisma.PersonWhereUniqueInput> = z.object({
  id: z.string(),
})
.and(z.strictObject({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => PersonWhereInputSchema), z.lazy(() => PersonWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PersonWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PersonWhereInputSchema), z.lazy(() => PersonWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  altNames: z.lazy(() => StringNullableListFilterSchema).optional(),
  summary: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  reign: z.union([ z.lazy(() => ReignNullableScalarRelationFilterSchema), z.lazy(() => ReignWhereInputSchema) ]).optional().nullable(),
  ministry: z.union([ z.lazy(() => MinistryNullableScalarRelationFilterSchema), z.lazy(() => MinistryWhereInputSchema) ]).optional().nullable(),
  datings: z.lazy(() => DatingListRelationFilterSchema).optional(),
  family: z.lazy(() => FamilyMemberListRelationFilterSchema).optional(),
  passages: z.lazy(() => PassageListRelationFilterSchema).optional(),
}));

export const PersonOrderByWithAggregationInputSchema: z.ZodType<Prisma.PersonOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  altNames: z.lazy(() => SortOrderSchema).optional(),
  summary: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => PersonCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PersonMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PersonMinOrderByAggregateInputSchema).optional(),
});

export const PersonScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PersonScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => PersonScalarWhereWithAggregatesInputSchema), z.lazy(() => PersonScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PersonScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PersonScalarWhereWithAggregatesInputSchema), z.lazy(() => PersonScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  altNames: z.lazy(() => StringNullableListFilterSchema).optional(),
  summary: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
});

export const ReignWhereInputSchema: z.ZodType<Prisma.ReignWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ReignWhereInputSchema), z.lazy(() => ReignWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ReignWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ReignWhereInputSchema), z.lazy(() => ReignWhereInputSchema).array() ]).optional(),
  personId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  kingdom: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  predecessorId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  successorId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  relationToPredecessor: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  person: z.union([ z.lazy(() => PersonScalarRelationFilterSchema), z.lazy(() => PersonWhereInputSchema) ]).optional(),
});

export const ReignOrderByWithRelationInputSchema: z.ZodType<Prisma.ReignOrderByWithRelationInput> = z.strictObject({
  personId: z.lazy(() => SortOrderSchema).optional(),
  kingdom: z.lazy(() => SortOrderSchema).optional(),
  predecessorId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  successorId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  relationToPredecessor: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  person: z.lazy(() => PersonOrderByWithRelationInputSchema).optional(),
});

export const ReignWhereUniqueInputSchema: z.ZodType<Prisma.ReignWhereUniqueInput> = z.object({
  personId: z.string(),
})
.and(z.strictObject({
  personId: z.string().optional(),
  AND: z.union([ z.lazy(() => ReignWhereInputSchema), z.lazy(() => ReignWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ReignWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ReignWhereInputSchema), z.lazy(() => ReignWhereInputSchema).array() ]).optional(),
  kingdom: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  predecessorId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  successorId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  relationToPredecessor: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  person: z.union([ z.lazy(() => PersonScalarRelationFilterSchema), z.lazy(() => PersonWhereInputSchema) ]).optional(),
}));

export const ReignOrderByWithAggregationInputSchema: z.ZodType<Prisma.ReignOrderByWithAggregationInput> = z.strictObject({
  personId: z.lazy(() => SortOrderSchema).optional(),
  kingdom: z.lazy(() => SortOrderSchema).optional(),
  predecessorId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  successorId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  relationToPredecessor: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => ReignCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ReignMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ReignMinOrderByAggregateInputSchema).optional(),
});

export const ReignScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ReignScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ReignScalarWhereWithAggregatesInputSchema), z.lazy(() => ReignScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ReignScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ReignScalarWhereWithAggregatesInputSchema), z.lazy(() => ReignScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  personId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  kingdom: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  predecessorId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  successorId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  relationToPredecessor: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
});

export const MinistryWhereInputSchema: z.ZodType<Prisma.MinistryWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => MinistryWhereInputSchema), z.lazy(() => MinistryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MinistryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MinistryWhereInputSchema), z.lazy(() => MinistryWhereInputSchema).array() ]).optional(),
  personId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  audience: z.lazy(() => StringNullableListFilterSchema).optional(),
  hasBook: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  person: z.union([ z.lazy(() => PersonScalarRelationFilterSchema), z.lazy(() => PersonWhereInputSchema) ]).optional(),
});

export const MinistryOrderByWithRelationInputSchema: z.ZodType<Prisma.MinistryOrderByWithRelationInput> = z.strictObject({
  personId: z.lazy(() => SortOrderSchema).optional(),
  audience: z.lazy(() => SortOrderSchema).optional(),
  hasBook: z.lazy(() => SortOrderSchema).optional(),
  person: z.lazy(() => PersonOrderByWithRelationInputSchema).optional(),
});

export const MinistryWhereUniqueInputSchema: z.ZodType<Prisma.MinistryWhereUniqueInput> = z.object({
  personId: z.string(),
})
.and(z.strictObject({
  personId: z.string().optional(),
  AND: z.union([ z.lazy(() => MinistryWhereInputSchema), z.lazy(() => MinistryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MinistryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MinistryWhereInputSchema), z.lazy(() => MinistryWhereInputSchema).array() ]).optional(),
  audience: z.lazy(() => StringNullableListFilterSchema).optional(),
  hasBook: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  person: z.union([ z.lazy(() => PersonScalarRelationFilterSchema), z.lazy(() => PersonWhereInputSchema) ]).optional(),
}));

export const MinistryOrderByWithAggregationInputSchema: z.ZodType<Prisma.MinistryOrderByWithAggregationInput> = z.strictObject({
  personId: z.lazy(() => SortOrderSchema).optional(),
  audience: z.lazy(() => SortOrderSchema).optional(),
  hasBook: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => MinistryCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => MinistryMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => MinistryMinOrderByAggregateInputSchema).optional(),
});

export const MinistryScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.MinistryScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => MinistryScalarWhereWithAggregatesInputSchema), z.lazy(() => MinistryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => MinistryScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MinistryScalarWhereWithAggregatesInputSchema), z.lazy(() => MinistryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  personId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  audience: z.lazy(() => StringNullableListFilterSchema).optional(),
  hasBook: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean() ]).optional(),
});

export const DatingWhereInputSchema: z.ZodType<Prisma.DatingWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => DatingWhereInputSchema), z.lazy(() => DatingWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DatingWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DatingWhereInputSchema), z.lazy(() => DatingWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  personId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  role: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  position: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  label: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  spanFrom: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  spanTo: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  approx: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  coregencyFrom: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  confidence: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  notes: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  person: z.union([ z.lazy(() => PersonScalarRelationFilterSchema), z.lazy(() => PersonWhereInputSchema) ]).optional(),
  evidence: z.lazy(() => EvidenceListRelationFilterSchema).optional(),
  citations: z.lazy(() => CitationListRelationFilterSchema).optional(),
});

export const DatingOrderByWithRelationInputSchema: z.ZodType<Prisma.DatingOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  personId: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  position: z.lazy(() => SortOrderSchema).optional(),
  label: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  spanFrom: z.lazy(() => SortOrderSchema).optional(),
  spanTo: z.lazy(() => SortOrderSchema).optional(),
  approx: z.lazy(() => SortOrderSchema).optional(),
  coregencyFrom: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  confidence: z.lazy(() => SortOrderSchema).optional(),
  notes: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  person: z.lazy(() => PersonOrderByWithRelationInputSchema).optional(),
  evidence: z.lazy(() => EvidenceOrderByRelationAggregateInputSchema).optional(),
  citations: z.lazy(() => CitationOrderByRelationAggregateInputSchema).optional(),
});

export const DatingWhereUniqueInputSchema: z.ZodType<Prisma.DatingWhereUniqueInput> = z.union([
  z.object({
    id: z.string(),
    personId_role_position: z.lazy(() => DatingPersonIdRolePositionCompoundUniqueInputSchema),
  }),
  z.object({
    id: z.string(),
  }),
  z.object({
    personId_role_position: z.lazy(() => DatingPersonIdRolePositionCompoundUniqueInputSchema),
  }),
])
.and(z.strictObject({
  id: z.string().optional(),
  personId_role_position: z.lazy(() => DatingPersonIdRolePositionCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => DatingWhereInputSchema), z.lazy(() => DatingWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DatingWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DatingWhereInputSchema), z.lazy(() => DatingWhereInputSchema).array() ]).optional(),
  personId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  role: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  position: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  label: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  spanFrom: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  spanTo: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  approx: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  coregencyFrom: z.union([ z.lazy(() => IntNullableFilterSchema), z.number().int() ]).optional().nullable(),
  confidence: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  notes: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  person: z.union([ z.lazy(() => PersonScalarRelationFilterSchema), z.lazy(() => PersonWhereInputSchema) ]).optional(),
  evidence: z.lazy(() => EvidenceListRelationFilterSchema).optional(),
  citations: z.lazy(() => CitationListRelationFilterSchema).optional(),
}));

export const DatingOrderByWithAggregationInputSchema: z.ZodType<Prisma.DatingOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  personId: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  position: z.lazy(() => SortOrderSchema).optional(),
  label: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  spanFrom: z.lazy(() => SortOrderSchema).optional(),
  spanTo: z.lazy(() => SortOrderSchema).optional(),
  approx: z.lazy(() => SortOrderSchema).optional(),
  coregencyFrom: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  confidence: z.lazy(() => SortOrderSchema).optional(),
  notes: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => DatingCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => DatingAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => DatingMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => DatingMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => DatingSumOrderByAggregateInputSchema).optional(),
});

export const DatingScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.DatingScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => DatingScalarWhereWithAggregatesInputSchema), z.lazy(() => DatingScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => DatingScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DatingScalarWhereWithAggregatesInputSchema), z.lazy(() => DatingScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  personId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  role: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  position: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  label: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  spanFrom: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  spanTo: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  approx: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean() ]).optional(),
  coregencyFrom: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  confidence: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  notes: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
});

export const EvidenceWhereInputSchema: z.ZodType<Prisma.EvidenceWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => EvidenceWhereInputSchema), z.lazy(() => EvidenceWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvidenceWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvidenceWhereInputSchema), z.lazy(() => EvidenceWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  datingId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  position: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  kind: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  book: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  fromChapter: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  fromVerse: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  toChapter: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  toVerse: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  note: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  artifact: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  contemporaryIds: z.lazy(() => StringNullableListFilterSchema).optional(),
  dating: z.union([ z.lazy(() => DatingScalarRelationFilterSchema), z.lazy(() => DatingWhereInputSchema) ]).optional(),
});

export const EvidenceOrderByWithRelationInputSchema: z.ZodType<Prisma.EvidenceOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  datingId: z.lazy(() => SortOrderSchema).optional(),
  position: z.lazy(() => SortOrderSchema).optional(),
  kind: z.lazy(() => SortOrderSchema).optional(),
  book: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  fromChapter: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  fromVerse: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  toChapter: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  toVerse: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  note: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  artifact: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  contemporaryIds: z.lazy(() => SortOrderSchema).optional(),
  dating: z.lazy(() => DatingOrderByWithRelationInputSchema).optional(),
});

export const EvidenceWhereUniqueInputSchema: z.ZodType<Prisma.EvidenceWhereUniqueInput> = z.object({
  id: z.string(),
})
.and(z.strictObject({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => EvidenceWhereInputSchema), z.lazy(() => EvidenceWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvidenceWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvidenceWhereInputSchema), z.lazy(() => EvidenceWhereInputSchema).array() ]).optional(),
  datingId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  position: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  kind: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  book: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  fromChapter: z.union([ z.lazy(() => IntNullableFilterSchema), z.number().int() ]).optional().nullable(),
  fromVerse: z.union([ z.lazy(() => IntNullableFilterSchema), z.number().int() ]).optional().nullable(),
  toChapter: z.union([ z.lazy(() => IntNullableFilterSchema), z.number().int() ]).optional().nullable(),
  toVerse: z.union([ z.lazy(() => IntNullableFilterSchema), z.number().int() ]).optional().nullable(),
  note: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  artifact: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  contemporaryIds: z.lazy(() => StringNullableListFilterSchema).optional(),
  dating: z.union([ z.lazy(() => DatingScalarRelationFilterSchema), z.lazy(() => DatingWhereInputSchema) ]).optional(),
}));

export const EvidenceOrderByWithAggregationInputSchema: z.ZodType<Prisma.EvidenceOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  datingId: z.lazy(() => SortOrderSchema).optional(),
  position: z.lazy(() => SortOrderSchema).optional(),
  kind: z.lazy(() => SortOrderSchema).optional(),
  book: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  fromChapter: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  fromVerse: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  toChapter: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  toVerse: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  note: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  artifact: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  contemporaryIds: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => EvidenceCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => EvidenceAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => EvidenceMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => EvidenceMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => EvidenceSumOrderByAggregateInputSchema).optional(),
});

export const EvidenceScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.EvidenceScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => EvidenceScalarWhereWithAggregatesInputSchema), z.lazy(() => EvidenceScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvidenceScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvidenceScalarWhereWithAggregatesInputSchema), z.lazy(() => EvidenceScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  datingId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  position: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  kind: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  book: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  fromChapter: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  fromVerse: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  toChapter: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  toVerse: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  note: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  artifact: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  contemporaryIds: z.lazy(() => StringNullableListFilterSchema).optional(),
});

export const SourceWhereInputSchema: z.ZodType<Prisma.SourceWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => SourceWhereInputSchema), z.lazy(() => SourceWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SourceWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SourceWhereInputSchema), z.lazy(() => SourceWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  author: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  year: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  kind: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  publisher: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  url: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  citations: z.lazy(() => CitationListRelationFilterSchema).optional(),
});

export const SourceOrderByWithRelationInputSchema: z.ZodType<Prisma.SourceOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  author: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  year: z.lazy(() => SortOrderSchema).optional(),
  kind: z.lazy(() => SortOrderSchema).optional(),
  publisher: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  url: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  citations: z.lazy(() => CitationOrderByRelationAggregateInputSchema).optional(),
});

export const SourceWhereUniqueInputSchema: z.ZodType<Prisma.SourceWhereUniqueInput> = z.object({
  id: z.string(),
})
.and(z.strictObject({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => SourceWhereInputSchema), z.lazy(() => SourceWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SourceWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SourceWhereInputSchema), z.lazy(() => SourceWhereInputSchema).array() ]).optional(),
  author: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  year: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  kind: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  publisher: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  url: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  citations: z.lazy(() => CitationListRelationFilterSchema).optional(),
}));

export const SourceOrderByWithAggregationInputSchema: z.ZodType<Prisma.SourceOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  author: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  year: z.lazy(() => SortOrderSchema).optional(),
  kind: z.lazy(() => SortOrderSchema).optional(),
  publisher: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  url: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => SourceCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => SourceAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => SourceMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => SourceMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => SourceSumOrderByAggregateInputSchema).optional(),
});

export const SourceScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.SourceScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => SourceScalarWhereWithAggregatesInputSchema), z.lazy(() => SourceScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => SourceScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SourceScalarWhereWithAggregatesInputSchema), z.lazy(() => SourceScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  author: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  year: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  kind: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  publisher: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  url: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
});

export const CitationWhereInputSchema: z.ZodType<Prisma.CitationWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => CitationWhereInputSchema), z.lazy(() => CitationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CitationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CitationWhereInputSchema), z.lazy(() => CitationWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  datingId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  sourceId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  pages: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  dating: z.union([ z.lazy(() => DatingScalarRelationFilterSchema), z.lazy(() => DatingWhereInputSchema) ]).optional(),
  source: z.union([ z.lazy(() => SourceScalarRelationFilterSchema), z.lazy(() => SourceWhereInputSchema) ]).optional(),
});

export const CitationOrderByWithRelationInputSchema: z.ZodType<Prisma.CitationOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  datingId: z.lazy(() => SortOrderSchema).optional(),
  sourceId: z.lazy(() => SortOrderSchema).optional(),
  pages: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  dating: z.lazy(() => DatingOrderByWithRelationInputSchema).optional(),
  source: z.lazy(() => SourceOrderByWithRelationInputSchema).optional(),
});

export const CitationWhereUniqueInputSchema: z.ZodType<Prisma.CitationWhereUniqueInput> = z.object({
  id: z.string(),
})
.and(z.strictObject({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => CitationWhereInputSchema), z.lazy(() => CitationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CitationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CitationWhereInputSchema), z.lazy(() => CitationWhereInputSchema).array() ]).optional(),
  datingId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  sourceId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  pages: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  dating: z.union([ z.lazy(() => DatingScalarRelationFilterSchema), z.lazy(() => DatingWhereInputSchema) ]).optional(),
  source: z.union([ z.lazy(() => SourceScalarRelationFilterSchema), z.lazy(() => SourceWhereInputSchema) ]).optional(),
}));

export const CitationOrderByWithAggregationInputSchema: z.ZodType<Prisma.CitationOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  datingId: z.lazy(() => SortOrderSchema).optional(),
  sourceId: z.lazy(() => SortOrderSchema).optional(),
  pages: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => CitationCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CitationMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CitationMinOrderByAggregateInputSchema).optional(),
});

export const CitationScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CitationScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => CitationScalarWhereWithAggregatesInputSchema), z.lazy(() => CitationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CitationScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CitationScalarWhereWithAggregatesInputSchema), z.lazy(() => CitationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  datingId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  sourceId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  pages: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
});

export const PassageWhereInputSchema: z.ZodType<Prisma.PassageWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => PassageWhereInputSchema), z.lazy(() => PassageWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PassageWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PassageWhereInputSchema), z.lazy(() => PassageWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  personId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  position: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  book: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  fromChapter: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  fromVerse: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  toChapter: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  toVerse: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  kind: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  note: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  person: z.union([ z.lazy(() => PersonScalarRelationFilterSchema), z.lazy(() => PersonWhereInputSchema) ]).optional(),
});

export const PassageOrderByWithRelationInputSchema: z.ZodType<Prisma.PassageOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  personId: z.lazy(() => SortOrderSchema).optional(),
  position: z.lazy(() => SortOrderSchema).optional(),
  book: z.lazy(() => SortOrderSchema).optional(),
  fromChapter: z.lazy(() => SortOrderSchema).optional(),
  fromVerse: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  toChapter: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  toVerse: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  kind: z.lazy(() => SortOrderSchema).optional(),
  note: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  person: z.lazy(() => PersonOrderByWithRelationInputSchema).optional(),
});

export const PassageWhereUniqueInputSchema: z.ZodType<Prisma.PassageWhereUniqueInput> = z.object({
  id: z.string(),
})
.and(z.strictObject({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => PassageWhereInputSchema), z.lazy(() => PassageWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PassageWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PassageWhereInputSchema), z.lazy(() => PassageWhereInputSchema).array() ]).optional(),
  personId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  position: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  book: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  fromChapter: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  fromVerse: z.union([ z.lazy(() => IntNullableFilterSchema), z.number().int() ]).optional().nullable(),
  toChapter: z.union([ z.lazy(() => IntNullableFilterSchema), z.number().int() ]).optional().nullable(),
  toVerse: z.union([ z.lazy(() => IntNullableFilterSchema), z.number().int() ]).optional().nullable(),
  kind: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  note: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  person: z.union([ z.lazy(() => PersonScalarRelationFilterSchema), z.lazy(() => PersonWhereInputSchema) ]).optional(),
}));

export const PassageOrderByWithAggregationInputSchema: z.ZodType<Prisma.PassageOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  personId: z.lazy(() => SortOrderSchema).optional(),
  position: z.lazy(() => SortOrderSchema).optional(),
  book: z.lazy(() => SortOrderSchema).optional(),
  fromChapter: z.lazy(() => SortOrderSchema).optional(),
  fromVerse: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  toChapter: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  toVerse: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  kind: z.lazy(() => SortOrderSchema).optional(),
  note: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => PassageCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => PassageAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PassageMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PassageMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => PassageSumOrderByAggregateInputSchema).optional(),
});

export const PassageScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PassageScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => PassageScalarWhereWithAggregatesInputSchema), z.lazy(() => PassageScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PassageScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PassageScalarWhereWithAggregatesInputSchema), z.lazy(() => PassageScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  personId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  position: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  book: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  fromChapter: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  fromVerse: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  toChapter: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  toVerse: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  kind: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  note: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
});

export const FamilyMemberWhereInputSchema: z.ZodType<Prisma.FamilyMemberWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => FamilyMemberWhereInputSchema), z.lazy(() => FamilyMemberWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FamilyMemberWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FamilyMemberWhereInputSchema), z.lazy(() => FamilyMemberWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  personId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  position: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  relation: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  relatedPersonId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  person: z.union([ z.lazy(() => PersonScalarRelationFilterSchema), z.lazy(() => PersonWhereInputSchema) ]).optional(),
});

export const FamilyMemberOrderByWithRelationInputSchema: z.ZodType<Prisma.FamilyMemberOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  personId: z.lazy(() => SortOrderSchema).optional(),
  position: z.lazy(() => SortOrderSchema).optional(),
  relation: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  relatedPersonId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  person: z.lazy(() => PersonOrderByWithRelationInputSchema).optional(),
});

export const FamilyMemberWhereUniqueInputSchema: z.ZodType<Prisma.FamilyMemberWhereUniqueInput> = z.object({
  id: z.string(),
})
.and(z.strictObject({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => FamilyMemberWhereInputSchema), z.lazy(() => FamilyMemberWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FamilyMemberWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FamilyMemberWhereInputSchema), z.lazy(() => FamilyMemberWhereInputSchema).array() ]).optional(),
  personId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  position: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  relation: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  relatedPersonId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  person: z.union([ z.lazy(() => PersonScalarRelationFilterSchema), z.lazy(() => PersonWhereInputSchema) ]).optional(),
}));

export const FamilyMemberOrderByWithAggregationInputSchema: z.ZodType<Prisma.FamilyMemberOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  personId: z.lazy(() => SortOrderSchema).optional(),
  position: z.lazy(() => SortOrderSchema).optional(),
  relation: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  relatedPersonId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => FamilyMemberCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => FamilyMemberAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => FamilyMemberMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => FamilyMemberMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => FamilyMemberSumOrderByAggregateInputSchema).optional(),
});

export const FamilyMemberScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.FamilyMemberScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => FamilyMemberScalarWhereWithAggregatesInputSchema), z.lazy(() => FamilyMemberScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => FamilyMemberScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FamilyMemberScalarWhereWithAggregatesInputSchema), z.lazy(() => FamilyMemberScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  personId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  position: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  relation: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  relatedPersonId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
});

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  email: z.string(),
  passwordHash: z.string(),
  role: z.lazy(() => RoleSchema).optional().nullable(),
  createdAt: z.coerce.date().optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
});

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  email: z.string(),
  passwordHash: z.string(),
  role: z.lazy(() => RoleSchema).optional().nullable(),
  createdAt: z.coerce.date().optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
});

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  passwordHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => NullableEnumRoleFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
});

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  passwordHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => NullableEnumRoleFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
});

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.strictObject({
  id: z.uuid().optional(),
  email: z.string(),
  passwordHash: z.string(),
  role: z.lazy(() => RoleSchema).optional().nullable(),
  createdAt: z.coerce.date().optional(),
});

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  passwordHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => NullableEnumRoleFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  passwordHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => NullableEnumRoleFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const SessionCreateInputSchema: z.ZodType<Prisma.SessionCreateInput> = z.strictObject({
  id: z.string(),
  expiresAt: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutSessionsInputSchema),
});

export const SessionUncheckedCreateInputSchema: z.ZodType<Prisma.SessionUncheckedCreateInput> = z.strictObject({
  id: z.string(),
  userId: z.string(),
  expiresAt: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
});

export const SessionUpdateInputSchema: z.ZodType<Prisma.SessionUpdateInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutSessionsNestedInputSchema).optional(),
});

export const SessionUncheckedUpdateInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const SessionCreateManyInputSchema: z.ZodType<Prisma.SessionCreateManyInput> = z.strictObject({
  id: z.string(),
  userId: z.string(),
  expiresAt: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
});

export const SessionUpdateManyMutationInputSchema: z.ZodType<Prisma.SessionUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const SessionUncheckedUpdateManyInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const PersonCreateInputSchema: z.ZodType<Prisma.PersonCreateInput> = z.strictObject({
  id: z.string(),
  name: z.string(),
  altNames: z.union([ z.lazy(() => PersonCreatealtNamesInputSchema), z.string().array() ]).optional(),
  summary: z.string(),
  reign: z.lazy(() => ReignCreateNestedOneWithoutPersonInputSchema).optional(),
  ministry: z.lazy(() => MinistryCreateNestedOneWithoutPersonInputSchema).optional(),
  datings: z.lazy(() => DatingCreateNestedManyWithoutPersonInputSchema).optional(),
  family: z.lazy(() => FamilyMemberCreateNestedManyWithoutPersonInputSchema).optional(),
  passages: z.lazy(() => PassageCreateNestedManyWithoutPersonInputSchema).optional(),
});

export const PersonUncheckedCreateInputSchema: z.ZodType<Prisma.PersonUncheckedCreateInput> = z.strictObject({
  id: z.string(),
  name: z.string(),
  altNames: z.union([ z.lazy(() => PersonCreatealtNamesInputSchema), z.string().array() ]).optional(),
  summary: z.string(),
  reign: z.lazy(() => ReignUncheckedCreateNestedOneWithoutPersonInputSchema).optional(),
  ministry: z.lazy(() => MinistryUncheckedCreateNestedOneWithoutPersonInputSchema).optional(),
  datings: z.lazy(() => DatingUncheckedCreateNestedManyWithoutPersonInputSchema).optional(),
  family: z.lazy(() => FamilyMemberUncheckedCreateNestedManyWithoutPersonInputSchema).optional(),
  passages: z.lazy(() => PassageUncheckedCreateNestedManyWithoutPersonInputSchema).optional(),
});

export const PersonUpdateInputSchema: z.ZodType<Prisma.PersonUpdateInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  altNames: z.union([ z.lazy(() => PersonUpdatealtNamesInputSchema), z.string().array() ]).optional(),
  summary: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  reign: z.lazy(() => ReignUpdateOneWithoutPersonNestedInputSchema).optional(),
  ministry: z.lazy(() => MinistryUpdateOneWithoutPersonNestedInputSchema).optional(),
  datings: z.lazy(() => DatingUpdateManyWithoutPersonNestedInputSchema).optional(),
  family: z.lazy(() => FamilyMemberUpdateManyWithoutPersonNestedInputSchema).optional(),
  passages: z.lazy(() => PassageUpdateManyWithoutPersonNestedInputSchema).optional(),
});

export const PersonUncheckedUpdateInputSchema: z.ZodType<Prisma.PersonUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  altNames: z.union([ z.lazy(() => PersonUpdatealtNamesInputSchema), z.string().array() ]).optional(),
  summary: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  reign: z.lazy(() => ReignUncheckedUpdateOneWithoutPersonNestedInputSchema).optional(),
  ministry: z.lazy(() => MinistryUncheckedUpdateOneWithoutPersonNestedInputSchema).optional(),
  datings: z.lazy(() => DatingUncheckedUpdateManyWithoutPersonNestedInputSchema).optional(),
  family: z.lazy(() => FamilyMemberUncheckedUpdateManyWithoutPersonNestedInputSchema).optional(),
  passages: z.lazy(() => PassageUncheckedUpdateManyWithoutPersonNestedInputSchema).optional(),
});

export const PersonCreateManyInputSchema: z.ZodType<Prisma.PersonCreateManyInput> = z.strictObject({
  id: z.string(),
  name: z.string(),
  altNames: z.union([ z.lazy(() => PersonCreatealtNamesInputSchema), z.string().array() ]).optional(),
  summary: z.string(),
});

export const PersonUpdateManyMutationInputSchema: z.ZodType<Prisma.PersonUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  altNames: z.union([ z.lazy(() => PersonUpdatealtNamesInputSchema), z.string().array() ]).optional(),
  summary: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const PersonUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PersonUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  altNames: z.union([ z.lazy(() => PersonUpdatealtNamesInputSchema), z.string().array() ]).optional(),
  summary: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ReignCreateInputSchema: z.ZodType<Prisma.ReignCreateInput> = z.strictObject({
  kingdom: z.string(),
  predecessorId: z.string().optional().nullable(),
  successorId: z.string().optional().nullable(),
  relationToPredecessor: z.string().optional().nullable(),
  person: z.lazy(() => PersonCreateNestedOneWithoutReignInputSchema),
});

export const ReignUncheckedCreateInputSchema: z.ZodType<Prisma.ReignUncheckedCreateInput> = z.strictObject({
  personId: z.string(),
  kingdom: z.string(),
  predecessorId: z.string().optional().nullable(),
  successorId: z.string().optional().nullable(),
  relationToPredecessor: z.string().optional().nullable(),
});

export const ReignUpdateInputSchema: z.ZodType<Prisma.ReignUpdateInput> = z.strictObject({
  kingdom: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  predecessorId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  successorId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  relationToPredecessor: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  person: z.lazy(() => PersonUpdateOneRequiredWithoutReignNestedInputSchema).optional(),
});

export const ReignUncheckedUpdateInputSchema: z.ZodType<Prisma.ReignUncheckedUpdateInput> = z.strictObject({
  personId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  kingdom: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  predecessorId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  successorId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  relationToPredecessor: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const ReignCreateManyInputSchema: z.ZodType<Prisma.ReignCreateManyInput> = z.strictObject({
  personId: z.string(),
  kingdom: z.string(),
  predecessorId: z.string().optional().nullable(),
  successorId: z.string().optional().nullable(),
  relationToPredecessor: z.string().optional().nullable(),
});

export const ReignUpdateManyMutationInputSchema: z.ZodType<Prisma.ReignUpdateManyMutationInput> = z.strictObject({
  kingdom: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  predecessorId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  successorId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  relationToPredecessor: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const ReignUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ReignUncheckedUpdateManyInput> = z.strictObject({
  personId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  kingdom: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  predecessorId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  successorId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  relationToPredecessor: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const MinistryCreateInputSchema: z.ZodType<Prisma.MinistryCreateInput> = z.strictObject({
  audience: z.union([ z.lazy(() => MinistryCreateaudienceInputSchema), z.string().array() ]).optional(),
  hasBook: z.boolean(),
  person: z.lazy(() => PersonCreateNestedOneWithoutMinistryInputSchema),
});

export const MinistryUncheckedCreateInputSchema: z.ZodType<Prisma.MinistryUncheckedCreateInput> = z.strictObject({
  personId: z.string(),
  audience: z.union([ z.lazy(() => MinistryCreateaudienceInputSchema), z.string().array() ]).optional(),
  hasBook: z.boolean(),
});

export const MinistryUpdateInputSchema: z.ZodType<Prisma.MinistryUpdateInput> = z.strictObject({
  audience: z.union([ z.lazy(() => MinistryUpdateaudienceInputSchema), z.string().array() ]).optional(),
  hasBook: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  person: z.lazy(() => PersonUpdateOneRequiredWithoutMinistryNestedInputSchema).optional(),
});

export const MinistryUncheckedUpdateInputSchema: z.ZodType<Prisma.MinistryUncheckedUpdateInput> = z.strictObject({
  personId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  audience: z.union([ z.lazy(() => MinistryUpdateaudienceInputSchema), z.string().array() ]).optional(),
  hasBook: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
});

export const MinistryCreateManyInputSchema: z.ZodType<Prisma.MinistryCreateManyInput> = z.strictObject({
  personId: z.string(),
  audience: z.union([ z.lazy(() => MinistryCreateaudienceInputSchema), z.string().array() ]).optional(),
  hasBook: z.boolean(),
});

export const MinistryUpdateManyMutationInputSchema: z.ZodType<Prisma.MinistryUpdateManyMutationInput> = z.strictObject({
  audience: z.union([ z.lazy(() => MinistryUpdateaudienceInputSchema), z.string().array() ]).optional(),
  hasBook: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
});

export const MinistryUncheckedUpdateManyInputSchema: z.ZodType<Prisma.MinistryUncheckedUpdateManyInput> = z.strictObject({
  personId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  audience: z.union([ z.lazy(() => MinistryUpdateaudienceInputSchema), z.string().array() ]).optional(),
  hasBook: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
});

export const DatingCreateInputSchema: z.ZodType<Prisma.DatingCreateInput> = z.strictObject({
  id: z.string(),
  role: z.string(),
  position: z.number().int(),
  label: z.string().optional().nullable(),
  spanFrom: z.number().int(),
  spanTo: z.number().int(),
  approx: z.boolean(),
  coregencyFrom: z.number().int().optional().nullable(),
  confidence: z.string(),
  notes: z.string().optional().nullable(),
  person: z.lazy(() => PersonCreateNestedOneWithoutDatingsInputSchema),
  evidence: z.lazy(() => EvidenceCreateNestedManyWithoutDatingInputSchema).optional(),
  citations: z.lazy(() => CitationCreateNestedManyWithoutDatingInputSchema).optional(),
});

export const DatingUncheckedCreateInputSchema: z.ZodType<Prisma.DatingUncheckedCreateInput> = z.strictObject({
  id: z.string(),
  personId: z.string(),
  role: z.string(),
  position: z.number().int(),
  label: z.string().optional().nullable(),
  spanFrom: z.number().int(),
  spanTo: z.number().int(),
  approx: z.boolean(),
  coregencyFrom: z.number().int().optional().nullable(),
  confidence: z.string(),
  notes: z.string().optional().nullable(),
  evidence: z.lazy(() => EvidenceUncheckedCreateNestedManyWithoutDatingInputSchema).optional(),
  citations: z.lazy(() => CitationUncheckedCreateNestedManyWithoutDatingInputSchema).optional(),
});

export const DatingUpdateInputSchema: z.ZodType<Prisma.DatingUpdateInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  position: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  spanFrom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  spanTo: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  approx: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  coregencyFrom: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  confidence: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  person: z.lazy(() => PersonUpdateOneRequiredWithoutDatingsNestedInputSchema).optional(),
  evidence: z.lazy(() => EvidenceUpdateManyWithoutDatingNestedInputSchema).optional(),
  citations: z.lazy(() => CitationUpdateManyWithoutDatingNestedInputSchema).optional(),
});

export const DatingUncheckedUpdateInputSchema: z.ZodType<Prisma.DatingUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  personId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  position: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  spanFrom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  spanTo: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  approx: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  coregencyFrom: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  confidence: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  evidence: z.lazy(() => EvidenceUncheckedUpdateManyWithoutDatingNestedInputSchema).optional(),
  citations: z.lazy(() => CitationUncheckedUpdateManyWithoutDatingNestedInputSchema).optional(),
});

export const DatingCreateManyInputSchema: z.ZodType<Prisma.DatingCreateManyInput> = z.strictObject({
  id: z.string(),
  personId: z.string(),
  role: z.string(),
  position: z.number().int(),
  label: z.string().optional().nullable(),
  spanFrom: z.number().int(),
  spanTo: z.number().int(),
  approx: z.boolean(),
  coregencyFrom: z.number().int().optional().nullable(),
  confidence: z.string(),
  notes: z.string().optional().nullable(),
});

export const DatingUpdateManyMutationInputSchema: z.ZodType<Prisma.DatingUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  position: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  spanFrom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  spanTo: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  approx: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  coregencyFrom: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  confidence: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const DatingUncheckedUpdateManyInputSchema: z.ZodType<Prisma.DatingUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  personId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  position: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  spanFrom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  spanTo: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  approx: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  coregencyFrom: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  confidence: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const EvidenceCreateInputSchema: z.ZodType<Prisma.EvidenceCreateInput> = z.strictObject({
  id: z.string(),
  position: z.number().int(),
  kind: z.string(),
  book: z.string().optional().nullable(),
  fromChapter: z.number().int().optional().nullable(),
  fromVerse: z.number().int().optional().nullable(),
  toChapter: z.number().int().optional().nullable(),
  toVerse: z.number().int().optional().nullable(),
  note: z.string().optional().nullable(),
  artifact: z.string().optional().nullable(),
  contemporaryIds: z.union([ z.lazy(() => EvidenceCreatecontemporaryIdsInputSchema), z.string().array() ]).optional(),
  dating: z.lazy(() => DatingCreateNestedOneWithoutEvidenceInputSchema),
});

export const EvidenceUncheckedCreateInputSchema: z.ZodType<Prisma.EvidenceUncheckedCreateInput> = z.strictObject({
  id: z.string(),
  datingId: z.string(),
  position: z.number().int(),
  kind: z.string(),
  book: z.string().optional().nullable(),
  fromChapter: z.number().int().optional().nullable(),
  fromVerse: z.number().int().optional().nullable(),
  toChapter: z.number().int().optional().nullable(),
  toVerse: z.number().int().optional().nullable(),
  note: z.string().optional().nullable(),
  artifact: z.string().optional().nullable(),
  contemporaryIds: z.union([ z.lazy(() => EvidenceCreatecontemporaryIdsInputSchema), z.string().array() ]).optional(),
});

export const EvidenceUpdateInputSchema: z.ZodType<Prisma.EvidenceUpdateInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  position: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  kind: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  book: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fromChapter: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fromVerse: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  toChapter: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  toVerse: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  artifact: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contemporaryIds: z.union([ z.lazy(() => EvidenceUpdatecontemporaryIdsInputSchema), z.string().array() ]).optional(),
  dating: z.lazy(() => DatingUpdateOneRequiredWithoutEvidenceNestedInputSchema).optional(),
});

export const EvidenceUncheckedUpdateInputSchema: z.ZodType<Prisma.EvidenceUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  datingId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  position: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  kind: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  book: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fromChapter: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fromVerse: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  toChapter: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  toVerse: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  artifact: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contemporaryIds: z.union([ z.lazy(() => EvidenceUpdatecontemporaryIdsInputSchema), z.string().array() ]).optional(),
});

export const EvidenceCreateManyInputSchema: z.ZodType<Prisma.EvidenceCreateManyInput> = z.strictObject({
  id: z.string(),
  datingId: z.string(),
  position: z.number().int(),
  kind: z.string(),
  book: z.string().optional().nullable(),
  fromChapter: z.number().int().optional().nullable(),
  fromVerse: z.number().int().optional().nullable(),
  toChapter: z.number().int().optional().nullable(),
  toVerse: z.number().int().optional().nullable(),
  note: z.string().optional().nullable(),
  artifact: z.string().optional().nullable(),
  contemporaryIds: z.union([ z.lazy(() => EvidenceCreatecontemporaryIdsInputSchema), z.string().array() ]).optional(),
});

export const EvidenceUpdateManyMutationInputSchema: z.ZodType<Prisma.EvidenceUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  position: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  kind: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  book: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fromChapter: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fromVerse: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  toChapter: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  toVerse: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  artifact: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contemporaryIds: z.union([ z.lazy(() => EvidenceUpdatecontemporaryIdsInputSchema), z.string().array() ]).optional(),
});

export const EvidenceUncheckedUpdateManyInputSchema: z.ZodType<Prisma.EvidenceUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  datingId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  position: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  kind: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  book: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fromChapter: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fromVerse: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  toChapter: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  toVerse: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  artifact: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contemporaryIds: z.union([ z.lazy(() => EvidenceUpdatecontemporaryIdsInputSchema), z.string().array() ]).optional(),
});

export const SourceCreateInputSchema: z.ZodType<Prisma.SourceCreateInput> = z.strictObject({
  id: z.string(),
  author: z.string(),
  title: z.string(),
  year: z.number().int(),
  kind: z.string(),
  publisher: z.string().optional().nullable(),
  url: z.string().optional().nullable(),
  citations: z.lazy(() => CitationCreateNestedManyWithoutSourceInputSchema).optional(),
});

export const SourceUncheckedCreateInputSchema: z.ZodType<Prisma.SourceUncheckedCreateInput> = z.strictObject({
  id: z.string(),
  author: z.string(),
  title: z.string(),
  year: z.number().int(),
  kind: z.string(),
  publisher: z.string().optional().nullable(),
  url: z.string().optional().nullable(),
  citations: z.lazy(() => CitationUncheckedCreateNestedManyWithoutSourceInputSchema).optional(),
});

export const SourceUpdateInputSchema: z.ZodType<Prisma.SourceUpdateInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  author: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  year: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  kind: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  publisher: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  url: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  citations: z.lazy(() => CitationUpdateManyWithoutSourceNestedInputSchema).optional(),
});

export const SourceUncheckedUpdateInputSchema: z.ZodType<Prisma.SourceUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  author: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  year: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  kind: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  publisher: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  url: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  citations: z.lazy(() => CitationUncheckedUpdateManyWithoutSourceNestedInputSchema).optional(),
});

export const SourceCreateManyInputSchema: z.ZodType<Prisma.SourceCreateManyInput> = z.strictObject({
  id: z.string(),
  author: z.string(),
  title: z.string(),
  year: z.number().int(),
  kind: z.string(),
  publisher: z.string().optional().nullable(),
  url: z.string().optional().nullable(),
});

export const SourceUpdateManyMutationInputSchema: z.ZodType<Prisma.SourceUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  author: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  year: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  kind: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  publisher: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  url: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const SourceUncheckedUpdateManyInputSchema: z.ZodType<Prisma.SourceUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  author: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  year: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  kind: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  publisher: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  url: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const CitationCreateInputSchema: z.ZodType<Prisma.CitationCreateInput> = z.strictObject({
  id: z.string(),
  pages: z.string().optional().nullable(),
  dating: z.lazy(() => DatingCreateNestedOneWithoutCitationsInputSchema),
  source: z.lazy(() => SourceCreateNestedOneWithoutCitationsInputSchema),
});

export const CitationUncheckedCreateInputSchema: z.ZodType<Prisma.CitationUncheckedCreateInput> = z.strictObject({
  id: z.string(),
  datingId: z.string(),
  sourceId: z.string(),
  pages: z.string().optional().nullable(),
});

export const CitationUpdateInputSchema: z.ZodType<Prisma.CitationUpdateInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pages: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dating: z.lazy(() => DatingUpdateOneRequiredWithoutCitationsNestedInputSchema).optional(),
  source: z.lazy(() => SourceUpdateOneRequiredWithoutCitationsNestedInputSchema).optional(),
});

export const CitationUncheckedUpdateInputSchema: z.ZodType<Prisma.CitationUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  datingId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sourceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pages: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const CitationCreateManyInputSchema: z.ZodType<Prisma.CitationCreateManyInput> = z.strictObject({
  id: z.string(),
  datingId: z.string(),
  sourceId: z.string(),
  pages: z.string().optional().nullable(),
});

export const CitationUpdateManyMutationInputSchema: z.ZodType<Prisma.CitationUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pages: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const CitationUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CitationUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  datingId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sourceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pages: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const PassageCreateInputSchema: z.ZodType<Prisma.PassageCreateInput> = z.strictObject({
  id: z.string(),
  position: z.number().int(),
  book: z.string(),
  fromChapter: z.number().int(),
  fromVerse: z.number().int().optional().nullable(),
  toChapter: z.number().int().optional().nullable(),
  toVerse: z.number().int().optional().nullable(),
  kind: z.string(),
  note: z.string().optional().nullable(),
  person: z.lazy(() => PersonCreateNestedOneWithoutPassagesInputSchema),
});

export const PassageUncheckedCreateInputSchema: z.ZodType<Prisma.PassageUncheckedCreateInput> = z.strictObject({
  id: z.string(),
  personId: z.string(),
  position: z.number().int(),
  book: z.string(),
  fromChapter: z.number().int(),
  fromVerse: z.number().int().optional().nullable(),
  toChapter: z.number().int().optional().nullable(),
  toVerse: z.number().int().optional().nullable(),
  kind: z.string(),
  note: z.string().optional().nullable(),
});

export const PassageUpdateInputSchema: z.ZodType<Prisma.PassageUpdateInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  position: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  book: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fromChapter: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  fromVerse: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  toChapter: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  toVerse: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  kind: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  person: z.lazy(() => PersonUpdateOneRequiredWithoutPassagesNestedInputSchema).optional(),
});

export const PassageUncheckedUpdateInputSchema: z.ZodType<Prisma.PassageUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  personId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  position: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  book: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fromChapter: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  fromVerse: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  toChapter: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  toVerse: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  kind: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const PassageCreateManyInputSchema: z.ZodType<Prisma.PassageCreateManyInput> = z.strictObject({
  id: z.string(),
  personId: z.string(),
  position: z.number().int(),
  book: z.string(),
  fromChapter: z.number().int(),
  fromVerse: z.number().int().optional().nullable(),
  toChapter: z.number().int().optional().nullable(),
  toVerse: z.number().int().optional().nullable(),
  kind: z.string(),
  note: z.string().optional().nullable(),
});

export const PassageUpdateManyMutationInputSchema: z.ZodType<Prisma.PassageUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  position: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  book: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fromChapter: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  fromVerse: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  toChapter: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  toVerse: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  kind: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const PassageUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PassageUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  personId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  position: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  book: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fromChapter: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  fromVerse: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  toChapter: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  toVerse: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  kind: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const FamilyMemberCreateInputSchema: z.ZodType<Prisma.FamilyMemberCreateInput> = z.strictObject({
  id: z.string(),
  position: z.number().int(),
  relation: z.string(),
  name: z.string(),
  relatedPersonId: z.string().optional().nullable(),
  person: z.lazy(() => PersonCreateNestedOneWithoutFamilyInputSchema),
});

export const FamilyMemberUncheckedCreateInputSchema: z.ZodType<Prisma.FamilyMemberUncheckedCreateInput> = z.strictObject({
  id: z.string(),
  personId: z.string(),
  position: z.number().int(),
  relation: z.string(),
  name: z.string(),
  relatedPersonId: z.string().optional().nullable(),
});

export const FamilyMemberUpdateInputSchema: z.ZodType<Prisma.FamilyMemberUpdateInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  position: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  relation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  relatedPersonId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  person: z.lazy(() => PersonUpdateOneRequiredWithoutFamilyNestedInputSchema).optional(),
});

export const FamilyMemberUncheckedUpdateInputSchema: z.ZodType<Prisma.FamilyMemberUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  personId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  position: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  relation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  relatedPersonId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const FamilyMemberCreateManyInputSchema: z.ZodType<Prisma.FamilyMemberCreateManyInput> = z.strictObject({
  id: z.string(),
  personId: z.string(),
  position: z.number().int(),
  relation: z.string(),
  name: z.string(),
  relatedPersonId: z.string().optional().nullable(),
});

export const FamilyMemberUpdateManyMutationInputSchema: z.ZodType<Prisma.FamilyMemberUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  position: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  relation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  relatedPersonId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const FamilyMemberUncheckedUpdateManyInputSchema: z.ZodType<Prisma.FamilyMemberUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  personId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  position: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  relation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  relatedPersonId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.strictObject({
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
});

export const EnumRoleNullableFilterSchema: z.ZodType<Prisma.EnumRoleNullableFilter> = z.strictObject({
  equals: z.lazy(() => RoleSchema).optional().nullable(),
  in: z.lazy(() => RoleSchema).array().optional().nullable(),
  notIn: z.lazy(() => RoleSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => RoleSchema), z.lazy(() => NestedEnumRoleNullableFilterSchema) ]).optional().nullable(),
});

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
});

export const SessionListRelationFilterSchema: z.ZodType<Prisma.SessionListRelationFilter> = z.strictObject({
  every: z.lazy(() => SessionWhereInputSchema).optional(),
  some: z.lazy(() => SessionWhereInputSchema).optional(),
  none: z.lazy(() => SessionWhereInputSchema).optional(),
});

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.strictObject({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional(),
});

export const SessionOrderByRelationAggregateInputSchema: z.ZodType<Prisma.SessionOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  passwordHash: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
});

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  passwordHash: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
});

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  passwordHash: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
});

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.strictObject({
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
  _max: z.lazy(() => NestedStringFilterSchema).optional(),
});

export const EnumRoleNullableWithAggregatesFilterSchema: z.ZodType<Prisma.EnumRoleNullableWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => RoleSchema).optional().nullable(),
  in: z.lazy(() => RoleSchema).array().optional().nullable(),
  notIn: z.lazy(() => RoleSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => RoleSchema), z.lazy(() => NestedEnumRoleNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumRoleNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumRoleNullableFilterSchema).optional(),
});

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.strictObject({
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
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
});

export const UserScalarRelationFilterSchema: z.ZodType<Prisma.UserScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional(),
});

export const SessionCountOrderByAggregateInputSchema: z.ZodType<Prisma.SessionCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
});

export const SessionMaxOrderByAggregateInputSchema: z.ZodType<Prisma.SessionMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
});

export const SessionMinOrderByAggregateInputSchema: z.ZodType<Prisma.SessionMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
});

export const StringNullableListFilterSchema: z.ZodType<Prisma.StringNullableListFilter> = z.strictObject({
  equals: z.string().array().optional().nullable(),
  has: z.string().optional().nullable(),
  hasEvery: z.string().array().optional(),
  hasSome: z.string().array().optional(),
  isEmpty: z.boolean().optional(),
});

export const ReignNullableScalarRelationFilterSchema: z.ZodType<Prisma.ReignNullableScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => ReignWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => ReignWhereInputSchema).optional().nullable(),
});

export const MinistryNullableScalarRelationFilterSchema: z.ZodType<Prisma.MinistryNullableScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => MinistryWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => MinistryWhereInputSchema).optional().nullable(),
});

export const DatingListRelationFilterSchema: z.ZodType<Prisma.DatingListRelationFilter> = z.strictObject({
  every: z.lazy(() => DatingWhereInputSchema).optional(),
  some: z.lazy(() => DatingWhereInputSchema).optional(),
  none: z.lazy(() => DatingWhereInputSchema).optional(),
});

export const FamilyMemberListRelationFilterSchema: z.ZodType<Prisma.FamilyMemberListRelationFilter> = z.strictObject({
  every: z.lazy(() => FamilyMemberWhereInputSchema).optional(),
  some: z.lazy(() => FamilyMemberWhereInputSchema).optional(),
  none: z.lazy(() => FamilyMemberWhereInputSchema).optional(),
});

export const PassageListRelationFilterSchema: z.ZodType<Prisma.PassageListRelationFilter> = z.strictObject({
  every: z.lazy(() => PassageWhereInputSchema).optional(),
  some: z.lazy(() => PassageWhereInputSchema).optional(),
  none: z.lazy(() => PassageWhereInputSchema).optional(),
});

export const DatingOrderByRelationAggregateInputSchema: z.ZodType<Prisma.DatingOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const FamilyMemberOrderByRelationAggregateInputSchema: z.ZodType<Prisma.FamilyMemberOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const PassageOrderByRelationAggregateInputSchema: z.ZodType<Prisma.PassageOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const PersonCountOrderByAggregateInputSchema: z.ZodType<Prisma.PersonCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  altNames: z.lazy(() => SortOrderSchema).optional(),
  summary: z.lazy(() => SortOrderSchema).optional(),
});

export const PersonMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PersonMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  summary: z.lazy(() => SortOrderSchema).optional(),
});

export const PersonMinOrderByAggregateInputSchema: z.ZodType<Prisma.PersonMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  summary: z.lazy(() => SortOrderSchema).optional(),
});

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.strictObject({
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
});

export const PersonScalarRelationFilterSchema: z.ZodType<Prisma.PersonScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => PersonWhereInputSchema).optional(),
  isNot: z.lazy(() => PersonWhereInputSchema).optional(),
});

export const ReignCountOrderByAggregateInputSchema: z.ZodType<Prisma.ReignCountOrderByAggregateInput> = z.strictObject({
  personId: z.lazy(() => SortOrderSchema).optional(),
  kingdom: z.lazy(() => SortOrderSchema).optional(),
  predecessorId: z.lazy(() => SortOrderSchema).optional(),
  successorId: z.lazy(() => SortOrderSchema).optional(),
  relationToPredecessor: z.lazy(() => SortOrderSchema).optional(),
});

export const ReignMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ReignMaxOrderByAggregateInput> = z.strictObject({
  personId: z.lazy(() => SortOrderSchema).optional(),
  kingdom: z.lazy(() => SortOrderSchema).optional(),
  predecessorId: z.lazy(() => SortOrderSchema).optional(),
  successorId: z.lazy(() => SortOrderSchema).optional(),
  relationToPredecessor: z.lazy(() => SortOrderSchema).optional(),
});

export const ReignMinOrderByAggregateInputSchema: z.ZodType<Prisma.ReignMinOrderByAggregateInput> = z.strictObject({
  personId: z.lazy(() => SortOrderSchema).optional(),
  kingdom: z.lazy(() => SortOrderSchema).optional(),
  predecessorId: z.lazy(() => SortOrderSchema).optional(),
  successorId: z.lazy(() => SortOrderSchema).optional(),
  relationToPredecessor: z.lazy(() => SortOrderSchema).optional(),
});

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.strictObject({
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
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
});

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.strictObject({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
});

export const MinistryCountOrderByAggregateInputSchema: z.ZodType<Prisma.MinistryCountOrderByAggregateInput> = z.strictObject({
  personId: z.lazy(() => SortOrderSchema).optional(),
  audience: z.lazy(() => SortOrderSchema).optional(),
  hasBook: z.lazy(() => SortOrderSchema).optional(),
});

export const MinistryMaxOrderByAggregateInputSchema: z.ZodType<Prisma.MinistryMaxOrderByAggregateInput> = z.strictObject({
  personId: z.lazy(() => SortOrderSchema).optional(),
  hasBook: z.lazy(() => SortOrderSchema).optional(),
});

export const MinistryMinOrderByAggregateInputSchema: z.ZodType<Prisma.MinistryMinOrderByAggregateInput> = z.strictObject({
  personId: z.lazy(() => SortOrderSchema).optional(),
  hasBook: z.lazy(() => SortOrderSchema).optional(),
});

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.strictObject({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional(),
});

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
});

export const IntNullableFilterSchema: z.ZodType<Prisma.IntNullableFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
});

export const EvidenceListRelationFilterSchema: z.ZodType<Prisma.EvidenceListRelationFilter> = z.strictObject({
  every: z.lazy(() => EvidenceWhereInputSchema).optional(),
  some: z.lazy(() => EvidenceWhereInputSchema).optional(),
  none: z.lazy(() => EvidenceWhereInputSchema).optional(),
});

export const CitationListRelationFilterSchema: z.ZodType<Prisma.CitationListRelationFilter> = z.strictObject({
  every: z.lazy(() => CitationWhereInputSchema).optional(),
  some: z.lazy(() => CitationWhereInputSchema).optional(),
  none: z.lazy(() => CitationWhereInputSchema).optional(),
});

export const EvidenceOrderByRelationAggregateInputSchema: z.ZodType<Prisma.EvidenceOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const CitationOrderByRelationAggregateInputSchema: z.ZodType<Prisma.CitationOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const DatingPersonIdRolePositionCompoundUniqueInputSchema: z.ZodType<Prisma.DatingPersonIdRolePositionCompoundUniqueInput> = z.strictObject({
  personId: z.string(),
  role: z.string(),
  position: z.number(),
});

export const DatingCountOrderByAggregateInputSchema: z.ZodType<Prisma.DatingCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  personId: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  position: z.lazy(() => SortOrderSchema).optional(),
  label: z.lazy(() => SortOrderSchema).optional(),
  spanFrom: z.lazy(() => SortOrderSchema).optional(),
  spanTo: z.lazy(() => SortOrderSchema).optional(),
  approx: z.lazy(() => SortOrderSchema).optional(),
  coregencyFrom: z.lazy(() => SortOrderSchema).optional(),
  confidence: z.lazy(() => SortOrderSchema).optional(),
  notes: z.lazy(() => SortOrderSchema).optional(),
});

export const DatingAvgOrderByAggregateInputSchema: z.ZodType<Prisma.DatingAvgOrderByAggregateInput> = z.strictObject({
  position: z.lazy(() => SortOrderSchema).optional(),
  spanFrom: z.lazy(() => SortOrderSchema).optional(),
  spanTo: z.lazy(() => SortOrderSchema).optional(),
  coregencyFrom: z.lazy(() => SortOrderSchema).optional(),
});

export const DatingMaxOrderByAggregateInputSchema: z.ZodType<Prisma.DatingMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  personId: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  position: z.lazy(() => SortOrderSchema).optional(),
  label: z.lazy(() => SortOrderSchema).optional(),
  spanFrom: z.lazy(() => SortOrderSchema).optional(),
  spanTo: z.lazy(() => SortOrderSchema).optional(),
  approx: z.lazy(() => SortOrderSchema).optional(),
  coregencyFrom: z.lazy(() => SortOrderSchema).optional(),
  confidence: z.lazy(() => SortOrderSchema).optional(),
  notes: z.lazy(() => SortOrderSchema).optional(),
});

export const DatingMinOrderByAggregateInputSchema: z.ZodType<Prisma.DatingMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  personId: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  position: z.lazy(() => SortOrderSchema).optional(),
  label: z.lazy(() => SortOrderSchema).optional(),
  spanFrom: z.lazy(() => SortOrderSchema).optional(),
  spanTo: z.lazy(() => SortOrderSchema).optional(),
  approx: z.lazy(() => SortOrderSchema).optional(),
  coregencyFrom: z.lazy(() => SortOrderSchema).optional(),
  confidence: z.lazy(() => SortOrderSchema).optional(),
  notes: z.lazy(() => SortOrderSchema).optional(),
});

export const DatingSumOrderByAggregateInputSchema: z.ZodType<Prisma.DatingSumOrderByAggregateInput> = z.strictObject({
  position: z.lazy(() => SortOrderSchema).optional(),
  spanFrom: z.lazy(() => SortOrderSchema).optional(),
  spanTo: z.lazy(() => SortOrderSchema).optional(),
  coregencyFrom: z.lazy(() => SortOrderSchema).optional(),
});

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.strictObject({
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
  _max: z.lazy(() => NestedIntFilterSchema).optional(),
});

export const IntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.IntNullableWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional(),
});

export const DatingScalarRelationFilterSchema: z.ZodType<Prisma.DatingScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => DatingWhereInputSchema).optional(),
  isNot: z.lazy(() => DatingWhereInputSchema).optional(),
});

export const EvidenceCountOrderByAggregateInputSchema: z.ZodType<Prisma.EvidenceCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  datingId: z.lazy(() => SortOrderSchema).optional(),
  position: z.lazy(() => SortOrderSchema).optional(),
  kind: z.lazy(() => SortOrderSchema).optional(),
  book: z.lazy(() => SortOrderSchema).optional(),
  fromChapter: z.lazy(() => SortOrderSchema).optional(),
  fromVerse: z.lazy(() => SortOrderSchema).optional(),
  toChapter: z.lazy(() => SortOrderSchema).optional(),
  toVerse: z.lazy(() => SortOrderSchema).optional(),
  note: z.lazy(() => SortOrderSchema).optional(),
  artifact: z.lazy(() => SortOrderSchema).optional(),
  contemporaryIds: z.lazy(() => SortOrderSchema).optional(),
});

export const EvidenceAvgOrderByAggregateInputSchema: z.ZodType<Prisma.EvidenceAvgOrderByAggregateInput> = z.strictObject({
  position: z.lazy(() => SortOrderSchema).optional(),
  fromChapter: z.lazy(() => SortOrderSchema).optional(),
  fromVerse: z.lazy(() => SortOrderSchema).optional(),
  toChapter: z.lazy(() => SortOrderSchema).optional(),
  toVerse: z.lazy(() => SortOrderSchema).optional(),
});

export const EvidenceMaxOrderByAggregateInputSchema: z.ZodType<Prisma.EvidenceMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  datingId: z.lazy(() => SortOrderSchema).optional(),
  position: z.lazy(() => SortOrderSchema).optional(),
  kind: z.lazy(() => SortOrderSchema).optional(),
  book: z.lazy(() => SortOrderSchema).optional(),
  fromChapter: z.lazy(() => SortOrderSchema).optional(),
  fromVerse: z.lazy(() => SortOrderSchema).optional(),
  toChapter: z.lazy(() => SortOrderSchema).optional(),
  toVerse: z.lazy(() => SortOrderSchema).optional(),
  note: z.lazy(() => SortOrderSchema).optional(),
  artifact: z.lazy(() => SortOrderSchema).optional(),
});

export const EvidenceMinOrderByAggregateInputSchema: z.ZodType<Prisma.EvidenceMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  datingId: z.lazy(() => SortOrderSchema).optional(),
  position: z.lazy(() => SortOrderSchema).optional(),
  kind: z.lazy(() => SortOrderSchema).optional(),
  book: z.lazy(() => SortOrderSchema).optional(),
  fromChapter: z.lazy(() => SortOrderSchema).optional(),
  fromVerse: z.lazy(() => SortOrderSchema).optional(),
  toChapter: z.lazy(() => SortOrderSchema).optional(),
  toVerse: z.lazy(() => SortOrderSchema).optional(),
  note: z.lazy(() => SortOrderSchema).optional(),
  artifact: z.lazy(() => SortOrderSchema).optional(),
});

export const EvidenceSumOrderByAggregateInputSchema: z.ZodType<Prisma.EvidenceSumOrderByAggregateInput> = z.strictObject({
  position: z.lazy(() => SortOrderSchema).optional(),
  fromChapter: z.lazy(() => SortOrderSchema).optional(),
  fromVerse: z.lazy(() => SortOrderSchema).optional(),
  toChapter: z.lazy(() => SortOrderSchema).optional(),
  toVerse: z.lazy(() => SortOrderSchema).optional(),
});

export const SourceCountOrderByAggregateInputSchema: z.ZodType<Prisma.SourceCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  author: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  year: z.lazy(() => SortOrderSchema).optional(),
  kind: z.lazy(() => SortOrderSchema).optional(),
  publisher: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
});

export const SourceAvgOrderByAggregateInputSchema: z.ZodType<Prisma.SourceAvgOrderByAggregateInput> = z.strictObject({
  year: z.lazy(() => SortOrderSchema).optional(),
});

export const SourceMaxOrderByAggregateInputSchema: z.ZodType<Prisma.SourceMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  author: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  year: z.lazy(() => SortOrderSchema).optional(),
  kind: z.lazy(() => SortOrderSchema).optional(),
  publisher: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
});

export const SourceMinOrderByAggregateInputSchema: z.ZodType<Prisma.SourceMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  author: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  year: z.lazy(() => SortOrderSchema).optional(),
  kind: z.lazy(() => SortOrderSchema).optional(),
  publisher: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
});

export const SourceSumOrderByAggregateInputSchema: z.ZodType<Prisma.SourceSumOrderByAggregateInput> = z.strictObject({
  year: z.lazy(() => SortOrderSchema).optional(),
});

export const SourceScalarRelationFilterSchema: z.ZodType<Prisma.SourceScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => SourceWhereInputSchema).optional(),
  isNot: z.lazy(() => SourceWhereInputSchema).optional(),
});

export const CitationCountOrderByAggregateInputSchema: z.ZodType<Prisma.CitationCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  datingId: z.lazy(() => SortOrderSchema).optional(),
  sourceId: z.lazy(() => SortOrderSchema).optional(),
  pages: z.lazy(() => SortOrderSchema).optional(),
});

export const CitationMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CitationMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  datingId: z.lazy(() => SortOrderSchema).optional(),
  sourceId: z.lazy(() => SortOrderSchema).optional(),
  pages: z.lazy(() => SortOrderSchema).optional(),
});

export const CitationMinOrderByAggregateInputSchema: z.ZodType<Prisma.CitationMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  datingId: z.lazy(() => SortOrderSchema).optional(),
  sourceId: z.lazy(() => SortOrderSchema).optional(),
  pages: z.lazy(() => SortOrderSchema).optional(),
});

export const PassageCountOrderByAggregateInputSchema: z.ZodType<Prisma.PassageCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  personId: z.lazy(() => SortOrderSchema).optional(),
  position: z.lazy(() => SortOrderSchema).optional(),
  book: z.lazy(() => SortOrderSchema).optional(),
  fromChapter: z.lazy(() => SortOrderSchema).optional(),
  fromVerse: z.lazy(() => SortOrderSchema).optional(),
  toChapter: z.lazy(() => SortOrderSchema).optional(),
  toVerse: z.lazy(() => SortOrderSchema).optional(),
  kind: z.lazy(() => SortOrderSchema).optional(),
  note: z.lazy(() => SortOrderSchema).optional(),
});

export const PassageAvgOrderByAggregateInputSchema: z.ZodType<Prisma.PassageAvgOrderByAggregateInput> = z.strictObject({
  position: z.lazy(() => SortOrderSchema).optional(),
  fromChapter: z.lazy(() => SortOrderSchema).optional(),
  fromVerse: z.lazy(() => SortOrderSchema).optional(),
  toChapter: z.lazy(() => SortOrderSchema).optional(),
  toVerse: z.lazy(() => SortOrderSchema).optional(),
});

export const PassageMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PassageMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  personId: z.lazy(() => SortOrderSchema).optional(),
  position: z.lazy(() => SortOrderSchema).optional(),
  book: z.lazy(() => SortOrderSchema).optional(),
  fromChapter: z.lazy(() => SortOrderSchema).optional(),
  fromVerse: z.lazy(() => SortOrderSchema).optional(),
  toChapter: z.lazy(() => SortOrderSchema).optional(),
  toVerse: z.lazy(() => SortOrderSchema).optional(),
  kind: z.lazy(() => SortOrderSchema).optional(),
  note: z.lazy(() => SortOrderSchema).optional(),
});

export const PassageMinOrderByAggregateInputSchema: z.ZodType<Prisma.PassageMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  personId: z.lazy(() => SortOrderSchema).optional(),
  position: z.lazy(() => SortOrderSchema).optional(),
  book: z.lazy(() => SortOrderSchema).optional(),
  fromChapter: z.lazy(() => SortOrderSchema).optional(),
  fromVerse: z.lazy(() => SortOrderSchema).optional(),
  toChapter: z.lazy(() => SortOrderSchema).optional(),
  toVerse: z.lazy(() => SortOrderSchema).optional(),
  kind: z.lazy(() => SortOrderSchema).optional(),
  note: z.lazy(() => SortOrderSchema).optional(),
});

export const PassageSumOrderByAggregateInputSchema: z.ZodType<Prisma.PassageSumOrderByAggregateInput> = z.strictObject({
  position: z.lazy(() => SortOrderSchema).optional(),
  fromChapter: z.lazy(() => SortOrderSchema).optional(),
  fromVerse: z.lazy(() => SortOrderSchema).optional(),
  toChapter: z.lazy(() => SortOrderSchema).optional(),
  toVerse: z.lazy(() => SortOrderSchema).optional(),
});

export const FamilyMemberCountOrderByAggregateInputSchema: z.ZodType<Prisma.FamilyMemberCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  personId: z.lazy(() => SortOrderSchema).optional(),
  position: z.lazy(() => SortOrderSchema).optional(),
  relation: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  relatedPersonId: z.lazy(() => SortOrderSchema).optional(),
});

export const FamilyMemberAvgOrderByAggregateInputSchema: z.ZodType<Prisma.FamilyMemberAvgOrderByAggregateInput> = z.strictObject({
  position: z.lazy(() => SortOrderSchema).optional(),
});

export const FamilyMemberMaxOrderByAggregateInputSchema: z.ZodType<Prisma.FamilyMemberMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  personId: z.lazy(() => SortOrderSchema).optional(),
  position: z.lazy(() => SortOrderSchema).optional(),
  relation: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  relatedPersonId: z.lazy(() => SortOrderSchema).optional(),
});

export const FamilyMemberMinOrderByAggregateInputSchema: z.ZodType<Prisma.FamilyMemberMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  personId: z.lazy(() => SortOrderSchema).optional(),
  position: z.lazy(() => SortOrderSchema).optional(),
  relation: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  relatedPersonId: z.lazy(() => SortOrderSchema).optional(),
});

export const FamilyMemberSumOrderByAggregateInputSchema: z.ZodType<Prisma.FamilyMemberSumOrderByAggregateInput> = z.strictObject({
  position: z.lazy(() => SortOrderSchema).optional(),
});

export const SessionCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateNestedManyWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema), z.lazy(() => SessionCreateWithoutUserInputSchema).array(), z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema), z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema), z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema), z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
});

export const SessionUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedCreateNestedManyWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema), z.lazy(() => SessionCreateWithoutUserInputSchema).array(), z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema), z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema), z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema), z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
});

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.strictObject({
  set: z.string().optional(),
});

export const NullableEnumRoleFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableEnumRoleFieldUpdateOperationsInput> = z.strictObject({
  set: z.lazy(() => RoleSchema).optional().nullable(),
});

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.strictObject({
  set: z.coerce.date().optional(),
});

export const SessionUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.SessionUpdateManyWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema), z.lazy(() => SessionCreateWithoutUserInputSchema).array(), z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema), z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema), z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => SessionWhereUniqueInputSchema), z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema), z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SessionWhereUniqueInputSchema), z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema), z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SessionScalarWhereInputSchema), z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
});

export const SessionUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema), z.lazy(() => SessionCreateWithoutUserInputSchema).array(), z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema), z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema), z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => SessionWhereUniqueInputSchema), z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema), z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SessionWhereUniqueInputSchema), z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema), z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SessionScalarWhereInputSchema), z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
});

export const UserCreateNestedOneWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutSessionsInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema), z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSessionsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
});

export const UserUpdateOneRequiredWithoutSessionsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutSessionsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema), z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSessionsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutSessionsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutSessionsInputSchema), z.lazy(() => UserUpdateWithoutSessionsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema) ]).optional(),
});

export const PersonCreatealtNamesInputSchema: z.ZodType<Prisma.PersonCreatealtNamesInput> = z.strictObject({
  set: z.string().array(),
});

export const ReignCreateNestedOneWithoutPersonInputSchema: z.ZodType<Prisma.ReignCreateNestedOneWithoutPersonInput> = z.strictObject({
  create: z.union([ z.lazy(() => ReignCreateWithoutPersonInputSchema), z.lazy(() => ReignUncheckedCreateWithoutPersonInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ReignCreateOrConnectWithoutPersonInputSchema).optional(),
  connect: z.lazy(() => ReignWhereUniqueInputSchema).optional(),
});

export const MinistryCreateNestedOneWithoutPersonInputSchema: z.ZodType<Prisma.MinistryCreateNestedOneWithoutPersonInput> = z.strictObject({
  create: z.union([ z.lazy(() => MinistryCreateWithoutPersonInputSchema), z.lazy(() => MinistryUncheckedCreateWithoutPersonInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MinistryCreateOrConnectWithoutPersonInputSchema).optional(),
  connect: z.lazy(() => MinistryWhereUniqueInputSchema).optional(),
});

export const DatingCreateNestedManyWithoutPersonInputSchema: z.ZodType<Prisma.DatingCreateNestedManyWithoutPersonInput> = z.strictObject({
  create: z.union([ z.lazy(() => DatingCreateWithoutPersonInputSchema), z.lazy(() => DatingCreateWithoutPersonInputSchema).array(), z.lazy(() => DatingUncheckedCreateWithoutPersonInputSchema), z.lazy(() => DatingUncheckedCreateWithoutPersonInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DatingCreateOrConnectWithoutPersonInputSchema), z.lazy(() => DatingCreateOrConnectWithoutPersonInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DatingCreateManyPersonInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DatingWhereUniqueInputSchema), z.lazy(() => DatingWhereUniqueInputSchema).array() ]).optional(),
});

export const FamilyMemberCreateNestedManyWithoutPersonInputSchema: z.ZodType<Prisma.FamilyMemberCreateNestedManyWithoutPersonInput> = z.strictObject({
  create: z.union([ z.lazy(() => FamilyMemberCreateWithoutPersonInputSchema), z.lazy(() => FamilyMemberCreateWithoutPersonInputSchema).array(), z.lazy(() => FamilyMemberUncheckedCreateWithoutPersonInputSchema), z.lazy(() => FamilyMemberUncheckedCreateWithoutPersonInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FamilyMemberCreateOrConnectWithoutPersonInputSchema), z.lazy(() => FamilyMemberCreateOrConnectWithoutPersonInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FamilyMemberCreateManyPersonInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => FamilyMemberWhereUniqueInputSchema), z.lazy(() => FamilyMemberWhereUniqueInputSchema).array() ]).optional(),
});

export const PassageCreateNestedManyWithoutPersonInputSchema: z.ZodType<Prisma.PassageCreateNestedManyWithoutPersonInput> = z.strictObject({
  create: z.union([ z.lazy(() => PassageCreateWithoutPersonInputSchema), z.lazy(() => PassageCreateWithoutPersonInputSchema).array(), z.lazy(() => PassageUncheckedCreateWithoutPersonInputSchema), z.lazy(() => PassageUncheckedCreateWithoutPersonInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PassageCreateOrConnectWithoutPersonInputSchema), z.lazy(() => PassageCreateOrConnectWithoutPersonInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PassageCreateManyPersonInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PassageWhereUniqueInputSchema), z.lazy(() => PassageWhereUniqueInputSchema).array() ]).optional(),
});

export const ReignUncheckedCreateNestedOneWithoutPersonInputSchema: z.ZodType<Prisma.ReignUncheckedCreateNestedOneWithoutPersonInput> = z.strictObject({
  create: z.union([ z.lazy(() => ReignCreateWithoutPersonInputSchema), z.lazy(() => ReignUncheckedCreateWithoutPersonInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ReignCreateOrConnectWithoutPersonInputSchema).optional(),
  connect: z.lazy(() => ReignWhereUniqueInputSchema).optional(),
});

export const MinistryUncheckedCreateNestedOneWithoutPersonInputSchema: z.ZodType<Prisma.MinistryUncheckedCreateNestedOneWithoutPersonInput> = z.strictObject({
  create: z.union([ z.lazy(() => MinistryCreateWithoutPersonInputSchema), z.lazy(() => MinistryUncheckedCreateWithoutPersonInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MinistryCreateOrConnectWithoutPersonInputSchema).optional(),
  connect: z.lazy(() => MinistryWhereUniqueInputSchema).optional(),
});

export const DatingUncheckedCreateNestedManyWithoutPersonInputSchema: z.ZodType<Prisma.DatingUncheckedCreateNestedManyWithoutPersonInput> = z.strictObject({
  create: z.union([ z.lazy(() => DatingCreateWithoutPersonInputSchema), z.lazy(() => DatingCreateWithoutPersonInputSchema).array(), z.lazy(() => DatingUncheckedCreateWithoutPersonInputSchema), z.lazy(() => DatingUncheckedCreateWithoutPersonInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DatingCreateOrConnectWithoutPersonInputSchema), z.lazy(() => DatingCreateOrConnectWithoutPersonInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DatingCreateManyPersonInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DatingWhereUniqueInputSchema), z.lazy(() => DatingWhereUniqueInputSchema).array() ]).optional(),
});

export const FamilyMemberUncheckedCreateNestedManyWithoutPersonInputSchema: z.ZodType<Prisma.FamilyMemberUncheckedCreateNestedManyWithoutPersonInput> = z.strictObject({
  create: z.union([ z.lazy(() => FamilyMemberCreateWithoutPersonInputSchema), z.lazy(() => FamilyMemberCreateWithoutPersonInputSchema).array(), z.lazy(() => FamilyMemberUncheckedCreateWithoutPersonInputSchema), z.lazy(() => FamilyMemberUncheckedCreateWithoutPersonInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FamilyMemberCreateOrConnectWithoutPersonInputSchema), z.lazy(() => FamilyMemberCreateOrConnectWithoutPersonInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FamilyMemberCreateManyPersonInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => FamilyMemberWhereUniqueInputSchema), z.lazy(() => FamilyMemberWhereUniqueInputSchema).array() ]).optional(),
});

export const PassageUncheckedCreateNestedManyWithoutPersonInputSchema: z.ZodType<Prisma.PassageUncheckedCreateNestedManyWithoutPersonInput> = z.strictObject({
  create: z.union([ z.lazy(() => PassageCreateWithoutPersonInputSchema), z.lazy(() => PassageCreateWithoutPersonInputSchema).array(), z.lazy(() => PassageUncheckedCreateWithoutPersonInputSchema), z.lazy(() => PassageUncheckedCreateWithoutPersonInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PassageCreateOrConnectWithoutPersonInputSchema), z.lazy(() => PassageCreateOrConnectWithoutPersonInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PassageCreateManyPersonInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PassageWhereUniqueInputSchema), z.lazy(() => PassageWhereUniqueInputSchema).array() ]).optional(),
});

export const PersonUpdatealtNamesInputSchema: z.ZodType<Prisma.PersonUpdatealtNamesInput> = z.strictObject({
  set: z.string().array().optional(),
  push: z.union([ z.string(),z.string().array() ]).optional(),
});

export const ReignUpdateOneWithoutPersonNestedInputSchema: z.ZodType<Prisma.ReignUpdateOneWithoutPersonNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ReignCreateWithoutPersonInputSchema), z.lazy(() => ReignUncheckedCreateWithoutPersonInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ReignCreateOrConnectWithoutPersonInputSchema).optional(),
  upsert: z.lazy(() => ReignUpsertWithoutPersonInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => ReignWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => ReignWhereInputSchema) ]).optional(),
  connect: z.lazy(() => ReignWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ReignUpdateToOneWithWhereWithoutPersonInputSchema), z.lazy(() => ReignUpdateWithoutPersonInputSchema), z.lazy(() => ReignUncheckedUpdateWithoutPersonInputSchema) ]).optional(),
});

export const MinistryUpdateOneWithoutPersonNestedInputSchema: z.ZodType<Prisma.MinistryUpdateOneWithoutPersonNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => MinistryCreateWithoutPersonInputSchema), z.lazy(() => MinistryUncheckedCreateWithoutPersonInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MinistryCreateOrConnectWithoutPersonInputSchema).optional(),
  upsert: z.lazy(() => MinistryUpsertWithoutPersonInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => MinistryWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => MinistryWhereInputSchema) ]).optional(),
  connect: z.lazy(() => MinistryWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => MinistryUpdateToOneWithWhereWithoutPersonInputSchema), z.lazy(() => MinistryUpdateWithoutPersonInputSchema), z.lazy(() => MinistryUncheckedUpdateWithoutPersonInputSchema) ]).optional(),
});

export const DatingUpdateManyWithoutPersonNestedInputSchema: z.ZodType<Prisma.DatingUpdateManyWithoutPersonNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => DatingCreateWithoutPersonInputSchema), z.lazy(() => DatingCreateWithoutPersonInputSchema).array(), z.lazy(() => DatingUncheckedCreateWithoutPersonInputSchema), z.lazy(() => DatingUncheckedCreateWithoutPersonInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DatingCreateOrConnectWithoutPersonInputSchema), z.lazy(() => DatingCreateOrConnectWithoutPersonInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DatingUpsertWithWhereUniqueWithoutPersonInputSchema), z.lazy(() => DatingUpsertWithWhereUniqueWithoutPersonInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DatingCreateManyPersonInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => DatingWhereUniqueInputSchema), z.lazy(() => DatingWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DatingWhereUniqueInputSchema), z.lazy(() => DatingWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DatingWhereUniqueInputSchema), z.lazy(() => DatingWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DatingWhereUniqueInputSchema), z.lazy(() => DatingWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DatingUpdateWithWhereUniqueWithoutPersonInputSchema), z.lazy(() => DatingUpdateWithWhereUniqueWithoutPersonInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DatingUpdateManyWithWhereWithoutPersonInputSchema), z.lazy(() => DatingUpdateManyWithWhereWithoutPersonInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DatingScalarWhereInputSchema), z.lazy(() => DatingScalarWhereInputSchema).array() ]).optional(),
});

export const FamilyMemberUpdateManyWithoutPersonNestedInputSchema: z.ZodType<Prisma.FamilyMemberUpdateManyWithoutPersonNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => FamilyMemberCreateWithoutPersonInputSchema), z.lazy(() => FamilyMemberCreateWithoutPersonInputSchema).array(), z.lazy(() => FamilyMemberUncheckedCreateWithoutPersonInputSchema), z.lazy(() => FamilyMemberUncheckedCreateWithoutPersonInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FamilyMemberCreateOrConnectWithoutPersonInputSchema), z.lazy(() => FamilyMemberCreateOrConnectWithoutPersonInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => FamilyMemberUpsertWithWhereUniqueWithoutPersonInputSchema), z.lazy(() => FamilyMemberUpsertWithWhereUniqueWithoutPersonInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FamilyMemberCreateManyPersonInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => FamilyMemberWhereUniqueInputSchema), z.lazy(() => FamilyMemberWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => FamilyMemberWhereUniqueInputSchema), z.lazy(() => FamilyMemberWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => FamilyMemberWhereUniqueInputSchema), z.lazy(() => FamilyMemberWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => FamilyMemberWhereUniqueInputSchema), z.lazy(() => FamilyMemberWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => FamilyMemberUpdateWithWhereUniqueWithoutPersonInputSchema), z.lazy(() => FamilyMemberUpdateWithWhereUniqueWithoutPersonInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => FamilyMemberUpdateManyWithWhereWithoutPersonInputSchema), z.lazy(() => FamilyMemberUpdateManyWithWhereWithoutPersonInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => FamilyMemberScalarWhereInputSchema), z.lazy(() => FamilyMemberScalarWhereInputSchema).array() ]).optional(),
});

export const PassageUpdateManyWithoutPersonNestedInputSchema: z.ZodType<Prisma.PassageUpdateManyWithoutPersonNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => PassageCreateWithoutPersonInputSchema), z.lazy(() => PassageCreateWithoutPersonInputSchema).array(), z.lazy(() => PassageUncheckedCreateWithoutPersonInputSchema), z.lazy(() => PassageUncheckedCreateWithoutPersonInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PassageCreateOrConnectWithoutPersonInputSchema), z.lazy(() => PassageCreateOrConnectWithoutPersonInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PassageUpsertWithWhereUniqueWithoutPersonInputSchema), z.lazy(() => PassageUpsertWithWhereUniqueWithoutPersonInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PassageCreateManyPersonInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PassageWhereUniqueInputSchema), z.lazy(() => PassageWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PassageWhereUniqueInputSchema), z.lazy(() => PassageWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PassageWhereUniqueInputSchema), z.lazy(() => PassageWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PassageWhereUniqueInputSchema), z.lazy(() => PassageWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PassageUpdateWithWhereUniqueWithoutPersonInputSchema), z.lazy(() => PassageUpdateWithWhereUniqueWithoutPersonInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PassageUpdateManyWithWhereWithoutPersonInputSchema), z.lazy(() => PassageUpdateManyWithWhereWithoutPersonInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PassageScalarWhereInputSchema), z.lazy(() => PassageScalarWhereInputSchema).array() ]).optional(),
});

export const ReignUncheckedUpdateOneWithoutPersonNestedInputSchema: z.ZodType<Prisma.ReignUncheckedUpdateOneWithoutPersonNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ReignCreateWithoutPersonInputSchema), z.lazy(() => ReignUncheckedCreateWithoutPersonInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ReignCreateOrConnectWithoutPersonInputSchema).optional(),
  upsert: z.lazy(() => ReignUpsertWithoutPersonInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => ReignWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => ReignWhereInputSchema) ]).optional(),
  connect: z.lazy(() => ReignWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ReignUpdateToOneWithWhereWithoutPersonInputSchema), z.lazy(() => ReignUpdateWithoutPersonInputSchema), z.lazy(() => ReignUncheckedUpdateWithoutPersonInputSchema) ]).optional(),
});

export const MinistryUncheckedUpdateOneWithoutPersonNestedInputSchema: z.ZodType<Prisma.MinistryUncheckedUpdateOneWithoutPersonNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => MinistryCreateWithoutPersonInputSchema), z.lazy(() => MinistryUncheckedCreateWithoutPersonInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MinistryCreateOrConnectWithoutPersonInputSchema).optional(),
  upsert: z.lazy(() => MinistryUpsertWithoutPersonInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => MinistryWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => MinistryWhereInputSchema) ]).optional(),
  connect: z.lazy(() => MinistryWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => MinistryUpdateToOneWithWhereWithoutPersonInputSchema), z.lazy(() => MinistryUpdateWithoutPersonInputSchema), z.lazy(() => MinistryUncheckedUpdateWithoutPersonInputSchema) ]).optional(),
});

export const DatingUncheckedUpdateManyWithoutPersonNestedInputSchema: z.ZodType<Prisma.DatingUncheckedUpdateManyWithoutPersonNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => DatingCreateWithoutPersonInputSchema), z.lazy(() => DatingCreateWithoutPersonInputSchema).array(), z.lazy(() => DatingUncheckedCreateWithoutPersonInputSchema), z.lazy(() => DatingUncheckedCreateWithoutPersonInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DatingCreateOrConnectWithoutPersonInputSchema), z.lazy(() => DatingCreateOrConnectWithoutPersonInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DatingUpsertWithWhereUniqueWithoutPersonInputSchema), z.lazy(() => DatingUpsertWithWhereUniqueWithoutPersonInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DatingCreateManyPersonInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => DatingWhereUniqueInputSchema), z.lazy(() => DatingWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DatingWhereUniqueInputSchema), z.lazy(() => DatingWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DatingWhereUniqueInputSchema), z.lazy(() => DatingWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DatingWhereUniqueInputSchema), z.lazy(() => DatingWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DatingUpdateWithWhereUniqueWithoutPersonInputSchema), z.lazy(() => DatingUpdateWithWhereUniqueWithoutPersonInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DatingUpdateManyWithWhereWithoutPersonInputSchema), z.lazy(() => DatingUpdateManyWithWhereWithoutPersonInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DatingScalarWhereInputSchema), z.lazy(() => DatingScalarWhereInputSchema).array() ]).optional(),
});

export const FamilyMemberUncheckedUpdateManyWithoutPersonNestedInputSchema: z.ZodType<Prisma.FamilyMemberUncheckedUpdateManyWithoutPersonNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => FamilyMemberCreateWithoutPersonInputSchema), z.lazy(() => FamilyMemberCreateWithoutPersonInputSchema).array(), z.lazy(() => FamilyMemberUncheckedCreateWithoutPersonInputSchema), z.lazy(() => FamilyMemberUncheckedCreateWithoutPersonInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FamilyMemberCreateOrConnectWithoutPersonInputSchema), z.lazy(() => FamilyMemberCreateOrConnectWithoutPersonInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => FamilyMemberUpsertWithWhereUniqueWithoutPersonInputSchema), z.lazy(() => FamilyMemberUpsertWithWhereUniqueWithoutPersonInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FamilyMemberCreateManyPersonInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => FamilyMemberWhereUniqueInputSchema), z.lazy(() => FamilyMemberWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => FamilyMemberWhereUniqueInputSchema), z.lazy(() => FamilyMemberWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => FamilyMemberWhereUniqueInputSchema), z.lazy(() => FamilyMemberWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => FamilyMemberWhereUniqueInputSchema), z.lazy(() => FamilyMemberWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => FamilyMemberUpdateWithWhereUniqueWithoutPersonInputSchema), z.lazy(() => FamilyMemberUpdateWithWhereUniqueWithoutPersonInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => FamilyMemberUpdateManyWithWhereWithoutPersonInputSchema), z.lazy(() => FamilyMemberUpdateManyWithWhereWithoutPersonInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => FamilyMemberScalarWhereInputSchema), z.lazy(() => FamilyMemberScalarWhereInputSchema).array() ]).optional(),
});

export const PassageUncheckedUpdateManyWithoutPersonNestedInputSchema: z.ZodType<Prisma.PassageUncheckedUpdateManyWithoutPersonNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => PassageCreateWithoutPersonInputSchema), z.lazy(() => PassageCreateWithoutPersonInputSchema).array(), z.lazy(() => PassageUncheckedCreateWithoutPersonInputSchema), z.lazy(() => PassageUncheckedCreateWithoutPersonInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PassageCreateOrConnectWithoutPersonInputSchema), z.lazy(() => PassageCreateOrConnectWithoutPersonInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PassageUpsertWithWhereUniqueWithoutPersonInputSchema), z.lazy(() => PassageUpsertWithWhereUniqueWithoutPersonInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PassageCreateManyPersonInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PassageWhereUniqueInputSchema), z.lazy(() => PassageWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PassageWhereUniqueInputSchema), z.lazy(() => PassageWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PassageWhereUniqueInputSchema), z.lazy(() => PassageWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PassageWhereUniqueInputSchema), z.lazy(() => PassageWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PassageUpdateWithWhereUniqueWithoutPersonInputSchema), z.lazy(() => PassageUpdateWithWhereUniqueWithoutPersonInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PassageUpdateManyWithWhereWithoutPersonInputSchema), z.lazy(() => PassageUpdateManyWithWhereWithoutPersonInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PassageScalarWhereInputSchema), z.lazy(() => PassageScalarWhereInputSchema).array() ]).optional(),
});

export const PersonCreateNestedOneWithoutReignInputSchema: z.ZodType<Prisma.PersonCreateNestedOneWithoutReignInput> = z.strictObject({
  create: z.union([ z.lazy(() => PersonCreateWithoutReignInputSchema), z.lazy(() => PersonUncheckedCreateWithoutReignInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PersonCreateOrConnectWithoutReignInputSchema).optional(),
  connect: z.lazy(() => PersonWhereUniqueInputSchema).optional(),
});

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.strictObject({
  set: z.string().optional().nullable(),
});

export const PersonUpdateOneRequiredWithoutReignNestedInputSchema: z.ZodType<Prisma.PersonUpdateOneRequiredWithoutReignNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => PersonCreateWithoutReignInputSchema), z.lazy(() => PersonUncheckedCreateWithoutReignInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PersonCreateOrConnectWithoutReignInputSchema).optional(),
  upsert: z.lazy(() => PersonUpsertWithoutReignInputSchema).optional(),
  connect: z.lazy(() => PersonWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PersonUpdateToOneWithWhereWithoutReignInputSchema), z.lazy(() => PersonUpdateWithoutReignInputSchema), z.lazy(() => PersonUncheckedUpdateWithoutReignInputSchema) ]).optional(),
});

export const MinistryCreateaudienceInputSchema: z.ZodType<Prisma.MinistryCreateaudienceInput> = z.strictObject({
  set: z.string().array(),
});

export const PersonCreateNestedOneWithoutMinistryInputSchema: z.ZodType<Prisma.PersonCreateNestedOneWithoutMinistryInput> = z.strictObject({
  create: z.union([ z.lazy(() => PersonCreateWithoutMinistryInputSchema), z.lazy(() => PersonUncheckedCreateWithoutMinistryInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PersonCreateOrConnectWithoutMinistryInputSchema).optional(),
  connect: z.lazy(() => PersonWhereUniqueInputSchema).optional(),
});

export const MinistryUpdateaudienceInputSchema: z.ZodType<Prisma.MinistryUpdateaudienceInput> = z.strictObject({
  set: z.string().array().optional(),
  push: z.union([ z.string(),z.string().array() ]).optional(),
});

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.strictObject({
  set: z.boolean().optional(),
});

export const PersonUpdateOneRequiredWithoutMinistryNestedInputSchema: z.ZodType<Prisma.PersonUpdateOneRequiredWithoutMinistryNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => PersonCreateWithoutMinistryInputSchema), z.lazy(() => PersonUncheckedCreateWithoutMinistryInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PersonCreateOrConnectWithoutMinistryInputSchema).optional(),
  upsert: z.lazy(() => PersonUpsertWithoutMinistryInputSchema).optional(),
  connect: z.lazy(() => PersonWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PersonUpdateToOneWithWhereWithoutMinistryInputSchema), z.lazy(() => PersonUpdateWithoutMinistryInputSchema), z.lazy(() => PersonUncheckedUpdateWithoutMinistryInputSchema) ]).optional(),
});

export const PersonCreateNestedOneWithoutDatingsInputSchema: z.ZodType<Prisma.PersonCreateNestedOneWithoutDatingsInput> = z.strictObject({
  create: z.union([ z.lazy(() => PersonCreateWithoutDatingsInputSchema), z.lazy(() => PersonUncheckedCreateWithoutDatingsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PersonCreateOrConnectWithoutDatingsInputSchema).optional(),
  connect: z.lazy(() => PersonWhereUniqueInputSchema).optional(),
});

export const EvidenceCreateNestedManyWithoutDatingInputSchema: z.ZodType<Prisma.EvidenceCreateNestedManyWithoutDatingInput> = z.strictObject({
  create: z.union([ z.lazy(() => EvidenceCreateWithoutDatingInputSchema), z.lazy(() => EvidenceCreateWithoutDatingInputSchema).array(), z.lazy(() => EvidenceUncheckedCreateWithoutDatingInputSchema), z.lazy(() => EvidenceUncheckedCreateWithoutDatingInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EvidenceCreateOrConnectWithoutDatingInputSchema), z.lazy(() => EvidenceCreateOrConnectWithoutDatingInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EvidenceCreateManyDatingInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => EvidenceWhereUniqueInputSchema), z.lazy(() => EvidenceWhereUniqueInputSchema).array() ]).optional(),
});

export const CitationCreateNestedManyWithoutDatingInputSchema: z.ZodType<Prisma.CitationCreateNestedManyWithoutDatingInput> = z.strictObject({
  create: z.union([ z.lazy(() => CitationCreateWithoutDatingInputSchema), z.lazy(() => CitationCreateWithoutDatingInputSchema).array(), z.lazy(() => CitationUncheckedCreateWithoutDatingInputSchema), z.lazy(() => CitationUncheckedCreateWithoutDatingInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CitationCreateOrConnectWithoutDatingInputSchema), z.lazy(() => CitationCreateOrConnectWithoutDatingInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CitationCreateManyDatingInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CitationWhereUniqueInputSchema), z.lazy(() => CitationWhereUniqueInputSchema).array() ]).optional(),
});

export const EvidenceUncheckedCreateNestedManyWithoutDatingInputSchema: z.ZodType<Prisma.EvidenceUncheckedCreateNestedManyWithoutDatingInput> = z.strictObject({
  create: z.union([ z.lazy(() => EvidenceCreateWithoutDatingInputSchema), z.lazy(() => EvidenceCreateWithoutDatingInputSchema).array(), z.lazy(() => EvidenceUncheckedCreateWithoutDatingInputSchema), z.lazy(() => EvidenceUncheckedCreateWithoutDatingInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EvidenceCreateOrConnectWithoutDatingInputSchema), z.lazy(() => EvidenceCreateOrConnectWithoutDatingInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EvidenceCreateManyDatingInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => EvidenceWhereUniqueInputSchema), z.lazy(() => EvidenceWhereUniqueInputSchema).array() ]).optional(),
});

export const CitationUncheckedCreateNestedManyWithoutDatingInputSchema: z.ZodType<Prisma.CitationUncheckedCreateNestedManyWithoutDatingInput> = z.strictObject({
  create: z.union([ z.lazy(() => CitationCreateWithoutDatingInputSchema), z.lazy(() => CitationCreateWithoutDatingInputSchema).array(), z.lazy(() => CitationUncheckedCreateWithoutDatingInputSchema), z.lazy(() => CitationUncheckedCreateWithoutDatingInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CitationCreateOrConnectWithoutDatingInputSchema), z.lazy(() => CitationCreateOrConnectWithoutDatingInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CitationCreateManyDatingInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CitationWhereUniqueInputSchema), z.lazy(() => CitationWhereUniqueInputSchema).array() ]).optional(),
});

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.strictObject({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional(),
});

export const NullableIntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableIntFieldUpdateOperationsInput> = z.strictObject({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional(),
});

export const PersonUpdateOneRequiredWithoutDatingsNestedInputSchema: z.ZodType<Prisma.PersonUpdateOneRequiredWithoutDatingsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => PersonCreateWithoutDatingsInputSchema), z.lazy(() => PersonUncheckedCreateWithoutDatingsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PersonCreateOrConnectWithoutDatingsInputSchema).optional(),
  upsert: z.lazy(() => PersonUpsertWithoutDatingsInputSchema).optional(),
  connect: z.lazy(() => PersonWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PersonUpdateToOneWithWhereWithoutDatingsInputSchema), z.lazy(() => PersonUpdateWithoutDatingsInputSchema), z.lazy(() => PersonUncheckedUpdateWithoutDatingsInputSchema) ]).optional(),
});

export const EvidenceUpdateManyWithoutDatingNestedInputSchema: z.ZodType<Prisma.EvidenceUpdateManyWithoutDatingNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => EvidenceCreateWithoutDatingInputSchema), z.lazy(() => EvidenceCreateWithoutDatingInputSchema).array(), z.lazy(() => EvidenceUncheckedCreateWithoutDatingInputSchema), z.lazy(() => EvidenceUncheckedCreateWithoutDatingInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EvidenceCreateOrConnectWithoutDatingInputSchema), z.lazy(() => EvidenceCreateOrConnectWithoutDatingInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => EvidenceUpsertWithWhereUniqueWithoutDatingInputSchema), z.lazy(() => EvidenceUpsertWithWhereUniqueWithoutDatingInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EvidenceCreateManyDatingInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => EvidenceWhereUniqueInputSchema), z.lazy(() => EvidenceWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => EvidenceWhereUniqueInputSchema), z.lazy(() => EvidenceWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => EvidenceWhereUniqueInputSchema), z.lazy(() => EvidenceWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => EvidenceWhereUniqueInputSchema), z.lazy(() => EvidenceWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => EvidenceUpdateWithWhereUniqueWithoutDatingInputSchema), z.lazy(() => EvidenceUpdateWithWhereUniqueWithoutDatingInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => EvidenceUpdateManyWithWhereWithoutDatingInputSchema), z.lazy(() => EvidenceUpdateManyWithWhereWithoutDatingInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => EvidenceScalarWhereInputSchema), z.lazy(() => EvidenceScalarWhereInputSchema).array() ]).optional(),
});

export const CitationUpdateManyWithoutDatingNestedInputSchema: z.ZodType<Prisma.CitationUpdateManyWithoutDatingNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => CitationCreateWithoutDatingInputSchema), z.lazy(() => CitationCreateWithoutDatingInputSchema).array(), z.lazy(() => CitationUncheckedCreateWithoutDatingInputSchema), z.lazy(() => CitationUncheckedCreateWithoutDatingInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CitationCreateOrConnectWithoutDatingInputSchema), z.lazy(() => CitationCreateOrConnectWithoutDatingInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CitationUpsertWithWhereUniqueWithoutDatingInputSchema), z.lazy(() => CitationUpsertWithWhereUniqueWithoutDatingInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CitationCreateManyDatingInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CitationWhereUniqueInputSchema), z.lazy(() => CitationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CitationWhereUniqueInputSchema), z.lazy(() => CitationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CitationWhereUniqueInputSchema), z.lazy(() => CitationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CitationWhereUniqueInputSchema), z.lazy(() => CitationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CitationUpdateWithWhereUniqueWithoutDatingInputSchema), z.lazy(() => CitationUpdateWithWhereUniqueWithoutDatingInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CitationUpdateManyWithWhereWithoutDatingInputSchema), z.lazy(() => CitationUpdateManyWithWhereWithoutDatingInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CitationScalarWhereInputSchema), z.lazy(() => CitationScalarWhereInputSchema).array() ]).optional(),
});

export const EvidenceUncheckedUpdateManyWithoutDatingNestedInputSchema: z.ZodType<Prisma.EvidenceUncheckedUpdateManyWithoutDatingNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => EvidenceCreateWithoutDatingInputSchema), z.lazy(() => EvidenceCreateWithoutDatingInputSchema).array(), z.lazy(() => EvidenceUncheckedCreateWithoutDatingInputSchema), z.lazy(() => EvidenceUncheckedCreateWithoutDatingInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EvidenceCreateOrConnectWithoutDatingInputSchema), z.lazy(() => EvidenceCreateOrConnectWithoutDatingInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => EvidenceUpsertWithWhereUniqueWithoutDatingInputSchema), z.lazy(() => EvidenceUpsertWithWhereUniqueWithoutDatingInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EvidenceCreateManyDatingInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => EvidenceWhereUniqueInputSchema), z.lazy(() => EvidenceWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => EvidenceWhereUniqueInputSchema), z.lazy(() => EvidenceWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => EvidenceWhereUniqueInputSchema), z.lazy(() => EvidenceWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => EvidenceWhereUniqueInputSchema), z.lazy(() => EvidenceWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => EvidenceUpdateWithWhereUniqueWithoutDatingInputSchema), z.lazy(() => EvidenceUpdateWithWhereUniqueWithoutDatingInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => EvidenceUpdateManyWithWhereWithoutDatingInputSchema), z.lazy(() => EvidenceUpdateManyWithWhereWithoutDatingInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => EvidenceScalarWhereInputSchema), z.lazy(() => EvidenceScalarWhereInputSchema).array() ]).optional(),
});

export const CitationUncheckedUpdateManyWithoutDatingNestedInputSchema: z.ZodType<Prisma.CitationUncheckedUpdateManyWithoutDatingNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => CitationCreateWithoutDatingInputSchema), z.lazy(() => CitationCreateWithoutDatingInputSchema).array(), z.lazy(() => CitationUncheckedCreateWithoutDatingInputSchema), z.lazy(() => CitationUncheckedCreateWithoutDatingInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CitationCreateOrConnectWithoutDatingInputSchema), z.lazy(() => CitationCreateOrConnectWithoutDatingInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CitationUpsertWithWhereUniqueWithoutDatingInputSchema), z.lazy(() => CitationUpsertWithWhereUniqueWithoutDatingInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CitationCreateManyDatingInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CitationWhereUniqueInputSchema), z.lazy(() => CitationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CitationWhereUniqueInputSchema), z.lazy(() => CitationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CitationWhereUniqueInputSchema), z.lazy(() => CitationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CitationWhereUniqueInputSchema), z.lazy(() => CitationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CitationUpdateWithWhereUniqueWithoutDatingInputSchema), z.lazy(() => CitationUpdateWithWhereUniqueWithoutDatingInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CitationUpdateManyWithWhereWithoutDatingInputSchema), z.lazy(() => CitationUpdateManyWithWhereWithoutDatingInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CitationScalarWhereInputSchema), z.lazy(() => CitationScalarWhereInputSchema).array() ]).optional(),
});

export const EvidenceCreatecontemporaryIdsInputSchema: z.ZodType<Prisma.EvidenceCreatecontemporaryIdsInput> = z.strictObject({
  set: z.string().array(),
});

export const DatingCreateNestedOneWithoutEvidenceInputSchema: z.ZodType<Prisma.DatingCreateNestedOneWithoutEvidenceInput> = z.strictObject({
  create: z.union([ z.lazy(() => DatingCreateWithoutEvidenceInputSchema), z.lazy(() => DatingUncheckedCreateWithoutEvidenceInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DatingCreateOrConnectWithoutEvidenceInputSchema).optional(),
  connect: z.lazy(() => DatingWhereUniqueInputSchema).optional(),
});

export const EvidenceUpdatecontemporaryIdsInputSchema: z.ZodType<Prisma.EvidenceUpdatecontemporaryIdsInput> = z.strictObject({
  set: z.string().array().optional(),
  push: z.union([ z.string(),z.string().array() ]).optional(),
});

export const DatingUpdateOneRequiredWithoutEvidenceNestedInputSchema: z.ZodType<Prisma.DatingUpdateOneRequiredWithoutEvidenceNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => DatingCreateWithoutEvidenceInputSchema), z.lazy(() => DatingUncheckedCreateWithoutEvidenceInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DatingCreateOrConnectWithoutEvidenceInputSchema).optional(),
  upsert: z.lazy(() => DatingUpsertWithoutEvidenceInputSchema).optional(),
  connect: z.lazy(() => DatingWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => DatingUpdateToOneWithWhereWithoutEvidenceInputSchema), z.lazy(() => DatingUpdateWithoutEvidenceInputSchema), z.lazy(() => DatingUncheckedUpdateWithoutEvidenceInputSchema) ]).optional(),
});

export const CitationCreateNestedManyWithoutSourceInputSchema: z.ZodType<Prisma.CitationCreateNestedManyWithoutSourceInput> = z.strictObject({
  create: z.union([ z.lazy(() => CitationCreateWithoutSourceInputSchema), z.lazy(() => CitationCreateWithoutSourceInputSchema).array(), z.lazy(() => CitationUncheckedCreateWithoutSourceInputSchema), z.lazy(() => CitationUncheckedCreateWithoutSourceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CitationCreateOrConnectWithoutSourceInputSchema), z.lazy(() => CitationCreateOrConnectWithoutSourceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CitationCreateManySourceInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CitationWhereUniqueInputSchema), z.lazy(() => CitationWhereUniqueInputSchema).array() ]).optional(),
});

export const CitationUncheckedCreateNestedManyWithoutSourceInputSchema: z.ZodType<Prisma.CitationUncheckedCreateNestedManyWithoutSourceInput> = z.strictObject({
  create: z.union([ z.lazy(() => CitationCreateWithoutSourceInputSchema), z.lazy(() => CitationCreateWithoutSourceInputSchema).array(), z.lazy(() => CitationUncheckedCreateWithoutSourceInputSchema), z.lazy(() => CitationUncheckedCreateWithoutSourceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CitationCreateOrConnectWithoutSourceInputSchema), z.lazy(() => CitationCreateOrConnectWithoutSourceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CitationCreateManySourceInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CitationWhereUniqueInputSchema), z.lazy(() => CitationWhereUniqueInputSchema).array() ]).optional(),
});

export const CitationUpdateManyWithoutSourceNestedInputSchema: z.ZodType<Prisma.CitationUpdateManyWithoutSourceNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => CitationCreateWithoutSourceInputSchema), z.lazy(() => CitationCreateWithoutSourceInputSchema).array(), z.lazy(() => CitationUncheckedCreateWithoutSourceInputSchema), z.lazy(() => CitationUncheckedCreateWithoutSourceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CitationCreateOrConnectWithoutSourceInputSchema), z.lazy(() => CitationCreateOrConnectWithoutSourceInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CitationUpsertWithWhereUniqueWithoutSourceInputSchema), z.lazy(() => CitationUpsertWithWhereUniqueWithoutSourceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CitationCreateManySourceInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CitationWhereUniqueInputSchema), z.lazy(() => CitationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CitationWhereUniqueInputSchema), z.lazy(() => CitationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CitationWhereUniqueInputSchema), z.lazy(() => CitationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CitationWhereUniqueInputSchema), z.lazy(() => CitationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CitationUpdateWithWhereUniqueWithoutSourceInputSchema), z.lazy(() => CitationUpdateWithWhereUniqueWithoutSourceInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CitationUpdateManyWithWhereWithoutSourceInputSchema), z.lazy(() => CitationUpdateManyWithWhereWithoutSourceInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CitationScalarWhereInputSchema), z.lazy(() => CitationScalarWhereInputSchema).array() ]).optional(),
});

export const CitationUncheckedUpdateManyWithoutSourceNestedInputSchema: z.ZodType<Prisma.CitationUncheckedUpdateManyWithoutSourceNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => CitationCreateWithoutSourceInputSchema), z.lazy(() => CitationCreateWithoutSourceInputSchema).array(), z.lazy(() => CitationUncheckedCreateWithoutSourceInputSchema), z.lazy(() => CitationUncheckedCreateWithoutSourceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CitationCreateOrConnectWithoutSourceInputSchema), z.lazy(() => CitationCreateOrConnectWithoutSourceInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CitationUpsertWithWhereUniqueWithoutSourceInputSchema), z.lazy(() => CitationUpsertWithWhereUniqueWithoutSourceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CitationCreateManySourceInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CitationWhereUniqueInputSchema), z.lazy(() => CitationWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CitationWhereUniqueInputSchema), z.lazy(() => CitationWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CitationWhereUniqueInputSchema), z.lazy(() => CitationWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CitationWhereUniqueInputSchema), z.lazy(() => CitationWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CitationUpdateWithWhereUniqueWithoutSourceInputSchema), z.lazy(() => CitationUpdateWithWhereUniqueWithoutSourceInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CitationUpdateManyWithWhereWithoutSourceInputSchema), z.lazy(() => CitationUpdateManyWithWhereWithoutSourceInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CitationScalarWhereInputSchema), z.lazy(() => CitationScalarWhereInputSchema).array() ]).optional(),
});

export const DatingCreateNestedOneWithoutCitationsInputSchema: z.ZodType<Prisma.DatingCreateNestedOneWithoutCitationsInput> = z.strictObject({
  create: z.union([ z.lazy(() => DatingCreateWithoutCitationsInputSchema), z.lazy(() => DatingUncheckedCreateWithoutCitationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DatingCreateOrConnectWithoutCitationsInputSchema).optional(),
  connect: z.lazy(() => DatingWhereUniqueInputSchema).optional(),
});

export const SourceCreateNestedOneWithoutCitationsInputSchema: z.ZodType<Prisma.SourceCreateNestedOneWithoutCitationsInput> = z.strictObject({
  create: z.union([ z.lazy(() => SourceCreateWithoutCitationsInputSchema), z.lazy(() => SourceUncheckedCreateWithoutCitationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SourceCreateOrConnectWithoutCitationsInputSchema).optional(),
  connect: z.lazy(() => SourceWhereUniqueInputSchema).optional(),
});

export const DatingUpdateOneRequiredWithoutCitationsNestedInputSchema: z.ZodType<Prisma.DatingUpdateOneRequiredWithoutCitationsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => DatingCreateWithoutCitationsInputSchema), z.lazy(() => DatingUncheckedCreateWithoutCitationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DatingCreateOrConnectWithoutCitationsInputSchema).optional(),
  upsert: z.lazy(() => DatingUpsertWithoutCitationsInputSchema).optional(),
  connect: z.lazy(() => DatingWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => DatingUpdateToOneWithWhereWithoutCitationsInputSchema), z.lazy(() => DatingUpdateWithoutCitationsInputSchema), z.lazy(() => DatingUncheckedUpdateWithoutCitationsInputSchema) ]).optional(),
});

export const SourceUpdateOneRequiredWithoutCitationsNestedInputSchema: z.ZodType<Prisma.SourceUpdateOneRequiredWithoutCitationsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => SourceCreateWithoutCitationsInputSchema), z.lazy(() => SourceUncheckedCreateWithoutCitationsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SourceCreateOrConnectWithoutCitationsInputSchema).optional(),
  upsert: z.lazy(() => SourceUpsertWithoutCitationsInputSchema).optional(),
  connect: z.lazy(() => SourceWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => SourceUpdateToOneWithWhereWithoutCitationsInputSchema), z.lazy(() => SourceUpdateWithoutCitationsInputSchema), z.lazy(() => SourceUncheckedUpdateWithoutCitationsInputSchema) ]).optional(),
});

export const PersonCreateNestedOneWithoutPassagesInputSchema: z.ZodType<Prisma.PersonCreateNestedOneWithoutPassagesInput> = z.strictObject({
  create: z.union([ z.lazy(() => PersonCreateWithoutPassagesInputSchema), z.lazy(() => PersonUncheckedCreateWithoutPassagesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PersonCreateOrConnectWithoutPassagesInputSchema).optional(),
  connect: z.lazy(() => PersonWhereUniqueInputSchema).optional(),
});

export const PersonUpdateOneRequiredWithoutPassagesNestedInputSchema: z.ZodType<Prisma.PersonUpdateOneRequiredWithoutPassagesNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => PersonCreateWithoutPassagesInputSchema), z.lazy(() => PersonUncheckedCreateWithoutPassagesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PersonCreateOrConnectWithoutPassagesInputSchema).optional(),
  upsert: z.lazy(() => PersonUpsertWithoutPassagesInputSchema).optional(),
  connect: z.lazy(() => PersonWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PersonUpdateToOneWithWhereWithoutPassagesInputSchema), z.lazy(() => PersonUpdateWithoutPassagesInputSchema), z.lazy(() => PersonUncheckedUpdateWithoutPassagesInputSchema) ]).optional(),
});

export const PersonCreateNestedOneWithoutFamilyInputSchema: z.ZodType<Prisma.PersonCreateNestedOneWithoutFamilyInput> = z.strictObject({
  create: z.union([ z.lazy(() => PersonCreateWithoutFamilyInputSchema), z.lazy(() => PersonUncheckedCreateWithoutFamilyInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PersonCreateOrConnectWithoutFamilyInputSchema).optional(),
  connect: z.lazy(() => PersonWhereUniqueInputSchema).optional(),
});

export const PersonUpdateOneRequiredWithoutFamilyNestedInputSchema: z.ZodType<Prisma.PersonUpdateOneRequiredWithoutFamilyNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => PersonCreateWithoutFamilyInputSchema), z.lazy(() => PersonUncheckedCreateWithoutFamilyInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PersonCreateOrConnectWithoutFamilyInputSchema).optional(),
  upsert: z.lazy(() => PersonUpsertWithoutFamilyInputSchema).optional(),
  connect: z.lazy(() => PersonWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PersonUpdateToOneWithWhereWithoutFamilyInputSchema), z.lazy(() => PersonUpdateWithoutFamilyInputSchema), z.lazy(() => PersonUncheckedUpdateWithoutFamilyInputSchema) ]).optional(),
});

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.strictObject({
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
});

export const NestedEnumRoleNullableFilterSchema: z.ZodType<Prisma.NestedEnumRoleNullableFilter> = z.strictObject({
  equals: z.lazy(() => RoleSchema).optional().nullable(),
  in: z.lazy(() => RoleSchema).array().optional().nullable(),
  notIn: z.lazy(() => RoleSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => RoleSchema), z.lazy(() => NestedEnumRoleNullableFilterSchema) ]).optional().nullable(),
});

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
});

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.strictObject({
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
  _max: z.lazy(() => NestedStringFilterSchema).optional(),
});

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
});

export const NestedEnumRoleNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumRoleNullableWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => RoleSchema).optional().nullable(),
  in: z.lazy(() => RoleSchema).array().optional().nullable(),
  notIn: z.lazy(() => RoleSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => RoleSchema), z.lazy(() => NestedEnumRoleNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumRoleNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumRoleNullableFilterSchema).optional(),
});

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
});

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.strictObject({
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
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
});

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.strictObject({
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
});

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.strictObject({
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
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
});

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.strictObject({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
});

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.strictObject({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional(),
});

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.strictObject({
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
  _max: z.lazy(() => NestedIntFilterSchema).optional(),
});

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
});

export const NestedIntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntNullableWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional(),
});

export const NestedFloatNullableFilterSchema: z.ZodType<Prisma.NestedFloatNullableFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
});

export const SessionCreateWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateWithoutUserInput> = z.strictObject({
  id: z.string(),
  expiresAt: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
});

export const SessionUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedCreateWithoutUserInput> = z.strictObject({
  id: z.string(),
  expiresAt: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
});

export const SessionCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateOrConnectWithoutUserInput> = z.strictObject({
  where: z.lazy(() => SessionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema), z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema) ]),
});

export const SessionCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.SessionCreateManyUserInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => SessionCreateManyUserInputSchema), z.lazy(() => SessionCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const SessionUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.SessionUpsertWithWhereUniqueWithoutUserInput> = z.strictObject({
  where: z.lazy(() => SessionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => SessionUpdateWithoutUserInputSchema), z.lazy(() => SessionUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema), z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema) ]),
});

export const SessionUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateWithWhereUniqueWithoutUserInput> = z.strictObject({
  where: z.lazy(() => SessionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => SessionUpdateWithoutUserInputSchema), z.lazy(() => SessionUncheckedUpdateWithoutUserInputSchema) ]),
});

export const SessionUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateManyWithWhereWithoutUserInput> = z.strictObject({
  where: z.lazy(() => SessionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => SessionUpdateManyMutationInputSchema), z.lazy(() => SessionUncheckedUpdateManyWithoutUserInputSchema) ]),
});

export const SessionScalarWhereInputSchema: z.ZodType<Prisma.SessionScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => SessionScalarWhereInputSchema), z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionScalarWhereInputSchema), z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
});

export const UserCreateWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateWithoutSessionsInput> = z.strictObject({
  id: z.uuid().optional(),
  email: z.string(),
  passwordHash: z.string(),
  role: z.lazy(() => RoleSchema).optional().nullable(),
  createdAt: z.coerce.date().optional(),
});

export const UserUncheckedCreateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutSessionsInput> = z.strictObject({
  id: z.uuid().optional(),
  email: z.string(),
  passwordHash: z.string(),
  role: z.lazy(() => RoleSchema).optional().nullable(),
  createdAt: z.coerce.date().optional(),
});

export const UserCreateOrConnectWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutSessionsInput> = z.strictObject({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema), z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]),
});

export const UserUpsertWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpsertWithoutSessionsInput> = z.strictObject({
  update: z.union([ z.lazy(() => UserUpdateWithoutSessionsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema), z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional(),
});

export const UserUpdateToOneWithWhereWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutSessionsInput> = z.strictObject({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutSessionsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema) ]),
});

export const UserUpdateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpdateWithoutSessionsInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  passwordHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => NullableEnumRoleFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const UserUncheckedUpdateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutSessionsInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  passwordHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => NullableEnumRoleFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ReignCreateWithoutPersonInputSchema: z.ZodType<Prisma.ReignCreateWithoutPersonInput> = z.strictObject({
  kingdom: z.string(),
  predecessorId: z.string().optional().nullable(),
  successorId: z.string().optional().nullable(),
  relationToPredecessor: z.string().optional().nullable(),
});

export const ReignUncheckedCreateWithoutPersonInputSchema: z.ZodType<Prisma.ReignUncheckedCreateWithoutPersonInput> = z.strictObject({
  kingdom: z.string(),
  predecessorId: z.string().optional().nullable(),
  successorId: z.string().optional().nullable(),
  relationToPredecessor: z.string().optional().nullable(),
});

export const ReignCreateOrConnectWithoutPersonInputSchema: z.ZodType<Prisma.ReignCreateOrConnectWithoutPersonInput> = z.strictObject({
  where: z.lazy(() => ReignWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ReignCreateWithoutPersonInputSchema), z.lazy(() => ReignUncheckedCreateWithoutPersonInputSchema) ]),
});

export const MinistryCreateWithoutPersonInputSchema: z.ZodType<Prisma.MinistryCreateWithoutPersonInput> = z.strictObject({
  audience: z.union([ z.lazy(() => MinistryCreateaudienceInputSchema), z.string().array() ]).optional(),
  hasBook: z.boolean(),
});

export const MinistryUncheckedCreateWithoutPersonInputSchema: z.ZodType<Prisma.MinistryUncheckedCreateWithoutPersonInput> = z.strictObject({
  audience: z.union([ z.lazy(() => MinistryCreateaudienceInputSchema), z.string().array() ]).optional(),
  hasBook: z.boolean(),
});

export const MinistryCreateOrConnectWithoutPersonInputSchema: z.ZodType<Prisma.MinistryCreateOrConnectWithoutPersonInput> = z.strictObject({
  where: z.lazy(() => MinistryWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MinistryCreateWithoutPersonInputSchema), z.lazy(() => MinistryUncheckedCreateWithoutPersonInputSchema) ]),
});

export const DatingCreateWithoutPersonInputSchema: z.ZodType<Prisma.DatingCreateWithoutPersonInput> = z.strictObject({
  id: z.string(),
  role: z.string(),
  position: z.number().int(),
  label: z.string().optional().nullable(),
  spanFrom: z.number().int(),
  spanTo: z.number().int(),
  approx: z.boolean(),
  coregencyFrom: z.number().int().optional().nullable(),
  confidence: z.string(),
  notes: z.string().optional().nullable(),
  evidence: z.lazy(() => EvidenceCreateNestedManyWithoutDatingInputSchema).optional(),
  citations: z.lazy(() => CitationCreateNestedManyWithoutDatingInputSchema).optional(),
});

export const DatingUncheckedCreateWithoutPersonInputSchema: z.ZodType<Prisma.DatingUncheckedCreateWithoutPersonInput> = z.strictObject({
  id: z.string(),
  role: z.string(),
  position: z.number().int(),
  label: z.string().optional().nullable(),
  spanFrom: z.number().int(),
  spanTo: z.number().int(),
  approx: z.boolean(),
  coregencyFrom: z.number().int().optional().nullable(),
  confidence: z.string(),
  notes: z.string().optional().nullable(),
  evidence: z.lazy(() => EvidenceUncheckedCreateNestedManyWithoutDatingInputSchema).optional(),
  citations: z.lazy(() => CitationUncheckedCreateNestedManyWithoutDatingInputSchema).optional(),
});

export const DatingCreateOrConnectWithoutPersonInputSchema: z.ZodType<Prisma.DatingCreateOrConnectWithoutPersonInput> = z.strictObject({
  where: z.lazy(() => DatingWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DatingCreateWithoutPersonInputSchema), z.lazy(() => DatingUncheckedCreateWithoutPersonInputSchema) ]),
});

export const DatingCreateManyPersonInputEnvelopeSchema: z.ZodType<Prisma.DatingCreateManyPersonInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => DatingCreateManyPersonInputSchema), z.lazy(() => DatingCreateManyPersonInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const FamilyMemberCreateWithoutPersonInputSchema: z.ZodType<Prisma.FamilyMemberCreateWithoutPersonInput> = z.strictObject({
  id: z.string(),
  position: z.number().int(),
  relation: z.string(),
  name: z.string(),
  relatedPersonId: z.string().optional().nullable(),
});

export const FamilyMemberUncheckedCreateWithoutPersonInputSchema: z.ZodType<Prisma.FamilyMemberUncheckedCreateWithoutPersonInput> = z.strictObject({
  id: z.string(),
  position: z.number().int(),
  relation: z.string(),
  name: z.string(),
  relatedPersonId: z.string().optional().nullable(),
});

export const FamilyMemberCreateOrConnectWithoutPersonInputSchema: z.ZodType<Prisma.FamilyMemberCreateOrConnectWithoutPersonInput> = z.strictObject({
  where: z.lazy(() => FamilyMemberWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FamilyMemberCreateWithoutPersonInputSchema), z.lazy(() => FamilyMemberUncheckedCreateWithoutPersonInputSchema) ]),
});

export const FamilyMemberCreateManyPersonInputEnvelopeSchema: z.ZodType<Prisma.FamilyMemberCreateManyPersonInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => FamilyMemberCreateManyPersonInputSchema), z.lazy(() => FamilyMemberCreateManyPersonInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const PassageCreateWithoutPersonInputSchema: z.ZodType<Prisma.PassageCreateWithoutPersonInput> = z.strictObject({
  id: z.string(),
  position: z.number().int(),
  book: z.string(),
  fromChapter: z.number().int(),
  fromVerse: z.number().int().optional().nullable(),
  toChapter: z.number().int().optional().nullable(),
  toVerse: z.number().int().optional().nullable(),
  kind: z.string(),
  note: z.string().optional().nullable(),
});

export const PassageUncheckedCreateWithoutPersonInputSchema: z.ZodType<Prisma.PassageUncheckedCreateWithoutPersonInput> = z.strictObject({
  id: z.string(),
  position: z.number().int(),
  book: z.string(),
  fromChapter: z.number().int(),
  fromVerse: z.number().int().optional().nullable(),
  toChapter: z.number().int().optional().nullable(),
  toVerse: z.number().int().optional().nullable(),
  kind: z.string(),
  note: z.string().optional().nullable(),
});

export const PassageCreateOrConnectWithoutPersonInputSchema: z.ZodType<Prisma.PassageCreateOrConnectWithoutPersonInput> = z.strictObject({
  where: z.lazy(() => PassageWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PassageCreateWithoutPersonInputSchema), z.lazy(() => PassageUncheckedCreateWithoutPersonInputSchema) ]),
});

export const PassageCreateManyPersonInputEnvelopeSchema: z.ZodType<Prisma.PassageCreateManyPersonInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => PassageCreateManyPersonInputSchema), z.lazy(() => PassageCreateManyPersonInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const ReignUpsertWithoutPersonInputSchema: z.ZodType<Prisma.ReignUpsertWithoutPersonInput> = z.strictObject({
  update: z.union([ z.lazy(() => ReignUpdateWithoutPersonInputSchema), z.lazy(() => ReignUncheckedUpdateWithoutPersonInputSchema) ]),
  create: z.union([ z.lazy(() => ReignCreateWithoutPersonInputSchema), z.lazy(() => ReignUncheckedCreateWithoutPersonInputSchema) ]),
  where: z.lazy(() => ReignWhereInputSchema).optional(),
});

export const ReignUpdateToOneWithWhereWithoutPersonInputSchema: z.ZodType<Prisma.ReignUpdateToOneWithWhereWithoutPersonInput> = z.strictObject({
  where: z.lazy(() => ReignWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ReignUpdateWithoutPersonInputSchema), z.lazy(() => ReignUncheckedUpdateWithoutPersonInputSchema) ]),
});

export const ReignUpdateWithoutPersonInputSchema: z.ZodType<Prisma.ReignUpdateWithoutPersonInput> = z.strictObject({
  kingdom: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  predecessorId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  successorId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  relationToPredecessor: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const ReignUncheckedUpdateWithoutPersonInputSchema: z.ZodType<Prisma.ReignUncheckedUpdateWithoutPersonInput> = z.strictObject({
  kingdom: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  predecessorId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  successorId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  relationToPredecessor: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const MinistryUpsertWithoutPersonInputSchema: z.ZodType<Prisma.MinistryUpsertWithoutPersonInput> = z.strictObject({
  update: z.union([ z.lazy(() => MinistryUpdateWithoutPersonInputSchema), z.lazy(() => MinistryUncheckedUpdateWithoutPersonInputSchema) ]),
  create: z.union([ z.lazy(() => MinistryCreateWithoutPersonInputSchema), z.lazy(() => MinistryUncheckedCreateWithoutPersonInputSchema) ]),
  where: z.lazy(() => MinistryWhereInputSchema).optional(),
});

export const MinistryUpdateToOneWithWhereWithoutPersonInputSchema: z.ZodType<Prisma.MinistryUpdateToOneWithWhereWithoutPersonInput> = z.strictObject({
  where: z.lazy(() => MinistryWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => MinistryUpdateWithoutPersonInputSchema), z.lazy(() => MinistryUncheckedUpdateWithoutPersonInputSchema) ]),
});

export const MinistryUpdateWithoutPersonInputSchema: z.ZodType<Prisma.MinistryUpdateWithoutPersonInput> = z.strictObject({
  audience: z.union([ z.lazy(() => MinistryUpdateaudienceInputSchema), z.string().array() ]).optional(),
  hasBook: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
});

export const MinistryUncheckedUpdateWithoutPersonInputSchema: z.ZodType<Prisma.MinistryUncheckedUpdateWithoutPersonInput> = z.strictObject({
  audience: z.union([ z.lazy(() => MinistryUpdateaudienceInputSchema), z.string().array() ]).optional(),
  hasBook: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
});

export const DatingUpsertWithWhereUniqueWithoutPersonInputSchema: z.ZodType<Prisma.DatingUpsertWithWhereUniqueWithoutPersonInput> = z.strictObject({
  where: z.lazy(() => DatingWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => DatingUpdateWithoutPersonInputSchema), z.lazy(() => DatingUncheckedUpdateWithoutPersonInputSchema) ]),
  create: z.union([ z.lazy(() => DatingCreateWithoutPersonInputSchema), z.lazy(() => DatingUncheckedCreateWithoutPersonInputSchema) ]),
});

export const DatingUpdateWithWhereUniqueWithoutPersonInputSchema: z.ZodType<Prisma.DatingUpdateWithWhereUniqueWithoutPersonInput> = z.strictObject({
  where: z.lazy(() => DatingWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => DatingUpdateWithoutPersonInputSchema), z.lazy(() => DatingUncheckedUpdateWithoutPersonInputSchema) ]),
});

export const DatingUpdateManyWithWhereWithoutPersonInputSchema: z.ZodType<Prisma.DatingUpdateManyWithWhereWithoutPersonInput> = z.strictObject({
  where: z.lazy(() => DatingScalarWhereInputSchema),
  data: z.union([ z.lazy(() => DatingUpdateManyMutationInputSchema), z.lazy(() => DatingUncheckedUpdateManyWithoutPersonInputSchema) ]),
});

export const DatingScalarWhereInputSchema: z.ZodType<Prisma.DatingScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => DatingScalarWhereInputSchema), z.lazy(() => DatingScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DatingScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DatingScalarWhereInputSchema), z.lazy(() => DatingScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  personId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  role: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  position: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  label: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  spanFrom: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  spanTo: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  approx: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  coregencyFrom: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  confidence: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  notes: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
});

export const FamilyMemberUpsertWithWhereUniqueWithoutPersonInputSchema: z.ZodType<Prisma.FamilyMemberUpsertWithWhereUniqueWithoutPersonInput> = z.strictObject({
  where: z.lazy(() => FamilyMemberWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => FamilyMemberUpdateWithoutPersonInputSchema), z.lazy(() => FamilyMemberUncheckedUpdateWithoutPersonInputSchema) ]),
  create: z.union([ z.lazy(() => FamilyMemberCreateWithoutPersonInputSchema), z.lazy(() => FamilyMemberUncheckedCreateWithoutPersonInputSchema) ]),
});

export const FamilyMemberUpdateWithWhereUniqueWithoutPersonInputSchema: z.ZodType<Prisma.FamilyMemberUpdateWithWhereUniqueWithoutPersonInput> = z.strictObject({
  where: z.lazy(() => FamilyMemberWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => FamilyMemberUpdateWithoutPersonInputSchema), z.lazy(() => FamilyMemberUncheckedUpdateWithoutPersonInputSchema) ]),
});

export const FamilyMemberUpdateManyWithWhereWithoutPersonInputSchema: z.ZodType<Prisma.FamilyMemberUpdateManyWithWhereWithoutPersonInput> = z.strictObject({
  where: z.lazy(() => FamilyMemberScalarWhereInputSchema),
  data: z.union([ z.lazy(() => FamilyMemberUpdateManyMutationInputSchema), z.lazy(() => FamilyMemberUncheckedUpdateManyWithoutPersonInputSchema) ]),
});

export const FamilyMemberScalarWhereInputSchema: z.ZodType<Prisma.FamilyMemberScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => FamilyMemberScalarWhereInputSchema), z.lazy(() => FamilyMemberScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FamilyMemberScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FamilyMemberScalarWhereInputSchema), z.lazy(() => FamilyMemberScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  personId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  position: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  relation: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  relatedPersonId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
});

export const PassageUpsertWithWhereUniqueWithoutPersonInputSchema: z.ZodType<Prisma.PassageUpsertWithWhereUniqueWithoutPersonInput> = z.strictObject({
  where: z.lazy(() => PassageWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => PassageUpdateWithoutPersonInputSchema), z.lazy(() => PassageUncheckedUpdateWithoutPersonInputSchema) ]),
  create: z.union([ z.lazy(() => PassageCreateWithoutPersonInputSchema), z.lazy(() => PassageUncheckedCreateWithoutPersonInputSchema) ]),
});

export const PassageUpdateWithWhereUniqueWithoutPersonInputSchema: z.ZodType<Prisma.PassageUpdateWithWhereUniqueWithoutPersonInput> = z.strictObject({
  where: z.lazy(() => PassageWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => PassageUpdateWithoutPersonInputSchema), z.lazy(() => PassageUncheckedUpdateWithoutPersonInputSchema) ]),
});

export const PassageUpdateManyWithWhereWithoutPersonInputSchema: z.ZodType<Prisma.PassageUpdateManyWithWhereWithoutPersonInput> = z.strictObject({
  where: z.lazy(() => PassageScalarWhereInputSchema),
  data: z.union([ z.lazy(() => PassageUpdateManyMutationInputSchema), z.lazy(() => PassageUncheckedUpdateManyWithoutPersonInputSchema) ]),
});

export const PassageScalarWhereInputSchema: z.ZodType<Prisma.PassageScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => PassageScalarWhereInputSchema), z.lazy(() => PassageScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PassageScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PassageScalarWhereInputSchema), z.lazy(() => PassageScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  personId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  position: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  book: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  fromChapter: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  fromVerse: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  toChapter: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  toVerse: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  kind: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  note: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
});

export const PersonCreateWithoutReignInputSchema: z.ZodType<Prisma.PersonCreateWithoutReignInput> = z.strictObject({
  id: z.string(),
  name: z.string(),
  altNames: z.union([ z.lazy(() => PersonCreatealtNamesInputSchema), z.string().array() ]).optional(),
  summary: z.string(),
  ministry: z.lazy(() => MinistryCreateNestedOneWithoutPersonInputSchema).optional(),
  datings: z.lazy(() => DatingCreateNestedManyWithoutPersonInputSchema).optional(),
  family: z.lazy(() => FamilyMemberCreateNestedManyWithoutPersonInputSchema).optional(),
  passages: z.lazy(() => PassageCreateNestedManyWithoutPersonInputSchema).optional(),
});

export const PersonUncheckedCreateWithoutReignInputSchema: z.ZodType<Prisma.PersonUncheckedCreateWithoutReignInput> = z.strictObject({
  id: z.string(),
  name: z.string(),
  altNames: z.union([ z.lazy(() => PersonCreatealtNamesInputSchema), z.string().array() ]).optional(),
  summary: z.string(),
  ministry: z.lazy(() => MinistryUncheckedCreateNestedOneWithoutPersonInputSchema).optional(),
  datings: z.lazy(() => DatingUncheckedCreateNestedManyWithoutPersonInputSchema).optional(),
  family: z.lazy(() => FamilyMemberUncheckedCreateNestedManyWithoutPersonInputSchema).optional(),
  passages: z.lazy(() => PassageUncheckedCreateNestedManyWithoutPersonInputSchema).optional(),
});

export const PersonCreateOrConnectWithoutReignInputSchema: z.ZodType<Prisma.PersonCreateOrConnectWithoutReignInput> = z.strictObject({
  where: z.lazy(() => PersonWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PersonCreateWithoutReignInputSchema), z.lazy(() => PersonUncheckedCreateWithoutReignInputSchema) ]),
});

export const PersonUpsertWithoutReignInputSchema: z.ZodType<Prisma.PersonUpsertWithoutReignInput> = z.strictObject({
  update: z.union([ z.lazy(() => PersonUpdateWithoutReignInputSchema), z.lazy(() => PersonUncheckedUpdateWithoutReignInputSchema) ]),
  create: z.union([ z.lazy(() => PersonCreateWithoutReignInputSchema), z.lazy(() => PersonUncheckedCreateWithoutReignInputSchema) ]),
  where: z.lazy(() => PersonWhereInputSchema).optional(),
});

export const PersonUpdateToOneWithWhereWithoutReignInputSchema: z.ZodType<Prisma.PersonUpdateToOneWithWhereWithoutReignInput> = z.strictObject({
  where: z.lazy(() => PersonWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PersonUpdateWithoutReignInputSchema), z.lazy(() => PersonUncheckedUpdateWithoutReignInputSchema) ]),
});

export const PersonUpdateWithoutReignInputSchema: z.ZodType<Prisma.PersonUpdateWithoutReignInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  altNames: z.union([ z.lazy(() => PersonUpdatealtNamesInputSchema), z.string().array() ]).optional(),
  summary: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ministry: z.lazy(() => MinistryUpdateOneWithoutPersonNestedInputSchema).optional(),
  datings: z.lazy(() => DatingUpdateManyWithoutPersonNestedInputSchema).optional(),
  family: z.lazy(() => FamilyMemberUpdateManyWithoutPersonNestedInputSchema).optional(),
  passages: z.lazy(() => PassageUpdateManyWithoutPersonNestedInputSchema).optional(),
});

export const PersonUncheckedUpdateWithoutReignInputSchema: z.ZodType<Prisma.PersonUncheckedUpdateWithoutReignInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  altNames: z.union([ z.lazy(() => PersonUpdatealtNamesInputSchema), z.string().array() ]).optional(),
  summary: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ministry: z.lazy(() => MinistryUncheckedUpdateOneWithoutPersonNestedInputSchema).optional(),
  datings: z.lazy(() => DatingUncheckedUpdateManyWithoutPersonNestedInputSchema).optional(),
  family: z.lazy(() => FamilyMemberUncheckedUpdateManyWithoutPersonNestedInputSchema).optional(),
  passages: z.lazy(() => PassageUncheckedUpdateManyWithoutPersonNestedInputSchema).optional(),
});

export const PersonCreateWithoutMinistryInputSchema: z.ZodType<Prisma.PersonCreateWithoutMinistryInput> = z.strictObject({
  id: z.string(),
  name: z.string(),
  altNames: z.union([ z.lazy(() => PersonCreatealtNamesInputSchema), z.string().array() ]).optional(),
  summary: z.string(),
  reign: z.lazy(() => ReignCreateNestedOneWithoutPersonInputSchema).optional(),
  datings: z.lazy(() => DatingCreateNestedManyWithoutPersonInputSchema).optional(),
  family: z.lazy(() => FamilyMemberCreateNestedManyWithoutPersonInputSchema).optional(),
  passages: z.lazy(() => PassageCreateNestedManyWithoutPersonInputSchema).optional(),
});

export const PersonUncheckedCreateWithoutMinistryInputSchema: z.ZodType<Prisma.PersonUncheckedCreateWithoutMinistryInput> = z.strictObject({
  id: z.string(),
  name: z.string(),
  altNames: z.union([ z.lazy(() => PersonCreatealtNamesInputSchema), z.string().array() ]).optional(),
  summary: z.string(),
  reign: z.lazy(() => ReignUncheckedCreateNestedOneWithoutPersonInputSchema).optional(),
  datings: z.lazy(() => DatingUncheckedCreateNestedManyWithoutPersonInputSchema).optional(),
  family: z.lazy(() => FamilyMemberUncheckedCreateNestedManyWithoutPersonInputSchema).optional(),
  passages: z.lazy(() => PassageUncheckedCreateNestedManyWithoutPersonInputSchema).optional(),
});

export const PersonCreateOrConnectWithoutMinistryInputSchema: z.ZodType<Prisma.PersonCreateOrConnectWithoutMinistryInput> = z.strictObject({
  where: z.lazy(() => PersonWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PersonCreateWithoutMinistryInputSchema), z.lazy(() => PersonUncheckedCreateWithoutMinistryInputSchema) ]),
});

export const PersonUpsertWithoutMinistryInputSchema: z.ZodType<Prisma.PersonUpsertWithoutMinistryInput> = z.strictObject({
  update: z.union([ z.lazy(() => PersonUpdateWithoutMinistryInputSchema), z.lazy(() => PersonUncheckedUpdateWithoutMinistryInputSchema) ]),
  create: z.union([ z.lazy(() => PersonCreateWithoutMinistryInputSchema), z.lazy(() => PersonUncheckedCreateWithoutMinistryInputSchema) ]),
  where: z.lazy(() => PersonWhereInputSchema).optional(),
});

export const PersonUpdateToOneWithWhereWithoutMinistryInputSchema: z.ZodType<Prisma.PersonUpdateToOneWithWhereWithoutMinistryInput> = z.strictObject({
  where: z.lazy(() => PersonWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PersonUpdateWithoutMinistryInputSchema), z.lazy(() => PersonUncheckedUpdateWithoutMinistryInputSchema) ]),
});

export const PersonUpdateWithoutMinistryInputSchema: z.ZodType<Prisma.PersonUpdateWithoutMinistryInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  altNames: z.union([ z.lazy(() => PersonUpdatealtNamesInputSchema), z.string().array() ]).optional(),
  summary: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  reign: z.lazy(() => ReignUpdateOneWithoutPersonNestedInputSchema).optional(),
  datings: z.lazy(() => DatingUpdateManyWithoutPersonNestedInputSchema).optional(),
  family: z.lazy(() => FamilyMemberUpdateManyWithoutPersonNestedInputSchema).optional(),
  passages: z.lazy(() => PassageUpdateManyWithoutPersonNestedInputSchema).optional(),
});

export const PersonUncheckedUpdateWithoutMinistryInputSchema: z.ZodType<Prisma.PersonUncheckedUpdateWithoutMinistryInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  altNames: z.union([ z.lazy(() => PersonUpdatealtNamesInputSchema), z.string().array() ]).optional(),
  summary: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  reign: z.lazy(() => ReignUncheckedUpdateOneWithoutPersonNestedInputSchema).optional(),
  datings: z.lazy(() => DatingUncheckedUpdateManyWithoutPersonNestedInputSchema).optional(),
  family: z.lazy(() => FamilyMemberUncheckedUpdateManyWithoutPersonNestedInputSchema).optional(),
  passages: z.lazy(() => PassageUncheckedUpdateManyWithoutPersonNestedInputSchema).optional(),
});

export const PersonCreateWithoutDatingsInputSchema: z.ZodType<Prisma.PersonCreateWithoutDatingsInput> = z.strictObject({
  id: z.string(),
  name: z.string(),
  altNames: z.union([ z.lazy(() => PersonCreatealtNamesInputSchema), z.string().array() ]).optional(),
  summary: z.string(),
  reign: z.lazy(() => ReignCreateNestedOneWithoutPersonInputSchema).optional(),
  ministry: z.lazy(() => MinistryCreateNestedOneWithoutPersonInputSchema).optional(),
  family: z.lazy(() => FamilyMemberCreateNestedManyWithoutPersonInputSchema).optional(),
  passages: z.lazy(() => PassageCreateNestedManyWithoutPersonInputSchema).optional(),
});

export const PersonUncheckedCreateWithoutDatingsInputSchema: z.ZodType<Prisma.PersonUncheckedCreateWithoutDatingsInput> = z.strictObject({
  id: z.string(),
  name: z.string(),
  altNames: z.union([ z.lazy(() => PersonCreatealtNamesInputSchema), z.string().array() ]).optional(),
  summary: z.string(),
  reign: z.lazy(() => ReignUncheckedCreateNestedOneWithoutPersonInputSchema).optional(),
  ministry: z.lazy(() => MinistryUncheckedCreateNestedOneWithoutPersonInputSchema).optional(),
  family: z.lazy(() => FamilyMemberUncheckedCreateNestedManyWithoutPersonInputSchema).optional(),
  passages: z.lazy(() => PassageUncheckedCreateNestedManyWithoutPersonInputSchema).optional(),
});

export const PersonCreateOrConnectWithoutDatingsInputSchema: z.ZodType<Prisma.PersonCreateOrConnectWithoutDatingsInput> = z.strictObject({
  where: z.lazy(() => PersonWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PersonCreateWithoutDatingsInputSchema), z.lazy(() => PersonUncheckedCreateWithoutDatingsInputSchema) ]),
});

export const EvidenceCreateWithoutDatingInputSchema: z.ZodType<Prisma.EvidenceCreateWithoutDatingInput> = z.strictObject({
  id: z.string(),
  position: z.number().int(),
  kind: z.string(),
  book: z.string().optional().nullable(),
  fromChapter: z.number().int().optional().nullable(),
  fromVerse: z.number().int().optional().nullable(),
  toChapter: z.number().int().optional().nullable(),
  toVerse: z.number().int().optional().nullable(),
  note: z.string().optional().nullable(),
  artifact: z.string().optional().nullable(),
  contemporaryIds: z.union([ z.lazy(() => EvidenceCreatecontemporaryIdsInputSchema), z.string().array() ]).optional(),
});

export const EvidenceUncheckedCreateWithoutDatingInputSchema: z.ZodType<Prisma.EvidenceUncheckedCreateWithoutDatingInput> = z.strictObject({
  id: z.string(),
  position: z.number().int(),
  kind: z.string(),
  book: z.string().optional().nullable(),
  fromChapter: z.number().int().optional().nullable(),
  fromVerse: z.number().int().optional().nullable(),
  toChapter: z.number().int().optional().nullable(),
  toVerse: z.number().int().optional().nullable(),
  note: z.string().optional().nullable(),
  artifact: z.string().optional().nullable(),
  contemporaryIds: z.union([ z.lazy(() => EvidenceCreatecontemporaryIdsInputSchema), z.string().array() ]).optional(),
});

export const EvidenceCreateOrConnectWithoutDatingInputSchema: z.ZodType<Prisma.EvidenceCreateOrConnectWithoutDatingInput> = z.strictObject({
  where: z.lazy(() => EvidenceWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => EvidenceCreateWithoutDatingInputSchema), z.lazy(() => EvidenceUncheckedCreateWithoutDatingInputSchema) ]),
});

export const EvidenceCreateManyDatingInputEnvelopeSchema: z.ZodType<Prisma.EvidenceCreateManyDatingInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => EvidenceCreateManyDatingInputSchema), z.lazy(() => EvidenceCreateManyDatingInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const CitationCreateWithoutDatingInputSchema: z.ZodType<Prisma.CitationCreateWithoutDatingInput> = z.strictObject({
  id: z.string(),
  pages: z.string().optional().nullable(),
  source: z.lazy(() => SourceCreateNestedOneWithoutCitationsInputSchema),
});

export const CitationUncheckedCreateWithoutDatingInputSchema: z.ZodType<Prisma.CitationUncheckedCreateWithoutDatingInput> = z.strictObject({
  id: z.string(),
  sourceId: z.string(),
  pages: z.string().optional().nullable(),
});

export const CitationCreateOrConnectWithoutDatingInputSchema: z.ZodType<Prisma.CitationCreateOrConnectWithoutDatingInput> = z.strictObject({
  where: z.lazy(() => CitationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CitationCreateWithoutDatingInputSchema), z.lazy(() => CitationUncheckedCreateWithoutDatingInputSchema) ]),
});

export const CitationCreateManyDatingInputEnvelopeSchema: z.ZodType<Prisma.CitationCreateManyDatingInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => CitationCreateManyDatingInputSchema), z.lazy(() => CitationCreateManyDatingInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const PersonUpsertWithoutDatingsInputSchema: z.ZodType<Prisma.PersonUpsertWithoutDatingsInput> = z.strictObject({
  update: z.union([ z.lazy(() => PersonUpdateWithoutDatingsInputSchema), z.lazy(() => PersonUncheckedUpdateWithoutDatingsInputSchema) ]),
  create: z.union([ z.lazy(() => PersonCreateWithoutDatingsInputSchema), z.lazy(() => PersonUncheckedCreateWithoutDatingsInputSchema) ]),
  where: z.lazy(() => PersonWhereInputSchema).optional(),
});

export const PersonUpdateToOneWithWhereWithoutDatingsInputSchema: z.ZodType<Prisma.PersonUpdateToOneWithWhereWithoutDatingsInput> = z.strictObject({
  where: z.lazy(() => PersonWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PersonUpdateWithoutDatingsInputSchema), z.lazy(() => PersonUncheckedUpdateWithoutDatingsInputSchema) ]),
});

export const PersonUpdateWithoutDatingsInputSchema: z.ZodType<Prisma.PersonUpdateWithoutDatingsInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  altNames: z.union([ z.lazy(() => PersonUpdatealtNamesInputSchema), z.string().array() ]).optional(),
  summary: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  reign: z.lazy(() => ReignUpdateOneWithoutPersonNestedInputSchema).optional(),
  ministry: z.lazy(() => MinistryUpdateOneWithoutPersonNestedInputSchema).optional(),
  family: z.lazy(() => FamilyMemberUpdateManyWithoutPersonNestedInputSchema).optional(),
  passages: z.lazy(() => PassageUpdateManyWithoutPersonNestedInputSchema).optional(),
});

export const PersonUncheckedUpdateWithoutDatingsInputSchema: z.ZodType<Prisma.PersonUncheckedUpdateWithoutDatingsInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  altNames: z.union([ z.lazy(() => PersonUpdatealtNamesInputSchema), z.string().array() ]).optional(),
  summary: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  reign: z.lazy(() => ReignUncheckedUpdateOneWithoutPersonNestedInputSchema).optional(),
  ministry: z.lazy(() => MinistryUncheckedUpdateOneWithoutPersonNestedInputSchema).optional(),
  family: z.lazy(() => FamilyMemberUncheckedUpdateManyWithoutPersonNestedInputSchema).optional(),
  passages: z.lazy(() => PassageUncheckedUpdateManyWithoutPersonNestedInputSchema).optional(),
});

export const EvidenceUpsertWithWhereUniqueWithoutDatingInputSchema: z.ZodType<Prisma.EvidenceUpsertWithWhereUniqueWithoutDatingInput> = z.strictObject({
  where: z.lazy(() => EvidenceWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => EvidenceUpdateWithoutDatingInputSchema), z.lazy(() => EvidenceUncheckedUpdateWithoutDatingInputSchema) ]),
  create: z.union([ z.lazy(() => EvidenceCreateWithoutDatingInputSchema), z.lazy(() => EvidenceUncheckedCreateWithoutDatingInputSchema) ]),
});

export const EvidenceUpdateWithWhereUniqueWithoutDatingInputSchema: z.ZodType<Prisma.EvidenceUpdateWithWhereUniqueWithoutDatingInput> = z.strictObject({
  where: z.lazy(() => EvidenceWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => EvidenceUpdateWithoutDatingInputSchema), z.lazy(() => EvidenceUncheckedUpdateWithoutDatingInputSchema) ]),
});

export const EvidenceUpdateManyWithWhereWithoutDatingInputSchema: z.ZodType<Prisma.EvidenceUpdateManyWithWhereWithoutDatingInput> = z.strictObject({
  where: z.lazy(() => EvidenceScalarWhereInputSchema),
  data: z.union([ z.lazy(() => EvidenceUpdateManyMutationInputSchema), z.lazy(() => EvidenceUncheckedUpdateManyWithoutDatingInputSchema) ]),
});

export const EvidenceScalarWhereInputSchema: z.ZodType<Prisma.EvidenceScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => EvidenceScalarWhereInputSchema), z.lazy(() => EvidenceScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvidenceScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvidenceScalarWhereInputSchema), z.lazy(() => EvidenceScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  datingId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  position: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  kind: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  book: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  fromChapter: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  fromVerse: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  toChapter: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  toVerse: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  note: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  artifact: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  contemporaryIds: z.lazy(() => StringNullableListFilterSchema).optional(),
});

export const CitationUpsertWithWhereUniqueWithoutDatingInputSchema: z.ZodType<Prisma.CitationUpsertWithWhereUniqueWithoutDatingInput> = z.strictObject({
  where: z.lazy(() => CitationWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CitationUpdateWithoutDatingInputSchema), z.lazy(() => CitationUncheckedUpdateWithoutDatingInputSchema) ]),
  create: z.union([ z.lazy(() => CitationCreateWithoutDatingInputSchema), z.lazy(() => CitationUncheckedCreateWithoutDatingInputSchema) ]),
});

export const CitationUpdateWithWhereUniqueWithoutDatingInputSchema: z.ZodType<Prisma.CitationUpdateWithWhereUniqueWithoutDatingInput> = z.strictObject({
  where: z.lazy(() => CitationWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CitationUpdateWithoutDatingInputSchema), z.lazy(() => CitationUncheckedUpdateWithoutDatingInputSchema) ]),
});

export const CitationUpdateManyWithWhereWithoutDatingInputSchema: z.ZodType<Prisma.CitationUpdateManyWithWhereWithoutDatingInput> = z.strictObject({
  where: z.lazy(() => CitationScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CitationUpdateManyMutationInputSchema), z.lazy(() => CitationUncheckedUpdateManyWithoutDatingInputSchema) ]),
});

export const CitationScalarWhereInputSchema: z.ZodType<Prisma.CitationScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => CitationScalarWhereInputSchema), z.lazy(() => CitationScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CitationScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CitationScalarWhereInputSchema), z.lazy(() => CitationScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  datingId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  sourceId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  pages: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
});

export const DatingCreateWithoutEvidenceInputSchema: z.ZodType<Prisma.DatingCreateWithoutEvidenceInput> = z.strictObject({
  id: z.string(),
  role: z.string(),
  position: z.number().int(),
  label: z.string().optional().nullable(),
  spanFrom: z.number().int(),
  spanTo: z.number().int(),
  approx: z.boolean(),
  coregencyFrom: z.number().int().optional().nullable(),
  confidence: z.string(),
  notes: z.string().optional().nullable(),
  person: z.lazy(() => PersonCreateNestedOneWithoutDatingsInputSchema),
  citations: z.lazy(() => CitationCreateNestedManyWithoutDatingInputSchema).optional(),
});

export const DatingUncheckedCreateWithoutEvidenceInputSchema: z.ZodType<Prisma.DatingUncheckedCreateWithoutEvidenceInput> = z.strictObject({
  id: z.string(),
  personId: z.string(),
  role: z.string(),
  position: z.number().int(),
  label: z.string().optional().nullable(),
  spanFrom: z.number().int(),
  spanTo: z.number().int(),
  approx: z.boolean(),
  coregencyFrom: z.number().int().optional().nullable(),
  confidence: z.string(),
  notes: z.string().optional().nullable(),
  citations: z.lazy(() => CitationUncheckedCreateNestedManyWithoutDatingInputSchema).optional(),
});

export const DatingCreateOrConnectWithoutEvidenceInputSchema: z.ZodType<Prisma.DatingCreateOrConnectWithoutEvidenceInput> = z.strictObject({
  where: z.lazy(() => DatingWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DatingCreateWithoutEvidenceInputSchema), z.lazy(() => DatingUncheckedCreateWithoutEvidenceInputSchema) ]),
});

export const DatingUpsertWithoutEvidenceInputSchema: z.ZodType<Prisma.DatingUpsertWithoutEvidenceInput> = z.strictObject({
  update: z.union([ z.lazy(() => DatingUpdateWithoutEvidenceInputSchema), z.lazy(() => DatingUncheckedUpdateWithoutEvidenceInputSchema) ]),
  create: z.union([ z.lazy(() => DatingCreateWithoutEvidenceInputSchema), z.lazy(() => DatingUncheckedCreateWithoutEvidenceInputSchema) ]),
  where: z.lazy(() => DatingWhereInputSchema).optional(),
});

export const DatingUpdateToOneWithWhereWithoutEvidenceInputSchema: z.ZodType<Prisma.DatingUpdateToOneWithWhereWithoutEvidenceInput> = z.strictObject({
  where: z.lazy(() => DatingWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => DatingUpdateWithoutEvidenceInputSchema), z.lazy(() => DatingUncheckedUpdateWithoutEvidenceInputSchema) ]),
});

export const DatingUpdateWithoutEvidenceInputSchema: z.ZodType<Prisma.DatingUpdateWithoutEvidenceInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  position: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  spanFrom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  spanTo: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  approx: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  coregencyFrom: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  confidence: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  person: z.lazy(() => PersonUpdateOneRequiredWithoutDatingsNestedInputSchema).optional(),
  citations: z.lazy(() => CitationUpdateManyWithoutDatingNestedInputSchema).optional(),
});

export const DatingUncheckedUpdateWithoutEvidenceInputSchema: z.ZodType<Prisma.DatingUncheckedUpdateWithoutEvidenceInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  personId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  position: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  spanFrom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  spanTo: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  approx: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  coregencyFrom: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  confidence: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  citations: z.lazy(() => CitationUncheckedUpdateManyWithoutDatingNestedInputSchema).optional(),
});

export const CitationCreateWithoutSourceInputSchema: z.ZodType<Prisma.CitationCreateWithoutSourceInput> = z.strictObject({
  id: z.string(),
  pages: z.string().optional().nullable(),
  dating: z.lazy(() => DatingCreateNestedOneWithoutCitationsInputSchema),
});

export const CitationUncheckedCreateWithoutSourceInputSchema: z.ZodType<Prisma.CitationUncheckedCreateWithoutSourceInput> = z.strictObject({
  id: z.string(),
  datingId: z.string(),
  pages: z.string().optional().nullable(),
});

export const CitationCreateOrConnectWithoutSourceInputSchema: z.ZodType<Prisma.CitationCreateOrConnectWithoutSourceInput> = z.strictObject({
  where: z.lazy(() => CitationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CitationCreateWithoutSourceInputSchema), z.lazy(() => CitationUncheckedCreateWithoutSourceInputSchema) ]),
});

export const CitationCreateManySourceInputEnvelopeSchema: z.ZodType<Prisma.CitationCreateManySourceInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => CitationCreateManySourceInputSchema), z.lazy(() => CitationCreateManySourceInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const CitationUpsertWithWhereUniqueWithoutSourceInputSchema: z.ZodType<Prisma.CitationUpsertWithWhereUniqueWithoutSourceInput> = z.strictObject({
  where: z.lazy(() => CitationWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CitationUpdateWithoutSourceInputSchema), z.lazy(() => CitationUncheckedUpdateWithoutSourceInputSchema) ]),
  create: z.union([ z.lazy(() => CitationCreateWithoutSourceInputSchema), z.lazy(() => CitationUncheckedCreateWithoutSourceInputSchema) ]),
});

export const CitationUpdateWithWhereUniqueWithoutSourceInputSchema: z.ZodType<Prisma.CitationUpdateWithWhereUniqueWithoutSourceInput> = z.strictObject({
  where: z.lazy(() => CitationWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CitationUpdateWithoutSourceInputSchema), z.lazy(() => CitationUncheckedUpdateWithoutSourceInputSchema) ]),
});

export const CitationUpdateManyWithWhereWithoutSourceInputSchema: z.ZodType<Prisma.CitationUpdateManyWithWhereWithoutSourceInput> = z.strictObject({
  where: z.lazy(() => CitationScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CitationUpdateManyMutationInputSchema), z.lazy(() => CitationUncheckedUpdateManyWithoutSourceInputSchema) ]),
});

export const DatingCreateWithoutCitationsInputSchema: z.ZodType<Prisma.DatingCreateWithoutCitationsInput> = z.strictObject({
  id: z.string(),
  role: z.string(),
  position: z.number().int(),
  label: z.string().optional().nullable(),
  spanFrom: z.number().int(),
  spanTo: z.number().int(),
  approx: z.boolean(),
  coregencyFrom: z.number().int().optional().nullable(),
  confidence: z.string(),
  notes: z.string().optional().nullable(),
  person: z.lazy(() => PersonCreateNestedOneWithoutDatingsInputSchema),
  evidence: z.lazy(() => EvidenceCreateNestedManyWithoutDatingInputSchema).optional(),
});

export const DatingUncheckedCreateWithoutCitationsInputSchema: z.ZodType<Prisma.DatingUncheckedCreateWithoutCitationsInput> = z.strictObject({
  id: z.string(),
  personId: z.string(),
  role: z.string(),
  position: z.number().int(),
  label: z.string().optional().nullable(),
  spanFrom: z.number().int(),
  spanTo: z.number().int(),
  approx: z.boolean(),
  coregencyFrom: z.number().int().optional().nullable(),
  confidence: z.string(),
  notes: z.string().optional().nullable(),
  evidence: z.lazy(() => EvidenceUncheckedCreateNestedManyWithoutDatingInputSchema).optional(),
});

export const DatingCreateOrConnectWithoutCitationsInputSchema: z.ZodType<Prisma.DatingCreateOrConnectWithoutCitationsInput> = z.strictObject({
  where: z.lazy(() => DatingWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DatingCreateWithoutCitationsInputSchema), z.lazy(() => DatingUncheckedCreateWithoutCitationsInputSchema) ]),
});

export const SourceCreateWithoutCitationsInputSchema: z.ZodType<Prisma.SourceCreateWithoutCitationsInput> = z.strictObject({
  id: z.string(),
  author: z.string(),
  title: z.string(),
  year: z.number().int(),
  kind: z.string(),
  publisher: z.string().optional().nullable(),
  url: z.string().optional().nullable(),
});

export const SourceUncheckedCreateWithoutCitationsInputSchema: z.ZodType<Prisma.SourceUncheckedCreateWithoutCitationsInput> = z.strictObject({
  id: z.string(),
  author: z.string(),
  title: z.string(),
  year: z.number().int(),
  kind: z.string(),
  publisher: z.string().optional().nullable(),
  url: z.string().optional().nullable(),
});

export const SourceCreateOrConnectWithoutCitationsInputSchema: z.ZodType<Prisma.SourceCreateOrConnectWithoutCitationsInput> = z.strictObject({
  where: z.lazy(() => SourceWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SourceCreateWithoutCitationsInputSchema), z.lazy(() => SourceUncheckedCreateWithoutCitationsInputSchema) ]),
});

export const DatingUpsertWithoutCitationsInputSchema: z.ZodType<Prisma.DatingUpsertWithoutCitationsInput> = z.strictObject({
  update: z.union([ z.lazy(() => DatingUpdateWithoutCitationsInputSchema), z.lazy(() => DatingUncheckedUpdateWithoutCitationsInputSchema) ]),
  create: z.union([ z.lazy(() => DatingCreateWithoutCitationsInputSchema), z.lazy(() => DatingUncheckedCreateWithoutCitationsInputSchema) ]),
  where: z.lazy(() => DatingWhereInputSchema).optional(),
});

export const DatingUpdateToOneWithWhereWithoutCitationsInputSchema: z.ZodType<Prisma.DatingUpdateToOneWithWhereWithoutCitationsInput> = z.strictObject({
  where: z.lazy(() => DatingWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => DatingUpdateWithoutCitationsInputSchema), z.lazy(() => DatingUncheckedUpdateWithoutCitationsInputSchema) ]),
});

export const DatingUpdateWithoutCitationsInputSchema: z.ZodType<Prisma.DatingUpdateWithoutCitationsInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  position: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  spanFrom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  spanTo: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  approx: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  coregencyFrom: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  confidence: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  person: z.lazy(() => PersonUpdateOneRequiredWithoutDatingsNestedInputSchema).optional(),
  evidence: z.lazy(() => EvidenceUpdateManyWithoutDatingNestedInputSchema).optional(),
});

export const DatingUncheckedUpdateWithoutCitationsInputSchema: z.ZodType<Prisma.DatingUncheckedUpdateWithoutCitationsInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  personId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  position: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  spanFrom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  spanTo: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  approx: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  coregencyFrom: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  confidence: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  evidence: z.lazy(() => EvidenceUncheckedUpdateManyWithoutDatingNestedInputSchema).optional(),
});

export const SourceUpsertWithoutCitationsInputSchema: z.ZodType<Prisma.SourceUpsertWithoutCitationsInput> = z.strictObject({
  update: z.union([ z.lazy(() => SourceUpdateWithoutCitationsInputSchema), z.lazy(() => SourceUncheckedUpdateWithoutCitationsInputSchema) ]),
  create: z.union([ z.lazy(() => SourceCreateWithoutCitationsInputSchema), z.lazy(() => SourceUncheckedCreateWithoutCitationsInputSchema) ]),
  where: z.lazy(() => SourceWhereInputSchema).optional(),
});

export const SourceUpdateToOneWithWhereWithoutCitationsInputSchema: z.ZodType<Prisma.SourceUpdateToOneWithWhereWithoutCitationsInput> = z.strictObject({
  where: z.lazy(() => SourceWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => SourceUpdateWithoutCitationsInputSchema), z.lazy(() => SourceUncheckedUpdateWithoutCitationsInputSchema) ]),
});

export const SourceUpdateWithoutCitationsInputSchema: z.ZodType<Prisma.SourceUpdateWithoutCitationsInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  author: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  year: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  kind: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  publisher: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  url: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const SourceUncheckedUpdateWithoutCitationsInputSchema: z.ZodType<Prisma.SourceUncheckedUpdateWithoutCitationsInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  author: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  year: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  kind: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  publisher: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  url: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const PersonCreateWithoutPassagesInputSchema: z.ZodType<Prisma.PersonCreateWithoutPassagesInput> = z.strictObject({
  id: z.string(),
  name: z.string(),
  altNames: z.union([ z.lazy(() => PersonCreatealtNamesInputSchema), z.string().array() ]).optional(),
  summary: z.string(),
  reign: z.lazy(() => ReignCreateNestedOneWithoutPersonInputSchema).optional(),
  ministry: z.lazy(() => MinistryCreateNestedOneWithoutPersonInputSchema).optional(),
  datings: z.lazy(() => DatingCreateNestedManyWithoutPersonInputSchema).optional(),
  family: z.lazy(() => FamilyMemberCreateNestedManyWithoutPersonInputSchema).optional(),
});

export const PersonUncheckedCreateWithoutPassagesInputSchema: z.ZodType<Prisma.PersonUncheckedCreateWithoutPassagesInput> = z.strictObject({
  id: z.string(),
  name: z.string(),
  altNames: z.union([ z.lazy(() => PersonCreatealtNamesInputSchema), z.string().array() ]).optional(),
  summary: z.string(),
  reign: z.lazy(() => ReignUncheckedCreateNestedOneWithoutPersonInputSchema).optional(),
  ministry: z.lazy(() => MinistryUncheckedCreateNestedOneWithoutPersonInputSchema).optional(),
  datings: z.lazy(() => DatingUncheckedCreateNestedManyWithoutPersonInputSchema).optional(),
  family: z.lazy(() => FamilyMemberUncheckedCreateNestedManyWithoutPersonInputSchema).optional(),
});

export const PersonCreateOrConnectWithoutPassagesInputSchema: z.ZodType<Prisma.PersonCreateOrConnectWithoutPassagesInput> = z.strictObject({
  where: z.lazy(() => PersonWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PersonCreateWithoutPassagesInputSchema), z.lazy(() => PersonUncheckedCreateWithoutPassagesInputSchema) ]),
});

export const PersonUpsertWithoutPassagesInputSchema: z.ZodType<Prisma.PersonUpsertWithoutPassagesInput> = z.strictObject({
  update: z.union([ z.lazy(() => PersonUpdateWithoutPassagesInputSchema), z.lazy(() => PersonUncheckedUpdateWithoutPassagesInputSchema) ]),
  create: z.union([ z.lazy(() => PersonCreateWithoutPassagesInputSchema), z.lazy(() => PersonUncheckedCreateWithoutPassagesInputSchema) ]),
  where: z.lazy(() => PersonWhereInputSchema).optional(),
});

export const PersonUpdateToOneWithWhereWithoutPassagesInputSchema: z.ZodType<Prisma.PersonUpdateToOneWithWhereWithoutPassagesInput> = z.strictObject({
  where: z.lazy(() => PersonWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PersonUpdateWithoutPassagesInputSchema), z.lazy(() => PersonUncheckedUpdateWithoutPassagesInputSchema) ]),
});

export const PersonUpdateWithoutPassagesInputSchema: z.ZodType<Prisma.PersonUpdateWithoutPassagesInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  altNames: z.union([ z.lazy(() => PersonUpdatealtNamesInputSchema), z.string().array() ]).optional(),
  summary: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  reign: z.lazy(() => ReignUpdateOneWithoutPersonNestedInputSchema).optional(),
  ministry: z.lazy(() => MinistryUpdateOneWithoutPersonNestedInputSchema).optional(),
  datings: z.lazy(() => DatingUpdateManyWithoutPersonNestedInputSchema).optional(),
  family: z.lazy(() => FamilyMemberUpdateManyWithoutPersonNestedInputSchema).optional(),
});

export const PersonUncheckedUpdateWithoutPassagesInputSchema: z.ZodType<Prisma.PersonUncheckedUpdateWithoutPassagesInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  altNames: z.union([ z.lazy(() => PersonUpdatealtNamesInputSchema), z.string().array() ]).optional(),
  summary: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  reign: z.lazy(() => ReignUncheckedUpdateOneWithoutPersonNestedInputSchema).optional(),
  ministry: z.lazy(() => MinistryUncheckedUpdateOneWithoutPersonNestedInputSchema).optional(),
  datings: z.lazy(() => DatingUncheckedUpdateManyWithoutPersonNestedInputSchema).optional(),
  family: z.lazy(() => FamilyMemberUncheckedUpdateManyWithoutPersonNestedInputSchema).optional(),
});

export const PersonCreateWithoutFamilyInputSchema: z.ZodType<Prisma.PersonCreateWithoutFamilyInput> = z.strictObject({
  id: z.string(),
  name: z.string(),
  altNames: z.union([ z.lazy(() => PersonCreatealtNamesInputSchema), z.string().array() ]).optional(),
  summary: z.string(),
  reign: z.lazy(() => ReignCreateNestedOneWithoutPersonInputSchema).optional(),
  ministry: z.lazy(() => MinistryCreateNestedOneWithoutPersonInputSchema).optional(),
  datings: z.lazy(() => DatingCreateNestedManyWithoutPersonInputSchema).optional(),
  passages: z.lazy(() => PassageCreateNestedManyWithoutPersonInputSchema).optional(),
});

export const PersonUncheckedCreateWithoutFamilyInputSchema: z.ZodType<Prisma.PersonUncheckedCreateWithoutFamilyInput> = z.strictObject({
  id: z.string(),
  name: z.string(),
  altNames: z.union([ z.lazy(() => PersonCreatealtNamesInputSchema), z.string().array() ]).optional(),
  summary: z.string(),
  reign: z.lazy(() => ReignUncheckedCreateNestedOneWithoutPersonInputSchema).optional(),
  ministry: z.lazy(() => MinistryUncheckedCreateNestedOneWithoutPersonInputSchema).optional(),
  datings: z.lazy(() => DatingUncheckedCreateNestedManyWithoutPersonInputSchema).optional(),
  passages: z.lazy(() => PassageUncheckedCreateNestedManyWithoutPersonInputSchema).optional(),
});

export const PersonCreateOrConnectWithoutFamilyInputSchema: z.ZodType<Prisma.PersonCreateOrConnectWithoutFamilyInput> = z.strictObject({
  where: z.lazy(() => PersonWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PersonCreateWithoutFamilyInputSchema), z.lazy(() => PersonUncheckedCreateWithoutFamilyInputSchema) ]),
});

export const PersonUpsertWithoutFamilyInputSchema: z.ZodType<Prisma.PersonUpsertWithoutFamilyInput> = z.strictObject({
  update: z.union([ z.lazy(() => PersonUpdateWithoutFamilyInputSchema), z.lazy(() => PersonUncheckedUpdateWithoutFamilyInputSchema) ]),
  create: z.union([ z.lazy(() => PersonCreateWithoutFamilyInputSchema), z.lazy(() => PersonUncheckedCreateWithoutFamilyInputSchema) ]),
  where: z.lazy(() => PersonWhereInputSchema).optional(),
});

export const PersonUpdateToOneWithWhereWithoutFamilyInputSchema: z.ZodType<Prisma.PersonUpdateToOneWithWhereWithoutFamilyInput> = z.strictObject({
  where: z.lazy(() => PersonWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PersonUpdateWithoutFamilyInputSchema), z.lazy(() => PersonUncheckedUpdateWithoutFamilyInputSchema) ]),
});

export const PersonUpdateWithoutFamilyInputSchema: z.ZodType<Prisma.PersonUpdateWithoutFamilyInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  altNames: z.union([ z.lazy(() => PersonUpdatealtNamesInputSchema), z.string().array() ]).optional(),
  summary: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  reign: z.lazy(() => ReignUpdateOneWithoutPersonNestedInputSchema).optional(),
  ministry: z.lazy(() => MinistryUpdateOneWithoutPersonNestedInputSchema).optional(),
  datings: z.lazy(() => DatingUpdateManyWithoutPersonNestedInputSchema).optional(),
  passages: z.lazy(() => PassageUpdateManyWithoutPersonNestedInputSchema).optional(),
});

export const PersonUncheckedUpdateWithoutFamilyInputSchema: z.ZodType<Prisma.PersonUncheckedUpdateWithoutFamilyInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  altNames: z.union([ z.lazy(() => PersonUpdatealtNamesInputSchema), z.string().array() ]).optional(),
  summary: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  reign: z.lazy(() => ReignUncheckedUpdateOneWithoutPersonNestedInputSchema).optional(),
  ministry: z.lazy(() => MinistryUncheckedUpdateOneWithoutPersonNestedInputSchema).optional(),
  datings: z.lazy(() => DatingUncheckedUpdateManyWithoutPersonNestedInputSchema).optional(),
  passages: z.lazy(() => PassageUncheckedUpdateManyWithoutPersonNestedInputSchema).optional(),
});

export const SessionCreateManyUserInputSchema: z.ZodType<Prisma.SessionCreateManyUserInput> = z.strictObject({
  id: z.string(),
  expiresAt: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
});

export const SessionUpdateWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateWithoutUserInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const SessionUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateWithoutUserInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const SessionUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyWithoutUserInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const DatingCreateManyPersonInputSchema: z.ZodType<Prisma.DatingCreateManyPersonInput> = z.strictObject({
  id: z.string(),
  role: z.string(),
  position: z.number().int(),
  label: z.string().optional().nullable(),
  spanFrom: z.number().int(),
  spanTo: z.number().int(),
  approx: z.boolean(),
  coregencyFrom: z.number().int().optional().nullable(),
  confidence: z.string(),
  notes: z.string().optional().nullable(),
});

export const FamilyMemberCreateManyPersonInputSchema: z.ZodType<Prisma.FamilyMemberCreateManyPersonInput> = z.strictObject({
  id: z.string(),
  position: z.number().int(),
  relation: z.string(),
  name: z.string(),
  relatedPersonId: z.string().optional().nullable(),
});

export const PassageCreateManyPersonInputSchema: z.ZodType<Prisma.PassageCreateManyPersonInput> = z.strictObject({
  id: z.string(),
  position: z.number().int(),
  book: z.string(),
  fromChapter: z.number().int(),
  fromVerse: z.number().int().optional().nullable(),
  toChapter: z.number().int().optional().nullable(),
  toVerse: z.number().int().optional().nullable(),
  kind: z.string(),
  note: z.string().optional().nullable(),
});

export const DatingUpdateWithoutPersonInputSchema: z.ZodType<Prisma.DatingUpdateWithoutPersonInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  position: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  spanFrom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  spanTo: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  approx: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  coregencyFrom: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  confidence: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  evidence: z.lazy(() => EvidenceUpdateManyWithoutDatingNestedInputSchema).optional(),
  citations: z.lazy(() => CitationUpdateManyWithoutDatingNestedInputSchema).optional(),
});

export const DatingUncheckedUpdateWithoutPersonInputSchema: z.ZodType<Prisma.DatingUncheckedUpdateWithoutPersonInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  position: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  spanFrom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  spanTo: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  approx: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  coregencyFrom: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  confidence: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  evidence: z.lazy(() => EvidenceUncheckedUpdateManyWithoutDatingNestedInputSchema).optional(),
  citations: z.lazy(() => CitationUncheckedUpdateManyWithoutDatingNestedInputSchema).optional(),
});

export const DatingUncheckedUpdateManyWithoutPersonInputSchema: z.ZodType<Prisma.DatingUncheckedUpdateManyWithoutPersonInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  position: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  spanFrom: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  spanTo: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  approx: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  coregencyFrom: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  confidence: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const FamilyMemberUpdateWithoutPersonInputSchema: z.ZodType<Prisma.FamilyMemberUpdateWithoutPersonInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  position: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  relation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  relatedPersonId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const FamilyMemberUncheckedUpdateWithoutPersonInputSchema: z.ZodType<Prisma.FamilyMemberUncheckedUpdateWithoutPersonInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  position: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  relation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  relatedPersonId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const FamilyMemberUncheckedUpdateManyWithoutPersonInputSchema: z.ZodType<Prisma.FamilyMemberUncheckedUpdateManyWithoutPersonInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  position: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  relation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  relatedPersonId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const PassageUpdateWithoutPersonInputSchema: z.ZodType<Prisma.PassageUpdateWithoutPersonInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  position: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  book: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fromChapter: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  fromVerse: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  toChapter: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  toVerse: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  kind: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const PassageUncheckedUpdateWithoutPersonInputSchema: z.ZodType<Prisma.PassageUncheckedUpdateWithoutPersonInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  position: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  book: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fromChapter: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  fromVerse: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  toChapter: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  toVerse: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  kind: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const PassageUncheckedUpdateManyWithoutPersonInputSchema: z.ZodType<Prisma.PassageUncheckedUpdateManyWithoutPersonInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  position: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  book: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fromChapter: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  fromVerse: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  toChapter: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  toVerse: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  kind: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const EvidenceCreateManyDatingInputSchema: z.ZodType<Prisma.EvidenceCreateManyDatingInput> = z.strictObject({
  id: z.string(),
  position: z.number().int(),
  kind: z.string(),
  book: z.string().optional().nullable(),
  fromChapter: z.number().int().optional().nullable(),
  fromVerse: z.number().int().optional().nullable(),
  toChapter: z.number().int().optional().nullable(),
  toVerse: z.number().int().optional().nullable(),
  note: z.string().optional().nullable(),
  artifact: z.string().optional().nullable(),
  contemporaryIds: z.union([ z.lazy(() => EvidenceCreatecontemporaryIdsInputSchema), z.string().array() ]).optional(),
});

export const CitationCreateManyDatingInputSchema: z.ZodType<Prisma.CitationCreateManyDatingInput> = z.strictObject({
  id: z.string(),
  sourceId: z.string(),
  pages: z.string().optional().nullable(),
});

export const EvidenceUpdateWithoutDatingInputSchema: z.ZodType<Prisma.EvidenceUpdateWithoutDatingInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  position: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  kind: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  book: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fromChapter: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fromVerse: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  toChapter: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  toVerse: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  artifact: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contemporaryIds: z.union([ z.lazy(() => EvidenceUpdatecontemporaryIdsInputSchema), z.string().array() ]).optional(),
});

export const EvidenceUncheckedUpdateWithoutDatingInputSchema: z.ZodType<Prisma.EvidenceUncheckedUpdateWithoutDatingInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  position: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  kind: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  book: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fromChapter: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fromVerse: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  toChapter: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  toVerse: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  artifact: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contemporaryIds: z.union([ z.lazy(() => EvidenceUpdatecontemporaryIdsInputSchema), z.string().array() ]).optional(),
});

export const EvidenceUncheckedUpdateManyWithoutDatingInputSchema: z.ZodType<Prisma.EvidenceUncheckedUpdateManyWithoutDatingInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  position: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  kind: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  book: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fromChapter: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fromVerse: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  toChapter: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  toVerse: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  artifact: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contemporaryIds: z.union([ z.lazy(() => EvidenceUpdatecontemporaryIdsInputSchema), z.string().array() ]).optional(),
});

export const CitationUpdateWithoutDatingInputSchema: z.ZodType<Prisma.CitationUpdateWithoutDatingInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pages: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  source: z.lazy(() => SourceUpdateOneRequiredWithoutCitationsNestedInputSchema).optional(),
});

export const CitationUncheckedUpdateWithoutDatingInputSchema: z.ZodType<Prisma.CitationUncheckedUpdateWithoutDatingInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sourceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pages: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const CitationUncheckedUpdateManyWithoutDatingInputSchema: z.ZodType<Prisma.CitationUncheckedUpdateManyWithoutDatingInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sourceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pages: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const CitationCreateManySourceInputSchema: z.ZodType<Prisma.CitationCreateManySourceInput> = z.strictObject({
  id: z.string(),
  datingId: z.string(),
  pages: z.string().optional().nullable(),
});

export const CitationUpdateWithoutSourceInputSchema: z.ZodType<Prisma.CitationUpdateWithoutSourceInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pages: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dating: z.lazy(() => DatingUpdateOneRequiredWithoutCitationsNestedInputSchema).optional(),
});

export const CitationUncheckedUpdateWithoutSourceInputSchema: z.ZodType<Prisma.CitationUncheckedUpdateWithoutSourceInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  datingId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pages: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const CitationUncheckedUpdateManyWithoutSourceInputSchema: z.ZodType<Prisma.CitationUncheckedUpdateManyWithoutSourceInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  datingId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  pages: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(), UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(), 
  having: UserScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const SessionFindFirstArgsSchema: z.ZodType<Prisma.SessionFindFirstArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereInputSchema.optional(), 
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(), SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SessionScalarFieldEnumSchema, SessionScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const SessionFindFirstOrThrowArgsSchema: z.ZodType<Prisma.SessionFindFirstOrThrowArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereInputSchema.optional(), 
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(), SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SessionScalarFieldEnumSchema, SessionScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const SessionFindManyArgsSchema: z.ZodType<Prisma.SessionFindManyArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereInputSchema.optional(), 
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(), SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SessionScalarFieldEnumSchema, SessionScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const SessionAggregateArgsSchema: z.ZodType<Prisma.SessionAggregateArgs> = z.object({
  where: SessionWhereInputSchema.optional(), 
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(), SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const SessionGroupByArgsSchema: z.ZodType<Prisma.SessionGroupByArgs> = z.object({
  where: SessionWhereInputSchema.optional(), 
  orderBy: z.union([ SessionOrderByWithAggregationInputSchema.array(), SessionOrderByWithAggregationInputSchema ]).optional(),
  by: SessionScalarFieldEnumSchema.array(), 
  having: SessionScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const SessionFindUniqueArgsSchema: z.ZodType<Prisma.SessionFindUniqueArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema, 
}).strict();

export const SessionFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.SessionFindUniqueOrThrowArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema, 
}).strict();

export const PersonFindFirstArgsSchema: z.ZodType<Prisma.PersonFindFirstArgs> = z.object({
  select: PersonSelectSchema.optional(),
  include: PersonIncludeSchema.optional(),
  where: PersonWhereInputSchema.optional(), 
  orderBy: z.union([ PersonOrderByWithRelationInputSchema.array(), PersonOrderByWithRelationInputSchema ]).optional(),
  cursor: PersonWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PersonScalarFieldEnumSchema, PersonScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const PersonFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PersonFindFirstOrThrowArgs> = z.object({
  select: PersonSelectSchema.optional(),
  include: PersonIncludeSchema.optional(),
  where: PersonWhereInputSchema.optional(), 
  orderBy: z.union([ PersonOrderByWithRelationInputSchema.array(), PersonOrderByWithRelationInputSchema ]).optional(),
  cursor: PersonWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PersonScalarFieldEnumSchema, PersonScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const PersonFindManyArgsSchema: z.ZodType<Prisma.PersonFindManyArgs> = z.object({
  select: PersonSelectSchema.optional(),
  include: PersonIncludeSchema.optional(),
  where: PersonWhereInputSchema.optional(), 
  orderBy: z.union([ PersonOrderByWithRelationInputSchema.array(), PersonOrderByWithRelationInputSchema ]).optional(),
  cursor: PersonWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PersonScalarFieldEnumSchema, PersonScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const PersonAggregateArgsSchema: z.ZodType<Prisma.PersonAggregateArgs> = z.object({
  where: PersonWhereInputSchema.optional(), 
  orderBy: z.union([ PersonOrderByWithRelationInputSchema.array(), PersonOrderByWithRelationInputSchema ]).optional(),
  cursor: PersonWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const PersonGroupByArgsSchema: z.ZodType<Prisma.PersonGroupByArgs> = z.object({
  where: PersonWhereInputSchema.optional(), 
  orderBy: z.union([ PersonOrderByWithAggregationInputSchema.array(), PersonOrderByWithAggregationInputSchema ]).optional(),
  by: PersonScalarFieldEnumSchema.array(), 
  having: PersonScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const PersonFindUniqueArgsSchema: z.ZodType<Prisma.PersonFindUniqueArgs> = z.object({
  select: PersonSelectSchema.optional(),
  include: PersonIncludeSchema.optional(),
  where: PersonWhereUniqueInputSchema, 
}).strict();

export const PersonFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PersonFindUniqueOrThrowArgs> = z.object({
  select: PersonSelectSchema.optional(),
  include: PersonIncludeSchema.optional(),
  where: PersonWhereUniqueInputSchema, 
}).strict();

export const ReignFindFirstArgsSchema: z.ZodType<Prisma.ReignFindFirstArgs> = z.object({
  select: ReignSelectSchema.optional(),
  include: ReignIncludeSchema.optional(),
  where: ReignWhereInputSchema.optional(), 
  orderBy: z.union([ ReignOrderByWithRelationInputSchema.array(), ReignOrderByWithRelationInputSchema ]).optional(),
  cursor: ReignWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ReignScalarFieldEnumSchema, ReignScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ReignFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ReignFindFirstOrThrowArgs> = z.object({
  select: ReignSelectSchema.optional(),
  include: ReignIncludeSchema.optional(),
  where: ReignWhereInputSchema.optional(), 
  orderBy: z.union([ ReignOrderByWithRelationInputSchema.array(), ReignOrderByWithRelationInputSchema ]).optional(),
  cursor: ReignWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ReignScalarFieldEnumSchema, ReignScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ReignFindManyArgsSchema: z.ZodType<Prisma.ReignFindManyArgs> = z.object({
  select: ReignSelectSchema.optional(),
  include: ReignIncludeSchema.optional(),
  where: ReignWhereInputSchema.optional(), 
  orderBy: z.union([ ReignOrderByWithRelationInputSchema.array(), ReignOrderByWithRelationInputSchema ]).optional(),
  cursor: ReignWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ReignScalarFieldEnumSchema, ReignScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ReignAggregateArgsSchema: z.ZodType<Prisma.ReignAggregateArgs> = z.object({
  where: ReignWhereInputSchema.optional(), 
  orderBy: z.union([ ReignOrderByWithRelationInputSchema.array(), ReignOrderByWithRelationInputSchema ]).optional(),
  cursor: ReignWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ReignGroupByArgsSchema: z.ZodType<Prisma.ReignGroupByArgs> = z.object({
  where: ReignWhereInputSchema.optional(), 
  orderBy: z.union([ ReignOrderByWithAggregationInputSchema.array(), ReignOrderByWithAggregationInputSchema ]).optional(),
  by: ReignScalarFieldEnumSchema.array(), 
  having: ReignScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ReignFindUniqueArgsSchema: z.ZodType<Prisma.ReignFindUniqueArgs> = z.object({
  select: ReignSelectSchema.optional(),
  include: ReignIncludeSchema.optional(),
  where: ReignWhereUniqueInputSchema, 
}).strict();

export const ReignFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ReignFindUniqueOrThrowArgs> = z.object({
  select: ReignSelectSchema.optional(),
  include: ReignIncludeSchema.optional(),
  where: ReignWhereUniqueInputSchema, 
}).strict();

export const MinistryFindFirstArgsSchema: z.ZodType<Prisma.MinistryFindFirstArgs> = z.object({
  select: MinistrySelectSchema.optional(),
  include: MinistryIncludeSchema.optional(),
  where: MinistryWhereInputSchema.optional(), 
  orderBy: z.union([ MinistryOrderByWithRelationInputSchema.array(), MinistryOrderByWithRelationInputSchema ]).optional(),
  cursor: MinistryWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MinistryScalarFieldEnumSchema, MinistryScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const MinistryFindFirstOrThrowArgsSchema: z.ZodType<Prisma.MinistryFindFirstOrThrowArgs> = z.object({
  select: MinistrySelectSchema.optional(),
  include: MinistryIncludeSchema.optional(),
  where: MinistryWhereInputSchema.optional(), 
  orderBy: z.union([ MinistryOrderByWithRelationInputSchema.array(), MinistryOrderByWithRelationInputSchema ]).optional(),
  cursor: MinistryWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MinistryScalarFieldEnumSchema, MinistryScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const MinistryFindManyArgsSchema: z.ZodType<Prisma.MinistryFindManyArgs> = z.object({
  select: MinistrySelectSchema.optional(),
  include: MinistryIncludeSchema.optional(),
  where: MinistryWhereInputSchema.optional(), 
  orderBy: z.union([ MinistryOrderByWithRelationInputSchema.array(), MinistryOrderByWithRelationInputSchema ]).optional(),
  cursor: MinistryWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MinistryScalarFieldEnumSchema, MinistryScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const MinistryAggregateArgsSchema: z.ZodType<Prisma.MinistryAggregateArgs> = z.object({
  where: MinistryWhereInputSchema.optional(), 
  orderBy: z.union([ MinistryOrderByWithRelationInputSchema.array(), MinistryOrderByWithRelationInputSchema ]).optional(),
  cursor: MinistryWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const MinistryGroupByArgsSchema: z.ZodType<Prisma.MinistryGroupByArgs> = z.object({
  where: MinistryWhereInputSchema.optional(), 
  orderBy: z.union([ MinistryOrderByWithAggregationInputSchema.array(), MinistryOrderByWithAggregationInputSchema ]).optional(),
  by: MinistryScalarFieldEnumSchema.array(), 
  having: MinistryScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const MinistryFindUniqueArgsSchema: z.ZodType<Prisma.MinistryFindUniqueArgs> = z.object({
  select: MinistrySelectSchema.optional(),
  include: MinistryIncludeSchema.optional(),
  where: MinistryWhereUniqueInputSchema, 
}).strict();

export const MinistryFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.MinistryFindUniqueOrThrowArgs> = z.object({
  select: MinistrySelectSchema.optional(),
  include: MinistryIncludeSchema.optional(),
  where: MinistryWhereUniqueInputSchema, 
}).strict();

export const DatingFindFirstArgsSchema: z.ZodType<Prisma.DatingFindFirstArgs> = z.object({
  select: DatingSelectSchema.optional(),
  include: DatingIncludeSchema.optional(),
  where: DatingWhereInputSchema.optional(), 
  orderBy: z.union([ DatingOrderByWithRelationInputSchema.array(), DatingOrderByWithRelationInputSchema ]).optional(),
  cursor: DatingWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DatingScalarFieldEnumSchema, DatingScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const DatingFindFirstOrThrowArgsSchema: z.ZodType<Prisma.DatingFindFirstOrThrowArgs> = z.object({
  select: DatingSelectSchema.optional(),
  include: DatingIncludeSchema.optional(),
  where: DatingWhereInputSchema.optional(), 
  orderBy: z.union([ DatingOrderByWithRelationInputSchema.array(), DatingOrderByWithRelationInputSchema ]).optional(),
  cursor: DatingWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DatingScalarFieldEnumSchema, DatingScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const DatingFindManyArgsSchema: z.ZodType<Prisma.DatingFindManyArgs> = z.object({
  select: DatingSelectSchema.optional(),
  include: DatingIncludeSchema.optional(),
  where: DatingWhereInputSchema.optional(), 
  orderBy: z.union([ DatingOrderByWithRelationInputSchema.array(), DatingOrderByWithRelationInputSchema ]).optional(),
  cursor: DatingWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DatingScalarFieldEnumSchema, DatingScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const DatingAggregateArgsSchema: z.ZodType<Prisma.DatingAggregateArgs> = z.object({
  where: DatingWhereInputSchema.optional(), 
  orderBy: z.union([ DatingOrderByWithRelationInputSchema.array(), DatingOrderByWithRelationInputSchema ]).optional(),
  cursor: DatingWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const DatingGroupByArgsSchema: z.ZodType<Prisma.DatingGroupByArgs> = z.object({
  where: DatingWhereInputSchema.optional(), 
  orderBy: z.union([ DatingOrderByWithAggregationInputSchema.array(), DatingOrderByWithAggregationInputSchema ]).optional(),
  by: DatingScalarFieldEnumSchema.array(), 
  having: DatingScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const DatingFindUniqueArgsSchema: z.ZodType<Prisma.DatingFindUniqueArgs> = z.object({
  select: DatingSelectSchema.optional(),
  include: DatingIncludeSchema.optional(),
  where: DatingWhereUniqueInputSchema, 
}).strict();

export const DatingFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.DatingFindUniqueOrThrowArgs> = z.object({
  select: DatingSelectSchema.optional(),
  include: DatingIncludeSchema.optional(),
  where: DatingWhereUniqueInputSchema, 
}).strict();

export const EvidenceFindFirstArgsSchema: z.ZodType<Prisma.EvidenceFindFirstArgs> = z.object({
  select: EvidenceSelectSchema.optional(),
  include: EvidenceIncludeSchema.optional(),
  where: EvidenceWhereInputSchema.optional(), 
  orderBy: z.union([ EvidenceOrderByWithRelationInputSchema.array(), EvidenceOrderByWithRelationInputSchema ]).optional(),
  cursor: EvidenceWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EvidenceScalarFieldEnumSchema, EvidenceScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const EvidenceFindFirstOrThrowArgsSchema: z.ZodType<Prisma.EvidenceFindFirstOrThrowArgs> = z.object({
  select: EvidenceSelectSchema.optional(),
  include: EvidenceIncludeSchema.optional(),
  where: EvidenceWhereInputSchema.optional(), 
  orderBy: z.union([ EvidenceOrderByWithRelationInputSchema.array(), EvidenceOrderByWithRelationInputSchema ]).optional(),
  cursor: EvidenceWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EvidenceScalarFieldEnumSchema, EvidenceScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const EvidenceFindManyArgsSchema: z.ZodType<Prisma.EvidenceFindManyArgs> = z.object({
  select: EvidenceSelectSchema.optional(),
  include: EvidenceIncludeSchema.optional(),
  where: EvidenceWhereInputSchema.optional(), 
  orderBy: z.union([ EvidenceOrderByWithRelationInputSchema.array(), EvidenceOrderByWithRelationInputSchema ]).optional(),
  cursor: EvidenceWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EvidenceScalarFieldEnumSchema, EvidenceScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const EvidenceAggregateArgsSchema: z.ZodType<Prisma.EvidenceAggregateArgs> = z.object({
  where: EvidenceWhereInputSchema.optional(), 
  orderBy: z.union([ EvidenceOrderByWithRelationInputSchema.array(), EvidenceOrderByWithRelationInputSchema ]).optional(),
  cursor: EvidenceWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const EvidenceGroupByArgsSchema: z.ZodType<Prisma.EvidenceGroupByArgs> = z.object({
  where: EvidenceWhereInputSchema.optional(), 
  orderBy: z.union([ EvidenceOrderByWithAggregationInputSchema.array(), EvidenceOrderByWithAggregationInputSchema ]).optional(),
  by: EvidenceScalarFieldEnumSchema.array(), 
  having: EvidenceScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const EvidenceFindUniqueArgsSchema: z.ZodType<Prisma.EvidenceFindUniqueArgs> = z.object({
  select: EvidenceSelectSchema.optional(),
  include: EvidenceIncludeSchema.optional(),
  where: EvidenceWhereUniqueInputSchema, 
}).strict();

export const EvidenceFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.EvidenceFindUniqueOrThrowArgs> = z.object({
  select: EvidenceSelectSchema.optional(),
  include: EvidenceIncludeSchema.optional(),
  where: EvidenceWhereUniqueInputSchema, 
}).strict();

export const SourceFindFirstArgsSchema: z.ZodType<Prisma.SourceFindFirstArgs> = z.object({
  select: SourceSelectSchema.optional(),
  include: SourceIncludeSchema.optional(),
  where: SourceWhereInputSchema.optional(), 
  orderBy: z.union([ SourceOrderByWithRelationInputSchema.array(), SourceOrderByWithRelationInputSchema ]).optional(),
  cursor: SourceWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SourceScalarFieldEnumSchema, SourceScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const SourceFindFirstOrThrowArgsSchema: z.ZodType<Prisma.SourceFindFirstOrThrowArgs> = z.object({
  select: SourceSelectSchema.optional(),
  include: SourceIncludeSchema.optional(),
  where: SourceWhereInputSchema.optional(), 
  orderBy: z.union([ SourceOrderByWithRelationInputSchema.array(), SourceOrderByWithRelationInputSchema ]).optional(),
  cursor: SourceWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SourceScalarFieldEnumSchema, SourceScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const SourceFindManyArgsSchema: z.ZodType<Prisma.SourceFindManyArgs> = z.object({
  select: SourceSelectSchema.optional(),
  include: SourceIncludeSchema.optional(),
  where: SourceWhereInputSchema.optional(), 
  orderBy: z.union([ SourceOrderByWithRelationInputSchema.array(), SourceOrderByWithRelationInputSchema ]).optional(),
  cursor: SourceWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SourceScalarFieldEnumSchema, SourceScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const SourceAggregateArgsSchema: z.ZodType<Prisma.SourceAggregateArgs> = z.object({
  where: SourceWhereInputSchema.optional(), 
  orderBy: z.union([ SourceOrderByWithRelationInputSchema.array(), SourceOrderByWithRelationInputSchema ]).optional(),
  cursor: SourceWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const SourceGroupByArgsSchema: z.ZodType<Prisma.SourceGroupByArgs> = z.object({
  where: SourceWhereInputSchema.optional(), 
  orderBy: z.union([ SourceOrderByWithAggregationInputSchema.array(), SourceOrderByWithAggregationInputSchema ]).optional(),
  by: SourceScalarFieldEnumSchema.array(), 
  having: SourceScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const SourceFindUniqueArgsSchema: z.ZodType<Prisma.SourceFindUniqueArgs> = z.object({
  select: SourceSelectSchema.optional(),
  include: SourceIncludeSchema.optional(),
  where: SourceWhereUniqueInputSchema, 
}).strict();

export const SourceFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.SourceFindUniqueOrThrowArgs> = z.object({
  select: SourceSelectSchema.optional(),
  include: SourceIncludeSchema.optional(),
  where: SourceWhereUniqueInputSchema, 
}).strict();

export const CitationFindFirstArgsSchema: z.ZodType<Prisma.CitationFindFirstArgs> = z.object({
  select: CitationSelectSchema.optional(),
  include: CitationIncludeSchema.optional(),
  where: CitationWhereInputSchema.optional(), 
  orderBy: z.union([ CitationOrderByWithRelationInputSchema.array(), CitationOrderByWithRelationInputSchema ]).optional(),
  cursor: CitationWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CitationScalarFieldEnumSchema, CitationScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const CitationFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CitationFindFirstOrThrowArgs> = z.object({
  select: CitationSelectSchema.optional(),
  include: CitationIncludeSchema.optional(),
  where: CitationWhereInputSchema.optional(), 
  orderBy: z.union([ CitationOrderByWithRelationInputSchema.array(), CitationOrderByWithRelationInputSchema ]).optional(),
  cursor: CitationWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CitationScalarFieldEnumSchema, CitationScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const CitationFindManyArgsSchema: z.ZodType<Prisma.CitationFindManyArgs> = z.object({
  select: CitationSelectSchema.optional(),
  include: CitationIncludeSchema.optional(),
  where: CitationWhereInputSchema.optional(), 
  orderBy: z.union([ CitationOrderByWithRelationInputSchema.array(), CitationOrderByWithRelationInputSchema ]).optional(),
  cursor: CitationWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CitationScalarFieldEnumSchema, CitationScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const CitationAggregateArgsSchema: z.ZodType<Prisma.CitationAggregateArgs> = z.object({
  where: CitationWhereInputSchema.optional(), 
  orderBy: z.union([ CitationOrderByWithRelationInputSchema.array(), CitationOrderByWithRelationInputSchema ]).optional(),
  cursor: CitationWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const CitationGroupByArgsSchema: z.ZodType<Prisma.CitationGroupByArgs> = z.object({
  where: CitationWhereInputSchema.optional(), 
  orderBy: z.union([ CitationOrderByWithAggregationInputSchema.array(), CitationOrderByWithAggregationInputSchema ]).optional(),
  by: CitationScalarFieldEnumSchema.array(), 
  having: CitationScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const CitationFindUniqueArgsSchema: z.ZodType<Prisma.CitationFindUniqueArgs> = z.object({
  select: CitationSelectSchema.optional(),
  include: CitationIncludeSchema.optional(),
  where: CitationWhereUniqueInputSchema, 
}).strict();

export const CitationFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CitationFindUniqueOrThrowArgs> = z.object({
  select: CitationSelectSchema.optional(),
  include: CitationIncludeSchema.optional(),
  where: CitationWhereUniqueInputSchema, 
}).strict();

export const PassageFindFirstArgsSchema: z.ZodType<Prisma.PassageFindFirstArgs> = z.object({
  select: PassageSelectSchema.optional(),
  include: PassageIncludeSchema.optional(),
  where: PassageWhereInputSchema.optional(), 
  orderBy: z.union([ PassageOrderByWithRelationInputSchema.array(), PassageOrderByWithRelationInputSchema ]).optional(),
  cursor: PassageWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PassageScalarFieldEnumSchema, PassageScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const PassageFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PassageFindFirstOrThrowArgs> = z.object({
  select: PassageSelectSchema.optional(),
  include: PassageIncludeSchema.optional(),
  where: PassageWhereInputSchema.optional(), 
  orderBy: z.union([ PassageOrderByWithRelationInputSchema.array(), PassageOrderByWithRelationInputSchema ]).optional(),
  cursor: PassageWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PassageScalarFieldEnumSchema, PassageScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const PassageFindManyArgsSchema: z.ZodType<Prisma.PassageFindManyArgs> = z.object({
  select: PassageSelectSchema.optional(),
  include: PassageIncludeSchema.optional(),
  where: PassageWhereInputSchema.optional(), 
  orderBy: z.union([ PassageOrderByWithRelationInputSchema.array(), PassageOrderByWithRelationInputSchema ]).optional(),
  cursor: PassageWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PassageScalarFieldEnumSchema, PassageScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const PassageAggregateArgsSchema: z.ZodType<Prisma.PassageAggregateArgs> = z.object({
  where: PassageWhereInputSchema.optional(), 
  orderBy: z.union([ PassageOrderByWithRelationInputSchema.array(), PassageOrderByWithRelationInputSchema ]).optional(),
  cursor: PassageWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const PassageGroupByArgsSchema: z.ZodType<Prisma.PassageGroupByArgs> = z.object({
  where: PassageWhereInputSchema.optional(), 
  orderBy: z.union([ PassageOrderByWithAggregationInputSchema.array(), PassageOrderByWithAggregationInputSchema ]).optional(),
  by: PassageScalarFieldEnumSchema.array(), 
  having: PassageScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const PassageFindUniqueArgsSchema: z.ZodType<Prisma.PassageFindUniqueArgs> = z.object({
  select: PassageSelectSchema.optional(),
  include: PassageIncludeSchema.optional(),
  where: PassageWhereUniqueInputSchema, 
}).strict();

export const PassageFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PassageFindUniqueOrThrowArgs> = z.object({
  select: PassageSelectSchema.optional(),
  include: PassageIncludeSchema.optional(),
  where: PassageWhereUniqueInputSchema, 
}).strict();

export const FamilyMemberFindFirstArgsSchema: z.ZodType<Prisma.FamilyMemberFindFirstArgs> = z.object({
  select: FamilyMemberSelectSchema.optional(),
  include: FamilyMemberIncludeSchema.optional(),
  where: FamilyMemberWhereInputSchema.optional(), 
  orderBy: z.union([ FamilyMemberOrderByWithRelationInputSchema.array(), FamilyMemberOrderByWithRelationInputSchema ]).optional(),
  cursor: FamilyMemberWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FamilyMemberScalarFieldEnumSchema, FamilyMemberScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const FamilyMemberFindFirstOrThrowArgsSchema: z.ZodType<Prisma.FamilyMemberFindFirstOrThrowArgs> = z.object({
  select: FamilyMemberSelectSchema.optional(),
  include: FamilyMemberIncludeSchema.optional(),
  where: FamilyMemberWhereInputSchema.optional(), 
  orderBy: z.union([ FamilyMemberOrderByWithRelationInputSchema.array(), FamilyMemberOrderByWithRelationInputSchema ]).optional(),
  cursor: FamilyMemberWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FamilyMemberScalarFieldEnumSchema, FamilyMemberScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const FamilyMemberFindManyArgsSchema: z.ZodType<Prisma.FamilyMemberFindManyArgs> = z.object({
  select: FamilyMemberSelectSchema.optional(),
  include: FamilyMemberIncludeSchema.optional(),
  where: FamilyMemberWhereInputSchema.optional(), 
  orderBy: z.union([ FamilyMemberOrderByWithRelationInputSchema.array(), FamilyMemberOrderByWithRelationInputSchema ]).optional(),
  cursor: FamilyMemberWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FamilyMemberScalarFieldEnumSchema, FamilyMemberScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const FamilyMemberAggregateArgsSchema: z.ZodType<Prisma.FamilyMemberAggregateArgs> = z.object({
  where: FamilyMemberWhereInputSchema.optional(), 
  orderBy: z.union([ FamilyMemberOrderByWithRelationInputSchema.array(), FamilyMemberOrderByWithRelationInputSchema ]).optional(),
  cursor: FamilyMemberWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const FamilyMemberGroupByArgsSchema: z.ZodType<Prisma.FamilyMemberGroupByArgs> = z.object({
  where: FamilyMemberWhereInputSchema.optional(), 
  orderBy: z.union([ FamilyMemberOrderByWithAggregationInputSchema.array(), FamilyMemberOrderByWithAggregationInputSchema ]).optional(),
  by: FamilyMemberScalarFieldEnumSchema.array(), 
  having: FamilyMemberScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const FamilyMemberFindUniqueArgsSchema: z.ZodType<Prisma.FamilyMemberFindUniqueArgs> = z.object({
  select: FamilyMemberSelectSchema.optional(),
  include: FamilyMemberIncludeSchema.optional(),
  where: FamilyMemberWhereUniqueInputSchema, 
}).strict();

export const FamilyMemberFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.FamilyMemberFindUniqueOrThrowArgs> = z.object({
  select: FamilyMemberSelectSchema.optional(),
  include: FamilyMemberIncludeSchema.optional(),
  where: FamilyMemberWhereUniqueInputSchema, 
}).strict();

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema, UserUncheckedCreateInputSchema ]),
}).strict();

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema, 
  create: z.union([ UserCreateInputSchema, UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema, UserUncheckedUpdateInputSchema ]),
}).strict();

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema, UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const UserCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema, UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserUpdateInputSchema, UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema, UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const UserUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.UserUpdateManyAndReturnArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema, UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const SessionCreateArgsSchema: z.ZodType<Prisma.SessionCreateArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  data: z.union([ SessionCreateInputSchema, SessionUncheckedCreateInputSchema ]),
}).strict();

export const SessionUpsertArgsSchema: z.ZodType<Prisma.SessionUpsertArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema, 
  create: z.union([ SessionCreateInputSchema, SessionUncheckedCreateInputSchema ]),
  update: z.union([ SessionUpdateInputSchema, SessionUncheckedUpdateInputSchema ]),
}).strict();

export const SessionCreateManyArgsSchema: z.ZodType<Prisma.SessionCreateManyArgs> = z.object({
  data: z.union([ SessionCreateManyInputSchema, SessionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const SessionCreateManyAndReturnArgsSchema: z.ZodType<Prisma.SessionCreateManyAndReturnArgs> = z.object({
  data: z.union([ SessionCreateManyInputSchema, SessionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const SessionDeleteArgsSchema: z.ZodType<Prisma.SessionDeleteArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema, 
}).strict();

export const SessionUpdateArgsSchema: z.ZodType<Prisma.SessionUpdateArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  data: z.union([ SessionUpdateInputSchema, SessionUncheckedUpdateInputSchema ]),
  where: SessionWhereUniqueInputSchema, 
}).strict();

export const SessionUpdateManyArgsSchema: z.ZodType<Prisma.SessionUpdateManyArgs> = z.object({
  data: z.union([ SessionUpdateManyMutationInputSchema, SessionUncheckedUpdateManyInputSchema ]),
  where: SessionWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const SessionUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.SessionUpdateManyAndReturnArgs> = z.object({
  data: z.union([ SessionUpdateManyMutationInputSchema, SessionUncheckedUpdateManyInputSchema ]),
  where: SessionWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const SessionDeleteManyArgsSchema: z.ZodType<Prisma.SessionDeleteManyArgs> = z.object({
  where: SessionWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const PersonCreateArgsSchema: z.ZodType<Prisma.PersonCreateArgs> = z.object({
  select: PersonSelectSchema.optional(),
  include: PersonIncludeSchema.optional(),
  data: z.union([ PersonCreateInputSchema, PersonUncheckedCreateInputSchema ]),
}).strict();

export const PersonUpsertArgsSchema: z.ZodType<Prisma.PersonUpsertArgs> = z.object({
  select: PersonSelectSchema.optional(),
  include: PersonIncludeSchema.optional(),
  where: PersonWhereUniqueInputSchema, 
  create: z.union([ PersonCreateInputSchema, PersonUncheckedCreateInputSchema ]),
  update: z.union([ PersonUpdateInputSchema, PersonUncheckedUpdateInputSchema ]),
}).strict();

export const PersonCreateManyArgsSchema: z.ZodType<Prisma.PersonCreateManyArgs> = z.object({
  data: z.union([ PersonCreateManyInputSchema, PersonCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const PersonCreateManyAndReturnArgsSchema: z.ZodType<Prisma.PersonCreateManyAndReturnArgs> = z.object({
  data: z.union([ PersonCreateManyInputSchema, PersonCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const PersonDeleteArgsSchema: z.ZodType<Prisma.PersonDeleteArgs> = z.object({
  select: PersonSelectSchema.optional(),
  include: PersonIncludeSchema.optional(),
  where: PersonWhereUniqueInputSchema, 
}).strict();

export const PersonUpdateArgsSchema: z.ZodType<Prisma.PersonUpdateArgs> = z.object({
  select: PersonSelectSchema.optional(),
  include: PersonIncludeSchema.optional(),
  data: z.union([ PersonUpdateInputSchema, PersonUncheckedUpdateInputSchema ]),
  where: PersonWhereUniqueInputSchema, 
}).strict();

export const PersonUpdateManyArgsSchema: z.ZodType<Prisma.PersonUpdateManyArgs> = z.object({
  data: z.union([ PersonUpdateManyMutationInputSchema, PersonUncheckedUpdateManyInputSchema ]),
  where: PersonWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const PersonUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.PersonUpdateManyAndReturnArgs> = z.object({
  data: z.union([ PersonUpdateManyMutationInputSchema, PersonUncheckedUpdateManyInputSchema ]),
  where: PersonWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const PersonDeleteManyArgsSchema: z.ZodType<Prisma.PersonDeleteManyArgs> = z.object({
  where: PersonWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ReignCreateArgsSchema: z.ZodType<Prisma.ReignCreateArgs> = z.object({
  select: ReignSelectSchema.optional(),
  include: ReignIncludeSchema.optional(),
  data: z.union([ ReignCreateInputSchema, ReignUncheckedCreateInputSchema ]),
}).strict();

export const ReignUpsertArgsSchema: z.ZodType<Prisma.ReignUpsertArgs> = z.object({
  select: ReignSelectSchema.optional(),
  include: ReignIncludeSchema.optional(),
  where: ReignWhereUniqueInputSchema, 
  create: z.union([ ReignCreateInputSchema, ReignUncheckedCreateInputSchema ]),
  update: z.union([ ReignUpdateInputSchema, ReignUncheckedUpdateInputSchema ]),
}).strict();

export const ReignCreateManyArgsSchema: z.ZodType<Prisma.ReignCreateManyArgs> = z.object({
  data: z.union([ ReignCreateManyInputSchema, ReignCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const ReignCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ReignCreateManyAndReturnArgs> = z.object({
  data: z.union([ ReignCreateManyInputSchema, ReignCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const ReignDeleteArgsSchema: z.ZodType<Prisma.ReignDeleteArgs> = z.object({
  select: ReignSelectSchema.optional(),
  include: ReignIncludeSchema.optional(),
  where: ReignWhereUniqueInputSchema, 
}).strict();

export const ReignUpdateArgsSchema: z.ZodType<Prisma.ReignUpdateArgs> = z.object({
  select: ReignSelectSchema.optional(),
  include: ReignIncludeSchema.optional(),
  data: z.union([ ReignUpdateInputSchema, ReignUncheckedUpdateInputSchema ]),
  where: ReignWhereUniqueInputSchema, 
}).strict();

export const ReignUpdateManyArgsSchema: z.ZodType<Prisma.ReignUpdateManyArgs> = z.object({
  data: z.union([ ReignUpdateManyMutationInputSchema, ReignUncheckedUpdateManyInputSchema ]),
  where: ReignWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ReignUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.ReignUpdateManyAndReturnArgs> = z.object({
  data: z.union([ ReignUpdateManyMutationInputSchema, ReignUncheckedUpdateManyInputSchema ]),
  where: ReignWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ReignDeleteManyArgsSchema: z.ZodType<Prisma.ReignDeleteManyArgs> = z.object({
  where: ReignWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const MinistryCreateArgsSchema: z.ZodType<Prisma.MinistryCreateArgs> = z.object({
  select: MinistrySelectSchema.optional(),
  include: MinistryIncludeSchema.optional(),
  data: z.union([ MinistryCreateInputSchema, MinistryUncheckedCreateInputSchema ]),
}).strict();

export const MinistryUpsertArgsSchema: z.ZodType<Prisma.MinistryUpsertArgs> = z.object({
  select: MinistrySelectSchema.optional(),
  include: MinistryIncludeSchema.optional(),
  where: MinistryWhereUniqueInputSchema, 
  create: z.union([ MinistryCreateInputSchema, MinistryUncheckedCreateInputSchema ]),
  update: z.union([ MinistryUpdateInputSchema, MinistryUncheckedUpdateInputSchema ]),
}).strict();

export const MinistryCreateManyArgsSchema: z.ZodType<Prisma.MinistryCreateManyArgs> = z.object({
  data: z.union([ MinistryCreateManyInputSchema, MinistryCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const MinistryCreateManyAndReturnArgsSchema: z.ZodType<Prisma.MinistryCreateManyAndReturnArgs> = z.object({
  data: z.union([ MinistryCreateManyInputSchema, MinistryCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const MinistryDeleteArgsSchema: z.ZodType<Prisma.MinistryDeleteArgs> = z.object({
  select: MinistrySelectSchema.optional(),
  include: MinistryIncludeSchema.optional(),
  where: MinistryWhereUniqueInputSchema, 
}).strict();

export const MinistryUpdateArgsSchema: z.ZodType<Prisma.MinistryUpdateArgs> = z.object({
  select: MinistrySelectSchema.optional(),
  include: MinistryIncludeSchema.optional(),
  data: z.union([ MinistryUpdateInputSchema, MinistryUncheckedUpdateInputSchema ]),
  where: MinistryWhereUniqueInputSchema, 
}).strict();

export const MinistryUpdateManyArgsSchema: z.ZodType<Prisma.MinistryUpdateManyArgs> = z.object({
  data: z.union([ MinistryUpdateManyMutationInputSchema, MinistryUncheckedUpdateManyInputSchema ]),
  where: MinistryWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const MinistryUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.MinistryUpdateManyAndReturnArgs> = z.object({
  data: z.union([ MinistryUpdateManyMutationInputSchema, MinistryUncheckedUpdateManyInputSchema ]),
  where: MinistryWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const MinistryDeleteManyArgsSchema: z.ZodType<Prisma.MinistryDeleteManyArgs> = z.object({
  where: MinistryWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const DatingCreateArgsSchema: z.ZodType<Prisma.DatingCreateArgs> = z.object({
  select: DatingSelectSchema.optional(),
  include: DatingIncludeSchema.optional(),
  data: z.union([ DatingCreateInputSchema, DatingUncheckedCreateInputSchema ]),
}).strict();

export const DatingUpsertArgsSchema: z.ZodType<Prisma.DatingUpsertArgs> = z.object({
  select: DatingSelectSchema.optional(),
  include: DatingIncludeSchema.optional(),
  where: DatingWhereUniqueInputSchema, 
  create: z.union([ DatingCreateInputSchema, DatingUncheckedCreateInputSchema ]),
  update: z.union([ DatingUpdateInputSchema, DatingUncheckedUpdateInputSchema ]),
}).strict();

export const DatingCreateManyArgsSchema: z.ZodType<Prisma.DatingCreateManyArgs> = z.object({
  data: z.union([ DatingCreateManyInputSchema, DatingCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const DatingCreateManyAndReturnArgsSchema: z.ZodType<Prisma.DatingCreateManyAndReturnArgs> = z.object({
  data: z.union([ DatingCreateManyInputSchema, DatingCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const DatingDeleteArgsSchema: z.ZodType<Prisma.DatingDeleteArgs> = z.object({
  select: DatingSelectSchema.optional(),
  include: DatingIncludeSchema.optional(),
  where: DatingWhereUniqueInputSchema, 
}).strict();

export const DatingUpdateArgsSchema: z.ZodType<Prisma.DatingUpdateArgs> = z.object({
  select: DatingSelectSchema.optional(),
  include: DatingIncludeSchema.optional(),
  data: z.union([ DatingUpdateInputSchema, DatingUncheckedUpdateInputSchema ]),
  where: DatingWhereUniqueInputSchema, 
}).strict();

export const DatingUpdateManyArgsSchema: z.ZodType<Prisma.DatingUpdateManyArgs> = z.object({
  data: z.union([ DatingUpdateManyMutationInputSchema, DatingUncheckedUpdateManyInputSchema ]),
  where: DatingWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const DatingUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.DatingUpdateManyAndReturnArgs> = z.object({
  data: z.union([ DatingUpdateManyMutationInputSchema, DatingUncheckedUpdateManyInputSchema ]),
  where: DatingWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const DatingDeleteManyArgsSchema: z.ZodType<Prisma.DatingDeleteManyArgs> = z.object({
  where: DatingWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const EvidenceCreateArgsSchema: z.ZodType<Prisma.EvidenceCreateArgs> = z.object({
  select: EvidenceSelectSchema.optional(),
  include: EvidenceIncludeSchema.optional(),
  data: z.union([ EvidenceCreateInputSchema, EvidenceUncheckedCreateInputSchema ]),
}).strict();

export const EvidenceUpsertArgsSchema: z.ZodType<Prisma.EvidenceUpsertArgs> = z.object({
  select: EvidenceSelectSchema.optional(),
  include: EvidenceIncludeSchema.optional(),
  where: EvidenceWhereUniqueInputSchema, 
  create: z.union([ EvidenceCreateInputSchema, EvidenceUncheckedCreateInputSchema ]),
  update: z.union([ EvidenceUpdateInputSchema, EvidenceUncheckedUpdateInputSchema ]),
}).strict();

export const EvidenceCreateManyArgsSchema: z.ZodType<Prisma.EvidenceCreateManyArgs> = z.object({
  data: z.union([ EvidenceCreateManyInputSchema, EvidenceCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const EvidenceCreateManyAndReturnArgsSchema: z.ZodType<Prisma.EvidenceCreateManyAndReturnArgs> = z.object({
  data: z.union([ EvidenceCreateManyInputSchema, EvidenceCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const EvidenceDeleteArgsSchema: z.ZodType<Prisma.EvidenceDeleteArgs> = z.object({
  select: EvidenceSelectSchema.optional(),
  include: EvidenceIncludeSchema.optional(),
  where: EvidenceWhereUniqueInputSchema, 
}).strict();

export const EvidenceUpdateArgsSchema: z.ZodType<Prisma.EvidenceUpdateArgs> = z.object({
  select: EvidenceSelectSchema.optional(),
  include: EvidenceIncludeSchema.optional(),
  data: z.union([ EvidenceUpdateInputSchema, EvidenceUncheckedUpdateInputSchema ]),
  where: EvidenceWhereUniqueInputSchema, 
}).strict();

export const EvidenceUpdateManyArgsSchema: z.ZodType<Prisma.EvidenceUpdateManyArgs> = z.object({
  data: z.union([ EvidenceUpdateManyMutationInputSchema, EvidenceUncheckedUpdateManyInputSchema ]),
  where: EvidenceWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const EvidenceUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.EvidenceUpdateManyAndReturnArgs> = z.object({
  data: z.union([ EvidenceUpdateManyMutationInputSchema, EvidenceUncheckedUpdateManyInputSchema ]),
  where: EvidenceWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const EvidenceDeleteManyArgsSchema: z.ZodType<Prisma.EvidenceDeleteManyArgs> = z.object({
  where: EvidenceWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const SourceCreateArgsSchema: z.ZodType<Prisma.SourceCreateArgs> = z.object({
  select: SourceSelectSchema.optional(),
  include: SourceIncludeSchema.optional(),
  data: z.union([ SourceCreateInputSchema, SourceUncheckedCreateInputSchema ]),
}).strict();

export const SourceUpsertArgsSchema: z.ZodType<Prisma.SourceUpsertArgs> = z.object({
  select: SourceSelectSchema.optional(),
  include: SourceIncludeSchema.optional(),
  where: SourceWhereUniqueInputSchema, 
  create: z.union([ SourceCreateInputSchema, SourceUncheckedCreateInputSchema ]),
  update: z.union([ SourceUpdateInputSchema, SourceUncheckedUpdateInputSchema ]),
}).strict();

export const SourceCreateManyArgsSchema: z.ZodType<Prisma.SourceCreateManyArgs> = z.object({
  data: z.union([ SourceCreateManyInputSchema, SourceCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const SourceCreateManyAndReturnArgsSchema: z.ZodType<Prisma.SourceCreateManyAndReturnArgs> = z.object({
  data: z.union([ SourceCreateManyInputSchema, SourceCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const SourceDeleteArgsSchema: z.ZodType<Prisma.SourceDeleteArgs> = z.object({
  select: SourceSelectSchema.optional(),
  include: SourceIncludeSchema.optional(),
  where: SourceWhereUniqueInputSchema, 
}).strict();

export const SourceUpdateArgsSchema: z.ZodType<Prisma.SourceUpdateArgs> = z.object({
  select: SourceSelectSchema.optional(),
  include: SourceIncludeSchema.optional(),
  data: z.union([ SourceUpdateInputSchema, SourceUncheckedUpdateInputSchema ]),
  where: SourceWhereUniqueInputSchema, 
}).strict();

export const SourceUpdateManyArgsSchema: z.ZodType<Prisma.SourceUpdateManyArgs> = z.object({
  data: z.union([ SourceUpdateManyMutationInputSchema, SourceUncheckedUpdateManyInputSchema ]),
  where: SourceWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const SourceUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.SourceUpdateManyAndReturnArgs> = z.object({
  data: z.union([ SourceUpdateManyMutationInputSchema, SourceUncheckedUpdateManyInputSchema ]),
  where: SourceWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const SourceDeleteManyArgsSchema: z.ZodType<Prisma.SourceDeleteManyArgs> = z.object({
  where: SourceWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const CitationCreateArgsSchema: z.ZodType<Prisma.CitationCreateArgs> = z.object({
  select: CitationSelectSchema.optional(),
  include: CitationIncludeSchema.optional(),
  data: z.union([ CitationCreateInputSchema, CitationUncheckedCreateInputSchema ]),
}).strict();

export const CitationUpsertArgsSchema: z.ZodType<Prisma.CitationUpsertArgs> = z.object({
  select: CitationSelectSchema.optional(),
  include: CitationIncludeSchema.optional(),
  where: CitationWhereUniqueInputSchema, 
  create: z.union([ CitationCreateInputSchema, CitationUncheckedCreateInputSchema ]),
  update: z.union([ CitationUpdateInputSchema, CitationUncheckedUpdateInputSchema ]),
}).strict();

export const CitationCreateManyArgsSchema: z.ZodType<Prisma.CitationCreateManyArgs> = z.object({
  data: z.union([ CitationCreateManyInputSchema, CitationCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const CitationCreateManyAndReturnArgsSchema: z.ZodType<Prisma.CitationCreateManyAndReturnArgs> = z.object({
  data: z.union([ CitationCreateManyInputSchema, CitationCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const CitationDeleteArgsSchema: z.ZodType<Prisma.CitationDeleteArgs> = z.object({
  select: CitationSelectSchema.optional(),
  include: CitationIncludeSchema.optional(),
  where: CitationWhereUniqueInputSchema, 
}).strict();

export const CitationUpdateArgsSchema: z.ZodType<Prisma.CitationUpdateArgs> = z.object({
  select: CitationSelectSchema.optional(),
  include: CitationIncludeSchema.optional(),
  data: z.union([ CitationUpdateInputSchema, CitationUncheckedUpdateInputSchema ]),
  where: CitationWhereUniqueInputSchema, 
}).strict();

export const CitationUpdateManyArgsSchema: z.ZodType<Prisma.CitationUpdateManyArgs> = z.object({
  data: z.union([ CitationUpdateManyMutationInputSchema, CitationUncheckedUpdateManyInputSchema ]),
  where: CitationWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const CitationUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.CitationUpdateManyAndReturnArgs> = z.object({
  data: z.union([ CitationUpdateManyMutationInputSchema, CitationUncheckedUpdateManyInputSchema ]),
  where: CitationWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const CitationDeleteManyArgsSchema: z.ZodType<Prisma.CitationDeleteManyArgs> = z.object({
  where: CitationWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const PassageCreateArgsSchema: z.ZodType<Prisma.PassageCreateArgs> = z.object({
  select: PassageSelectSchema.optional(),
  include: PassageIncludeSchema.optional(),
  data: z.union([ PassageCreateInputSchema, PassageUncheckedCreateInputSchema ]),
}).strict();

export const PassageUpsertArgsSchema: z.ZodType<Prisma.PassageUpsertArgs> = z.object({
  select: PassageSelectSchema.optional(),
  include: PassageIncludeSchema.optional(),
  where: PassageWhereUniqueInputSchema, 
  create: z.union([ PassageCreateInputSchema, PassageUncheckedCreateInputSchema ]),
  update: z.union([ PassageUpdateInputSchema, PassageUncheckedUpdateInputSchema ]),
}).strict();

export const PassageCreateManyArgsSchema: z.ZodType<Prisma.PassageCreateManyArgs> = z.object({
  data: z.union([ PassageCreateManyInputSchema, PassageCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const PassageCreateManyAndReturnArgsSchema: z.ZodType<Prisma.PassageCreateManyAndReturnArgs> = z.object({
  data: z.union([ PassageCreateManyInputSchema, PassageCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const PassageDeleteArgsSchema: z.ZodType<Prisma.PassageDeleteArgs> = z.object({
  select: PassageSelectSchema.optional(),
  include: PassageIncludeSchema.optional(),
  where: PassageWhereUniqueInputSchema, 
}).strict();

export const PassageUpdateArgsSchema: z.ZodType<Prisma.PassageUpdateArgs> = z.object({
  select: PassageSelectSchema.optional(),
  include: PassageIncludeSchema.optional(),
  data: z.union([ PassageUpdateInputSchema, PassageUncheckedUpdateInputSchema ]),
  where: PassageWhereUniqueInputSchema, 
}).strict();

export const PassageUpdateManyArgsSchema: z.ZodType<Prisma.PassageUpdateManyArgs> = z.object({
  data: z.union([ PassageUpdateManyMutationInputSchema, PassageUncheckedUpdateManyInputSchema ]),
  where: PassageWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const PassageUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.PassageUpdateManyAndReturnArgs> = z.object({
  data: z.union([ PassageUpdateManyMutationInputSchema, PassageUncheckedUpdateManyInputSchema ]),
  where: PassageWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const PassageDeleteManyArgsSchema: z.ZodType<Prisma.PassageDeleteManyArgs> = z.object({
  where: PassageWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const FamilyMemberCreateArgsSchema: z.ZodType<Prisma.FamilyMemberCreateArgs> = z.object({
  select: FamilyMemberSelectSchema.optional(),
  include: FamilyMemberIncludeSchema.optional(),
  data: z.union([ FamilyMemberCreateInputSchema, FamilyMemberUncheckedCreateInputSchema ]),
}).strict();

export const FamilyMemberUpsertArgsSchema: z.ZodType<Prisma.FamilyMemberUpsertArgs> = z.object({
  select: FamilyMemberSelectSchema.optional(),
  include: FamilyMemberIncludeSchema.optional(),
  where: FamilyMemberWhereUniqueInputSchema, 
  create: z.union([ FamilyMemberCreateInputSchema, FamilyMemberUncheckedCreateInputSchema ]),
  update: z.union([ FamilyMemberUpdateInputSchema, FamilyMemberUncheckedUpdateInputSchema ]),
}).strict();

export const FamilyMemberCreateManyArgsSchema: z.ZodType<Prisma.FamilyMemberCreateManyArgs> = z.object({
  data: z.union([ FamilyMemberCreateManyInputSchema, FamilyMemberCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const FamilyMemberCreateManyAndReturnArgsSchema: z.ZodType<Prisma.FamilyMemberCreateManyAndReturnArgs> = z.object({
  data: z.union([ FamilyMemberCreateManyInputSchema, FamilyMemberCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const FamilyMemberDeleteArgsSchema: z.ZodType<Prisma.FamilyMemberDeleteArgs> = z.object({
  select: FamilyMemberSelectSchema.optional(),
  include: FamilyMemberIncludeSchema.optional(),
  where: FamilyMemberWhereUniqueInputSchema, 
}).strict();

export const FamilyMemberUpdateArgsSchema: z.ZodType<Prisma.FamilyMemberUpdateArgs> = z.object({
  select: FamilyMemberSelectSchema.optional(),
  include: FamilyMemberIncludeSchema.optional(),
  data: z.union([ FamilyMemberUpdateInputSchema, FamilyMemberUncheckedUpdateInputSchema ]),
  where: FamilyMemberWhereUniqueInputSchema, 
}).strict();

export const FamilyMemberUpdateManyArgsSchema: z.ZodType<Prisma.FamilyMemberUpdateManyArgs> = z.object({
  data: z.union([ FamilyMemberUpdateManyMutationInputSchema, FamilyMemberUncheckedUpdateManyInputSchema ]),
  where: FamilyMemberWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const FamilyMemberUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.FamilyMemberUpdateManyAndReturnArgs> = z.object({
  data: z.union([ FamilyMemberUpdateManyMutationInputSchema, FamilyMemberUncheckedUpdateManyInputSchema ]),
  where: FamilyMemberWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const FamilyMemberDeleteManyArgsSchema: z.ZodType<Prisma.FamilyMemberDeleteManyArgs> = z.object({
  where: FamilyMemberWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();