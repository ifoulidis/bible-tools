/**
 * Events marked on the timeline. "bible" events happen in the biblical narrative, dated to match
 * the people (Thiele's chronology); "world" events happen outside it, for perspective, and are kept
 * to ones that are major or that touch on the story.
 */
export const eventKinds = ['bible', 'world'] as const
export type EventKind = (typeof eventKinds)[number]

export interface TimelineEvent {
  id: string
  kind: EventKind
  /** Short enough to sit beside its marker */
  name: string
  /** Year BC */
  year: number
  approx: boolean
  detail: string
  /** Where the Bible tells of it */
  ref?: string
}

export const events: TimelineEvent[] = [
  // In the Bible
  {
    id: 'temple-begun',
    kind: 'bible',
    name: 'Temple begun',
    year: 966,
    approx: true,
    detail: 'Solomon starts building the temple in the fourth year of his reign.',
    ref: '1 Kings 6:1',
  },
  {
    id: 'kingdom-divides',
    kind: 'bible',
    name: 'Kingdom divides',
    year: 931,
    approx: false,
    detail: 'The northern tribes reject Rehoboam and make Jeroboam their king.',
    ref: '1 Kings 12',
  },
  {
    id: 'shishak',
    kind: 'bible',
    name: "Shishak's raid",
    year: 925,
    approx: false,
    detail:
      "In Rehoboam's fifth year, Pharaoh Shishak carries off the treasures of the temple. His own relief at Karnak lists the towns he took.",
    ref: '1 Kings 14:25–26',
  },
  {
    id: 'samaria-falls',
    kind: 'bible',
    name: 'Samaria falls',
    year: 723,
    approx: false,
    detail: 'Assyria takes Samaria after a three-year siege and carries Israel into exile.',
    ref: '2 Kings 17:5–6',
  },
  {
    id: 'sennacherib',
    kind: 'bible',
    name: 'Jerusalem besieged',
    year: 701,
    approx: false,
    detail:
      "In Hezekiah's fourteenth year, Sennacherib of Assyria takes Judah's fortified towns and surrounds Jerusalem, then withdraws.",
    ref: '2 Kings 18:13–19:36',
  },
  {
    id: 'law-found',
    kind: 'bible',
    name: 'Book of the Law found',
    year: 622,
    approx: false,
    detail:
      "In Josiah's eighteenth year, the Book of the Law is found while the temple is repaired, and he sets about reform.",
    ref: '2 Kings 22:3–23:3',
  },
  {
    id: 'first-exiles',
    kind: 'bible',
    name: 'Daniel taken',
    year: 605,
    approx: false,
    detail: 'Nebuchadnezzar takes Daniel and other young nobles of Judah to Babylon.',
    ref: 'Daniel 1:1–6',
  },
  {
    id: 'jehoiachin-exiled',
    kind: 'bible',
    name: 'Jehoiachin exiled',
    year: 597,
    approx: false,
    detail: "Jerusalem surrenders; the king, his court and the city's craftsmen go to Babylon.",
    ref: '2 Kings 24:10–16',
  },
  {
    id: 'jerusalem-falls',
    kind: 'bible',
    name: 'Jerusalem falls',
    year: 586,
    approx: false,
    detail: 'The Babylonians burn the temple, break down the walls and take the people into exile.',
    ref: '2 Kings 25:8–11',
  },
  {
    id: 'return',
    kind: 'bible',
    name: 'Return from exile',
    year: 538,
    approx: false,
    detail: 'Cyrus decrees that the Jews may go home and rebuild the temple.',
    ref: 'Ezra 1:1–4',
  },
  {
    id: 'second-temple',
    kind: 'bible',
    name: 'Second temple finished',
    year: 515,
    approx: false,
    detail:
      'The temple is completed in the sixth year of Darius, spurred on by Haggai and Zechariah.',
    ref: 'Ezra 6:14–15',
  },
  {
    id: 'esther',
    kind: 'bible',
    name: 'Esther made queen',
    year: 479,
    approx: true,
    detail: 'Xerxes (Ahasuerus) makes Esther his queen in the seventh year of his reign.',
    ref: 'Esther 2:16–17',
  },
  {
    id: 'ezra',
    kind: 'bible',
    name: 'Ezra arrives',
    year: 458,
    approx: false,
    detail:
      'Ezra leads a second group home and teaches the Law, in the seventh year of Artaxerxes.',
    ref: 'Ezra 7:7–10',
  },
  {
    id: 'walls-rebuilt',
    kind: 'bible',
    name: 'Walls rebuilt',
    year: 445,
    approx: false,
    detail: "Nehemiah rebuilds Jerusalem's walls in fifty-two days.",
    ref: 'Nehemiah 2:1; 6:15',
  },

  // Outside the Bible
  {
    id: 'zhou',
    kind: 'world',
    name: 'Zhou dynasty begins',
    year: 1046,
    approx: true,
    detail: "The Zhou overthrow the Shang and begin China's longest-lasting dynasty.",
  },
  {
    id: 'qarqar',
    kind: 'world',
    name: 'Battle of Qarqar',
    year: 853,
    approx: false,
    detail:
      'Shalmaneser III of Assyria fights a coalition of kings. His Kurkh Monolith says "Ahab the Israelite" brought 2,000 chariots.',
  },
  {
    id: 'carthage',
    kind: 'world',
    name: 'Carthage founded',
    year: 814,
    approx: true,
    detail: "Phoenicians from Tyre found Carthage in North Africa (by tradition's date).",
  },
  {
    id: 'olympics',
    kind: 'world',
    name: 'First Olympic Games',
    year: 776,
    approx: false,
    detail: 'The first recorded games at Olympia, from which the Greeks later counted their years.',
  },
  {
    id: 'eclipse',
    kind: 'world',
    name: 'Eclipse of 763 BC',
    year: 763,
    approx: false,
    detail:
      "A solar eclipse noted in Assyria's list of year names. Astronomy dates it to 15 June 763 BC, which fixes the Assyrian dates and, through them, Israel's.",
  },
  {
    id: 'rome',
    kind: 'world',
    name: 'Rome founded',
    year: 753,
    approx: true,
    detail: 'The traditional date of the founding of Rome by Romulus.',
  },
  {
    id: 'egypt-conquered',
    kind: 'world',
    name: 'Assyria takes Egypt',
    year: 671,
    approx: false,
    detail: 'Esarhaddon captures Memphis, bringing Assyria to its greatest extent.',
  },
  {
    id: 'nineveh-falls',
    kind: 'world',
    name: 'Nineveh falls',
    year: 612,
    approx: false,
    detail: 'Babylonians and Medes destroy the Assyrian capital, as Nahum foretold.',
  },
  {
    id: 'confucius',
    kind: 'world',
    name: 'Confucius born',
    year: 551,
    approx: true,
    detail: 'The Chinese teacher whose sayings shaped East Asian thought for millennia.',
  },
  {
    id: 'babylon-falls',
    kind: 'world',
    name: 'Persia takes Babylon',
    year: 539,
    approx: false,
    detail: "Cyrus the Great captures Babylon, the night of Belshazzar's feast in Daniel 5.",
  },
  {
    id: 'roman-republic',
    kind: 'world',
    name: 'Roman Republic',
    year: 509,
    approx: true,
    detail: "Rome expels its last king and becomes a republic (by tradition's date).",
  },
  {
    id: 'marathon',
    kind: 'world',
    name: 'Battle of Marathon',
    year: 490,
    approx: false,
    detail: 'Athens turns back the Persian army of Darius I, the king of Haggai and Zechariah.',
  },
  {
    id: 'thermopylae',
    kind: 'world',
    name: 'Thermopylae and Salamis',
    year: 480,
    approx: false,
    detail: 'Xerxes, the Ahasuerus of Esther, invades Greece and is defeated at sea at Salamis.',
  },
  {
    id: 'parthenon',
    kind: 'world',
    name: 'Parthenon begun',
    year: 447,
    approx: false,
    detail: 'Athens starts building the Parthenon on the Acropolis.',
  },
]
