module View exposing (view)

import Color
import Element exposing (Element, layers, container, Position, midLeftAt, absolute, relative, leftAligned, color, spacer, show)
import Text
import Html
import Math.Matrix4 exposing (makePerspective, mul, makeLookAt, makeRotate, transform, Mat4, translate3)
import Math.Vector3 exposing (Vec3, vec3, getY, toTuple, add, toRecord, i, j, k, scale)
import Model
import View.Crate
import View.Ground
import WebGL
import Html exposing (Html)
import Model exposing (Model, Msg)
import Window


{-| generate a View from a Model
-}
view : Model -> Html Msg
view { person, maybeWindowSize, maybeTexture, isLocked } =
    Element.toHtml
        <| case ( maybeWindowSize, maybeTexture ) of
            ( Nothing, _ ) ->
                message ""

            ( _, Nothing ) ->
                message ""

            ( Just windowSize, Just texture ) ->
                layoutScene windowSize isLocked texture person


layoutScene : Window.Size -> Bool -> WebGL.Texture -> Model.Person -> Element
layoutScene ({ width, height } as windowSize) isLocked texture person =
    layers
        [ color (Color.rgb 135 206 235) (spacer width height)
        , WebGL.webgl ( width, height ) (renderWorld texture (perspective windowSize person))
        , container width
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
perspective : Window.Size -> Model.Person -> Mat4
perspective { width, height } person =
    mul (makePerspective 45 (toFloat width / toFloat height) 1.0e-2 100)
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
    Element.flow Element.down
        (List.map (Text.fromString >> Element.leftAligned)
            [ "This uses stuff that is only available in Chrome and Firefox!"
            , "WASD keys to move, space bar to jump."
            , msg
            ]
        )
