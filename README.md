# First Person 3D Navigation in Elm

First-person navigation in a simple 3D world, written in Elm. The code ended up
extremely short and simple thanks to [FRP][frp], [`elm-webgl`][webgl], and Elm's
[easy interop with JS][interop]!

[frp]: http://elm-lang.org/learn/What-is-FRP.elm
[webgl]: https://github.com/johnpmayer/elm-webgl
[interop]: https://github.com/evancz/elm-html-and-js

Make sure you have the latest version of Chrome or Firefox and then click the
following image to try out the **[live demo][demo]**:

[![Live Demo](resources/ScreenShot.png)][demo]

[demo]: http://evancz.github.io/first-person-elm/

Without a specialized 3D framework, just [the basic WebGL bindings][webgl], this
took about [300 lines of Elm][src]. I tried to keep the code super simple so it
is easy to fork and build cooler stuff! This project is also architected to
scale nicely as you add more entities.

[src]: https://github.com/evancz/first-person-elm/tree/master/src

We needed an additional [~95 lines of JS][file] to use the experimental
fullscreen and [Pointer Lock][lock] APIs. This is an experiment in setting up
[ports][interop] in a general and reusable way. The goal is a general "Port
Handler" pattern that lets you pipe signals out to JS to use some native API or
have some side-effect. I hope we can iterate on this idea to make it even
simpler for Elm code to interact with JS!

[lock]: https://developer.mozilla.org/en-US/docs/WebAPI/Pointer_Lock
[file]: https://github.com/evancz/first-person-elm/blob/master/resources/PointerLock.js

## Build Locally

After installing [the Elm Platform](https://github.com/elm-lang/elm-platform),
run the following sequence of commands:

```bash
git clone https://github.com/evancz/first-person-elm.git
cd first-person-elm
elm-get install
elm --make --only-js --bundle-runtime --src-dir=src Main.elm
elm-reactor
```

And then open [http://localhost:8000](http://localhost:8000) to see it in action!

## Possible Extensions

  * [Use more exciting textures](https://github.com/kfish/elm-shadertoy)
  * Add a [skybox][skybox]
  * Make it possible to crouch
  * Add collisions with boxes
  * Make it possible to jump onto boxes
  * Try to generate interesting shapes to add to the world
  * Procedurally generate terrain

[skybox]: http://en.wikipedia.org/wiki/Skybox_(video_games)
