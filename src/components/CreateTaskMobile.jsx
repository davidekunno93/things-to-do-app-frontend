import React, { useContext, useEffect, useRef, useState } from 'react'
import { Fade, Slide } from 'react-awesome-reveal';
import { DataContext } from '../context/DataProvider';

const CreateTaskMobile = ({ open, tasks, category, setTasks, onClose }) => {
    if (!open) return null
    const { darkMode } = useContext(DataContext);
    const { advancedSettingsOn, setAdvancedSettingsOn } = useContext(DataContext);


    const [taskCategory, setTaskCategory] = useState(category === "allTasks" || category === "myDay" || category === "upcoming" || category === "priority" || category === "overdue" || category === "completed" ? null : category)

    useEffect(() => {
        let categorySelected = document.getElementById('categorySelected')
        categorySelected.value = category === "allTasks" || category === "myDay" || category === "upcoming" || category === "priority" || category === "overdue" || category === "completed" ? "None" : category
    }, [])
    let taskLastInArr = Object.keys(tasks).slice(-1)
    const [newTask, setNewTask] = useState({
        id: taskLastInArr[0] ? parseInt(taskLastInArr[0]) + 1 : 1,
        myDay: false,
        taskName: "",
        category: category === "allTasks" || category === "myDay" || category === "upcoming" || category === "priority" || category === "overdue" || category === "completed" ? null : category,
        notes: null,
        highPriority: false,
        endDate: null,
        endTime: null,
        frequency: "Once",
        duration: "Medium",
        outdoors: false,
        location: null,
        participants: [], // [{uid: "", displayName: "", photoURL: ""}]
        steps: [], // [{number: "", desc: "", completed: ""}]
        progress: 0,
        completed: false,
        completionDate: null,
        dumped: false,
        pointsAwarded: null,
    })


    // category code
    const refCategoryMenu = useRef(null);
    const openCategoryMenu = () => {
        let menu = document.getElementById('categoryMenu')
        menu.classList.remove('hidden-o')
    }
    const closeCategoryMenu = () => {
        let menu = document.getElementById('categoryMenu')
        menu.classList.add('hidden-o')
    }
    const toggleCategoryMenu = () => {
        let menu = document.getElementById('categoryMenu')
        if (menu.classList.contains('hidden-o')) {
            openCategoryMenu()
        } else {
            closeCategoryMenu()
        }
    }
    const hideOnClickOutsideCategoryMenu = (e) => {
        if (refCategoryMenu.current && !refCategoryMenu.current.contains(e.target)) {
            closeCategoryMenu()
        }
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
    // steps code
    const [stepsList, setStepsList] = useState([
        {
            number: 1,
            desc: "",
            completed: false
        }
    ])
    const updateStep = (e, index) => {
        let stepsListCopy = [...stepsList]
        stepsListCopy[index].desc = e.target.value
        setStepsList(stepsListCopy)
    }
    const updateStepsList = (action, index) => {
        let stepsListCopy = [...stepsList]
        let modal = document.getElementById('create-task-mobile')
        let notes = document.getElementById('task-notes')
        if (action == "remove") {
            stepsListCopy.splice(index, 1)
            for (let i = 0; i < stepsListCopy.length; i++) {
                stepsListCopy[i].number = i + 1
            }
            if (stepsListCopy.length > 0) {
                let newModalHeight = modal.offsetHeight - 25
                let newNotesHeight = notes.offsetHeight - 25
                modal.style.height = newModalHeight + "px"
                notes.style.height = newNotesHeight + "px"
            }
        } else if (action == "add" && stepsList.length < 5) {
            stepsListCopy.push({
                number: stepsList.length + 1,
                desc: ""
            })
            setFocusOnNextStep(true);
            if (stepsListCopy.length > 1) {
                let newModalHeight = modal.offsetHeight + 25
                let newNotesHeight = notes.offsetHeight + 25
                modal.style.height = newModalHeight + "px"
                notes.style.height = newNotesHeight + "px"
            }
        }
        console.log(modal.offsetHeight)
        setStepsList(stepsListCopy)
        resetStepInputValues(stepsListCopy)

    }
    const [focusOnNextStep, setFocusOnNextStep] = useState(false);
    useEffect(() => {
        if (focusOnNextStep) {
            let nextStep = document.getElementById(`stepInput-${stepsList.length - 1}`)
            nextStep.focus()
        }
        setFocusOnNextStep(false);
    }, [stepsList])
    const resetStepInputValues = (stepsListCopy) => {
        // set input values on the page to be equal to those values in the stepsList passed thru as the argument
        for (let i = 0; i < stepsListCopy.length; i++) {
            let stepInput = document.getElementById(`stepInput-${i}`)
            if (stepInput) {
                stepInput.value = stepsListCopy[i].desc
            }
        }
    }


    return (
        <div className="overlay-placeholder">
            <Fade delay={100} duration={200} triggerOnce>
                <div className="overlay">
                    <Slide direction='up' duration={200} className='w-100 flx' triggerOnce>
                        <div id='create-task-mobile' className="create-task-mobile">
                            <div className="box-title">Create New Task</div>
                            <hr className='w-100' />

                            <div className="carousel-window">
                                <div className="inner" style={{ transform: `translateX(${advancedSettingsOn ? "-100%" : "0%"})` }}>
                                    <div className="carousel-item3 h-100">
                                        <div className="box-content flx-c gap-3 h-100 w-100">

                                            <div className="taskTitle">
                                                <label>Task Title</label><span className="red-text">*</span>
                                                <div className="flx-r">
                                                    <input type="text" className="input-box w-80" placeholder='What do you need to do?' />
                                                    <div className="select-btn position-right">
                                                        <span className="material-symbols-outlined m-auto">
                                                            exclamation
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="taskCategory taskMyDay flx-r gap-2">
                                                <div className="flx-c flx-1">
                                                    <label>Category</label>
                                                    <div className="categorySelections">
                                                        <p id="categorySelected" className="m-0">None</p>
                                                        <span className="material-symbols-outlined">expand_more</span>
                                                    </div>
                                                </div>
                                                <div className="flx-c flx-1">
                                                    <label>My Day</label>
                                                    <button className="btn-tertiary small">Add to My Day</button>
                                                </div>
                                            </div>

                                            <div className="taskNotes flx-c">
                                                <label>Notes</label>
                                                <textarea name="" id="task-notes" cols="30" rows="10" className="textarea-box" placeholder='Describe your task...'></textarea>
                                            </div>

                                            <div className="taskDate advancedSettings flx-c">

                                                <div className="taskDate flx-r gap-2">
                                                    <div className="flx-c flx-1">
                                                        <label>Date</label>
                                                        <div className="date-input-div position-relative">
                                                            <span className="material-symbols-outlined overlay-icon2">
                                                                event
                                                            </span>
                                                            <div className="date-input-box"></div>
                                                        </div>
                                                    </div>
                                                    <div className="flx-c flx-1">
                                                        <label>Time</label>
                                                        <div className="time-input-div position-relative">
                                                            <span className="material-symbols-outlined overlay-icon3">
                                                                schedule
                                                            </span>
                                                            <div className="hour-input-box flx-1"></div>

                                                        </div>
                                                    </div>
                                                </div>
                                                <div onClick={() => setAdvancedSettingsOn(true)} className="align-all-items gap-1 position-right">
                                                    <p className="m-0 small">Advanced Settings</p>
                                                    <span className="material-symbols-outlined medium mt-h">
                                                        settings
                                                    </span>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="carousel-item3 h-100">
                                        <div className="box-content flx-c h-100 w-100">

                                            <div className="task-setting frequency">
                                                <label>Frequency<span className="red-text">*</span></label>
                                                <div className="frequencyOptions flx-r">
                                                    {Object.keys(frequencySelection).map((option, index) => {
                                                        let selected = frequencySelection[option]
                                                        return <div key={index} onClick={() => { updateFrequencySelection(option); updateTaskFrequency(option) }} className={`small ${selected ? "underline-option-selected" : "underline-option-unselected"} ${darkMode ? selected ? "underline-option-selected-dark" : "underline-option-unselected-dark" : null}`}>{option}</div>
                                                    })}
                                                </div>
                                            </div>

                                            <div className="task-setting duration">
                                                <label>Duration<span className="red-text">*</span> <span onClick={() => { clearDurationSelection(); updateTaskDuration(null) }} className="clearBtn small">Clear</span> </label>
                                                <div className={`selection-box${darkMode ? "-dark" : ""}`}>
                                                    {Object.keys(durationSelection).map((option, index) => {
                                                        let selected = durationSelection[option]
                                                        return <div key={index} onClick={() => { updateDurationSelection(option); updateTaskDuration(option) }} className={`${selected ? "selection-selected" : "selection-unselected"} ${darkMode ? selected ? "selection-selected-dark" : "selection-unselected-dark" : ""}`}>
                                                            <p className="m-auto">{option}</p>
                                                        </div>
                                                    })}
                                                </div>
                                            </div>

                                            <div className="task-setting location">
                                                <label>Location</label>
                                                <div className="inputBox flx-c">
                                                    <span className="material-symbols-outlined overlay-icon">
                                                        location_on
                                                    </span>
                                                    <input onChange={(e) => updateTaskLocation(e)} type="text" className={`location-input-box${darkMode ? "-dark" : ""}`} placeholder='e.g. Home, 1722 Smith Ave. etc' />
                                                </div>
                                            </div>

                                            <div className="task-setting steps">
                                                <label>Steps</label>
                                                <div className="steps-column">
                                                    {stepsList.map((step, index) => {
                                                        return <div key={index} className="step-div">
                                                            <div className="overlay-icon2">{step.number})</div>
                                                            <input onKeyDown={(e) => e.key === "Enter" ? updateStepsList("add") : null} id={`stepInput-${index}`} onChange={(e) => updateStep(e, index)} type='input' className={`step-input-box${darkMode ? "-dark" : ""}`} autoComplete='off' />
                                                            <div className="closeBtn4 ml-1">
                                                                <span onClick={() => updateStepsList("remove", index)} className="material-symbols-outlined">
                                                                    close
                                                                </span>
                                                            </div>
                                                        </div>
                                                    })}


                                                    <div onClick={() => updateStepsList("add")} className={`addStep ${stepsList.length < 5 ? "pointer" : darkMode ? "faint-text-dark" : "faint-text"}`}>
                                                        {stepsList.length < 5 &&
                                                            <span className="material-symbols-outlined large v-align">
                                                                add
                                                            </span>
                                                        }
                                                        <p className="m-0 ml-1 small inline">{stepsList.length < 5 ? "Add step" : "Limit reached"}</p>
                                                    </div>

                                                </div>
                                            </div>

                                            <div className="flx-r position-bottom">
                                                <div onClick={() => setAdvancedSettingsOn(false)} className="align-all-items gap-1">
                                                    <span className="material-symbols-outlined medium mt-h">
                                                        settings
                                                    </span>
                                                    <p className="m-0 small">Basic Settings</p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="completeBtns flx-r gap-3 just-ce position-bottom">
                                <button onClick={() => { addTask() }} className={`btn-primary${darkMode ? "-dark" : ""}`}>Add Task</button>
                                <button onClick={() => onClose()} className={`btn-secondary${darkMode ? "-dark" : ""}`}>Cancel</button>
                            </div>

                        </div>
                    </Slide>
                </div>
            </Fade>
        </div>
    )
}
export default CreateTaskMobile;