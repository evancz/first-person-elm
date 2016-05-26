module View.Ground exposing (renderGround)

import Math.Vector3 exposing (..)
import Math.Matrix4 exposing (..)
import WebGL exposing (..)
import Color


{-| Describes properties of a Ground vertex
-}
type alias Vertex =
    { position : Vec3, color : Vec3 }


{-| Render the ground
-}
renderGround : Mat4 -> WebGL.Renderable
renderGround perspective =
    WebGL.render vertexShader fragmentShader ground { perspective = perspective }


{-| The mesh for the ground
-}
ground : WebGL.Drawable Vertex
ground =
    let
        green =
            color (degrees 110) 0.48

        topLeft =
            Vertex (vec3 -20 -1 20) (green 0.7)

        topRight =
            Vertex (vec3 20 -1 20) (green 0.4)

        bottomLeft =
            Vertex (vec3 -20 -1 -20) (green 0.5)

        bottomRight =
            Vertex (vec3 20 -1 -20) (green 0.6)
    in
        WebGL.Triangle [ ( topLeft, topRight, bottomLeft ), ( bottomLeft, topRight, bottomRight ) ]


{-| Help create colors as Vectors
-}
color : Float -> Float -> Float -> Vec3
color hue saturation lightness =
    let
        c =
            Color.hsl hue saturation lightness
                |> Color.toRgb
    in
        vec3 (toFloat c.red / 255) (toFloat c.green / 255) (toFloat c.blue / 255)


{-| Vertex shader for the ground
-}
vertexShader : Shader Vertex { perspective : Mat4 } { vcolor : Vec3 }
vertexShader =
    [glsl|

attribute vec3 position;
attribute vec3 color;
uniform mat4 perspective;
varying vec3 vcolor;

void main () {
    gl_Position = perspective * vec4(position, 1.0);
    vcolor = color;
}

|]


{-| Fragment shader for the ground
-}
fragmentShader : Shader {} u { vcolor : Vec3 }
fragmentShader =
    [glsl|

precision mediump float;
varying vec3 vcolor;

void main () {
    gl_FragColor = vec4(vcolor, 1.0);
}

|]
