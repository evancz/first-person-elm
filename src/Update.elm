module Update exposing (update)

import Ports
import Model
import Math.Vector3 as Vector3 exposing (Vec3, toRecord, normalize, vec3, getY, getX, getZ, setY, add, toTuple, i, j, k, scale)
import Math.Matrix4 exposing (makeRotate, transform)


directions : Model.Keys -> { x : Int, y : Int }
directions { left, right, up, down } =
    let
        direction a b =
            case ( a, b ) of
                ( True, False ) ->
                    -1

                ( False, True ) ->
                    1

                _ ->
                    0
    in
        { x = direction left right
        , y = direction down up
        }


flatten : Vec3 -> Vec3
flatten v =
    let
        r =
            toRecord v
    in
        normalize (vec3 r.x 0 r.z)


turn : ( Int, Int ) -> Model.Person -> Model.Person
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


walk : { x : Int, y : Int } -> Model.Person -> Model.Person
walk directions person =
    if getY person.position > Model.eyeLevel then
        person
    else
        let
            moveDir =
                normalize (flatten (Model.direction person))

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


jump : Bool -> Model.Person -> Model.Person
jump isJumping person =
    if not isJumping || getY person.position > Model.eyeLevel then
        person
    else
        let
            v =
                toRecord person.velocity
        in
            { person | velocity = vec3 v.x 2 v.z }


physics : Float -> Model.Person -> Model.Person
physics dt person =
    let
        position =
            person.position `add` scale dt person.velocity

        p =
            toRecord position

        position' =
            if p.y < Model.eyeLevel then
                vec3 p.x Model.eyeLevel p.z
            else
                position
    in
        { person | position = position' }


gravity : Float -> Model.Person -> Model.Person
gravity dt person =
    if getY person.position <= Model.eyeLevel then
        person
    else
        let
            v =
                toRecord person.velocity
        in
            { person | velocity = vec3 v.x (v.y - 2 * dt) v.z }


update : Model.Msg -> Model.Model -> ( Model.Model, Cmd Model.Msg )
update msg model =
    case msg of
        Model.TextureError err ->
            ( { model | message = "Error loading texture" }
            , Cmd.none
            )

        Model.TextureLoaded texture ->
            ( { model | maybeTexture = Just texture }
            , Cmd.none
            )

        Model.KeyChange keyfunc ->
            ( { model | keys = keyfunc model.keys }
            , Cmd.none
            )

        Model.Resize windowSize ->
            ( { model | maybeWindowSize = Just windowSize }
            , Cmd.none
            )

        Model.MouseMove movement ->
            ( { model | person = turn movement model.person }
            , Cmd.none
            )

        Model.LockRequest wantToBeLocked ->
            ( { model | wantToBeLocked = wantToBeLocked }
            , if model.wantToBeLocked == model.isLocked then
                Cmd.none
              else if model.wantToBeLocked then
                Ports.requestPointerLock ()
              else
                Ports.exitPointerLock ()
            )

        Model.LockUpdate isLocked ->
            ( { model | isLocked = isLocked }
            , Cmd.none
            )

        Model.Animate dt ->
            ( { model
                | person =
                    model.person
                        |> walk (directions model.keys)
                        |> jump model.keys.space
                        |> gravity (dt / 500)
                        |> physics (dt / 500)
              }
            , Cmd.none
            )
