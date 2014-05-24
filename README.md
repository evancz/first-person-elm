# First Person Navigation in Elm

Walk around with WASD and jump with SPACE. When you go into full-screen mode,
you can turn your head with the mouse.

## Setup

```bash
git clone https://github.com/evancz/first-person-elm.git
cd first-person-elm
elm-get install
elm --make --only-js --src-dir=src Main.elm
elm-server
```

And then open [http://localhost:8000](http://localhost:8000) to see it in action!
