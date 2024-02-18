import React, { useContext, useEffect, useRef, useState } from 'react'
import { DataContext } from '../context/DataProvider'
import { Fade } from 'react-awesome-reveal'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';
import { addDays, format, subDays } from 'date-fns';
import axios from 'axios';
import Loading from './Loading';
import ToolTip from './ToolTip';

const CreateTaskModal = ({ open, category, tasks, setTasks, onClose }) => {
    if (!open) return null
    // making sure the dashboard page loads the category into the task being created unless it's a sytem category
    const [taskCategory, setTaskCategory] = useState(category)
    useEffect(() => {
        let newTaskCopy = { ...newTask }
        newTaskCopy.category = taskCategory
        setNewTask(newTaskCopy)
    }, [taskCategory])
    useEffect(() => {
        let categorySelected = document.getElementById('categorySelected')
        if (category === "allTasks" || category === "myDay" || category === "upcoming" || category === "priority" || category === "overdue" || category === "completed" || category === "No Category") {
            category = null
            setTaskCategory(null)
        }
        categorySelected.value = category ? category : "No Category"
    }, [])
    const { advancedSettingsOn, setAdvancedSettingsOn } = useContext(DataContext);
    const { userCategories, setUserCategories } = useContext(DataContext);
    const { databaseOn } = useContext(DataContext);
    const { darkMode } = useContext(DataContext);
    let taskLastInArr = Object.keys(tasks).slice(-1)
    const [newTask, setNewTask] = useState({
        id: taskLastInArr[0] ? parseInt(taskLastInArr[0]) + 1 : 1,
        myDay: false,
        taskName: "",
        category: taskCategory ? taskCategory : null,
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
    const updateTaskNotes = (e) => {
        let newTaskCopy = { ...newTask }
        newTaskCopy.notes = e.target.value
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
    // const updateTaskOutdoors = (option) => {
    //     let newTaskCopy = { ...newTask }
    //     if (!option) {
    //         newTaskCopy.outdoors = false;
    //     } else if (option === "Yes") {
    //         newTaskCopy.outdoors = true
    //     } else if (option === "No") {
    //         newTaskCopy.outdoors = false
    //     }
    //     setNewTask(newTaskCopy)
    // }
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
    const updateTaskParticipants = () => {

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
            setFocusOnNextStep(true);
        }
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



    // funtion not called but code used in addTask function
    const addTaskToDB = async (task) => {
        let data = {
            uid: "KJ0XtgHmO0dIeCU6KYZp9k3Hl0i1",
            ...task
        }
        let url = "http://localhost:5000/add_task"
        const response = await axios.post(url, JSON.stringify(data), {
            headers: { "Content-Type": "application/json" }
        })
            .then((response) => {
                console.log(response)
                return response.data
            })
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







    const printNewTask = () => {
        console.log(newTask)
    }
    const printMe = (e) => {
        console.log(e.target.value)
        // console.log('do somink!')
    }
    const printTest = () => {
        console.log(tasks)
    }

    // other functions
    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
    const timify = (time) => {
        if (time[0] === "0") {
            time = time.slice(1)
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
        const modal = document.getElementById('createTaskModal')

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
        const modal = document.getElementById('createTaskModal')

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


    // my day button code
    const toggleMyDay = () => {
        const myDayBtn = document.getElementById('myDayBtn')
        const myDayText = document.getElementById('myDayText')
        const myDayIcon = document.getElementById('myDayIcon')
        let newTaskCopy = { ...newTask }

        if (myDayText.innerHTML === "Add to My Day") {
            myDayText.innerHTML = "Added to My Day"
            myDayText.classList.add("green-text")
            myDayIcon.classList.add("green-text")
            myDayIcon.innerHTML = "done"
            newTaskCopy.myDay = true
        } else {
            myDayText.innerHTML = "Add to My Day"
            myDayText.classList.remove("green-text")
            myDayIcon.classList.remove("green-text")
            myDayIcon.innerHTML = "sunny"
            newTaskCopy.myDay = false
        }
        setNewTask(newTaskCopy)
    }


    // close modal on click outside - not using bc I don't want users accidentally exiting create new task window
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


    const printTime = () => {
        console.log(selectedHour + ":" + selectedMinute + " " + timeOfDay)
    }

    const print = (e) => {
        console.log(e.target.value)
    }
    const [isLoading, setIsLoading] = useState(false);
    const startLoading = () => {
        setIsLoading(true)
    }
    const stopLoading = () => {
        setIsLoading(false)
    }

    const [toolTipOpen, setToolTipOpen] = useState(false);
    const openToolTip = () => {
        setToolTipOpen(true)
    }
    // create new task tool tip
    // useEffect(() => {
    //     openToolTip()
    // }, [])

    return (
        <>
            <div className="overlay-placeholder">
                <ToolTip open={toolTipOpen} onClose={() => setToolTipOpen(false)} />
                <Fade fraction={0} className='position-absolute z-1000' duration={200} triggerOnce>
                    <div className="overlay">
                        <div id='loadingDiv' className="create-task-modal-empty">
                            <Loading open={isLoading} />

                            <div id='createTaskModal' className={`create-task-modal${darkMode ? "-dark" : ""}`}>


                                <div className="toggleAdvancedSettings flx-r">
                                    <p className="m-0 mr-2">Advanced Settings {advancedSettingsOn ? "On" : "Off"} </p>
                                    <span id='advancedSettingsToggleIcon' onClick={() => toggleAdvancedSettings()} className="material-symbols-outlined pointer">
                                        {/* {advancedSettingsOn ? "toggle_on" : "toggle_off"} */}
                                        toggle_on
                                    </span>
                                </div>


                                <p onClick={() => printNewTask()} className={`box-title${darkMode ? "-dark" : ""} m-0`}>Create New Task</p>
                                <hr className='w-100' />

                                <div className="flx-r">

                                    <div className="task-settings flx-2">

                                        <div className="task-setting">
                                            <label htmlFor='taskTitleInput' className="m-0 ml-1">Task title<span className="red-text">*</span></label>
                                            <div className="input-div">
                                                <div onClick={() => updateTaskPriority()} id='priorityBtn' className={`priority-button overlay-icon-right4${darkMode ? "-dark" : ""} flx-r font-jakarta pointer noPriority`}>
                                                    <p className="m-0 bold600">High Priority</p>
                                                    <span id='priorityIcon' className="material-symbols-outlined">
                                                        priority_high
                                                    </span>
                                                </div>
                                                <input onChange={(e) => updateTaskName(e)} id='taskTitleInput' type="input" className={`input-box${darkMode ? "-dark" : ""}`} placeholder='What do you need to do?' />
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
                                                {/* <select onChange={(e) => updateTaskCategory(e)} name="categories" className={`categorySelection${darkMode ? "-dark" : ""}`} id="categorySelected">
                                                    <option value="No Category">No Category</option>
                                                    {userCategories ? userCategories.categoryOrder.map((categoryName, index) => {
                                                        let category = userCategories.categories[categoryName]
                                                        return <option key={index} value={category.categoryName}>{category.categoryName}</option>
                                                    }) : null}
                                                    <option value="CreateNew">-- Create New Category --</option> 
                                                </select> */}
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
                                            <div className="flx-r">
                                                <label htmlFor='notesInput' className="m-0 ml-1">Notes</label>
                                            </div>
                                            <textarea onChange={(e) => updateTaskNotes(e)} id='notesInput' className={`textarea-box2${darkMode ? "-dark" : ""}`} placeholder='Any extra details, notes or reminders about the task' />
                                        </div>

                                        <div className="task-setting">
                                            <div className="flx-r">
                                                <div className="task-date z-100 mr-5 flx-c">
                                                    <div className="flx-r just-sb align-c">
                                                        <label className="m-0 ml-1">Date or Deadline</label>
                                                        <p onClick={() => clearEndDate()} className={`m-0 small gray-text pointer hoverFade ${selectedDate ? null : "d-none"}`}>Clear</p>
                                                    </div>
                                                    <div className="date-input-div position-relative">
                                                        <span className="material-symbols-outlined overlay-icon2">
                                                            event
                                                        </span>

                                                        {/* <ReactDatePicker onChange={(date) => { setSelectedDate(date); updateTaskEndDate(date) }} selected={selectedDate} value={selectedDate} minDate={subDays(new Date(), 0)} placeholderText='mm/dd/yyyy' className="date-input-box" /> */}
                                                        <ReactDatePicker onChange={(date) => { setSelectedDate(date); updateTaskEndDate(date) }} selected={selectedDate} value={selectedDate} placeholderText='mm/dd/yyyy' className={`date-input-box${darkMode ? "-dark" : ""}`} />
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

                                                            <select onChange={(e) => { setSelectedHour(e.target.value); wakeUpMinutes() }} name="time-picker" id="hourInput" className={`hour-input-box${darkMode ? "-dark" : ""}`} placeholder="hh" required>
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
                                                            <select onChange={(e) => { setSelectedMinute(e.target.value); wakeUpHours() }} name="time-picker" id="minuteInput" className={`minute-input-box${darkMode ? "-dark" : ""}`} placeholder="mm" required>
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
                                                            <div onClick={() => setTimeOfDay("PM")} className={`todPicker${darkMode ? "-dark" : ""} ml-2 hoverFade pointer`}>AM</div>
                                                        }
                                                        {selectedHour && selectedMinute && timeOfDay === "PM" &&
                                                            <div onClick={() => setTimeOfDay("AM")} className={`todPicker${darkMode ? "-dark" : ""} ml-2 hoverFade pointer`}>PM</div>
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
                                                    return <div key={index} onClick={() => { updateFrequencySelection(option); updateTaskFrequency(option) }} className={`${selected ? "underline-option-selected" : "underline-option-unselected"} ${darkMode ? selected ? "underline-option-selected-dark" : "underline-option-unselected-dark" : null}`}>{option}</div>
                                                })}
                                            </div>
                                        </div>

                                        <div className="task-setting">
                                            <p className="m-0 ml-1">Duration <span onClick={() => { clearDurationSelection(); updateTaskDuration(null) }} className="clearBtn small">Clear</span> </p>
                                            <div className={`selection-box${darkMode ? "-dark" : ""}`}>
                                                {Object.keys(durationSelection).map((option, index) => {
                                                    let selected = durationSelection[option]
                                                    return <div key={index} onClick={() => { updateDurationSelection(option); updateTaskDuration(option) }} className={`${selected ? "selection-selected" : "selection-unselected"} ${darkMode ? selected ? "selection-selected-dark" : "selection-unselected-dark" : ""}`}>
                                                        <p className="m-0 m-auto">{option}</p>
                                                    </div>
                                                })}
                                            </div>
                                        </div>

                                        <div className="task-setting">
                                            <p className="m-0 ml-1">Location
                                                {/* <span onClick={() => { clearOutdoorSelection(); updateTaskOutdoors() }} className="clearBtn small">Clear</span> */}
                                            </p>
                                            <div className="inputBox flx-c">
                                                <span className="material-symbols-outlined overlay-icon">
                                                    location_on
                                                </span>
                                                <input onChange={(e) => updateTaskLocation(e)} type="text" className={`location-input-box${darkMode ? "-dark" : ""}`} placeholder='e.g. Home, 1722 Smith Ave. etc' />
                                            </div>
                                            {/* <div className="selection-box">
                                                {Object.keys(outdoorSelection).map((option, index) => {
                                                    let selected = outdoorSelection[option]
                                                    return <div key={index} onClick={() => { updateOutdoorSelection(option); updateTaskOutdoors(option) }} className={`${selected ? "selection-selected" : "selection-unselected"}`}>
                                                        <p className="m-0 m-auto">{option}</p>
                                                    </div>
                                                })}
                                            </div> */}
                                        </div>

                                        <div className="task-setting">
                                            <p className="m-0 ml-1">Steps</p>
                                            <div className="steps-column">
                                                {stepsList.map((step, index) => {
                                                    return <div key={index} className="step-div">
                                                        <div className="overlay-icon2">{step.number})</div>
                                                        <input onKeyDown={(e) => e.key === "Enter" ? updateStepsList("add") : null} id={`stepInput-${index}`} onChange={(e) => updateStep(e, index)} type='input' className={`step-input-box${darkMode ? "-dark" : ""}`} />
                                                        <div className="closeBtn4 ml-1">
                                                            <span onClick={() => updateStepsList("remove", index)} className="material-symbols-outlined">
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
                                    <button onClick={() => { addTask() }} className={`btn-primary${darkMode ? "-dark" : ""} mr-3`}>Add Task</button>
                                    <button onClick={() => onClose()} className={`btn-secondary${darkMode ? "-dark" : ""}`}>Cancel</button>
                                    <div className="task-setting-participants position-right">
                                        <div className="position-absolute toolTip">
                                            This feature is not set up yet!
                                        </div>
                                        <p className="m-0">Add participants</p>
                                        <div className="participants-box">
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
                    </div>
                </Fade>
            </div>
        </>
    )
}
export default CreateTaskModal;