<p align="center"><img width="300px" src=".readme/logo.png" />
</p>
<p align="center">A kit to build quick demo applications and test ideas (chumming the water so to speak)</p>
<hr>
<p align="center">
<a href="https://opensource.org/licenses/MIT">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" />
</a>
</p>

---

# Get Started

install deps and run developement

```
nvm use; yarn; yarn dev;
```

# The Goal

I want to create app based on what I have mentioned in this article https://stagfoo.com/dumbprograms
using the same idea but in web tech, I created this repo. I want everyone to make tiny, good, multi-platform apps.
compiling out to a single index.html has that sort of gameboy-ness that helps apps last forever.

The bolierplate aims and make it small and fun to make something. The choices in this repo follow the below principles, if you
don't like this probably stick with [v1]()

```mermaid

global event bus loop

```

# Principles

- be unable to sunset
- treat the Internet like a tap that's on or off.
- be obvious and explicitly when it's connecting to the Internet
- Files will be the primary input and output (YAML/TOML preferably).
- no login, no accounts
- Personal information should be avoid or encrypted
- Draggable UX or Keyboard focused UX are preferred (feeling like an instrument)
- Old ugly is the new cute
- Minimalistic
- Non internet sharing is preferably (offline QR Code).

# Whats inside

- 🖼️ UI = [nanohtml](https://github.com/choojs/nanohtml)
- 🍖 Store = [Obake.js](https://github.com/stagfoo/obake) (For now)
- Pubsub [Mitt.js]() 
- 🍹 Styles = Tailwind

# Support Me

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/H2H616GHW)
