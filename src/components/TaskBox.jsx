import React, { useContext, useEffect, useRef, useState } from 'react'
import CircularProgressBar from './CircularProgressBar'
import ReactDatePicker from 'react-datepicker'
import { format } from 'date-fns'
import { DataContext } from '../context/DataProvider'

const TaskBox = ({ task, index, quickTaskUpdates, openQuickUpdateModal, openEditTaskModal,  openDatePickerModal, openDateAndTimePickerModal }) => {
    const { userCategories, setUserCategories } = useContext(DataContext);
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
        const toolTip = document.getElementById(`taskBox-toolTip-${index}`)
        if (toolTip.classList.contains('d-none')) {
            toolTip.classList.remove('d-none')
        } else {
            toolTip.classList.add('d-none')
        }
    }
    const closeTaskBoxToolTip = () => {
        const toolTips = document.getElementsByClassName('taskBox-toolTip')

        for (let i = 0; i < toolTips.length; i++) {
            toolTips[i].classList.add('d-none')
        }
    }



    let durationIconText = null
    if (task.duration === "Short") {
        durationIconText = "clock_loader_20"
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
        notes: false
    })
    // edit task name
    const editTaskName = () => {
        const editCopy = { ...edit }
        editCopy.taskName = true
        setEdit(editCopy)
    }
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


    // edit steps
    const editSteps = (stepIndex) => {
        let editCopy = { ...edit }
        editCopy.steps = stepIndex
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
        setEdit(editCopy)
    }
    const refNotes = useRef(null)
    const hideOnClickOutsideNotes = (e) => {
        if (refNotes.current && !refNotes.current.contains(e.target)) {
            let editCopy = { ...edit }
            editCopy.notes = false
            setEdit(editCopy)
        }
    }


    const [selectedDate, setSelectedDate] = useState(task.endDate ? new Date(task.endDate) : null)
    const datifunc = (date) => {
        let formattedDate = format(date, "MM/dd/yyyy")
        return datify(formattedDate)
    }
    return (
        <>
            <><div key={index} onClick={() => toggleTaskBox(index)} id={`taskBoxContainer-${index}`} className="task-box-container">
                <div className="section">
                <div id={`taskBox-toolTip-${index}`} className="taskBox-toolTip d-none" style={{ width: task.myDay ? 216 : 174 }}>
                    <selection onClick={(e) => { e.stopPropagation(e); openEditTaskModal(task.id) }}>
                        <span className="material-symbols-outlined">
                            edit
                        </span>
                        <p className="m-0">Edit</p>
                    </selection>
                    <selection onClick={(e) => { e.stopPropagation(e); quickUpdate.toggleMyDay(task.id) }}>
                        <span className="material-symbols-outlined">
                            sunny
                        </span>
                        <p className="m-0">{task.myDay ? "Remove from My Day" : "Add to My Day"}</p>
                    </selection>
                    <selection onClick={(e) => e.stopPropagation()}>
                        <span className="material-symbols-outlined">
                            folder_open
                        </span>
                        <p className="m-0">Move to ...</p>
                        <div className="sub-selection" style={{ right: task.myDay? 228 : 186 }}>

                            {userCategories ? userCategories.categoryOrder.map((categoryName, index) => {
                                let category = userCategories.categories[categoryName]
                                return <div key={index} onClick={(e) => {e.stopPropagation(); quickUpdate.updateCategory(task.id, category.categoryName)}} className="option">
                                    <img src={category.iconUrl} alt="" className="catTinyIcon mr-1" />
                                    <p className="m-0">{category.categoryName}</p>
                                    <span className={`material-symbols-outlined medium position-right ${category.categoryName === task.category ? null : "d-none"}`}>
                                        check
                                    </span>
                                    </div>
                            }): null}
                           
                        </div>
                    </selection>
                    <selection onClick={(e) => { e.stopPropagation(e); openQuickUpdateModal(task.id, "delete") }}>
                        <span className="material-symbols-outlined">
                            delete
                        </span>
                        <p className="m-0">Delete</p>
                    </selection>
                </div>
                </div>
                <div className={`taskBox-overFlowLimit ${task.completed ? "faint-text" : null}`}>
                    <div className="task-box-content">
                        <div className="flx-r flx-1">
                            <span onClick={(e) => { e.stopPropagation(); quickUpdate.toggleCompleteTask(task.id) }} className={`material-symbols-outlined o-90 pointer ${task.completed ? "green-text" : null}`}>
                                {task.completed ? "check_circle" : "circle"}
                            </span>
                            <span onClick={(e) => { e.stopPropagation(); quickUpdate.togglePriority(task.id) }} className={`material-symbols-outlined darkred-text mr-1 pointer ${task.highPriority ? null : "fainter-text"}`}>
                                exclamation
                            </span>
                            {edit.taskName ?
                                <input ref={refTaskName} id={`taskNameInput-${index}`} onClick={(e) => e.stopPropagation(e)} onChange={(e) => { quickUpdate.updateTaskName(task.id, e); resizeTaskNameInput() }} type='input' value={task.taskName} className='input-style font-jakarta-strong' required></input>
                                :
                                <p className={`task-name font-jakarta-strong m-0 ${task.completed ? "line-out faint-text" : null}`}>{task.taskName}
                                    <span onClick={(e) => { e.stopPropagation(e); editTaskName() }} className="material-symbols-outlined small onHover-show ml-2">edit</span>
                                </p>
                            }
                        </div>
                        <div id={`simpleIconsTray-${index}`} className="simple-icons-tray flx-r gap-2 just-sb">
                            <div onClick={(e) => { e.stopPropagation(e); quickUpdate.toggleMyDay(task.id) }} className="myDay-detail">
                                <span className={`material-symbols-outlined pointer ${task.myDay ? "yellow-text" : "faintish-text"}`}>
                                    sunny
                                </span>
                            </div>
                            {task.endDate ?
                                <>
                                    <div onClick={(e) => { e.stopPropagation(); openDatePickerModal(task.id) }} className="date-detail">{datify(task.endDate)}
                                        {/* <ReactDatePicker onChange={(date) => { setSelectedDate(date); updateTaskEndDate(date) }} selected={selectedDate} value={datifunc(selectedDate)} placeholderText='Set Date' className="datepicker-detail" withPortal/> */}
                                    </div>
                                </>
                                :
                                <div onClick={(e) => { e.stopPropagation(); openDatePickerModal(task.id) }} className="date-detail faint-text small pointer"><u>Set Date</u></div>
                            }
                            <div onClick={(e) => { e.stopPropagation(); openQuickUpdateModal(task.id, 'duration', task.duration) }} className="duration-detail">
                                {durationIconText ?
                                    <span className="material-symbols-outlined m-auto">
                                        {durationIconText}
                                    </span>
                                    :
                                    <p className="m-0 faint-text m-auto small">n/a</p>
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


                        </div>
                        <span ref={refMenu} onClick={(e) => { e.stopPropagation(); toggleTaskBoxToolTip(index) }} className="material-symbols-outlined o-50 pointer">
                            more_vert
                        </span>

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
                                                <input ref={refStep} id={`stepInput-${index}-${stepIndex}`} onClick={(e) => e.stopPropagation(e)} onChange={(e) => { quickUpdate.updateStep(task.id, stepIndex, e); resizeStepInput(stepIndex) }} type="text" className="input-style2" value={step.desc} />
                                                :
                                                <p className={`m-0 my-h small ${step.completed ? "line-out faint-text" : null}`}>{/*<strong>{step.number})</strong>*/} {step.desc}
                                                    <span onClick={(e) => { e.stopPropagation(e); editSteps(stepIndex) }} className="material-symbols-outlined small onHover-show ml-2">edit</span>
                                                </p>
                                            }
                                        </div>
                                    </div>
                                })}
                            {task.notes &&
                                <div className="task-notes pt-2">
                                    <p className="m-0 small"><strong>Notes:</strong>
                                        <span onClick={(e) => { e.stopPropagation(e); editNotes() }} className="material-symbols-outlined small onHover-show ml-2">edit</span>
                                    </p>
                                    {edit.notes ?
                                        <textarea ref={refNotes} onClick={(e) => e.stopPropagation(e)} onChange={(e) => quickUpdate.updateNotes(task.id, e)} id='notesInput' className='textarea-boxflex' value={task.notes}></textarea>
                                        :
                                        <p className="m-0 small gray-text">{task.notes}</p>
                                    }
                                </div>}

                        </div>
                        <div id={`fullIconsTray-${index}`} className="full-icons-tray">
                            <div onClick={(e) => { e.stopPropagation() }} className="date-detail">
                                {task.endDate || task.endTime ?
                                    <div onClick={(e) => {e.stopPropagation(); openDateAndTimePickerModal(task.id)}} className="flx-c">
                                        <p className={`m-0 ${task.endTime ? "x-small" : "small"}`}>{task.endDate ? datify(task.endDate) : null}</p>
                                        <p className={`m-0 ${task.endDate ? "xx-small" : "small"}`}>{task.endTime}</p>
                                    </div>
                                    :
                                    <p onClick={(e) => {e.stopPropagation(); openDateAndTimePickerModal(task.id)}} className="m-0 small faint-text"><u>Set Date</u></p>
                                }
                            </div>
                            <div onClick={(e) => { e.stopPropagation(); openQuickUpdateModal(task.id, 'duration', task.duration) }} className="duration-detail">
                                {durationIconText ?
                                    <span className="material-symbols-outlined m-auto">
                                        {durationIconText}
                                    </span>
                                    :
                                    <p className="m-0 faint-text m-auto small">n/a</p>
                                }
                            </div>
                            <div onClick={(e) => { e.stopPropagation() }} className="progress-detail">
                                <div className="progress-box">
                                    <CircularProgressBar width={24} height={24} percent={taskPercent} />
                                </div>
                            </div>
                            <div onClick={(e) => { e.stopPropagation(); quickUpdate.toggleOutdoors(task.id) }} className="outdoors-detail">
                                <span className={`material-symbols-outlined m-auto ${task.outdoors ? null : "fainter-text"}`}>
                                    landscape
                                </span>
                            </div>
                            <div onClick={(e) => { e.stopPropagation(); openQuickUpdateModal(task.id, 'frequency', task.frequency) }} className="frequency-detail">
                                <p className="m-0 purple-text m-auto">{task.frequency}</p>
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
                            <div className="remove-task-btn hoverSlightFade">
                                <span onClick={(e) => { e.stopPropagation(e); openQuickUpdateModal(task.id, "delete") }} className="material-symbols-outlined m-auto">
                                    delete
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </>
        </>
    )
}
export default TaskBox;