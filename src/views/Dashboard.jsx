import React, { useContext, useEffect, useRef, useState } from 'react'
import CreateTaskModal from '../components/CreateTaskModal'
import CircularProgressBar from '../components/CircularProgressBar';
import { DataContext } from '../context/DataProvider';
import TaskBox from '../components/TaskBox';
import QuickUpdateModal from '../components/quickUpdateModal';
import EditTaskModal from '../components/EditTaskModal';
import DatePickerModal from '../components/DatePickerModal';
import { format } from 'date-fns';
import CreateCategoryModal from '../components/CreateCategoryModal';


const Dashboard = () => {
    const { tasks, setTasks, users, categories, selectedCategory, setSelectedCategory } = useContext(DataContext);
    const [newTaskModalOpen, setNewTaskModalOpen] = useState(false)
    const taskObj = {
        taskName: "",
        category: "",
        notes: null,
        highPriority: false,
        endDate: null,
        endTime: null,
        frequency: "",
        duration: null,
        outdoors: false,
        participants: null, // [{uid: "", displayName: "", photoURL: ""}]
        steps: [], // [{number: "", desc: "", completed: ""}]
        progress: 0,
        completed: false
    };


    // other functions
    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
    const datify = (mm_dd_yy) => {
        let twoDay = mm_dd_yy.slice(3, 5)
        let monthNum = mm_dd_yy.slice(0, 2)
        let year = mm_dd_yy.slice(8)
        let month = months[monthNum - 1]
        let day = twoDay.charAt(0) === "0" ? twoDay.slice(1) : twoDay;
        // Jan 6, 24
        return month + " " + day + ", " + year
    }
    const datifunc = (date) => {
        let formattedDate = format(date, "MM/dd/yyyy")
        return datify(formattedDate)
    }

    // create new task modal
    const openCreateNewTask = () => {
        setNewTaskModalOpen(true)
    }
    const closeCreateNewTask = () => {
        setNewTaskModalOpen(false)
    }



    // taskbox expand code
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
    const toggleTaskBoxToolTip = (index) => {
        const toolTip = document.getElementById(`taskBox-toolTip-${index}`)
        if (toolTip.classList.contains('d-none')) {
            toolTip.classList.remove('d-none')
        } else {
            toolTip.classList.add('d-none')
        }
    }
    const refMenu = useRef(null)
    useEffect(() => {
        document.addEventListener('click', hideOnClickOutsideMenu, true)
    }, [])
    const hideOnClickOutsideMenu = (e) => {
        if (refMenu.current && !refMenu.current.contains(e.target)) {
            closeTaskBoxToolTip()
        }
    }
    const closeTaskBoxToolTip = () => {
        const toolTips = document.getElementsByClassName('taskBox-toolTip')

        for (let i = 0; i < toolTips.length; i++) {
            toolTips[i].classList.add('d-none')
        }
    }


    // update tasks code
    const removeTask = (index) => {
        let tasksCopy = Object.values(tasks)
        tasksCopy.splice(index, 1)
        let newTasksObj = {}
        for (let i = 0; i < tasksCopy.length; i++) {
            tasksCopy[i].id = i + 1
            newTasksObj[i + 1] = tasksCopy[i]
        }
        setTasks(newTasksObj)
        closeTaskBoxToolTip()
    }

    const quickTaskUpdates = {
        toggleCompleteStep: function (taskId, stepIndex) {
            let tasksCopy = { ...tasks }
            if (tasksCopy[taskId].steps[stepIndex].completed) {
                tasksCopy[taskId].steps[stepIndex].completed = false
            } else {
                tasksCopy[taskId].steps[stepIndex].completed = true
            }
            setTasks(tasksCopy)
        },
        toggleCompleteTask: function (taskId) {
            let tasksCopy = { ...tasks }
            if (tasksCopy[taskId].completed) {
                tasksCopy[taskId].completed = false
            } else {
                tasksCopy[taskId].completed = true
            }
            setTasks(tasksCopy)
        },
        toggleMyDay: function (taskId) {
            let tasksCopy = { ...tasks }
            if (tasks[taskId].myDay) {
                tasksCopy[taskId].myDay = false
            } else {
                tasksCopy[taskId].myDay = true
            }
            setTasks(tasksCopy)
        },
        toggleOutdoors: function (taskId) {
            let tasksCopy = { ...tasks }
            if (tasks[taskId].outdoors) {
                tasksCopy[taskId].outdoors = false
            } else {
                tasksCopy[taskId].outdoors = true
            }
            setTasks(tasksCopy)
        },
        togglePriority: function (taskId) {
            let tasksCopy = { ...tasks }
            if (tasks[taskId].highPriority) {
                tasksCopy[taskId].highPriority = false
            } else {
                tasksCopy[taskId].highPriority = true
            }
            setTasks(tasksCopy)
        },
        updateEndDate: function (taskId, date) {
            let tasksCopy = { ...tasks }
            // console.log(datifunc(date))
            if (date) {
                if (date === "clear") {
                    tasksCopy[taskId].endDate = null
                } else {
                    tasksCopy[taskId].endDate = format(date, "MM/dd/yyyy")
                }
            }
            setTasks(tasksCopy)
        },
        updateDuration: function (taskId, option) {
            let tasksCopy = { ...tasks }
            if (option) {
                tasksCopy[taskId].duration = option
            } else {
                tasksCopy[taskId].duration = null
            }
            setTasks(tasksCopy)
        },
        updateFrequency: function (taskId, option) {
            let tasksCopy = { ...tasks }
            tasksCopy[taskId].frequency = option
            setTasks(tasksCopy)
        },
        updateNotes: function (taskId, e) {
            let tasksCopy = { ...tasks }
            tasksCopy[taskId].notes = e.target.value
            setTasks(tasksCopy)
        },
        updateStep: function (taskId, stepIndex, e) {
            // console.log("taskId: "+taskId, ", index: "+stepIndex)
            let tasksCopy = { ...tasks }
            tasksCopy[taskId].steps[stepIndex].desc = e.target.value
            setTasks(tasksCopy)
        },
        updateTaskName: function (taskId, e) {
            let tasksCopy = { ...tasks }
            tasksCopy[taskId].taskName = e.target.value
            setTasks(tasksCopy)
        },
        remove: function (taskId) {
            // reserializes entire tasks object
            // let tasksCopy = { ...tasks }
            // delete tasksCopy[taskId]
            // let tasksArr = Object.values(tasksCopy)
            // let newTasksObj = {}
            // for (let i = 0; i < tasksArr.length; i++) {
            //     tasksArr[i].id = i + 1
            //     newTasksObj[i + 1] = tasksArr[i]
            // }
            // setTasks(newTasksObj)

            // attempt at reserializing only the tasks ahead of the one being removed - working
            let tasksCopy = { ...tasks }
            delete tasksCopy[taskId]
            let tasksArr = Object.values(tasksCopy)
            for (let i = taskId - 1; i < tasksArr.length; i++) {
                tasksArr[i].id = i + 1
                tasksCopy[i + 1] = tasksArr[i]
                console.log(i)
            }
            delete tasksCopy[tasksArr.length + 1]
            setTasks(tasksCopy)
        }
    }


    const [quickUpdateModalOpen, setQuickUpdateModalOpen] = useState(false)
    // const [quickUpdateModalDetail, setQuickUpdateModalDetail] = useState(null)


    const [quickUpdateSettings, setQuickUpdateSettings] = useState({
        detail: null,
        option: null
    })

    const openQuickUpdateModal = (taskId, detail, option) => {
        setQuickUpdateSettings({
            taskId: taskId,
            detail: detail,
            option: option
        })
        setQuickUpdateModalOpen(true)
    }



    // edit task code
    const [editTaskModalOpen, setEditTaskModalOpen] = useState(false)
    const [taskToEdit, setTaskToEdit] = useState(null)
    const openEditTaskModal = (taskId) => {
        setTaskToEdit(tasks[taskId])
        setEditTaskModalOpen(true);
    }

    // update task code
    const updateTask = async (updatedTask) => {
        // await updateTaskSteps()
        let tasksCopy = { ...tasks }
        tasksCopy[updatedTask.id] = updatedTask
        setTasks(tasksCopy)
        // setEditTaskModalOpen(false)
    }

    // get today's date code
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const dateToday = new Date()
    const day = dateToday.getDate()
    const monthIndex = dateToday.getMonth()
    const month = months[monthIndex]
    const fullYear = dateToday.getFullYear()
    const twoYear = fullYear.toString().slice(2)
    // useEffect(() => {
    //     console.log(month, day, twoYear)
    // }, [])


    const printTasks = () => {
        // let test = Object.keys(tasks).slice(-1)
        console.log(categories)
        // console.log(test[0])
        // console.log(tasks)
    }

    // quick date change code
    const [changeDate, setChangeDate] = useState(null)
    const [datePickerModalOpen, setDatePickerModalOpen] = useState(false);
    const openDatePickerModal = (taskId, endDate) => {
        setChangeDate({
            taskId: taskId,
            endDate: endDate
        })
        console.log(datePickerModalOpen)
        setDatePickerModalOpen(true);
    }

    
    return (
        <>
            <CreateTaskModal open={newTaskModalOpen} tasks={tasks} setTasks={setTasks} onClose={closeCreateNewTask} />
            <QuickUpdateModal open={quickUpdateModalOpen} quickTaskUpdates={quickTaskUpdates} taskId={quickUpdateSettings.taskId} detail={quickUpdateSettings.detail} option={quickUpdateSettings.option} onClose={() => setQuickUpdateModalOpen(false)} />
            <EditTaskModal open={editTaskModalOpen} task={taskToEdit} updateTask={updateTask} onClose={() => setEditTaskModalOpen(false)} />
            <DatePickerModal open={datePickerModalOpen} taskId={changeDate ? changeDate.taskId : null} endDate={changeDate ? changeDate.endDate : null} quickUpdate={quickTaskUpdates} onClose={() => setDatePickerModalOpen(false)} />
            {/* <CreateCategoryModal open={createCategoryModalOpen} onClose={() => setCreateCategoryModalOpen(false)} /> */}
            {/* Page Rendered to the right to make space for navbar */}
            <div className="page-container-right">
                {/* Title section */}
                <div className="title-section flx-r w-100">
                    <div className="title-date mx2 flx-1 flx-c just-ce">
                        <p className="m-0 center-text x-large"><strong>{month} {day}</strong></p>
                        <p className="m-0 center-text large"><strong>{twoYear}</strong></p>
                    </div>
                    <div className="title-greeting flx-9">
                        <div className="flx-r">
                            <img src="https://i.imgur.com/4i6xYjB.png" alt="" className="img-xsmall mr-2" />
                            <p onClick={() => printTasks()} className="m-0 x-large">Good Afternoon *Name*,</p>
                        </div>
                        <p className="m-0 x-large gray-text">Let's plan your day...</p>
                    </div>
                </div>

                {/* Page body starts here */}
                {/* Page sub-title section */}
                <div className="sub-title-section sticky-top page-container96-byPadding">
                    {selectedCategory === "allTasks" &&
                    <div className="tab-container mb-4">
                        <div className="align-all-items gap-2">
                            <span className="material-symbols-outlined xx-large">
                                list
                            </span>
                            <p className="m-0 xx-large">All Tasks</p>
                        </div>
                        </div>
                    }
                    {selectedCategory === "myDay" &&
                    <div className="tab-container mb-4">
                        <div className="align-all-items gap-2">
                            <span className="material-symbols-outlined xx-large">
                                sunny
                            </span>
                            <p className="m-0 xx-large"><strong>My Day</strong></p>
                        </div>
                        </div>
                    }
                    {selectedCategory === "upcoming" &&
                    <div className="tab-container mb-4">
                        <div className="align-all-items gap-2">
                            <span className="material-symbols-outlined xx-large">
                                event_upcoming
                            </span>
                            <p className="m-0 xx-large">Upcoming Tasks</p>
                        </div>
                        </div>
                    }
                    {selectedCategory === "priority" &&
                        <div className="tab-container tb-priority mb-4">
                            <div className="align-all-items gap-2">
                                <span className="material-symbols-outlined xx-large darkred-text">
                                    priority_high
                                </span>
                                <p className="m-0 xx-large darkred-text">Priority Tasks</p>
                            </div>
                        </div>
                    }
                    {selectedCategory === "overdue" &&
                    <div className="tab-container tb-overdue mb-4">
                        <div className="align-all-items gap-2">
                            <span className="material-symbols-outlined xx-large darkyellow-text">
                                calendar_clock
                            </span>
                            <p className="m-0 xx-large darkyellow-text">Overdue Tasks</p>
                        </div>
                        </div>
                    }
                    {selectedCategory === "completed" &&
                    <div className="tab-container tb-completed mb-4">
                        <div className="align-all-items gap-2">
                            <span className="material-symbols-outlined xx-large green-text">
                                done
                            </span>
                            <p className="m-0 xx-large green-text">Completed Tasks</p>
                        </div>
                        </div>
                    }

                    {/* Add New Task Button */}
                    <button onClick={() => openCreateNewTask()} className="btn-primaryflex position-right">
                        <span className="material-symbols-outlined v-bott mr-1">
                            add
                        </span>
                        <p className="m-0">Add New Task</p>
                    </button>

                    {/* Title Column */}
                    <div className="title-column flx-r align-c">
                        <div className="completion"></div>
                        <span className="material-symbols-outlined">
                            done
                        </span>
                        <div className="taskName">
                            <p className="m-0">Task Title</p>
                        </div>
                        <div className="rightHandSide flx-r flx- just-sb">
                            <div className="myDay">
                                <p className="m-0">My Day</p>
                            </div>
                            <div className="date">
                                <p className="m-0">End Date</p>
                            </div>
                            <div className="duration">
                                <p className="m-0">Length</p>
                            </div>
                            <div className="progress">
                                <p className="m-0">Progress</p>
                            </div>
                            <div className="participants">
                                <p className="m-0">Participants</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="page-body page-container96">
                    {/* Task Box(es) */}
                    {Object.values(tasks).map((task, index) => {
                        if (categories[selectedCategory].includes(task.id)) {
                            return <TaskBox task={task} index={index} quickTaskUpdates={quickTaskUpdates} openQuickUpdateModal={openQuickUpdateModal} openEditTaskModal={openEditTaskModal} openDatePickerModal={openDatePickerModal} />
                        }
                    })}
                    {Object.values(tasks).map((task, index) => {
                        if (categories[selectedCategory + "Completed"]) {
                            if (categories[selectedCategory + "Completed"].includes(task.id)) {
                                return <TaskBox task={task} index={index} quickTaskUpdates={quickTaskUpdates} openQuickUpdateModal={openQuickUpdateModal} openEditTaskModal={openEditTaskModal} openDatePickerModal={openDatePickerModal} />
                            }
                        }
                    })}

                    {/* Add New Task Box */}
                    {selectedCategory !== "completed" &&
                    <div onClick={() => openCreateNewTask()} className="addNewTask-box">
                        <p className="m-0"><span className="material-symbols-outlined v-bott mr-2">
                            add
                        </span>
                            Add New Task</p>
                    </div>
                    }


                    <div className="empty-6"></div>
                    <div className="empty-6"></div>
                    <div className="empty-6"></div>
                </div>
            </div>
        </>
    )
}
export default Dashboard;
