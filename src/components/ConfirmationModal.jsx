import React from 'react'
import { Fade, Slide } from 'react-awesome-reveal';

const ConfirmationModal = ({ open, completedTasks, dumpCompletedTasks, onClose }) => {
    if (!open) return null

    return (
        <div className="overlay-placeholder">
            <Fade className='position-absolute z-1000' duration={200} triggerOnce>
                <div className="overlay">
                    <Fade className='m-auto' duration={200} triggerOnce>
                        <Slide direction='up' duration={200} triggerOnce>
                            <div className="confirmation-modal">
                                <div className="box-title">Dump {completedTasks.length} {completedTasks.length === 1 ? "task" : "tasks" }?</div>
                                <hr className='w-100' />
                                <div className="flx-r gap-8 m-auto">
                                    <button onClick={() => { dumpCompletedTasks(); onClose() }} className="btn-primary wide">Yes</button>
                                    <button onClick={() => onClose()} className="btn-secondary wide">No</button>
                                </div>
                            </div>
                        </Slide>
                    </Fade>
                </div>
            </Fade>
        </div>
    )
}
export default ConfirmationModal;