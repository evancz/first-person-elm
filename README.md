# First Person 3D Navigation in Elm

Make sure you have the latest version of Chrome or Firefox and then click the
following image to try out the **[live demo][demo]**. Walk around with WASD and
jump with SPACE. When you go into full-screen mode, you can turn your head with
the mouse.

[![Live Demo](resources/ScreenShot.png)][demo]

[demo]: http://evancz.github.io/first-person-elm/

The goals of this project are:

  1. Use the fullscreen and [Pointer Lock][lock] APIs with Elm to fully control
     the mouse.

  2. Experiment with "Port Handlers" that automatically set up useful ports,
     done in [this file][file] in a fairly general and reuseable way. Perhaps
     we can find general patters in code like this.

  3. Let people fork this and begin to build cooler stuff!

[lock]: https://developer.mozilla.org/en-US/docs/WebAPI/Pointer_Lock
[file]: https://github.com/evancz/first-person-elm/blob/master/resources/PointerLock.js

## Build Locally

```bash
git clone https://github.com/evancz/first-person-elm.git
cd first-person-elm
elm-get install
elm --make --only-js --src-dir=src Main.elm
elm-server
```

And then open [http://localhost:8000](http://localhost:8000) to see it in action!

## Possible Extensions

  * Add a [skybox][skybox]
  * Make it possible to crouch
  * Add collisions with boxes
  * Make it possible to jump onto boxes
  * Try to generate interesting shapes to add to the world
  * Procedurally generate terrain
[skybox]: http://en.wikipedia.org/wiki/Skybox_(video_games)
