
/*
 * Copyright (c) 2010 Mozilla Corporation
 * Copyright (c) 2010 Vladimir Vukicevic
 * Copyright (c) 2013 John Mayer
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

/*
 * File: mjs
 *
 * Vector and Matrix math utilities for JavaScript, optimized for WebGL.
 * Edited to work with the Elm Programming Language
 */

Elm.Native.MJS = {};
Elm.Native.MJS.make = function(elm) {

    elm.Native = elm.Native || {};
    elm.Native.MJS = elm.Native.MJS || {};
    if (elm.Native.MJS.values) return elm.Native.MJS.values;

    /*
     * Constant: MJS_VERSION
     *
     * mjs version number aa.bb.cc, encoded as an integer of the form:
     * 0xaabbcc.
     */
    var MJS_VERSION = 0x000000;

    /*
     * Constant: MJS_DO_ASSERT
     *
     * Enables or disables runtime assertions.
     *
     * For potentially more performance, the assert methods can be
     * commented out in each place where they are called.
     */
    // var MJS_DO_ASSERT = false;

    /*
     * Constant: MJS_FLOAT_ARRAY_TYPE
     *
     * The base float array type.  By default, WebGLFloatArray.
     *
     * mjs can work with any array-like elements, but if an array
     * creation is requested, it will create an array of the type
     * MJS_FLOAT_ARRAY_TYPE.  Also, the builtin constants such as (M4x4.I)
     * will be of this type.
     */
    //MJS_FLOAT_ARRAY_TYPE = WebGLFloatArray;
    var MJS_FLOAT_ARRAY_TYPE = Float32Array;
    //MJS_FLOAT_ARRAY_TYPE = Float64Array;
    //MJS_FLOAT_ARRAY_TYPE = Array;

    /*
    if (MJS_DO_ASSERT) {
        function MathUtils_assert(cond, msg) {
            if (!cond) {
                throw "Assertion failed: " + msg;
            }
        }
    } else {
    */
        function MathUtils_assert() { }
    //}

    /*
     * Class: V3
     *
     * Methods for working with 3-element vectors.  A vector is represented by a 3-element array.
     * Any valid JavaScript array type may be used, but if new
     * vectors are created they are created using the configured MJS_FLOAT_ARRAY_TYPE.
     */

    var V3 = { };

    V3._temp1 = new MJS_FLOAT_ARRAY_TYPE(3);
    V3._temp2 = new MJS_FLOAT_ARRAY_TYPE(3);
    V3._temp3 = new MJS_FLOAT_ARRAY_TYPE(3);

    if (MJS_FLOAT_ARRAY_TYPE == Array) {
        V3.x = [1.0, 0.0, 0.0];
        V3.y = [0.0, 1.0, 0.0];
        V3.z = [0.0, 0.0, 1.0];

        V3.$ = function V3_$(x, y, z) {
            return [x, y, z];
        };
    } else {
        V3.x = new MJS_FLOAT_ARRAY_TYPE([1.0, 0.0, 0.0]);
        V3.y = new MJS_FLOAT_ARRAY_TYPE([0.0, 1.0, 0.0]);
        V3.z = new MJS_FLOAT_ARRAY_TYPE([0.0, 0.0, 1.0]);

        /*
         * Function: V3.$
         *
         * Creates a new 3-element vector with the given values.
         *
         * Parameters:
         *
         *   x,y,z - the 3 elements of the new vector.
         *
         * Returns:
         *
         * A new vector containing with the given argument values.
         */

        V3.$ = function V3_$(x, y, z) {
            return new MJS_FLOAT_ARRAY_TYPE([x, y, z]);
        };
    }

    V3.u = V3.x;
    V3.v = V3.y;

    V3.getX = function V3_getX(a) {
        return a[0];
    }
    V3.getY = function V3_getY(a) {
        return a[1];
    }
    V3.getZ = function V3_getZ(a) {
        return a[2];
    }
    V3.setX = function V3_setX(x, a) {
        return new MJS_FLOAT_ARRAY_TYPE(x, a[1], a[2]);
    }
    V3.setY = function V3_setY(y, a) {
        return new MJS_FLOAT_ARRAY_TYPE(a[0], y, a[2]);
    }
    V3.setZ = function V3_setZ(z, a) {
        return new MJS_FLOAT_ARRAY_TYPE(a[0], a[1], z);
    }

    V3.toTuple3 = function V3_toTuple3(a) {
      return {
        ctor:"_Tuple3",
        _0:a[0],
        _1:a[1],
        _2:a[2]
      };
    };
    V3.fromTuple3 = function V3_fromTuple3(t) {
      return new MJS_FLOAT_ARRAY_TYPE([t._0, t._1, t._2]);
    };

    V3.toRecord3 = function V3_toRecord3(a) {
      return {
        _:{},
        x:a[0],
        y:a[1],
        z:a[2]
      };
    };
    V3.fromRecord3 = function V3_fromRecord3(r) {
      return new MJS_FLOAT_ARRAY_TYPE([r.x, r.y, r.z]);
    };

    /*
     * Function: V3.add
     *
     * Perform r = a + b.
     *
     * Parameters:
     *
     *   a - the first vector operand
     *   b - the second vector operand
     *   r - optional vector to store the result in
     *
     * Returns:
     *
     *   If r is specified, returns r after performing the operation.
     *   Otherwise, returns a new 3-element vector with the result.
     */
    V3.add = function V3_add(a, b, r) {
        //MathUtils_assert(a.length == 3, "a.length == 3");
        //MathUtils_assert(b.length == 3, "b.length == 3");
        //MathUtils_assert(r == undefined || r.length == 3, "r == undefined || r.length == 3");

        if (r == undefined)
            r = new MJS_FLOAT_ARRAY_TYPE(3);
        r[0] = a[0] + b[0];
        r[1] = a[1] + b[1];
        r[2] = a[2] + b[2];
        return r;
    };

    /*
     * Function: V3.sub
     *
     * Perform
     * r = a - b.
     *
     * Parameters:
     *
     *   a - the first vector operand
     *   b - the second vector operand
     *   r - optional vector to store the result in
     *
     * Returns:
     *
     *   If r is specified, returns r after performing the operation.
     *   Otherwise, returns a new 3-element vector with the result.
     */
    V3.sub = function V3_sub(a, b, r) {
        //MathUtils_assert(a.length == 3, "a.length == 3");
        //MathUtils_assert(b.length == 3, "b.length == 3");
        //MathUtils_assert(r == undefined || r.length == 3, "r == undefined || r.length == 3");

        if (r == undefined)
            r = new MJS_FLOAT_ARRAY_TYPE(3);
        r[0] = a[0] - b[0];
        r[1] = a[1] - b[1];
        r[2] = a[2] - b[2];
        return r;
    };

    /*
     * Function: V3.neg
     *
     * Perform
     * r = - a.
     *
     * Parameters:
     *
     *   a - the vector operand
     *   r - optional vector to store the result in
     *
     * Returns:
     *
     *   If r is specified, returns r after performing the operation.
     *   Otherwise, returns a new 3-element vector with the result.
     */
    V3.neg = function V3_neg(a, r) {
        //MathUtils_assert(a.length == 3, "a.length == 3");
        //MathUtils_assert(r == undefined || r.length == 3, "r == undefined || r.length == 3");

        if (r == undefined)
            r = new MJS_FLOAT_ARRAY_TYPE(3);
        r[0] = - a[0];
        r[1] = - a[1];
        r[2] = - a[2];
        return r;
    };

    /*
     * Function: V3.direction
     *
     * Perform
     * r = (a - b) / |a - b|.  The result is the normalized
     * direction from a to b.
     *
     * Parameters:
     *
     *   a - the first vector operand
     *   b - the second vector operand
     *   r - optional vector to store the result in
     *
     * Returns:
     *
     *   If r is specified, returns r after performing the operation.
     *   Otherwise, returns a new 3-element vector with the result.
     */
    V3.direction = function V3_direction(a, b, r) {
        //MathUtils_assert(a.length == 3, "a.length == 3");
        //MathUtils_assert(b.length == 3, "b.length == 3");
        //MathUtils_assert(r == undefined || r.length == 3, "r == undefined || r.length == 3");

        if (r == undefined)
            r = new MJS_FLOAT_ARRAY_TYPE(3);
        return V3.normalize(V3.sub(a, b, r), r);
    };

    /*
     * Function: V3.length
     *
     * Perform r = |a|.
     *
     * Parameters:
     *
     *   a - the vector operand
     *
     * Returns:
     *
     *   The length of the given vector.
     */
    V3.length = function V3_length(a) {
        //MathUtils_assert(a.length == 3, "a.length == 3");

        return Math.sqrt(a[0]*a[0] + a[1]*a[1] + a[2]*a[2]);
    };

    /*
     * Function: V3.lengthSquard
     *
     * Perform r = |a|*|a|.
     *
     * Parameters:
     *
     *   a - the vector operand
     *
     * Returns:
     *
     *   The square of the length of the given vector.
     */
    V3.lengthSquared = function V3_lengthSquared(a) {
        //MathUtils_assert(a.length == 3, "a.length == 3");

        return a[0]*a[0] + a[1]*a[1] + a[2]*a[2];
    };

    V3.distance = function V3_distance(a, b) {
        var dx = a[0] - b[0];
        var dy = a[1] - b[1];
        var dz = a[2] - b[2];
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    };

    V3.distanceSquared = function V3_distanceSquared(a) {
        var dx = a[0] - b[0];
        var dy = a[1] - b[1];
        var dz = a[2] - b[2];
        return dx * dx + dy * dy + dz * dz;
    };

    /*
     * Function: V3.normalize
     *
     * Perform r = a / |a|.
     *
     * Parameters:
     *
     *   a - the vector operand
     *   r - optional vector to store the result in
     *
     * Returns:
     *
     *   If r is specified, returns r after performing the operation.
     *   Otherwise, returns a new 3-element vector with the result.
     */
    V3.normalize = function V3_normalize(a, r) {
        //MathUtils_assert(a.length == 3, "a.length == 3");
        //MathUtils_assert(r == undefined || r.length == 3, "r == undefined || r.length == 3");

        if (r == undefined)
            r = new MJS_FLOAT_ARRAY_TYPE(3);
        var im = 1.0 / V3.length(a);
        r[0] = a[0] * im;
        r[1] = a[1] * im;
        r[2] = a[2] * im;
        return r;
    };

    /*
     * Function: V3.scale
     *
     * Perform r = k * a.
     *
     * Parameters:
     *
     *   a - the vector operand
     *   k - a scalar value
     *   r - optional vector to store the result in
     *
     * Returns:
     *
     *   If r is specified, returns r after performing the operation.
     *   Otherwise, returns a new 3-element vector with the result.
     */
    V3.scale = function V3_scale(k, a, r) {
        //MathUtils_assert(a.length == 3, "a.length == 3");
        //MathUtils_assert(r == undefined || r.length == 3, "r == undefined || r.length == 3");

        if (r == undefined)
            r = new MJS_FLOAT_ARRAY_TYPE(3);
        r[0] = a[0] * k;
        r[1] = a[1] * k;
        r[2] = a[2] * k;
        return r;
    };

    /*
     * Function: V3.dot
     *
     * Perform
     * r = dot(a, b).
     *
     * Parameters:
     *
     *   a - the first vector operand
     *   b - the second vector operand
     *
     * Returns:
     *
     *   The dot product of a and b.
     */
    V3.dot = function V3_dot(a, b) {
        //MathUtils_assert(a.length == 3, "a.length == 3");
        //MathUtils_assert(b.length == 3, "b.length == 3");

        return a[0] * b[0] +
            a[1] * b[1] +
            a[2] * b[2];
    };

    /*
     * Function: V3.cross
     *
     * Perform r = a x b.
     *
     * Parameters:
     *
     *   a - the first vector operand
     *   b - the second vector operand
     *   r - optional vector to store the result in
     *
     * Returns:
     *
     *   If r is specified, returns r after performing the operation.
     *   Otherwise, returns a new 3-element vector with the result.
     */
    V3.cross = function V3_cross(a, b, r) {
        //MathUtils_assert(a.length == 3, "a.length == 3");
        //MathUtils_assert(b.length == 3, "b.length == 3");
        //MathUtils_assert(r == undefined || r.length == 3, "r == undefined || r.length == 3");

        if (r == undefined)
            r = new MJS_FLOAT_ARRAY_TYPE(3);
        r[0] = a[1]*b[2] - a[2]*b[1];
        r[1] = a[2]*b[0] - a[0]*b[2];
        r[2] = a[0]*b[1] - a[1]*b[0];
        return r;
    };

    /*
     * Function: V3.mul4x4
     *
     * Perform
     * r = m * v.
     *
     * Parameters:
     *
     *   m - the 4x4 matrix operand
     *   v - the 3-element vector operand
     *   r - optional vector to store the result in
     *
     * Returns:
     *
     *   If r is specified, returns r after performing the operation.
     *   Otherwise, returns a new 3-element vector with the result.
     *   The 4-element result vector is divided by the w component
     *   and returned as a 3-element vector.
     */
    V3.mul4x4 = function V3_mul4x4(m, v, r) {
        //MathUtils_assert(m.length == 16, "m.length == 16");
        //MathUtils_assert(v.length == 3, "v.length == 3");
        //MathUtils_assert(r == undefined || r.length == 3, "r == undefined || r.length == 3");

        var w;
        var tmp = V3._temp1;
        if (r == undefined)
            r = new MJS_FLOAT_ARRAY_TYPE(3);
        tmp[0] = m[ 3];
        tmp[1] = m[ 7];
        tmp[2] = m[11];
        w    =  V3.dot(v, tmp) + m[15];
        tmp[0] = m[ 0];
        tmp[1] = m[ 4];
        tmp[2] = m[ 8];
        r[0] = (V3.dot(v, tmp) + m[12])/w;
        tmp[0] = m[ 1];
        tmp[1] = m[ 5];
        tmp[2] = m[ 9];
        r[1] = (V3.dot(v, tmp) + m[13])/w;
        tmp[0] = m[ 2];
        tmp[1] = m[ 6];
        tmp[2] = m[10];
        r[2] = (V3.dot(v, tmp) + m[14])/w;
        return r;
    };

    /*
     * Class: M4x4
     *
     * Methods for working with 4x4 matrices.  A matrix is represented by a 16-element array
     * in column-major order.  Any valid JavaScript array type may be used, but if new
     * matrices are created they are created using the configured MJS_FLOAT_ARRAY_TYPE.
     */

    var M4x4 = { };

    M4x4._temp1 = new MJS_FLOAT_ARRAY_TYPE(16);
    M4x4._temp2 = new MJS_FLOAT_ARRAY_TYPE(16);

    if (MJS_FLOAT_ARRAY_TYPE == Array) {
        M4x4.I = [1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
                0.0, 0.0, 1.0, 0.0,
                0.0, 0.0, 0.0, 1.0];

        M4x4.$ = function M4x4_$(m00, m01, m02, m03,
                m04, m05, m06, m07,
                m08, m09, m10, m11,
                m12, m13, m14, m15)
        {
            return [m00, m01, m02, m03,
            m04, m05, m06, m07,
            m08, m09, m10, m11,
            m12, m13, m14, m15];
        };
    } else {
        M4x4.I = new MJS_FLOAT_ARRAY_TYPE([1.0, 0.0, 0.0, 0.0,
                0.0, 1.0, 0.0, 0.0,
                0.0, 0.0, 1.0, 0.0,
                0.0, 0.0, 0.0, 1.0]);

        /*
         * Function: M4x4.$
         *
         * Creates a new 4x4 matrix with the given values.
         *
         * Parameters:
         *
         *   m00..m15 - the 16 elements of the new matrix.
         *
         * Returns:
         *
         * A new matrix filled with the given argument values.
         */
        M4x4.$ = function M4x4_$(m00, m01, m02, m03,
                m04, m05, m06, m07,
                m08, m09, m10, m11,
                m12, m13, m14, m15)
        {
            return new MJS_FLOAT_ARRAY_TYPE([m00, m01, m02, m03,
                    m04, m05, m06, m07,
                    m08, m09, m10, m11,
                    m12, m13, m14, m15]);
        };
    }

    M4x4.identity = M4x4.I;

    /*
     * Function: M4x4.topLeft3x3
     *
     * Return the top left 3x3 matrix from the given 4x4 matrix m.
     *
     * Parameters:
     *
     *   m - the matrix
     *   r - optional 3x3 matrix to store the result in
     *
     * Returns:
     *
     *   If r is specified, returns r after performing the operation.
     *   Otherwise, returns a new 3x3 matrix with the result.
     */
    M4x4.topLeft3x3 = function M4x4_topLeft3x3(m, r) {
        //MathUtils_assert(m.length == 16, "m.length == 16");
        //MathUtils_assert(r == undefined || r.length == 9, "r == undefined || r.length == 9");

        if (r == undefined)
            r = new MJS_FLOAT_ARRAY_TYPE(9);
        r[0] = m[0]; r[1] = m[1]; r[2] = m[2];
        r[3] = m[4]; r[4] = m[5]; r[5] = m[6];
        r[6] = m[8]; r[7] = m[9]; r[8] = m[10];
        return r;
    };

    /*
     * Function: M4x4.inverseOrthonormal
     *
     * Computes the inverse of the given matrix m, assuming that
     * the matrix is orthonormal.
     *
     * Parameters:
     *
     *   m - the matrix
     *   r - optional 4x4 matrix to store the result in
     *
     * Returns:
     *
     *   If r is specified, returns r after performing the operation.
     *   Otherwise, returns a new 4x4 matrix with the result.
     */
    M4x4.inverseOrthonormal = function M4x4_inverseOrthonormal(m, r) {
        //MathUtils_assert(m.length == 16, "m.length == 16");
        //MathUtils_assert(r == undefined || r.length == 16, "r == undefined || r.length == 16");
        //MathUtils_assert(m != r, "m != r");

        if (r == undefined)
            r = new MJS_FLOAT_ARRAY_TYPE(16);
        M4x4.transpose(m, r);
        var t = [m[12], m[13], m[14]];
        r[3] = r[7] = r[11] = 0;
        r[12] = -V3.dot([r[0], r[4], r[8]], t);
        r[13] = -V3.dot([r[1], r[5], r[9]], t);
        r[14] = -V3.dot([r[2], r[6], r[10]], t);
        return r;
    };

    /*
     * Function: M4x4.inverseTo3x3
     *
     * Computes the inverse of the given matrix m, but calculates
     * only the top left 3x3 values of the result.
     *
     * Parameters:
     *
     *   m - the matrix
     *   r - optional 3x3 matrix to store the result in
     *
     * Returns:
     *
     *   If r is specified, returns r after performing the operation.
     *   Otherwise, returns a new 3x3 matrix with the result.
     */
    M4x4.inverseTo3x3 = function M4x4_inverseTo3x3(m, r) {
        //MathUtils_assert(m.length == 16, "m.length == 16");
        //MathUtils_assert(r == undefined || r.length == 9, "r == undefined || r.length == 9");

        if (r == undefined)
            r = new MJS_FLOAT_ARRAY_TYPE(9);

        var a11 = m[10]*m[5]-m[6]*m[9],
            a21 = -m[10]*m[1]+m[2]*m[9],
            a31 = m[6]*m[1]-m[2]*m[5],
            a12 = -m[10]*m[4]+m[6]*m[8],
            a22 = m[10]*m[0]-m[2]*m[8],
            a32 = -m[6]*m[0]+m[2]*m[4],
            a13 = m[9]*m[4]-m[5]*m[8],
            a23 = -m[9]*m[0]+m[1]*m[8],
            a33 = m[5]*m[0]-m[1]*m[4];
        var det = m[0]*(a11) + m[1]*(a12) + m[2]*(a13);
        if (det == 0) // no inverse
            throw "matrix not invertible";
        var idet = 1.0 / det;

        r[0] = idet*a11;
        r[1] = idet*a21;
        r[2] = idet*a31;
        r[3] = idet*a12;
        r[4] = idet*a22;
        r[5] = idet*a32;
        r[6] = idet*a13;
        r[7] = idet*a23;
        r[8] = idet*a33;

        return r;
    };

    /*
     * Function: M4x4.makeFrustum
     *
     * Creates a matrix for a projection frustum with the given parameters.
     *
     * Parameters:
     *
     *   left - the left coordinate of the frustum
     *   right- the right coordinate of the frustum
     *   bottom - the bottom coordinate of the frustum
     *   top - the top coordinate of the frustum
     *   znear - the near z distance of the frustum
     *   zfar - the far z distance of the frustum
     *   r - optional 4x4 matrix to store the result in
     *
     * Returns:
     *
     *   If r is specified, returns r after creating the projection matrix.
     *   Otherwise, returns a new 4x4 matrix.
     */
    M4x4.makeFrustum = function M4x4_makeFrustum(left, right, bottom, top, znear, zfar, r) {
        //MathUtils_assert(r == undefined || r.length == 16, "r == undefined || r.length == 16");

        if (r == undefined)
            r = new MJS_FLOAT_ARRAY_TYPE(16);

        var X = 2*znear/(right-left);
        var Y = 2*znear/(top-bottom);
        var A = (right+left)/(right-left);
        var B = (top+bottom)/(top-bottom);
        var C = -(zfar+znear)/(zfar-znear);
        var D = -2*zfar*znear/(zfar-znear);

        r[0] = 2*znear/(right-left);
        r[1] = 0;
        r[2] = 0;
        r[3] = 0;
        r[4] = 0;
        r[5] = 2*znear/(top-bottom);
        r[6] = 0;
        r[7] = 0;
        r[8] = (right+left)/(right-left);
        r[9] = (top+bottom)/(top-bottom);
        r[10] = -(zfar+znear)/(zfar-znear);
        r[11] = -1;
        r[12] = 0;
        r[13] = 0;
        r[14] = -2*zfar*znear/(zfar-znear);
        r[15] = 0;

        return r;
    };

    /*
     * Function: M4x4.makePerspective
     *
     * Creates a matrix for a perspective projection with the given parameters.
     *
     * Parameters:
     *
     *   fovy - field of view in the y axis, in degrees
     *   aspect - aspect ratio
     *   znear - the near z distance of the projection
     *   zfar - the far z distance of the projection
     *   r - optional 4x4 matrix to store the result in
     *
     * Returns:
     *
     *   If r is specified, returns r after creating the projection matrix.
     *   Otherwise, returns a new 4x4 matrix.
     */
    M4x4.makePerspective = function M4x4_makePerspective (fovy, aspect, znear, zfar, r) {
        //MathUtils_assert(r == undefined || r.length == 16, "r == undefined || r.length == 16");

        var ymax = znear * Math.tan(fovy * Math.PI / 360.0);
        var ymin = -ymax;
        var xmin = ymin * aspect;
        var xmax = ymax * aspect;

        return M4x4.makeFrustum(xmin, xmax, ymin, ymax, znear, zfar, r);
    };

    /*
     * Function: M4x4.makeOrtho
     *
     * Creates a matrix for an orthogonal frustum projection with the given parameters.
     *
     * Parameters:
     *
     *   left - the left coordinate of the frustum
     *   right- the right coordinate of the frustum
     *   bottom - the bottom coordinate of the frustum
     *   top - the top coordinate of the frustum
     *   znear - the near z distance of the frustum
     *   zfar - the far z distance of the frustum
     *   r - optional 4x4 matrix to store the result in
     *
     * Returns:
     *
     *   If r is specified, returns r after creating the projection matrix.
     *   Otherwise, returns a new 4x4 matrix.
     */
    M4x4.makeOrtho = function M4x4_makeOrtho (left, right, bottom, top, znear, zfar, r) {
        //MathUtils_assert(r == undefined || r.length == 16, "r == undefined || r.length == 16");

        if (r == undefined)
            r = new MJS_FLOAT_ARRAY_TYPE(16);

        var tX = -(right+left)/(right-left);
        var tY = -(top+bottom)/(top-bottom);
        var tZ = -(zfar+znear)/(zfar-znear);
        var X = 2 / (right-left);
        var Y = 2 / (top-bottom);
        var Z = -2 / (zfar-znear);

        r[0] = 2 / (right-left);
        r[1] = 0;
        r[2] = 0;
        r[3] = 0;
        r[4] = 0;
        r[5] = 2 / (top-bottom);
        r[6] = 0;
        r[7] = 0;
        r[8] = 0;
        r[9] = 0;
        r[10] = -2 / (zfar-znear);
        r[11] = 0;
        r[12] = -(right+left)/(right-left);
        r[13] = -(top+bottom)/(top-bottom);
        r[14] = -(zfar+znear)/(zfar-znear);
        r[15] = 1;

        return r;
    };

    /*
     * Function: M4x4.makeOrtho2D
     *
     * Creates a matrix for a 2D orthogonal frustum projection with the given parameters.
     * znear and zfar are assumed to be -1 and 1, respectively.
     *
     * Parameters:
     *
     *   left - the left coordinate of the frustum
     *   right- the right coordinate of the frustum
     *   bottom - the bottom coordinate of the frustum
     *   top - the top coordinate of the frustum
     *   r - optional 4x4 matrix to store the result in
     *
     * Returns:
     *
     *   If r is specified, returns r after creating the projection matrix.
     *   Otherwise, returns a new 4x4 matrix.
     */
    M4x4.makeOrtho2D = function M4x4_makeOrtho2D (left, right, bottom, top, r) {
        //MathUtils_assert(r == undefined || r.length == 16, "r == undefined || r.length == 16");

        return M4x4.makeOrtho(left, right, bottom, top, -1, 1, r);
    };

    /*
     * Function: M4x4.mul
     *
     * Performs r = a * b.
     *
     * Parameters:
     *
     *   a - the first matrix operand
     *   b - the second matrix operand
     *   r - optional 4x4 matrix to store the result in
     *
     * Returns:
     *
     *   If r is specified, returns r after performing the operation.
     *   Otherwise, returns a new 4x4 matrix with the result.
     */
    M4x4.mul = function M4x4_mul(a, b, r) {
        //MathUtils_assert(a.length == 16, "a.length == 16");
        //MathUtils_assert(b.length == 16, "b.length == 16");
        //MathUtils_assert(r == undefined || r.length == 16, "r == undefined || r.length == 16");
        //MathUtils_assert(a != r && b != r, "a != r && b != r");

        if (r == undefined)
            r = new MJS_FLOAT_ARRAY_TYPE(16);

        var a11 = a[0];
        var a21 = a[1];
        var a31 = a[2];
        var a41 = a[3];
        var a12 = a[4];
        var a22 = a[5];
        var a32 = a[6];
        var a42 = a[7];
        var a13 = a[8];
        var a23 = a[9];
        var a33 = a[10];
        var a43 = a[11];
        var a14 = a[12];
        var a24 = a[13];
        var a34 = a[14];
        var a44 = a[15];

        var b11 = b[0];
        var b21 = b[1];
        var b31 = b[2];
        var b41 = b[3];
        var b12 = b[4];
        var b22 = b[5];
        var b32 = b[6];
        var b42 = b[7];
        var b13 = b[8];
        var b23 = b[9];
        var b33 = b[10];
        var b43 = b[11];
        var b14 = b[12];
        var b24 = b[13];
        var b34 = b[14];
        var b44 = b[15];

        r[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
        r[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
        r[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
        r[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
        r[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
        r[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
        r[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
        r[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
        r[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
        r[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
        r[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
        r[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
        r[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
        r[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
        r[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
        r[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

        return r;
    };

    /*
     * Function: M4x4.mulAffine
     *
     * Performs r = a * b, assuming a and b are affine (elements 3,7,11,15 = 0,0,0,1)
     *
     * Parameters:
     *
     *   a - the first matrix operand
     *   b - the second matrix operand
     *   r - optional 4x4 matrix to store the result in
     *
     * Returns:
     *
     *   If r is specified, returns r after performing the operation.
     *   Otherwise, returns a new 4x4 matrix with the result.
     */
    M4x4.mulAffine = function M4x4_mulAffine(a, b, r) {
        //MathUtils_assert(a.length == 16, "a.length == 16");
        //MathUtils_assert(b.length == 16, "b.length == 16");
        //MathUtils_assert(r == undefined || r.length == 16, "r == undefined || r.length == 16");
        //MathUtils_assert(a != r && b != r, "a != r && b != r");

        if (r == undefined)
            r = new MJS_FLOAT_ARRAY_TYPE(16);
        var a11 = a[0];
        var a21 = a[1];
        var a31 = a[2];
        var a12 = a[4];
        var a22 = a[5];
        var a32 = a[6];
        var a13 = a[8];
        var a23 = a[9];
        var a33 = a[10];
        var a14 = a[12];
        var a24 = a[13];
        var a34 = a[14];

        var b11 = b[0];
        var b21 = b[1];
        var b31 = b[2];
        var b12 = b[4];
        var b22 = b[5];
        var b32 = b[6];
        var b13 = b[8];
        var b23 = b[9];
        var b33 = b[10];
        var b14 = b[12];
        var b24 = b[13];
        var b34 = b[14];

        r[0] = a11 * b11 + a12 * b21 + a13 * b31;
        r[1] = a21 * b11 + a22 * b21 + a23 * b31;
        r[2] = a31 * b11 + a32 * b21 + a33 * b31;
        r[3] = 0;
        r[4] = a11 * b12 + a12 * b22 + a13 * b32;
        r[5] = a21 * b12 + a22 * b22 + a23 * b32;
        r[6] = a31 * b12 + a32 * b22 + a33 * b32;
        r[7] = 0;
        r[8] = a11 * b13 + a12 * b23 + a13 * b33;
        r[9] = a21 * b13 + a22 * b23 + a23 * b33;
        r[10] = a31 * b13 + a32 * b23 + a33 * b33;
        r[11] = 0;
        r[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14;
        r[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24;
        r[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34;
        r[15] = 1;

        return r;
    };

    /*
     * Function: M4x4.makeRotate
     *
     * Creates a transformation matrix for rotation by angle radians about the 3-element vector axis.
     *
     * Parameters:
     *
     *   angle - the angle of rotation, in radians
     *   axis - the axis around which the rotation is performed, a 3-element vector
     *   r - optional 4x4 matrix to store the result in
     *
     * Returns:
     *
     *   If r is specified, returns r after creating the matrix.
     *   Otherwise, returns a new 4x4 matrix with the result.
     */
    M4x4.makeRotate = function M4x4_makeRotate(angle, axis, r) {
        //MathUtils_assert(angle.length == 3, "angle.length == 3");
        //MathUtils_assert(axis.length == 3, "axis.length == 3");
        //MathUtils_assert(r == undefined || r.length == 16, "r == undefined || r.length == 16");

        if (r == undefined)
            r = new MJS_FLOAT_ARRAY_TYPE(16);

        axis = V3.normalize(axis, V3._temp1);
        var x = axis[0], y = axis[1], z = axis[2];
        var c = Math.cos(angle);
        var c1 = 1-c;
        var s = Math.sin(angle);

        r[0] = x*x*c1+c;
        r[1] = y*x*c1+z*s;
        r[2] = z*x*c1-y*s;
        r[3] = 0;
        r[4] = x*y*c1-z*s;
        r[5] = y*y*c1+c;
        r[6] = y*z*c1+x*s;
        r[7] = 0;
        r[8] = x*z*c1+y*s;
        r[9] = y*z*c1-x*s;
        r[10] = z*z*c1+c;
        r[11] = 0;
        r[12] = 0;
        r[13] = 0;
        r[14] = 0;
        r[15] = 1;

        return r;
    };

    /*
     * Function: M4x4.rotate
     *
     * Concatenates a rotation of angle radians about the axis to the give matrix m.
     *
     * Parameters:
     *
     *   angle - the angle of rotation, in radians
     *   axis - the axis around which the rotation is performed, a 3-element vector
     *   m - the matrix to concatenate the rotation to
     *   r - optional 4x4 matrix to store the result in
     *
     * Returns:
     *
     *   If r is specified, returns r after performing the operation.
     *   Otherwise, returns a new 4x4 matrix with the result.
     */
    M4x4.rotate = function M4x4_rotate(angle, axis, m, r) {
        //MathUtils_assert(angle.length == 3, "angle.length == 3");
        //MathUtils_assert(axis.length == 3, "axis.length == 3");
        //MathUtils_assert(m.length == 16, "m.length == 16");
        //MathUtils_assert(r == undefined || r.length == 16, "r == undefined || r.length == 16");

        if (r == undefined)
            r = new MJS_FLOAT_ARRAY_TYPE(16);
        var a0=axis [0], a1=axis [1], a2=axis [2];
        var l = Math.sqrt(a0*a0 + a1*a1 + a2*a2);
        var x = a0, y = a1, z = a2;
        if (l != 1.0) {
            var im = 1.0 / l;
            x *= im;
            y *= im;
            z *= im;
        }
        var c = Math.cos(angle);
        var c1 = 1-c;
        var s = Math.sin(angle);
        var xs = x*s;
        var ys = y*s;
        var zs = z*s;
        var xyc1 = x * y * c1;
        var xzc1 = x * z * c1;
        var yzc1 = y * z * c1;

        var m11 = m[0];
        var m21 = m[1];
        var m31 = m[2];
        var m41 = m[3];
        var m12 = m[4];
        var m22 = m[5];
        var m32 = m[6];
        var m42 = m[7];
        var m13 = m[8];
        var m23 = m[9];
        var m33 = m[10];
        var m43 = m[11];

        var t11 = x * x * c1 + c;
        var t21 = xyc1 + zs;
        var t31 = xzc1 - ys;
        var t12 = xyc1 - zs;
        var t22 = y * y * c1 + c;
        var t32 = yzc1 + xs;
        var t13 = xzc1 + ys;
        var t23 = yzc1 - xs;
        var t33 = z * z * c1 + c;

        r[0] = m11 * t11 + m12 * t21 + m13 * t31;
        r[1] = m21 * t11 + m22 * t21 + m23 * t31;
        r[2] = m31 * t11 + m32 * t21 + m33 * t31;
        r[3] = m41 * t11 + m42 * t21 + m43 * t31;
        r[4] = m11 * t12 + m12 * t22 + m13 * t32;
        r[5] = m21 * t12 + m22 * t22 + m23 * t32;
        r[6] = m31 * t12 + m32 * t22 + m33 * t32;
        r[7] = m41 * t12 + m42 * t22 + m43 * t32;
        r[8] = m11 * t13 + m12 * t23 + m13 * t33;
        r[9] = m21 * t13 + m22 * t23 + m23 * t33;
        r[10] = m31 * t13 + m32 * t23 + m33 * t33;
        r[11] = m41 * t13 + m42 * t23 + m43 * t33;
        if (r != m) {
            r[12] = m[12];
            r[13] = m[13];
            r[14] = m[14];
            r[15] = m[15];
        }
        return r;
    };

    /*
     * Function: M4x4.makeScale3
     *
     * Creates a transformation matrix for scaling by 3 scalar values, one for
     * each of the x, y, and z directions.
     *
     * Parameters:
     *
     *   x - the scale for the x axis
     *   y - the scale for the y axis
     *   z - the scale for the z axis
     *   r - optional 4x4 matrix to store the result in
     *
     * Returns:
     *
     *   If r is specified, returns r after creating the matrix.
     *   Otherwise, returns a new 4x4 matrix with the result.
     */
    M4x4.makeScale3 = function M4x4_makeScale3(x, y, z, r) {
        //MathUtils_assert(r == undefined || r.length == 16, "r == undefined || r.length == 16");

        if (r == undefined)
            r = new MJS_FLOAT_ARRAY_TYPE(16);

        r[0] = x;
        r[1] = 0;
        r[2] = 0;
        r[3] = 0;
        r[4] = 0;
        r[5] = y;
        r[6] = 0;
        r[7] = 0;
        r[8] = 0;
        r[9] = 0;
        r[10] = z;
        r[11] = 0;
        r[12] = 0;
        r[13] = 0;
        r[14] = 0;
        r[15] = 1;

        return r;
    };

    /*
     * Function: M4x4.makeScale1
     *
     * Creates a transformation matrix for a uniform scale by a single scalar value.
     *
     * Parameters:
     *
     *   k - the scale factor
     *   r - optional 4x4 matrix to store the result in
     *
     * Returns:
     *
     *   If r is specified, returns r after creating the matrix.
     *   Otherwise, returns a new 4x4 matrix with the result.
     */
    M4x4.makeScale1 = function M4x4_makeScale1(k, r) {
        //MathUtils_assert(r == undefined || r.length == 16, "r == undefined || r.length == 16");

        return M4x4.makeScale3(k, k, k, r);
    };

    /*
     * Function: M4x4.makeScale
     *
     * Creates a transformation matrix for scaling each of the x, y, and z axes by the amount
     * given in the corresponding element of the 3-element vector.
     *
     * Parameters:
     *
     *   v - the 3-element vector containing the scale factors
     *   r - optional 4x4 matrix to store the result in
     *
     * Returns:
     *
     *   If r is specified, returns r after creating the matrix.
     *   Otherwise, returns a new 4x4 matrix with the result.
     */
    M4x4.makeScale = function M4x4_makeScale(v, r) {
        //MathUtils_assert(v.length == 3, "v.length == 3");
        //MathUtils_assert(r == undefined || r.length == 16, "r == undefined || r.length == 16");

        return M4x4.makeScale3(v[0], v[1], v[2], r);
    };

    /*
     * Function: M4x4.scale3
     */
    M4x4.scale3 = function M4x4_scale3(x, y, z, m, r) {
        //MathUtils_assert(m.length == 16, "m.length == 16");
        //MathUtils_assert(r == undefined || r.length == 16, "r == undefined || r.length == 16");

        if (r == m) {
            m[0] *= x;
            m[1] *= x;
            m[2] *= x;
            m[3] *= x;
            m[4] *= y;
            m[5] *= y;
            m[6] *= y;
            m[7] *= y;
            m[8] *= z;
            m[9] *= z;
            m[10] *= z;
            m[11] *= z;
            return m;
        }

        if (r == undefined)
            r = new MJS_FLOAT_ARRAY_TYPE(16);

        r[0] = m[0] * x;
        r[1] = m[1] * x;
        r[2] = m[2] * x;
        r[3] = m[3] * x;
        r[4] = m[4] * y;
        r[5] = m[5] * y;
        r[6] = m[6] * y;
        r[7] = m[7] * y;
        r[8] = m[8] * z;
        r[9] = m[9] * z;
        r[10] = m[10] * z;
        r[11] = m[11] * z;
        r[12] = m[12];
        r[13] = m[13];
        r[14] = m[14];
        r[15] = m[15];

        return r;
    };

    /*
     * Function: M4x4.scale1
     */
    M4x4.scale1 = function M4x4_scale1(k, m, r) {
        //MathUtils_assert(m.length == 16, "m.length == 16");
        //MathUtils_assert(r == undefined || r.length == 16, "r == undefined || r.length == 16");
        if (r == m) {
            m[0] *= k;
            m[1] *= k;
            m[2] *= k;
            m[3] *= k;
            m[4] *= k;
            m[5] *= k;
            m[6] *= k;
            m[7] *= k;
            m[8] *= k;
            m[9] *= k;
            m[10] *= k;
            m[11] *= k;
            return m;
        }


        if (r == undefined)
            r = new MJS_FLOAT_ARRAY_TYPE(16);

        r[0] = m[0] * k;
        r[1] = m[1] * k;
        r[2] = m[2] * k;
        r[3] = m[3] * k;
        r[4] = m[4] * k;
        r[5] = m[5] * k;
        r[6] = m[6] * k;
        r[7] = m[7] * k;
        r[8] = m[8] * k;
        r[9] = m[9] * k;
        r[10] = m[10] * k;
        r[11] = m[11] * k;
        r[12] = m[12];
        r[13] = m[13];
        r[14] = m[14];
        r[15] = m[15];

        return r;
    };

    /*
     * Function: M4x4.scale1
     */
    M4x4.scale = function M4x4_scale(v, m, r) {
        //MathUtils_assert(v.length == 3, "v.length == 3");
        //MathUtils_assert(m.length == 16, "m.length == 16");
        //MathUtils_assert(r == undefined || r.length == 16, "r == undefined || r.length == 16");
        var x = v[0], y = v[1], z = v[2];

        if (r == m) {
            m[0] *= x;
            m[1] *= x;
            m[2] *= x;
            m[3] *= x;
            m[4] *= y;
            m[5] *= y;
            m[6] *= y;
            m[7] *= y;
            m[8] *= z;
            m[9] *= z;
            m[10] *= z;
            m[11] *= z;
            return m;
        }

        if (r == undefined)
            r = new MJS_FLOAT_ARRAY_TYPE(16);


        r[0] = m[0] * x;
        r[1] = m[1] * x;
        r[2] = m[2] * x;
        r[3] = m[3] * x;
        r[4] = m[4] * y;
        r[5] = m[5] * y;
        r[6] = m[6] * y;
        r[7] = m[7] * y;
        r[8] = m[8] * z;
        r[9] = m[9] * z;
        r[10] = m[10] * z;
        r[11] = m[11] * z;
        r[12] = m[12];
        r[13] = m[13];
        r[14] = m[14];
        r[15] = m[15];

        return r;
    };

    /*
     * Function: M4x4.makeTranslate3
     */
    M4x4.makeTranslate3 = function M4x4_makeTranslate3(x, y, z, r) {
        //MathUtils_assert(r == undefined || r.length == 16, "r == undefined || r.length == 16");

        if (r == undefined)
            r = new MJS_FLOAT_ARRAY_TYPE(16);

        r[0] = 1;
        r[1] = 0;
        r[2] = 0;
        r[3] = 0;
        r[4] = 0;
        r[5] = 1;
        r[6] = 0;
        r[7] = 0;
        r[8] = 0;
        r[9] = 0;
        r[10] = 1;
        r[11] = 0;
        r[12] = x;
        r[13] = y;
        r[14] = z;
        r[15] = 1;

        return r;
    };

    /*
     * Function: M4x4.makeTranslate1
     */
    M4x4.makeTranslate1 = function M4x4_makeTranslate1 (k, r) {
        //MathUtils_assert(r == undefined || r.length == 16, "r == undefined || r.length == 16");

        return M4x4.makeTranslate3(k, k, k, r);
    };

    /*
     * Function: M4x4.makeTranslate
     */
    M4x4.makeTranslate = function M4x4_makeTranslate (v, r) {
        //MathUtils_assert(v.length == 3, "v.length == 3");
        //MathUtils_assert(r == undefined || r.length == 16, "r == undefined || r.length == 16");

        return M4x4.makeTranslate3(v[0], v[1], v[2], r);
    };

    /*
     * Function: M4x4.translate3Self
     */
    M4x4.translate3Self = function M4x4_translate3Self (x, y, z, m) {
        //MathUtils_assert(m.length == 16, "m.length == 16");
        //MathUtils_assert(r == undefined || r.length == 16, "r == undefined || r.length == 16");
        m[12] += m[0] * x + m[4] * y + m[8] * z;
        m[13] += m[1] * x + m[5] * y + m[9] * z;
        m[14] += m[2] * x + m[6] * y + m[10] * z;
        m[15] += m[3] * x + m[7] * y + m[11] * z;
        return m;
    };

    /*
     * Function: M4x4.translate3
     */
    M4x4.translate3 = function M4x4_translate3 (x, y, z, m, r) {
        //MathUtils_assert(m.length == 16, "m.length == 16");
        //MathUtils_assert(r == undefined || r.length == 16, "r == undefined || r.length == 16");

        if (r == m) {
            m[12] += m[0] * x + m[4] * y + m[8] * z;
            m[13] += m[1] * x + m[5] * y + m[9] * z;
            m[14] += m[2] * x + m[6] * y + m[10] * z;
            m[15] += m[3] * x + m[7] * y + m[11] * z;
            return m;
        }

        if (r == undefined)
            r = new MJS_FLOAT_ARRAY_TYPE(16);

        var m11 = m[0];
        var m21 = m[1];
        var m31 = m[2];
        var m41 = m[3];
        var m12 = m[4];
        var m22 = m[5];
        var m32 = m[6];
        var m42 = m[7];
        var m13 = m[8];
        var m23 = m[9];
        var m33 = m[10];
        var m43 = m[11];


        r[0] = m11;
        r[1] = m21;
        r[2] = m31;
        r[3] = m41;
        r[4] = m12;
        r[5] = m22;
        r[6] = m32;
        r[7] = m42;
        r[8] = m13;
        r[9] = m23;
        r[10] = m33;
        r[11] = m43;
        r[12] = m11 * x + m12 * y + m13 * z + m[12];
        r[13] = m21 * x + m22 * y + m23 * z + m[13];
        r[14] = m31 * x + m32 * y + m33 * z + m[14];
        r[15] = m41 * x + m42 * y + m43 * z + m[15];

        return r;
    };

    /*
     * Function: M4x4.translate1
     */
    M4x4.translate1 = function M4x4_translate1 (k, m, r) {
        //MathUtils_assert(m.length == 16, "m.length == 16");
        //MathUtils_assert(r == undefined || r.length == 16, "r == undefined || r.length == 16");

        return M4x4.translate3(k, k, k, m, r);
    };
    /*
     * Function: M4x4.translateSelf
     */
    M4x4.translateSelf = function M4x4_translateSelf (v, m) {
        //MathUtils_assert(v.length == 3, "v.length == 3");
        //MathUtils_assert(m.length == 16, "m.length == 16");
        var x=v[0], y=v[1], z=v[2];
        m[12] += m[0] * x + m[4] * y + m[8] * z;
        m[13] += m[1] * x + m[5] * y + m[9] * z;
        m[14] += m[2] * x + m[6] * y + m[10] * z;
        m[15] += m[3] * x + m[7] * y + m[11] * z;
        return m;
    };
    /*
     * Function: M4x4.translate
     */
    M4x4.translate = function M4x4_translate (v, m, r) {
        //MathUtils_assert(v.length == 3, "v.length == 3");
        //MathUtils_assert(m.length == 16, "m.length == 16");
        //MathUtils_assert(r == undefined || r.length == 16, "r == undefined || r.length == 16");
        var x=v[0], y=v[1], z=v[2];
        if (r == m) {
            m[12] += m[0] * x + m[4] * y + m[8] * z;
            m[13] += m[1] * x + m[5] * y + m[9] * z;
            m[14] += m[2] * x + m[6] * y + m[10] * z;
            m[15] += m[3] * x + m[7] * y + m[11] * z;
            return m;
        }

        if (r == undefined)
            r = new MJS_FLOAT_ARRAY_TYPE(16);

        var m11 = m[0];
        var m21 = m[1];
        var m31 = m[2];
        var m41 = m[3];
        var m12 = m[4];
        var m22 = m[5];
        var m32 = m[6];
        var m42 = m[7];
        var m13 = m[8];
        var m23 = m[9];
        var m33 = m[10];
        var m43 = m[11];

        r[0] = m11;
        r[1] = m21;
        r[2] = m31;
        r[3] = m41;
        r[4] = m12;
        r[5] = m22;
        r[6] = m32;
        r[7] = m42;
        r[8] = m13;
        r[9] = m23;
        r[10] = m33;
        r[11] = m43;
        r[12] = m11 * x + m12 * y + m13 * z + m[12];
        r[13] = m21 * x + m22 * y + m23 * z + m[13];
        r[14] = m31 * x + m32 * y + m33 * z + m[14];
        r[15] = m41 * x + m42 * y + m43 * z + m[15];

        return r;
    };

    /*
     * Function: M4x4.makeLookAt
     */
    M4x4.makeLookAt = function M4x4_makeLookAt (eye, center, up, r) {
        //MathUtils_assert(eye.length == 3, "eye.length == 3");
        //MathUtils_assert(center.length == 3, "center.length == 3");
        //MathUtils_assert(up.length == 3, "up.length == 3");
        //MathUtils_assert(r == undefined || r.length == 16, "r == undefined || r.length == 16");

        var z = V3.direction(eye, center, V3._temp1);
        var x = V3.normalize(V3.cross(up, z, V3._temp2), V3._temp2);
        var y = V3.normalize(V3.cross(z, x, V3._temp3), V3._temp3);

        var tm1 = M4x4._temp1;
        var tm2 = M4x4._temp2;

        tm1[0] = x[0];
        tm1[1] = y[0];
        tm1[2] = z[0];
        tm1[3] = 0;
        tm1[4] = x[1];
        tm1[5] = y[1];
        tm1[6] = z[1];
        tm1[7] = 0;
        tm1[8] = x[2];
        tm1[9] = y[2];
        tm1[10] = z[2];
        tm1[11] = 0;
        tm1[12] = 0;
        tm1[13] = 0;
        tm1[14] = 0;
        tm1[15] = 1;

        tm2[0] = 1; tm2[1] = 0; tm2[2] = 0; tm2[3] = 0;
        tm2[4] = 0; tm2[5] = 1; tm2[6] = 0; tm2[7] = 0;
        tm2[8] = 0; tm2[9] = 0; tm2[10] = 1; tm2[11] = 0;
        tm2[12] = -eye[0]; tm2[13] = -eye[1]; tm2[14] = -eye[2]; tm2[15] = 1;

        if (r == undefined)
            r = new MJS_FLOAT_ARRAY_TYPE(16);
        return M4x4.mul(tm1, tm2, r);
    };

    /*
     * Function: M4x4.transposeSelf
     */
    M4x4.transposeSelf = function M4x4_transposeSelf (m) {
        //MathUtils_assert(m.length == 16, "m.length == 16");
        var tmp = m[1]; m[1] = m[4]; m[4] = tmp;
        tmp = m[2]; m[2] = m[8]; m[8] = tmp;
        tmp = m[3]; m[3] = m[12]; m[12] = tmp;
        tmp = m[6]; m[6] = m[9]; m[9] = tmp;
        tmp = m[7]; m[7] = m[13]; m[13] = tmp;
        tmp = m[11]; m[11] = m[14]; m[14] = tmp;
        return m;
    };
    /*
     * Function: M4x4.transpose
     */
    M4x4.transpose = function M4x4_transpose (m, r) {
        //MathUtils_assert(m.length == 16, "m.length == 16");
        //MathUtils_assert(r == undefined || r.length == 16, "r == undefined || r.length == 16");

        if (m == r) {
            var tmp = 0.0;
            tmp = m[1]; m[1] = m[4]; m[4] = tmp;
            tmp = m[2]; m[2] = m[8]; m[8] = tmp;
            tmp = m[3]; m[3] = m[12]; m[12] = tmp;
            tmp = m[6]; m[6] = m[9]; m[9] = tmp;
            tmp = m[7]; m[7] = m[13]; m[13] = tmp;
            tmp = m[11]; m[11] = m[14]; m[14] = tmp;
            return m;
        }

        if (r == undefined)
            r = new MJS_FLOAT_ARRAY_TYPE(16);

        r[0] = m[0]; r[1] = m[4]; r[2] = m[8]; r[3] = m[12];
        r[4] = m[1]; r[5] = m[5]; r[6] = m[9]; r[7] = m[13];
        r[8] = m[2]; r[9] = m[6]; r[10] = m[10]; r[11] = m[14];
        r[12] = m[3]; r[13] = m[7]; r[14] = m[11]; r[15] = m[15];

        return r;
    };


    /*
     * Function: M4x4.transformPoint
     */
    M4x4.transformPoint = function M4x4_transformPoint (m, v, r) {
        //MathUtils_assert(m.length == 16, "m.length == 16");
        //MathUtils_assert(v.length == 3, "v.length == 3");
        //MathUtils_assert(r == undefined || r.length == 3, "r == undefined || r.length == 3");
        if (r == undefined)
            r = new MJS_FLOAT_ARRAY_TYPE(3);

        var v0 = v[0], v1 = v[1], v2 = v[2];

        r[0] = m[0] * v0 + m[4] * v1 + m[8] * v2 + m[12];
        r[1] = m[1] * v0 + m[5] * v1 + m[9] * v2 + m[13];
        r[2] = m[2] * v0 + m[6] * v1 + m[10] * v2 + m[14];
        var w = m[3] * v0 + m[7] * v1 + m[11] * v2 + m[15];

        if (w != 1.0) {
            r[0] /= w;
            r[1] /= w;
            r[2] /= w;
        }

        return r;
    };

    /*
     * Function: M4x4.transformLine
     */
    M4x4.transformLine = function M4x4_transformLine(m, v, r) {
        //MathUtils_assert(m.length == 16, "m.length == 16");
        //MathUtils_assert(v.length == 3, "v.length == 3");
        //MathUtils_assert(r == undefined || r.length == 3, "r == undefined || r.length == 3");
        if (r == undefined)
            r = new MJS_FLOAT_ARRAY_TYPE(3);

        var v0 = v[0], v1 = v[1], v2 = v[2];
        r[0] = m[0] * v0 + m[4] * v1 + m[8] * v2;
        r[1] = m[1] * v0 + m[5] * v1 + m[9] * v2;
        r[2] = m[2] * v0 + m[6] * v1 + m[10] * v2;
        var w = m[3] * v0 + m[7] * v1 + m[11] * v2;

        if (w != 1.0) {
            r[0] /= w;
            r[1] /= w;
            r[2] /= w;
        }

        return r;
    };


    /*
     * Function: M4x4.transformPointAffine
     */
    M4x4.transformPointAffine = function M4x4_transformPointAffine (m, v, r) {
        //MathUtils_assert(m.length == 16, "m.length == 16");
        //MathUtils_assert(v.length == 3, "v.length == 3");
        //MathUtils_assert(r == undefined || r.length == 3, "r == undefined || r.length == 3");
        if (r == undefined)
            r = new MJS_FLOAT_ARRAY_TYPE(3);

        var v0 = v[0], v1 = v[1], v2 = v[2];

        r[0] = m[0] * v0 + m[4] * v1 + m[8] * v2 + m[12];
        r[1] = m[1] * v0 + m[5] * v1 + m[9] * v2 + m[13];
        r[2] = m[2] * v0 + m[6] * v1 + m[10] * v2 + m[14];

        return r;
    };

    /*
     * Function: M4x4.transformLineAffine
     */
    M4x4.transformLineAffine = function M4x4_transformLineAffine(m, v, r) {
        //MathUtils_assert(m.length == 16, "m.length == 16");
        //MathUtils_assert(v.length == 3, "v.length == 3");
        //MathUtils_assert(r == undefined || r.length == 3, "r == undefined || r.length == 3");
        if (r == undefined)
            r = new MJS_FLOAT_ARRAY_TYPE(3);

        var v0 = v[0], v1 = v[1], v2 = v[2];
        r[0] = m[0] * v0 + m[4] * v1 + m[8] * v2;
        r[1] = m[1] * v0 + m[5] * v1 + m[9] * v2;
        r[2] = m[2] * v0 + m[6] * v1 + m[10] * v2;

        return r;
    };

    M4x4.makeBasis = function M4x4_makeBasis(vx,vy,vz) {
        
        var r = new MJS_FLOAT_ARRAY_TYPE(16);

        r[0] = vx[0];
        r[1] = vx[1];
        r[2] = vx[2];
        r[3] = 0;
        r[4] = vy[0];
        r[5] = vy[1];
        r[6] = vy[2];
        r[7] = 0;
        r[8] = vz[0];
        r[9] = vz[1];
        r[10] = vz[2];
        r[11] = 0;
        r[12] = 0;
        r[13] = 0;
        r[14] = 0;
        r[15] = 1;

        return r;

    };

    return { 
        vec3: F3(V3.$),
        v3getX: V3.getX,
        v3getY: V3.getY,
        v3getZ: V3.getZ,
        v3setX: F2(V3.setX),
        v3setY: F2(V3.setY),
        v3setZ: F2(V3.setZ),
        toTuple3: V3.toTuple3,
        toRecord3: V3.toRecord3,
        fromTuple3: V3.fromTuple3,
        fromRecord3: V3.fromRecord3,
        v3add: F2(V3.add),
        v3sub: F2(V3.sub),
        v3neg: V3.neg,
        v3direction: F2(V3.direction),
        v3length: V3.length,
        v3lengthSquared: V3.lengthSquared,
        v3distance: F2(V3.distance),
        v3distanceSquared: F2(V3.distanceSquared),
        v3normalize: V3.normalize,
        v3scale: F2(V3.scale),
        v3dot: F2(V3.dot),
        v3cross: F2(V3.cross),
        v3mul4x4: F2(V3.mul4x4),
        m4x4identity: M4x4.identity,
        m4x4topLeft3x3: M4x4.topLeft3x3,
        m4x4inverseOrthonormal: M4x4.inverseOrthonormal,
        m4x4inverseTo3x3: M4x4.inverseTo3x3,
        m4x4makeFrustum: F6(M4x4.makeFrustum),
        m4x4makePerspective: F4(M4x4.makePerspective),
        m4x4makeOrtho: F6(M4x4.makeOrtho),
        m4x4makeOrtho2D: F4(M4x4.makeOrtho2D),
        m4x4mul: F2(M4x4.mul),
        m4x4Affine: F2(M4x4.mulAffine),
        m4x4makeRotate: F2(M4x4.makeRotate),
        m4x4rotate: F3(M4x4.rotate),
        m4x4makeScale3: F3(M4x4.makeScale3),
        m4x4makeScale1: M4x4.makeScale1,
        m4x4makeScale: M4x4.makeScale,
        m4x4scale3: F4(M4x4.scale3),
        m4x4scale: F2(M4x4.scale),
        m4x4makeTranslate3: F3(M4x4.makeTranslate3),
        m4x4makeTranslate: M4x4.makeTranslate,
        m4x4translate3: F4(M4x4.translate3),
        m4x4translate: F2(M4x4.translate),
        m4x4makeLookAt: F3(M4x4.makeLookAt),
        m4x4transpose: M4x4.transpose,
        m4x4transformPoint: F2(M4x4.transformPoint),
        m4x4makeBasis: F3(M4x4.makeBasis)
    };

}

/*
 * Copyright (c) 2010 Mozilla Corporation
 * Copyright (c) 2010 Vladimir Vukicevic
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

/*
 * File: mjs
 *
 * Vector and Matrix math utilities for JavaScript, optimized for WebGL.
 * Edited to work with the Elm Programming Language
 */

Elm.Native.Math = Elm.Native.Math || {};
Elm.Native.Math.Vector4 = {};
Elm.Native.Math.Vector4.make = function(elm) {

    elm.Native = elm.Native || {};
    elm.Native.Math = elm.Native.Math || {};
    elm.Native.Math.Vector4 = elm.Native.Math.Vector4 || {};
    if (elm.Native.Math.Vector4.values) return elm.Native.Math.Vector4.values;

    var MJS_FLOAT_ARRAY_TYPE = Float32Array;

    var V4 = { };

    if (MJS_FLOAT_ARRAY_TYPE == Array) {
        V4.$ = function V4_$(x, y, z, w) {
            return [x, y, z, w];
        };
    } else {
        V4.$ = function V4_$(x, y, z, w) {
            return new MJS_FLOAT_ARRAY_TYPE([x, y, z, w]);
        };
    }

    V4.getX = function V4_getX(a) {
        return a[0];
    }
    V4.getY = function V4_getY(a) {
        return a[1];
    }
    V4.getZ = function V4_getZ(a) {
        return a[2];
    }
    V4.getW = function V4_getW(a) {
        return a[3];
    }
    V4.setX = function V4_setX(x, a) {
        return new MJS_FLOAT_ARRAY_TYPE(x, a[1], a[2], a[3]);
    }
    V4.setY = function V4_setY(y, a) {
        return new MJS_FLOAT_ARRAY_TYPE(a[0], y, a[2], a[3]);
    }
    V4.setZ = function V4_setZ(z, a) {
        return new MJS_FLOAT_ARRAY_TYPE(a[0], a[1], z, a[3]);
    }
    V4.setW = function V4_setW(w, a) {
        return new MJS_FLOAT_ARRAY_TYPE(a[0], a[1], a[2], w);
    }

    V4.toTuple = function V4_toTuple(a) {
        return {
            ctor:"_Tuple4",
            _0:a[0],
            _1:a[1],
            _2:a[2],
            _3:a[3]
        };
    };
    V4.fromTuple = function V4_fromTuple(t) {
        return new MJS_FLOAT_ARRAY_TYPE([t._0, t._1, t._2, t._3]);
    };

    V4.toRecord = function V4_toRecord(a) {
        return {
            _:{},
            x:a[0],
            y:a[1],
            z:a[2],
            w:a[3]
        };
    };
    V4.fromRecord = function V4_fromRecord(r) {
        return new MJS_FLOAT_ARRAY_TYPE([r.x, r.y, r.z, r.w]);
    };

    V4.add = function V4_add(a, b) {
        var r = new MJS_FLOAT_ARRAY_TYPE(4);
        r[0] = a[0] + b[0];
        r[1] = a[1] + b[1];
        r[2] = a[2] + b[2];
        r[3] = a[3] + b[3];
        return r;
    };

    V4.sub = function V4_sub(a, b) {
        var r = new MJS_FLOAT_ARRAY_TYPE(4);
        r[0] = a[0] - b[0];
        r[1] = a[1] - b[1];
        r[2] = a[2] - b[2];
        r[3] = a[3] - b[3];
        return r;
    };

    V4.neg = function V4_neg(a) {
        var r = new MJS_FLOAT_ARRAY_TYPE(4);
        r[0] = - a[0];
        r[1] = - a[1];
        r[2] = - a[2];
        r[3] = - a[3];
        return r;
    };

    V4.direction = function V4_direction(a, b) {
        var r = new MJS_FLOAT_ARRAY_TYPE(4);
        r[0] = a[0] - b[0];
        r[1] = a[1] - b[1];
        r[2] = a[2] - b[2];
        r[3] = a[3] - b[3];
        var im = 1.0 / V4.length(r);
        r[0] = r[0] * im;
        r[1] = r[1] * im;
        r[2] = r[2] * im;
        r[3] = r[3] * im;
        return r;
    };

    V4.length = function V4_length(a) {
        return Math.sqrt(a[0]*a[0] + a[1]*a[1] + a[2]*a[2] + a[3]*a[3]);
    };

    V4.lengthSquared = function V4_lengthSquared(a) {
        return a[0]*a[0] + a[1]*a[1] + a[2]*a[2] + a[3]*a[3];
    };

    V4.distance = function V4_distance(a, b) {
        var dx = a[0] - b[0];
        var dy = a[1] - b[1];
        var dz = a[2] - b[2];
        var dw = a[3] - b[3];
        return Math.sqrt(dx * dx + dy * dy + dz * dz + dw * dw);
    };

    V4.distanceSquared = function V4_distanceSquared(a) {
        var dx = a[0] - b[0];
        var dy = a[1] - b[1];
        var dz = a[2] - b[2];
        var dw = a[3] - b[3];
        return dx * dx + dy * dy + dz * dz + dw * dw;
    };

    V4.normalize = function V4_normalize(a) {
        var r = new MJS_FLOAT_ARRAY_TYPE(4);
        var im = 1.0 / V4.length(a);
        r[0] = a[0] * im;
        r[1] = a[1] * im;
        r[2] = a[2] * im;
        r[3] = a[3] * im;
        return r;
    };

    V4.scale = function V4_scale(k, a) {
        var r = new MJS_FLOAT_ARRAY_TYPE(4);
        r[0] = a[0] * k;
        r[1] = a[1] * k;
        r[2] = a[2] * k;
        r[3] = a[3] * k;
        return r;
    };

    V4.dot = function V4_dot(a, b) {
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
    };

    return { 
        vec4: F4(V4.$),
        getX: V4.getX,
        getY: V4.getY,
        getZ: V4.getZ,
        getW: V4.getW,
        setX: F2(V4.setX),
        setY: F2(V4.setY),
        setZ: F2(V4.setZ),
        setW: F2(V4.setW),
        toTuple: V4.toTuple,
        toRecord: V4.toRecord,
        fromTuple: V4.fromTuple,
        fromRecord: V4.fromRecord,
        add: F2(V4.add),
        sub: F2(V4.sub),
        neg: V4.neg,
        direction: F2(V4.direction),
        length: V4.length,
        lengthSquared: V4.lengthSquared,
        distance: F2(V4.distance),
        distanceSquared: F2(V4.distanceSquared),
        normalize: V4.normalize,
        scale: F2(V4.scale),
        dot: F2(V4.dot)
    };

}

/*
 * Copyright (c) 2010 Mozilla Corporation
 * Copyright (c) 2010 Vladimir Vukicevic
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

/*
 * File: mjs
 *
 * Vector and Matrix math utilities for JavaScript, optimized for WebGL.
 * Edited to work with the Elm Programming Language
 */

Elm.Native.Math = Elm.Native.Math || {};
Elm.Native.Math.Vector2 = {};
Elm.Native.Math.Vector2.make = function(elm) {

    elm.Native = elm.Native || {};
    elm.Native.Math = elm.Native.Math || {};
    elm.Native.Math.Vector2 = elm.Native.Math.Vector2 || {};
    if (elm.Native.Math.Vector2.values) return elm.Native.Math.Vector2.values;

    var MJS_FLOAT_ARRAY_TYPE = Float32Array;

    var V2 = { };

    if (MJS_FLOAT_ARRAY_TYPE == Array) {
        V2.$ = function V2_$(x, y) {
            return [x, y];
        };
    } else {
        V2.$ = function V2_$(x, y) {
            return new MJS_FLOAT_ARRAY_TYPE([x, y]);
        };
    }

    V2.getX = function V2_getX(a) {
        return a[0];
    }
    V2.getY = function V2_getY(a) {
        return a[1];
    }
    V2.setX = function V2_setX(x, a) {
        return new MJS_FLOAT_ARRAY_TYPE(x, a[1]);
    }
    V2.setY = function V2_setY(y, a) {
        return new MJS_FLOAT_ARRAY_TYPE(a[0], y);
    }

    V2.toTuple = function V2_toTuple(a) {
        return {
            ctor:"_Tuple2",
            _0:a[0],
            _1:a[1]
        };
    };
    V2.fromTuple = function V2_fromTuple(t) {
        return new MJS_FLOAT_ARRAY_TYPE([t._0, t._1]);
    };

    V2.toRecord = function V2_toRecord(a) {
        return {
            _:{},
            x:a[0],
            y:a[1]
        };
    };
    V2.fromRecord = function V2_fromRecord(r) {
        return new MJS_FLOAT_ARRAY_TYPE([r.x, r.y]);
    };

    V2.add = function V2_add(a, b) {
        var r = new MJS_FLOAT_ARRAY_TYPE(2);
        r[0] = a[0] + b[0];
        r[1] = a[1] + b[1];
        return r;
    };

    V2.sub = function V2_sub(a, b) {
        var r = new MJS_FLOAT_ARRAY_TYPE(2);
        r[0] = a[0] - b[0];
        r[1] = a[1] - b[1];
        return r;
    };

    V2.neg = function V2_neg(a) {
        var r = new MJS_FLOAT_ARRAY_TYPE(2);
        r[0] = - a[0];
        r[1] = - a[1];
        return r;
    };

    V2.direction = function V2_direction(a, b) {
        var r = new MJS_FLOAT_ARRAY_TYPE(2);
        r[0] = a[0] - b[0];
        r[1] = a[1] - b[1];
        var im = 1.0 / V2.length(r);
        r[0] = r[0] * im;
        r[1] = r[1] * im;
        return r;
    };

    V2.length = function V2_length(a) {
        return Math.sqrt(a[0]*a[0] + a[1]*a[1]);
    };

    V2.lengthSquared = function V2_lengthSquared(a) {
        return a[0]*a[0] + a[1]*a[1];
    };

    V2.distance = function V2_distance(a, b) {
        var dx = a[0] - b[0];
        var dy = a[1] - b[1];
        return Math.sqrt(dx * dx + dy * dy);
    };

    V2.distanceSquared = function V2_distanceSquared(a) {
        var dx = a[0] - b[0];
        var dy = a[1] - b[1];
        return dx * dx + dy * dy;
    };

    V2.normalize = function V2_normalize(a) {
        var r = new MJS_FLOAT_ARRAY_TYPE(2);
        var im = 1.0 / V2.length(a);
        r[0] = a[0] * im;
        r[1] = a[1] * im;
        return r;
    };

    V2.scale = function V2_scale(k, a) {
        var r = new MJS_FLOAT_ARRAY_TYPE(2);
        r[0] = a[0] * k;
        r[1] = a[1] * k;
        return r;
    };

    V2.dot = function V2_dot(a, b) {
        return a[0] * b[0] + a[1] * b[1];
    };

    return { 
        vec2: F2(V2.$),
        getX: V2.getX,
        getY: V2.getY,
        setX: F2(V2.setX),
        setY: F2(V2.setY),
        toTuple: V2.toTuple,
        toRecord: V2.toRecord,
        fromTuple: V2.fromTuple,
        fromRecord: V2.fromRecord,
        add: F2(V2.add),
        sub: F2(V2.sub),
        neg: V2.neg,
        direction: F2(V2.direction),
        length: V2.length,
        lengthSquared: V2.lengthSquared,
        distance: F2(V2.distance),
        distanceSquared: F2(V2.distanceSquared),
        normalize: V2.normalize,
        scale: F2(V2.scale),
        dot: F2(V2.dot)
    };

}
Elm.Native.Graphics.WebGL = {};
Elm.Native.Graphics.WebGL.make = function(elm) {

  // LOG LEVEL

  elm.Native = elm.Native || {};
  elm.Native.Graphics = elm.Native.Graphics || {};
  elm.Native.Graphics.WebGL = elm.Native.Graphics.WebGL || {};
  if (elm.Native.Graphics.WebGL.values) return elm.Native.Graphics.WebGL.values;

  var newNode = ElmRuntime.use(ElmRuntime.Render.Utils).newElement;
  var newElement = Elm.Graphics.Element.make(elm).newElement;

  var List = Elm.Native.List.make(elm);
  var MJS = Elm.Native.MJS.make(elm);
  var Utils = Elm.Native.Utils.make(elm);
  var Signal = Elm.Signal.make(elm);
  var Tuple2 = Utils.Tuple2;

  function unsafeCoerceGLSL(src) {
    return { src : src };
  }

  function loadTex(source) {

    var response = Signal.constant(elm.Http.values.Waiting);

    var img = new Image();

    img.onload = function() {
      var success = elm.Http.values.Success({img:img});
      elm.notify(response.id, success);
    }

    img.onerror = function(e) {
      var failure = A2(elm.Http.values.Failure,0,"Failed");
      elm.notify(response.id, failure);
    }

    img.src = source;

    return response;

  }

  function entity(vert, frag, buffer, uniforms) {

    if (!buffer.guid) {
      buffer.guid = Utils.guid();
    }

    return model = {
      vert: vert,
      frag: frag,
      buffer: buffer,
      uniforms: uniforms
    };

  }

  function do_texture (gl, img) {

    var tex = gl.createTexture();
    console.log("Created texture");
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D);
    //gl.bindTexture(gl.TEXTURE0, null);
    return tex;

  }

  function do_compile (gl, src, tipe) {

    var shader = gl.createShader(tipe);
    console.log("Created shader");

    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    var compile = gl.COMPILE_STATUS;
    if (!gl.getShaderParameter(shader,compile)) {
      throw gl.getShaderInfoLog(shader);
    }

    return shader;

  }

  function do_link (gl, vshader, fshader) {

    var program = gl.createProgram();
    console.log("Created program");

    gl.attachShader(program, vshader);
    gl.attachShader(program, fshader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw gl.getProgramInfoLog(program);
    }

    return program;

  }

  function do_bind (gl, program, bufferElems) {

    var buffers = {};

    var attributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
    for (var i = 0; i < attributes; i += 1) {
      var attribute = gl.getActiveAttrib(program, i);
      switch (attribute.type) {
        case gl.FLOAT_VEC3:

          // Might want to invert the loop
          // to build the array buffer first
          // and then bind each one-at-a-time
          var data = [];
          List.each(function(elem){
            data.push(elem._0[attribute.name][0]);
            data.push(elem._0[attribute.name][1]);
            data.push(elem._0[attribute.name][2]);
            data.push(elem._1[attribute.name][0]);
            data.push(elem._1[attribute.name][1]);
            data.push(elem._1[attribute.name][2]);
            data.push(elem._2[attribute.name][0]);
            data.push(elem._2[attribute.name][1]);
            data.push(elem._2[attribute.name][2]);
          }, bufferElems);
          var array = new Float32Array(data);

          var buffer = gl.createBuffer();
          console.log("Created attribute buffer " + attribute.name);
          gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
          gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);

          buffers[attribute.name] = buffer;

          break;

        default:
          console.log("Bad buffer type");
          break;
      }

    }

    var numIndices = 3 * List.length(bufferElems);
    var indices = List.toArray(List.range(0, numIndices - 1));
    console.log("Created index buffer");
    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    var bufferObject = {
      numIndices: numIndices,
      indexBuffer: indexBuffer,
      buffers: buffers
    };

    return bufferObject;

  }

  function drawGL(model) {

    var gl = model.cache.gl;

    gl.viewport(0, 0, model.w, model.h);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    console.log("Drawing");

    function drawEntity(entity) {

      var program;
      if (entity.vert.id && entity.frag.id) {
        var progid = entity.vert.id + '#' + entity.frag.id;
        program = model.cache.programs[progid];
      }

      if (!program) {

        var vshader = undefined;
        if (entity.vert.id) {
          vshader = model.cache.shaders[entity.vert.id];
        } else {
          entity.vert.id = Utils.guid();
        }

        if (!vshader) {
          vshader = do_compile(gl, entity.vert.src, gl.VERTEX_SHADER);
          model.cache.shaders[entity.vert.id] = vshader;
        }

        var fshader = undefined;
        if (entity.frag.id) {
          fshader = model.cache.shaders[entity.frag.id];
        } else {
          entity.frag.id = Utils.guid();
        }

        if (!fshader) {
          fshader = do_compile(gl, entity.frag.src, gl.FRAGMENT_SHADER);
          model.cache.shaders[entity.frag.id] = fshader;
        }

        program = do_link(gl, vshader, fshader);
        var progid = entity.vert.id + '#' + entity.frag.id;
        model.cache.programs[progid] = program;

      }

      gl.useProgram(program);

      var numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      var textureCounter = 0;
      for (var i = 0; i < numUniforms; i += 1) {
        var uniform = gl.getActiveUniform(program, i);
        var uniformLocation = gl.getUniformLocation(program, uniform.name);
        switch (uniform.type) {
          case gl.INT:
            gl.uniform1i(uniformLocation, entity.uniforms[uniform.name]);
            break;
          case gl.FLOAT:
            gl.uniform1f(uniformLocation, entity.uniforms[uniform.name]);
            break;
          case gl.FLOAT_VEC3:
            gl.uniform3fv(uniformLocation, entity.uniforms[uniform.name]);
            break;
          case gl.FLOAT_MAT4:
            gl.uniformMatrix4fv(uniformLocation, false, entity.uniforms[uniform.name]);
            break;
          case gl.SAMPLER_2D:
            var texture = entity.uniforms[uniform.name];
            var tex = undefined;
            if (texture.id) {
              tex = model.cache.textures[texture.id];
            } else {
              texture.id = Utils.guid();
            }
            if (!tex) {
              tex = do_texture(gl, texture.img);
              model.cache.textures[texture.id] = tex;
            }
            var activeName = 'TEXTURE' + textureCounter;
            gl.activeTexture(gl[activeName]);
            gl.bindTexture(gl.TEXTURE_2D,tex);
            gl.uniform1i(uniformLocation, textureCounter);
            textureCounter += 1;
            break;
          default:
            console.log("Unsupported uniform type: " + uniform.type);
            break;
        }
      }

      var buffer = model.cache.buffers[entity.buffer.guid];
      if (!buffer) {
        buffer = do_bind(gl, program, entity.buffer);
        model.cache.buffers[entity.buffer.guid] = buffer;
      }

      var numIndices = buffer.numIndices;
      var indexBuffer = buffer.indexBuffer;
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

      var numAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
      for (var i = 0; i < numAttributes; i += 1) {
        var attribute = gl.getActiveAttrib(program, i);
        var attribLocation = gl.getAttribLocation(program, attribute.name);
        gl.enableVertexAttribArray(attribLocation);
        var attributeBuffer = buffer.buffers[attribute.name];

        switch (attribute.type) {
          case gl.FLOAT_VEC3:
            gl.bindBuffer(gl.ARRAY_BUFFER, attributeBuffer);
            gl.vertexAttribPointer(attribLocation, 3, gl.FLOAT, false, 0, 0);
            break;
          default:
            console.log("Unsupported attribute type: " + attribute.type);
            break;
        }
      }

      gl.drawElements(gl.TRIANGLES, numIndices, gl.UNSIGNED_SHORT, 0);

    }

    List.each(drawEntity, model.models);

  }

  function webgl(dimensions, models) {

    var w = dimensions._0;
    var h = dimensions._1;

    function render(model) {

      var div = newNode('div');
      div.style.overflow = 'hidden';
      var canvas = newNode('canvas');
      var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

      if (gl) {
        gl.enable(gl.DEPTH_TEST);
      } else {
        div.innerHTML =
          '<div style="display: table-cell; text-align: center; width: ' + w + 'px; height: ' + h +
          'px; vertical-align: middle;"><a href="http://get.webgl.org/">Enable WebGL</a> to see this content!</div>';
      }

      model.cache.gl = gl;
      model.cache.canvas = canvas;
      model.cache.shaders = [];
      model.cache.programs = {};
      model.cache.buffers = [];
      model.cache.textures = [];

      update(div, model, model);

      return div;

    }

    function update(div, oldModel, newModel) {

      newModel.cache = oldModel.cache;

      var canvas = newModel.cache.canvas;

      canvas.style.width = oldModel.w + 'px';
      canvas.style.height = oldModel.h + 'px';
      canvas.style.display = "block";
      canvas.style.position = "absolute";
      canvas.width = oldModel.w;
      canvas.height = oldModel.h;

      if (newModel.cache.gl) {
        drawGL(newModel);
      } else {
        div.firstChild.width = newModel.w + 'px';
        div.firstChild.height = newModel.h + 'px';
      }

      div.appendChild(canvas);

    }

    var elem = {
      ctor: 'Custom',
      type: 'WebGL',
      render: render,
      update: update,
      model: {
        models: models,
        cache: {},
        w: w,
        h: h
      }
    };

    return A3(newElement, w, h, elem);

  }

  return elm.Native.Graphics.WebGL.values = {
    unsafeCoerceGLSL:unsafeCoerceGLSL,
    loadTex:loadTex,
    entity:F4(entity),
    webgl:F2(webgl)
  };

};
Elm.Main = Elm.Main || {};
Elm.Main.make = function (_elm) {
   "use strict";
   _elm.Main = _elm.Main || {};
   if (_elm.Main.values)
   return _elm.Main.values;
   var _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _A = _N.Array.make(_elm),
   _E = _N.Error.make(_elm),
   $moduleName = "Main";
   var Basics = Elm.Basics.make(_elm);
   var Color = Elm.Color.make(_elm);
   var Display = Elm.Display.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Collage = Elm.Graphics.Collage.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Element = Elm.Graphics.Element.make(_elm);
   var Graphics = Graphics || {};
   Graphics.WebGL = Elm.Graphics.WebGL.make(_elm);
   var Keyboard = Elm.Keyboard.make(_elm);
   var List = Elm.List.make(_elm);
   var Maybe = Elm.Maybe.make(_elm);
   var Model = Elm.Model.make(_elm);
   var Mouse = Elm.Mouse.make(_elm);
   var Native = Native || {};
   Native.Json = Elm.Native.Json.make(_elm);
   var Native = Native || {};
   Native.Ports = Elm.Native.Ports.make(_elm);
   var Signal = Elm.Signal.make(_elm);
   var String = Elm.String.make(_elm);
   var Text = Elm.Text.make(_elm);
   var Time = Elm.Time.make(_elm);
   var Update = Elm.Update.make(_elm);
   var Window = Elm.Window.make(_elm);
   var _op = {};
   var exitPointerLock = Native.Ports.portOut("exitPointerLock",
   Native.Ports.outgoingSignal(function (v) {
      return [];
   }),
   A2(Signal._op["<~"],
   Basics.always({ctor: "_Tuple0"}),
   A3(Signal.keepIf,
   List.any(function (x) {
      return _U.eq(x,27);
   }),
   _L.fromArray([]),
   Keyboard.keysDown)));
   var isLocked = Native.Ports.portIn("isLocked",
   Native.Ports.incomingSignal(function (v) {
      return typeof v === "boolean" ? v : _E.raise("invalid input, expecting JSBoolean but got " + v);
   }));
   var requestPointerLock = Native.Ports.portOut("requestPointerLock",
   Native.Ports.outgoingSignal(function (v) {
      return [];
   }),
   A3(Signal.dropWhen,
   A3(Signal.lift2,
   F2(function (x,y) {
      return x && y;
   }),
   Keyboard.shift,
   isLocked),
   {ctor: "_Tuple0"},
   Mouse.clicks));
   var movement = Native.Ports.portIn("movement",
   Native.Ports.incomingSignal(function (v) {
      return _U.isJSArray(v) ? {ctor: "_Tuple2"
                               ,_0: typeof v[0] === "number" ? v[0] : _E.raise("invalid input, expecting JSNumber but got " + v[0])
                               ,_1: typeof v[1] === "number" ? v[1] : _E.raise("invalid input, expecting JSNumber but got " + v[1])} : _E.raise("invalid input, expecting JSArray but got " + v);
   }));
   var inputs = function () {
      var dt = A2(Signal.lift,
      function (t) {
         return t / 500;
      },
      Time.fps(60));
      return A2(Signal.merge,
      Signal.sampleOn(dt)(A4(Signal.lift3,
      Model.TimeDelta,
      Keyboard.space,
      Keyboard.wasd,
      dt)),
      A2(Signal._op["<~"],
      Model.Mouse,
      movement));
   }();
   var person = A3(Signal.foldp,
   Update.step,
   Model.defaultPerson,
   inputs);
   var main = function () {
      var texture = Graphics.WebGL.loadTexture("resources/woodCrate.jpg");
      return A5(Signal.lift4,
      Display.scene,
      Window.dimensions,
      isLocked,
      texture,
      person);
   }();
   _elm.Main.values = {_op: _op
                      ,inputs: inputs
                      ,person: person
                      ,main: main};
   return _elm.Main.values;
};Elm.Display = Elm.Display || {};
Elm.Display.make = function (_elm) {
   "use strict";
   _elm.Display = _elm.Display || {};
   if (_elm.Display.values)
   return _elm.Display.values;
   var _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _A = _N.Array.make(_elm),
   _E = _N.Error.make(_elm),
   $moduleName = "Display";
   var Basics = Elm.Basics.make(_elm);
   var Color = Elm.Color.make(_elm);
   var Display = Display || {};
   Display.Crate = Elm.Display.Crate.make(_elm);
   var Display = Display || {};
   Display.World = Elm.Display.World.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Collage = Elm.Graphics.Collage.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Element = Elm.Graphics.Element.make(_elm);
   var Graphics = Graphics || {};
   Graphics.WebGL = Elm.Graphics.WebGL.make(_elm);
   var Http = Elm.Http.make(_elm);
   var List = Elm.List.make(_elm);
   var Math = Math || {};
   Math.Matrix4 = Elm.Math.Matrix4.make(_elm);
   var Math = Math || {};
   Math.Vector2 = Elm.Math.Vector2.make(_elm);
   var Math = Math || {};
   Math.Vector3 = Elm.Math.Vector3.make(_elm);
   var Maybe = Elm.Maybe.make(_elm);
   var Model = Elm.Model.make(_elm);
   var Native = Native || {};
   Native.Json = Elm.Native.Json.make(_elm);
   var Native = Native || {};
   Native.Ports = Elm.Native.Ports.make(_elm);
   var Signal = Elm.Signal.make(_elm);
   var String = Elm.String.make(_elm);
   var Text = Elm.Text.make(_elm);
   var Time = Elm.Time.make(_elm);
   var _op = {};
   var message = function (msg) {
      return Text.plainText(_L.append("This uses stuff that is only available in Chrome and Firefox!\n",
      _L.append("\nWASD keys to move, space bar to jump.\n\n",
      msg)));
   };
   var exitMsg = message("Press <escape> to exit full screen.");
   var enterMsg = message("Click to go full screen and move your head with the mouse.");
   var entities = F2(function (response,
   view) {
      return function () {
         var crates = function () {
            switch (response.ctor)
            {case "Success":
               return _L.fromArray([A2(Display.Crate.crate,
                                   response._0,
                                   view)
                                   ,A2(Display.Crate.crate,
                                   response._0,
                                   A4(Math.Matrix4.translate3,
                                   10,
                                   0,
                                   10,
                                   view))
                                   ,A2(Display.Crate.crate,
                                   response._0,
                                   A4(Math.Matrix4.translate3,
                                   -10,
                                   0,
                                   -10,
                                   view))]);}
            return _L.fromArray([]);
         }();
         return {ctor: "::"
                ,_0: Display.World.ground(view)
                ,_1: crates};
      }();
   });
   var view = F2(function (_v2,
   person) {
      return function () {
         switch (_v2.ctor)
         {case "_Tuple2":
            return A2(Math.Matrix4.mul,
              A4(Math.Matrix4.makePerspective,
              45,
              Basics.toFloat(_v2._0) / Basics.toFloat(_v2._1),
              1.0e-2,
              100),
              A3(Math.Matrix4.makeLookAt,
              person.position,
              A2(Math.Vector3.add,
              person.position,
              Model.direction(person)),
              Math.Vector3.j));}
         _E.Case($moduleName,
         "between lines 15 and 16");
      }();
   });
   var scene = F4(function (_v6,
   isLocked,
   texture,
   person) {
      return function () {
         switch (_v6.ctor)
         {case "_Tuple2":
            return Graphics.Element.layers(_L.fromArray([A2(Graphics.Element.color,
                                                        A3(Color.rgb,
                                                        135,
                                                        206,
                                                        235),
                                                        A2(Graphics.Element.spacer,
                                                        _v6._0,
                                                        _v6._1))
                                                        ,A2(Graphics.WebGL.webgl,
                                                        {ctor: "_Tuple2"
                                                        ,_0: _v6._0
                                                        ,_1: _v6._1},
                                                        A2(entities,
                                                        texture,
                                                        A2(view,
                                                        {ctor: "_Tuple2"
                                                        ,_0: _v6._0
                                                        ,_1: _v6._1},
                                                        person)))
                                                        ,A4(Graphics.Element.container,
                                                        _v6._0,
                                                        140,
                                                        A2(Graphics.Element.midLeftAt,
                                                        Graphics.Element.absolute(40),
                                                        Graphics.Element.relative(0.5)),
                                                        isLocked ? exitMsg : enterMsg)]));}
         _E.Case($moduleName,
         "between lines 20 and 24");
      }();
   });
   _elm.Display.values = {_op: _op
                         ,scene: scene};
   return _elm.Display.values;
};Elm.Display = Elm.Display || {};
Elm.Display.Crate = Elm.Display.Crate || {};
Elm.Display.Crate.make = function (_elm) {
   "use strict";
   _elm.Display = _elm.Display || {};
   _elm.Display.Crate = _elm.Display.Crate || {};
   if (_elm.Display.Crate.values)
   return _elm.Display.Crate.values;
   var _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _A = _N.Array.make(_elm),
   _E = _N.Error.make(_elm),
   $moduleName = "Display.Crate";
   var Basics = Elm.Basics.make(_elm);
   var Color = Elm.Color.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Collage = Elm.Graphics.Collage.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Element = Elm.Graphics.Element.make(_elm);
   var Graphics = Graphics || {};
   Graphics.WebGL = Elm.Graphics.WebGL.make(_elm);
   var List = Elm.List.make(_elm);
   var Math = Math || {};
   Math.Matrix4 = Elm.Math.Matrix4.make(_elm);
   var Math = Math || {};
   Math.Vector2 = Elm.Math.Vector2.make(_elm);
   var Math = Math || {};
   Math.Vector3 = Elm.Math.Vector3.make(_elm);
   var Maybe = Elm.Maybe.make(_elm);
   var Model = Elm.Model.make(_elm);
   var Native = Native || {};
   Native.Json = Elm.Native.Json.make(_elm);
   var Native = Native || {};
   Native.Ports = Elm.Native.Ports.make(_elm);
   var Signal = Elm.Signal.make(_elm);
   var String = Elm.String.make(_elm);
   var Text = Elm.Text.make(_elm);
   var Time = Elm.Time.make(_elm);
   var _op = {};
   var fragmentShader = {"src": "\n\nprecision mediump float;\nuniform sampler2D crate;\nvarying vec2 vcoord;\n\nvoid main () {\n  gl_FragColor = texture2D(crate, vcoord);\n}\n\n"};
   var vertexShader = {"src": "\n\nattribute vec3 position;\nattribute vec3 coord;\nuniform mat4 view;\nvarying vec2 vcoord;\n\nvoid main () {\n  gl_Position = view * vec4(position, 1.0);\n  vcoord = coord.xy;\n}\n\n"};
   var Vertex = F2(function (a,b) {
      return {_: {}
             ,coord: b
             ,position: a};
   });
   var face = function () {
      var bottomRight = A2(Vertex,
      A3(Math.Vector3.vec3,1,-1,1),
      A3(Math.Vector3.vec3,1,0,0));
      var bottomLeft = A2(Vertex,
      A3(Math.Vector3.vec3,-1,-1,1),
      A3(Math.Vector3.vec3,0,0,0));
      var topRight = A2(Vertex,
      A3(Math.Vector3.vec3,1,1,1),
      A3(Math.Vector3.vec3,1,1,0));
      var topLeft = A2(Vertex,
      A3(Math.Vector3.vec3,-1,1,1),
      A3(Math.Vector3.vec3,0,1,0));
      return _L.fromArray([{ctor: "_Tuple3"
                           ,_0: topLeft
                           ,_1: topRight
                           ,_2: bottomLeft}
                          ,{ctor: "_Tuple3"
                           ,_0: bottomLeft
                           ,_1: topRight
                           ,_2: bottomRight}]);
   }();
   var rotatedFace = function (_v0) {
      return function () {
         switch (_v0.ctor)
         {case "_Tuple2":
            return function () {
                 var y = A2(Math.Matrix4.makeRotate,
                 Basics.degrees(_v0._1),
                 Math.Vector3.i);
                 var x = A2(Math.Matrix4.makeRotate,
                 Basics.degrees(_v0._0),
                 Math.Vector3.j);
                 var t = A2(Math.Matrix4.mul,
                 x,
                 y);
                 return A2(List.map,
                 Graphics.WebGL.mapTriangle(function (v) {
                    return _U.replace([["position"
                                       ,A2(Math.Matrix4.transform,
                                       t,
                                       v.position)]],
                    v);
                 }),
                 face);
              }();}
         _E.Case($moduleName,
         "between lines 22 and 26");
      }();
   };
   var mesh = A2(List.concatMap,
   rotatedFace,
   _L.fromArray([{ctor: "_Tuple2"
                 ,_0: 0
                 ,_1: 0}
                ,{ctor: "_Tuple2",_0: 90,_1: 0}
                ,{ctor: "_Tuple2",_0: 180,_1: 0}
                ,{ctor: "_Tuple2",_0: 270,_1: 0}
                ,{ctor: "_Tuple2",_0: 0,_1: 90}
                ,{ctor: "_Tuple2"
                 ,_0: 0
                 ,_1: -90}]));
   var crate = F2(function (texture,
   view) {
      return A4(Graphics.WebGL.entity,
      vertexShader,
      fragmentShader,
      mesh,
      {_: {}
      ,crate: texture
      ,view: view});
   });
   _elm.Display.Crate.values = {_op: _op
                               ,crate: crate};
   return _elm.Display.Crate.values;
};Elm.Display = Elm.Display || {};
Elm.Display.World = Elm.Display.World || {};
Elm.Display.World.make = function (_elm) {
   "use strict";
   _elm.Display = _elm.Display || {};
   _elm.Display.World = _elm.Display.World || {};
   if (_elm.Display.World.values)
   return _elm.Display.World.values;
   var _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _A = _N.Array.make(_elm),
   _E = _N.Error.make(_elm),
   $moduleName = "Display.World";
   var Basics = Elm.Basics.make(_elm);
   var Color = Elm.Color.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Collage = Elm.Graphics.Collage.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Element = Elm.Graphics.Element.make(_elm);
   var Graphics = Graphics || {};
   Graphics.WebGL = Elm.Graphics.WebGL.make(_elm);
   var List = Elm.List.make(_elm);
   var Math = Math || {};
   Math.Matrix4 = Elm.Math.Matrix4.make(_elm);
   var Math = Math || {};
   Math.Vector3 = Elm.Math.Vector3.make(_elm);
   var Maybe = Elm.Maybe.make(_elm);
   var Native = Native || {};
   Native.Json = Elm.Native.Json.make(_elm);
   var Native = Native || {};
   Native.Ports = Elm.Native.Ports.make(_elm);
   var Signal = Elm.Signal.make(_elm);
   var String = Elm.String.make(_elm);
   var Text = Elm.Text.make(_elm);
   var Time = Elm.Time.make(_elm);
   var _op = {};
   var fragmentShader = {"src": "\n\nprecision mediump float;\nvarying vec3 vcolor;\n\nvoid main () {\n    gl_FragColor = vec4(vcolor, 1.0);\n}\n\n"};
   var vertexShader = {"src": "\n\nattribute vec3 position;\nattribute vec3 color;\nuniform mat4 view;\nvarying vec3 vcolor;\n\nvoid main () {\n    gl_Position = view * vec4(position, 1.0);\n    vcolor = color;\n}\n\n"};
   var color = F3(function (hue,
   saturation,
   lightness) {
      return function () {
         var c = Color.toRgb(A3(Color.hsl,
         hue,
         saturation,
         lightness));
         return A3(Math.Vector3.vec3,
         Basics.toFloat(c.red) / 255,
         Basics.toFloat(c.green) / 255,
         Basics.toFloat(c.blue) / 255);
      }();
   });
   var Vertex = F2(function (a,b) {
      return {_: {}
             ,color: b
             ,position: a};
   });
   var groundMesh = function () {
      var green = A2(color,
      Basics.degrees(110),
      0.48);
      var topLeft = A2(Vertex,
      A3(Math.Vector3.vec3,-20,-1,20),
      green(0.7));
      var topRight = A2(Vertex,
      A3(Math.Vector3.vec3,20,-1,20),
      green(0.4));
      var bottomLeft = A2(Vertex,
      A3(Math.Vector3.vec3,
      -20,
      -1,
      -20),
      green(0.5));
      var bottomRight = A2(Vertex,
      A3(Math.Vector3.vec3,20,-1,-20),
      green(0.6));
      return _L.fromArray([{ctor: "_Tuple3"
                           ,_0: topLeft
                           ,_1: topRight
                           ,_2: bottomLeft}
                          ,{ctor: "_Tuple3"
                           ,_0: bottomLeft
                           ,_1: topRight
                           ,_2: bottomRight}]);
   }();
   var ground = function (view) {
      return A4(Graphics.WebGL.entity,
      vertexShader,
      fragmentShader,
      groundMesh,
      {_: {},view: view});
   };
   _elm.Display.World.values = {_op: _op
                               ,ground: ground};
   return _elm.Display.World.values;
};Elm.Graphics = Elm.Graphics || {};
Elm.Graphics.WebGL = Elm.Graphics.WebGL || {};
Elm.Graphics.WebGL.make = function (_elm) {
   "use strict";
   _elm.Graphics = _elm.Graphics || {};
   _elm.Graphics.WebGL = _elm.Graphics.WebGL || {};
   if (_elm.Graphics.WebGL.values)
   return _elm.Graphics.WebGL.values;
   var _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _A = _N.Array.make(_elm),
   _E = _N.Error.make(_elm),
   $moduleName = "Graphics.WebGL";
   var Basics = Elm.Basics.make(_elm);
   var Color = Elm.Color.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Collage = Elm.Graphics.Collage.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Element = Elm.Graphics.Element.make(_elm);
   var Http = Elm.Http.make(_elm);
   var List = Elm.List.make(_elm);
   var Maybe = Elm.Maybe.make(_elm);
   var Native = Native || {};
   Native.Graphics = Native.Graphics || {};
   Native.Graphics.WebGL = Elm.Native.Graphics.WebGL.make(_elm);
   var Native = Native || {};
   Native.Json = Elm.Native.Json.make(_elm);
   var Native = Native || {};
   Native.Ports = Elm.Native.Ports.make(_elm);
   var Signal = Elm.Signal.make(_elm);
   var String = Elm.String.make(_elm);
   var Text = Elm.Text.make(_elm);
   var Time = Elm.Time.make(_elm);
   var _op = {};
   var webgl = Native.Graphics.WebGL.webgl;
   var entity = Native.Graphics.WebGL.entity;
   var Entity = {ctor: "Entity"};
   var loadTexture = Native.Graphics.WebGL.loadTex;
   var Texture = {ctor: "Texture"};
   var unsafeShader = Native.Graphics.WebGL.unsafeCoerceGLSL;
   var Shader = {ctor: "Shader"};
   var zipTriangle = F3(function (f,
   _v0,
   _v1) {
      return function () {
         switch (_v1.ctor)
         {case "_Tuple3":
            return function () {
                 switch (_v0.ctor)
                 {case "_Tuple3":
                    return {ctor: "_Tuple3"
                           ,_0: A2(f,_v0._0,_v1._0)
                           ,_1: A2(f,_v0._1,_v1._1)
                           ,_2: A2(f,_v0._2,_v1._2)};}
                 _E.Case($moduleName,
                 "on line 50, column 37 to 59");
              }();}
         _E.Case($moduleName,
         "on line 50, column 37 to 59");
      }();
   });
   var mapTriangle = F2(function (f,
   _v10) {
      return function () {
         switch (_v10.ctor)
         {case "_Tuple3":
            return {ctor: "_Tuple3"
                   ,_0: f(_v10._0)
                   ,_1: f(_v10._1)
                   ,_2: f(_v10._2)};}
         _E.Case($moduleName,
         "on line 44, column 26 to 39");
      }();
   });
   _elm.Graphics.WebGL.values = {_op: _op
                                ,mapTriangle: mapTriangle
                                ,zipTriangle: zipTriangle
                                ,unsafeShader: unsafeShader
                                ,loadTexture: loadTexture
                                ,entity: entity
                                ,webgl: webgl
                                ,Shader: Shader
                                ,Texture: Texture
                                ,Entity: Entity};
   return _elm.Graphics.WebGL.values;
};Elm.Update = Elm.Update || {};
Elm.Update.make = function (_elm) {
   "use strict";
   _elm.Update = _elm.Update || {};
   if (_elm.Update.values)
   return _elm.Update.values;
   var _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _A = _N.Array.make(_elm),
   _E = _N.Error.make(_elm),
   $moduleName = "Update";
   var Basics = Elm.Basics.make(_elm);
   var Color = Elm.Color.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Collage = Elm.Graphics.Collage.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Element = Elm.Graphics.Element.make(_elm);
   var List = Elm.List.make(_elm);
   var Math = Math || {};
   Math.Matrix4 = Elm.Math.Matrix4.make(_elm);
   var Math = Math || {};
   Math.Vector3 = Elm.Math.Vector3.make(_elm);
   var Maybe = Elm.Maybe.make(_elm);
   var Model = Elm.Model.make(_elm);
   var Native = Native || {};
   Native.Json = Elm.Native.Json.make(_elm);
   var Native = Native || {};
   Native.Ports = Elm.Native.Ports.make(_elm);
   var Signal = Elm.Signal.make(_elm);
   var String = Elm.String.make(_elm);
   var Text = Elm.Text.make(_elm);
   var Time = Elm.Time.make(_elm);
   var _op = {};
   var gravity = F2(function (dt,
   person) {
      return _U.cmp(Math.Vector3.getY(person.position),
      Model.eyeLevel) < 1 ? person : function () {
         var v = Math.Vector3.toRecord(person.velocity);
         return _U.replace([["velocity"
                            ,A3(Math.Vector3.vec3,
                            v.x,
                            v.y - 2 * dt,
                            v.z)]],
         person);
      }();
   });
   var physics = F2(function (dt,
   person) {
      return function () {
         var position = A2(Math.Vector3.add,
         person.position,
         A2(Math.Vector3.scale,
         dt,
         person.velocity));
         var p = Math.Vector3.toRecord(position);
         var position$ = _U.cmp(p.y,
         Model.eyeLevel) < 0 ? A3(Math.Vector3.vec3,
         p.x,
         Model.eyeLevel,
         p.z) : position;
         return _U.replace([["position"
                            ,position$]],
         person);
      }();
   });
   var jump = F2(function (isJumping,
   person) {
      return Basics.not(isJumping) || _U.cmp(Math.Vector3.getY(person.position),
      Model.eyeLevel) > 0 ? person : function () {
         var v = Math.Vector3.toRecord(person.velocity);
         return _U.replace([["velocity"
                            ,A3(Math.Vector3.vec3,
                            v.x,
                            2,
                            v.z)]],
         person);
      }();
   });
   var adjustVelocity = function (v) {
      return function () {
         var _v0 = Math.Vector3.toTuple(v);
         switch (_v0.ctor)
         {case "_Tuple3": switch (_v0._0)
              {case 0: switch (_v0._1)
                   {case 0: switch (_v0._2)
                        {case 0: return v;}
                        break;}
                   break;}
              break;}
         return A2(Math.Vector3.scale,
         2,
         Math.Vector3.normalize(v));
      }();
   };
   var turn = F2(function (_v4,
   person) {
      return function () {
         switch (_v4.ctor)
         {case "_Tuple2":
            return function () {
                 var v$ = person.verticalAngle - Basics.toFloat(_v4._1) / 500;
                 var h$ = person.horizontalAngle + Basics.toFloat(_v4._0) / 500;
                 return _U.replace([["horizontalAngle"
                                    ,h$]
                                   ,["verticalAngle"
                                    ,A3(Basics.clamp,
                                    Basics.degrees(-45),
                                    Basics.degrees(45),
                                    v$)]],
                 person);
              }();}
         _E.Case($moduleName,
         "between lines 25 and 30");
      }();
   });
   var flatten = function (v) {
      return function () {
         var r = Math.Vector3.toRecord(v);
         return Math.Vector3.normalize(A3(Math.Vector3.vec3,
         r.x,
         0,
         r.z));
      }();
   };
   var walk = F2(function (directions,
   person) {
      return _U.cmp(Math.Vector3.getY(person.position),
      Model.eyeLevel) > 0 ? person : function () {
         var moveDir = Math.Vector3.normalize(flatten(Model.direction(person)));
         var strafeDir = A2(Math.Matrix4.transform,
         A2(Math.Matrix4.makeRotate,
         Basics.degrees(-90),
         Math.Vector3.j),
         moveDir);
         var strafe = A2(Math.Vector3.scale,
         Basics.toFloat(directions.x),
         strafeDir);
         var move = A2(Math.Vector3.scale,
         Basics.toFloat(directions.y),
         moveDir);
         return _U.replace([["velocity"
                            ,adjustVelocity(A2(Math.Vector3.add,
                            move,
                            strafe))]],
         person);
      }();
   });
   var step = F2(function (inputs,
   person) {
      return function () {
         switch (inputs.ctor)
         {case "Mouse": return A2(turn,
              inputs._0,
              person);
            case "TimeDelta":
            return physics(inputs._2)(gravity(inputs._2)(jump(inputs._0)(walk(inputs._1)(person))));}
         _E.Case($moduleName,
         "between lines 10 and 16");
      }();
   });
   _elm.Update.values = {_op: _op
                        ,step: step};
   return _elm.Update.values;
};Elm.Math = Elm.Math || {};
Elm.Math.Matrix4 = Elm.Math.Matrix4 || {};
Elm.Math.Matrix4.make = function (_elm) {
   "use strict";
   _elm.Math = _elm.Math || {};
   _elm.Math.Matrix4 = _elm.Math.Matrix4 || {};
   if (_elm.Math.Matrix4.values)
   return _elm.Math.Matrix4.values;
   var _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _A = _N.Array.make(_elm),
   _E = _N.Error.make(_elm),
   $moduleName = "Math.Matrix4";
   var Basics = Elm.Basics.make(_elm);
   var Color = Elm.Color.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Collage = Elm.Graphics.Collage.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Element = Elm.Graphics.Element.make(_elm);
   var List = Elm.List.make(_elm);
   var Math = Math || {};
   Math.Vector3 = Elm.Math.Vector3.make(_elm);
   var Maybe = Elm.Maybe.make(_elm);
   var Native = Native || {};
   Native.Json = Elm.Native.Json.make(_elm);
   var Native = Native || {};
   Native.MJS = Elm.Native.MJS.make(_elm);
   var Native = Native || {};
   Native.Ports = Elm.Native.Ports.make(_elm);
   var Signal = Elm.Signal.make(_elm);
   var String = Elm.String.make(_elm);
   var Text = Elm.Text.make(_elm);
   var Time = Elm.Time.make(_elm);
   var _op = {};
   var makeBasis = Native.MJS.m4x4makeBasis;
   var transpose = Native.MJS.m4x4transpose;
   var makeLookAt = Native.MJS.m4x4makeLookAt;
   var translate = Native.MJS.m4x4translate;
   var translate3 = Native.MJS.m4x4translate3;
   var makeTranslate = Native.MJS.m4x4makeTranslate;
   var makeTranslate3 = Native.MJS.m4x4makeTranslate3;
   var scale = Native.MJS.m4x4scale;
   var scale3 = Native.MJS.m4x4scale3;
   var makeScale = Native.MJS.m4x4makeScale;
   var makeScale3 = Native.MJS.m4x4makeScale3;
   var rotate = Native.MJS.m4x4rotate;
   var makeRotate = Native.MJS.m4x4makeRotate;
   var mulAffine = Native.MJS.m4x4mulAffine;
   var mul = Native.MJS.m4x4mul;
   var makeOrtho2D = Native.MJS.m4x4makeOrtho2D;
   var makeOrtho = Native.MJS.m4x4makeOrtho;
   var makePerspective = Native.MJS.m4x4makePerspective;
   var makeFrustrum = Native.MJS.m4x4makeFrustrum;
   var inverseOrthonormal = Native.MJS.m4x4inverseOrthonormal;
   var identity = Native.MJS.m4x4identity;
   var transform = Native.MJS.v3mul4x4;
   var Mat4 = {ctor: "Mat4"};
   _elm.Math.Matrix4.values = {_op: _op
                              ,transform: transform
                              ,identity: identity
                              ,inverseOrthonormal: inverseOrthonormal
                              ,makeFrustrum: makeFrustrum
                              ,makePerspective: makePerspective
                              ,makeOrtho: makeOrtho
                              ,makeOrtho2D: makeOrtho2D
                              ,mul: mul
                              ,mulAffine: mulAffine
                              ,makeRotate: makeRotate
                              ,rotate: rotate
                              ,makeScale3: makeScale3
                              ,makeScale: makeScale
                              ,scale3: scale3
                              ,scale: scale
                              ,makeTranslate3: makeTranslate3
                              ,makeTranslate: makeTranslate
                              ,translate3: translate3
                              ,translate: translate
                              ,makeLookAt: makeLookAt
                              ,transpose: transpose
                              ,makeBasis: makeBasis
                              ,Mat4: Mat4};
   return _elm.Math.Matrix4.values;
};Elm.Math = Elm.Math || {};
Elm.Math.Vector2 = Elm.Math.Vector2 || {};
Elm.Math.Vector2.make = function (_elm) {
   "use strict";
   _elm.Math = _elm.Math || {};
   _elm.Math.Vector2 = _elm.Math.Vector2 || {};
   if (_elm.Math.Vector2.values)
   return _elm.Math.Vector2.values;
   var _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _A = _N.Array.make(_elm),
   _E = _N.Error.make(_elm),
   $moduleName = "Math.Vector2";
   var Basics = Elm.Basics.make(_elm);
   var Color = Elm.Color.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Collage = Elm.Graphics.Collage.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Element = Elm.Graphics.Element.make(_elm);
   var List = Elm.List.make(_elm);
   var Maybe = Elm.Maybe.make(_elm);
   var Native = Native || {};
   Native.Json = Elm.Native.Json.make(_elm);
   var Native = Native || {};
   Native.Math = Native.Math || {};
   Native.Math.Vector2 = Elm.Native.Math.Vector2.make(_elm);
   var Native = Native || {};
   Native.Ports = Elm.Native.Ports.make(_elm);
   var Signal = Elm.Signal.make(_elm);
   var String = Elm.String.make(_elm);
   var Text = Elm.Text.make(_elm);
   var Time = Elm.Time.make(_elm);
   var _op = {};
   var dot = Native.Math.Vector2.dot;
   var scale = Native.Math.Vector2.scale;
   var normalize = Native.Math.Vector2.normalize;
   var distanceSquared = Native.Math.Vector2.distanceSquared;
   var distance = Native.Math.Vector2.distance;
   var lengthSquared = Native.Math.Vector2.lengthSquared;
   var length = Native.Math.Vector2.length;
   var direction = Native.Math.Vector2.direction;
   var negate = Native.Math.Vector2.neg;
   var sub = Native.Math.Vector2.sub;
   var add = Native.Math.Vector2.add;
   var fromRecord = Native.Math.Vector2.fromRecord;
   var fromTuple = Native.Math.Vector2.fromTuple;
   var toRecord = Native.Math.Vector2.toRecord;
   var toTuple = Native.Math.Vector2.toTuple;
   var setY = Native.Math.Vector2.setY;
   var setX = Native.Math.Vector2.setX;
   var getY = Native.Math.Vector2.getY;
   var getX = Native.Math.Vector2.getX;
   var vec2 = Native.Math.Vector2.vec2;
   var Vec2 = {ctor: "Vec2"};
   _elm.Math.Vector2.values = {_op: _op
                              ,vec2: vec2
                              ,getX: getX
                              ,getY: getY
                              ,setX: setX
                              ,setY: setY
                              ,toTuple: toTuple
                              ,toRecord: toRecord
                              ,fromTuple: fromTuple
                              ,fromRecord: fromRecord
                              ,add: add
                              ,sub: sub
                              ,negate: negate
                              ,direction: direction
                              ,length: length
                              ,lengthSquared: lengthSquared
                              ,distance: distance
                              ,distanceSquared: distanceSquared
                              ,normalize: normalize
                              ,scale: scale
                              ,dot: dot
                              ,Vec2: Vec2};
   return _elm.Math.Vector2.values;
};Elm.Model = Elm.Model || {};
Elm.Model.make = function (_elm) {
   "use strict";
   _elm.Model = _elm.Model || {};
   if (_elm.Model.values)
   return _elm.Model.values;
   var _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _A = _N.Array.make(_elm),
   _E = _N.Error.make(_elm),
   $moduleName = "Model";
   var Basics = Elm.Basics.make(_elm);
   var Color = Elm.Color.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Collage = Elm.Graphics.Collage.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Element = Elm.Graphics.Element.make(_elm);
   var List = Elm.List.make(_elm);
   var Math = Math || {};
   Math.Vector3 = Elm.Math.Vector3.make(_elm);
   var Maybe = Elm.Maybe.make(_elm);
   var Native = Native || {};
   Native.Json = Elm.Native.Json.make(_elm);
   var Native = Native || {};
   Native.Ports = Elm.Native.Ports.make(_elm);
   var Signal = Elm.Signal.make(_elm);
   var String = Elm.String.make(_elm);
   var Text = Elm.Text.make(_elm);
   var Time = Elm.Time.make(_elm);
   var _op = {};
   var direction = function (person) {
      return function () {
         var v = person.verticalAngle;
         var h = person.horizontalAngle;
         return A3(Math.Vector3.vec3,
         Basics.cos(h),
         Basics.sin(v),
         Basics.sin(h));
      }();
   };
   var eyeLevel = 2;
   var defaultPerson = {_: {}
                       ,horizontalAngle: Basics.degrees(90)
                       ,position: A3(Math.Vector3.vec3,
                       0,
                       eyeLevel,
                       -8)
                       ,velocity: A3(Math.Vector3.vec3,
                       0,
                       0,
                       0)
                       ,verticalAngle: 0};
   var Person = F4(function (a,
   b,
   c,
   d) {
      return {_: {}
             ,horizontalAngle: c
             ,position: a
             ,velocity: b
             ,verticalAngle: d};
   });
   var Mouse = function (a) {
      return {ctor: "Mouse",_0: a};
   };
   var TimeDelta = F3(function (a,
   b,
   c) {
      return {ctor: "TimeDelta"
             ,_0: a
             ,_1: b
             ,_2: c};
   });
   _elm.Model.values = {_op: _op
                       ,eyeLevel: eyeLevel
                       ,defaultPerson: defaultPerson
                       ,direction: direction
                       ,TimeDelta: TimeDelta
                       ,Mouse: Mouse
                       ,Person: Person};
   return _elm.Model.values;
};Elm.Math = Elm.Math || {};
Elm.Math.Vector3 = Elm.Math.Vector3 || {};
Elm.Math.Vector3.make = function (_elm) {
   "use strict";
   _elm.Math = _elm.Math || {};
   _elm.Math.Vector3 = _elm.Math.Vector3 || {};
   if (_elm.Math.Vector3.values)
   return _elm.Math.Vector3.values;
   var _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _A = _N.Array.make(_elm),
   _E = _N.Error.make(_elm),
   $moduleName = "Math.Vector3";
   var Basics = Elm.Basics.make(_elm);
   var Color = Elm.Color.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Collage = Elm.Graphics.Collage.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Element = Elm.Graphics.Element.make(_elm);
   var List = Elm.List.make(_elm);
   var Maybe = Elm.Maybe.make(_elm);
   var Native = Native || {};
   Native.Json = Elm.Native.Json.make(_elm);
   var Native = Native || {};
   Native.MJS = Elm.Native.MJS.make(_elm);
   var Native = Native || {};
   Native.Ports = Elm.Native.Ports.make(_elm);
   var Signal = Elm.Signal.make(_elm);
   var String = Elm.String.make(_elm);
   var Text = Elm.Text.make(_elm);
   var Time = Elm.Time.make(_elm);
   var _op = {};
   var cross = Native.MJS.v3cross;
   var dot = Native.MJS.v3dot;
   var scale = Native.MJS.v3scale;
   var normalize = Native.MJS.v3normalize;
   var distanceSquared = Native.MJS.v3distanceSquared;
   var distance = Native.MJS.v3distance;
   var lengthSquared = Native.MJS.v3lengthSquared;
   var length = Native.MJS.v3length;
   var direction = Native.MJS.v3direction;
   var negate = Native.MJS.v3neg;
   var sub = Native.MJS.v3sub;
   var add = Native.MJS.v3add;
   var fromRecord = Native.MJS.fromRecord3;
   var fromTuple = Native.MJS.fromTuple3;
   var toRecord = Native.MJS.toRecord3;
   var toTuple = Native.MJS.toTuple3;
   var setZ = Native.MJS.v3setZ;
   var setY = Native.MJS.v3setY;
   var setX = Native.MJS.v3setX;
   var getZ = Native.MJS.v3getZ;
   var getY = Native.MJS.v3getY;
   var getX = Native.MJS.v3getX;
   var k = A3(Native.MJS.vec3,
   0,
   0,
   1);
   var j = A3(Native.MJS.vec3,
   0,
   1,
   0);
   var i = A3(Native.MJS.vec3,
   1,
   0,
   0);
   var vec3 = Native.MJS.vec3;
   var Vec3 = {ctor: "Vec3"};
   _elm.Math.Vector3.values = {_op: _op
                              ,vec3: vec3
                              ,i: i
                              ,j: j
                              ,k: k
                              ,getX: getX
                              ,getY: getY
                              ,getZ: getZ
                              ,setX: setX
                              ,setY: setY
                              ,setZ: setZ
                              ,toTuple: toTuple
                              ,toRecord: toRecord
                              ,fromTuple: fromTuple
                              ,fromRecord: fromRecord
                              ,add: add
                              ,sub: sub
                              ,negate: negate
                              ,direction: direction
                              ,length: length
                              ,lengthSquared: lengthSquared
                              ,distance: distance
                              ,distanceSquared: distanceSquared
                              ,normalize: normalize
                              ,scale: scale
                              ,dot: dot
                              ,cross: cross
                              ,Vec3: Vec3};
   return _elm.Math.Vector3.values;
};