import React, { useContext, useEffect, useRef, useState } from 'react'
import { DataContext } from '../context/DataProvider'
import { Fade } from 'react-awesome-reveal'
import { format } from 'date-fns'
import ReactDatePicker from 'react-datepicker'

const EditTaskModal = ({ open, task, updateTask, onClose }) => {
    if (!open) return null
    useEffect(() => {
        let categorySelected = document.getElementById('categorySelected')
        categorySelected.innerHTML = task.category ? task.category : "None"
    }, [])
    const { userCategories, setUserCategories } = useContext(DataContext);
    const { advancedSettingsOn, setAdvancedSettingsOn } = useContext(DataContext);
    const { darkMode } = useContext(DataContext);
    const [updatedTask, setUpdatedTask] = useState({
        id: task.id,
        myDay: task.myDay,
        taskName: task.taskName,
        category: task.category ? task.category : "None",
        notes: task.notes,
        highPriority: task.highPriority,
        endDate: task.endDate,
        endTime: task.endTime,
        frequency: task.frequency,
        duration: task.duration,
        outdoors: task.outdoors,
        location: task.location,
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
        let categorySelected = document.getElementById('categorySelected')
        categorySelected.innerHTML = e.target.innerHTML
        let updatedTaskCopy = { ...updatedTask }
        updatedTaskCopy.category = e.target.innerHTML
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
        let priorityBtn = document.getElementById('priorityBtn')
        let updatedTaskCopy = { ...updatedTask }
        if (priorityBtn.classList.contains('noPriority')) {
            priorityBtn.classList.replace('noPriority', 'highPriority')
            updatedTaskCopy.highPriority = true;
        } else if (priorityBtn.classList.contains('highPriority')) {
            priorityBtn.classList.replace('highPriority', 'noPriority')
            updatedTaskCopy.highPriority = false;
        }
        setUpdatedTask(updatedTaskCopy);
    }
    const [selectedDate, setSelectedDate] = useState(task.endDate ? new Date(task.endDate) : null);
    const clearEndDate = () => {
        setSelectedDate(null)
        updateTaskEndDate(null)
    }
    const updateTaskEndDate = (date) => {
        let taskCopy = { ...updatedTask }
        if (date) {
            taskCopy.endDate = format(date, "MM/dd/yyyy")
        } else {
            taskCopy.endDate = null
        }
        setUpdatedTask(taskCopy)
    }
    const updateTaskEndTime = () => {
        let taskCopy = { ...updatedTask }
        if (selectedHour && selectedMinute) {
            taskCopy.endTime = timify(selectedHour + ":" + selectedMinute) + " " + timeOfDay
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
    // const updateTaskOutdoors = (option) => {
    //     let updatedTaskCopy = { ...updatedTask }
    //     if (!option) {
    //         updatedTaskCopy.outdoors = false;
    //     } else if (option === "Yes") {
    //         updatedTaskCopy.outdoors = true
    //     } else if (option === "No") {
    //         updatedTaskCopy.outdoors = false
    //     }
    //     setUpdatedTask(updatedTaskCopy)
    // }
    const updateTaskLocation = (e) => {
        let updatedTaskCopy = { ...updatedTask }
        if (e.target.value.trim() === "") {
            updatedTaskCopy.location = null
        } else {
            let location = e.target.value.trim()
            updatedTaskCopy.location = location.charAt(0).toUpperCase() + location.slice(1)
        }
        console.log(updatedTaskCopy.location)
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

    // time code
    const [selectedHour, setSelectedHour] = useState(null)
    const [selectedMinute, setSelectedMinute] = useState(null)
    const [timeOfDay, setTimeOfDay] = useState("PM")
    const clearSelectedTime = () => {
        let hour = document.getElementById('hourInput')
        let minute = document.getElementById('minuteInput')
        hour.value = ""
        minute.value = ""
        setSelectedHour(null)
        setSelectedMinute(null)
    }
    const wakeUpMinutes = () => {
        let minute = document.getElementById('minuteInput')
        if (!selectedMinute) {
            minute.value = "00"
            setSelectedMinute("00")
        }
    }
    const wakeUpHours = () => {
        let hour = document.getElementById('hourInput')
        if (!selectedHour) {
            hour.value = "12"
            setSelectedHour("12")
        }
    }
    useEffect(() => {
        updateTaskEndTime()
    }, [selectedHour, timeOfDay])


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
    // const updateOutdoorSelection = (option) => {
    //     let newOutdoorSelection = ({
    //         "Yes": false,
    //         "No": false
    //     })
    //     newOutdoorSelection[option] = true
    //     setOutdoorSelection(newOutdoorSelection)
    // }
    // const clearOutdoorSelection = () => {
    //     setOutdoorSelection({
    //         "Yes": false,
    //         "No": false
    //     })
    // }
    // const [outdoorSelection, setOutdoorSelection] = useState({
    //     "Yes": false,
    //     "No": true
    // })

    // steps code
    const [stepsList, setStepsList] = useState(task.steps)
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
            // let newStep = document.getElementById(`stepInput-${stepsList.length - 1}`)
            // newStep.focus()
            setFocusOnNextStep(true)
        }
        setStepsList(stepsListCopy)
        if (action === "remove") {
            resetStepInputValues(stepsListCopy)
        }

    }
    const [focusOnNextStep, setFocusOnNextStep] = useState(false);
    useEffect(() => {
        if (focusOnNextStep) {
            let nextStep = document.getElementById(`stepInput-${stepsList.length - 1}`)
            nextStep.focus()
            setFocusOnNextStep(false)
        }
    }, [stepsList])
    const resetStepInputValues = (stepsListCopy) => {
        // set step input values on the page equal to those in the stepsListCopy passed thru as the argument
        for (let i = 0; i < stepsListCopy.length; i++) {
            let stepInput = document.getElementById(`stepInput-${i}`)
            stepInput.value = stepsListCopy[i].desc
        }
    }

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
            time = "0" + time
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
        const hourInput = document.getElementById('hourInput')
        const minuteInput = document.getElementById('minuteInput')
        if (task.endTime) {
            let taskHour = (timifee(task.endTime).slice(0, 2))
            let taskMinute = (timifee(task.endTime).slice(3, 5))
            hourInput.value = taskHour
            minuteInput.value = taskMinute
            setSelectedHour(taskHour)
            setSelectedMinute(taskMinute)
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
    // const loadOutdoors = () => {
    //     if (task.outdoors) {
    //         setOutdoorSelection({
    //             "Yes": true,
    //             "No": false
    //         })
    //     }
    // }
    // load location
    const loadLocation = () => {
        if (task.location) {
            let locationInput = document.getElementById('locationInput')
            locationInput.value = task.location
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
        // loadOutdoors()
        loadLocation()
        loadSteps()
    }, [])



    // close modal on click outside
    const refModal = useRef(null)
    useEffect(() => {
        window.addEventListener('click', hideOnClickOutsideWindow, true)
        window.addEventListener('click', hideOnClickOutsideCategoryMenu, true)
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


                            <p className="box-title m-0">Edit Task</p>
                            <hr className='w-100' />

                            <div className="flx-r">

                                <div className="task-settings flx-2">

                                    <div className="task-setting">
                                        <label htmlFor='taskTitleInput' className="m-0 ml-1">Task title<span className="red-text">*</span></label>
                                        <div className="input-div">
                                            <div onClick={() => updateTaskPriority()} id='priorityBtn' className="priority-button overlay-icon-right4 flx-r font-jakarta pointer noPriority">
                                                <p className="m-0 bold600">High Priority</p>
                                                <span id='priorityIcon' className="material-symbols-outlined">
                                                    priority_high
                                                </span>
                                            </div>
                                            <input onChange={(e) => updateTaskName(e)} id='taskTitleInput' type="input" className="input-box" />
                                        </div>
                                    </div>

                                    <div className="task-setting">
                                        <label className="m-0 ml-1">Category<span className="red-text">*</span></label>
                                        {/* <input type="input" className="input-box" /> */}
                                        <div className="flx-r">
                                            <div ref={refCategoryMenu} onClick={() => toggleCategoryMenu()} className={`categorySelections${darkMode ? "-dark" : ""}`}>
                                                <div id='categoryMenu' className="menu hidden-o">
                                                    <div onClick={(e) => updateTaskCategory(e)} className="option"><p className="m-0 gray-text">None</p></div>
                                                    {userCategories ? userCategories.categoryOrder.map((categoryName, index) => {
                                                        let category = userCategories.categories[categoryName]
                                                        return <div key={index} onClick={(e) => updateTaskCategory(e)} value={category.categoryName} className='option'>{category.categoryName}</div>
                                                    }) : null}
                                                    {/* <hr className='w-95' /> */}
                                                    <div value="add-new-category" className='option'>
                                                        <div className="align-all-items gap-2">
                                                            <span className="material-symbols-outlined">
                                                                add
                                                            </span>
                                                            <p className="m-0">Add New Category</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p id="categorySelected" className="m-0">None</p>
                                                <span className="material-symbols-outlined">expand_more</span>
                                            </div>
                                            <button onClick={() => toggleMyDay()} id='myDayBtn' className="btn-tertiary my-day-button">
                                                <div className="align-all-items gap-2">
                                                    <p id='myDayText' className="m-0 font20 font-jakarta bold600">Add to My Day</p>
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
                                                <div className="flx-r just-sb align-c">
                                                    <label className="m-0 ml-1">Date or Deadline</label>
                                                    <p onClick={() => clearEndDate()} className="m-0 small gray-text pointer hoverFade">Clear</p>
                                                </div>
                                                <div className="date-input-div position-relative">
                                                    <span className="material-symbols-outlined overlay-icon2">
                                                        event
                                                    </span>
                                                    <ReactDatePicker onChange={(date) => { setSelectedDate(date); updateTaskEndDate(date) }} selected={selectedDate} value={selectedDate} placeholderText='mm/dd/yyyy' className="date-input-box" />
                                                </div>
                                            </div>
                                            <div className="task-time flx-c">
                                                <div className="flx-r align-c">
                                                    <label className="m-0 ml-1">Time</label>
                                                    <p onClick={() => clearSelectedTime()} className={`m-0 position-right small gray-text hoverFade pointer ${selectedHour ? null : "d-none"}`}>Clear</p>
                                                </div>
                                                <div className="time-input-div position-relative">
                                                    <span className="material-symbols-outlined overlay-icon3">
                                                        schedule
                                                    </span>
                                                    <div className="time-picker-box">

                                                        <select onChange={(e) => { setSelectedHour(e.target.value); wakeUpMinutes() }} name="time-picker" id="hourInput" className='hour-input-box' placeholder="hh" required>
                                                            <option value="" disabled selected hidden>hh</option>
                                                            <option value="01">1</option>
                                                            <option value="02">2</option>
                                                            <option value="03">3</option>
                                                            <option value="04">4</option>
                                                            <option value="05">5</option>
                                                            <option value="06">6</option>
                                                            <option value="07">7</option>
                                                            <option value="08">8</option>
                                                            <option value="09">9</option>
                                                            <option value="10">10</option>
                                                            <option value="11">11</option>
                                                            <option value="12">12</option>
                                                        </select>
                                                        <div className="">&nbsp;:&nbsp;</div>
                                                        <select onChange={(e) => { setSelectedMinute(e.target.value); wakeUpHours() }} name="time-picker" id="minuteInput" className='minute-input-box' placeholder="mm" required>
                                                            <option value="" disabled selected hidden>mm</option>
                                                            <option value="00">00</option>
                                                            <option value="05">05</option>
                                                            <option value="10">10</option>
                                                            <option value="15">15</option>
                                                            <option value="20">20</option>
                                                            <option value="25">25</option>
                                                            <option value="30">30</option>
                                                            <option value="35">35</option>
                                                            <option value="40">40</option>
                                                            <option value="45">45</option>
                                                            <option value="50">50</option>
                                                            <option value="55">55</option>
                                                        </select>
                                                    </div>
                                                    {selectedHour && selectedMinute && timeOfDay === "AM" &&
                                                        <div onClick={() => setTimeOfDay("PM")} className="todPicker ml-2 hoverFade pointer">AM</div>
                                                    }
                                                    {selectedHour && selectedMinute && timeOfDay === "PM" &&
                                                        <div onClick={() => setTimeOfDay("AM")} className="todPicker ml-2 hoverFade pointer">PM</div>
                                                    }
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
                                        <p className="m-0 ml-1">Location</p>
                                        <div className="inputBox flx-c">
                                            <span className="material-symbols-outlined overlay-icon">
                                                location_on
                                            </span>
                                            <input id='locationInput' onChange={(e) => updateTaskLocation(e)} type="text" className="location-input-box" placeholder='e.g. Home, 1722 Smith Ave. etc' />
                                        </div>
                                    </div>

                                    <div className="task-setting">
                                        <p className="m-0 ml-1">Steps</p>
                                        <div className="steps-column">
                                            {stepsList.map((step, stepIndex) => {
                                                return <div key={stepIndex} className="step-div">
                                                    <div className="overlay-icon2">{step.number})</div>
                                                    <input onKeyDown={(e) => (e.key === "Enter" ? updateStepsList("add") : null)} id={`stepInput-${stepIndex}`} onChange={(e) => updateStep(e, stepIndex)} type='input' className="step-input-box" />
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