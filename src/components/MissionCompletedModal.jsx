import React from 'react'
import { Fade, Slide } from 'react-awesome-reveal';

const MissionCompletedModal = ({ open, currentMission, setCurrentMission, closeMissionReminder, onClose }) => {
    if (!open) return null


    const nextMission = () => {
        if (currentMission === 3) {
            setCurrentMission(0)
        } else {
            setCurrentMission(currentMission + 1)
        }
    }

    return (
        <div className="overlay-placeholder">
            <Fade duration={200} delay={300} triggerOnce>
                <div className="overlay">
                    <Slide direction='up' duration={400} className='flx w-100' triggerOnce>
                        <div className="mission-completed-modal font-jakarta">
                            <div className="box-title">Mission Complete!</div>
                            <hr className='w-100' />
                            <img src="https://i.imgur.com/icGepnL.jpg" alt="" className="img-blown-up h-center" />
                            {currentMission === 1 &&
                                <p className="m-0 center-text"><u>Well Done!</u> Click the <strong>mission button</strong> <span className="material-symbols-outlined v-align">rocket</span> to see your next mission.</p>
                            }
                            {currentMission === 2 &&
                                <p className="m-0 center-text"><u>Sweet!</u> Hit the <strong>mission button</strong> <span className="material-symbols-outlined v-align">rocket</span> to see your final mission.</p>
                            }
                            {currentMission === 3 &&
                                <p className="m-0 center-text"><u>You rockstar, you!</u> All missions are complete. Hit the <strong>mission button</strong> <span className="material-symbols-outlined v-align">rocket</span> for one final request!</p>
                            }
                            <div className="flx-r just-ce position-bottom">
                                <button onClick={() => { onClose(); nextMission(); closeMissionReminder() }} className="btn-primaryflex">&nbsp;&nbsp;OK&nbsp;&nbsp;</button>
                            </div>
                        </div>
                    </Slide>
                </div>
            </Fade>
        </div>
    )
}
export default MissionCompletedModal;