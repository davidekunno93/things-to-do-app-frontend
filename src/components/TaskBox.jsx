import React, { useContext, useEffect, useRef, useState } from 'react'
import CircularProgressBar from './CircularProgressBar'
import ReactDatePicker from 'react-datepicker'
import { format } from 'date-fns'
import { DataContext } from '../context/DataProvider'

const TaskBox = ({ task, index, quickTaskUpdates, openQuickUpdateModal, openEditTaskModal, openDatePickerModal, openDateAndTimePickerModal, selectedCategory, selectedForDump, dumpSelection, deleteTaskFromDB }) => {
    const { userCategories, setUserCategories, group } = useContext(DataContext);
    const { firstTask, setFirstTask } = useContext(DataContext);
    const { databaseOn } = useContext(DataContext);
    const { darkMode } = useContext(DataContext);
    const { mobileWidth } = useContext(DataContext);
    // other functions
    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const datify = (mm_dd_yy) => {
        let twoDay = mm_dd_yy.slice(3, 5)
        let monthNum = mm_dd_yy.slice(0, 2)
        let year = mm_dd_yy.slice(8)
        let month = months[monthNum - 1]
        let day = twoDay.charAt(0) === "0" ? twoDay.slice(1) : twoDay;
        // Jan 6, 24
        return month + " " + day + ", " + year
    }
    const quickUpdate = quickTaskUpdates

    // taskbox expand/collapse code
    const expandTaskBox = (index) => {
        const taskExpandedWithTray = document.getElementById(`taskExpandedWithTray-${index}`)
        const taskBoxContainer = document.getElementById(`taskBoxContainer-${index}`)
        const simpleIconsTray = document.getElementById(`simpleIconsTray-${index}`)
        const fullIconsTray = document.getElementById(`fullIconsTray-${index}`)
        let wrapper = document.getElementById(`taskWrapper-${index}`)
        let fn_steps = document.getElementById(`taskFootNoteSteps-${index}`)
        let fn_notes = document.getElementById(`taskFootNoteNotes-${index}`)
        let fn_stepsandnotes = document.getElementById(`taskFootNoteStepsAndNotes-${index}`)

        if (task.steps.length > 0 || task.notes) {
            wrapper.classList.remove("mb-2")
        }
        if (fn_steps) {
            fn_steps.classList.add("hidden-o")
        }
        if (fn_notes) {
            fn_notes.classList.add("hidden-o")
        }
        if (fn_stepsandnotes) {
            fn_stepsandnotes.classList.add("hidden-o")
        }

        taskBoxContainer.style.height = `48px`

        taskExpandedWithTray.classList.remove('d-none')
        let extraHeight = taskExpandedWithTray.offsetHeight
        taskBoxContainer.style.height = `${48 + extraHeight}px`


        wait(300).then(() => {
            simpleIconsTray.style.transform = "translateY(-36px)"
            simpleIconsTray.classList.add('o-none')
            taskExpandedWithTray.classList.remove('o-none')
            fullIconsTray.style.transform = "translateY(0px)"
            fullIconsTray.classList.remove('o-none')

            // remove height so the taskbox height can change if contents are edited by the user
            taskBoxContainer.style.removeProperty('height')
        })

    }
    const collapseTaskBox = (index) => {
        const taskExpandedWithTray = document.getElementById(`taskExpandedWithTray-${index}`)
        const taskBoxContainer = document.getElementById(`taskBoxContainer-${index}`)
        const simpleIconsTray = document.getElementById(`simpleIconsTray-${index}`)
        const fullIconsTray = document.getElementById(`fullIconsTray-${index}`)
        let wrapper = document.getElementById(`taskWrapper-${index}`)
        let fn_steps = document.getElementById(`taskFootNoteSteps-${index}`)
        let fn_notes = document.getElementById(`taskFootNoteNotes-${index}`)
        let fn_stepsandnotes = document.getElementById(`taskFootNoteStepsAndNotes-${index}`)

        
        let extraHeight = taskExpandedWithTray.offsetHeight
        taskBoxContainer.style.height = `${48 + extraHeight}px`

        simpleIconsTray.style.transform = "translateY(0px)"
        simpleIconsTray.classList.remove('o-none')
        taskExpandedWithTray.classList.add('o-none')
        fullIconsTray.style.transform = "translateY(36px)"
        fullIconsTray.classList.add('o-none')

        wait(300).then(() => {
            taskExpandedWithTray.classList.add('d-none')
            taskBoxContainer.style.height = `48px`
            if (task.steps.length > 0 || task.notes) {
                wrapper.classList.add("mb-2")
            }
            if (fn_steps) {
                fn_steps.classList.remove("hidden-o")
            }
            if (fn_notes) {
                fn_notes.classList.remove("hidden-o")
            }
            if (fn_stepsandnotes) {
                fn_stepsandnotes.classList.remove("hidden-o")
            }
        })
    }
    const toggleTaskBox = (index) => {
        const taskBoxContainer = document.getElementById(`taskBoxContainer-${index}`)
        const taskExpandedWithTray = document.getElementById(`taskExpandedWithTray-${index}`)
        if (taskExpandedWithTray.classList.contains('d-none')) {
            expandTaskBox(index)
        } else {
            collapseTaskBox(index)
        }
    }


    // tooltip code
    const refMenu = useRef(null)
    useEffect(() => {
        document.addEventListener('click', hideOnClickOutsideMenu, true)
    }, [])
    const hideOnClickOutsideMenu = (e) => {
        if (refMenu.current && !refMenu.current.contains(e.target)) {
            closeTaskBoxToolTip()
        }
    }
    const toggleTaskBoxToolTip = (index) => {
        let toolTip = document.getElementById(`taskBox-toolTip-${index}`)
        if (toolTip.classList.contains('d-none')) {
            toolTip.classList.remove('d-none')
            // console.log('1')
        } else {
            // specialized for ref purposes.
            toolTip.classList.add('d-none')
            // console.log('2')
        }
    }
    const closeTaskBoxToolTip = () => {
        let toolTips = document.getElementsByClassName('taskBox-toolTip')
        // const toolTip = document.getElementsByClassName(`taskBox-toolTip-${index}`)
        // toolTip.classList.add('d-none')

        for (let i = 0; i < toolTips.length; i++) {
            toolTips[i].classList.add('d-none')
        }
    }



    let durationIconText = null
    if (task.duration === "Short") {
        durationIconText = "clock_loader_10"
    } else if (task.duration === "Medium") {
        durationIconText = "clock_loader_40"
    } else if (task.duration === "Long") {
        durationIconText = "clock_loader_90"
    }
    let taskPercent = 0
    if (task.completed) {
        taskPercent = 100
    } else if (task.steps.length > 0) {
        let stepsAmount = task.steps.length
        let stepsCompleted = 0
        for (let i = 0; i < stepsAmount; i++) {
            if (task.steps[i].completed) {
                stepsCompleted++
            }
        }
        taskPercent = Math.floor(stepsCompleted * 100 / stepsAmount)
    }


    // edit task input code
    const [edit, setEdit] = useState({
        taskName: false,
        steps: null, // steps value = the step number that will become editable
        location: false,
        notes: false
    })
    // edit task name
    const editTaskName = () => {
        const editCopy = { ...edit }
        let sendDataStandbyCopy = { ...sendDataStandby }
        sendDataStandbyCopy.taskName = true;
        editCopy.taskName = true
        setEdit(editCopy)
        setSendDataStandby(sendDataStandbyCopy)
    }
    const [sendDataStandby, setSendDataStandby] = useState({
        taskName: false,
        steps: false,
        location: false,
        notes: false
    });

    const resizeTaskNameInput = () => {
        // index is passed into this component as a prop
        const taskNameInput = document.getElementById(`taskNameInput-${index}`)
        let offset = Math.floor(taskNameInput.value.length / 6) - 1
        taskNameInput.style.width = taskNameInput.value.length - offset + "ch";
    }
    useEffect(() => {
        document.addEventListener('click', hideOnClickOutsideName, true)
        document.addEventListener('click', hideOnClickOutsideStep, true)
        document.addEventListener('click', hideOnClickOutsideNotes, true)
        document.addEventListener('click', hideOnClickOutsideLocation, true)
    }, [])
    useEffect(() => {
        const taskNameInput = document.getElementById(`taskNameInput-${index}`)
        if (edit.taskName) {
            resizeTaskNameInput()
            taskNameInput.focus()
        } else if (typeof edit.steps === "number") {
            const stepInput = document.getElementById(`stepInput-${index}-${edit.steps}`)
            resizeStepInput(edit.steps)
            stepInput.focus()
        } else if (edit.location) {
            let locationInput = document.getElementById(`locationInput-${index}`)
            resizeLocationInput()
            locationInput.focus()
        }
    }, [edit])

    const refTaskName = useRef(null)
    const hideOnClickOutsideName = (e) => {
        if (refTaskName.current && !refTaskName.current.contains(e.target)) {
            let editCopy = { ...edit }
            editCopy.taskName = false
            setEdit(editCopy)
        }
    }
    const completeTaskNameEdit = (e) => {
        let editCopy = { ...edit }
        editCopy.taskName = false
        setEdit(editCopy)
    }



    // edit location
    const editLocation = () => {
        let editCopy = { ...edit }
        editCopy.location = true
        let sendDataStandbyCopy = { ...sendDataStandby }
        sendDataStandbyCopy.location = true;
        setSendDataStandby(sendDataStandbyCopy)
        setEdit(editCopy)
    }
    const resizeLocationInput = () => {
        // index is passed into this component as a prop
        const locationInput = document.getElementById(`locationInput-${index}`)
        let locationPopUp = document.getElementById(`location-popUp-${index}`)
        let offset = 0
        if (mobileWidth) {
            offset = Math.floor(locationInput.value.length / 6) - 1
            // after 10 chars, for every char I need the popUp and after to slide __px to the left (translateX -__ more px, )
            if (locationInput.value.length > 9) {
                // console.log('> 10')
                let leftTransform = 10 + 7.5 * (locationInput.value.length - 9)
                locationPopUp.style.transform = `translateX(-${leftTransform}px)`
            } else {
                locationPopUp.style.transform = `translateX(-10px)`
            }
        } else {
            offset = Math.floor(locationInput.value.length / 6) - 1
        }
        locationInput.style.width = locationInput.value.length - offset + "ch";
    }
    const refLocation = useRef(null)
    const hideOnClickOutsideLocation = (e) => {
        if (refLocation.current && !refLocation.current.contains(e.target)) {
            let editCopy = { ...edit }
            editCopy.location = false
            setEdit(editCopy)
        }
    }
    const completeLocationEdit = () => {
        // console.log("hi")
        let editCopy = { ...edit }
        editCopy.location = false
        setEdit(editCopy)
    }

    const openLocationPopUp = () => {
        let locationPopUp = document.getElementById(`location-popUp-${index}`)
        let locationPopUpAfter = document.getElementById(`location-popUp-after-${index}`)
        locationPopUp.classList.remove('hidden-o')
        locationPopUpAfter.classList.remove('hidden-o')
    }
    const closeLocationPopUp = () => {
        let locationPopUp = document.getElementById(`location-popUp-${index}`)
        let locationPopUpAfter = document.getElementById(`location-popUp-after-${index}`)
        locationPopUp.classList.add('hidden-o')
        locationPopUpAfter.classList.add('hidden-o')
    }
    const toggleLocationPopUp = () => {
        let locationPopUp = document.getElementById(`location-popUp-${index}`)
        if (locationPopUp.classList.contains('hidden-o')) {
            openLocationPopUp()
            if (!task.location) {
                editLocation()
            }
        } else {
            closeLocationPopUp()
        }
    }

    // edit steps
    const editSteps = (stepIndex) => {
        let editCopy = { ...edit }
        editCopy.steps = stepIndex
        let sendDataStandbyCopy = { ...sendDataStandby }
        sendDataStandbyCopy.steps = stepIndex
        setSendDataStandby(sendDataStandbyCopy)
        setEdit(editCopy)
    }
    const resizeStepInput = (stepIndex) => {
        // index is passed into this component as a prop
        const stepInput = document.getElementById(`stepInput-${index}-${stepIndex}`)
        let offset = Math.floor(stepInput.value.length / 6) - 1
        stepInput.style.width = stepInput.value.length - offset + 'ch';
    }
    const refStep = useRef(null)
    const hideOnClickOutsideStep = (e) => {
        if (refStep.current && !refStep.current.contains(e.target)) {
            let editCopy = { ...edit }
            editCopy.steps = null
            setEdit(editCopy)
        }
    }
    const completeStepEdit = () => {
        let editCopy = { ...edit }
        editCopy.steps = false
        setEdit(editCopy)
    }

    // edit notes
    const editNotes = () => {
        const editCopy = { ...edit }
        // the toggle doesn't work while the input textarea has the ref added on it for some reason
        // if (editCopy.notes) {
        //     editCopy.notes = false
        // } else {
        //     editCopy.notes = true
        // }
        editCopy.notes = true
        let sendDataStandbyCopy = { ...sendDataStandby }
        sendDataStandbyCopy.notes = true;
        setSendDataStandby(sendDataStandbyCopy)
        setEdit(editCopy)
    }
    const refNotes = useRef(null)
    const hideOnClickOutsideNotes = (e) => {
        if (refNotes.current && !refNotes.current.contains(e.target)) {
            let editCopy = { ...edit }
            let stepIndex = editCopy.notes
            editCopy.notes = false
            setEdit(editCopy)
        }
    }
    // not used because enter key while in notes edit is used to create a new line
    const completeNotesEdit = () => {
        let editCopy = { ...edit }
        editCopy.notes = false
        setEdit(editCopy)
    }
    // send taskName, notes, steps or location to backend after complete edit
    useEffect(() => {
        // if edit taskName = false && standby taskName = true > send data to backend 
        // set standby to false
        if (edit.taskName === false && sendDataStandby.taskName === true) {
            // console.log(`send taskName data now: ${task.taskName}`)
            if (databaseOn) {
                // send updated information to backend database
                quickUpdate.updateTaskName(task.id, task.taskName, true)
            }
            let sendDataStandbyCopy = { ...sendDataStandby }
            sendDataStandbyCopy.taskName = false;
            setSendDataStandby(sendDataStandbyCopy)
        }
        if (edit.steps === false && sendDataStandby.steps !== false && sendDataStandby.steps !== true) {
            if (databaseOn) {
                // send step data
                let stepIndex = sendDataStandby.steps
                // console.log(stepIndex)
                // console.log("step desc: " + task.steps[stepIndex].desc)
                // send updated information to backend database
                quickUpdate.updateStep(task.id, stepIndex, task.steps[stepIndex].desc, true)
            }
            let sendDataStandbyCopy = { ...sendDataStandby }
            sendDataStandbyCopy.steps = false;
            setSendDataStandby(sendDataStandbyCopy)
        }
        if (edit.location === false && sendDataStandby.location === true) {
            // console.log('update location now')
            if (databaseOn) {
                quickUpdate.updateLocation(task.id, task.location, true)
            }
        }
        if (edit.notes === false && sendDataStandby.notes === true) {
            console.log('send notes data now')
            // send updated information to backend database
            quickUpdate.updateNotes(task.id, task.notes, true)
        }
    }, [edit])


    const [selectedDate, setSelectedDate] = useState(task.endDate ? new Date(task.endDate) : null)
    const datifunc = (date) => {
        let formattedDate = format(date, "MM/dd/yyyy")
        return datify(formattedDate)
    }

    const priorityPopUpOnFirstTask = () => {
        if (firstTask) {
            let priorityPopUp = document.getElementById(`priorityIndicatorPopUp-${index}`)
            wait(600).then(() => {
                priorityPopUp.classList.remove('hidden-o')
                setFirstTask(false)
                wait(5000).then(() => {
                    priorityPopUp.classList.add('hidden-o')
                })
            })
        }
    }

    useEffect(() => {
        priorityPopUpOnFirstTask()
    }, [])

    return (
        <>
            <div id={`taskWrapper-${index}`} className={`td-2 position-relative ${task.steps.length > 0 || task.notes ? "mb-2" : ""}`}>
                <div key={index} onClick={() => toggleTaskBox(index)} id={`taskBoxContainer-${index}`} className={`task-box-container${darkMode ? "-dark" : ""}`}>
                    {/* priority indicator popup */}
                    <div id={`priorityIndicatorPopUp-${index}`} className="priority-indicator-popup hidden-o">
                        <p className="m-0 small font-jakarta black-text">Click<span className='material-symbols-outlined v-align largish red-text'>exclamation</span>to toggle task <span className="bold600">high priority</span></p>
                    </div>
                    {/* end priority indicator popup */}
                    {/* taskbar options */}
                    <div className="taskbar-options section">
                        <div ref={refMenu} id={`taskBox-toolTip-${index}`} className={`taskBox-toolTip d-none ${darkMode ? "taskBox-toolTip-dark" : null}`} style={{ width: task.myDay ? 216 : 174 }}>
                            <selection onClick={(e) => { e.stopPropagation(e); openEditTaskModal(task.id); closeTaskBoxToolTip() }}>
                                <span className={`material-symbols-outlined ${darkMode ? "blue-text" : null}`}>
                                    edit
                                </span>
                                <p className="m-0">Edit</p>
                            </selection>
                            <selection onClick={(e) => { e.stopPropagation(e); quickUpdate.toggleMyDay(task.id); closeTaskBoxToolTip() }}>
                                <span className={`material-symbols-outlined ${darkMode ? "yellow-text" : null}`}>
                                    sunny
                                </span>
                                <p className="m-0">{task.myDay ? "Remove from My Day" : "Add to My Day"}</p>
                            </selection>
                            <selection onClick={(e) => e.stopPropagation()}>
                                <span className={`material-symbols-outlined ${darkMode ? "orange-text" : null}`}>
                                    folder_open
                                </span>
                                <p className="m-0">Move to ...</p>
                                <div className={`sub-selection${darkMode ? "-dark" : ""}`} style={{ right: mobileWidth ? 12 : task.myDay ? 228 : 186, top: mobileWidth ? 120 : "" }}>

                                    {userCategories ? userCategories.categoryOrder.map((categoryName, index) => {
                                        let category = userCategories.categories[categoryName]
                                        return <div key={index} onClick={(e) => { e.stopPropagation(); quickUpdate.updateCategory(task.id, category.categoryName); closeTaskBoxToolTip() }} className="option">
                                            <img src={category.iconUrl} alt="" className="catTinyIcon mr-1" />
                                            <p className="m-0">{category.categoryName}</p>
                                            <span className={`material-symbols-outlined medium position-right ${category.categoryName === task.category ? null : "d-none"}`}>
                                                check
                                            </span>
                                        </div>
                                    }) : null}
                                    {task.category && task.category !== "None" &&
                                        <div onClick={() => { quickUpdate.updateCategory(task.id, "None"); closeTaskBoxToolTip() }} className="option red-text">
                                            <span className="material-symbols-outlined large catTinyIcon mr-1">block</span>
                                            <p className="m-0">None</p>
                                        </div>
                                    }

                                </div>
                            </selection>
                            <selection onClick={(e) => { e.stopPropagation(e); openQuickUpdateModal(task.id, task.db_task_id, "delete"); closeTaskBoxToolTip() }}>
                                <span className={`material-symbols-outlined ${darkMode ? "red-text" : null}`}>
                                    delete
                                </span>
                                <p className="m-0">Delete</p>
                            </selection>
                        </div>
                    </div>
                    {/* end taskbar options */}
                    <div className={`taskBox-overFlowLimit ${task.completed ? darkMode ? "faint-text-dark" : "faint-text" : null}`}>
                        <div className="task-box-content">
                            <div className="flx-r flx-1">
                                {selectedCategory === "completed" ?
                                    selectedForDump.includes(task.id) ?
                                        <span onClick={(e) => { e.stopPropagation(); dumpSelection.remove(task.id) }} className={`material-symbols-outlined o-90 pointer ${darkMode ? "lightblue-text" : "blue-text"}`}>
                                            check_box
                                        </span>
                                        :
                                        <span onClick={(e) => { e.stopPropagation(); dumpSelection.add(task.id) }} className={`material-symbols-outlined o-90 pointer ${darkMode ? "gray-text" : "dark-text"}`}>
                                            check_box_outline_blank
                                        </span>
                                    :
                                    <span onClick={(e) => { e.stopPropagation(); quickUpdate.toggleCompleteTask(task.id) }} className={`material-symbols-outlined o-90 pointer ${task.completed ? "green-text" : null}`}>
                                        {task.completed ? "check_circle" : "circle"}
                                    </span>
                                }

                                <span onClick={(e) => { e.stopPropagation(); quickUpdate.togglePriority(task.id) }} className={`material-symbols-outlined darkred-text mr-1 pointer ${task.highPriority ? null : darkMode ? "faintish-text-dark" : "faint-text"}`}>
                                    exclamation
                                </span>

                                {edit.taskName ?
                                    <input ref={refTaskName} id={`taskNameInput-${index}`} onKeyDown={(e) => e.key === "Enter" ? completeTaskNameEdit(e) : null} onClick={(e) => e.stopPropagation(e)} onChange={(e) => { quickUpdate.updateTaskName(task.id, e.target.value); resizeTaskNameInput() }} type='input' value={task.taskName} className='input-style font-jakarta-strong' required></input>
                                    :
                                    <p className={`task-name font-jakarta-strong m-0 ${task.completed ? darkMode ? "line-out faint-text-dark" : "line-out faint-text" : null}`}>{task.taskName}
                                        {!mobileWidth &&
                                            <span onClick={(e) => { e.stopPropagation(e); editTaskName() }} className="material-symbols-outlined small onHover-show ml-2">edit</span>
                                        }
                                    </p>
                                }
                            </div>
                            <div id={`simpleIconsTray-${index}`} className="simple-icons-tray flx-r gap-2 just-sb">
                                {!mobileWidth && task.category && task.category !== "None" && !group &&
                                    <div className="group-detail-holder">
                                        <div className={`group-detail group-detail${userCategories.categories[task.category].color ? "-" + userCategories.categories[task.category].color : ""}`}>
                                            <p className="m-auto">{task.category}</p>
                                        </div>
                                    </div>
                                }
                                <div onClick={(e) => { e.stopPropagation(e); quickUpdate.toggleMyDay(task.id) }} className="myDay-detail">
                                    <span className={`material-symbols-outlined pointer ${task.myDay ? "yellow-text" : darkMode ? "darkgray-text" : "faintish-text"}`}>
                                        sunny
                                    </span>
                                </div>
                                {!mobileWidth && task.endDate &&
                                    <>
                                        <div onClick={(e) => { e.stopPropagation(); openDateAndTimePickerModal(task.id) }} className="date-detail">{datify(task.endDate)}
                                            {/* <ReactDatePicker onChange={(date) => { setSelectedDate(date); updateTaskEndDate(date) }} selected={selectedDate} value={datifunc(selectedDate)} placeholderText='Set Date' className="datepicker-detail" withPortal/> */}
                                        </div>
                                    </>
                                }
                                {!mobileWidth && !task.endDate &&
                                    <div onClick={(e) => { e.stopPropagation(); openDatePickerModal(task.id) }} className={`date-detail ${darkMode ? "darkgray-text" : "faint-text"} small pointer`}><u>Set Date</u></div>
                                }
                                {!mobileWidth &&
                                    <>
                                        <div onClick={(e) => { e.stopPropagation(); openQuickUpdateModal(task.id, task.db_task_id, 'duration', task.duration) }} className="duration-detail">
                                            {durationIconText ?
                                                <span className={`material-symbols-outlined m-auto ${task.duration === "Short" && "lighterblue-text"} ${task.duration === "Medium" && "blue-text"} ${task.duration === "Long" && "darkerblue-text"}`}>
                                                    {durationIconText}
                                                </span>
                                                :
                                                <p className={`${darkMode ? "faint-text-dark" : "faint-text"} m-auto small`}>n/a</p>
                                            }
                                        </div>
                                        <div onClick={(e) => { e.stopPropagation() }} className="progress-detail">
                                            <div className="progress-box">
                                                <CircularProgressBar width={24} height={24} percent={taskPercent} />
                                            </div>
                                        </div>
                                        <div className="participants-detail">
                                            <div onClick={(e) => e.stopPropagation(e)} className="add-participant m-auto">
                                                <div className="circle">
                                                    <span className="material-symbols-outlined medium">
                                                        add
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                    </>
                                }
                            </div>
                            {/* toggle task options btn */}
                            <span onClick={(e) => { e.stopPropagation(); toggleTaskBoxToolTip(index) }} className="material-symbols-outlined o-50 pointer">
                                more_vert
                            </span>
                            {/* end toggle task options btn */}

                        </div>

                        <div id={`taskExpandedWithTray-${index}`} className="taskExpandedWithTray d-none o-none">
                            <div id={`taskExpandedContent-${index}`} className="task-expanded-content">
                                {task.steps &&
                                    task.steps.map((step, stepIndex) => {
                                        let forEdit = edit.steps
                                        return <div key={stepIndex} className="step-box">
                                            <span onClick={(e) => { e.stopPropagation(e); quickUpdate.toggleCompleteStep(task.id, stepIndex) }} className={`material-symbols-outlined large mr-2 pointer ${step.completed ? "green-text" : null}`}>
                                                {step.completed ? "check_circle" : "circle"}
                                            </span>
                                            <div className="step-text-line">
                                                {stepIndex === forEdit ?
                                                    <input ref={refStep} id={`stepInput-${index}-${stepIndex}`} onKeyDown={(e) => e.key === "Enter" ? completeStepEdit() : null} onClick={(e) => e.stopPropagation(e)} onChange={(e) => { quickUpdate.updateStep(task.id, stepIndex, e.target.value); resizeStepInput(stepIndex) }} type="text" className="input-style2" value={step.desc} />
                                                    :
                                                    <p className={`m-0 my-h small ${step.completed ? darkMode ? "line-out faint-text-dark" : "line-out faint-text" : null}`}>{/*<strong>{step.number})</strong>*/} {step.desc}
                                                        {!mobileWidth &&
                                                            <span onClick={(e) => { e.stopPropagation(e); editSteps(stepIndex) }} className="material-symbols-outlined small onHover-show ml-2">edit</span>
                                                        }
                                                    </p>
                                                }
                                            </div>
                                        </div>
                                    })}
                                {task.notes &&
                                    <div className="task-notes pt-2">
                                        <p className="m-0 small"><strong>Notes:</strong>
                                            {!mobileWidth &&
                                                <span onClick={(e) => { e.stopPropagation(e); editNotes() }} className="material-symbols-outlined small onHover-show ml-2">edit</span>
                                            }
                                        </p>
                                        {edit.notes ?
                                            <textarea ref={refNotes} onClick={(e) => e.stopPropagation(e)} onChange={(e) => quickUpdate.updateNotes(task.id, e.target.value)} id='notesInput' className='textarea-boxflex' value={task.notes}></textarea>
                                            :
                                            <p className="m-0 small gray-text">{task.notes}</p>
                                        }
                                    </div>}

                            </div>
                            <div id={`fullIconsTray-${index}`} className="full-icons-tray">
                                <div onClick={(e) => { e.stopPropagation() }} className="date-detail">
                                    {task.endDate || task.endTime ?
                                        <div onClick={(e) => { e.stopPropagation(); openDateAndTimePickerModal(task.id) }} className="flx-c">
                                            <p className={`m-0 ${task.endTime ? "x-small" : "small"}`}>{task.endDate ? datify(task.endDate) : null}</p>
                                            <p className={`m-0 ${task.endDate ? "xx-small" : "small"}`}>{task.endTime}</p>
                                        </div>
                                        :
                                        <p onClick={(e) => { e.stopPropagation(); openDateAndTimePickerModal(task.id) }} className={`m-0 small ${darkMode ? "darkgray-text" : "faint-text"}`}><u>Set Date</u></p>
                                    }
                                </div>
                                <div onClick={(e) => { e.stopPropagation(e); quickUpdate.toggleMyDay(task.id) }} className="myDay-detail">
                                    <span className={`material-symbols-outlined pointer ${task.myDay ? "yellow-text" : darkMode ? "faint-text-dark" : "faintish-text"}`}>
                                        sunny
                                    </span>
                                </div>
                                <div onClick={(e) => { e.stopPropagation(); openQuickUpdateModal(task.id, task.db_task_id, 'duration', task.duration) }} className="duration-detail">
                                    {durationIconText ?
                                        <span className={`material-symbols-outlined m-auto ${task.duration === "Short" && "lighterblue-text"} ${task.duration === "Medium" && "blue-text"} ${task.duration === "Long" && "darkerblue-text"}`}>
                                            {durationIconText}
                                        </span>
                                        :
                                        <p className={`${darkMode ? "faint-text-dark" : "faint-text"} m-auto small`}>n/a</p>
                                    }
                                </div>
                                <div onClick={(e) => { e.stopPropagation() }} className="progress-detail">
                                    <div className="progress-box">
                                        <CircularProgressBar width={24} height={24} percent={taskPercent} />
                                    </div>
                                </div>
                                {/* <div onClick={(e) => { e.stopPropagation(); quickUpdate.toggleOutdoors(task.id) }} className="outdoors-detail">
                                <span className={`material-symbols-outlined m-auto ${task.outdoors ? null : "fainter-text"}`}>
                                    landscape
                                </span>
                            </div> */}
                                <div onClick={(e) => { e.stopPropagation() }} className="location-detail position-relative">
                                    <div id={`location-popUp-${index}`} className={`location-popUp ${mobileWidth && "location-popUp-mobile"} hidden-o gap-2`}>
                                        {edit.location ?
                                            <input ref={refLocation} id={`locationInput-${index}`} onKeyDown={(e) => e.key === "Enter" ? completeLocationEdit(e) : null} onChange={(e) => { quickUpdate.updateLocation(task.id, e.target.value); resizeLocationInput() }} type="text" className={`input-style4 font-jakarta dark-text ${mobileWidth && "small"}`} value={task.location ? task.location : ""} />
                                            :
                                            <p className={`m-0 font-jakarta ws-nowrap ${mobileWidth && "small"}`}>{task.location ? task.location : ""}</p>
                                        }
                                        <span onClick={() => editLocation()} className="material-symbols-outlined medium o-50 hoverOpaque pointer">
                                            edit
                                        </span>
                                    </div>
                                    <div id={`location-popUp-after-${index}`} className={`location-popUp-after ${mobileWidth && "location-popUp-after-mobile"} hidden-o`}></div>
                                    <span onClick={() => toggleLocationPopUp()} className={`material-symbols-outlined m-auto ${task.location ? darkMode ? "white-text" : null : darkMode ? "darkgray-text" : "faint-text"}`}>
                                        location_on
                                    </span>
                                </div>
                                <div onClick={(e) => { e.stopPropagation(); openQuickUpdateModal(task.id, task.db_task_id, 'frequency', task.frequency) }} className="frequency-detail">
                                    <p className="purple-text m-auto">{task.frequency}</p>
                                </div>
                                {!mobileWidth &&
                                    <div className="participants-detail">
                                        <div onClick={(e) => e.stopPropagation(e)} className="add-participant m-auto">
                                            <div className="circle">
                                                <span className="material-symbols-outlined medium">
                                                    add
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                }
                                <div className="remove-task-btn hoverSlightFade">
                                    <span onClick={(e) => { e.stopPropagation(e); openQuickUpdateModal(task.id, task.db_task_id, "delete") }} className="material-symbols-outlined m-auto">
                                        delete
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
                {task.steps.length > 0 && !task.notes &&
                <div id={`taskFootNoteSteps-${index}`} className={`steps-indicator${darkMode ? "-dark" : ""}`}>
                    <p className="x-small m-auto">Steps: <span className={`${darkMode ? "black-text" : "white-text"}`}>{task.steps.length}</span></p>
                </div>
                }
                {!task.steps.length > 0 && task.notes &&
                <div id={`taskFootNoteNotes-${index}`} className={`notes-indicator${darkMode ? "-dark" : ""}`}>
                    <p className="x-small m-auto">Notes</p>
                </div>
                }
                {task.steps.length > 0 && task.notes &&
                <div id={`taskFootNoteStepsAndNotes-${index}`} className="stepsandnotes-indicator">
                    <div className={`steps${darkMode ? "-dark" : ""} flx-1`}>
                        <p className="x-small m-auto">Steps: <span className={`${darkMode ? "black-text" : "white-text"}`}>{task.steps.length}</span></p>
                    </div>
                    <div className={`notes${darkMode ? "-dark" : ""} flx-1`}>
                        <p className="x-small m-auto">Notes</p>
                    </div>
                </div>
                }
            </div>
        </>
    )
}
export default TaskBox;