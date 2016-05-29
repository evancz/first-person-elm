module Main exposing (main)

import Model
import Update
import View
import Ports
import AnimationFrame
import Keyboard
import Window
import Html.App as Html
import Mouse


{-| The Elm entrypoint
-}
main : Program Model.Args
main =
    Html.programWithFlags
        { init = Model.init
        , update = Update.update
        , subscriptions = subscriptions
        , view = View.view
        }


{-| Subscribe to keychange events.

Ignore anything that isn't an escape, space or WASD key
-}
keyChange : Bool -> Keyboard.KeyCode -> Model.Msg
keyChange on keyCode =
    if keyCode == 27 && on then
        Model.LockRequest False
    else
        (case keyCode of
            32 ->
                \k -> { k | space = on }

            65 ->
                \k -> { k | left = on }

            68 ->
                \k -> { k | right = on }

            87 ->
                \k -> { k | up = on }

            83 ->
                \k -> { k | down = on }

            _ ->
                Basics.identity
        )
            |> Model.KeyChange


subscriptions : Model.Model -> Sub Model.Msg
subscriptions model =
    [ AnimationFrame.diffs Model.Animate
    , Keyboard.downs (keyChange True)
    , Keyboard.ups (keyChange False)
    , Window.resizes Model.Resize
    , Ports.isLocked Model.LockUpdate
    ]
        ++ (if model.isLocked then
                [ Ports.movement Model.MouseMove ]
            else
                [ Mouse.clicks (\_ -> Model.LockRequest True) ]
           )
        |> Sub.batch
