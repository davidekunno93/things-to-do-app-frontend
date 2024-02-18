import React, { useContext, useEffect, useState } from 'react'
import { Fade, Slide } from 'react-awesome-reveal'
import ReactDatePicker from 'react-datepicker'
import { DataContext } from '../context/DataProvider'

const QuickUpdateModal = ({ open, quickTaskUpdates, dumpCompletedTasks, taskId, db_task_id, detail, option, onClose }) => {
    if (!open) return null
    const { darkMode } = useContext(DataContext);
    
    // useEffect(() => {
    //     console.log("detail: " + detail + ", option: " + option)
    // }, [])
    const quickUpdate = quickTaskUpdates

    // frequency code
    const updateFrequencySelection = (option) => {
        let newFrequencySelection = {
            "Once": false,
            "Daily": false,
            "Weekly": false,
            "Monthly": false,
            "Yearly": false
        }
        newFrequencySelection[option] = true
        quickUpdate.updateFrequency(taskId, option)
        setFrequencySelection(newFrequencySelection)
    }
    const [frequencySelection, setFrequencySelection] = useState({
        "Once": option === "Once" ? true : false,
        "Daily": option === "Daily" ? true : false,
        "Weekly": option === "Weekly" ? true : false,
        "Monthly": option === "Monthly" ? true : false,
        "Yearly": option === "Yearly" ? true : false
    })

    // duration code
    const updateDurationSelection = (option) => {
        let newDurationSelection = {
            "Short": false,
            "Medium": false,
            "Long": false
        }
        newDurationSelection[option] = true
        quickUpdate.updateDuration(taskId, option)
        setDurationSelection(newDurationSelection)
    }
    const clearDurationSelection = () => {
        setDurationSelection({
            "Short": false,
            "Medium": false,
            "Long": false
        })
        quickUpdate.updateDuration(taskId, null)
    }
    const [durationSelection, setDurationSelection] = useState({
        "Short": option === "Short" ? true : false,
        "Medium": option === "Medium" ? true : false,
        "Long": option === "Long" ? true : false
    })


    const [modal, setModal] = useState({
        width: 500,
        height: detail === "frequency" || detail === "delete" ? 150 : 250
    })



    // other functions
    const capitalizeIt = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    return (
        <>
            <div className="overlay-placeholder">
                <Fade className='position-absolute z-1000' duration={200} triggerOnce>
                    <div className="overlay">
                        <Fade className='m-auto' duration={200} triggerOnce>
                            <Slide direction='up' duration={200} triggerOnce>
                                <div className="quick-update-modal" style={{ width: modal.width, height: modal.height }}>
                                    <div onClick={() => onClose()} className="closeBtn3">
                                        <span className="material-symbols-outlined">
                                            close
                                        </span>
                                    </div>


                                    <p className="m-0 box-title">{detail === 'delete' ? "Are you sure?" : "Update " + capitalizeIt(detail)}</p>
                                    <hr className='w-100' />
                                    {/* Change duration */}
                                    {detail === "duration" &&
                                        <>
                                            <span onClick={() => { clearDurationSelection() }} className="clearBtn aligns-r small">Clear</span>
                                            <div className="box-after-title w-100 position-bottom2">
                                                <div className="durationIcon-select flx-r w-100 just-se">
                                                    <span onClick={() => { updateDurationSelection("Short") }} className={`material-symbols-outlined pointer durationIcon-big ${durationSelection.Short ? "selected" : "unselected"}`}>
                                                        clock_loader_20
                                                    </span>
                                                    <span onClick={() => { updateDurationSelection("Medium") }} className={`material-symbols-outlined pointer durationIcon-big mx16 ${durationSelection.Medium ? "selected" : "unselected"}`}>
                                                        clock_loader_40
                                                    </span>
                                                    <span onClick={() => { updateDurationSelection("Long") }} className={`material-symbols-outlined pointer durationIcon-big ${durationSelection.Long ? "selected" : "unselected"}`}>
                                                        clock_loader_90
                                                    </span>
                                                </div>
                                                <div className="selection-box">
                                                    {Object.keys(durationSelection).map((option, index) => {
                                                        let selected = durationSelection[option]
                                                        return <div key={index} onClick={() => { updateDurationSelection(option) }} className={`${selected ? "selection-selected" : "selection-unselected"}`}>
                                                            <p className="m-0 m-auto">{option}</p>
                                                        </div>
                                                    })}
                                                </div>
                                            </div>
                                        </>
                                    }
                                    {/* End change duration */}

                                    {/* Change frequency */}
                                    {detail === "frequency" &&
                                        <>
                                            <div className="m-auto">
                                                <div className="frequencyOptions flx-r">
                                                    {Object.keys(frequencySelection).map((option, index) => {
                                                        let selected = frequencySelection[option]
                                                        return <div key={index} onClick={() => { updateFrequencySelection(option) }} className={`${selected ? "underline-option-selected" : "underline-option-unselected"}`}>{option}</div>
                                                    })}
                                                </div>
                                            </div>
                                        </>
                                    }
                                    {/* End change frequency */}

                                    {/* Delete task */}
                                    {detail === 'delete' &&
                                        <div className="flx-r gap-8 m-auto">
                                            <button onClick={() => { quickUpdate.remove(taskId, db_task_id); onClose() }} className="btn-primary wide">Yes</button>
                                            <button onClick={() => onClose()} className="btn-secondary wide">No</button>
                                        </div>
                                    }
                                    {/* End delete task */}

                                </div>
                            </Slide>
                        </Fade>
                    </div >
                </Fade>
            </div>
        </>
    )
}
export default QuickUpdateModal;