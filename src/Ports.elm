port module Ports exposing (..)

{-| Collect all ports into their own module.
This is mostly to avoid circular references between Main, Update and View
-}


{-| Provide the ability to request fullscreen mode. Click screen to request lock.
-}
port requestPointerLock : () -> Cmd msg


{-| Provide the ability to request and exit fullscreen mode.
Click screen to request lock. Press escape to give up the lock.
-}
port exitPointerLock : () -> Cmd msg


{-| The user is moving the mouse while in fullscreen mode
-}
port movement : (( Int, Int ) -> msg) -> Sub msg


{-| The user is entering/leaving fullscreen mode
-}
port isLocked : (Bool -> msg) -> Sub msg
