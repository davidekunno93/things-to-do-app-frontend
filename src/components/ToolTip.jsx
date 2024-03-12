import React, { useState } from 'react'
import { Fade } from 'react-awesome-reveal'

const ToolTip = ({ open, toolTipFor, onClose }) => {
    if (!open) return null
    const { darkMode } = useContext(DataContext);
    const { mobileWidth } = useContext(DataContext);
    const [activeIndex, setActiveIndex] = useState(0)
    const toolTips = {
        'create task': {
            stepCount: 2,
        }
    }
    const [steps, setSteps] = useState({})
    let stepCount = 2
    let arr = [1, 2, 3, 4, 5]
    const [numberOfSteps, setNumberOfSteps] = useState(arr.slice(0, stepCount))
    const createTaskToolTip = {
        numberOfSteps: 2,
        steps: [
            {
                tip: "",
                imgUrl: ""
            },
            {
                tip: "",
                imgUrl: ""
            },
        ]
    }
    const updateIndex = (newIndex) => {
        setActiveIndex(newIndex)
    }
    const nextStep = () => {
        setActiveIndex(activeIndex + 1)
    }

    return (
        <div className="overlay-placeholder">
            <Fade delay={1000} duration={200} triggerOnce>
            <div className="overlay">
                <div className="toolTip-modal">



                    {/* modal title */}
                    <div className="box-title">Quick mentions!</div>
                    <hr className='w-100' />
                    {/* end modal title */}

                    {/* create task tooltip */}
                    <div className="carousel-window">
                        <div className="inner" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>

                            <div className="step">
                                <p className="m-0 font-jakarta"><strong>Tip:</strong> Use the <strong>Advanced Settings</strong> toggle in the <u>top right corner</u> to show more options for your task.</p>
                                <img src="https://i.imgur.com/cg7164J.png" alt="" className="img-largo m-auto" />
                            </div>
                            <div className="step">
                                <p className="m-0 font-jakarta"><strong>Tip:</strong> Use the priority button inside the task title entry box to mark your task as <span className="red-text bold600">high priority</span>.</p>
                                <img src="https://i.imgur.com/IQazenw.png" alt="" className="w-100 m-auto" />
                            </div>

                        </div>
                    </div>

                    <div className="dot-indicators flx-r gap-2 just-ce">
                        {numberOfSteps.map((dot, index) => {
                            let selected = activeIndex === index ? true : false
                            return <div key={index} onClick={() => updateIndex(index)} className={`${selected ? "dot-selected" : "dot"}`}></div>
                        })}

                    </div>
                    <div className="flx-r just-en">
                        {activeIndex === stepCount - 1 ?
                            <button onClick={() => onClose()} className="btn-primaryflex">Got it!</button>
                            :
                            <div onClick={() => nextStep()} className="align-all-items pointer btn-match-height hoverFade">
                                <p className="m-0 font-jakarta bold500">Next</p>
                                <span className="material-symbols-outlined medium ml-2">
                                    arrow_forward
                                </span>
                            </div>
                        }
                    </div>
                    {/* end create task tooltip */}


                </div>
            </div>
            </Fade>
        </div>
    )
}
export default ToolTip;