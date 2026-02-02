---
title: First post
subtitle: Starting a repository of articles and posts
---

I've been meaning to revamp my website for a while; finally, with the launch of [drop-in](/projects/drop-in), I decided to bite the bullet. I had two design goals for my website that were at odds:

- I wanted it to be zero-CSS, just HTML and what your browser gives you
- I also despise light-mode

While I could expect all users to use some extension to change the CSS of all websites to dark mode (which would def work pretty perfectly on a non-CSS website), I kind of wanted to enshrine dark mode as a first-class experience. But I also just didn't want to write complex, arbitrary, ad-hoc CSS.

I've used [simple css](https://simplecss.org/) on a few projects before ([[1]](/projects/dim-rift),[[2]](/projects/flaky-flasks)), but I wanted something that was equally or even simpler, that I also could "drop in" to any semantic HTML with very basic assumptions, but also that looked the way I wanted it to look, inspired by my very bespoke design inclinations. So I extracted drop-in from [another project](/projects/card-press) and decided to have it on the back as my "default" stylesheet for web projects, including this one.

Now, for the purists, I kept an option to quickly nuke all the CSS back to smithereens - so you can still enjoy the "og" experience of a pure HTML website. I think at the end of the day this is a good compromise. It is still comfortably below the [512 KB mark](https://512kb.club/) (even after adding the [Writer](https://github.com/tonsky/font-writer) custom font by [@tonsky](https://github.com/tonsky)).
