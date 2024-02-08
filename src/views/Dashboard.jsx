import React, { useContext, useEffect, useRef, useState } from 'react'
import CreateTaskModal from '../components/CreateTaskModal'
import CircularProgressBar from '../components/CircularProgressBar';
import { DataContext } from '../context/DataProvider';
import TaskBox from '../components/TaskBox';
import QuickUpdateModal from '../components/QuickUpdateModal';
import EditTaskModal from '../components/EditTaskModal';
import DatePickerModal from '../components/DatePickerModal';
import { format } from 'date-fns';
import CreateCategoryModal from '../components/CreateCategoryModal';
import TimePickerModal from '../components/TimePickerModal';
import { Fade, Slide } from 'react-awesome-reveal';
import FeedbackModal from '../components/FeedbackModal';
import axios from 'axios';
import WelcomeModal from '../components/WelcomeModal';
import MissionModal from '../components/MissionModal';
import MissionCompletedModal from '../components/MissionCompletedModal';
import ConfirmationModal from '../components/ConfirmationModal';



const Dashboard = () => {
    const { showNavbar, setShowNavbar, tasks, setTasks, user, setUser, users, categories, selectedCategory, setSelectedCategory, userCategories, setUserCategories, missionsOn, setMissionsOn, databaseOn } = useContext(DataContext);
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
        let headerOverlay = document.getElementById('headerOverlay')
        headerOverlay.classList.add('hidden-o')
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
        dumpAll: function (taskIds) {
            let tasksCopy = { ...tasks }
            // loop thru taskIds
            for (let i = 0; i < taskIds.length; i++) {
                // inside the loop target the task in tasks object
                // update task dumped to true and pts awards to # pts awarded
                tasksCopy[taskIds[i]].dumped = true
                tasksCopy[taskIds[i]].pointsAwarded = taskPointsAwarded(taskIds[i])
            }
            setTasks(tasksCopy)
        },
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
        remove: function (taskId, db_task_id) {
            if (db_task_id) {
                deleteTaskFromDB(db_task_id)
            }
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

    const openQuickUpdateModal = (taskId, db_task_id, detail, option) => {
        setQuickUpdateSettings({
            taskId: taskId,
            db_task_id: db_task_id,
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
        let day = systemDate.getDate().toString().length === 1 ? "0" + systemDate.getDate() : systemDate.getDate()
        let month = systemDate.getMonth().toString().length + 1 === 1 ? "0" + (systemDate.getMonth() + 1) : systemDate.getMonth() + 1
        if (month.toString().length === 1) {
            month = "0" + month
        }
        let fullYear = systemDate.getFullYear()
        // console.log(month+"/"+day+"/"+fullYear)
        return month + "/" + day + "/" + fullYear
    }
    useEffect(() => {
        // console.log(month, day, twoYear)
        // datinormal(new Date())
    }, [])


    const printTasks = () => {
        // let test = Object.keys(tasks).slice(-1)
        // console.log(categories)
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

    const taskPointsAwarded = (taskId) => {
        let task = tasks[taskId]
        if (task.endDate) {
            if (new Date(task.completedDate) > new Date((new Date(task.endDate)).valueOf() - 1000 * 60 * 60 * 24)) {
                // if task end date is defined and overdue it is worth 3 points
                return 3
            } else {
                // if task end date is defined and upcoming
                if (task.highPriority) {
                    // and is high priority it is worth 7 points
                    return 7
                } else {
                    // and is not high priority it is worth 6 points
                    return 6
                }
            }
        } else {
            // if task end date is not defined
            if (task.highPriority) {
                // and is high priority it is worth 6 points
                return 6
            } else {
                // and is not high priority it is worth 5 points
                return 5
            }
        }
    }

    const dumpCompletedTasks = () => {
        let newTasksObj = {}
        let forDumpTaskIds = []
        let completionPts = []
        let tasksArr = Object.values(tasks)
        for (let i = 0; i < tasksArr.length; i++) {
            if (tasksArr[i].completed && !tasksArr[i].dumped) {
                forDumpTaskIds.push(tasksArr[i].id)
                // get completion pts of task using funtion - not checked yet
                completionPts.push(taskPointsAwarded(tasksArr[i].id))
                // if (tasksArr[i].endDate) {
                //     if (new Date(tasksArr[i].completedDate) > new Date((new Date(tasksArr[i].endDate)).valueOf() - 1000 * 60 * 60 * 24)) {
                //         completionPts.push(3)
                //     } else {
                //         if (tasksArr[i].highPriority) {
                //             completionPts.push(7)
                //         } else {
                //             completionPts.push(6)
                //         }
                //     }
                // } else {
                //     if (tasksArr[i].highPriority) {
                //         completionPts.push(6)
                //     } else {
                //         completionPts.push(5)
                //     }
                // }
            }
        }
        console.log("Dumping tasks..." + forDumpTaskIds)
        console.log("Completion pts " + completionPts)
        if (forDumpTaskIds.length > 0) {
            quickTaskUpdates.dumpAll(forDumpTaskIds)
            // quickTaskUpdates.removeAll(forDumpTaskIds)
        }
        let addedPts = completionPts.reduce((a, b) => a + b, 0)
        console.log("Added: " + addedPts)
        let userCopy = { ...user }
        userCopy.points = userCopy.points + parseInt(addedPts)
        setUser(userCopy)
        // setTasks(newTasksObj)
    }

    const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
    const openFeedbackModal = () => {
        setFeedbackModalOpen(true);
    }


    const deleteTaskFromDB = (db_task_id) => {
        if (databaseOn) {
            let url = `http://localhost:5000/delete_task/${db_task_id}`
            const response = axios.post(url)
                .then((response) => {
                    console.log(response)
                }).catch((error) => {
                    console.log(error)
                })
        }
    }
    // Welcome and Mission Code - if missions complete

    const [welcomeModalOpen, setWelcomeModalOpen] = useState(missionsOn ? true : false);
    const [missionModalOpen, setMissionModalOpen] = useState(false)
    // set current mission number
    const [currentMission, setCurrentMission] = useState(1);
    const openMissionModal = () => {
        setMissionModalOpen(true);
    }
    const closeMissionModal = () => {
        setMissionModalOpen(false);
        checkMissionCompleted()
    }
    const [missionProgress, setMissionProgress] = useState(
        {
            "mission-1":
            {
                desc: "Your first mission is to create a task with the following settings:",
                numberOfTasks: 5,
                tasksCompleted: 0,
                missionCompleted: false,
                tasks: [
                    {
                        taskKey: "Deadline",
                        taskValue: "1st February 2024 at 8:45PM",
                        completed: false
                    },
                    {
                        taskKey: "Frequency",
                        taskValue: "Once",
                        completed: false
                    },
                    {
                        taskKey: "Duration",
                        taskValue: "Medium",
                        completed: false
                    },
                    {
                        taskKey: "Outdoors",
                        taskValue: "Yes",
                        completed: false
                    },
                    {
                        taskKey: "Steps",
                        taskValue: "Create any 3 steps for your task",
                        completed: false
                    },
                ]
            },
            "mission-2":
            {
                desc: "On the dashboard use the icons on the Task bar to change the task settings to:",
                numberOfTasks: 5,
                tasksCompleted: 0,
                missionCompleted: false,
                tasks: [
                    {
                        taskKey: "High priority",
                        taskValue: "True",
                        completed: false
                    },
                    {
                        taskKey: "My Day",
                        taskValue: "Add task to 'My Day'",
                        completed: false
                    },
                    {
                        taskKey: "Deadline",
                        taskValue: "4th February 2024 at 10:00AM",
                        completed: false
                    },
                    {
                        taskKey: "Duration",
                        taskValue: "Long",
                        completed: false
                    },
                    {
                        taskKey: "Outdoors",
                        taskValue: "No",
                        completed: false
                    },
                ]
            },
            "mission-3":
            {
                numberOfTasks: 2,
                tasksCompleted: 0,
                missionCompleted: false,
                tasks: [
                    {
                        taskKey: "Complete Task",
                        taskValue: "Check your task completed.",
                        completed: false
                    },
                    {
                        taskKey: "Dump Tasks",
                        taskValue: "Navigate to Completed tasks, click the three vertical dots and select the Dump Completed Tasks option on the pop-up to trade in your task for points",
                        completed: false
                    },
                ]
            },
        }
    )

    const [missionReminderOpen, setMissionReminderOpen] = useState(false)
    const openMissionReminder = () => {
        setMissionReminderOpen(true)
    }
    const closeMissionReminder = () => {
        setMissionReminderOpen(false)
    }
    const toggleMissionReminder = () => {
        if (missionReminderOpen) {
            closeMissionReminder()
        } else {
            openMissionReminder()
        }
    }
    // check mission complete code
    // mission 1 check
    const checkFirstMissionCompleted = () => {
        let tasksArr = Object.values(tasks)
        let missionProgressCopy = { ...missionProgress }
        let tasksCompleted = 0
        // console.log(tasksArr)
        for (let i = 0; i < tasksArr.length; i++) {
            let task = tasksArr[i]
            tasksCompleted = 0
            // console.log(task.endDate)
            if (task.endDate === "02/01/2024" && task.endTime === "8:45 PM") {
                missionProgressCopy["mission-1"].tasks[0].completed = true
                tasksCompleted++
            } else {
                missionProgressCopy["mission-1"].tasks[0].completed = false
            }
            if (task.frequency === "Once") {
                missionProgressCopy["mission-1"].tasks[1].completed = true
                tasksCompleted++
            } else {
                missionProgressCopy["mission-1"].tasks[1].completed = false
            }
            if (task.duration === "Medium") {
                missionProgressCopy["mission-1"].tasks[2].completed = true
                tasksCompleted++
            } else {
                missionProgressCopy["mission-1"].tasks[2].completed = false
            }
            if (task.outdoors) {
                missionProgressCopy["mission-1"].tasks[3].completed = true
                tasksCompleted++
            } else {
                missionProgressCopy["mission-1"].tasks[3].completed = false
            }
            if (task.steps.length === 3) {
                missionProgressCopy["mission-1"].tasks[4].completed = true
                tasksCompleted++
            } else {
                missionProgressCopy["mission-1"].tasks[4].completed = false
            }
        }
        missionProgressCopy["mission-1"].tasksCompleted = tasksCompleted
        if (tasksCompleted === missionProgressCopy["mission-1"].numberOfTasks) {
            missionProgressCopy["mission-1"].missionCompleted = true
            console.log(tasksCompleted)
            // not all tasks completed but mission still getting completed ??
        } else {
            missionProgressCopy["mission-1"].missionCompleted = false
        }
        setMissionProgress(missionProgressCopy)
        console.log("check complete (mission 1)")
    }
    // mission 2 check
    const checkSecondMissionCompleted = () => {
        let tasksArr = Object.values(tasks)
        let missionProgressCopy = { ...missionProgress }
        let tasksCompleted = 0
        for (let i = 0; i < tasksArr.length; i++) {
            let task = tasksArr[i]
            tasksCompleted = 0
            if (task.highPriority) {
                missionProgressCopy["mission-2"].tasks[0].completed = true
                tasksCompleted++
            } else {
                missionProgressCopy["mission-2"].tasks[0].completed = false
            }
            if (task.myDay) {
                missionProgressCopy["mission-2"].tasks[1].completed = true
                tasksCompleted++
            } else {
                missionProgressCopy["mission-2"].tasks[1].completed = false
            }
            if (task.endDate === "02/04/2024" && task.endTime === "10:00 AM") {
                missionProgressCopy["mission-2"].tasks[2].completed = true
                tasksCompleted++
            } else {
                missionProgressCopy["mission-2"].tasks[2].completed = false
            }
            if (task.duration === "Long") {
                missionProgressCopy["mission-2"].tasks[3].completed = true
                tasksCompleted++
            } else {
                missionProgressCopy["mission-2"].tasks[3].completed = false
            }
            if (!task.outdoors) {
                missionProgressCopy["mission-2"].tasks[4].completed = true
                tasksCompleted++
            } else {
                missionProgressCopy["mission-2"].tasks[4].completed = false
            }
            missionProgressCopy["mission-2"].tasksCompleted = tasksCompleted
            if (tasksCompleted === missionProgressCopy["mission-1"].numberOfTasks) {
                missionProgressCopy["mission-2"].missionCompleted = true
                console.log(tasksCompleted)
                // not all tasks completed but mission still getting completed ??
            } else {
                missionProgressCopy["mission-2"].missionCompleted = false
            }
            setMissionProgress(missionProgressCopy)
            console.log("check complete (mission 2)")
        }
    }
    // mission 3 check
    const checkThirdMissionCompleted = () => {
        let tasksArr = Object.values(tasks)
        let missionProgressCopy = { ...missionProgress }
        let tasksCompleted = 0
        for (let i = 0; i < tasksArr.length; i++) {
            let task = tasksArr[i]
            tasksCompleted = 0
            if (task.completed) {
                missionProgressCopy["mission-3"].tasks[0].completed = true
                tasksCompleted++
            } else {
                missionProgressCopy["mission-3"].tasks[0].completed = false
            }
            if (task.dumped) {
                missionProgressCopy["mission-3"].tasks[1].completed = true
                tasksCompleted++
            } else {
                missionProgressCopy["mission-3"].tasks[1].completed = false
            }

        }
        if (tasksCompleted === missionProgressCopy["mission-3"].numberOfTasks) {
            missionProgressCopy["mission-3"].missionCompleted = true
            console.log(tasksCompleted)
        } else {
            missionProgressCopy["mission-3"].missionCompleted = false
        }
        setMissionProgress(missionProgressCopy)
        console.log("check complete (mission 3)")

    }
    // mission check conditional function
    const checkMissionCompleted = () => {
        if (currentMission === 1) {
            checkFirstMissionCompleted()
        } else if (currentMission === 2) {
            checkSecondMissionCompleted()
        } else if (currentMission === 3) {
            checkThirdMissionCompleted()
        }
    }
    useEffect(() => {
        if (missionsOn) {
            checkMissionCompleted()
        }
    }, [tasks])
    // mission completed modal
    const [missionCompletedModalOpen, setMissionCompletedModalOpen] = useState(false);
    const openMissionCompletedModal = () => {
        setMissionCompletedModalOpen(true)
    }
    const closeMissionCompletedModal = () => {
        setMissionCompletedModalOpen(false)
        checkMissionCompleted()
    }
    // mission completed modal appears when a mission is completed
    useEffect(() => {
        if (currentMission > 0) {
            if (missionProgress[`mission-${currentMission}`].missionCompleted) {
                openMissionCompletedModal()
            }
        }
    }, [missionProgress])

    const printMissionProgress = () => {
        console.log(missionProgress)
    }

    const [feedbackAlert, setFeedbackAlert] = useState(false)
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const openConfirmationModal = (action) => {
        if (action === "dump") {
            if (categories.completed.length > 0) {
                setConfirmationModalOpen(true)
            }
        }
    }
    return (
        <>
            <ConfirmationModal open={confirmationModalOpen} completedTasks={categories.completed} dumpCompletedTasks={dumpCompletedTasks} onClose={() => setConfirmationModalOpen(false)} />
            <MissionCompletedModal open={missionCompletedModalOpen} currentMission={currentMission} setCurrentMission={setCurrentMission} closeMissionReminder={() => setMissionReminderOpen(false)} onClose={closeMissionCompletedModal} />
            <MissionModal open={missionModalOpen} currentMission={currentMission} missionProgress={missionProgress} checkMissionCompleted={checkMissionCompleted} activateFeedbackAlert={() => setFeedbackAlert(true)} onClose={closeMissionModal} />
            <WelcomeModal open={welcomeModalOpen} onClose={() => setWelcomeModalOpen(false)} />
            <CreateTaskModal open={newTaskModalOpen} category={selectedCategory} tasks={tasks} setTasks={setTasks} onClose={closeCreateNewTask} />
            <QuickUpdateModal open={quickUpdateModalOpen} quickTaskUpdates={quickTaskUpdates} taskId={quickUpdateSettings.taskId} detail={quickUpdateSettings.detail} db_task_id={quickUpdateSettings.db_task_id} option={quickUpdateSettings.option} onClose={() => setQuickUpdateModalOpen(false)} dumpCompletedTasks={dumpCompletedTasks} />
            <EditTaskModal open={editTaskModalOpen} task={taskToEdit} updateTask={updateTask} onClose={() => setEditTaskModalOpen(false)} />
            <DatePickerModal open={datePickerModalOpen} taskId={changeDate ? changeDate.taskId : null} endDate={changeDate ? changeDate.endDate : null} quickUpdate={quickTaskUpdates} onClose={closeDatePickerModal} />
            <TimePickerModal open={timePickerModalOpen} taskId={changeTime ? changeTime.taskId : null} endTime={changeTime ? changeTime.endTime : null} quickUpdate={quickTaskUpdates} goBack={goBack} onClose={closeTimePickerModal} />
            <FeedbackModal open={feedbackModalOpen} deactivateFeedbackAlert={() => setFeedbackAlert(false)} onClose={() => setFeedbackModalOpen(false)} />
            {/* <CreateCategoryModal open={createCategoryModalOpen} onClose={() => setCreateCategoryModalOpen(false)} /> */}
            {/* Page Rendered to the right to make space for navbar */}
            <div className="page-container-right">
                <Fade fraction={0} triggerOnce>
                    {/* Title section */}
                    <div onClick={() => cycleBackground()} className={`title-section-${bgIndex} flx-r w-100 black-text font-jakarta`}>
                        <div className="title-date mx2 flx-1 flx-c just-ce">
                            <p className="m-0 center-text x-large"><strong>{month} {day}</strong></p>
                            <p className="m-0 center-text large"><strong>{twoYear}</strong></p>
                        </div>
                        <div className="title-greeting position-relative flx-9">
                            <div id='headerOverlay' className="header-overlay flx-r small">
                                <p className="m-0">Click to change background</p>
                                <span className="material-symbols-outlined">web_traffic</span>
                            </div>
                            <Fade delay={500} triggerOnce>
                                <Slide direction='up' cascade triggerOnce>
                                    <div className="flx-r">
                                        <img src="https://i.imgur.com/4i6xYjB.png" alt="" className="img-xsmall mr-2" />
                                        <p onClick={(e) => { e.stopPropagation(); printTasks() }} className="m-0 x-large">Good Afternoon,</p>
                                    </div>
                                    <Fade delay={1000} triggerOnce>
                                        <p onClick={(e) => { e.stopPropagation(); printMissionProgress() }} className="m-0 x-large darkgray-text">Let's plan your day...</p>
                                    </Fade>
                                </Slide>
                            </Fade>
                            <div className="flx-r gap-3">
                                {missionsOn &&
                                    <button onClick={(e) => { e.stopPropagation(); openMissionModal() }} className="btn-primaryflex mt-1 position-relative">
                                        <div className="updatesNotification position-absolute liftslow">
                                            {currentMission === 0 ? "!" : 4 - currentMission}
                                        </div>
                                        <span class="material-symbols-outlined lift">
                                            rocket
                                        </span>
                                    </button>
                                }
                                <button onClick={(e) => { e.stopPropagation(); openFeedbackModal() }} className="btn-tertiary mt-1 position-relative">
                                    {feedbackAlert &&
                                        <div className="updatesNotification position-absolute liftslow">
                                            !
                                        </div>
                                    }
                                    Feedback
                                </button>
                            </div>
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
                                        <p className="m-0 xx-large dark-text"><strong>My Day</strong></p>
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
                                    {/* <div id='completedPopUp' className="popUp hidden-o">
                                        <div onClick={() => { dumpCompletedTasks(); hideCompletedPopUp() }} className={`${categories.completed.length > 0 ? "option" : "option-disabled"}`}>
                                            <span className="material-symbols-outlined">
                                                delete
                                            </span>
                                            <p className="m-0">Dump Completed Tasks</p>
                                        </div>
                                    </div> */}
                                    <div className="align-all-items gap-2">
                                        <span className="material-symbols-outlined xx-large">
                                            done
                                        </span>
                                        <p className="m-0 xx-large">Completed Tasks</p>
                                        {/* <span onClick={() => toggleCompletedPopUp()} className="material-symbols-outlined x-large ml-2 mt-1h o-50 black-text pointer">
                                            more_vert
                                        </span> */}
                                    </div>
                                </div>
                                <p className="m-0 w-60 gray-text ml-2 font-jakarta"><strong className='black-text'>Tip:</strong> After completing tasks, click the vertical dots by the <i>Completed Tasks</i> heading to dump them and trade them in for points!</p>
                            </>
                        }
                        {selectedCategory === "allTasks" &&
                            <>
                                <div className="tab-container tb-none mb-2">
                                    <div className="align-all-items gap-2">
                                        <span className="material-symbols-outlined xx-large black-text">
                                            list
                                        </span>
                                        <p className="m-0 xx-large dark-text">All Tasks</p>
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
                                    <p className="m-0 xx-large dark-text">{userCategories.categories[selectedCategory].categoryName}</p>
                                    <span onClick={() => toggleCategoryPopUp()} className="material-symbols-outlined x-large ml-2 mt-1h o-50 pointer">
                                        more_vert
                                    </span>
                                </div>
                            </div>
                        }

                        {/* Add New Task or Dump Task Button */}
                        {selectedCategory === "completed" ?
                            <button onClick={() => openConfirmationModal("dump")} className={`${categories.completed.length > 0 ? "btn-primaryflex-green" : "btn-primaryflex-disabled"} position-right`}>
                                <div className="align-all-items">
                                    <span className="material-symbols-outlined v-bott mr-2 mt-h large">
                                        delete
                                    </span>
                                    <p className="m-0">Dump Completed Tasks</p>
                                </div>
                            </button>
                            :
                            <button onClick={() => openCreateNewTask()} className="btn-primaryflex position-right">
                                <div className="align-all-items">
                                    <span className="material-symbols-outlined v-bott mr-1 medium">
                                        add
                                    </span>
                                    <p className="m-0">Add New Task</p>
                                </div>
                            </button>
                        }
                        {/* End Add New Task or Dump Task Button */}

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
                        {currentMission > 0 && missionsOn &&
                            <>
                                {/* mission reminder */}
                                <div id='missionReminderBox black-text' className={`missionReminderBox font-jakarta ${missionReminderOpen ? "" : "hidden-o"}`}>
                                    <div className="align-all-items gap-2">
                                        <p className="box-title m-0">Current Mission</p>
                                        {currentMission === 1 &&
                                            <img src="https://i.imgur.com/PvTpowR.png" alt="" className="img-xsmall" />
                                        }
                                        {currentMission === 2 &&
                                            <img src="https://i.imgur.com/9wsBTFU.png" alt="" className="img-xsmall" />
                                        }
                                        {currentMission === 3 &&
                                            <img src="https://i.imgur.com/GQcgbs7.png" alt="" className="img-xsmall" />
                                        }
                                    </div>
                                    <hr className='w-100' />
                                    <p className="m-0 mb-2">{missionProgress[`mission-${currentMission}`].desc ? missionProgress[`mission-${currentMission}`].desc : null}</p>
                                    <div className="flx-c gap-2">

                                        {missionProgress[`mission-${currentMission}`].tasks.map((task, index) => {
                                            return <div key={index} className="align-all-items gap-2">
                                                {task.completed ?
                                                    <span className="material-symbols-outlined green-text large">
                                                        check_circle
                                                    </span>
                                                    :
                                                    <span className="material-symbols-outlined large">
                                                        circle
                                                    </span>
                                                }
                                                <p className={`m-0 small ${task.completed ? "faint-text" : null}`}><strong>{task.taskKey}:</strong> {task.taskValue}</p>
                                            </div>
                                        })}
                                    </div>
                                </div>
                                {/* end mission reminder */}
                                {/* mission reminder button */}
                                <button onClick={() => toggleMissionReminder()} className="missionReminderButton">
                                    <span className="material-symbols-outlined lift">
                                        rocket_launch
                                    </span>
                                </button>
                                {/* end mission reminder button */}
                            </>
                        }
                        {/* Task Box(es) */}
                        {Object.values(tasks).map((task, index) => {
                            if (categories[selectedCategory].includes(task.id)) {
                                return <TaskBox task={task} index={index} quickTaskUpdates={quickTaskUpdates} openQuickUpdateModal={openQuickUpdateModal} openEditTaskModal={openEditTaskModal} openDatePickerModal={openDatePickerModal} openDateAndTimePickerModal={openDateAndTimePickerModal} deleteTaskFromDB={deleteTaskFromDB} />
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
                        <div className="empty-2"></div>
                    </div>
                </Fade>
            </div>
        </>
    )
}
export default Dashboard;
