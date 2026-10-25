import { describe, expect, it } from 'vitest'

import { parseChapter } from './osis'

const preverse = (n: number, inner: string) =>
  `<div type="x-milestone" subType="x-preverse" sID="pv${n}"/>${inner}<div type="x-milestone" subType="x-preverse" eID="pv${n}"/>`

describe('parseChapter', () => {
  it('puts a heading before the paragraph its verse opens', () => {
    const chapter = parseChapter('<chapter n="1" osisID="Gen.1" sID="Gen.1"/> ', [
      preverse(1, '<title>The Creation</title> <div sID="p1" type="x-p"/>') +
        '<w lemma="strong:H7225">In the beginning</w> <w lemma="strong:H430">God</w><w lemma="strong:H853"/> created. <div eID="p1" type="x-p"/>',
    ])
    expect(chapter.blocks).toEqual([
      { kind: 'heading', content: ['The Creation'] },
      { kind: 'p', content: [{ verse: 1 }, 'In the beginning God created.'] },
    ])
  })

  it('takes a heading from the chapter entry', () => {
    const chapter = parseChapter('<chapter sID="Gen.1"/> <title>The Creation</title> ', ['Text'])
    expect(chapter.blocks[0]).toEqual({ kind: 'heading', content: ['The Creation'] })
  })

  it('carries a paragraph on across verses', () => {
    const chapter = parseChapter('', [
      '<div sID="p1" type="x-p"/>One. ',
      'Two. <div eID="p1" type="x-p"/>',
      '<div sID="p2" type="x-p"/>Three.<div eID="p2" type="x-p"/>',
    ])
    expect(chapter.blocks).toEqual([
      { kind: 'p', content: [{ verse: 1 }, 'One. ', { verse: 2 }, 'Two.'] },
      { kind: 'p', content: [{ verse: 3 }, 'Three.'] },
    ])
  })

  it('puts a space between verses that run on without one', () => {
    const chapter = parseChapter('', [
      'above all.<note placement="foot">Tischendorf</note>',
      '<w>He</w> testifies',
    ])
    expect(chapter.blocks[0].content).toEqual([
      { verse: 1 },
      'above all.',
      { note: 0 },
      ' ',
      { verse: 2 },
      'He testifies',
    ])
  })

  it('lays out poetry by line, marking where a stanza starts', () => {
    const chapter = parseChapter('', [
      preverse(1, '<lg sID="g1"/> <l level="1" sID="l1"/>') +
        'O LORD, how my foes have increased!<l eID="l1" level="1"/> <l level="2" sID="l2"/>How many rise up against me!<l eID="l2" level="2"/>',
      '<l sID="l3" type="x-right"/>Selah<l eID="l3" type="x-right"/> <lg eID="g1"/>',
    ])
    expect(chapter.blocks).toEqual([
      {
        kind: 'line1',
        stanza: true,
        content: [{ verse: 1 }, 'O LORD, how my foes have increased!'],
      },
      { kind: 'line2', content: ['How many rise up against me!'] },
      { kind: 'lineRight', content: [{ verse: 2 }, 'Selah'] },
    ])
  })

  it('makes a list item of each item', () => {
    const chapter = parseChapter('', [
      preverse(5, '<list> <item type="x-indent-1">') +
        'From Reuben, Elizur;</item> </list> <list> <item type="x-indent-2">from Simeon</item></list>',
    ])
    expect(chapter.blocks.map(block => block.kind)).toEqual(['item1', 'item2'])
  })

  it('collects footnotes with their references and italics, leaving a call in the text', () => {
    const chapter = parseChapter('', [
      'light,”<note placement="foot">Cited in <reference osisRef="2Cor.4.6" type="source">2 Corinthians 4:6</reference>; literally <hi type="italic">day one</hi></note> and',
    ])
    expect(chapter.blocks[0].content).toEqual([{ verse: 1 }, 'light,”', { note: 0 }, ' and'])
    expect(chapter.notes).toEqual([
      {
        verse: 1,
        content: [
          'Cited in ',
          { ref: '2Cor.4.6', text: ['2 Corinthians 4:6'] },
          '; literally ',
          { italic: ['day one'] },
        ],
      },
    ])
  })

  it('keeps a footnote called from inside a heading', () => {
    const chapter = parseChapter('', [
      preverse(
        1,
        '<title canonical="true" type="psalm">A Miktam<note placement="foot">Meaning uncertain</note> of David.</title>',
      ) + 'Preserve me.',
    ])
    expect(chapter.blocks[0]).toEqual({
      kind: 'psalmTitle',
      content: ['A Miktam', { note: 0 }, ' of David.'],
    })
  })

  it('reads parallel passages under a heading as references', () => {
    const chapter = parseChapter('', [
      preverse(
        1,
        '<title type="parallel"> (<reference osisRef="John.1.1-John.1.5" type="parallel">John 1:1–5</reference>) </title>',
      ) + 'In the beginning',
    ])
    expect(chapter.blocks[0]).toEqual({
      kind: 'parallel',
      content: ['(', { ref: 'John.1.1-John.1.5', text: ['John 1:1–5'] }, ')'],
    })
  })

  it('marks where a verse the translation leaves out would be', () => {
    const chapter = parseChapter('', ['One.', '', 'Three.'])
    expect(chapter.blocks[0].content).toEqual([
      { verse: 1 },
      'One. ',
      { gap: 2 },
      { verse: 3 },
      'Three.',
    ])
  })

  it("leaves out the book's own title", () => {
    const chapter = parseChapter('<title level="1" type="main">Genesis</title>', ['Text'])
    expect(chapter.blocks).toEqual([{ kind: 'p', content: [{ verse: 1 }, 'Text'] }])
  })

  it('decodes entities', () => {
    const chapter = parseChapter('', ['Tom &amp; Jerry'])
    expect(chapter.blocks[0].content).toEqual([{ verse: 1 }, 'Tom & Jerry'])
  })
})
