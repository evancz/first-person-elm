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


{-| Regularly sample the keyboard and window to provide a Signal of TimeDelta actions.
-}
keyChange : Bool -> Keyboard.KeyCode -> Model.Msg
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
        |> Model.KeyChange


subscriptions : Model.Model -> Sub Model.Msg
subscriptions model =
    [ AnimationFrame.diffs Model.Animate
    , Keyboard.downs (keyChange True)
    , Keyboard.ups (keyChange False)
    , Window.resizes Model.Resize
    , Ports.isLocked Model.LockUpdate
    , Keyboard.presses (\keyCode -> Model.LockRequest (keyCode == 27))
    ]
        ++ (if model.isLocked then
                [ Ports.movement Model.MouseMove ]
            else
                [ Mouse.clicks (\_ -> Model.LockRequest True) ]
           )
        |> Sub.batch


{-| The Elm entrypoint
-}
main : Program Never
main =
    Html.program
        { init = Model.init
        , view = View.view
        , subscriptions = subscriptions
        , update = Update.update
        }
