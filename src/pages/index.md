---
layout: ../layouts/Base.astro
title: Luan
---

Hello! My name is Luan Nico, and this is my landing page.

Please check my [Github Profile](https://github.com/luanpotter) for more up-to-date information.

## Bio

I'm a Physicist and Software Craftsman who loves OSS and the community; currently in love with Kotlin, Dart & Flutter, and learning about the Universe and its mysteries.

I have worked for more than a decade professionally (and more years that I can remember as a hobby) with a plethora of languages, platforms, frameworks and libraries. I like to solve people's problems with technology, and I believe there is always a good solution to every problem and a good problem for every solution; for that reason, I like most programming languages that I have come in contact with, and I'm always thrilled to learn something new.

I truly believe in Open Source and I try to make, if possible, everything I do open (libre) and free.

## Find me

Feel free to contact me using <a href="#" id="contact">this</a>.

If you want to talk about specific projects, other option is to use Github's Issue Manager.

You can find me at the following places:

- [Keybase](https://keybase.io/luan)
- [StackOverflow](https://stackoverflow.com/users/1217989/luan-nico)
- [GitHub](https://github.com/luanpotter)
- [LinkedIn](https://www.linkedin.com/in/luan-nico-5baa3627/)
- [CodeTrace](https://codetrace.com/users/luanpotter)

## Pages

- [Articles](../articles)
- [Projects](../projects)

## Projects

- [flame](https://github.com/luanpotter/flame)
- [audioplayers](https://github.com/luanpotter/audioplayers)
- [vscode-dart-import](https://github.com/luanpotter/vscode-dart-import)
- [http-facade](https://github.com/luanpotter/http-facade)
- [Yawp!](https://github.com/feroult/yawp/)
- [Unicamp - several projects](/unicamp)
- For more stuff, please check my [GitHub page](https://github.com/luanpotter).

## Blue Fire

[Blue Fire](https://blue-fire.xyz) is an open source collective responsible for many projects you know and love, such as the [Flame Engine](https://flame-engine.org), audioplayers, and many more.

I'm the founder and a proud member, and alongside many other incredible contributors from our community.

You can join our [Discord Server](https://discord.com/invite/pxrBmy4) to reach out!

## Donate

If you'd like to buy me a cup of coffee (I love coffee!), feel free to use the options below.

Don't feel compelled in any way, though! Everything I make is free to use, MIT, open source and libre.

[My Github Sponsor Page](https://github.com/sponsors/luanpotter)

[Blue Fire's Patreon](https://www.patreon.com/fireslime)

<script>
  const contact = document.getElementById("contact");
  contact?.addEventListener("click", (e) => {
    e.preventDefault();
    const myName = "contact";
    const myServer = "luan.xyz";
    contact.innerHTML = myName + "&#64;" + myServer;
    contact.setAttribute("href", "mailto:" + myName + "@" + myServer);
  });
</script>
