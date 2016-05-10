module Update (update) where

import Math.Vector3 exposing (Vec3, toRecord, normalize, vec3, getY, getX, getZ, setY, add, toTuple, i, j, k, scale)
import Math.Matrix4 exposing (makeRotate, transform)
import Model exposing (..)
import Effects


update : Action -> Model -> ( Model, Effects.Effects Action )
update action model =
  let
    newModel : Model
    newModel =
      case action of
        Mouse movement ->
          { model | person = turn movement model.person }

        TimeDelta isJumping direction dimensions dt ->
          let
            newPerson =
              model.person
                |> walk direction
                |> jump isJumping
                |> gravity dt
                |> physics dt
          in
            { model | person = newPerson, maybeWindow = Just dimensions }

        TextureLoaded maybeTexture ->
          { model | maybeTexture = maybeTexture }

        IsLocked isLocked ->
          { model | isLocked = isLocked }
  in
    ( newModel, Effects.none )


flatten : Vec3 -> Vec3
flatten v =
  let
    r =
      toRecord v
  in
    normalize (vec3 r.x 0 r.z)


turn : ( Int, Int ) -> Person -> Person
turn ( dx, dy ) person =
  let
    h' =
      person.horizontalAngle + toFloat dx / 500

    v' =
      person.verticalAngle - toFloat dy / 500
  in
    { person
      | horizontalAngle = h'
      , verticalAngle = clamp (degrees -45) (degrees 45) v'
    }


walk : { x : Int, y : Int } -> Person -> Person
walk directions person =
  if getY person.position > eyeLevel then
    person
  else
    let
      moveDir =
        normalize (flatten (direction person))

      strafeDir =
        transform (makeRotate (degrees -90) j) moveDir

      move =
        scale (toFloat directions.y) moveDir

      strafe =
        scale (toFloat directions.x) strafeDir
    in
      { person | velocity = adjustVelocity (move `add` strafe) }


adjustVelocity : Vec3 -> Vec3
adjustVelocity v =
  case toTuple v of
    ( 0, 0, 0 ) ->
      v

    _ ->
      scale 2 (normalize v)


jump : Bool -> Person -> Person
jump isJumping person =
  if not isJumping || getY person.position > eyeLevel then
    person
  else
    let
      v =
        toRecord person.velocity
    in
      { person | velocity = vec3 v.x 2 v.z }


physics : Float -> Person -> Person
physics dt person =
  let
    position =
      person.position `add` scale dt person.velocity

    p =
      toRecord position

    position' =
      if p.y < eyeLevel then
        vec3 p.x eyeLevel p.z
      else
        position
  in
    { person | position = position' }


gravity : Float -> Person -> Person
gravity dt person =
  if getY person.position <= eyeLevel then
    person
  else
    let
      v =
        toRecord person.velocity
    in
      { person | velocity = vec3 v.x (v.y - 2 * dt) v.z }
