import type { Prisma } from '@prisma/client'

import type { Dataset } from './dataset'
import type { Dating, Passage } from './schema'

const passageColumns = (passage: Passage) => ({
  book: passage.book,
  fromChapter: passage.from.chapter,
  fromVerse: passage.from.verse ?? null,
  toChapter: passage.to?.chapter ?? null,
  toVerse: passage.to?.verse ?? null,
})

const noPassageColumns = {
  book: null,
  fromChapter: null,
  fromVerse: null,
  toChapter: null,
  toVerse: null,
}

/**
 * Flattens the dataset into rows for each table. Ids are derived from position (e.g.
 * "ahab/king/0/evidence/1"), so every table can be filled with one createMany and no ids need to
 * be read back from the database.
 */
export function toSeedRows({ people, sources }: Dataset) {
  const datings = people.flatMap(person =>
    (
      [
        ['king', person.reign],
        ['prophet', person.ministry],
      ] as const
    ).flatMap(([role, facet]) => {
      if (!facet) return []
      const all: { label: string | null; dating: Dating }[] = [
        { label: null, dating: facet.dating },
        ...facet.alternatives,
      ]
      return all.map(({ label, dating }, position) => ({
        id: `${person.id}/${role}/${position}`,
        personId: person.id,
        role,
        position,
        label,
        dating,
      }))
    }),
  )

  return {
    sources: sources.map(
      (source): Prisma.SourceCreateManyInput => ({
        id: source.id,
        author: source.author,
        title: source.title,
        year: source.year,
        kind: source.kind,
        publisher: source.publisher ?? null,
        url: source.url ?? null,
      }),
    ),
    people: people.map(
      (person): Prisma.PersonCreateManyInput => ({
        id: person.id,
        name: person.name,
        altNames: person.altNames,
        summary: person.summary,
      }),
    ),
    reigns: people.flatMap((person): Prisma.ReignCreateManyInput[] =>
      person.reign
        ? [
            {
              personId: person.id,
              kingdom: person.reign.kingdom,
              predecessorId: person.reign.predecessor ?? null,
              successorId: person.reign.successor ?? null,
              relationToPredecessor: person.reign.relationToPredecessor ?? null,
            },
          ]
        : [],
    ),
    ministries: people.flatMap((person): Prisma.MinistryCreateManyInput[] =>
      person.ministry
        ? [
            {
              personId: person.id,
              audience: person.ministry.audience,
              hasBook: person.ministry.hasBook,
            },
          ]
        : [],
    ),
    datings: datings.map(
      ({ dating, ...row }): Prisma.DatingCreateManyInput => ({
        ...row,
        spanFrom: dating.span.from,
        spanTo: dating.span.to,
        approx: dating.span.approx,
        coregencyFrom: dating.coregencyFrom ?? null,
        confidence: dating.confidence,
        notes: dating.notes ?? null,
      }),
    ),
    evidence: datings.flatMap(({ id: datingId, dating }) =>
      dating.evidence.map(
        (evidence, position): Prisma.EvidenceCreateManyInput => ({
          id: `${datingId}/evidence/${position}`,
          datingId,
          position,
          kind: evidence.kind,
          ...('passage' in evidence ? passageColumns(evidence.passage) : noPassageColumns),
          note: 'note' in evidence ? evidence.note : null,
          artifact: evidence.kind === 'extrabiblical' ? evidence.artifact : null,
          contemporaryIds: 'contemporaries' in evidence ? evidence.contemporaries : [],
        }),
      ),
    ),
    citations: datings.flatMap(({ id: datingId, dating }) =>
      dating.citations.map(
        (citation, position): Prisma.CitationCreateManyInput => ({
          id: `${datingId}/citation/${position}`,
          datingId,
          sourceId: citation.sourceId,
          pages: citation.pages ?? null,
        }),
      ),
    ),
    passages: people.flatMap(person =>
      person.passages.map(
        (passage, position): Prisma.PassageCreateManyInput => ({
          id: `${person.id}/passage/${position}`,
          personId: person.id,
          position,
          ...passageColumns(passage),
          kind: passage.kind,
          note: passage.note ?? null,
        }),
      ),
    ),
    family: people.flatMap(person =>
      person.family.map(
        (member, position): Prisma.FamilyMemberCreateManyInput => ({
          id: `${person.id}/family/${position}`,
          personId: person.id,
          position,
          relation: member.relation,
          name: member.name,
          relatedPersonId: member.personId ?? null,
        }),
      ),
    ),
  }
}
