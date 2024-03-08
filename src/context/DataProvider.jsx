import { createContext, useEffect, useState } from "react";


const DataProvider = (props) => {
    const [advancedSettingsOn, setAdvancedSettingsOn] = useState(false);
    const [showNavbar, setShowNavbar] = useState(false)
    const [databaseOn, setDatabaseOn] = useState(false);
    const [firstTask, setFirstTask] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [createCategoryModalOpen, setCreateCategoryModalOpen] = useState(false);

    // demo library
    const [user, setUser] = useState({
        uid: "testUser",
        displayName: "Guest",
        photoURL: null,
        email: "guest@abc.com",
        level: 1,
        points: 5,
        pointsForLevelUp: 45
    })
    useEffect(() => {
        if (user.points >= user.pointsForLevelUp) {
            let userCopy = { ...user }
            userCopy.level++
            userCopy.points = userCopy.points - userCopy.pointsForLevelUp
            userCopy.pointsForLevelUp = userCopy.pointsForLevelUp + 15
            // if auth save changes to database

            setUser(userCopy)
            // open level up modal
            setLevelUpModalOpen(true);
        } else if (user.points < 0) {
            let userCopy = { ...user }
            userCopy.pointsForLevelUp = userCopy.pointsForLevelUp - 15
            userCopy.points = userCopy.points + userCopy.pointsForLevelUp
            userCopy.level--
            setUser(userCopy)
        }
    }, [user])
    const [levelUpModalOpen, setLevelUpModalOpen] = useState(false);
    const [tasks, setTasks] = useState({})
    // const [tasks, setTasks] = useState({
    //     1: {
    //         id: 1,
    //         db_task_id: null,
    //         myDay: false,
    //         taskName: "Update my car's registration",
    //         category: "Car",
    //         notes: "Get car inspection done and update registration!",
    //         highPriority: false,
    //         endDate: "01/06/2024",
    //         endTime: "11:30 AM",
    //         frequency: "Once",
    //         duration: "Long",
    //         outdoors: true,
    //         location: "Kroger's",
    //         participants: [], // [{uid: "", displayName: "", photoURL: ""}]
    //         steps: [
    //             { number: 1, desc: "Complete car inspection", completed: false },
    //             { number: 2, desc: "Go to grocery store to purchase updated registration", completed: false }
    //         ], // [{number: #, desc: "", completed: false}]
    //         progress: 0,
    //         completed: false,
    //         completionDate : null,
    //         dumped: false,
    //         pointsAwarded: null,
    //     },
    //     2: {
    //         id: 2,
    //         db_task_id: null,
    //         myDay: true,
    //         taskName: "Wash the dishes!",
    //         category: "Home",
    //         notes: "Clear the sink when I get home",
    //         highPriority: true,
    //         endDate: null,
    //         endTime: null,
    //         frequency: "Once",
    //         duration: "Medium",
    //         outdoors: false,
    //         location: "Home",
    //         participants: [], // [{uid: "", displayName: "", photoURL: ""}]
    //         steps: [
    //             {number: 1, desc: "Wash the dishes", completed: false},
    //             {number: 2, desc: "Set them on the drying rack", completed: false},
    //             {number: 3, desc: "Put the dishes away", completed: false}
    //         ], // [{number: 1, desc: "", completed: false}]
    //         progress: 0,
    //         completed: false,
    //         completionDate : null,
    //         dumped: false,
    //         pointsAwarded: null,
    //     },
    //     3: {
    //         id: 3,
    //         db_task_id: null,
    //         myDay: false,
    //         taskName: "Find the best fast food in Houston",
    //         category: null,
    //         notes: "Eat at different fast food spots and decide which is the best fast food in houston. Chick fil a = 8/10, Briother's pizza = 7.5/10",
    //         highPriority: false,
    //         endDate: null,
    //         endTime: null,
    //         frequency: "Once",
    //         duration: "Long",
    //         outdoors: false,
    //         location: "Central Houston",
    //         participants: [], // [{uid: "", displayName: "", photoURL: ""}]
    //         steps: [
    //             { number: 1, desc: "Chick fil a", completed: true },
    //             { number: 2, desc: "Potbelly", completed: false },
    //             { number: 3, desc: "Pizza from Brother's", completed: true },
    //             { number: 4, desc: "Whataburger", completed: false },
    //             { number: 5, desc: "Chili's", completed: false }
    //         ], // [{number: "", desc: "", completed: ""}]
    //         progress: 0,
    //         completed: false,
    //         completionDate : null,
    //         dumped: false,
    //         pointsAwarded: null,
    //     },
    //     4: {
    //         id: 4,
    //         db_task_id: null,
    //         myDay: false,
    //         taskName: "Go to the Park",
    //         category: null,
    //         notes: "Go get some fresh air and exercise at the local park",
    //         highPriority: false,
    //         endDate: null,
    //         endTime: null,
    //         frequency: "Once",
    //         duration: "Medium",
    //         outdoors: true,
    //         location: null,
    //         participants: [], // [{uid: "", displayName: "", photoURL: ""}]
    //         steps: [], // [{number: 1, desc: "", completed: false}]
    //         progress: 0,
    //         completed: false,
    //         completionDate : null,
    //         dumped: false,
    //         pointsAwarded: null,
    //     },
    //     5: {
    //         id: 5,
    //         db_task_id: null,
    //         myDay: false,
    //         taskName: "Sell my company for $1 million",
    //         category: null,
    //         notes: "Sell my company to the highest bidder and become a millionaire",
    //         highPriority: true,
    //         endDate: null,
    //         endTime: null,
    //         frequency: "Once",
    //         duration: null,
    //         outdoors: false,
    //         location: null,
    //         participants: [], // [{uid: "", displayName: "", photoURL: ""}]
    //         steps: [
    //             { number: 1, desc: "Own a company", completed: false },
    //             { number: 2, desc: "Sell it for a million bucks!", completed: false }
    //         ], // [{number: "", desc: "", completed: ""}]
    //         progress: 0,
    //         completed: false,
    //         completionDate : null,
    // dumped: false,
    // pointsAwarded: null,
    //     },
    //     6: {
    //         id: 6,
    //         db_task_id: null,
    //         myDay: false,
    //         taskName: "Find the infinity stones",
    //         category: null,
    //         notes: "6 infinity stones away from World Domination!",
    //         highPriority: true,
    //         endDate: null,
    //         endTime: null,
    //         frequency: "Once",
    //         duration: "Long",
    //         outdoors: true,
    //         location: null,
    //         participants: [], // [{uid: "", displayName: "", photoURL: ""}]
    //         steps: [
    //             { number: 1, desc: "Find one infinity stone", completed: false },
    //             { number: 2, desc: "Find the rest of the inifinity stones", completed: false }
    //         ], // [{number: "", desc: "", completed: ""}]
    //         progress: 0,
    //         completed: false,
    //         completionDate : null,
    //         dumped: false,
    //         pointsAwarded: null,
    //     },
    //     7: {
    //         id: 7,
    //         db_task_id: null,
    //         myDay: true,
    //         taskName: "Catch a new Pokemon",
    //         category: null,
    //         notes: "Gotta catch 'em all",
    //         highPriority: true,
    //         endDate: "01/26/2024",
    //         endTime: null,
    //         frequency: "Once",
    //         duration: "Medium",
    //         outdoors: true,
    //         location: null,
    //         participants: [], // [{uid: "", displayName: "", photoURL: ""}]
    //         steps: [
    //             { number: 1, desc: "Buy pokeballs", completed: true },
    //             { number: 2, desc: "Walk through tall grass", completed: false },
    //             { number: 3, desc: "Battle a pokemon", completed: false },
    //             { number: 4, desc: "Weaken the pokemon", completed: false },
    //             { number: 5, desc: "Catch the pokemon", completed: false }
    //         ], // [{number: "", desc: "", completed: ""}]
    //         progress: 0,
    //         completed: false,
    //         completionDate : null,
    //         dumped: false,
    //         pointsAwarded: null,
    //     },
    // })
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
        categories: {
            "Home": {
                categoryName: "Home",
                iconUrl: "https://i.imgur.com/t2EAesy.png",
                color: "yellow",
                orderIndex: 0,
                uid: "testUser"
            },
            "Car": {
                categoryName: "Car",
                iconUrl: "https://i.imgur.com/Nm1N0cy.png",
                color: "orange",
                orderIndex: 1,
                uid: "testUser"
            },
            "Health": {
                categoryName: "Health",
                iconUrl: "https://i.imgur.com/3Do4ea2.png",
                color: "none",
                orderIndex: 2,
                uid: "testUser"
            },
        },
        categoryOrder: ["Car", "Home", "Health"]
    })
    const [selectedCategory, setSelectedCategory] = useState("allTasks")
    const [group, setGroup] = useState(null)
    useEffect(() => {
        if (userCategories.categoryOrder.includes(selectedCategory)) {
            setGroup(selectedCategory)
        } else {
            setGroup(null)
        }
    }, [selectedCategory])
    // sorting the categories
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
        let overdueCompletedArr =[]
        // count # of completed tasks
        let completedArr = []
        // count # of tasks with end dates equal to or later than today - upcoming
        let upcomingArr = []
        let upcomingCompletedArr = []
        let upcomingTasks = []
        let upcomingTaskIds = []
        // store dumped tasks
        let dumpedArr = []
        const tasksArr = Object.values(tasks)
        for (let i = 0; i < tasksArr.length; i++) {
            if (!tasksArr[i].dumped) {
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
                        if (new Date(tasksArr[i].endDate) > new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24)) {
                            upcomingCompletedArr.push(tasksArr[i].id)
                        } else {
                            overdueCompletedArr.push(tasksArr[i].id)
                        }
                    }
                } else {
                    allTasksArr.push(tasksArr[i].id)
                    if (tasksArr[i].myDay) {
                        myDayArr.push(tasksArr[i].id)
                    }
                    if (tasksArr[i].highPriority) {
                        priorityArr.push(tasksArr[i].id)
                    }
                    if (tasksArr[i].endDate) {
                        // at 11:32PM a task w/ end date on the same day was put in over due, I'm comparing end date to yesterday in order to get around that
                        if (new Date(tasksArr[i].endDate) < new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24)) {
                            overdueArr.push(tasksArr[i].id)
                        } else {
                            // create arr of upcoming tasks
                            // upcomingTasks.push(tasksArr[i])
                            upcomingArr.push(tasksArr[i].id)
                        }
                    }
                }
            } else {
                dumpedArr.push(tasksArr[i].id)
            }
            // sort upcoming tasks by endDate
            // let upcomingTasksSorted = upcomingTasks.sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
            // // loop thru the arr and take the taskIds to a new arr of taskIds
            // for (i=0;i<upcomingTasksSorted;i++) {
            //     upcomingTaskIds.push(upcomingTasksSorted.id)
            // }
        }
        let finalCategories = {
            allTasks: allTasksArr,
            allTasksCompleted: completedArr,
            myDay: myDayArr,
            myDayCompleted: myDayCompletedArr,
            upcoming: upcomingArr,
            upcomingCompleted: upcomingCompletedArr,
            priority: priorityArr,
            priorityCompleted: priorityCompletedArr,
            overdue: overdueArr,
            overdueCompleted: overdueCompletedArr,
            completed: completedArr,
            dumped: dumpedArr
        }
        if (userCategories) {
            // loop thru u cats
            // let tasksArr = Object.values(tasks)
            for (let i = 0; i < userCategories.categoryOrder.length; i++) {
                let category = userCategories.categories[userCategories.categoryOrder[i]]
                let categoryArr = []
                let categoryCompletedArr = []
                for (let i = 0; i < tasksArr.length; i++) {
                    if (!tasksArr[i].dumped) {
                        if (tasksArr[i].completed) {
                            if (tasksArr[i].category === category.categoryName) {
                                categoryCompletedArr.push(tasksArr[i].id)
                            }
                        } else {
                            if (tasksArr[i].category === category.categoryName) {
                                categoryArr.push(tasksArr[i].id)
                            }
                        }
                    }
                }
                finalCategories[category.categoryName] = categoryArr
                finalCategories[category.categoryName + "Completed"] = categoryCompletedArr
            }
        }
        setCategories(finalCategories)
    }, [tasks, userCategories])

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
    const [showDumped, setShowDumped] = useState(false);
    const levelKey = {
        "Level 1": 45,
        "Level 2": 60,
        "Level 3": 75,
        "Level 4": 90,
        "Level 5": 105,
        "Level 6": 120,
        "Level 7": 135,
        "Level 8": 150,
        "Level 9": 165,
        "Level 10": 180,
        "Level 11": 195,
        "Level 12": 210,
        "Level 13": 225,
        "Level 14": 240,
        "Level 15": 255,
        "Level 16": 270,
        "Level 17": 285,
        "Level 18": 300,
        "Level 19": 315,
        "Level 20": 330,
        "Level 21": 345,
        "Level 22": 360,
        "Level 23": 375,
        "Level 24": 390,
        "Level 25": 405,
    }

    // mobile code
    const [mobileWidth, setMobileWidth] = useState(false);
    const [mobileNavbarOpen, setMobileNavbarOpen] = useState(false);
    const mobileShowNavbar = () => {
        setMobileNavbarOpen(true)
    }
    const mobileHideNavbar = () => {
        setMobileNavbarOpen(false)
    }
    const mobileToggleNavbar = () => {
        if (mobileNavbarOpen) {
            mobileHideNavbar()
        } else {
            mobileShowNavbar()
        }
    }
    const handleResize = () => {
        if (document.body.clientWidth < 375) {
            setMobileWidth(true)
            // console.log('true')
        } else {
            setMobileWidth(false)
            // console.log('false')
        }
        // console.log(document.body.clientWidth)
    }
    useEffect(() => {
        handleResize()
        window.addEventListener('resize', handleResize, true)
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [])

    const [missionsOn, setMissionsOn] = useState(true);

    return (
        <DataContext.Provider value={{ 'mobileWidth': mobileWidth, 'mobileNavbarOpen': mobileNavbarOpen, 'setMobileNavbarOpen': setMobileNavbarOpen, 'showNavbar': showNavbar, 'setShowNavbar': setShowNavbar, 'user': user, 'setUser': setUser, 'users': users, 'tasks': tasks, 'setTasks': setTasks, 'firstTask': firstTask, 'setFirstTask': setFirstTask, 'categories': categories, 'setCategories': setCategories, 'selectedCategory': selectedCategory, 'setSelectedCategory': setSelectedCategory, 'userCategories': userCategories, 'group': group, 'setGroup': setGroup, 'createCategoryModalOpen': createCategoryModalOpen, 'setCreateCategoryModalOpen': setCreateCategoryModalOpen, 'setUserCategories': setUserCategories, 'showDumped': showDumped, 'setShowDumped': setShowDumped, 'advancedSettingsOn': advancedSettingsOn, 'setAdvancedSettingsOn': setAdvancedSettingsOn, 'missionsOn': missionsOn, 'setMissionsOn': setMissionsOn, 'databaseOn': databaseOn, 'setDatabaseOn': setDatabaseOn, 'darkMode': darkMode, 'setDarkMode': setDarkMode, 'levelUpModalOpen': levelUpModalOpen, 'setLevelUpModalOpen': setLevelUpModalOpen }}>
            {props.children}
        </DataContext.Provider>
    )
}
export default DataProvider;
export const DataContext = createContext();