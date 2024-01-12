import React from 'react'

const CircularProgressBar = ({ width, height, percent }) => {


    return (
        <>
            <div className="flx-r align-c">
                <div className="progress-container" style={{ width: width ? width : "100px", height: height ? height : "100px" }}>
                    <div className="progress-circle" style={{ background: `conic-gradient(#55d400 ${percent ? percent * 3.6 : "3.6"}deg, gainsboro 0deg)` }}>
                        <div className="progress-wrapper">
                        </div>
                    </div>
                </div>
                <div className="ml-1 x-small">{percent ? percent : "0"}%</div>
            </div>
        </>
    )
}
export default CircularProgressBar;