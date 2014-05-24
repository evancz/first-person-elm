These are mostly boring static files, with the very notable exception of
`PointerLock.js` wich makes this whole project possible.

## Port Handlers

[Ports][ports] are the primary way to communicate between Elm and JS. The
`PointerLock.js` file sets up two incoming ports `isLocked` and `movement` which
provide information about whether a lock has been acquired and when it has, how
the user is moving their mouse around.

[ports]: http://elm-lang.org/learn/Ports.elm

It also sets up two outgoing ports `requestPointerLock` and `exitPointerLock`
which you can optionally use to take these actions from within Elm.

It does this by providing an alternative way to initialize Elm modules from JS
called `Elm.fullscreenWithPointerLock`. I'm not sure if this is the ideal way to
create port handlers yet though. Specifically, what happens when you want to use
many port handlers on the same module? We should keep experimenting!
