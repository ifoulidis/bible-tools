// OSIS book ids in Protestant canonical order: https://wiki.crosswire.org/OSIS_Book_Abbreviations
export const books = [
  { id: 'Gen', name: 'Genesis' },
  { id: 'Exod', name: 'Exodus' },
  { id: 'Lev', name: 'Leviticus' },
  { id: 'Num', name: 'Numbers' },
  { id: 'Deut', name: 'Deuteronomy' },
  { id: 'Josh', name: 'Joshua' },
  { id: 'Judg', name: 'Judges' },
  { id: 'Ruth', name: 'Ruth' },
  { id: '1Sam', name: '1 Samuel' },
  { id: '2Sam', name: '2 Samuel' },
  { id: '1Kgs', name: '1 Kings' },
  { id: '2Kgs', name: '2 Kings' },
  { id: '1Chr', name: '1 Chronicles' },
  { id: '2Chr', name: '2 Chronicles' },
  { id: 'Ezra', name: 'Ezra' },
  { id: 'Neh', name: 'Nehemiah' },
  { id: 'Esth', name: 'Esther' },
  { id: 'Job', name: 'Job' },
  { id: 'Ps', name: 'Psalms' },
  { id: 'Prov', name: 'Proverbs' },
  { id: 'Eccl', name: 'Ecclesiastes' },
  { id: 'Song', name: 'Song of Songs' },
  { id: 'Isa', name: 'Isaiah' },
  { id: 'Jer', name: 'Jeremiah' },
  { id: 'Lam', name: 'Lamentations' },
  { id: 'Ezek', name: 'Ezekiel' },
  { id: 'Dan', name: 'Daniel' },
  { id: 'Hos', name: 'Hosea' },
  { id: 'Joel', name: 'Joel' },
  { id: 'Amos', name: 'Amos' },
  { id: 'Obad', name: 'Obadiah' },
  { id: 'Jonah', name: 'Jonah' },
  { id: 'Mic', name: 'Micah' },
  { id: 'Nah', name: 'Nahum' },
  { id: 'Hab', name: 'Habakkuk' },
  { id: 'Zeph', name: 'Zephaniah' },
  { id: 'Hag', name: 'Haggai' },
  { id: 'Zech', name: 'Zechariah' },
  { id: 'Mal', name: 'Malachi' },
  { id: 'Matt', name: 'Matthew' },
  { id: 'Mark', name: 'Mark' },
  { id: 'Luke', name: 'Luke' },
  { id: 'John', name: 'John' },
  { id: 'Acts', name: 'Acts' },
  { id: 'Rom', name: 'Romans' },
  { id: '1Cor', name: '1 Corinthians' },
  { id: '2Cor', name: '2 Corinthians' },
  { id: 'Gal', name: 'Galatians' },
  { id: 'Eph', name: 'Ephesians' },
  { id: 'Phil', name: 'Philippians' },
  { id: 'Col', name: 'Colossians' },
  { id: '1Thess', name: '1 Thessalonians' },
  { id: '2Thess', name: '2 Thessalonians' },
  { id: '1Tim', name: '1 Timothy' },
  { id: '2Tim', name: '2 Timothy' },
  { id: 'Titus', name: 'Titus' },
  { id: 'Phlm', name: 'Philemon' },
  { id: 'Heb', name: 'Hebrews' },
  { id: 'Jas', name: 'James' },
  { id: '1Pet', name: '1 Peter' },
  { id: '2Pet', name: '2 Peter' },
  { id: '1John', name: '1 John' },
  { id: '2John', name: '2 John' },
  { id: '3John', name: '3 John' },
  { id: 'Jude', name: 'Jude' },
  { id: 'Rev', name: 'Revelation' },
] as const

export type BookId = (typeof books)[number]['id']
export const bookIds = books.map(book => book.id) as [BookId, ...BookId[]]

const bookIndex = new Map<BookId, number>(books.map((book, i) => [book.id, i]))
const bookName = new Map<BookId, string>(books.map(book => [book.id, book.name]))

export interface VerseRef {
  chapter: number
  verse?: number
}

export interface PassageRef {
  book: BookId
  from: VerseRef
  to?: VerseRef
}

function formatRef(ref: VerseRef) {
  return ref.verse === undefined ? `${ref.chapter}` : `${ref.chapter}:${ref.verse}`
}

/** e.g. "1 Kings 16:29", "1 Kings 16:29–34", "1 Kings 16:28–22:40", "Hosea 1–3" */
export function formatPassage({ book, from, to }: PassageRef) {
  const start = `${bookName.get(book) ?? book} ${formatRef(from)}`
  if (!to) return start
  if (to.chapter === from.chapter && to.verse !== undefined && from.verse !== undefined) {
    return `${start}–${to.verse}`
  }
  return `${start}–${formatRef(to)}`
}

export function bibleGatewayUrl(passage: PassageRef, version = 'ESV') {
  const search = encodeURIComponent(formatPassage(passage).replace('–', '-'))
  return `https://www.biblegateway.com/passage/?search=${search}&version=${version}`
}

/** Sort key for canonical order: book, then chapter, then verse */
export function comparePassages(a: PassageRef, b: PassageRef) {
  return (
    (bookIndex.get(a.book) ?? 0) - (bookIndex.get(b.book) ?? 0) ||
    a.from.chapter - b.from.chapter ||
    (a.from.verse ?? 0) - (b.from.verse ?? 0)
  )
}
