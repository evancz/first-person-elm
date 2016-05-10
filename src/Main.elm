module Main (main) where

import Effects
import Html
import Keyboard
import Model
import Mouse
import StartApp
import Task
import Time
import Update
import View
import Window


{-| Regularly sample the keyboard and window to provide a Signal of TimeDelta actions.
-}
keyboard : Signal Model.Action
keyboard =
  Signal.map4
    (\isJumping direction dimensions dt ->
      Model.TimeDelta isJumping direction dimensions dt
    )
    Keyboard.space
    (Signal.merge
      Keyboard.arrows
      Keyboard.wasd
    )
    Window.dimensions
    dt
    |> Signal.sampleOn dt


{-| A signal of Mouse actions, derived from mouse position signals
while in fullscreen
-}
mouse : Signal Model.Action
mouse =
  Signal.map Model.Mouse movement


changeLock : Signal Model.Action
changeLock =
  Signal.map Model.IsLocked isLocked


{-| A signal of time deltas
-}
dt : Signal Float
dt =
  Signal.map (\t -> t / 500) (Time.fps 60)


{-| The StartApp `app` function
-}
app : StartApp.App Model.Model
app =
  StartApp.start
    { init = ( Model.initModel, View.fetchTexture )
    , update = Update.update
    , view = View.view
    , inputs = [ keyboard, mouse, changeLock ]
    }


{-| The Elm entrypoint
-}
main : Signal Html.Html
main =
  app.html


{-| Port for processing `Task`s. The only tasks being generated in this app
are from the initial fetch of the crate texture.
-}
port tasks : Signal (Task.Task Effects.Never ())
port tasks =
  app.tasks


{-| These outgoing Signals provide the ability to request and exit fullscreen mode.
Click screen to request lock. Press escape to give up the lock.

This code can all be removed if you want to do this differently.
-}
port requestPointerLock : Signal ()
port requestPointerLock =
  Mouse.clicks


port exitPointerLock : Signal ()
port exitPointerLock =
  Keyboard.isDown 27
    |> Signal.map (\_ -> ())


{-| These incoming `Signal`s provide information pass on events to Elm while
the user is entering/in/leaving fullscreen mode
-}
port movement : Signal ( Int, Int )
port isLocked : Signal Bool
