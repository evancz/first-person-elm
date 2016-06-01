# Running

First, clone the repository.
If you have the Github Desktop app installed, you can use the clone button on the repository web page.
Otherwise, at the command line:
```bash
git clone https:/github.com/genthaler/first-person-elm.git
cd first-person-elm
```

If you've cloned from genthaler/first-person-elm, you'll need to switch to the `start-app-0.16.0` branch.

If you used the Github Desktop app, you can do this by clicking on the dropdown which probably says `master` and select `start-app-0.16.0`. Otherwise, at the command line:
```bash
git checkout start-app-0.16.0
```

Since elm-reactor no longer serves static resources the way it did (in particular, it serves the formatted source of html files instead of just the file), you need a web server to run the application.

`npm-elm-live` is probably the easiest way to do this:
``` bash
npm install -g elm-live
elm-live src/Main.elm --output=elm.js --open
```

This will open the application in your default browser.
