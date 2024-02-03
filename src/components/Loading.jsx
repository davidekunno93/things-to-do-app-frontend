import React, { useEffect } from 'react'

const Loading = ({ open, fillContainer }) => {
    if (!open) return null
    useEffect(() => {
        let container = document.getElementById('container')
        container.classList.remove('hidden-o')
    }, [])



    return (
            <div id='container' className={`${fillContainer === true ? "loadingBox" : "loadingBox-overlay"} z-1000 hidden- `}>
                <div className="loading m-auto"></div>
            </div>
    )
}
export default Loading;