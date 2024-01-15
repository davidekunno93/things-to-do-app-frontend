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
import TimePickerModal from '../components/TimePickerModal';
import { Fade } from 'react-awesome-reveal';


const Dashboard = () => {
    const { showNavbar, setShowNavbar, tasks, setTasks, users, categories, selectedCategory, setSelectedCategory, userCategories, setUserCategories } = useContext(DataContext);
    const [newTaskModalOpen, setNewTaskModalOpen] = useState(false)
    useEffect(() => {
        setShowNavbar(true)
    }, [])
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
    const timify = (time) => {
        if (time[0] === "0") {
            time = time.slice(1)
        }
        return time
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
            hideCategoryPopUp()
            hideCompletedPopUp()
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
        updateCategory: function (taskId, newCategory) {
            let tasksCopy = { ...tasks }
            tasksCopy[taskId].category = newCategory
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
        updateEndTime: function (taskId, time, timeOfDay) {
            let tasksCopy = { ...tasks }
            if (time) {
                tasksCopy[taskId].endTime = timify(time) + " " + timeOfDay
            } else {
                tasksCopy[taskId].endTime = null
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
                // console.log(i)
            }
            delete tasksCopy[tasksArr.length + 1]
            setTasks(tasksCopy)
        },
        removeAll: function (taskIds) {
            let newTasksObj = {}
            let tasksCopy = {...tasks}
            for (let i=0;i<taskIds.length;i++) {
                delete tasksCopy[taskIds[i]]
            }
            let tasksArr = Object.values(tasksCopy)
            for (let i=0;i<tasksArr.length;i++) {
                tasksArr[i].id = i+1
                newTasksObj[i+1] = tasksArr[i]
            }
            // console.log(newTasksObj)
            setTasks(newTasksObj)

            // deep clone of tasks ** attempt at deleting tasks and only re-serializing tasks ahead of the lowest taskId deleted. Still not working 100% of the time
            // let tasksCopy = {}
            // let tasksList = Object.values(tasks)
            // for (let i=0;i<tasksList.length;i++){
            //     tasksCopy[i+1] = {...tasks[i+1]}
            // }

            // // only need to update taskIds from the lowest position of deletion
            // let lowestTaskId = Math.min(...taskIds)
            // // delete all tasks of the taskIds for deletion
            // for (let i=0;i<taskIds.length;i++) {
            //     delete tasksCopy[taskIds[i]]
            // }
            // // 
            // let tasksArr = Object.values(tasksCopy)
            // // start at the index of the lowest taskId that was removed
            // for (let i = lowestTaskId - 1;i<tasksArr.length;i++) {
            //     tasksArr[i].id = i+1
            //     tasksCopy[i + 1] = tasksArr[i]
            // }
            // let lengthOfTasksCopy = Object.values(tasksCopy).length
            // console.log(tasksArr.length, lengthOfTasksCopy)
            // for (let i = tasksArr.length;i<lengthOfTasksCopy;i++) {
            //     delete tasksCopy[i+1]
            // }

            // // console.log(lowestTaskId)
            // let tasksKeys = Object.keys(tasksCopy)
            // // console.log(Math.max(...tasksKeys))
            // // delete tasksCopy[Math.max(...tasksKeys)]
            // console.log(tasksCopy)
            // // console.log(tasks)
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
        console.log(tasks)
    }

    // quick date change code
    const [changeDate, setChangeDate] = useState(null)
    const [datePickerModalOpen, setDatePickerModalOpen] = useState(false);
    const openDatePickerModal = (taskId) => {
        setChangeDate({
            taskId: taskId,
            endDate: tasks[taskId].endDate
        })
        setDatePickerModalOpen(true);
    }
    const closeDatePickerModal = () => {
        setDatePickerModalOpen(false)
        if (changeTime) {
            setTimePickerModalOpen(true)
        }
    }
    // quick date and time change code
    const [changeTime, setChangeTime] = useState(null);
    const [timePickerModalOpen, setTimePickerModalOpen] = useState(false);
    const openDateAndTimePickerModal = (taskId) => {
        setChangeDate({
            taskId: taskId,
            endDate: tasks[taskId].endDate
        })
        setChangeTime({
            taskId: taskId,
            endTime: tasks[taskId].endTime
        })
        setDatePickerModalOpen(true)
    }
    const openTimePickerModal = () => {
        setTimePickerModalOpen(true)
    }
    const closeTimePickerModal = () => {
        setTimePickerModalOpen(false)
        setChangeTime(null)
    }
    const goBack = (taskId) => {
        setTimePickerModalOpen(false)
        openDateAndTimePickerModal(taskId)
    }

    const showCategoryPopUp = () => {
        let popUp = document.getElementById('categoryPopUp')
        popUp.classList.remove('hidden-o')
    }
    const hideCategoryPopUp = () => {
        let popUp = document.getElementById('categoryPopUp')
        popUp.classList.add('hidden-o')
    }
    const toggleCategoryPopUp = () => {
        let popUp = document.getElementById('categoryPopUp')
        popUp.classList.toggle('hidden-o')
    }
    const showCompletedPopUp = () => {
        let popUp = document.getElementById('completedPopUp')
        popUp.classList.remove('hidden-o')
    }
    const hideCompletedPopUp = () => {
        let popUp = document.getElementById('completedPopUp')
        popUp.classList.add('hidden-o')
    }
    const toggleCompletedPopUp = () => {
        let popUp = document.getElementById('completedPopUp')
        popUp.classList.toggle('hidden-o')
    }
    const clearCategory = (categoryName) => {
        // remove category from all tasks currently assigned to this category
        let tasksArr = Object.values(tasks)
        let newTasksObj = {}
        for (let i = 0; i < tasksArr.length; i++) {
            if (tasksArr[i].category === categoryName) {
                tasksArr[i].category = "No Category"
            }
            newTasksObj[i + 1] = tasksArr[i]
        }
        setTasks(newTasksObj)
    }
    const deleteCategory = (categoryName) => {
        // remove category from all tasks currently assigned to this category
        let tasksArr = Object.values(tasks)
        let newTasksObj = {}
        for (let i = 0; i < tasksArr.length; i++) {
            if (tasksArr[i].category === categoryName) {
                tasksArr[i].category = "No Category"
            }
            newTasksObj[i + 1] = tasksArr[i]
        }
        setTasks(newTasksObj)

        // delete user Category from both categories nad categoryOrder
        let userCategoriesCopy = { ...userCategories }
        delete userCategoriesCopy.categories[categoryName]
        userCategoriesCopy.categoryOrder.splice(userCategories.categoryOrder.indexOf(categoryName), 1)
        setUserCategories(userCategoriesCopy)

        // go back to All Tasks
        setSelectedCategory('allTasks')
    }

    const deleteCompletedTasks = () => {
        let newTasksObj = {}
        let forDeleteTaskIds = []
        let tasksArr = Object.values(tasks)
        for (let i = 0; i < tasksArr.length; i++) {
            if (tasksArr[i].completed) {
                forDeleteTaskIds.push(tasksArr[i].id)
            }
        }
        console.log(forDeleteTaskIds)
        quickTaskUpdates.removeAll(forDeleteTaskIds)
        // setTasks(newTasksObj)
    }

    return (
        <>
            <CreateTaskModal open={newTaskModalOpen} category={selectedCategory} tasks={tasks} setTasks={setTasks} onClose={closeCreateNewTask} />
            <QuickUpdateModal open={quickUpdateModalOpen} quickTaskUpdates={quickTaskUpdates} taskId={quickUpdateSettings.taskId} detail={quickUpdateSettings.detail} option={quickUpdateSettings.option} onClose={() => setQuickUpdateModalOpen(false)} />
            <EditTaskModal open={editTaskModalOpen} task={taskToEdit} updateTask={updateTask} onClose={() => setEditTaskModalOpen(false)} />
            <DatePickerModal open={datePickerModalOpen} taskId={changeDate ? changeDate.taskId : null} endDate={changeDate ? changeDate.endDate : null} quickUpdate={quickTaskUpdates} onClose={closeDatePickerModal} />
            <TimePickerModal open={timePickerModalOpen} taskId={changeTime ? changeTime.taskId : null} endTime={changeTime ? changeTime.endTime : null} quickUpdate={quickTaskUpdates} goBack={goBack} onClose={closeTimePickerModal} />
            {/* <CreateCategoryModal open={createCategoryModalOpen} onClose={() => setCreateCategoryModalOpen(false)} /> */}
            {/* Page Rendered to the right to make space for navbar */}
            <Fade fraction={0} triggerOnce>
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
                        <div className="tab-container position-relative tb-completed mb-4">
                            <div id='completedPopUp' className="popUp hidden-o">
                                <div onClick={() => deleteCompletedTasks()} className="option">
                                    <span className="material-symbols-outlined">
                                        delete
                                    </span>
                                    <p className="m-0">Delete Completed Tasks</p>
                                </div>
                            </div>
                            <div className="align-all-items gap-2">
                                <span className="material-symbols-outlined xx-large green-text">
                                    done
                                </span>
                                <p className="m-0 xx-large green-text">Completed Tasks</p>
                                <span onClick={() => toggleCompletedPopUp()} className="material-symbols-outlined x-large ml-2 mt-1h o-50 pointer">
                                    more_vert
                                </span>
                            </div>
                        </div>
                    }
                    {selectedCategory !== 'myDay' && selectedCategory !== 'upcoming' && selectedCategory !== 'priority' && selectedCategory !== 'overdue' && selectedCategory !== 'completed' && selectedCategory !== 'allTasks' &&
                        <div className="tab-container position-relative mb-4">
                            <div ref={refMenu} id='categoryPopUp' className="popUp hidden-o">
                                <div onClick={() => clearCategory(selectedCategory)} className="option">
                                    <span className="material-symbols-outlined">
                                        clear_all
                                    </span>
                                    <p className="m-0">Clear Category Tasks</p>
                                </div>
                                <div onClick={() => deleteCategory(selectedCategory)} className="option">
                                    <span className="material-symbols-outlined">
                                        delete
                                    </span>
                                    <p className="m-0">Delete Category</p>
                                </div>
                            </div>
                            <div className="align-all-items gap-2">
                                <img src={userCategories.categories[selectedCategory].iconUrl} alt="" className="img-iconh mr-2" />
                                <p className="m-0 xx-large">{userCategories.categories[selectedCategory].categoryName}</p>
                                <span onClick={() => toggleCategoryPopUp()} className="material-symbols-outlined x-large ml-2 mt-1h o-50 pointer">
                                    more_vert
                                </span>
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
                            return <TaskBox task={task} index={index} quickTaskUpdates={quickTaskUpdates} openQuickUpdateModal={openQuickUpdateModal} openEditTaskModal={openEditTaskModal} openDatePickerModal={openDatePickerModal} openDateAndTimePickerModal={openDateAndTimePickerModal} />
                        }
                    })}
                    {Object.values(tasks).map((task, index) => {
                        if (categories[selectedCategory + "Completed"]) {
                            if (categories[selectedCategory + "Completed"].includes(task.id)) {
                                return <TaskBox task={task} index={index} quickTaskUpdates={quickTaskUpdates} openQuickUpdateModal={openQuickUpdateModal} openEditTaskModal={openEditTaskModal} openDatePickerModal={openDatePickerModal} openDateAndTimePickerModal={openDateAndTimePickerModal} />
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
            </Fade>
        </>
    )
}
export default Dashboard;
