import React, { useState } from 'react'
import CircularProgressBar from '../components/CircularProgressBar'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'react-time-picker';
import DateTimePicker from 'react-datetime-picker';

const Scratch = () => {

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

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
        setFrequencySelection(newFrequencySelection)
    }
    const [frequencySelection, setFrequencySelection] = useState({
        "Once": true,
        "Daily": false,
        "Weekly": false,
        "Monthly": false,
        "Yearly": false
    })

    // duration code
    const updateDurationSelection = (option) => {
        let newDurationSelection = {
            "Short": false,
            "Medium": false,
            "Long": false
        }
        newDurationSelection[option] = true
        setDurationSelection(newDurationSelection)
    }
    const clearDurationSelection = () => {
        setDurationSelection({
            "Short": false,
            "Medium": false,
            "Long": false
        })
    }
    const [durationSelection, setDurationSelection] = useState({
        "Short": false,
        "Medium": true,
        "Long": false
    })

    const updateOutdoorSelection = (option) => {
        let newOutdoorSelection = ({
            "Yes": false,
            "No": false,
            "Partially": false
        })
        newOutdoorSelection[option] = true
        setOutdoorSelection(newOutdoorSelection)
    }
    const clearOutdoorSelection = () => {
        setOutdoorSelection({
            "Yes": false,
            "No": false,
            "Partially": false
        })
    }
    const [outdoorSelection, setOutdoorSelection] = useState({
        "Yes": false,
        "No": true,
        "Partially": false
    })

    // steps code
    const updateStep = (e, index) => {
        let stepsListCopy = [...stepsList]
        stepsListCopy[index].desc = e.target.value
        setStepsList(stepsListCopy)
    }
    const updateStepsList = (action, index) => {
        let stepsListCopy = [...stepsList]
        if (action == "remove") {
            stepsListCopy.splice(index, 1)
            for (let i = 0; i < stepsListCopy.length; i++) {
                stepsListCopy[i].number = i + 1
            }
        } else if (action == "add" && stepsList.length < 5) {
            stepsListCopy.push({
                number: stepsList.length + 1,
                desc: ""
            })
        }
        setStepsList(stepsListCopy)
        resetStepInputValues(stepsListCopy)

    }
    const resetStepInputValues = (stepsListCopy) => {
        for (let i = 0; i < stepsListCopy.length; i++) {
            let stepInput = document.getElementById(`stepInput-${i}`)
            stepInput.value = stepsListCopy[i].desc
        }
    }
    const [stepsList, setStepsList] = useState([
        {
            number: 1,
            desc: ""
        },
        {
            number: 2,
            desc: ""
        }
    ])


    const [selectedDate, setSelectedDate] = useState(null)


    return (
        <>
            <div className="page-container-right">
                <div className="create-task-box flx-c">
                    <p className="m-0">Create New Task</p>
                    <hr className='w-100' />
                    <div className="flx-r">
                        <div className="task-settings flx-2">
                            <div className="task-setting">
                                <label htmlFor='taskTitleInput' className="m-0 ml-1">Task title<span className="red-text">*</span></label>
                                <input id='taskTitleInput' type="input" className="input-box" />
                            </div>
                            <div className="task-setting">
                                <label className="m-0 ml-1">Category<span className="red-text">*</span></label>
                                {/* <input type="input" className="input-box" /> */}
                                <select name="categories" className='categorySelection' id="">
                                    <option value="">Home</option>
                                    <option value="">Car</option>
                                    <option value="">Health</option>
                                    <option value="">Create New Category</option>
                                </select>
                            </div>

                            <div className="task-setting">
                                <label htmlFor='descriptionInput' className="m-0 ml-1">Description</label>
                                <textarea id='descriptionInput' className="textarea-box" />
                            </div>
                            <div className="task-setting">
                                <div className="flx-r">
                                    <div className="task-date mr-5 flx-c">
                                        <label className="m-0 ml-1">Date or Deadline</label>
                                        <div className="date-input-div position-relative">
                                            <span className="material-symbols-outlined overlay-icon2">
                                                event
                                            </span>
                                            <input type="input" placeholder='dd-mmm-yyyy' className="date-input-box" />
                                        </div>
                                    </div>
                                    <div className="task-time flx-c">
                                        <label className="m-0 ml-1">Time</label>
                                        <div className="time-input-div position-relative">
                                            <span className="material-symbols-outlined overlay-icon2">
                                                schedule
                                            </span>
                                            <input type="input" placeholder='hh:mm' className="date-input-box" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="task-settings-advanced flx-1">
                            <div className="task-setting">
                                <p className="m-0 ml-1">Frequency<span className="red-text">*</span></p>
                                <div className="frequencyOptions flx-r">
                                    {Object.keys(frequencySelection).map((option, index) => {
                                        let selected = frequencySelection[option]
                                        return <div key={index} onClick={() => updateFrequencySelection(option)} className={`${selected ? "underline-option-selected" : "underline-option-unselected"}`}>{option}</div>
                                    })}
                                </div>
                            </div>
                            <div className="task-setting">
                                <p className="m-0 ml-1">Duration <span onClick={() => clearDurationSelection()} className="clearBtn small">Clear</span> </p>
                                <div className="selection-box">
                                    {Object.keys(durationSelection).map((option, index) => {
                                        let selected = durationSelection[option]
                                        return <div key={index} onClick={() => updateDurationSelection(option)} className={`${selected ? "selection-selected" : "selection-unselected"}`}>
                                            <p className="m-0 m-auto">{option}</p>
                                        </div>
                                    })}
                                </div>
                            </div>
                            <div className="task-setting">
                                <p className="m-0 ml-1">Task is outdoors? <span onClick={() => clearOutdoorSelection()} className="clearBtn small">Clear</span></p>
                                <div className="selection-box">
                                    {Object.keys(outdoorSelection).map((option, index) => {
                                        let selected = outdoorSelection[option]
                                        return <div key={index} onClick={() => updateOutdoorSelection(option)} className={`${selected ? "selection-selected" : "selection-unselected"}`}>
                                            <p className="m-0 m-auto">{option}</p>
                                        </div>
                                    })}
                                </div>
                            </div>
                            <div className="task-setting">
                                <p className="m-0 ml-1">Steps</p>
                                <div className="steps-column">
                                    {stepsList.map((step, index) => {
                                        return <div key={index} className="step-div">
                                            <div className="overlay-icon2">{step.number})</div>
                                            <input id={`stepInput-${index}`} onChange={(e) => updateStep(e, index)} type='input' className="step-input-box" />
                                            <div className="closeBtn4 ml-1">
                                                <span onClick={() => updateStepsList("remove", index)} className="material-symbols-outlined">
                                                    close
                                                </span>
                                            </div>
                                        </div>
                                    })}
                                    <div onClick={() => updateStepsList("add")} className="addStep">
                                        <span className="material-symbols-outlined large v-align">
                                            add
                                        </span>
                                        <p className="m-0 ml-1 small inline">Add step</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="completeBtns mt-3 flx-r">
                        <button className='btn-primary mr-3'>Add Task</button>
                        <button className='btn-secondary'>Cancel</button>
                    </div>
                </div>


                <div className="progress-container" style={{ width: "100px", height: "100px" }}>
                    <div className="progress-circle" style={{ background: "conic-gradient(#55d400 3.6deg, gainsboro 0deg)" }}>
                        <div className="progress-wrapper">
                            <div className="span">0%</div>
                        </div>
                    </div>
                </div>
                <CircularProgressBar width={150} height={150} percent={null} />

                <ReactDatePicker onChange={(date) => setSelectedDate(date)} selected={selectedDate} className='date-input-box' placeholderText='mm/dd/yyyy' value={selectedDate} />



            </div>
        </>
    )
}
export default Scratch;

