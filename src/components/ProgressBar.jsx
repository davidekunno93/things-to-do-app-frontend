import React, { useEffect } from 'react'

const ProgressBar = ({ percent, progress, total, width, height }) => {
    if (!percent) {
        percent = Math.round(progress*100 / total)
    }
    useEffect(() => {
        // console.log(percent)
    }, [])
    return (
        <div className="progressBar-box" style={{ width: width? width : 180, height: height ? height : 30 }}>
            <div className="progressBar-empty">
                <div className="progressBar-full" style={{ width: percent ? percent+"%" : "87%" }}>
                    
                </div>
            </div>
            <div className="progressBar-reading">
                <p className="m-0">{progress ? progress : "87" } / {total ? total : "100" }</p>
            </div>
        </div>
    )
}
export default ProgressBar