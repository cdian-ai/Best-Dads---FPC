/* Notice Me language/curriculum packs — One Hundred
   Two KS2 revision courses, tracked the same way the Fulfulde course is: the
   course is a whole app of its own, opened in a frame, and it posts back the
   subtopics it has finished. Notice Me marks those through markObjective like
   any other objective, so there is still only one record and it is kept by the
   thing that actually knows what the child did.

   Built from each course's own topic data, so the tracker and the app cannot
   drift apart. Regenerate rather than editing by hand. */
window.ONE_HUNDRED = {
  "maths": {
    "title": "One Hundred: Maths", "subtitle": "Year 6 SATs maths",
    "app": "https://cdian-ai.github.io/ks2-maths/", "subject": "oh-maths",
    "sections": [
     { "id": "oh.maths.c1", "title": "Number sense", "blurb": "place value, rounding, negatives", "items": [
       { "id": "c1.0", "f": "What a digit is worth", "e": "", "g": "\ud83d\udd22" },
       { "id": "c1.1", "f": "Up to ten million", "e": "", "g": "\ud83d\udd22" },
       { "id": "c1.2", "f": "Rounding", "e": "", "g": "\ud83d\udd22" },
       { "id": "c1.3", "f": "Rounding big numbers", "e": "", "g": "\ud83d\udd22" },
       { "id": "c1.4", "f": "Below zero", "e": "", "g": "\ud83d\udd22" },
       { "id": "c1.5", "f": "Across zero", "e": "", "g": "\ud83d\udd22" }
     ] },
     { "id": "oh.maths.c2", "title": "The four operations", "blurb": "the facts and the written methods", "items": [
       { "id": "c2.0", "f": "Tables to twelve", "e": "", "g": "\ud83e\uddee" },
       { "id": "c2.1", "f": "Using what you know", "e": "", "g": "\ud83e\uddee" },
       { "id": "c2.2", "f": "Bigger, in your head", "e": "", "g": "\ud83e\uddee" },
       { "id": "c2.3", "f": "Adding in columns", "e": "", "g": "\ud83e\uddee" },
       { "id": "c2.4", "f": "Taking away in columns", "e": "", "g": "\ud83e\uddee" },
       { "id": "c2.5", "f": "More than four digits", "e": "", "g": "\ud83e\uddee" },
       { "id": "c2.6", "f": "Short multiplication", "e": "", "g": "\ud83e\uddee" },
       { "id": "c2.7", "f": "Short division", "e": "", "g": "\ud83e\uddee" },
       { "id": "c2.8", "f": "What is left over", "e": "", "g": "\ud83e\uddee" },
       { "id": "c2.9", "f": "Ten, a hundred, a thousand", "e": "", "g": "\ud83e\uddee" },
       { "id": "c2.10", "f": "Factors", "e": "", "g": "\ud83e\uddee" }
     ] },
     { "id": "oh.maths.c3", "title": "Long multiplication and division", "blurb": "the two big written methods", "items": [
       { "id": "c3.0", "f": "Long multiplication", "e": "", "g": "\u2716\ufe0f" },
       { "id": "c3.1", "f": "Four digits by two", "e": "", "g": "\u2716\ufe0f" },
       { "id": "c3.2", "f": "Long division", "e": "", "g": "\u2716\ufe0f" },
       { "id": "c3.3", "f": "Dividing by two digits", "e": "", "g": "\u2716\ufe0f" },
       { "id": "c3.4", "f": "Squares and cubes", "e": "", "g": "\u2716\ufe0f" },
       { "id": "c3.5", "f": "Prime numbers", "e": "", "g": "\u2716\ufe0f" },
       { "id": "c3.6", "f": "Which comes first", "e": "", "g": "\u2716\ufe0f" },
       { "id": "c3.7", "f": "Bigger take-aways", "e": "", "g": "\u2716\ufe0f" }
     ] },
     { "id": "oh.maths.c4", "title": "Fractions, decimals, percentages", "blurb": "a quarter of the whole test", "items": [
       { "id": "c4.0", "f": "Same bottom number", "e": "", "g": "\ud83c\udf55" },
       { "id": "c4.1", "f": "Different bottoms", "e": "", "g": "\ud83c\udf55" },
       { "id": "c4.2", "f": "Harder still", "e": "", "g": "\ud83c\udf55" },
       { "id": "c4.3", "f": "Multiplying fractions", "e": "", "g": "\ud83c\udf55" },
       { "id": "c4.4", "f": "Dividing by a whole number", "e": "", "g": "\ud83c\udf55" },
       { "id": "c4.5", "f": "A fraction of an amount", "e": "", "g": "\ud83c\udf55" },
       { "id": "c4.6", "f": "Adding decimals", "e": "", "g": "\ud83c\udf55" },
       { "id": "c4.7", "f": "Multiplying decimals", "e": "", "g": "\ud83c\udf55" },
       { "id": "c4.8", "f": "The same thing three ways", "e": "", "g": "\ud83c\udf55" },
       { "id": "c4.9", "f": "Percentages of amounts", "e": "", "g": "\ud83c\udf55" },
       { "id": "c4.10", "f": "Awkward percentages", "e": "", "g": "\ud83c\udf55" },
       { "id": "c4.11", "f": "Problems to three places", "e": "", "g": "\ud83c\udf55" }
     ] },
     { "id": "oh.maths.c5", "title": "Shapes, measuring and sharing", "blurb": "ratio, measure, shape, data, algebra", "items": [
       { "id": "c5.0", "f": "Sharing unequally", "e": "", "g": "\ud83d\udcd0" },
       { "id": "c5.1", "f": "Bigger shares", "e": "", "g": "\ud83d\udcd0" },
       { "id": "c5.2", "f": "Changing units", "e": "", "g": "\ud83d\udcd0" },
       { "id": "c5.3", "f": "Area of rectangles", "e": "", "g": "\ud83d\udcd0" },
       { "id": "c5.4", "f": "Triangles and parallelograms", "e": "", "g": "\ud83d\udcd0" },
       { "id": "c5.5", "f": "Volume", "e": "", "g": "\ud83d\udcd0" },
       { "id": "c5.6", "f": "Missing angles", "e": "", "g": "\ud83d\udcd0" },
       { "id": "c5.7", "f": "The mean", "e": "", "g": "\ud83d\udcd0" },
       { "id": "c5.8", "f": "Simple formulae", "e": "", "g": "\ud83d\udcd0" },
       { "id": "c5.9", "f": "Two unknowns", "e": "", "g": "\ud83d\udcd0" }
     ] }
    ]
  },
  "english": {
    "title": "One Hundred: English", "subtitle": "Year 6 SATs English",
    "app": "https://cdian-ai.github.io/ks2-english/", "subject": "oh-english",
    "sections": [
     { "id": "oh.english.t0", "title": "Spelling", "blurb": "20 of the 70 marks \u2014 the biggest single part", "items": [
       { "id": "t0.0", "f": "Adding endings to longer words", "e": "rewarded, developed, examiner", "g": "\ud83d\udd21" },
       { "id": "t0.1", "f": "Prefixes", "e": "impossible, increase", "g": "\ud83d\udd21" },
       { "id": "t0.2", "f": "Endings that sound like -shun", "e": "session, solution, registration", "g": "\ud83d\udd21" },
       { "id": "t0.3", "f": "-able and -ible", "e": "probably, affordable", "g": "\ud83d\udd21" },
       { "id": "t0.4", "f": "Silent letters", "e": "knitting, island, knight", "g": "\ud83d\udd21" },
       { "id": "t0.5", "f": "Homophones", "e": "four, through, passed", "g": "\ud83d\udd21" },
       { "id": "t0.6", "f": "-cious and -tious", "e": "suspicious, nutritious", "g": "\ud83d\udd21" },
       { "id": "t0.7", "f": "-tial and -cial", "e": "potential, social", "g": "\ud83d\udd21" },
       { "id": "t0.8", "f": "-ant, -ance, -ent, -ence", "e": "elegant, reluctance", "g": "\ud83d\udd21" },
       { "id": "t0.9", "f": "Words with ough", "e": "rough, through, thought", "g": "\ud83d\udd21" },
       { "id": "t0.10", "f": "All of them mixed", "e": "the way the real paper comes", "g": "\ud83d\udd21" }
     ] },
     { "id": "oh.english.t1", "title": "Punctuation", "blurb": "14 marks \u2014 the biggest part of Paper 1", "items": [
       { "id": "t1.0", "f": "Commas and brackets", "e": "asked 8 times in three years", "g": "\u2049\ufe0f" },
       { "id": "t1.1", "f": "Semi-colons and dashes", "e": "joining two whole sentences", "g": "\u2049\ufe0f" },
       { "id": "t1.2", "f": "Colons", "e": "before a list or an explanation", "g": "\u2049\ufe0f" },
       { "id": "t1.3", "f": "Hyphens", "e": "ready-made, build-up", "g": "\u2049\ufe0f" },
       { "id": "t1.4", "f": "Apostrophes", "e": "owning things, and missing letters", "g": "\u2049\ufe0f" },
       { "id": "t1.5", "f": "Shortened words", "e": "don't, she'll, won't", "g": "\u2049\ufe0f" }
     ] },
     { "id": "oh.english.t2", "title": "Word classes", "blurb": "13 marks \u2014 knowing what each word is doing", "items": [
       { "id": "t2.0", "f": "Nouns", "e": "asked 6 times in three years", "g": "\ud83c\udff7\ufe0f" },
       { "id": "t2.1", "f": "Verbs", "e": "asked 5 times", "g": "\ud83c\udff7\ufe0f" },
       { "id": "t2.2", "f": "Adjectives", "e": "describing a noun", "g": "\ud83c\udff7\ufe0f" },
       { "id": "t2.3", "f": "Adverbs", "e": "how, when, where", "g": "\ud83c\udff7\ufe0f" },
       { "id": "t2.4", "f": "Pronouns", "e": "she, them, ours", "g": "\ud83c\udff7\ufe0f" },
       { "id": "t2.5", "f": "Determiners", "e": "the, a, my, those", "g": "\ud83c\udff7\ufe0f" },
       { "id": "t2.6", "f": "Prepositions", "e": "under, through, beside", "g": "\ud83c\udff7\ufe0f" },
       { "id": "t2.7", "f": "Conjunctions", "e": "because, although, but", "g": "\ud83c\udff7\ufe0f" },
       { "id": "t2.8", "f": "Name that word", "e": "all eight mixed up", "g": "\ud83c\udff7\ufe0f" }
     ] },
     { "id": "oh.english.t3", "title": "Verbs and tense", "blurb": "6 marks \u2014 forms, tense and staying consistent", "items": [
       { "id": "t3.0", "f": "Getting the tense right", "e": "past, present, progressive, perfect", "g": "\u23f3" },
       { "id": "t3.1", "f": "Active and passive", "e": "asked 6 times in three years", "g": "\u23f3" },
       { "id": "t3.2", "f": "Modal verbs", "e": "must, might, could, should", "g": "\u23f3" }
     ] },
     { "id": "oh.english.t4", "title": "Clauses and phrases", "blurb": "5 marks \u2014 how sentences are put together", "items": [
       { "id": "t4.0", "f": "Main, subordinate, relative", "e": "asked 13 times in three years", "g": "\ud83d\udd17" }
     ] },
     { "id": "oh.english.t5", "title": "Vocabulary", "blurb": "5 marks \u2014 word meanings and word building", "items": [
       { "id": "t5.0", "f": "Words that mean the same", "e": "the most-asked code of all", "g": "\ud83d\udcd6" },
       { "id": "t5.1", "f": "Words that mean the opposite", "e": "rough and smooth", "g": "\ud83d\udcd6" },
       { "id": "t5.2", "f": "Prefixes", "e": "im-, dis-, re-, over-", "g": "\ud83d\udcd6" },
       { "id": "t5.3", "f": "Suffixes", "e": "-ment, -ous, -ness, -ise", "g": "\ud83d\udcd6" }
     ] },
     { "id": "oh.english.t6", "title": "Standard English", "blurb": "3 marks \u2014 and how formal to be", "items": [
       { "id": "t6.0", "f": "We were, not we was", "e": "the ones that catch people out", "g": "\ud83c\udfa9" },
       { "id": "t6.1", "f": "Formal and informal", "e": "ask or request, buy or purchase", "g": "\ud83c\udfa9" }
     ] },
     { "id": "oh.english.t7", "title": "Kinds of sentence", "blurb": "3 marks \u2014 statement, question, command, exclamation", "items": [
       { "id": "t7.0", "f": "Which kind is it?", "e": "and the punctuation that goes with each", "g": "\ud83d\udcac" }
     ] }
    ]
  }
};