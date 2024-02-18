import React, { useContext, useState } from 'react'
import { Fade, Slide } from 'react-awesome-reveal';
import { DataContext } from '../context/DataProvider';

const WelcomeModal = ({ open, onClose }) => {
    if (!open) return null
    const { darkMode } = useContext(DataContext);
    
    let arr = [1, 2, 3, 4, 5]
    const itemCount = 3
    const dots = arr.slice(0, itemCount)
    const [activeIndex, setActiveIndex] = useState(0);

    const updateIndex = (newIndex) => {
        setActiveIndex(newIndex);
    }
    const nextStep = () => {
        setActiveIndex(activeIndex + 1);
    }

    return (
        <div className="overlay-placeholder">
            <Fade duration={200} delay={200} triggerOnce>
                <div className="overlay">
                    <Slide direction='up' duration={400} delay={100} className='flx w-100' triggerOnce>
                        <div className={`welcome-modal${darkMode ? "-dark" : ""} black-text`}>
                            <div className="box-title">We're so glad you're here!</div>
                            <hr className='w-100' />

                            <div className="carousel-window">
                                <div className="inner" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
                                    <div className="welcome-item">
                                        <img src="https://i.imgur.com/x8RwrxS.png" alt="" className="img-blown-up h-center mt-2" />
                                        <p className="m-0 font-jakarta large center-text mt-2 bold600">Thank you for being a test user of the <i>Things To-Do</i> web application!</p>
                                    </div>
                                    <div className="welcome-item">
                                        <img src="https://i.imgur.com/sOm576g.png" alt="" className="img-blown-up h-center mt-2" />
                                        <p className="m-0 font-jakarta large center-text mt-2">Feel free to explore, but first... you have <strong>3 missions</strong> to complete.</p>
                                    </div>
                                    <div className="welcome-item">
                                        <img src="https://i.imgur.com/rJWjBQh.png" alt="" className="img-blown-up h-center mt-2" />
                                        <p className="m-0 font-jakarta large center-text mt-2">Start by hitting the <strong>mission button</strong> <img src="https://i.imgur.com/la8ZiXg.png" alt="" className="img-xsmall v-bott mx-1" /> at the <u>top of the dashboard</u>!</p>
                                    </div>
                                </div>
                            </div>

                            <div className="dot-indicators gap-2 h-center mt-2">
                                {dots.map((dot, index) => {
                                    let selected = activeIndex === index ? true : false
                                    return <div key={index} onClick={() => updateIndex(index)} className={`${selected ? "dot-selected" : "dot"} ${selected && darkMode ? "dot-selected-dark" : ""}`}></div>
                                })}
                            </div>
                            <div className="flx-r just-en">
                                {activeIndex === itemCount - 1 ?
                                    <button onClick={() => onClose()} className={`btn-primaryflex${darkMode ? "-dark" : ""}`}>Ready!</button>
                                    :
                                    <div onClick={() => nextStep()} className="align-all-items pointer btn-match-height hoverFade">
                                        <p className="m-0 font-jakarta bold500">Next</p>
                                        <span className="material-symbols-outlined medium ml-2">
                                            arrow_forward
                                        </span>
                                    </div>
                                }
                            </div>
                        </div>
                    </Slide>
                </div>
            </Fade>
        </div>
    )
}
export default WelcomeModal;