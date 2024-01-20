import React, { useContext, useState } from 'react'
import { DataContext } from '../context/DataProvider';
import { useNavigate } from 'react-router-dom';
import CreateCategoryModal from './CreateCategoryModal';
import ProgressBar from './ProgressBar';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const Navbar = () => {
    const { tasks, showNavbar, setShowNavbar, user, setUser, setTasks } = useContext(DataContext);
    const { categories, setCategories, selectedCategory, setSelectedCategory, userCategories } = useContext(DataContext);

    // navigations
    const navigate = useNavigate()
    const goToDashboard = () => {
        navigate('/')
    }
    const goToAuth = () => {
        navigate('/auth')
    }

    // new category modal
    const [createCategoryModalOpen, setCreateCategoryModalOpen] = useState(false)
    const openCreateCategoryModal = () => {
        setCreateCategoryModalOpen(true)
    }

    const [selectedNavOption, setSelectedNavOption] = useState("allTasks")
    const printCred = () => {
        // console.log(auth.currentUser)
        console.log(user)
    }

    // sign off functions
    const clearUser = () => {
        setUser({
            uid: "testUser",
            displayName: "Guest",
            photoURL: null,
            email: "guest@abc.com",
            level: 1,
            points: 5,
            pointsForLevelUp: 45
        })
    }
    const clearTasks = () => {
        setTasks({
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
                completed: false,
                completionDate : null
            },
            2: {
                id: 2,
                myDay: true,
                taskName: "Wash the dishes!",
                category: "Home",
                notes: "Clear the sink when I get home",
                highPriority: true,
                endDate: null,
                endTime: null,
                frequency: "Once",
                duration: "Medium",
                outdoors: false,
                participants: [], // [{uid: "", displayName: "", photoURL: ""}]
                steps: [
                    {number: 1, desc: "Wash the dishes", completed: false},
                    {number: 2, desc: "Set them on the drying rack", completed: false},
                    {number: 3, desc: "Put the dishes away", completed: false}
                ], // [{number: 1, desc: "", completed: false}]
                progress: 0,
                completed: false,
                completionDate : null
            },
            3: {
                id: 3,
                myDay: false,
                taskName: "Find the best fast food in Houston",
                category: null,
                notes: "Eat at different fast food spots and decide which is the best fast food in houston. Chick fil a = 8/10, Briother's pizza = 7.5/10",
                highPriority: false,
                endDate: null,
                endTime: null,
                frequency: "Once",
                duration: "Long",
                outdoors: false,
                participants: [], // [{uid: "", displayName: "", photoURL: ""}]
                steps: [
                    { number: 1, desc: "Chick fil a", completed: true },
                    { number: 2, desc: "Potbelly", completed: false },
                    { number: 3, desc: "Pizza from Brother's", completed: true },
                    { number: 4, desc: "Whataburger", completed: false },
                    { number: 5, desc: "Chili's", completed: false }
                ], // [{number: "", desc: "", completed: ""}]
                progress: 0,
                completed: false,
                completionDate : null
            },
            4: {
                id: 4,
                myDay: false,
                taskName: "Go to the Park",
                category: null,
                notes: "Go get some fresh air and exercise at the local park",
                highPriority: false,
                endDate: null,
                endTime: null,
                frequency: "Once",
                duration: "Medium",
                outdoors: true,
                participants: [], // [{uid: "", displayName: "", photoURL: ""}]
                steps: [], // [{number: 1, desc: "", completed: false}]
                progress: 0,
                completed: false,
                completionDate : null
            },
            5: {
                id: 5,
                myDay: false,
                taskName: "Sell my company for $1 million",
                category: null,
                notes: "Sell my company to the highest bidder and become a millionaire",
                highPriority: true,
                endDate: null,
                endTime: null,
                frequency: "Once",
                duration: null,
                outdoors: false,
                participants: [], // [{uid: "", displayName: "", photoURL: ""}]
                steps: [
                    { number: 1, desc: "Own a company", completed: false },
                    { number: 2, desc: "Sell it for a million bucks!", completed: false }
                ], // [{number: "", desc: "", completed: ""}]
                progress: 0,
                completed: false,
                completionDate : null
            },
            6: {
                id: 6,
                myDay: false,
                taskName: "Find the infinity stones",
                category: null,
                notes: "6 infinity stones away from World Domination!",
                highPriority: true,
                endDate: null,
                endTime: null,
                frequency: "Once",
                duration: "Long",
                outdoors: true,
                participants: [], // [{uid: "", displayName: "", photoURL: ""}]
                steps: [
                    { number: 1, desc: "Find one infinity stone", completed: false },
                    { number: 2, desc: "Find the rest of the inifinity stones", completed: false }
                ], // [{number: "", desc: "", completed: ""}]
                progress: 0,
                completed: false,
                completionDate : null
            },
            7: {
                id: 7,
                myDay: true,
                taskName: "Catch a new Pokemon",
                category: null,
                notes: "Gotta catch 'em all",
                highPriority: true,
                endDate: "01/26/2024",
                endTime: null,
                frequency: "Once",
                duration: "Medium",
                outdoors: true,
                participants: [
    
                ], // [{uid: "", displayName: "", photoURL: ""}]
                steps: [
                    { number: 1, desc: "Buy pokeballs", completed: true },
                    { number: 2, desc: "Walk through tall grass", completed: false },
                    { number: 3, desc: "Battle a pokemon", completed: false },
                    { number: 4, desc: "Weaken the pokemon", completed: false },
                    { number: 5, desc: "Catch the pokemon", completed: false }
                ], // [{number: "", desc: "", completed: ""}]
                progress: 0,
                completed: false,
                completionDate : null
            }
        })
    }
    const logOut = () => {
        clearUser()
        clearTasks()
        if (auth.currentUser) {
            // console.log(auth.currentUser)
            signOut(auth).then(() => {
                console.log('signed out')
            }).catch((error) => {
                console.log(error)
            })
        }
        goToAuth()
    }

    return (
        <>
            <CreateCategoryModal open={createCategoryModalOpen} onClose={() => setCreateCategoryModalOpen(false)} />
            <div className="navbar-holder">


                <div className='native-nav navbar-black' style={{ transform: `translateX(-${showNavbar ? "0" : "101"}%)` }}>


                    <div className="nav-option-cold">
                        <img onClick={() => printCred()} src="https://i.imgur.com/AHGu5J5.png" alt="" className="nav-logo" />
                    </div>
                    <div className="nav-option-cold">
                        {/* <span className="material-symbols-outlined">
                            account_circle
                        </span> */}
                        <img src={user.photoURL ? user.photoURL : "https://i.imgur.com/MacUxKa.png"} alt="" className="img-dp mx-2" />
                        <p className="inline ml-1">{user.displayName}</p>
                        <p className="m-0 position-right x-small pr-2 pt-2 gray-text">Level {user.level}</p>
                    </div>
                    <div className="flx-r just-ce">
                    
                    <ProgressBar height={15} progress={user.points} total={user.pointsForLevelUp} />
                    </div>
                    <div onClick={() => { setSelectedCategory("myDay"); setSelectedNavOption('myDay'); goToDashboard() }} className={`${selectedNavOption === 'myDay' ? "nav-option-selected" : "nav-option"}`}>
                        <span className="material-symbols-outlined yellow-text">
                            sunny
                        </span>
                        <p className="inline ml-1">My Day</p>
                        <div className="number-display">
                            {categories.myDay.length}
                        </div>
                    </div>
                    <div onClick={() => { setSelectedCategory("upcoming"); setSelectedNavOption('upcoming'); goToDashboard() }} className={`${selectedNavOption === 'upcoming' ? "nav-option-selected" : "nav-option"}`}>
                        <span className="material-symbols-outlined blue-text">
                            event_upcoming
                        </span>
                        <p className="inline ml-1">Upcoming</p>
                        {categories.upcoming.length > 0 &&
                            <div className="number-display">
                                {categories.upcoming.length}
                            </div>
                        }
                    </div>
                    <div onClick={() => { setSelectedCategory("priority"); setSelectedNavOption('priority'); goToDashboard() }} className={`${selectedNavOption === 'priority' ? "nav-option-selected" : "nav-option"}`}>
                        <span className="material-symbols-outlined red-text">
                            priority_high
                        </span>
                        <p className="inline ml-1">Priority</p>
                        {categories.priority.length > 0 &&
                            <div className="number-display-red">
                                {categories.priority.length}
                            </div>
                        }
                    </div>
                    <div onClick={() => { setSelectedCategory("overdue"); setSelectedNavOption('overdue'); goToDashboard() }} className={`${selectedNavOption === 'overdue' ? "nav-option-selected" : "nav-option"}`}>
                        <span className="material-symbols-outlined orange-text">
                            calendar_clock
                            {/* assignment_late */}
                        </span>
                        <p className="inline ml-1">Overdue</p>
                        {categories.overdue.length > 0 &&
                            <div className="number-display-orange">
                                {categories.overdue.length}
                            </div>
                        }
                    </div>
                    <div onClick={() => { setSelectedCategory("completed"); setSelectedNavOption('completed'); goToDashboard() }} className={`${selectedNavOption === 'completed' ? "nav-option-selected" : "nav-option"}`}>
                        <span className="material-symbols-outlined green-text">
                            done
                            {/* assignment_late */}
                        </span>
                        <p className="inline ml-1">Completed</p>
                        {categories.completed.length > 0 &&
                            <div className="number-display-green">
                                {categories.completed.length}
                            </div>
                        }
                    </div>
                    <hr className='w-80 my-2 border-darkgray' />
                    <div onClick={() => { setSelectedCategory("allTasks"); setSelectedNavOption('allTasks'); goToDashboard() }} className={`${selectedNavOption === 'allTasks' ? "nav-option-selected" : "nav-option"}`}>
                        <span className="material-symbols-outlined">
                            list
                        </span>
                        <p className="inline ml-1">All Tasks</p>
                        <div className="number-display">
                            {categories.allTasks.length}
                        </div>
                    </div>
                    {userCategories.categoryOrder.length > 0 && categories ?
                        userCategories.categoryOrder.map((categoryName, index) => {
                            let userCategory = userCategories.categories[categoryName]
                            if (userCategory) {
                                return <div onClick={() => { setSelectedCategory(userCategory.categoryName); setSelectedNavOption(userCategory.categoryName); goToDashboard() }} key={index} className={`${selectedNavOption === userCategory.categoryName ? "nav-option-selected" : "nav-option"}`}>
                                    <img src={userCategory.iconUrl} alt="" className="navBar-categoryIcon" />
                                    <p className="inline ml-1">{userCategory.categoryName}</p>
                                    {categories[categoryName] ? categories[categoryName].length > 0 &&
                                        <div className={`number-display-${userCategory.color}`}>
                                            {categories[categoryName].length}
                                        </div> : null
                                    }
                                </div>
                            }
                        })
                        : null
                    }


                    <div onClick={() => openCreateCategoryModal()} className="nav-option">
                        <span className="material-symbols-outlined">
                            add
                        </span>
                        <p className="inline ml-1">New Category</p>
                    </div>


                    <div onClick={() => logOut()} className="nav-option-bottom">
                        <span className="material-symbols-outlined">
                            logout
                        </span>
                        <p className="inline ml-1">Sign Out</p>
                    </div>


                </div>
            </div>
        </>
    )
}
export default Navbar;