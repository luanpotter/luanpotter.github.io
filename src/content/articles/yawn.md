---
title: How we tamed Hibernate ORM in Kotlin with Project Yawn
subtitle: Plus, a big announcement about Faire’s open source initiatives
date: 2026-02-02
---

> This article was [originally posted by me on Faire's Tech Blog](https://craft.faire.com/how-we-tamed-hibernate-orm-in-kotlin-with-project-yawn-17692cbbad0e).

At [Faire](https://www.faire.com/), we have a very robust [Kotlin backend service infrastructure](https://craft.faire.com/how-faire-uses-kotlin-to-power-our-small-business-marketplace-3c3c7cafe4ec) that we’ve carefully honed over the years, powered by a collection of established libraries and frameworks used by the broader open-source community, all coupled with some special Faire glue to make it all work. And as many within the JVM world, for ease of database access without writing and mapping SQL queries to models by hand, we use [Apache Hibernate](https://hibernate.org/). The Hibernate ORM is probably the most famous (infamous?) ORM framework of all time, and it has set the standard—and many of the pain points—for ORMs in general for several decades (yep, I know—feeling old yet?). It’s a polarizing topic. The discourse is often that people hate it but still use it, which leads me to compare it with that old democracy adage: it’s the worst way to do things, except for all of those other ways that have been tried from time to time.

It’s undeniable how easy Hibernate can make setting up basic database access, especially for smaller CRUD applications, by directly mapping tables to your POJOs, requiring very little boilerplate and glue. But it can lead to many issues that lead a lot of people to choose alternatives. But we’re not here today to talk about those, or discuss how to do ORMs or DB access in general (I leave that for the philosophers in the comments). Instead, I wanted to share a small way in which we made our usage of Hibernate, specifically the legacy Criteria API that we still use, a little bit better at Faire—taming one of its pain points with a creative solution. Hint: it will involve type-safety and KSP ;)

## The Criteria API

The Criteria API is a legacy way of building queries. There are newer alternatives on newer Hibernate versions, including some that aim to fix this exact pain point we’re going to talk about. But if you’re in a large codebase that has evolved and adapted around the Criteria API, you might find newer alternatives can actually be more verbose, or require a bigger paradigm shift or migration that your team might not be ready or willing to accept. In which case, you will probably be familiar with your code for building queries currently looking something like:

```kotlin
criteria.add(Restrictions.eq("column", value))
```

If that looks anything familiar—this article is for you. Now, at Faire, we already had, for quite a while, a wrapper over this to make it nicer to use with Kotlin:

```kotlin
session.query<Book>
  .addEq("name", "Lord of the Rings")
  .list() // returns a List<Book>
```

That is a very thin wrapper we’ve been using and maintaining internally for years. However, it always bothered us that while we get back a fully typed `List<Book>`, consistent with the full-type-safety we know and expect in Kotlin, the actual arguments to the query were, let’s say, not ideal.

The column names are just `String`, and, even worse, the values are `Any` (that is from our Kotlin wrapper; the underlying Java API is just `Object` of course). If you make an incorrect assumption about your table, the best case-scenario is only catching that later on with unit tests (and that is the _best_ scenario). After seeing again and again bugs and developer productivity hits, we had a dream of making this better.

But, as you can imagine, it was never a priority on top of other much-needed infrastructure improvements we’re always doing. Well, that all changed during one of our glorious [Hack Weeks](https://craft.faire.com/crafting-a-hack-week-that-people-love-b0c2afe2e639) (an internal annual hackathon where everyone at Faire can participate and form teams to work on whatever projects their heart desires). And you can bet just what our heart desired.

So, during that pivotal Hack Week, we built a functional prototype of what would eventually replace our wrapper; a brand-new Hibernate Criteria API wrapper, with basically the same syntax we already knew and loved, minimally amended to provide one key benefit: **full type-safety**.

And over the course of the following 2 years (!!), we, slowly, whenever we had some spare time, migrated 61% of all queries across the entire codebase to the new infrastructure. As of now, we’re happy to say more than 11 of our production services are fully migrated. Given that, alongside the fact that all new queries are type-safe, we were able to reduce the number of magic-string induced incidents (and associated developer frustration only caught during tests) to zero.

As we rolled out this migration, we had to add support for different types of queries, refining the code-generation to power it, fixing bugs, listening to internal feedback, and thus homing in on what we now call, and are happy to introduce: **Project Yawn**.

## Introducing: Project Yawn

This is what a Yawn query looks like:

```kotlin
session.query(BookTable) { books ->
 addEq(books.name, "Lord of the Rings")
}
```

That’s right! You get an object representing your Hibernate entity (`BookTable`), with all its fields. That means you get auto-complete, _intellisense,_ and compile-time checks. But that’s not all—Yawn also knows the types of your columns, so it makes sure that the `name` column on the `books` table expects a String, and nothing else.

“But that is not going to cut it”, you might say, “I need complex queries!” Yawn has you covered—basically any query that can be written with Hibernate’s Criteria API can be written with Yawn, including complex and nested joins, projections, etc.

For example, here are the e-mails of all authors in the database whose favourite book is their own writing:

```kotlin
val emails = session.project(PersonTable) { people ->
  val favouriteBooks = join(people.favouriteBook)
  val favouriteBooksAuthors = join(favouriteBooks.author)
  addIn(people.name, authors)
  addEq(people.name, favouriteBooksAuthors.name)

  project(people.email)
}.list()
```

And we support much more: projection to data classes, sub-queries (detached and correlated), join references, and much more.

And that was all thanks to…

## The magic of KSP

In order to power the creation of the meta-model representations of our tables based on our Hibernate entities, we use the power of [Kotlin Symbol Processing](https://kotlinlang.org/docs/ksp-overview.html), the official meta-programming framework in Kotlin. That means we hook up compilations steps to the compiler itself—no external tools, no scripts. It is pure Kotlin code that is automatically run when you add the Yawn dependency, and integrates well with IntelliJ or your preferred editor (references and go to definition all work out-of-the-box).

We have generators that scan through any entities `Foo` annotated with `@YawnEntity` on our Gradle module and generate a `FooTable` definition to be used for queries, maintaining the same visibility modifiers as the original class. It has references to columns and relationships, allowing for type-safe joins, and works with all Hibernate use-cases we had so far in our vast codebase (the hardest technical challenges were settling the exact shape and design of our APIs to support these edge cases such as embedded entities, composite keys, references with different foreign keys, etc).

After a period of tweaking the interfaces to be more ergonomic, fighting with the underlying Hibernate implementations, and wrangling some complex generics, the generators are now just plain Kotlin code, so they’re easily amendable by the entire team if there’s any feature missing.

We’ve tinkered with and refined it as we added to more usages and more complex use cases. But we wanted more—we wanted to share what we did with the community, in case other projects using Hibernate could benefit (and contribute!) to Yawn. So… we did.

## OSS

We are thrilled to announce that we are officially [fully open-sourcing Project Yawn under the MIT license](https://github.com/Faire/yawn/)! We believe in the power and community of open source, and while we use many tools and libraries, we want to contribute back with something we could share from our work.

You can check out the repository at [github.com/faire/yawn](https://www.notion.so/fdp-2b02efb5c25a80e68849c2bd1fe92c5b?pvs=21) for instructions on how to get started. We also welcome contributions and constructive feedback, and would love if you could give us a star!

And that’s not all—this is just one of a few pieces we’re happy to announce as part of a broader company-wide commitment to open-source and the developer community. We’ve started to build a dedicated public-facing OSS page at [faire.tech/open-source](http://faire.tech/open-source) where we aim to collect and catalogue projects we have (or have yet to) publish, as well as other contributions we’ve made over the years to existing and established libraries and tools we use every day.

If you’re interested in our other projects, I’d recommend checking out our [faire-detekt-rules](https://github.com/Faire/faire-detekt-rules/), a curated and opinionated collection of custom Detekt rules and configs that we use on our Kotlin modules. You can opt in many of the rules that help us catch bugs early on, standardize best practices, and just keep our code looking pristine.

If you’re looking to write more complex queries that Hibernate and Yawn can’t support, we highly recommend [sqldelight](https://github.com/sqldelight/sqldelight) (which, fun fact, also uses KSP under the hood), in which case you might want to check out the [CRDB connector we open-sourced a while ago.](https://www.notion.so/Faire-sqldelight-cockroachdb-dialect-2152efb5c25a800ea067de49c523e651?pvs=21)

This is just the beginning of how we think Faire can contribute to the broader OSS community—stay tuned for new additions very soon as we work to extract other pieces of our codebase and infrastructure.

<!-- cspell:disable-next-line -->

Many thanks to everyone at Faire and elsewhere that has helped us along the way, including, but not limited to, [Adriel Martinez](https://www.linkedin.com/in/adrielmartinez/), [Emily O’Leary](https://www.linkedin.com/in/emilycoleary/), [Jean Yang](https://www.linkedin.com/in/jeanyang0/), [Kevin Brightwell](https://www.linkedin.com/in/kevinbrightwell/), [Luan Nico](https://www.linkedin.com/in/luan-nico/), [Micah Beech](https://www.linkedin.com/in/micahbeech/), [Oren Kislev](https://www.linkedin.com/in/oren-kislev-99506a77/), [Quinn Budan](https://www.linkedin.com/in/quinn-budan/), [Stas Novosad](https://www.linkedin.com/in/stanislav-novosad-04861b161/), and [Zhiping Cai](https://www.linkedin.com/in/zhipingcai/).
