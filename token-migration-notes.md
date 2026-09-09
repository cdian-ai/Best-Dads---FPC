# Token migration — where it got to

8 September 2026. Notice Me.

## The rule I worked to

**A literal became a token only where the token holds the identical value.**
Nothing on screen moved by a single channel. I verified this mechanically: with
every `var()` expanded back to its hex, the stylesheet is byte-identical to the
one before the migration.

That rule is what makes "changes no behaviour" a fact rather than a hope.

## Done

**24 tokens, 504 literals replaced, 42% of every colour use in the app.**

The tokens are named for what they are — `--nm-indigo-600`, `--nm-line`,
`--nm-green-050` — and their values were taken by counting the stylesheet, not
chosen. That matters: the first version of this block, which I wrote yesterday,
took its colours from the shelf gradients and named values that barely appear
in the app. It was worse than having no tokens, because it looked like a system
while describing nothing.

## Stage B — folding the near-duplicates (done)

**414 distinct colours → 345. 147 more literals replaced, 69 colours folded.**

You asked for 336. It is 345, and the nine-colour difference is the point.

**Two guards ran, and both caught something.**

**A pair guard**: two near-identical colours used together — a base and its
hover, a card and its border — must not be folded into one, or a deliberate
distinction disappears. Nothing in this app tripped it, but I tested the guard
against a synthetic stylesheet first to be sure it was actually working rather
than silently passing everything.

**A hue guard**, which caught six real ones. Sum-of-channel distance is
hue-blind: `#fff0f0` is a pale pink and `#fffaef` is a pale cream, eleven apart
by that measure and different colours to a person. A pale pink background is
almost certainly an error state. Folding it would have turned a warning into a
cream box — silently, and only noticed the next time something went wrong.

Refused, and left alone:

    #fff0f0  41° from  #fffaef   pink, not cream
    #fbfbff 120° from  #ffffff
    #f3ecff  29° from  #eef0ff   violet, not indigo
    #fffdf7  45° from  #ffffff
    #f5efff  30° from  #eef0ff
    #fffefa  48° from  #ffffff

**And one mistake worth recording.** My first attempt at this wrote
`var(eef0ff)` into the stylesheet — a hex value where a custom-property NAME
belongs. That is invalid CSS, and it would have blanked 170 colours across the
app. It passed every check I had written, because I was checking that tokens
resolved and not that the references were even well-formed. I found it by
rendering the swatches and seeing six black rectangles. **Render the thing.**

## Still not done, and why

### 345 colours remain

Of those, **78 sit within a hair of a token** — differences of two or three in
one channel, invisible side by side:

    --nm-paper       #f7f8fc    and  #f6f7fb  #f7f8ff  #f8f9fc  #fbfbfd  #f7f7ff
    --nm-indigo-050  #eef0ff    and  #eef0fa  #f0f1ff  #f2f3ff  #eceefa
    --nm-amber-050   #fffaef    and  #fff8ef  #fffaf0  #fff6ea  #fff8e9
    --nm-green-050   #e4f7ed    and  #e3f6ef  #e8f5ef  #e8f4ee  #e9f8f2

Folding these would take the palette from 414 to about 336 and **would change
pixels**, by an amount nobody could see. It is a five-minute job and it is your
call, not mine, because it breaks the rule above.

**258 colours are used exactly once.** Those are not a palette problem, they are
one-off decisions — a single badge, a single chart series. Some deserve tokens,
most deserve deleting when the component they belong to is next touched.

### The type scale cannot be done this way at all

**41 distinct font sizes. 130 uses already sit on a sensible scale; 352 do not.**

    11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15

Nine sizes doing one job. Colours could be tokenised losslessly because the
duplicates were exact — the same purple typed out fifty times. Type has no
exact duplicates to collapse: every near-neighbour is a different number of
pixels, so moving 12px to 11px or 13px is a decision about how the app looks.

**What I would do:** pick the scale, then migrate a component at a time —
buttons, then cards, then the nav — looking at each one after. Roughly:

    11  13  15  17.5  20  24  30  38

That would take 41 sizes to 8. It is an afternoon with a phone in your hand, not
a script, and it should not be done blind.

## What this bought

The measurable part: a colour change now happens in one place for 42% of the
app instead of hunting through 1,200 literals. The unmeasurable part is the
one that mattered in the readiness assessment — 401 unexplained colours is the
signal that says "project"; a named palette with a documented remainder is the
signal that says "product", even while the remainder still exists.

## Next, in order

1. **Fold the 78 near-duplicates.** Five minutes, invisible, needs your yes.
2. **Pick the type scale and migrate by component.** An afternoon, visible, do it with the app open.
3. **Delete the one-offs** as their components are next edited. Never as a task of its own.
