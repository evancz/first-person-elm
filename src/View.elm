module View exposing (view)

import Html
import Math.Matrix4 exposing (makePerspective, mul, makeLookAt, makeRotate, transform, Mat4, translate3)
import Math.Vector3 exposing (Vec3, vec3, getY, toTuple, add, toRecord, i, j, k, scale)
import Model
import View.Crate
import View.Ground
import WebGL
import Html exposing (Html, text, div, p)
import Html.Attributes exposing (width, height, style)
import Model exposing (Model, Msg)
import Window


{-| generate a View from a Model
-}
view : Model -> Html Msg
view { person, maybeWindowSize, maybeTexture, isLocked } =
    case ( maybeWindowSize, maybeTexture ) of
        ( Nothing, _ ) ->
            text ""

        ( _, Nothing ) ->
            text ""

        ( Just windowSize, Just texture ) ->
            layoutScene windowSize isLocked texture person


layoutScene : Window.Size -> Bool -> WebGL.Texture -> Model.Person -> Html Msg
layoutScene windowSize isLocked texture person =
    div
        [ style
            [ ( "width", toString width ++ "px" )
            , ( "height", toString height ++ "px" )
            , ( "position", "relative" )
            , ( "backgroundColor", "rgb(135, 206, 235)" )
            ]
        ]
        [ WebGL.toHtml [ width windowSize.width, height windowSize.height, style [ ( "display", "block" ) ] ]
            (renderWorld texture (perspective windowSize person))
        , div
            [ style
                [ ( "position", "absolute" )
                , ( "font-family", "monospace" )
                , ( "text-align", "center" )
                , ( "left", "20px" )
                , ( "right", "20px" )
                , ( "top", "20px" )
                ]
            ]
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


enterMsg : List (Html Msg)
enterMsg =
    message "Click to go full screen and move your head with the mouse."


exitMsg : List (Html Msg)
exitMsg =
    message "Press <escape> to exit full screen."


message : String -> List (Html Msg)
message msg =
    [ p [] [ Html.text "This uses stuff that is only available in Chrome and Firefox!" ]
    , p [] [ Html.text "WASD keys to move, space bar to jump." ]
    , p [] [ Html.text msg ]
    ]
