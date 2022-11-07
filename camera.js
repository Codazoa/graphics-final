class Camera {
    constructor(x,y,z) { // start camera in certain location
        this.model = Mat4.translation( x, y, z ).mul( new Mat4() )
    }

    static pitch( amt ){ // yz rotations
        return this.model += Mat4.rotation_yz( amt );
    }

    static yaw( amt ) { // xz rotations
        this.model += Mat4.rotation_xz( amt );
    }

    static roll( amt ) { // xy rotations
        return this.model += Mat4.rotation_xy( amt );
    }

    static pan( x, y, z ) { // x,y,z translations
        return this.model += Mat4.translation( x, y, z );
    }

}