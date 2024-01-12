import { createContext, useEffect, useState } from "react";


const DataProvider = (props) => {
    const [advancedSettingsOn, setAdvancedSettingsOn] = useState(false);
    // demo library
    const [tasks, setTasks] = useState({
        1: {
            id: 1,
            myDay: false,
            taskName: "Update my car's registration",
            category: "Car",
            notes: "Get car inspection done and update registration!",
            highPriority: false,
            endDate: "01/06/2024",
            endTime: "11:30 AM",
            frequency: "Once",
            duration: "Long",
            outdoors: true,
            participants: [], // [{uid: "", displayName: "", photoURL: ""}]
            steps: [
                { number: 1, desc: "Complete car inspection", completed: false },
                { number: 2, desc: "Go to grocery store to purchase updated registration", completed: false }
            ], // [{number: #, desc: "", completed: false}]
            progress: 0,
            completed: false
        },
        2: {
            id: 2,
            myDay: true,
            taskName: "Wash the dishes!",
            category: "Home",
            notes: null,
            highPriority: true,
            endDate: null,
            endTime: null,
            frequency: "Once",
            duration: null,
            outdoors: false,
            participants: [], // [{uid: "", displayName: "", photoURL: ""}]
            steps: [], // [{number: "", desc: "", completed: ""}]
            progress: 0,
            completed: false
        },
        3: {
            id: 3,
            myDay: false,
            taskName: "Send work colleagues the lunch bills",
            category: "Home",
            notes: null,
            highPriority: true,
            endDate: null,
            endTime: null,
            frequency: "Once",
            duration: null,
            outdoors: false,
            participants: [], // [{uid: "", displayName: "", photoURL: ""}]
            steps: [
                { number: 1, desc: "Chick fil a", completed: false },
                { number: 2, desc: "Potbelly", completed: false },
                { number: 3, desc: "Pizza from Brother's", completed: false },
            ], // [{number: "", desc: "", completed: ""}]
            progress: 0,
            completed: false
        },
        4: {
            id: 4,
            myDay: false,
            taskName: "Check what's going on with Firebase (on email)",
            category: "Home",
            notes: null,
            highPriority: true,
            endDate: null,
            endTime: null,
            frequency: "Once",
            duration: null,
            outdoors: false,
            participants: [], // [{uid: "", displayName: "", photoURL: ""}]
            steps: [], // [{number: "", desc: "", completed: ""}]
            progress: 0,
            completed: false
        },
        5: {
            id: 5,
            myDay: false,
            taskName: "Pay bill",
            category: "Home",
            notes: null,
            highPriority: true,
            endDate: null,
            endTime: null,
            frequency: "Once",
            duration: null,
            outdoors: false,
            participants: [], // [{uid: "", displayName: "", photoURL: ""}]
            steps: [
                { number: 1, desc: "Gas bill", completed: false },
                { number: 2, desc: "Mum's December bill", completed: false }
            ], // [{number: "", desc: "", completed: ""}]
            progress: 0,
            completed: false
        },
    })
    const [categories, setCategories] = useState({
        allTasks: [],
        allTasksCompleted: [],
        myDay: [],
        myDayCompleted: [],
        upcoming: [],
        upcomingCompleted: [],
        priority: [],
        priorityCompleted: [],
        overdue: [],
        completed: []
    })
    const [userCategories, setUserCategories] = useState({
        categories : {
            "Home": {
                categoryName: "Home",
                iconUrl: "",
                color: "",
                uid: "testUser"
            },
            "Car": {
                categoryName: "Car",
                iconUrl: "",
                color: "",
                uid: "testUser"
            },
            "Health": {
                categoryName: "Health",
                iconUrl: "",
                color: "",
                uid: "testUser"
            },
        },
        categoryOrder: ["Car", "Home", "Health"]
    })
    const [selectedCategory, setSelectedCategory] = useState("allTasks")
    useEffect(() => {
        let allTasksArr = []
        // count # of tasks in My Day
        let myDayArr = []
        let myDayCompletedArr = []
        // count # of high priority tasks
        let priorityArr = []
        let priorityCompletedArr = []
        // count # of tasks with end dates that are earlier than today - overdue
        let overdueArr = []
        // count # of completed tasks
        let completedArr = []
        // count # of tasks with end dates equal to or later than today - upcoming
        let upcomingArr = []
        let upcomingCompletedArr = []
        let upcomingTasks = []
        let upcomingTaskIds = []
        const tasksArr = Object.values(tasks)
        for (let i = 0; i < tasksArr.length; i++) {
            allTasksArr.push(tasksArr[i].id)
            if (tasksArr[i].completed) {
                completedArr.push(tasksArr[i].id)
                if (tasksArr[i].myDay) {
                    myDayCompletedArr.push(tasksArr[i].id)
                }
                if (tasksArr[i].highPriority) {
                    priorityCompletedArr.push(tasksArr[i].id)
                }
                if (tasksArr[i].endDate) {
                    // at 11:32PM a task w/ end date on the same day was put in over due, I'm comparing end date to yesterday in order to get around that
                    if (new Date(tasksArr[i].endDate) > new Date((new Date()).valueOf() - 1000*60*60*24)) {
                        upcomingCompletedArr.push(tasksArr[i].id)
                    }
                }
            } else {
                if (tasksArr[i].myDay) {
                    myDayArr.push(tasksArr[i].id)
                }
                if (tasksArr[i].highPriority) {
                    priorityArr.push(tasksArr[i].id)
                }
                if (tasksArr[i].endDate) {
                    // at 11:32PM a task w/ end date on the same day was put in over due, I'm comparing end date to yesterday in order to get around that
                    if (new Date(tasksArr[i].endDate) < new Date((new Date()).valueOf() - 1000*60*60*24)) {
                        overdueArr.push(tasksArr[i].id)
                    } else {
                        // create arr of upcoming tasks
                        // upcomingTasks.push(tasksArr[i])
                        upcomingArr.push(tasksArr[i].id)
                    }
                }
            }
            // sort upcoming tasks by endDate
            // let upcomingTasksSorted = upcomingTasks.sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
            // // loop thru the arr and take the taskIds to a new arr of taskIds
            // for (i=0;i<upcomingTasksSorted;i++) {
            //     upcomingTaskIds.push(upcomingTasksSorted.id)
            // }
        }
        setCategories({
            allTasks: allTasksArr,
            allTasksCompleted: [],
            myDay: myDayArr,
            myDayCompleted: myDayCompletedArr,
            upcoming: upcomingArr,
            upcomingCompleted: upcomingCompletedArr,
            priority: priorityArr,
            priorityCompleted: priorityCompletedArr,
            overdue: overdueArr,
            completed: completedArr,
        })
    }, [tasks])

    const users = [
        {
            uid: 1,
            displayName: "Kratos",
            photoURL: "https://i.imgur.com/DQYEvlo.png"
        },
        {
            uid: 2,
            displayName: "Batman",
            photoURL: "https://i.imgur.com/LciDUPK.png"
        },
        {
            uid: 3,
            displayName: "Cloud Strife",
            photoURL: "https://i.imgur.com/6e0sJVI.png"
        },
        {
            uid: 4,
            displayName: "Goku",
            photoURL: "https://i.imgur.com/l84sYpR.jpg"
        },
        {
            uid: 5,
            displayName: "Bane",
            photoURL: "https://i.imgur.com/RY7THhv.png"
        },
        {
            uid: 6,
            displayName: "Pikachu",
            photoURL: "https://i.imgur.com/BsUDD8a.png"
        },
        {
            uid: 7,
            displayName: "The Joker",
            photoURL: "https://i.imgur.com/egZgyCb.jpg"
        }
    ]

    return (
        <DataContext.Provider value={{ 'users': users, 'tasks': tasks, 'setTasks': setTasks, 'categories': categories, 'setCategories': setCategories, 'selectedCategory': selectedCategory, 'setSelectedCategory': setSelectedCategory, 'userCategories': userCategories, 'setUserCategories': setUserCategories, 'advancedSettingsOn': advancedSettingsOn, 'setAdvancedSettingsOn': setAdvancedSettingsOn }}>
            {props.children}
        </DataContext.Provider>
    )
}
export default DataProvider;
export const DataContext = createContext();