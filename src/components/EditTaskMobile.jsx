import React, { useContext, useEffect, useRef, useState } from 'react'
import { Fade, Slide } from 'react-awesome-reveal';
import { DataContext } from '../context/DataProvider';
import ReactDatePicker from 'react-datepicker';
import { format } from 'date-fns';

const EditTaskMobile = ({ open, task, updateTask, onClose }) => {
    if (!open) return null
    const { darkMode, databaseOn, userCategories } = useContext(DataContext);
    const { advancedSettingsOn, setAdvancedSettingsOn } = useContext(DataContext);
    const { createCategoryModalOpen, setCreateCategoryModalOpen } = useContext(DataContext);
    useEffect(() => {
        let categorySelected = document.getElementById('categorySelected')
        categorySelected.innerHTML = task.category ? task.category : "None"
    }, [])

    const [updatedTask, setUpdatedTask] = useState({
        id: task.id,
        db_task_id: task.db_task_id ? task.db_task_id : "",
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
        // console.log(e.target.innerHTML)
        let categorySelected = document.getElementById('categorySelected')
        categorySelected.innerHTML = e.target.innerHTML
        let updatedTaskCopy = { ...updatedTask }
        updatedTaskCopy.category = e.target.innerHTML
        setUpdatedTask(updatedTaskCopy)
    }
    // my day button code
    const addToMyDay = () => {
        const myDayText = document.getElementById('myDayText')
        let updatedTaskCopy = { ...updatedTask }
        myDayText.innerHTML = "Added to My Day"
        myDayText.classList.replace("gray-text", "green-text")
        updatedTaskCopy.myDay = true
        setUpdatedTask(updatedTaskCopy)
    }
    const removeFromMyDay = () => {
        const myDayText = document.getElementById('myDayText')
        let updatedTaskCopy = { ...updatedTask }
        myDayText.innerHTML = "Add to My Day"
        myDayText.classList.replace("green-text", "gray-text")
        updatedTaskCopy.myDay = false
        setUpdatedTask(updatedTaskCopy)
    }
    const toggleMyDay = () => {
        // const myDayBtn = document.getElementById('myDayBtn')
        const myDayText = document.getElementById('myDayText')
        // const myDayIcon = document.getElementById('myDayIcon')
        // let updatedTaskCopy = { ...updatedTask }

        if (myDayText.innerHTML === "Add to My Day") {
            // myDayText.innerHTML = "Added to My Day"
            // myDayText.classList.replace("gray-text", "green-text")
            // updatedTaskCopy.myDay = true
            addToMyDay()
        } else {
            // myDayText.innerHTML = "Add to My Day"
            // myDayText.classList.replace("green-text", "gray-text")
            removeFromMyDay()
        }
        // setUpdatedTask(updatedTaskCopy)
    }
    const updateTaskPriority = () => {
        let priorityBtn = document.getElementById('priorityBtn')
        // let priorityIcon = document.getElementById('priorityIcon')

        let updatedTaskCopy = { ...updatedTask }
        if (priorityBtn.classList.contains('noPriority')) {
            // priorityIcon.classList.replace('noPriority', 'highPriority')
            priorityBtn.classList.replace('noPriority', 'highPriority')
            updatedTaskCopy.highPriority = true;
        } else if (priorityBtn.classList.contains('highPriority')) {
            // priorityIcon.classList.replace('highPriority', 'noPriority')
            priorityBtn.classList.replace('highPriority', 'noPriority')
            updatedTaskCopy.highPriority = false;
        }
        setUpdatedTask(updatedTaskCopy);
    }
    const updateTaskNotes = (e) => {
        let updatedTaskCopy = { ...updatedTask }
        updatedTaskCopy.notes = e.target.value
        setUpdatedTask(updatedTaskCopy)
    }
    // date code
    const [selectedDate, setSelectedDate] = useState(task.endDate ? new Date(task.endDate) : null)
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
        let updatedTaskCopy = { ...updatedTask }
        if (hourPicked) {
            let minutes = minutePicked
            if (!minutes) {
                minutes = "00"
            }
            updatedTaskCopy.endTime = hourPicked+":"+minutes+" "+timeOfDay
        } else {
            updatedTaskCopy.endTime = null
        }
        // console.log(taskCopy.endTime)
        setUpdatedTask(updatedTaskCopy)
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
    const updateTaskLocation = (e) => {
        let updatedTaskCopy = { ...updatedTask }
        if (e.target.value.trim() === "") {
            updatedTaskCopy.location = null
        } else {
            let location = e.target.value.trim()
            updatedTaskCopy.location = location.charAt(0).toUpperCase() + location.slice(1)
        }
        // console.log(updatedTaskCopy.location)
        setUpdatedTask(updatedTaskCopy)
    }
    // add steps that aren't empty to updatedTask state
    const updateTaskSteps = () => {
        let updatedTaskCopy = { ...updatedTask }
        // n = step number
        let n = 1
        // console.log(updatedTaskCopy.steps)
        // start w/ empty steps list
        updatedTaskCopy.steps = []
        for (let i = 0; i < stepsList.length; i++) {
            // condition that step isn't empty or filled with white spaces w/ no chars
            if (stepsList[i].desc.replace(/ /g, "") != "") {
                // trim leading and trailing white spaces
                let desc = stepsList[i].desc.trim()
                updatedTaskCopy.steps.push({
                    number: n,
                    desc: desc.charAt(0).toUpperCase() + desc.slice(1),
                    completed: stepsList[i].completed ? stepsList[i].completed : false
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
            console.log("updatedTaskWithSteps", updatedTaskWithSteps)
            // see comment in updateTaskSteps function for why the updatedTask state can't be passed through
            if (databaseOn) {
                setIsLoading(true);
                await updateTask(updatedTaskWithSteps)
                    .then(() => {
                        onClose()
                    }).catch(() => {
                        setIsLoading(false)
                        alert('Something went wrong. Please try again')
                    })
            } else {
                await updateTask(updatedTaskWithSteps)
                onClose()
            }
        } else {
            alert("Enter a title for your task")
        }
    }

    // time code
    const [selectedHour, setSelectedHour] = useState(null)
    const [selectedMinute, setSelectedMinute] = useState(null)
    const [timeOfDay, setTimeOfDay] = useState(task.endTime ? task.endTime.slice(-2) : "PM")
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
    const [stepsList, setStepsList] = useState(task.steps)
    const updateStep = (e, index) => {
        let stepsListCopy = [...stepsList]
        stepsListCopy[index].desc = e.target.value
        setStepsList(stepsListCopy)
    }
    const updateStepsList = (action, index) => {
        let stepsListCopy = [...stepsList]
        let modal = document.getElementById('edit-task-mobile')
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
        // console.log(modal.offsetHeight)
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

    // set to task time if exists
    const [hourPicked, setHourPicked] = useState(null);
    useEffect(() => {
        if (task.endTime) {
            let timeValues = task.endTime.split(':')
            let hour = timeValues[0]
            let minutes = timeValues[1].slice(0, 2)
            let tod = timeValues[1].slice(-2)
            console.log("original task end time is: "+hour+":"+minutes+" "+tod)
            setHourPicked(hour)
            setMinutePicked(minutes)
        }
    }, [])
    const pickHour = (hour) => {
        let hourPicker = document.getElementById('hourPicker')
        let minutePicker = document.getElementById('minutePicker')
        let backBtn = document.getElementById('backBtn')
        let confirmBtn = document.getElementById('confirmBtn')
        let cancelBtn = document.getElementById('cancelBtn')
        let clearBtn = document.getElementById('clearBtn')
        setHourPicked(hour)
        hourPicker.classList.add('d-none')
        minutePicker.classList.remove('d-none')
        backBtn.classList.remove('d-none')
        confirmBtn.classList.remove('d-none')
        cancelBtn.classList.add('d-none')
        clearBtn.classList.add('d-none')
    }
    // set to task time if exists
    const [minutePicked, setMinutePicked] = useState(null);
    const pickMinute = (minute) => {
        setMinutePicked(minute)
    }
    const backToHourPicker = () => {
        let hourPicker = document.getElementById('hourPicker')
        let minutePicker = document.getElementById('minutePicker')
        let backBtn = document.getElementById('backBtn')
        let confirmBtn = document.getElementById('confirmBtn')
        let cancelBtn = document.getElementById('cancelBtn')
        let clearBtn = document.getElementById('clearBtn')
        minutePicker.classList.add('d-none')
        hourPicker.classList.remove('d-none')
        backBtn.classList.add('d-none')
        confirmBtn.classList.add('d-none')
        cancelBtn.classList.remove('d-none')
        clearBtn.classList.remove('d-none')
    }
    const confirmTimePicked = () => {
        // send hourPicked, minutePicked and timeOfDay to task and time input box
        let updatedTaskCopy = { ...updatedTask }
        let minutes = minutePicked ? minutePicked : "00"
        updatedTaskCopy.endTime = hourPicked + ":" + minutes + " " + timeOfDay
        setUpdatedTask(updatedTaskCopy)
        console.log(updatedTaskCopy)
        let timeInput = document.getElementById('timeInput')
        timeInput.value = updatedTaskCopy.endTime
        // close timepicker
        let timePicker = document.getElementById('timePicker')
        timePicker.classList.add('d-none')
        resetTime()
        resetTimePicker()
    }
    const openTimePicker = () => {
        let timePicker = document.getElementById('timePicker')
        timePicker.classList.remove('d-none')
    }
    const closeTimePicker = () => {
        let timePicker = document.getElementById('timePicker')
        timePicker.classList.add('d-none')
        resetTime()
        resetTimePicker()
    }
    const toggleTimePicker = () => {
        let timePicker = document.getElementById('timePicker')
        if (timePicker.classList.contains('d-none')) {
            timePicker.classList.remove('d-none')
        } else {
            timePicker.classList.add('d-none')
        }
    }
    const resetTime = () => {
        console.log(updatedTask)
        if (updatedTask.endTime) {
            let timeValues = updatedTask.endTime.split(':')
            console.log(timeValues)
            let minutesAndAM = timeValues[1].split(' ')
            setHourPicked(timeValues[0])
            setMinutePicked(minutesAndAM[0])
            setTimeOfDay(minutesAndAM[1])
        } else {
            setHourPicked(null)
            setMinutePicked(null)
        }
    }
    const resetTimePicker = () => {
        backToHourPicker()
    }
    const clearTime = () => {
        let updatedTaskCopy = { ...updatedTask }
        updatedTaskCopy.endTime = null
        setHourPicked(null)
        setMinutePicked(null)
        setUpdatedTask(updatedTaskCopy)
        // console.log(updatedTaskCopy)
        let timeInput = document.getElementById('timeInput')
        timeInput.value = ""
        resetTimePicker()
    }

    // load task details
    const loadTaskTitle = () => {
        const taskTitleInput = document.getElementById('taskTitleInputMobile')
        taskTitleInput.value = task.taskName
    }
    const loadMyDay = () => {
        if (task.myDay) {
            addToMyDay()
        }
    }
    const loadTaskNotes = () => {
        const notesInput = document.getElementById('task-notes')
        notesInput.value = task.notes
    }
    // load priority
    const loadPriority = () => {
        const priorityBtn = document.getElementById('priorityBtn')
        if (task.highPriority) {
            priorityBtn.classList.replace('noPriority', 'highPriority')
        }
    }
    // load time
    const loadEndTime = () => {
        const timeInput = document.getElementById('timeInput')
        if (task.endTime) {
            timeInput.value = task.endTime
            let timeValues = task.endTime.split(':')
            let hour = timeValues[0]
            let minutes = timeValues[1].slice(0, 2)
            let tod = timeValues[1].slice(-2)
            console.log("original task end time is: "+hour+":"+minutes+" "+tod)
            setHourPicked(hour)
            setMinutePicked(minutes)
            // setTimeOfDay(task.endTime.slice(-2))
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
    // load modal height (based on number of steps)
    const loadModalHeight = () => {
        let modal = document.getElementById('edit-task-mobile')
        if (task.steps.length > 1) {
            let newModalHeight = 500 + 25 * (task.steps.length - 1)
            modal.style.height = newModalHeight + "px"
            let notes = document.getElementById('task-notes')
            let notesHeight = 100 + 25 * (task.steps.length - 1)
            notes.style.height = notesHeight + "px"
        }
    }


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
        loadModalHeight()
    }, [])

    // other functions
    const [isLoading, setIsLoading] = useState(false);
    const startLoading = () => {
        setIsLoading(true)
    }
    const stopLoading = () => {
        setIsLoading(false)
    }



    return (
        <div className="overlay-placeholder">
            <Fade delay={100} duration={200} triggerOnce>
                <div className="overlay">
                    <Slide direction='up' duration={200} className='w-100 flx' triggerOnce>
                        <div id='edit-task-mobile' className={`edit-task-mobile${darkMode ? "-dark" : ""}`}>
                            <div className="box-title-mobile">Edit Task</div>
                            <hr className='w-100' />

                            <div className="carousel-window">
                                <div className="inner" style={{ transform: `translateX(${advancedSettingsOn ? "-100%" : "0%"})` }}>
                                    <div className="carousel-item3 h-100">
                                        <div className="box-content flx-c gap-3 h-100 w-100 px-1">

                                            <div className="taskTitle taskPriorirty">
                                                <label>Task Title</label><span className="red-text">*</span>
                                                <div className="flx-r">
                                                    <input id='taskTitleInputMobile' onChange={(e) => updateTaskName(e)} type="text" className={`input-box${darkMode ? "-dark" : ""} w-82`} placeholder='What do you need to do?' autoComplete='off' />
                                                    <div id='priorityBtn' onClick={() => updateTaskPriority()} className={`select-btn${darkMode ? "-dark" : ""} position-right noPriority`}>
                                                        <span className="material-symbols-outlined m-auto">
                                                            exclamation
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="taskCategory taskMyDay flx-r gap-2">
                                                <div className="flx-c flx-1">
                                                    <label>Category</label>
                                                    <div onClick={() => toggleCategoryMenu()} className={`categorySelections${darkMode ? "-dark" : ""} `} style={{ width: "100%" }}>
                                                        <div id='categoryMenu' className="menu hidden-o" style={{ width: "200px" }}>
                                                            <div onClick={(e) => updateTaskCategory(e)} className="option"><p className="m-0 gray-text">None</p></div>
                                                            {userCategories ? userCategories.categoryOrder.map((categoryName, index) => {
                                                                let category = userCategories.categories[categoryName]
                                                                return <div key={index} onClick={(e) => updateTaskCategory(e)} value={category.categoryName} className='option'>{category.categoryName}</div>
                                                            }) : null}
                                                            {/* <hr className='w-95' /> */}
                                                            <div onClick={() => setCreateCategoryModalOpen(true)} value="add-new-category" className='option'>
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
                                                </div>
                                                <div className="flx-c flx-1">
                                                    <label>My Day</label>
                                                    <button id='myDayText' onClick={() => toggleMyDay()} className={`btn-tertiary${darkMode ? "-dark" : ""} btn-tertiary-mobile small gray-text`}>Add to My Day</button>
                                                </div>
                                            </div>

                                            <div className="taskNotes flx-c">
                                                <label>Notes</label>
                                                <textarea onChange={(e) => updateTaskNotes(e)} name="" id="task-notes" cols="30" rows="10" className={`textarea-box${darkMode ? "-dark" : ""} textarea-box-mobile`} placeholder='Describe your task...'></textarea>
                                            </div>

                                            <div className="taskDate advancedSettings flx-c">

                                                <div className="taskDate flx-r gap-2">
                                                    <div className="flx-c flx-1">
                                                        <label>Date</label>
                                                        <div className="date-input-div position-relative">
                                                            <ReactDatePicker onChange={(date) => { setSelectedDate(date); updateTaskEndDate(date) }} selected={selectedDate} value={selectedDate} placeholderText='mm/dd/yyyy' className={`date-input-box${darkMode ? "-dark" : ""} date-input-box-mobile`} />
                                                            <span className="material-symbols-outlined overlay-icon2">
                                                                event
                                                            </span>

                                                        </div>
                                                    </div>
                                                    <div className="flx-c flx-1">
                                                        <label>Time</label>
                                                        <div className="time-input-div position-relative">
                                                            <div id='timePicker' className={`time-picker${darkMode ? "-dark" : ""}  d-none`}>
                                                                <div id='backBtn' onClick={() => backToHourPicker()} className={`backBtn ${darkMode ? "lightblue-text" : "blue-text"} font-jakarta small d-none`}>Back</div>
                                                                <div id='confirmBtn' onClick={() => confirmTimePicked()} className={`confirmBtn ${darkMode ? "lightblue-text" : "blue-text"} font-jakarta small d-none`}>Confirm</div>
                                                                <div id='cancelBtn' onClick={() => closeTimePicker()} className={`cancelBtn ${darkMode ? "lightblue-text" : "blue-text"} font-jakarta small`}>Cancel</div>
                                                                <div id='clearBtn' onClick={() => clearTime()} className={`clearBtn2 ${darkMode ? "lightblue-text" : "blue-text"} font-jakarta small`}>Clear</div>
                                                                <div className={`time-input x-large font-jakarta flx-r m-auto ${!hourPicked ? darkMode ? "darkgray-text" : "faint-text" : darkMode ? "white-text" : "dark-text"}`}>{hourPicked ? hourPicked : "00"}:{minutePicked ? minutePicked : "00"}
                                                                    {hourPicked && timeOfDay === "AM" &&
                                                                        <div onClick={() => setTimeOfDay("PM")} className={`todPicker${darkMode ? "-dark" : ""} todPicker-mobile ml-2 hoverFade pointer medium`}>AM</div>
                                                                    }
                                                                    {hourPicked && timeOfDay === "PM" &&
                                                                        <div onClick={() => setTimeOfDay("AM")} className={`todPicker${darkMode ? "-dark" : ""} todPicker-mobile ml-2 hoverFade pointer medium`}>PM</div>
                                                                    }
                                                                </div>
                                                                <hr className='w-100' />
                                                                <div id='hourPicker' className="hour-picker-div position-relative">
                                                                    <div onClick={() => pickHour("12")} className="hour-twelve"></div>
                                                                    <div onClick={() => pickHour("1")} className="hour-one"></div>
                                                                    <div onClick={() => pickHour("2")} className="hour-two"></div>
                                                                    <div onClick={() => pickHour("3")} className="hour-three"></div>
                                                                    <div onClick={() => pickHour("4")} className="hour-four"></div>
                                                                    <div onClick={() => pickHour("5")} className="hour-five"></div>
                                                                    <div onClick={() => pickHour("6")} className="hour-six"></div>
                                                                    <div onClick={() => pickHour("7")} className="hour-seven"></div>
                                                                    <div onClick={() => pickHour("8")} className="hour-eight"></div>
                                                                    <div onClick={() => pickHour("9")} className="hour-nine"></div>
                                                                    <div onClick={() => pickHour("10")} className="hour-ten"></div>
                                                                    <div onClick={() => pickHour("11")} className="hour-eleven"></div>
                                                                    <img src={`${darkMode ? "https://i.imgur.com/YFmWqd6.png" : "https://i.imgur.com/RGRBIoK.png"}`} alt="" className="hour-picker" />
                                                                </div>
                                                                <div id='minutePicker' className="minute-picker-div position-relative d-none">
                                                                    <div onClick={() => pickMinute("00")} className="minute-zero"></div>
                                                                    <div onClick={() => pickMinute("05")} className="minute-five"></div>
                                                                    <div onClick={() => pickMinute("10")} className="minute-ten"></div>
                                                                    <div onClick={() => pickMinute("15")} className="minute-fifteen"></div>
                                                                    <div onClick={() => pickMinute("20")} className="minute-twenty"></div>
                                                                    <div onClick={() => pickMinute("25")} className="minute-twentyfive"></div>
                                                                    <div onClick={() => pickMinute("30")} className="minute-thirty"></div>
                                                                    <div onClick={() => pickMinute("35")} className="minute-thirtyfive"></div>
                                                                    <div onClick={() => pickMinute("40")} className="minute-fourty"></div>
                                                                    <div onClick={() => pickMinute("45")} className="minute-fourtyfive"></div>
                                                                    <div onClick={() => pickMinute("50")} className="minute-fifty"></div>
                                                                    <div onClick={() => pickMinute("55")} className="minute-fiftyfive"></div>
                                                                    <img src={`${darkMode ? "https://i.imgur.com/Bf4Gkye.png" : "https://i.imgur.com/bgc1fFT.png"}`} alt="" className="minute-picker" />
                                                                </div>
                                                            </div>
                                                            <span className="material-symbols-outlined overlay-icon3">
                                                                schedule
                                                            </span>
                                                            <input onClick={() => toggleTimePicker()} id='timeInput' className={`time-input-box${darkMode ? "-dark" : ""} flx-1`} placeholder='hh:mm' readOnly></input>

                                                        </div>
                                                    </div>
                                                </div>
                                                <div onClick={() => setAdvancedSettingsOn(true)} className="align-all-items gap-1 position-right">
                                                    <p className="m-0 small">Advanced Settings</p>
                                                    <span className="material-symbols-outlined medium">
                                                        settings
                                                    </span>
                                                    <span className="material-symbols-outlined medium">
                                                        arrow_forward
                                                    </span>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="carousel-item3 h-100">
                                        <div className="box-content advancedSettings flx-c h-100 w-100 px-1">

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
                                                    <input id='locationInput' onChange={(e) => updateTaskLocation(e)} type="text" className={`location-input-box${darkMode ? "-dark" : ""}`} placeholder='e.g. Home, 1722 Smith Ave. etc' />
                                                </div>
                                            </div>

                                            <div className="task-setting steps">
                                                <label>Steps</label>
                                                <div className="steps-column">
                                                    {stepsList.map((step, index) => {
                                                        return <div key={index} className="step-div">
                                                            <div className="overlay-icon2">{step.number})</div>
                                                            <input onKeyDown={(e) => e.key === "Enter" ? updateStepsList("add") : null} id={`stepInput-${index}`} onChange={(e) => updateStep(e, index)} type='input' className={`step-input-box${darkMode ? "-dark" : ""} step-input-box-mobile`} autoComplete='off' />
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
                                                    <span className="material-symbols-outlined medium">
                                                        arrow_back
                                                    </span>
                                                    <span className="material-symbols-outlined medium">
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
                                <button onClick={() => { updateTaskBridgeFunction() }} className={`btn-primary${darkMode ? "-dark" : ""}`}>Update</button>
                                <button onClick={() => onClose()} className={`btn-secondary${darkMode ? "-dark" : ""}`}>Cancel</button>
                            </div>

                        </div>
                    </Slide>
                </div>
            </Fade>
        </div>
    )
}
export default EditTaskMobile;