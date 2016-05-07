module Model (WindowDimensions, Action(TimeDelta, Mouse, TextureLoaded), Model, Person, initModel, eyeLevel, direction) where

import Math.Vector3 exposing (Vec3, vec3)
import WebGL


{-| This type is used often enough that I think it deserves some self-documentation
-}
type alias WindowDimensions =
  ( Int, Int )


{-| Every half a second there's an event coming through;
these are all the valid actions we could receive.
# Move - the user is trying to jump using the space key, move using the arrow keys,
or the window is being resized
# TextureLoaded - a texture has been loaded across the wire
-}
type Action
  = TimeDelta Bool { x : Int, y : Int } WindowDimensions Float
  | Mouse WindowDimensions
  | TextureLoaded (Maybe WebGL.Texture)


{-| This is the applications's Model data structure
-}
type alias Model =
  { person : Person
  , maybeWindow : Maybe WindowDimensions
  , maybeTexture : Maybe WebGL.Texture
  }


type alias Person =
  { position : Vec3
  , velocity : Vec3
  , horizontalAngle : Float
  , verticalAngle : Float
  , message : String
  }


{-| When the application first starts, this is initial state of the Model
-}
initModel : Model
initModel =
  { person =
      { position = vec3 0 eyeLevel -8
      , velocity = vec3 0 0 0
      , horizontalAngle = degrees 90
      , verticalAngle = 0
      , message = "No texture yet"
      }
  , maybeWindow = Nothing
  , maybeTexture = Nothing
  }


eyeLevel : Float
eyeLevel =
  2


direction : Person -> Vec3
direction person =
  let
    h =
      person.horizontalAngle

    v =
      person.verticalAngle
  in
    vec3 (cos h) (sin v) (sin h)
