// ─────────────────────────────────────────────────────────────────────────────
// jamaicanNames.js — Jamaican speech recognition data
//
// HOW THIS FILE WORKS
// ───────────────────
// FillFormEZ uses this data to correct what the browser's en-US speech engine
// mishears when a Jamaican person speaks.  Three mechanisms work together:
//
//  1. NAME_ALIASES (exact phrase map)
//     The highest-confidence layer.  If the full lowercased transcript exactly
//     matches a key, it is replaced with the value — no fuzzy logic involved.
//     Use this for phrases you KNOW the speech API consistently gets wrong.
//     Example:  'you mean' → 'Romaine'
//
//  2. JAMAICAN_FIRST_NAMES / JAMAICAN_SURNAMES (fuzzy match lists)
//     If no alias matches, the normalizer compares each spoken word against
//     every name in these lists using Levenshtein distance.  A word is only
//     replaced when similarity is ≥ 85%.  Words below that threshold are
//     returned unchanged so the user can fix them manually in the "You said"
//     box.
//     Add a name here when it exists in Jamaica and may be mispronounced by
//     en-US models — even if no specific alias is needed yet.
//
//  3. COMMUNITY_ALIASES (location shortening map)
//     Same exact-match approach as NAME_ALIASES, but for community / district
//     fields.  Handles shorthands like "mo bay" → "Montego Bay".
//
//  4. PATOIS_SUBSTITUTIONS (whole-word substitutions for general voice fields)
//     Only applied on multi-word responses in non-name, non-parish,
//     non-community fields.  Kept deliberately tiny to minimise false changes.
//
// HOW TO ADD MORE NAMES
// ──────────────────────
//  • Add to the name/surname arrays below — fuzzy matching picks them up
//    automatically, no other file needs changing.
//  • Add a specific mishear correction to NAME_ALIASES with a comment
//    explaining what the speech API actually says.
//  • Add a community shortening to COMMUNITY_ALIASES.
//
// ─────────────────────────────────────────────────────────────────────────────


// ── Common Jamaican first names — male ────────────────────────────────────────

const MALE_NAMES = [
  // A
  'Aaron', 'Abijah', 'Ainsley', 'Akeem', 'Aleric', 'Altamont', 'Alton', 'Alwayne',
  'Andre', 'Andrew', 'Anthony', 'Antwan', 'Antwayne', 'Aubrey',
  // B
  'Barrington', 'Basil', 'Bernard', 'Byron',
  // C
  'Carlton', 'Clement', 'Clive', 'Clinton', 'Colin', 'Curtis',
  // D
  'Dalton', 'Damion', 'Daniel', 'David', 'Dean', 'Delano', 'Dennis', 'Derrick',
  'Desmond', 'Devon', 'Dillon', 'Donovan', 'Douglas', 'Dwight',
  // E
  'Earl', 'Edmund', 'Edwin', 'Elton', 'Errol', 'Eugene', 'Everton', 'Ewart',
  // F
  'Fabian', 'Fitzroy', 'Floyd', 'Franklin', 'Frederick',
  // G
  'Garfield', 'Gareth', 'Gavin', 'George', 'Gerald', 'Glen', 'Glenford', 'Godfrey',
  'Gordon', 'Grant',
  // H
  'Harold', 'Hartley', 'Headley', 'Herbert', 'Herschel', 'Horace', 'Howard',
  'Hubert', 'Huntley',
  // I
  'Ian', 'Irving', 'Israel', 'Ivan',
  // J
  'Jackson', 'Jahmai', 'James', 'Jarvis', 'Jason', 'Javaughn', 'Jermaine',
  'Joel', 'John', 'Jonathan', 'Jordan', 'Joseph', 'Joshua', 'Julian', 'Junior', 'Justin',
  // K
  'Karl', 'Kareem', 'Keanu', 'Kemar', 'Kemardo', 'Kemarley', 'Kenneth',
  'Kervin', 'Kevaughn', 'Kevon', 'Kimani', 'Kirk', 'Kurt', 'Kyle',
  // L
  'Lansford', 'Lawrence', 'Lenroy', 'Leroy', 'Leslie', 'Lester', 'Levi',
  'Lincoln', 'Lindon', 'Linford', 'Linton', 'Lionel', 'Llewellyn', 'Lloyd', 'Lorenzo', 'Luther',
  // M
  'Marcus', 'Mario', 'Marlon', 'Mark', 'Marshall', 'Matthew', 'Maurice', 'Maxwell',
  'Melvin', 'Michael', 'Miguel', 'Milton',
  // N
  'Nathan', 'Neville', 'Nicholas', 'Nickoy', 'Norman',
  // O
  'Omar', 'Omari', 'Orville', 'Owen',
  // P
  'Patrick', 'Paul', 'Percival', 'Peter', 'Philip', 'Preston',
  // R
  'Ralph', 'Raphael', 'Rasheed', 'Raymond', 'Reginald', 'Renaldo', 'Rex',
  'Ricardo', 'Richard', 'Ricky', 'Robert', 'Robin', 'Rodney', 'Roger',
  'Rohan', 'Romain', 'Romaine', 'Romeo', 'Ronald', 'Rondell', 'Ross', 'Roy', 'Rudolph', 'Russell', 'Ryan',
  // S
  'Samuel', 'Sean', 'Sheldon', 'Sherdon', 'Sherman', 'Sherwood', 'Simeon',
  'Solomon', 'Spencer', 'Stanley', 'Stefan', 'Stephen', 'Steven', 'Stuart',
  // T
  'Tajay', 'Tavon', 'Terrence', 'Theodore', 'Timmy', 'Travis',
  'Trevaughn', 'Trevon', 'Trevor', 'Troy', 'Tyrone',
  // U
  'Ulric', 'Ulrich',
  // V
  'Vaughn', 'Vernon', 'Vincent',
  // W
  'Walter', 'Warren', 'Wayne', 'Wendell', 'Wilfred', 'Winston',
  // Z
  'Zachary',
]


// ── Common Jamaican first names — female ──────────────────────────────────────

const FEMALE_NAMES = [
  // A
  'Ackeisha', 'Akecia', 'Alicia', 'Alexandra', 'Almandah', 'Alvia', 'Amoy',
  'Anastasia', 'Andrea', 'Angela', 'Annette', 'Anthonia', 'Antoinette',
  // B
  'Barbara', 'Bernadette', 'Beverly', 'Bianca', 'Brenda', 'Bridget',
  // C
  'Camille', 'Carlene', 'Carol', 'Carolyn', 'Carmen', 'Cassandra', 'Catherine',
  'Chantel', 'Charlene', 'Chevanese', 'Christine', 'Claudette', 'Claudine',
  'Crystal', 'Cynthia',
  // D
  'Davia', 'Dawn', 'Deborah', 'Delores', 'Denise', 'Diana', 'Dionne', 'Donna', 'Dorothy',
  // E
  'Elaine', 'Eloise', 'Elizabeth', 'Estelle', 'Evadney', 'Evelyn',
  // F
  'Fatima', 'Fiona', 'Florence',
  // G
  'Gayle', 'Gillian', 'Gloria', 'Grace',
  // H
  'Hermine', 'Hyacinth',
  // I
  'Icilda', 'Ingrid', 'Iris',
  // J
  'Jacinda', 'Jacqueline', 'Janet', 'Janique', 'Jhanelle', 'Joan', 'Joyce',
  'Judith', 'Juliet',
  // K
  'Kadian', 'Keisha', 'Kelly', 'Kemeisha', 'Keturah', 'Kim', 'Kishanna',
  // L
  'Latisha', 'Latoya', 'Leila', 'Leonie', 'Linda', 'Lorna', 'Louise', 'Lurline',
  // M
  'Marcia', 'Maria', 'Marjorie', 'Marlene', 'Marva', 'Mary', 'Maxine', 'Merle',
  'Michelle', 'Millicent', 'Monica', 'Monique',
  // N
  'Nadine', 'Nadia', 'Nancy', 'Naomi', 'Natasha', 'Nickiesha', 'Nicole',
  'Norma', 'Novlette',
  // O
  'Olive', 'Olivia', 'Oneka',
  // P
  'Pamela', 'Patricia', 'Patrice', 'Paulette', 'Petrona', 'Portia', 'Priscilla',
  // R
  'Racquel', 'Renee', 'Rita', 'Roberta', 'Rochelle', 'Rose',
  // S
  'Sandra', 'Sasha', 'Shaneika', 'Shaniqua', 'Shanice', 'Sharon', 'Sherell',
  'Sherene', 'Shirley', 'Simone', 'Sonia', 'Sophia', 'Stacey', 'Stephanie', 'Susan',
  // T
  'Tanya', 'Tara', 'Tashana', 'Theresa', 'Toni', 'Tracey',
  // U
  'Ulrica', 'Ursula',
  // V
  'Venesha', 'Veronica', 'Vivian',
  // W
  'Wanda', 'Wendy', 'Winsome',
  // Y
  'Yanique', 'Yvette', 'Yvonne',
  // Z
  'Zavia', 'Zoeann',
]

export const JAMAICAN_FIRST_NAMES = [...MALE_NAMES, ...FEMALE_NAMES]


// ── Common Jamaican surnames ──────────────────────────────────────────────────

export const JAMAICAN_SURNAMES = [
  // A
  'Adams', 'Aiken', 'Alexander', 'Allen', 'Alleyne', 'Anderson', 'Anglin',
  // B
  'Bailey', 'Barnett', 'Barrett', 'Bennett', 'Bernard', 'Binns', 'Blake', 'Bogle',
  'Bogues', 'Brooks', 'Brown', 'Bryan', 'Burgess', 'Burke', 'Burrell',
  // C
  'Campbell', 'Cargill', 'Chambers', 'Chang', 'Chin', 'Christie', 'Clarke',
  'Cole', 'Collins', 'Cooke', 'Cooper', 'Cox', 'Crawford',
  // D
  'DaCosta', 'Dacres', 'Daley', 'Davis', 'Dixon', 'Drummond', 'Duncan', 'Dunn',
  // E
  'Edwards', 'Ellis',
  // F
  'Facey', 'Fearon', 'Ferguson', 'Figueroa', 'Fletcher', 'Foster', 'Francis', 'Fraser',
  // G
  'Gayle', 'Gibbs', 'Golding', 'Gordon', 'Graham', 'Grant', 'Gray', 'Green',
  // H
  'Hall', 'Hamilton', 'Harris', 'Harrison', 'Harvey', 'Headley', 'Henry',
  'Hibbert', 'Hill', 'Holness', 'Howell', 'Hylton',
  // I
  'Irving', 'Isaacs',
  // J
  'Jackson', 'James', 'Jarrett', 'Johnson', 'Jones', 'Joseph',
  // K
  'Kelly', 'King', 'Knight', 'Knox',
  // L
  'Lawrence', 'Levy', 'Lewis', 'Lindo', 'Lindsay', 'Lloyd', 'Lowe',
  // M
  'Malcolm', 'Manning', 'Martin', 'McFarlane', 'McIntosh', 'McLeod', 'McKenzie',
  'Miller', 'Minott', 'Mitchell', 'Moncrieffe', 'Morgan', 'Morrison', 'Mowatt', 'Mullings', 'Myrie',
  // N
  'Neil', 'Nelson', 'Newell', 'Newman', 'Nunes',
  // O
  'Ottey', 'Owen',
  // P
  'Palmer', 'Patterson', 'Peart', 'Pennant', 'Phillips', 'Pinnock', 'Plummer',
  'Powell', 'Price', 'Pryce',
  // R
  'Rattray', 'Reid', 'Richards', 'Robinson', 'Rogers', 'Rose', 'Ross',
  // S
  'Samuels', 'Scarlett', 'Scott', 'Senior', 'Simms', 'Simpson', 'Small',
  'Smith', 'Speid', 'Spence', 'Stennett', 'Stewart',
  // T
  'Taylor', 'Thomas', 'Thompson', 'Tomlinson',
  // V
  'Vassell', 'Virgo',
  // W
  'Walker', 'Wallace', 'Warren', 'Watson', 'Webley', 'Welch', 'White',
  'Williams', 'Wilson', 'Woolery', 'Wright', 'Wynter',
  // Y
  'Young',
]


// ── Name alias map: spoken mis-transcription → correct spelling ───────────────
//
// HOW TO ADD A NEW ALIAS
// ──────────────────────
// 1. Say or type the name into the browser mic.
// 2. Note what text the speech API actually produces.
// 3. Add one line:  'what api said': 'CorrectName',
//    Key  = lowercase of what the API returned (the mistake).
//    Value = the canonical correct spelling (any casing).
// 4. That's it — no other file needs to change.
//
// SAFETY RULE: Only add keys that are clearly wrong — not alternate valid names.
// Example: 'remain' is not a name → safe alias for 'Romaine'.
//          'rachel' IS a valid name → do NOT alias it to 'Racquel'.
//
export const NAME_ALIASES = {

  // ── Romaine ──────────────────────────────────────────────────────────────────
  // en-US hears the "-maine" ending as "mean", producing "you mean" / "your mean"
  'you mean':     'Romaine',
  "you're mean":  'Romaine',
  'your mean':    'Romaine',
  'romain':       'Romaine',   // French spelling — often the API output
  'remain':       'Romaine',   // rhymes with "romaine lettuce"
  'domaine':      'Romaine',   // TTS misfire on "ro" prefix

  // ── Akeem ────────────────────────────────────────────────────────────────────
  'akim':         'Akeem',

  // ── Kemarley ─────────────────────────────────────────────────────────────────
  'kamarley':     'Kemarley',
  'camarley':     'Kemarley',

  // ── Jhanelle ─────────────────────────────────────────────────────────────────
  'jhanell':      'Jhanelle',
  'janel':        'Jhanelle',

  // ── Chevanese ────────────────────────────────────────────────────────────────
  'shavanese':    'Chevanese',

  // ── Shanice ──────────────────────────────────────────────────────────────────
  'shaniece':     'Shanice',
  'shanece':      'Shanice',

  // ── Tashana ──────────────────────────────────────────────────────────────────
  'tashanna':     'Tashana',

  // ── Yanique ──────────────────────────────────────────────────────────────────
  'yankee':       'Yanique',
  'yaniqua':      'Yanique',

  // ── Kemeisha ─────────────────────────────────────────────────────────────────
  'kemisha':      'Kemeisha',
  'kameisha':     'Kemeisha',

  // ── Nickiesha ────────────────────────────────────────────────────────────────
  'nekeisha':     'Nickiesha',

  // ── Fitzroy ──────────────────────────────────────────────────────────────────
  'fitz roy':     'Fitzroy',
  'fits roy':     'Fitzroy',

  // ── McFarlane ────────────────────────────────────────────────────────────────
  'mac farlane':  'McFarlane',
  'macfarlane':   'McFarlane',
  'mcfarlan':     'McFarlane',

  // ── DaCosta ──────────────────────────────────────────────────────────────────
  'da costa':     'DaCosta',
  'dacosta':      'DaCosta',

  // ── Myrie ────────────────────────────────────────────────────────────────────
  'miree':        'Myrie',
  'myery':        'Myrie',

  // ── Mullings ─────────────────────────────────────────────────────────────────
  'mollings':     'Mullings',
  'mulins':       'Mullings',

  // ── Bogues ───────────────────────────────────────────────────────────────────
  'bogus':        'Bogues',   // "bogus" is not a name → safe alias

  // ── Peart ────────────────────────────────────────────────────────────────────
  'peat':         'Peart',
  'pert':         'Peart',

  // ── Speid ────────────────────────────────────────────────────────────────────
  'speed':        'Speid',
  'sped':         'Speid',

  // ── Stennett ─────────────────────────────────────────────────────────────────
  'stennet':      'Stennett',
  'stenet':       'Stennett',

  // ── Moncrieffe ───────────────────────────────────────────────────────────────
  'moncreef':     'Moncrieffe',
  'mon creef':    'Moncrieffe',

  // ── Pinnock ──────────────────────────────────────────────────────────────────
  'pinnick':      'Pinnock',

  // ── Webley ───────────────────────────────────────────────────────────────────
  'webly':        'Webley',

  // ── Nunes ────────────────────────────────────────────────────────────────────
  'newness':      'Nunes',
}


// ── Community / district alias map ───────────────────────────────────────────
//
// Applied on voice fields whose question.id contains "district", "town", or
// "community".  Only exact (case-insensitive) matches are used — no fuzzy
// logic — so false corrections are not possible.
//
// HOW TO ADD A NEW ALIAS
// ──────────────────────
// Add one line: 'spoken shortform': 'Full Official Name',
// Keys must be lowercase.
//
export const COMMUNITY_ALIASES = {

  // ── Montego Bay ──────────────────────────────────────────────────────────────
  'mo bay':           'Montego Bay',
  'mobay':            'Montego Bay',
  'montego':          'Montego Bay',

  // ── Port Antonio ─────────────────────────────────────────────────────────────
  'port anto':        'Port Antonio',
  'port antonio':     'Port Antonio',

  // ── Ocho Rios ────────────────────────────────────────────────────────────────
  'ochi rios':        'Ocho Rios',
  'ochi':             'Ocho Rios',
  'ocho':             'Ocho Rios',

  // ── Half-Way Tree ────────────────────────────────────────────────────────────
  'half way tree':    'Half-Way Tree',
  'halfway tree':     'Half-Way Tree',
  'hwt':              'Half-Way Tree',

  // ── Portmore ─────────────────────────────────────────────────────────────────
  'port more':        'Portmore',

  // ── Savanna-la-Mar ───────────────────────────────────────────────────────────
  'sav la mar':       'Savanna-la-Mar',
  'savanna la mar':   'Savanna-la-Mar',
  'savannah la mar':  'Savanna-la-Mar',

  // ── Spanish Town ─────────────────────────────────────────────────────────────
  'spanish town':     'Spanish Town',

  // ── May Pen ──────────────────────────────────────────────────────────────────
  'may pen':          'May Pen',

  // ── Old Harbour ──────────────────────────────────────────────────────────────
  'old harbour':      'Old Harbour',
  'old harbor':       'Old Harbour',

  // ── Browns Town ──────────────────────────────────────────────────────────────
  'browns town':      'Browns Town',
  "brown's town":     'Browns Town',

  // ── Black River ──────────────────────────────────────────────────────────────
  'black river':      'Black River',

  // ── Linstead ─────────────────────────────────────────────────────────────────
  'linstead':         'Linstead',

  // ── Mandeville ───────────────────────────────────────────────────────────────
  'mandeville':       'Mandeville',

  // ── New Kingston ─────────────────────────────────────────────────────────────
  'new kingston':     'New Kingston',
}


// ── Patois substitutions ──────────────────────────────────────────────────────
//
// Deliberately tiny list.  Only applies to multi-word voice responses that are
// NOT name, parish, or community fields.  Single-word answers are always left
// untouched to avoid corrupting short answers.
//
// SAFETY RULE: Only add words that are unambiguous and always wrong in a
// formal form-filling context.  "mi" is never a valid form answer; "nuh" never
// is either.  Do not add patois words that could be someone's name or a valid
// place name.
//
export const PATOIS_SUBSTITUTIONS = {
  'mi':  'my',
  'nuh': 'no',
}
