
class Vec4 {

    constructor( x, y, z, w ) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w ?? 0;
    }

    /**
     * Returns the vector that is this vector scaled by the given scalar.
     * @param {number} by the scalar to scale with 
     * @returns {Vec4}
     */
    scaled( by ) {
        // return the new vector
        let new_x = this.x * by;
        let new_y = this.y * by;
        let new_z = this.z * by;
        let new_w = this.w * by;
        return new Vec4( new_x, new_y, new_z, new_w );
    }

    /**
     * Returns the dot product between this vector and other
     * @param {Vec4} other the other vector 
     * @returns {number}
     */
    dot( other ) {
        // return the dot product 
        let com_x = this.x * other.x;
        let com_y = this.y * other.y;
        let com_z = this.z * other.z;
        let com_w = this.w * other.w;
        return com_x + com_y + com_z + com_w;
    }

    /**
     * Returns the length of this vector
     * @returns {number}
     */
    length() {
        // return the length
        let com_x = this.x ** 2;
        let com_y = this.y ** 2;
        let com_z = this.z ** 2;
        let com_w = this.w ** 2;
        return Math.sqrt( com_x + com_y + com_z + com_w );
    }

    /**
     * Returns a normalized version of this vector
     * @returns {Vec4}
     */
    norm() {
        // return the normalized vector
        let mag = this.length();
        let com_x = this.x / mag;
        let com_y = this.y / mag;
        let com_z = this.z / mag;
        let com_w = this.w / mag;
        return new Vec4( com_x, com_y, com_z, com_w );
        
    }

    /**
     * Returns the vector sum between this and other.
     * @param {Vec4} other 
     */
    add( other ) {
        // return the vector sum
        let com_x = this.x + other.x;
        let com_y = this.y + other.y;
        let com_z = this.z + other.z;
        let com_w = this.w + other.w;
        return new Vec4( com_x, com_y, com_z, com_w );
    }

    sub( other ) {
        return this.add( other.scaled( -1 ) );
    }

    cross( other ) {
        let x = this.y * other.z - this.z * other.y;
        let y = this.x * other.z - this.z * other.x;
        let z = this.x * other.y - this.y - other.x;

        return new Vec4( x, y, z, 0 );
    }
	
	toString() {
		return [ '[', this.x, this.y, this.z, this.w, ']' ].join( ' ' );
	}
}