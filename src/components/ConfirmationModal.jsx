import React, { useContext } from 'react'
import { Fade, Slide } from 'react-awesome-reveal';
import { DataContext } from '../context/DataProvider';

const ConfirmationModal = ({ open, completedTasks, selectedForDump, dumpSelectedTasks, onClose }) => {
    if (!open) return null
    const { darkMode } = useContext(DataContext);
    const { mobileWidth } = useContext(DataContext);

    return (
        <div className="overlay-placeholder">
            <Fade className='position-absolute z-1000' duration={200} triggerOnce>
                <div className="overlay">
                    <Fade className='m-auto' duration={200} triggerOnce>
                        <Slide direction='up' duration={200} triggerOnce>
                            <div className={`confirmation-modal${darkMode ? "-dark" : ""}`}>
                                <div className={`box-title${darkMode ? "-dark" : ""}`}>Dump {selectedForDump.length} {selectedForDump.length === 1 ? "task" : "tasks" }?</div>
                                <hr className='w-100' />
                                <div className={`flx-r ${mobileWidth ? "gap-4" : "gap-8"} m-auto`}>
                                    <button onClick={() => { dumpSelectedTasks(); onClose() }} className={`btn-primary${darkMode ? "-dark" : ""} wide`}>Yes</button>
                                    <button onClick={() => onClose()} className={`btn-secondary${darkMode ? "-dark" : ""} wide`}>No</button>
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