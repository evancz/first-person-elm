module Model exposing (..)

import Math.Vector3 exposing (Vec3, vec3)
import WebGL exposing (..)
import Window
import Time exposing (..)
import Task exposing (Task)
import Mouse


type Msg
    = TextureError Error
    | TextureLoaded Texture
    | KeyChange (Keys -> Keys)
    | MouseMove Mouse.Position
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


type alias Model =
    { person : Person
    , maybeTexture : Maybe Texture
    , maybeWindowSize : Maybe Window.Size
    , keys : Keys
    , isLocked : Bool
    , message : String
    }


eyeLevel : Float
eyeLevel =
    2


defaultPerson : Person
defaultPerson =
    { position = vec3 0 eyeLevel -10
    , velocity = vec3 0 0 0
    , horizontalAngle = degrees 90
    , verticalAngle = 0
    }


init : ( Model, Cmd Msg )
init =
    ( { person = defaultPerson
      , maybeTexture = Nothing
      , maybeWindowSize = Nothing
      , keys = Keys False False False False False
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
