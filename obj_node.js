class Node {
    constructor() { // start thing in certain location
        this.position = new Vec4( 0, 0, 0, 1 );
        this.scale = new Vec4( 1, 1, 1, 1 );
        this.pitch_amt = 0;
        this.yaw_amt = 0;
        this.roll_amt = 0;
        this.data = data;
    }

    get_matrix() {
        let pitch_mat = Mat4.rotation_yz( this.pitch_amt );
        let yaw_mat = Mat4.rotation_xz( this.yaw_amt );
        let roll_mat = Mat4.rotation_xy( this.roll_amt );
        let translation = Mat4.translation( this.position.x, this.position.y, this.position.z );
        return translation.mul( yaw_mat.mul( pitch_mat.mul( roll_mat )));
    }
}