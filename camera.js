class Camera {
    constructor( x, y, z, speed ) { // start camera in certain location
        this.position = new Vec4( x, y, z, 1 );
        this.pitch_amt = 0;
        this.yaw_amt = 0;
        this.roll_amt = 0;
        this.speed = speed
    }

    pitch( direction ) { 
        this.pitch_amt += direction * this.speed;
        if ( this.pitch_amt >= 0.25 ) { this.pitch_amt = 0.249; }
        if ( this.pitch_amt <= -0.25 ) { this.pitch_amt = -0.249; }
    }

    yaw( direction ) { 
        this.yaw_amt += direction * this.speed;
    }

    roll( direction ) { 
        this.roll_amt += direction * this.speed;
    }

    pan( direction ) { // x,y,z translations
        // get matrix and to get basis vectors
        let mat = this.get_matrix();
        let xvec = new Vec4( mat.data[0], mat.data[4], mat.data[8], mat.data[12] ).norm();
        let yvec = new Vec4( mat.data[1], mat.data[5], mat.data[9], mat.data[13] ).norm();
        let zvec = new Vec4( mat.data[2], mat.data[6], mat.data[10], mat.data[14] ).norm();

        if ( direction == 0 ) { // forward
            zvec = zvec.scaled( this.speed * 10 ); // scale by camera speed
            this.position = this.position.add( zvec ); // add to position
        }
        if ( direction == 1 ) { // left
            xvec = xvec.scaled( -this.speed * 10 ); // scale by -camera speed
            this.position = this.position.add( xvec ); // add to position
        }
        if ( direction == 2 ) { // back
            zvec = zvec.scaled( -this.speed * 10 ); // scale by -camera speed
            this.position = this.position.add( zvec ); // add to position
        }
        if ( direction == 3 ) { // right
            xvec = xvec.scaled( this.speed * 10 ); // scale by camera speed
            this.position = this.position.add( xvec ); // add to position
        }
        if ( direction == 4 ) { // up
            yvec = yvec.scaled( this.speed * 10 ); // scale by camera speed
            this.position = this.position.add( yvec ); // add to position

        }
        if ( direction == 5 ) { // down
            yvec = yvec.scaled( -this.speed * 10 ); // scale by -camera speed
            this.position = this.position.add( yvec ); // add to position
        }
    }

    get_matrix() {
        let pitch_mat = Mat4.rotation_yz( this.pitch_amt );
        let yaw_mat = Mat4.rotation_xz( this.yaw_amt );
        let roll_mat = Mat4.rotation_xy( this.roll_amt );
        let translation = Mat4.translation( this.position.x, this.position.y, this.position.z );
        return translation.mul( yaw_mat.mul( pitch_mat.mul( roll_mat )));
    }

    get_view() {
        return this.get_matrix().inverse();
    }
}