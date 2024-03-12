import React, { useContext, useState } from 'react'
import { Fade } from 'react-awesome-reveal'
import { Link } from 'react-router-dom'
import { DataContext } from '../context/DataProvider'

const FeedbackModal = ({ open, deactivateFeedbackAlert, onClose }) => {
    if (!open) return null
    const { darkMode } = useContext(DataContext);
    const { mobileWidth } = useContext(DataContext);
    const [text, setText] = useState("");
    const [sentFeedback, setSentFeedback] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    function wait(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    const sendFeedback = async () => {
        if (text) {

            // send text to backend database - set isLoading true while sending

            // show thank you message if response from backend says it went through
            setIsLoading(false)
            setSentFeedback(true)
            // close modal
            wait(3000).then(() => {
                let screen = document.getElementById('overlayPlaceholder')
                screen.classList.add('hidden-o')
                wait(400).then(() => {
                    onClose()
                })
            })
        } else {
            let error = document.getElementById('noTextError')
            error.classList.remove('hidden-o')
        }
    }

    const closeFeedbackModal = () => {
        setSentFeedback(true)
        wait(3000).then(() => {
            let screen = document.getElementById('overlayPlaceholder')
            screen.classList.add('hidden-o')
            wait(400).then(() => {
                onClose()
            })
        })
    }

    return (
        <>
            <div id='overlayPlaceholder' className="overlay-placeholder">
                <Fade duration={200} fraction={0} triggerOnce>
                    <div className="overlay">
                        <div className={`feedback-modal ${mobileWidth && "feedback-modal-mobile"}`}>
                            {!isLoading && !sentFeedback &&
                                <div className="flx-c h-100">
                                    <div className="align-all-items just-ce">
                                        <p className={`m-0 box-title ${mobileWidth && "box-title-mobile"}`}>Feedback is always appreciated</p>
                                        <img src="https://i.imgur.com/YIcdeNr.png" alt="" className="img-xsmall ml-2" />
                                    </div>
                                    <hr className='w-100'/>
                                    <p className={`m-0 font-jakarta center-text ${mobileWidth ? "medium" : "large"}`}>Click the link to take the feedback Survey!</p>
                                    <Link to='https://forms.gle/pyW3FSzaXkpfvFBE7' target='_blank'>
                                        <div className="align-all-items gap-1 just-ce my-2">
                                            <p className="m-0 ml-2 large">Feedback Survey</p>
                                            <span className="material-symbols-outlined large mt-h">
                                                open_in_new
                                            </span>
                                        </div>
                                    </Link>
                                    <img src="https://i.imgur.com/VLhHJFU.png" alt="" className="img-large h-center" />
                                    {/* <p id='noTextError' className="m-0 mt-3 red-text small hidden-o">*Please enter feedback in text area*</p>
                                    <textarea onChange={(e) => setText(e.target.value)} name="" id="" className='textarea-box' style={{ height: '100px' }} placeholder='It would be cool if...'></textarea>
                                    <p className="m-0 font-jakarta small">All feedback is <strong>anonymous</strong> and is only viewed by myself, the creator of <i>'Things to-do'</i></p> */}
                                    <div className="flx-r gap-3 mt-4 position-bottom just-ce">
                                        <button onClick={() => {deactivateFeedbackAlert(); closeFeedbackModal()}} className="btn-primary">Done</button>
                                        <button onClick={() => onClose()} className="btn-secondary">Cancel</button>
                                    </div>
                                </div>
                            }
                            {isLoading &&
                                <div className="loadingBox">
                                    <div className="loading m-auto"></div>
                                </div>
                            }
                            {!isLoading && sentFeedback &&
                                <div className="flx-c align-c just-ce h-100">
                                    <div className={`flx-r ${mobileWidth ? "large" : "x-large"} font-jakarta-strong`}>
                                        <Fade duration={100} cascade triggerOnce>
                                            <p className="m-0">T</p>
                                            <p className="m-0">h</p>
                                            <p className="m-0">a</p>
                                            <p className="m-0">n</p>
                                            <p className="m-0">k</p>
                                            <p className="m-0">&nbsp;</p>
                                            <p className="m-0">y</p>
                                            <p className="m-0">o</p>
                                            <p className="m-0">u</p>
                            
                                            <p className="m-0">&nbsp;</p>
                                            <p className="m-0">f</p>
                                            <p className="m-0">o</p>
                                            <p className="m-0">r</p>
                                            <p className="m-0">&nbsp;</p>
                                            <p className="m-0">y</p>
                                            <p className="m-0">o</p>
                                            <p className="m-0">u</p>
                                            <p className="m-0">r</p>
                                            <p className="m-0">&nbsp;</p>
                                            <p className="m-0">f</p>
                                            <p className="m-0">e</p>
                                            <p className="m-0">e</p>
                                            <p className="m-0">d</p>
                                            <p className="m-0">b</p>
                                            <p className="m-0">a</p>
                                            <p className="m-0">c</p>
                                            <p className="m-0">k</p>
                                            <p className="m-0">!</p>
                                        </Fade>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </Fade>
            </div>
        </>
    )
}
export default FeedbackModal;