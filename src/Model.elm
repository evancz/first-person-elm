module Model exposing (Msg(..), Model, Person, Keys, init, eyeLevel, direction)

import Math.Vector3 exposing (Vec3, vec3)
import WebGL exposing (..)
import Window
import Time exposing (..)
import Task exposing (Task)


{-| Every half a second there's an event coming through;
these are all the valid actions we could receive.
# Move - the user is trying to jump using the space key, move using the arrow keys,
or the window is being resized
# TextureLoaded - a texture has been loaded across the wire
-}
type Msg
    = TextureError Error
    | TextureLoaded Texture
    | KeyChange (Keys -> Keys)
    | MouseMove ( Int, Int )
    | LockRequest Bool
    | LockUpdate Bool
    | Animate Time
    | Resize Window.Size


type alias Person =
    { position : Vec3
    , velocity : Vec3
    , horizontalAngle : Float
    , verticalAngle : Float
    }


type alias Keys =
    { left : Bool
    , right : Bool
    , up : Bool
    , down : Bool
    , space : Bool
    }


{-| This is the applications's Model data structure
-}
type alias Model =
    { person : Person
    , maybeTexture : Maybe Texture
    , maybeWindowSize : Maybe Window.Size
    , keys : Keys
    , wantToBeLocked : Bool
    , isLocked : Bool
    , message : String
    }


eyeLevel : Float
eyeLevel =
    2


{-| When the application first starts, this is initial state of the Model
-}
init : ( Model, Cmd Msg )
init =
    ( { person =
            { position = vec3 0 eyeLevel -10
            , velocity = vec3 0 0 0
            , horizontalAngle = degrees 90
            , verticalAngle = 0
            }
      , maybeTexture = Nothing
      , maybeWindowSize = Nothing
      , keys = Keys False False False False False
      , wantToBeLocked = True
      , isLocked = True
      , message = "No texture yet"
      }
    , Cmd.batch
        [ loadTexture "/resources/woodCrate.jpg"
            |> Task.perform TextureError TextureLoaded
        , Window.size |> Task.perform (always Resize ( 0, 0 )) Resize
        ]
    )


direction : Person -> Vec3
direction person =
    let
        h =
            person.horizontalAngle

        v =
            person.verticalAngle
    in
        vec3 (cos h) (sin v) (sin h)
