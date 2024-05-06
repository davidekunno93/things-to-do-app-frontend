import React, { useContext, useEffect, useRef, useState } from 'react'
import { Fade, Slide } from 'react-awesome-reveal';
import { DataContext } from '../context/DataProvider';
import ReactDatePicker from 'react-datepicker';
import { format } from 'date-fns';

const CreateTaskMobile = ({ open, tasks, category, setTasks, onClose }) => {
    if (!open) return null
    const { darkMode, databaseOn, userCategories } = useContext(DataContext);
    const { advancedSettingsOn, setAdvancedSettingsOn } = useContext(DataContext);
    const { createCategoryModalOpen, setCreateCategoryModalOpen } = useContext(DataContext);

    useEffect(() => {
        // upon page mount make the category selected the same as the current user Category on dashboard
        let categorySelected = document.getElementById('categorySelected')
        if (category) {
            categorySelected.innerHTML = category
        }
    }, [])
    let taskLastInArr = Object.keys(tasks).slice(-1)
    const [newTask, setNewTask] = useState({
        id: taskLastInArr[0] ? parseInt(taskLastInArr[0]) + 1 : 1,
        myDay: false,
        taskName: "",
        category: category,
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

    const updateTaskName = (e) => {
        let newTaskCopy = { ...newTask }
        let taskName = e.target.value.trim()
        newTaskCopy.taskName = taskName.charAt(0).toUpperCase() + taskName.slice(1)
        setNewTask(newTaskCopy)
    }
    const updateTaskCategory = (e) => {
        // console.log(e.target.innerHTML)
        let categorySelected = document.getElementById('categorySelected')
        categorySelected.innerHTML = e.target.innerHTML
        let newTaskCopy = { ...newTask }
        newTaskCopy.category = e.target.innerHTML
        setNewTask(newTaskCopy)
    }
    // my day button code
    const toggleMyDay = () => {
        const myDayBtn = document.getElementById('myDayBtn')
        const myDayText = document.getElementById('myDayText')
        const myDayIcon = document.getElementById('myDayIcon')
        let newTaskCopy = { ...newTask }

        if (myDayText.innerHTML === "Add to My Day") {
            myDayText.innerHTML = "Added to My Day"
            myDayText.classList.replace("gray-text", "green-text")
            // myDayIcon.classList.add("deepgreen-text")
            // myDayIcon.innerHTML = "done"
            newTaskCopy.myDay = true
        } else {
            myDayText.innerHTML = "Add to My Day"
            myDayText.classList.replace("green-text", "gray-text")
            // myDayIcon.classList.remove("deepgreen-text")
            // myDayIcon.innerHTML = "sunny"
            newTaskCopy.myDay = false
        }
        setNewTask(newTaskCopy)
    }
    const updateTaskPriority = () => {
        let priorityBtn = document.getElementById('priorityBtn')
        // let priorityIcon = document.getElementById('priorityIcon')

        let newTaskCopy = { ...newTask }
        if (priorityBtn.classList.contains('noPriority')) {
            // priorityIcon.classList.replace('noPriority', 'highPriority')
            priorityBtn.classList.replace('noPriority', 'highPriority')
            newTaskCopy.highPriority = true;
        } else if (priorityBtn.classList.contains('highPriority')) {
            // priorityIcon.classList.replace('highPriority', 'noPriority')
            priorityBtn.classList.replace('highPriority', 'noPriority')
            newTaskCopy.highPriority = false;
        }
        setNewTask(newTaskCopy);
    }
    const updateTaskNotes = (e) => {
        let newTaskCopy = { ...newTask }
        newTaskCopy.notes = e.target.value
        setNewTask(newTaskCopy)
    }
    const [selectedDate, setSelectedDate] = useState(null)
    const clearEndDate = () => {
        setSelectedDate(null)
        updateTaskEndDate(null)
    }
    const updateTaskEndDate = (date) => {
        let taskCopy = { ...newTask }
        if (date) {
            taskCopy.endDate = format(date, "MM/dd/yyyy")
        } else {
            taskCopy.endDate = null
        }
        setNewTask(taskCopy)
    }
    const updateTaskEndTime = () => {
        let taskCopy = { ...newTask }
        if (selectedHour && selectedMinute) {
            taskCopy.endTime = timify(selectedHour + ":" + selectedMinute) + " " + timeOfDay
        } else {
            taskCopy.endTime = null
        }
        // console.log(taskCopy.endTime)
        setNewTask(taskCopy)
    }
    const updateTaskFrequency = (option) => {
        let newTaskCopy = { ...newTask }
        newTaskCopy.frequency = option
        setNewTask(newTaskCopy)
    }
    const updateTaskDuration = (option) => {
        let newTaskCopy = { ...newTask }
        if (option === null) {
            newTaskCopy.duration = null
        } else {
            newTaskCopy.duration = option
        }
        setNewTask(newTaskCopy)
    }
    const updateTaskLocation = (e) => {
        let newTaskCopy = { ...newTask }
        if (e.target.value.trim() === "") {
            newTaskCopy.location = null
        } else {
            let location = e.target.value.trim()
            newTaskCopy.location = location.charAt(0).toUpperCase() + location.slice(1)
        }
        // console.log(newTaskCopy.location)
        setNewTask(newTaskCopy)
    }
    // add steps that aren't empty to newTask state
    const updateTaskSteps = () => {
        let newTaskCopy = { ...newTask }
        let n = 1
        console.log(newTaskCopy.steps)
        for (let i = 0; i < stepsList.length; i++) {
            if (stepsList[i].desc.replace(/ /g, "") != "") {
                let desc = stepsList[i].desc.trim()
                newTaskCopy.steps.push({
                    number: n,
                    desc: desc.charAt(0).toUpperCase() + desc.slice(1),
                    completed: false
                })
                n++
            }
        }
        setNewTask(newTaskCopy)
    }
    const addTask = async () => {
        if (newTask.taskName) {
            console.log(newTask)
            // put the steps on the task
            await updateTaskSteps()
            // open loader
            startLoading()

            if (databaseOn) {
                // add task to database code
                let data = {
                    uid: "KJ0XtgHmO0dIeCU6KYZp9k3Hl0i1",
                    ...newTask
                }
                let url = "http://localhost:5000/add_task"
                const response = await axios.post(url, JSON.stringify(data), {
                    headers: { "Content-Type": "application/json" }
                })
                    .then((response) => {
                        console.log(response)
                        let db_task_id = response.data.data


                        // complete adding the task in front end
                        let tasksCopy = Object.values(tasks)
                        tasksCopy.push({
                            ...newTask,
                            db_task_id: db_task_id
                        })
                        let newTasksObj = {}
                        for (let i = 0; i < tasksCopy.length; i++) {
                            newTasksObj[i + 1] = tasksCopy[i]
                        }
                        setTasks(newTasksObj)
                        // close loader
                        stopLoading()
                        onClose()
                    })
            } else {
                // complete adding the task in front end
                console.log(newTask)
                let tasksCopy = Object.values(tasks)
                tasksCopy.push({
                    ...newTask,
                })
                let newTasksObj = {}
                for (let i = 0; i < tasksCopy.length; i++) {
                    newTasksObj[i + 1] = tasksCopy[i]
                }
                setTasks(newTasksObj)
                // close loader
                stopLoading()
                onClose()
            }

        } else {
            alert("Enter a title for your task")
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
    }, [selectedHour, selectedMinute, timeOfDay])


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

    // time code
    const [hourPicked, setHourPicked] = useState(null);
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
        let newTaskCopy = { ...newTask }
        let minutes = minutePicked ? minutePicked : "00"
        newTaskCopy.endTime = hourPicked + ":" + minutes + " " + timeOfDay
        setNewTask(newTaskCopy)
        console.log(newTaskCopy)
        let timeInput = document.getElementById('timeInput')
        timeInput.value = newTaskCopy.endTime
        // close timepicker
        let timePicker = document.getElementById('timePicker')
        timePicker.classList.add('d-none')
        // resetTime()
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
        console.log(newTask)
        if (newTask.endTime) {
            let timeValues = newTask.endTime.split(':')
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
        let newTaskCopy = { ...newTask }
        newTaskCopy.endTime = null
        setHourPicked(null)
        setMinutePicked(null)
        setNewTask(newTaskCopy)
        // console.log(newTaskCopy)
        let timeInput = document.getElementById('timeInput')
        timeInput.value = ""
        resetTimePicker()
    }

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
                        <div id='create-task-mobile' className={`create-task-mobile${darkMode ? "-dark" : ""}`}>
                            <div className="box-title-mobile">Create New Task</div>
                            <hr className='w-100' />

                            <div className="carousel-window">
                                <div className="inner" style={{ transform: `translateX(${advancedSettingsOn ? "-100%" : "0%"})` }}>
                                    <div className="carousel-item3 h-100">
                                        <div className="box-content flx-c gap-3 h-100 w-100 px-1">

                                            <div className="taskTitle taskPriorirty">
                                                <label>Task Title</label><span className="red-text">*</span>
                                                <div className="flx-r">
                                                    <input onChange={(e) => updateTaskName(e)} type="text" className={`input-box${darkMode ? "-dark" : ""} w-82`} placeholder='What do you need to do?' />
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
                                                    <div onClick={() => toggleCategoryMenu()} className={`categorySelections${darkMode ? "-dark" : ""}`} style={{ width: "100%" }}>
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
                                                        <div className="date-input-div position-relative flx-c">
                                                            <ReactDatePicker onChange={(date) => { setSelectedDate(date); updateTaskEndDate(date) }} selected={selectedDate} value={selectedDate} placeholderText='mm/dd/yyyy' onKeyDown={e => e.preventDefault()} className={`date-input-box${darkMode ? "-dark" : ""} date-input-box-mobile`} />
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
                                                                        <div onClick={() => setTimeOfDay("PM")} className={`todPicker${darkMode ? "-dark" : ""} ml-2 hoverFade pointer medium`}>AM</div>
                                                                    }
                                                                    {hourPicked && timeOfDay === "PM" &&
                                                                        <div onClick={() => setTimeOfDay("AM")} className={`todPicker${darkMode ? "-dark" : ""} ml-2 hoverFade pointer medium`}>PM</div>
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
                                                    <input onChange={(e) => updateTaskLocation(e)} type="text" className={`location-input-box${darkMode ? "-dark" : ""}`} placeholder='e.g. Home, 1722 Smith Ave. etc' />
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