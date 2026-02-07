---
title: Astro and RSS
subtitle: Setting up an RSS (and Atom) feed for the blog
---

> If you want to follow this and future posts through your preferred reader, you can now subscribe to my [RSS](https://luan.xyz/rss.xml) or [Atom](https://luan.xyz/atom.xml) feeds.

I spent some time digging into how to easily setup an RSS feed for these articles using my new [astro](https://astro.build) setup; that led me into a few rabbit holes, such as learning the differences between [RSS vs Atom](https://stackoverflow.com/questions/3489578/which-is-most-used-rss-or-atom-and-which-one-is-better-to-build-from), setting up [FreshRSS](https://www.freshrss.org/) on my own TrueNAS (and hopefully starting a more curated reading diet), and a few others.

But the biggest one was figuring out how to process a version of the actual content of the article suitable for the RSS feed. While not obligatory, it seems that the common consensus is that RSS feeds should include the article content. The problem is the content are markdown, potentially MDX files that are yet to be processed by Astro. The "official" RSS plugin also does not seem to support Atom out-of-the-box (and I wanted to offer both).

But nothing that some research and understanding could not fix; after studying [this snippet](https://github.com/delucis/astro-blog-full-text-rss/blob/latest/src/pages/rss.xml.ts) and reading [this enlightening article](https://gsong.dev/articles/astro-feed-unified) by George Song, I managed to combine them into my own, hopefully simpler [solution](https://github.com/luanpotter/luanpotter.github.io/blob/master/src/utils/feed.ts).

The key takeaways I combined from both sources were:

- using the `experimental_AstroContainer` API to render content "in memory" - this will work with markdown and MDX without need special handling;
- using the [feed](https://www.npmjs.com/package/feed) package to generate both RSS and Atom feeds with a unified API.

There is still some one-off boilerplate, but hopefully it gets simpler as astro evolves its Container API. Let me know if you think it would be substantial enough to extract into a generic package, or if there are better solutions I failed to find.
