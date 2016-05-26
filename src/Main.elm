module Main exposing (main)

import Model exposing (..)
import Update exposing (..)
import View exposing (..)
import AnimationFrame
import Keyboard
import Window
import Html.App as Html
import Mouse


{-| A signal of Mouse actions, derived from relevant mouse position signals
while in fullscreen
-}
mouseMove : Mouse.Position -> Msg
mouseMove =
    MouseMove


{-| Regularly sample the keyboard and window to provide a Signal of TimeDelta actions.
-}
keyChange : Bool -> Keyboard.KeyCode -> Msg
keyChange on keyCode =
    (case keyCode of
        32 ->
            \k -> { k | space = on }

        37 ->
            \k -> { k | left = on }

        39 ->
            \k -> { k | right = on }

        38 ->
            \k -> { k | up = on }

        40 ->
            \k -> { k | down = on }

        _ ->
            Basics.identity
    )
        |> KeyChange


subscriptions : Model -> Sub Msg
subscriptions model =
    [ AnimationFrame.diffs Animate
    , Keyboard.downs (keyChange True)
    , Keyboard.ups (keyChange False)
    , Window.resizes Resize
    ]
        ++ (if model.isLocked then
                [ Mouse.moves MouseMove ]
            else
                []
           )
        |> Sub.batch


{-| The Elm entrypoint
-}
main : Program Never
main =
    Html.program
        { init = init
        , view = view
        , subscriptions = subscriptions
        , update = update
        }
