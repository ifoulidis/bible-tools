/** A run of text, or a marker within it */
export type Inline =
  | string
  | { verse: number }
  /** Where a verse this translation leaves out would be, so links to it still land in the right place */
  | { gap: number }
  /** Where a footnote is called, as an index into its chapter's notes */
  | { note: number }
  | { italic: Inline[] }
  | { sup: Inline[] }
  /** A cross-reference, with its target as an OSIS reference such as "John.1.1-John.1.5" */
  | { ref: string; text: Inline[] }

export type BlockKind =
  /** A paragraph of prose */
  | 'p'
  /** Poetry lines: the first line of a couplet, the indented second, and a line set right (Selah) */
  | 'line1'
  | 'line2'
  | 'lineRight'
  /** Lists, such as genealogies and the tribes' census figures */
  | 'item1'
  | 'item2'
  /** A section heading */
  | 'heading'
  /** The parallel passages under a heading */
  | 'parallel'
  /** A psalm's own superscription, which is part of the text */
  | 'psalmTitle'
  /** A Hebrew letter heading a stanza of an acrostic, such as Psalm 119 */
  | 'acrostic'
  /** Which part of a book follows, such as "Psalms 1–41" */
  | 'scope'

export interface Block {
  kind: BlockKind
  content: Inline[]
  /** The first line of a stanza of poetry */
  stanza?: true
}

export interface Note {
  /** The verse it's in, or 0 if it's in the chapter's opening heading */
  verse: number
  content: Inline[]
}

export interface Chapter {
  blocks: Block[]
  notes: Note[]
}
