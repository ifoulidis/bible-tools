import type { Block, BlockKind, Chapter, Inline } from './types'

/**
 * Turns one chapter of a SWORD module's OSIS markup into blocks to read.
 *
 * SWORD stores the text verse by verse, so paragraphs, poetry lines and lists span verses as
 * milestones (an empty start tag with `sID` and an end tag with `eID`) rather than nesting. Each
 * verse may open with a "preverse" milestone around what comes before its number, such as a
 * heading or the start of a paragraph.
 *
 * @param intro The chapter's own entry, which holds any heading before verse 1
 * @param verses Each verse's entry in order, empty where the translation leaves a verse out
 */
export function parseChapter(intro: string, verses: string[]): Chapter {
  const blocks: Block[] = []
  const notes: Chapter['notes'] = []

  /** The block that text is being added to, if any is open */
  let block: Block | undefined
  /** The next line opens a stanza */
  let stanza = false
  /** Open inline elements (titles, notes, italics and references), innermost last */
  const frames: { tag: string; type?: string; ref?: string; content: Inline[] }[] = []
  let verse = 0
  /**
   * A verse number waiting for its first words, so it lands in the paragraph or line they open
   * rather than being left on its own at the end of the one before
   */
  let pendingVerse: number | undefined
  /** Verses left out since the last number, to mark just before the next one */
  const gaps: number[] = []

  function numberNext(verseNumber: number) {
    flushVerse()
    pendingVerse = verseNumber
  }

  function flushVerse() {
    if (pendingVerse === undefined) return
    const verseNumber = pendingVerse
    pendingVerse = undefined
    // Verses run on in a paragraph, but not every one ends with a space before the next
    const last = block?.content.at(-1)
    if (last !== undefined && !(typeof last === 'string' && /\s$/.test(last))) append(' ')
    for (const gap of gaps.splice(0)) append({ gap })
    append({ verse: verseNumber })
  }

  function open(kind: BlockKind) {
    close()
    block = { kind, content: [] }
    if (stanza && kind.startsWith('line')) block.stanza = true
    stanza = false
    blocks.push(block)
  }

  function close() {
    if (block) trim(block.content)
    // A block that held only whitespace, or an empty milestone pair, isn't worth keeping
    if (block && block.content.length === 0) blocks.splice(blocks.indexOf(block), 1)
    block = undefined
  }

  function append(inline: Inline) {
    const blank = typeof inline === 'string' && inline.trim() === ''
    // Not in a heading or footnote, which come before the verse number
    if (!blank && frames.length === 0) flushVerse()

    const target = frames.at(-1)?.content ?? block?.content
    if (!target) {
      // Space between blocks belongs to neither
      if (blank) return
      open('p')
      append(inline)
      return
    }
    const last = target.at(-1)
    if (typeof inline === 'string' && typeof last === 'string')
      target[target.length - 1] = last + inline
    else target.push(inline)
  }

  function heading(type: string | undefined, content: Inline[]) {
    const kind = headingKinds[type ?? '']
    if (!kind) return
    trim(content)
    if (content.length === 0) return
    close()
    blocks.push({ kind, content })
  }

  /** @param verseNumber Left out for the chapter's own entry, which has no number */
  function parse(entry: string, verseNumber?: number) {
    // The verse number goes where its preverse ends, or at the very start if it has none
    let numberPending: number | undefined
    if (verseNumber !== undefined) {
      if (entry.includes('subType="x-preverse"')) numberPending = verseNumber
      else numberNext(verseNumber)
    }

    for (const [, text, closing, tag, attrs, selfClosing] of entry.matchAll(tokens)) {
      // Unmatched groups are undefined, whatever TypeScript's types for them say
      if (text) {
        append(decode(text).replace(/\s+/g, ' '))
        continue
      }
      const attr = (name: string) => new RegExp(`\\b${name}="([^"]*)"`).exec(attrs)?.[1]
      const milestoneEnd = attrs.includes('eID=')

      if (closing) {
        const frame = frames.at(-1)
        if (tag === 'item') close()
        else if (frame?.tag === tag) {
          frames.pop()
          if (tag === 'title') heading(frame.type, frame.content)
          else if (tag === 'note') {
            notes.push({ verse, content: trim(frame.content) })
            append({ note: notes.length - 1 })
          } else if (tag === 'reference') append({ ref: frame.ref ?? '', text: frame.content })
          else if (frame.type === 'super') append({ sup: frame.content })
          else append({ italic: frame.content })
        }
        continue
      }

      const type = attr('type')
      if (tag === 'div' && attr('subType') === 'x-preverse') {
        if (milestoneEnd && numberPending !== undefined) {
          numberNext(numberPending)
          numberPending = undefined
        }
      } else if (tag === 'div' && type === 'x-p') {
        if (milestoneEnd) close()
        else open('p')
      } else if (tag === 'lg') {
        if (!milestoneEnd) stanza = true
      } else if (tag === 'l') {
        if (milestoneEnd) close()
        else open(type === 'x-right' ? 'lineRight' : attr('level') === '2' ? 'line2' : 'line1')
      } else if (tag === 'item') {
        open(type === 'x-indent-2' ? 'item2' : 'item1')
      } else if (selfClosing) {
        // Words without English (a Hebrew particle), chapter and book milestones and the like
      } else if (tag === 'title') {
        frames.push({ tag, type, content: [] })
      } else if (tag === 'note' || tag === 'reference') {
        frames.push({ tag, ref: attr('osisRef'), content: [] })
      } else if (tag === 'hi') {
        frames.push({ tag, type, content: [] })
      }
      // Anything else (words tagged with Strong's numbers, lists, tables) keeps only its text
    }
    // A verse made only of preverse matter still needs its number
    if (numberPending !== undefined) numberNext(numberPending)
  }

  parse(intro)
  verses.forEach((entry, i) => {
    verse = i + 1
    if (entry.trim()) parse(entry, verse)
    else gaps.push(verse)
  })
  flushVerse()
  for (const gap of gaps) append({ gap })
  close()
  return { blocks, notes }
}

const headingKinds: Record<string, BlockKind | undefined> = {
  '': 'heading',
  parallel: 'parallel',
  psalm: 'psalmTitle',
  acrostic: 'acrostic',
  scope: 'scope',
  // The book's own name, which the reader shows anyway
  main: undefined,
}

/** Text, or a tag: its closing slash, name, attributes and self-closing slash */
const tokens = /([^<]+)|<(\/?)(\w+)((?:\s+[\w:]+="[^"]*")*)\s*(\/?)>/g

const entities: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" }

function decode(text: string) {
  return text.replace(/&(\w+);/g, (match, name: string) => entities[name] ?? match)
}

/** Drops the space at either end of some inline content, and returns it */
function trim(content: Inline[]) {
  const first = content[0]
  if (typeof first === 'string') {
    content[0] = first.trimStart()
    if (content[0] === '') content.shift()
  }
  const last = content.at(-1)
  if (typeof last === 'string') {
    content[content.length - 1] = last.trimEnd()
    if (content.at(-1) === '') content.pop()
  }
  return content
}
