import React from 'react'

export default function NotConnected() {
    return (
        <div className="container text-center bg-light my-5" style={{ borderRadius: 20 }}>
            <h1 className="mt-3 text-primary">Please Connect to LocalHost test network</h1>
            <hr />
            <img className="img-fluid h-50" src="img/cloud-data.png" alt="" />
        </div>
    )
}
