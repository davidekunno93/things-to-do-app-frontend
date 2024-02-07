import React from 'react'
import { Fade } from 'react-awesome-reveal';

const MissionModal = ({ open, currentMission, missionProgress, activateFeedbackAlert, onClose }) => {
    if (!open) return null
    return (
        <div className="overlay-placeholder">
            <Fade duration={200}>
                <div className="overlay">
                    <div className="mission-modal font-jakarta black-text">

                        {currentMission === 1 &&
                            <>
                                <div className="title align-all-items gap-2">
                                    <img src="https://i.imgur.com/PvTpowR.png" alt="" className="img-xsmall" />
                                    <div className="box-title">Create a task...</div>
                                </div>
                                <hr className='w-100' />
                                {/* <p className="m-0 my-2">Your first mission is to create a task that has the following settings:</p> */}
                                <p className="m-0 my-2">{missionProgress[`mission-${currentMission}`].desc}</p>
                                <div className="flx-c ml-3">
                                    {/* <p className="m-0">&bull; <strong>Deadline:</strong> 1st February 2024 at 8:45PM</p>
                                    <p className="m-0">&bull; <strong>Frequency:</strong> Once</p>
                                    <p className="m-0">&bull; <strong>Duration:</strong> Medium</p>
                                    <p className="m-0">&bull; <strong>Outdoors:</strong> Yes</p>
                                    <p className="m-0">&bull; <strong>Steps:</strong> Create 3 steps for your task</p> */}
                                    {missionProgress[`mission-${currentMission}`].tasks.map((task, index) => {
                                        return <p key={index} className="m-0">&bull; <strong>{task.taskKey}:</strong> {task.taskValue}</p>
                                    })}
                                </div>
                                <p className="m-0 position-bottom small"><strong>Tip:</strong> Use the mission reminder button at the <u>bottom right</u> of the page to show the settings and check your progress.</p>
                                <div className="flx just-en">
                                    <button onClick={() => onClose()} className="btn-primaryflex mt-4">Got it!</button>
                                </div>
                            </>
                        }
                        {currentMission === 2 &&
                            <>
                                <div className="title align-all-items gap-2">
                                    <img src="https://i.imgur.com/9wsBTFU.png" alt="" className="img-xsmall" />
                                    <div className="box-title">Edit task from the Task bar</div>
                                </div>
                                <hr className='w-100' />
                                {/* <p className="m-0 my-2">On the dashboard click the icons on the Task bar to change the task's settings to:</p> */}
                                <p className="m-0 my-2">{missionProgress[`mission-${currentMission}`].desc}</p>
                                <div className="flx-c ml-3">
                                    {/* <p className="m-0">&bull; <strong>Priority:</strong> Set to high priority</p>
                                    <p className="m-0">&bull; <strong>My Day:</strong> Add task to 'My Day'</p>
                                    <p className="m-0">&bull; <strong>Deadline:</strong> 4th February 2024 at 10:00AM</p>
                                    <p className="m-0">&bull; <strong>Duration:</strong> Long</p>
                                    <p className="m-0">&bull; <strong>Outdoors:</strong> No</p> */}
                                    {missionProgress[`mission-${currentMission}`].tasks.map((task, index) => {
                                        return <p key={index} className="m-0">&bull; <strong>{task.taskKey}:</strong> {task.taskValue}</p>
                                    })}
                                </div>
                                <p className="m-0 position-bottom small"><strong>Tip:</strong> If you need to remind yourself of the task settings, click the mission reminder button at the <u>bottom right</u> of the page.</p>
                                <div className="flx just-en">
                                    <button onClick={() => onClose()} className="btn-primaryflex mt-4">Got it!</button>
                                </div>
                            </>
                        }
                        {currentMission === 3 &&
                            <>
                                <div className="title align-all-items gap-2">
                                    <img src="https://i.imgur.com/GQcgbs7.png" alt="" className="img-xsmall" />
                                    <div className="box-title">Dump your task</div>
                                </div>
                                <hr className='w-100' />
                                <p className="m-0 my-2">Mark your task as completed. Then navigate to <i>Completed tasks</i> <u>in the navbar</u>.</p>
                                <img src="https://i.imgur.com/PpnVOqb.png" alt="" className="img-fitWidth" />
                                <p className="m-0 position-bottom">Select <strong>dump completed tasks</strong> to trade in your task for points. Take note of <strong>how many points</strong> you are awarded at the <u>top of the navbar</u>.</p>
                                <div className="flx just-en">
                                    <button onClick={() => onClose()} className="btn-primaryflex mt-4">Got it!</button>
                                </div>
                            </>
                        }

                        {currentMission === 0 &&
                            <>
                                <div className="title align-all-items gap-2">
                                    <div className="box-title">Thank you!</div>
                                </div>
                                <hr className='w-100' />
                                <div className="flx-c align-c font-jakarta center-text">
                                    <p className="m-0 bold600">Your participation as a test user is greatly appreciated!</p>
                                    <img src="https://i.imgur.com/LELWYjJ.png" alt="" className="img-medium" />
                                    <p className='m-0'>Please <strong>complete the user feedback survey</strong> in order to let us know how we can make this product better for users like you!</p>
                                    <p className="m-0 small mt-4 gray-text">P.S. Come back and explore the app afterwards but just know - when you refresh the page everything resets.</p>
                                </div>
                                <div className="flx just-ce position-bottom">
                                    <button onClick={() => {onClose(); activateFeedbackAlert()}} className="btn-primaryflex">&nbsp;OK!&nbsp;</button>
                                </div>
                            </>
                        }


                    </div>
                </div>
            </Fade>
        </div>
    )
}
export default MissionModal;