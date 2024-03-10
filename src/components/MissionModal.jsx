import React, { useContext } from 'react'
import { Fade } from 'react-awesome-reveal';
import { DataContext } from '../context/DataProvider';
import { Link } from 'react-router-dom';

const MissionModal = ({ open, currentMission, missionProgress, activateFeedbackAlert, onClose }) => {
    if (!open) return null
    const { setMissionsOn } = useContext(DataContext);
    const { darkMode } = useContext(DataContext);
    
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
                                <div className="flx-c position-bottom">
                                    <p className="m-0 position-bottom small"><strong className='red-text'>IMPORTANT:</strong> Keep these settings in view by clicking the mission reminder button at the <u>bottom right</u> of the page. <img src="https://i.imgur.com/XW1LyNm.png" alt="" className="img-xsmall v-top mx-1" /></p>
                                    {/* <img src="https://i.imgur.com/XW1LyNm.png" alt="" className="img-xsmall" /> */}
                                </div>
                                <div className="flx just-en">
                                    <button onClick={() => onClose()} className="btn-primaryflex mt-4 medium">Got it!</button>
                                </div>
                            </>
                        }
                        {currentMission === 2 &&
                            <>
                                <div className="title align-all-items gap-2">
                                    <img src="https://i.imgur.com/9wsBTFU.png" alt="" className="img-xsmall" />
                                    <div className="box-title">Edit task from Task bar</div>
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
                                <p className="position-bottom small"><strong className='red-text'>IMPORTANT:</strong> Keep these settings in view by clicking the mission reminder button at the <u>bottom right</u> of the page. <img src="https://i.imgur.com/XW1LyNm.png" alt="" className="img-xsmall v-top mx-1" /> </p>
                                <div className="flx just-en position-bottom">
                                    <button onClick={() => onClose()} className="btn-primaryflex mt-4 medium">Got it!</button>
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
                                <img src="https://i.imgur.com/o6Dd1Ti.png" alt="" className="img-fitWidth" />
                                <p className="position-bottom"><strong>Dump tasks</strong> to trade them in for points. Take note of <strong>how many points</strong> you are awarded at the <u>top of the navbar</u>.</p>
                                <div className="flx just-en position-bottom">
                                    <button onClick={() => onClose()} className="btn-primaryflex mt-4 medium">Got it!</button>
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
                                    <p className='m-0'>Please <strong>complete</strong> the <Link to='https://forms.gle/pyW3FSzaXkpfvFBE7' target='_blank'>User feedback survey
                                    <span className="material-symbols-outlined large v-bott mr-1">
                                                open_in_new
                                            </span></Link>
                                            so we can make this product better for users like you!</p>
                                    <p className="m-0 small mt-4 gray-text">P.S. Come back and explore the app afterwards but just know - when you refresh the page everything resets.</p>
                                </div>
                                <div className="flx just-ce position-bottom">
                                    <button onClick={() => { onClose(); activateFeedbackAlert(); setMissionsOn(false) }} className="btn-primaryflex">&nbsp;OK!&nbsp;</button>
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