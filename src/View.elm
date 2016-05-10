module View (fetchTexture, view) where

import Color
import Effects
import Graphics.Element exposing (Element, layers, container, Position, midLeftAt, absolute, relative, leftAligned, color, spacer, show)
import Html
import Math.Matrix4 exposing (makePerspective, mul, makeLookAt, makeRotate, transform, Mat4, translate3)
import Math.Vector3 exposing (Vec3, vec3, getY, toTuple, add, toRecord, i, j, k, scale)
import Model
import Task
import View.Crate
import View.Ground
import WebGL


{-| fetch texture on startup
-}
fetchTexture : Effects.Effects Model.Action
fetchTexture =
  WebGL.loadTexture "/resources/woodCrate.jpg"
    |> Task.toMaybe
    |> Task.map Model.TextureLoaded
    |> Effects.task


{-| generate a View from a Model
-}
view : Signal.Address Model.Action -> Model.Model -> Html.Html
view address { person, isLocked, maybeWindow, maybeTexture } =
  Html.fromElement
    <| case ( person, isLocked, maybeWindow, maybeTexture ) of
        ( _, _, Nothing, _ ) ->
          message "Loading..."

        ( _, _, _, Nothing ) ->
          message "Loading..."

        ( person, isLocked, Just ( w, h ), Just texture ) ->
          layoutScene ( w, h ) isLocked texture person


layoutScene : ( Int, Int ) -> Bool -> WebGL.Texture -> Model.Person -> Element
layoutScene ( w, h ) isLocked texture person =
  layers
    [ color (Color.rgb 135 206 235) (spacer w h)
    , WebGL.webgl ( w, h ) (renderWorld texture (perspective ( w, h ) person))
    , container
        w
        140
        (midLeftAt (absolute 40) (relative 0.5))
        (if isLocked then
          exitMsg
         else
          enterMsg
        )
    ]


{-| Set up 3D world
-}
renderWorld : WebGL.Texture -> Mat4 -> List WebGL.Renderable
renderWorld texture perspective =
  let
    renderedCrates =
      [ View.Crate.renderCrate texture perspective
      , View.Crate.renderCrate texture (translate3 10 0 10 perspective)
      , View.Crate.renderCrate texture (translate3 -10 0 -10 perspective)
      ]
  in
    (View.Ground.renderGround perspective) :: renderedCrates


{-| Calculate the viewers field of view.
-}
perspective : Model.WindowDimensions -> Model.Person -> Mat4
perspective ( w, h ) person =
  mul
    (makePerspective 45 (toFloat w / toFloat h) 1.0e-2 100)
    (makeLookAt person.position (person.position `add` Model.direction person) j)


{-| Constant function describing the initial position of the viewer
-}
position : Position
position =
  midLeftAt (absolute 40) (relative 0.5)


enterMsg : Element
enterMsg =
  message "Click to go full screen and move your head with the mouse."


exitMsg : Element
exitMsg =
  message "Press <escape> to exit full screen."


message : String -> Element
message msg =
  show
    <| "This uses stuff that is only available in Chrome and Firefox! "
    ++ "WASD or arrow keys to move, space bar to jump. "
    ++ msg
