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
    const { showNavbar, setShowNavbar, tasks, setTasks, user, setUser, users, categories, selectedCategory, setSelectedCategory, userCategories, setUserCategories } = useContext(DataContext);
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
    const [bgIndex, setBgIndex] = useState(0)
    const cycleBackground = () => {
        if (bgIndex === 10) {
            setBgIndex(0)
        } else {
            setBgIndex(bgIndex + 1)
        }
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
                tasksCopy[taskId].completedDate = null
            } else {
                tasksCopy[taskId].completed = true
                tasksCopy[taskId].completedDate = datinormal(new Date())
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
            let tasksCopy = { ...tasks }
            for (let i = 0; i < taskIds.length; i++) {
                delete tasksCopy[taskIds[i]]
            }
            let tasksArr = Object.values(tasksCopy)
            for (let i = 0; i < tasksArr.length; i++) {
                tasksArr[i].id = i + 1
                newTasksObj[i + 1] = tasksArr[i]
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
    const datinormal = (systemDate) => {
        let day = systemDate.getDate().toString().length === 1 ? "0"+systemDate.getDate() : systemDate.getDate()
        let month = systemDate.getMonth().toString().length === 1 ? "0"+(systemDate.getMonth() + 1) : systemData.getMonth()
        if (month.length === 1) {
            month = "0"+month
        }
        let fullYear = systemDate.getFullYear()
        // console.log(month+"/"+day+"/"+fullYear)
        return month+"/"+day+"/"+fullYear
    }
    useEffect(() => {
        // console.log(month, day, twoYear)
        // datinormal(new Date())
    }, [])


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

    const dumpCompletedTasks = () => {
        let newTasksObj = {}
        let forDeleteTaskIds = []
        let completionPts = []
        let tasksArr = Object.values(tasks)
        for (let i = 0; i < tasksArr.length; i++) {
            if (tasksArr[i].completed) {
                forDeleteTaskIds.push(tasksArr[i].id)
                if (tasksArr[i].endDate) {
                    if (new Date(tasksArr[i].completedDate) > new Date((new Date(tasksArr[i].endDate)).valueOf() - 1000 * 60 * 60 * 24)) {
                        completionPts.push(3)
                    } else {
                        if (tasksArr[i].highPriority) {
                            completionPts.push(7)
                        } else {
                            completionPts.push(6)
                        }
                    }
                } else {
                    if (tasksArr[i].highPriority) {
                        completionPts.push(6)
                    } else {
                        completionPts.push(5)
                    }
                }
            }
        }
        // console.log(forDeleteTaskIds)
        console.log("Completion "+completionPts)
        if (forDeleteTaskIds.length > 0) {
            quickTaskUpdates.removeAll(forDeleteTaskIds)
        }
        let addedPts = completionPts.reduce((a, b) => a + b, 0)
        console.log("Added: "+addedPts)
        let userCopy = {...user}
        userCopy.points = userCopy.points + parseInt(addedPts)
        setUser(userCopy)
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
                    <div onClick={() => cycleBackground()} className={`title-section-${bgIndex} flx-r w-100 black-text font-jakarta`}>
                        <div className="title-date mx2 flx-1 flx-c just-ce">
                            <p className="m-0 center-text x-large"><strong>{month} {day}</strong></p>
                            <p className="m-0 center-text large"><strong>{twoYear}</strong></p>
                        </div>
                        <div className="title-greeting flx-9">
                            <div className="flx-r">
                                <img src="https://i.imgur.com/4i6xYjB.png" alt="" className="img-xsmall mr-2" />
                                <p onClick={(e) => {e.stopPropagation(); printTasks()}} className="m-0 x-large">Good Afternoon,</p>
                            </div>
                            <p className="m-0 x-large darkgray-text">Tour the site and plan your day...</p>
                        </div>
                    </div>

                    {/* Page body starts here */}
                    {/* Page sub-title section */}
                    <div className="sub-title-section sticky-top page-container96-byPadding">

                        {selectedCategory === "myDay" &&
                        <>
                            <div className="tab-container tb-myDay mb-2">
                                <div className="align-all-items gap-2">
                                    <span className="material-symbols-outlined xx-large bold700">
                                        sunny
                                    </span>
                                    <p className="m-0 xx-large"><strong>My Day</strong></p>
                                </div>
                            </div>
                            <p className="m-0 w-60 gray-text ml-2 font-jakarta"><strong className='black-text'>Coming soon:</strong> The point offering system is coming soon. Completed tasks will be able to be <i>dumped</i> in <i>Completed Tasks</i> and traded in for offering points!</p>
                        </>
                        }
                        {selectedCategory === "upcoming" &&
                        <>
                            <div className="tab-container tb-upcoming darkblue-text mb-2">
                                <div className="align-all-items gap-2">
                                    <span className="material-symbols-outlined xx-large">
                                        event_upcoming
                                    </span>
                                    <p className="m-0 xx-large">Upcoming Tasks</p>
                                </div>
                            </div>
                            <p className="m-0 w-60 gray-text ml-2 font-jakarta"><strong className='black-text'>Tip:</strong> In order to incentive users to add an end date/deadline to their tasks, you'll get an extra offering point for completing and dumping these!</p>
                        </>
                        }
                        {selectedCategory === "priority" &&
                        <>
                            <div className="tab-container tb-priority darkred-text mb-2">
                                <div className="align-all-items gap-2">
                                    <span className="material-symbols-outlined xx-large">
                                        priority_high
                                    </span>
                                    <p className="m-0 xx-large">Priority Tasks</p>
                                </div>
                            </div>
                            <p className="m-0 w-60 gray-text ml-2 font-jakarta"><strong className='black-text'>Tip:</strong> Priority tasks will earn you 1 extra offering point when you dump them. Unless of course they're overdue then they're worth even less than a non-priority task.</p>
                        </>
                        }
                        {selectedCategory === "overdue" &&
                        <>
                            <div className="tab-container tb-overdue darkyellow-text mb-2">
                                <div className="align-all-items gap-2">
                                    <span className="material-symbols-outlined xx-large">
                                        calendar_clock
                                    </span>
                                    <p className="m-0 xx-large">Overdue Tasks</p>
                                </div>
                            </div>
                            <p className="m-0 w-60 gray-text ml-2 font-jakarta"><strong className='black-text'>Tip:</strong> We don't have to tell you to try and complete tasks before they're overdue because you know that already. But did you know overdue tasks earn you less points when you dump them?</p>
                            </>
                        }
                        {selectedCategory === "completed" &&
                            <>
                                <div className="tab-container position-relative tb-completed green-text mb-2">
                                    <div id='completedPopUp' className="popUp hidden-o">
                                        <div onClick={() => {dumpCompletedTasks(); hideCompletedPopUp()}} className={`${categories.completed.length > 0 ? "option" : "option-disabled"}`}>
                                            <span className="material-symbols-outlined">
                                                delete
                                            </span>
                                            <p className="m-0">Dump Completed Tasks</p>
                                        </div>
                                    </div>
                                    <div className="align-all-items gap-2">
                                        <span className="material-symbols-outlined xx-large">
                                            done
                                        </span>
                                        <p className="m-0 xx-large">Completed Tasks</p>
                                        <span onClick={() => toggleCompletedPopUp()} className="material-symbols-outlined x-large ml-2 mt-1h o-50 black-text pointer">
                                            more_vert
                                        </span>
                                    </div>
                                </div>
                                <p className="m-0 w-60 gray-text ml-2 font-jakarta"><strong className='black-text'>Tip:</strong> After completing tasks, click the vertical dots by the <i>Completed Tasks</i> heading to dump them and trade them in for points!</p>
                            </>
                        }
                        {selectedCategory === "allTasks" &&
                            <>
                                <div className="tab-container tb-none mb-2">
                                    <div className="align-all-items gap-2">
                                        <span className="material-symbols-outlined xx-large">
                                            list
                                        </span>
                                        <p className="m-0 xx-large">All Tasks</p>
                                    </div>
                                </div>
                                <p className="m-0 w-60 gray-text ml-2 font-jakarta"><strong className='black-text'>Tip:</strong> Hover your cursor to the right of the task title, step description, or notes heading to show the hidden edit icon. Click the edit icon to change these deatils on the fly.</p>
                            </>
                        }
                        {selectedCategory !== 'myDay' && selectedCategory !== 'upcoming' && selectedCategory !== 'priority' && selectedCategory !== 'overdue' && selectedCategory !== 'completed' && selectedCategory !== 'allTasks' &&
                            <div className={`tab-container ${userCategories.categories[selectedCategory].color ? `tb-` + userCategories.categories[selectedCategory].color : "tb-none"} position-relative mb-4`}>
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
                            <div className="align-all-items">
                                <span className="material-symbols-outlined v-bott mr-1 medium">
                                    add
                                </span>
                                <p className="m-0">Add New Task</p>
                            </div>
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
