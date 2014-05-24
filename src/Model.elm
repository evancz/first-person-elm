module Model where

import Math.Vector3 (Vec3, vec3)

data Inputs
    = TimeDelta Bool {x:Int, y:Int} Float
    | Mouse (Int,Int)

type Person =
    { position : Vec3
    , velocity : Vec3
    , horizontalAngle : Float
    , verticalAngle   : Float
    }

eyeLevel : Float
eyeLevel = 2

defaultPerson : Person
defaultPerson =
    { position = vec3 0 eyeLevel -8
    , velocity = vec3 0 0 0
    , horizontalAngle = degrees 90
    , verticalAngle = 0
    }

direction : Person -> Vec3
direction person =
    let h = person.horizontalAngle
        v = person.verticalAngle
    in
        vec3 (cos h) (sin v) (sin h)
