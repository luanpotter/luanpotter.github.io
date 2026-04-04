---
title: Card Pipeline Improvements
subtitle: Innovations on the card processing pipeline and card-press
---

I recently had the opportunity to evolve the [card processing pipeline](https://luan.xyz/blog/2026-02-03-the-card-press-saga) thanks to the great ideas and
contributions from our office community. So I wanted to share an update of the refinements we made.

## Lamination

Despite my lack of awareness of us having one, the laminating machine quickly became invaluable to a better final result as well as an easier experience with
the Cricut. After some experimentation, we discovered the best process to be:

- Use the 0.3 mm lamination pouches for perfect card-feel (the 0.5 mm ones were too thick for the Cricut to handle swiftly); this precludes the use of a
  backing card, and makes the final sleeved result near perfect.
- Laminating before cutting is a must due to how the pouches work; it does makes the cutting itself slightly slower (requiring a custom profile; I ended up with
  max pressure and 4x passes but you can experiment with your own machine), but removing the cards from the Cricut sticker mat is infinitely easier and does not
  cause irreversible bends on the cards.
- If there are slight bends or creases on the corners due to cricut and lamination interplay, a quick second pass through the laminator (past cut, no pouch)
  can easily smooth anything visible.

## Card Press

Added a few features to smooth the experience, including cut lines in case you are not using the Cricut and want to use a guillotine or similar tool.

Everything as usual is available at [card-press](https://luan.xyz/projects/card-press/) and open-sourced on [GitHub](https://github.com/luanpotter/card-press).

## Foil Paper

By far the most exciting development was the discovery of foil (holographic) paper. It is a cardstock with a metallic finish. We print foil cards on top, and
the shine exudes through the ink (there are also adhesive / vinyl versions for multi-layering, but I didn't go that far). You can find it on the required
US Letter size and good thickness on Staples or equivalent.

The only problem is that our fancy printer (which accepts the HP Click software) cannot handle it - the ink just does not adhere, regardless of the profile.
Our normal printer actually works perfectly, but it has a terrible issue. While still from HP, it is an older model that does not support HP Click.
Using the normal print dialogs on our company macOS computers was a complete pain.

After a lot of investigation, I concluded that the AirPrint driver simply does not respect the options on the printer dialog. I tried multiple software's
print dialog and the macOS native one, but it _always_ adds an annoying margin making the cards every-so-slightly too small. In the end I realized that I
need to link the printer from scratch using a different driver (HP's own), but then, it wouldn't respect some settings such as the selected tray and print
quality. I had to resort changing those settings' defaults on the printer itself. And it would still not respect tray selection, so I had to make sure it
first failed to print on Tray 1 (that wouldn't take the foil) and then switch the failed job on the printer UI to Tray 2. I had no idea the state of printer
drivers in 2026 could be so abysmal, and definitely have some interest in taking a deeper look at the software to see if there is any way to improve this
experience (but that is far from the scope of this post). I haven't tried bringing in my Linux machine to the Office to see if it would fare any better
(would be incredibly ironic if so), so I can't comment on that.

All that aside, once the cards were printed on the correct size and quality on the foil paper, they look absolutely stunning. I think they could look even
better through a layered foiling approach, but that is beyond what I am willing to do for my [Dimensional Rift](https://luan.xyz/projects/dim-rift/) playtesting
prototypes.

## Conclusion

Overall, I found it much more enjoyable to pop the laminated cards right out of the Cricut mat, and much nicer to sleeve them by themselves, ready to playtest
with no backing cards. The foils look amazing for the fanciest cards, and I still hold that [card-press](https://luan.xyz/projects/card-press/) is the best
tool for small-batch card printing, regardless of the cutting method.

I have updated the original [Print and Play with Cricut tutorial](/articles/print-and-play-with-cricut) to include the new lamination and foil processes, so
check it out if you want to try any of these improvements!

If you know more about printer drivers and AirPrint on macOS, please let know, I am interested in understanding if I am doing something terribly wrong or if
this is the state of affairs with these.
