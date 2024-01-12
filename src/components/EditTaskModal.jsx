import React, { useContext, useEffect, useRef, useState } from 'react'
import { DataContext } from '../context/DataProvider'
import { Fade } from 'react-awesome-reveal'
import { format } from 'date-fns'
import ReactDatePicker from 'react-datepicker'

const EditTaskModal = ({ open, task, updateTask, onClose }) => {
    if (!open) return null
    useEffect(() => {
        let categorySelect = document.getElementById('categorySelect')
        categorySelect.value = task.category ? task.category : "No Category"
    }, [])
    const { userCategories, setUserCategories } = useContext(DataContext);
    const { advancedSettingsOn, setAdvancedSettingsOn } = useContext(DataContext);
    const [updatedTask, setUpdatedTask] = useState({
        id: task.id,
        myDay: task.myDay,
        taskName: task.taskName,
        category: task.category ? task.category : "No Category",
        notes: task.notes,
        highPriority: task.highPriority,
        endDate: task.endDate,
        endTime: task.endTime,
        frequency: task.frequency,
        duration: task.duration,
        outdoors: task.outdoors,
        participants: task.participants, // [{uid: "", displayName: "", photoURL: ""}]
        steps: task.steps, // [{number: "", desc: "", completed: ""}]
        progress: task.progress,
        completed: task.completed
    })

    const updateTaskName = (e) => {
        let updatedTaskCopy = { ...updatedTask }
        let taskName = e.target.value.trim()
        updatedTaskCopy.taskName = taskName.charAt(0).toUpperCase() + taskName.slice(1)
        setUpdatedTask(updatedTaskCopy)
    }
    const updateTaskCategory = (e) => {
        let updatedTaskCopy = { ...updatedTask }
        updatedTaskCopy.category = e.target.value
        setUpdatedTask(updatedTaskCopy)
    }
    // my day button code
    const toggleMyDay = () => {
        const myDayText = document.getElementById('myDayText')
        let updatedTaskCopy = { ...updatedTask }

        if (myDayText.innerHTML === "Add to My Day") {
            addToMyDay()
            updatedTaskCopy.myDay = true
        } else {
            removeFromMyDay()
            updatedTaskCopy.myDay = false
        }
        setUpdatedTask(updatedTaskCopy)
    }

    const updateTaskNotes = (e) => {
        let updatedTaskCopy = { ...updatedTask }
        updatedTaskCopy.notes = e.target.value
        setUpdatedTask(updatedTaskCopy)
    }
    const updateTaskPriority = () => {
        let priorityIcon = document.getElementById('priorityIcon')
        let updatedTaskCopy = { ...updatedTask }
        if (priorityIcon.classList.contains('noPriority')) {
            priorityIcon.classList.replace('noPriority', 'highPriority')
            updatedTaskCopy.highPriority = true;
        } else if (priorityIcon.classList.contains('highPriority')) {
            priorityIcon.classList.replace('highPriority', 'noPriority')
            updatedTaskCopy.highPriority = false;
        }
        setUpdatedTask(updatedTaskCopy);
    }
    const [selectedDate, setSelectedDate] = useState(task.endDate ? new Date(task.endDate) : null);
    const updateTaskEndDate = (date) => {
        let taskCopy = {...updatedTask}
        taskCopy.endDate = format(date, "MM/dd/yyyy")
        setUpdatedTask(taskCopy)
    }
    const updateTaskEndTime = () => {
        let taskCopy = {...updatedTask}
        if (selectedTime) {
            taskCopy.endTime = timify(selectedTime)+" "+timeOfDay
        } else {
            taskCopy.endTime = null
        }
        // console.log(taskCopy.endTime)
        setUpdatedTask(taskCopy)
    }
    const updateTaskFrequency = (option) => {
        let updatedTaskCopy = { ...updatedTask }
        updatedTaskCopy.frequency = option
        setUpdatedTask(updatedTaskCopy)
    }
    const updateTaskDuration = (option) => {
        let updatedTaskCopy = { ...updatedTask }
        if (option === null) {
            updatedTaskCopy.duration = null
        } else {
            updatedTaskCopy.duration = option
        }
        setUpdatedTask(updatedTaskCopy)
    }
    const updateTaskOutdoors = (option) => {
        let updatedTaskCopy = { ...updatedTask }
        if (!option) {
            updatedTaskCopy.outdoors = false;
        } else if (option === "Yes") {
            updatedTaskCopy.outdoors = true
        } else if (option === "No") {
            updatedTaskCopy.outdoors = false
        }
        setUpdatedTask(updatedTaskCopy)
    }
    const updateTaskParticipants = () => {

    }
    // add steps that aren't empty to updatedTask state
    const updateTaskSteps = () => {
        let updatedTaskCopy = { ...updatedTask }
        let n = 1
        // console.log(updatedTaskCopy.steps)
        updatedTaskCopy.steps = []
        for (let i = 0; i < stepsList.length; i++) {
            if (stepsList[i].desc.replace(/ /g, "") != "") {
                let desc = stepsList[i].desc.trim()
                updatedTaskCopy.steps.push({
                    number: n,
                    desc: desc.charAt(0).toUpperCase() + desc.slice(1),
                    completed: stepsList[i].completed
                })
                n++
            }
        }
        setUpdatedTask(updatedTaskCopy)
        // console.log(updatedTaskCopy)
        // The state change does not complete before the function has finished so the updated Task
        // is being transferred to the updateTask(bridged function) via return instead to circumvent the
        // latency - the updatedTask state doesn't mutate before firing the updateTask function in the bridge function
        return updatedTaskCopy
    }

    // update task function bridges from this component to updateTask in parent outside component 
    const updateTaskBridgeFunction = async () => {
        if (updatedTask.taskName) {
            let updatedTaskWithSteps = await updateTaskSteps()
            // see comment in updateTaskSteps function for why the updatedTask state can't be passed through
            await updateTask(updatedTaskWithSteps)
            onClose()
        } else {
            alert("Enter a title for your task")
        }
    }


    // my day code
    const addToMyDay = () => {
        const myDayBtn = document.getElementById('myDayBtn')
        const myDayText = document.getElementById('myDayText')
        const myDayIcon = document.getElementById('myDayIcon')
        myDayText.innerHTML = "Added to My Day"
        myDayText.classList.add("green-text")
        myDayIcon.classList.add("green-text")
        myDayIcon.innerHTML = "done"
    }
    const removeFromMyDay = () => {
        const myDayBtn = document.getElementById('myDayBtn')
        const myDayText = document.getElementById('myDayText')
        const myDayIcon = document.getElementById('myDayIcon')
        myDayText.innerHTML = "Add to My Day"
        myDayText.classList.remove("green-text")
        myDayIcon.classList.remove("green-text")
        myDayIcon.innerHTML = "sunny"
    }

    // time code
    const [selectedTime, setSelectedTime] = useState(null);
    const [timeOfDay, setTimeOfDay] = useState("PM")
    const updateSelectedTime = (time) => {
        if (time === "Clear") {
            let timeInput = document.getElementById('timeInput')
            timeInput.value = ""
            setSelectedTime(null)
        } else {
            setSelectedTime(time)
        }
    }
    useEffect(() => {
        updateTaskEndTime()
    }, [selectedTime, timeOfDay])

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
        if (option) {
            newDurationSelection[option] = true
        }
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

    // outdoors code
    const updateOutdoorSelection = (option) => {
        let newOutdoorSelection = ({
            "Yes": false,
            "No": false
        })
        newOutdoorSelection[option] = true
        setOutdoorSelection(newOutdoorSelection)
    }
    const clearOutdoorSelection = () => {
        setOutdoorSelection({
            "Yes": false,
            "No": false
        })
    }
    const [outdoorSelection, setOutdoorSelection] = useState({
        "Yes": false,
        "No": true
    })

    // steps code
    const updateStep = (e, index) => {
        let stepsListCopy = [...stepsList]
        stepsListCopy[index].desc = e.target.value
        setStepsList(stepsListCopy)
    }
    const updateStepsList = (action, index) => {
        let stepsListCopy = [...stepsList]
        if (action === "remove") {
            stepsListCopy.splice(index, 1)
            for (let i = 0; i < stepsListCopy.length; i++) {
                stepsListCopy[i].number = i + 1
            }
        } else if (action === "add" && stepsList.length < 5) {
            stepsListCopy.push({
                number: stepsList.length + 1,
                desc: ""
            })
        }
        setStepsList(stepsListCopy)
        if (action === "remove") {
            resetStepInputValues(stepsListCopy)
        }

    }
    const resetStepInputValues = (stepsListCopy) => {
        // set step input values on the page equal to those in the stepsListCopy passed thru as the argument
        for (let i = 0; i < stepsListCopy.length; i++) {
            let stepInput = document.getElementById(`stepInput-${i}`)
            stepInput.value = stepsListCopy[i].desc
        }
    }
    const [stepsList, setStepsList] = useState(task.steps)
    const [stepsListDemo, setStepsListDemo] = useState([
        {
            number: 1,
            desc: "",
            completed: false
        }
    ])








    // other code
    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
    // takes leading 0 off of time if any
    const timify = (time) => {
        if (time[0] === "0") {
            time = time.slice(1)
        }
        return time
    }
    const timifee = (timeWithPM) => {
        // goes from 3:00 PM to 03:00
        let time = timeWithPM.slice(0, -3).trim()
        if (time.length === 4) {
            time = "0"+time
        }
        return time
    }
    

    // advanced settings code
    useEffect(() => {
        if (advancedSettingsOn) {
            toggleAdvancedSettingsOn()
            // console.log('on')
        } else {
            toggleAdvancedSettingsOff()
            // console.log('off')
        }
    }, [])

    const toggleAdvancedSettingsOn = () => {
        const toggleIcon = document.getElementById('advancedSettingsToggleIcon')
        const settingsAdvanced = document.getElementById('taskSettingsAdvanced')
        const modal = document.getElementById('editTaskModal')

        setAdvancedSettingsOn(true)
        // console.log('advanced settings turned on')
        toggleIcon.innerHTML = "toggle_on"
        modal.style.width = "1024px"
        // toggleIcon.classList.remove('faint-text')
        settingsAdvanced.classList.remove('d-none')
        wait(300).then(() => {
            settingsAdvanced.classList.remove('o-none')
        })
    }
    const toggleAdvancedSettingsOff = () => {
        const toggleIcon = document.getElementById('advancedSettingsToggleIcon')
        const settingsAdvanced = document.getElementById('taskSettingsAdvanced')
        const modal = document.getElementById('editTaskModal')

        setAdvancedSettingsOn(false)
        // console.log('advanced settings turned off')
        toggleIcon.innerHTML = "toggle_off"
        settingsAdvanced.classList.add('d-none')
        modal.style.width = "640px"
        // toggleIcon.classList.add('faint-text')
        settingsAdvanced.classList.add('o-none')
    }
    const toggleAdvancedSettings = () => {
        const toggleIcon = document.getElementById('advancedSettingsToggleIcon')

        if (toggleIcon.innerHTML === "toggle_on") {
            toggleAdvancedSettingsOff()
        } else if (toggleIcon.innerHTML === "toggle_off") {
            toggleAdvancedSettingsOn()
        }
    }



    // load task details
    const loadTaskTitle = () => {
        const taskTitleInput = document.getElementById('taskTitleInput')
        taskTitleInput.value = task.taskName
    }
    const loadMyDay = () => {
        if (task.myDay) {
            addToMyDay()
        }
    }
    const loadTaskNotes = () => {
        const notesInput = document.getElementById('notesInput')
        notesInput.value = task.notes
    }
    // load priority
    const loadPriority = () => {
        const priorityIcon = document.getElementById('priorityIcon')
        if (task.highPriority) {
            priorityIcon.classList.replace('noPriority', 'highPriority')
        }
    }
    // load time
    const loadEndTime = () => {
        const timeInput = document.getElementById('timeInput')
        if (task.endTime) {
            timeInput.value = timifee(task.endTime)
            setSelectedTime(timifee(task.endTime))
            setTimeOfDay(task.endTime.slice(-2))
        }
    }
    // load duration
    const loadDuration = () => {
        updateDurationSelection(task.duration)
    }
    // load frequency
    const loadFrequency = () => {
        updateFrequencySelection(task.frequency)
    }
    // load outdoors
    const loadOutdoors = () => {
        if (task.outdoors) {
            setOutdoorSelection({
                "Yes": true,
                "No": false
            })
        }
    }
    // load steps
    const loadSteps = () => {
        for (let i = 0; i < task.steps.length; i++) {
            let stepInput = document.getElementById(`stepInput-${i}`)
            stepInput.value = task.steps[i].desc
        }
    }
    // load time and date
    // ...

    useEffect(() => {
        loadTaskTitle()
        loadMyDay()
        loadTaskNotes()
        loadPriority()
        // endDate loaded via selectedDate state
        loadEndTime()
        loadDuration()
        loadFrequency()
        loadOutdoors()
        loadSteps()
    }, [])



    // close modal on click outside
    const refModal = useRef(null)
    useEffect(() => {
        window.addEventListener('click', hideOnClickOutsideWindow, true)
    }, [])
    const hideOnClickOutsideWindow = (e) => {
        if (refModal.current && !refModal.current.contains(e.target)) {
            onClose()
        }
    }


    // testing code
    const printUpdatedTask = () => {
        console.log(updatedTask)
    }
    const printMe = (e) => {
        console.log(e.target.value)
        // console.log('do somink!')
    }
    const printTest = () => {
        console.log(tasks)
    }

    return (
        <>
            <div className="overlay-placeholder">
                <Fade fraction={0} className='position-absolute z-1000' duration={200} triggerOnce>
                    <div className="overlay">
                        <div ref={refModal} id='editTaskModal' className="edit-task-modal">
                            <div className="toggleAdvancedSettings flx-r">
                                <p className="m-0 mr-2">Advanced Settings {advancedSettingsOn ? "On" : "Off"} </p>
                                <span id='advancedSettingsToggleIcon' onClick={() => toggleAdvancedSettings()} className="material-symbols-outlined pointer">
                                    {/* {advancedSettingsOn ? "toggle_on" : "toggle_off"} */}
                                    toggle_on
                                </span>
                            </div>


                            <p className="m-0 x-large">Edit Task</p>
                            <hr className='w-100' />

                            <div className="flx-r">

                                <div className="task-settings flx-2">

                                    <div className="task-setting">
                                        <label htmlFor='taskTitleInput' className="m-0 ml-1">Task title<span className="red-text">*</span></label>
                                        <div className="input-div">
                                            <span onClick={() => updateTaskPriority()} id='priorityIcon' className="material-symbols-outlined overlay-icon-right pointer noPriority">
                                                priority_high
                                            </span>
                                            <input onChange={(e) => updateTaskName(e)} id='taskTitleInput' type="input" className="input-box" />
                                        </div>
                                    </div>

                                    <div className="task-setting">
                                        <label className="m-0 ml-1">Category<span className="red-text">*</span></label>
                                        {/* <input type="input" className="input-box" /> */}
                                        <div className="flx-r">
                                            <select onChange={(e) => updateTaskCategory(e)} name="categories" className='categorySelection' id="categorySelect">
                                                <option value="No Category">No Category</option>
                                                {userCategories ? userCategories.categoryOrder.map((categoryName, index) => {
                                                    let category = userCategories.categories[categoryName]
                                                    return <option key={index} value={category.categoryName}>{category.categoryName}</option>                              
                                                }): null}

                                                <option value="CreateNew">-- Create New Category --</option>
                                            </select>
                                            <button onClick={() => toggleMyDay()} id='myDayBtn' className="btn-tertiary my-day-button">
                                                <div className="align-all-items gap-2">
                                                    <p id='myDayText' className="m-0 font20">Add to My Day</p>
                                                    <span id='myDayIcon' className="material-symbols-outlined medium">
                                                        sunny
                                                    </span>
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="task-setting">
                                        <label htmlFor='notesInput' className="m-0 ml-1">Notes</label>
                                        <textarea onChange={(e) => updateTaskNotes(e)} id='notesInput' className="textarea-box2" />
                                    </div>

                                    <div className="task-setting">
                                        <div className="flx-r">
                                            <div className="task-date mr-5 flx-c">
                                                <label className="m-0 ml-1">Date or Deadline</label>
                                                <div className="date-input-div position-relative">
                                                    <span className="material-symbols-outlined overlay-icon2">
                                                        event
                                                    </span>
                                                    <ReactDatePicker onChange={(date) => {setSelectedDate(date); updateTaskEndDate(date)}} selected={selectedDate} value={selectedDate} placeholderText='mm/dd/yyyy' className="date-input-box" />
                                                </div>
                                            </div>
                                            <div className="task-time flx-c">
                                                <label className="m-0 ml-1">Time</label>
                                                <div className="time-input-div position-relative">
                                                    <span className="material-symbols-outlined overlay-icon3">
                                                        schedule
                                                    </span>
                                                    <div className="time-picker-box">
                                                        {selectedTime && timeOfDay === "AM" &&
                                                            <div onClick={() => setTimeOfDay("PM")} className="overlay-am">AM</div>
                                                        }
                                                        {selectedTime && timeOfDay === "PM" &&
                                                            <div onClick={() => setTimeOfDay("AM")} className="overlay-pm">PM</div>
                                                        }
                                                        <select onChange={(e) => updateSelectedTime(e.target.value)} name="time-picker" id="timeInput" className='time-input-box' required>
                                                            <option value="" disabled selected hidden>hh:mm</option>
                                                            <option value="Clear">Clear</option>
                                                            <option value="12:00">12:00</option>
                                                            <option value="12:15">12:15</option>
                                                            <option value="12:30">12:30</option>
                                                            <option value="12:45">12:45</option>
                                                            <option value="01:00">01:00</option>
                                                            <option value="01:15">01:15</option>
                                                            <option value="01:30">01:30</option>
                                                            <option value="01:45">01:45</option>
                                                            <option value="02:00">02:00</option>
                                                            <option value="02:15">02:15</option>
                                                            <option value="02:30">02:30</option>
                                                            <option value="02:45">02:45</option>
                                                            <option value="03:00">03:00</option>
                                                            <option value="03:15">03:15</option>
                                                            <option value="03:30">03:30</option>
                                                            <option value="03:45">03:45</option>
                                                            <option value="04:00">04:00</option>
                                                            <option value="04:15">04:15</option>
                                                            <option value="04:30">04:30</option>
                                                            <option value="04:45">04:45</option>
                                                            <option value="05:00">05:00</option>
                                                            <option value="05:15">05:15</option>
                                                            <option value="05:30">05:30</option>
                                                            <option value="05:45">05:45</option>
                                                            <option value="06:00">06:00</option>
                                                            <option value="06:15">06:15</option>
                                                            <option value="06:30">06:30</option>
                                                            <option value="06:45">06:45</option>
                                                            <option value="07:00">07:00</option>
                                                            <option value="07:15">07:15</option>
                                                            <option value="07:30">07:30</option>
                                                            <option value="07:45">07:45</option>
                                                            <option value="08:00">08:00</option>
                                                            <option value="08:15">08:15</option>
                                                            <option value="08:30">08:30</option>
                                                            <option value="08:45">08:45</option>
                                                            <option value="09:00">09:00</option>
                                                            <option value="09:15">09:15</option>
                                                            <option value="09:30">09:30</option>
                                                            <option value="09:45">09:45</option>
                                                            <option value="10:00">10:00</option>
                                                            <option value="10:15">10:15</option>
                                                            <option value="10:30">10:30</option>
                                                            <option value="10:45">10:45</option>
                                                            <option value="11:00">11:00</option>
                                                            <option value="11:15">11:15</option>
                                                            <option value="11:30">11:30</option>
                                                            <option value="11:45">11:45</option>

                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                </div>
                                <div id='taskSettingsAdvanced' className="task-settings-advanced flx-1">
                                    <div className="task-setting">
                                        <p className="m-0 ml-1">Frequency<span className="red-text">*</span></p>
                                        <div className="frequencyOptions flx-r">
                                            {Object.keys(frequencySelection).map((option, index) => {
                                                let selected = frequencySelection[option]
                                                return <div key={index} onClick={() => { updateFrequencySelection(option); updateTaskFrequency(option) }} className={`${selected ? "underline-option-selected" : "underline-option-unselected"}`}>{option}</div>
                                            })}
                                        </div>
                                    </div>

                                    <div className="task-setting">
                                        <p className="m-0 ml-1">Duration <span onClick={() => { clearDurationSelection(); updateTaskDuration(null) }} className="clearBtn small">Clear</span> </p>
                                        <div className="selection-box">
                                            {Object.keys(durationSelection).map((option, index) => {
                                                let selected = durationSelection[option]
                                                return <div key={index} onClick={() => { updateDurationSelection(option); updateTaskDuration(option) }} className={`${selected ? "selection-selected" : "selection-unselected"}`}>
                                                    <p className="m-0 m-auto">{option}</p>
                                                </div>
                                            })}
                                        </div>
                                    </div>

                                    <div className="task-setting">
                                        <p className="m-0 ml-1">Task is outdoors?
                                            {/* <span onClick={() => { clearOutdoorSelection(); updateTaskOutdoors() }} className="clearBtn small">Clear</span> */}
                                        </p>
                                        <div className="selection-box">
                                            {Object.keys(outdoorSelection).map((option, index) => {
                                                let selected = outdoorSelection[option]
                                                return <div key={index} onClick={() => { updateOutdoorSelection(option); updateTaskOutdoors(option) }} className={`${selected ? "selection-selected" : "selection-unselected"}`}>
                                                    <p className="m-0 m-auto">{option}</p>
                                                </div>
                                            })}
                                        </div>
                                    </div>

                                    <div className="task-setting">
                                        <p className="m-0 ml-1">Steps</p>
                                        <div className="steps-column">
                                            {stepsList.map((step, stepIndex) => {
                                                return <div key={stepIndex} className="step-div">
                                                    <div className="overlay-icon2">{step.number})</div>
                                                    <input id={`stepInput-${stepIndex}`} onChange={(e) => updateStep(e, stepIndex)} type='input' className="step-input-box" />
                                                    <div className="closeBtn4 ml-1">
                                                        <span onClick={() => updateStepsList("remove", stepIndex)} className="material-symbols-outlined">
                                                            close
                                                        </span>
                                                    </div>
                                                </div>
                                            })}


                                            <div onClick={() => updateStepsList("add")} className={`addStep ${stepsList.length < 5 ? "pointer" : "faint-text"}`}>
                                                {stepsList.length < 5 &&
                                                    <span className="material-symbols-outlined large v-align">
                                                        add
                                                    </span>
                                                }
                                                <p className="m-0 ml-1 small inline">{stepsList.length < 5 ? "Add step" : "Limit reached"}</p>
                                            </div>


                                        </div>
                                    </div>



                                </div>



                            </div>

                            <div className="completeBtns mt-3 flx-r">
                                <button onClick={() => updateTaskBridgeFunction()} className='btn-primary mr-3'>Update</button>
                                <button onClick={() => onClose()} className='btn-secondary'>Cancel</button>
                                <div className="task-setting-participants position-right">
                                    <p className="m-0">Participants</p>
                                    <div className="participants-box">

                                        <div className="added-participant ap-big-0" style={{ width: "42px", height: "42px" }}>
                                            {/* <div className="ap-popUp-name">Kratos</div> */}
                                            <div className="circle">
                                                <img src="https://i.imgur.com/DQYEvlo.png" alt="" className="img-fitWidth" />
                                            </div>
                                        </div>
                                        <div className="ap-placeholder-big-0"></div>
                                        <div className="added-participant ap-big-1" style={{ width: "42px", height: "42px" }}>

                                            <div className="circle">
                                                <img src="https://i.imgur.com/VUls43t.png" alt="" className="img-fitWidth" />
                                            </div>
                                        </div>
                                        <div className="ap-placeholder-big"></div>
                                        <div className="added-participant ap-big-2" style={{ width: "42px", height: "42px" }}>
                                            <div className="circle">
                                                <img src="https://i.imgur.com/6e0sJVI.png" alt="" className="img-fitWidth" />
                                            </div>
                                        </div>
                                        <div className="ap-placeholder-big"></div>
                                        <div className="more-participants">
                                            <p className="m-0 mr-1 pointer"><strong>+4</strong></p>
                                        </div>





                                        <div className="add-participant" style={{ width: "42px", height: "42px" }}>
                                            <div className="circle">
                                                <span className="material-symbols-outlined x-large">
                                                    add
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>


                    </div>
                </Fade>
            </div>

        </>
    )
}
export default EditTaskModal;