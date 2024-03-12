import React, { useContext, useEffect, useState } from 'react'
import { DataContext } from '../context/DataProvider';
import { useNavigate } from 'react-router-dom';
import CreateCategoryModal from './CreateCategoryModal';
import ProgressBar from './ProgressBar';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { Fade } from 'react-awesome-reveal';
import MyProfile from './MyProfile';

const Navbar = () => {
    const { tasks, showNavbar, setShowNavbar, user, setUser, setTasks } = useContext(DataContext);
    const { categories, setCategories, selectedCategory, setSelectedCategory, userCategories } = useContext(DataContext);
    const { createCategoryModalOpen, setCreateCategoryModalOpen } = useContext(DataContext);
    const { showDumped, setShowDumped } = useContext(DataContext);
    const { darkMode, setDarkMode } = useContext(DataContext);
    const { mobileWidth, mobileNavbarOpen, setMobileNavbarOpen } = useContext(DataContext);

    // other functions
    function wait(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    // theme toggle
    const toggleTheme = () => {
        if (darkMode) {
            setDarkMode(false)
        } else {
            setDarkMode(true)
        }
    }

    // navigations
    const navigate = useNavigate()
    const goToDashboard = () => {
        navigate('/')
    }
    const goToAuth = () => {
        navigate('/auth')
    }



    const [selectedNavOption, setSelectedNavOption] = useState("allTasks")
    const printCred = () => {
        // console.log(auth.currentUser)
        console.log(user)
    }

    // deep menu
    const [deepMenuOpen, setDeepMenuOpen] = useState(false);
    const toggleDeepMenu = () => {
        if (deepMenuOpen) {
            let contents = document.getElementById('deepMenuContents')
            contents.classList.add('hidden-o')
            wait(100).then(() => {
                setDeepMenuOpen(false);
                wait(200).then(() => {
                    contents.classList.replace('hidden-o', 'hidden-o-from-right')
                })
            })
        } else {
            setDeepMenuOpen(true);
            wait(300).then(() => {
                let contents = document.getElementById('deepMenuContents')
                contents.classList.remove('hidden-o-from-right')
            })
        }
    }

    // open profile
    const [profileOpen, setProfileOpen] = useState(false);

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
        setTasks({})
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
        setDarkMode(false)
        goToAuth()
    }

    return (
        <>
            <MyProfile open={profileOpen} photoURL={user.photoURL ? user.photoURL : "https://i.imgur.com/MacUxKa.png"} onClose={() => setProfileOpen(false)} />
            <div className={`navbar-holder${darkMode ? "-dark" : ""}`} style={{ display: `${mobileWidth ? "fixed" : "block"}`, zIndex: `${mobileWidth ? 10 : ""}`, transform: `translateX(-${mobileWidth ? mobileNavbarOpen ? "0" : "101" : "0" }%)` }}>


                <div className={`native-nav navbar${darkMode ? "-dark" : "-black"}`} style={{ display: `${mobileWidth ? "fixed" : "flex"}`, zIndex: `${mobileWidth ? 10 : ""}`, transform: `translateX(-${mobileWidth ? mobileNavbarOpen ? "0" : "101" : showNavbar ? "0" : "101"}%)` }}>


                    <div className="nav-option-cold">
                        <img src="https://i.imgur.com/AHGu5J5.png" alt="" className="nav-logo" />
                        <div onClick={() => {toggleTheme(); setMobileNavbarOpen(false) }} className="toggle-theme">
                            <div className={`button${darkMode ? "-dark" : ""}`} style={{ left: darkMode ? '12px' : '0px', right: darkMode ? '0px' : '12px' }}>
                                <img src={darkMode ? "https://i.imgur.com/Ya1NVA5.png" : "https://i.imgur.com/oZuiPMP.png"} alt="" className="toggle-button-img" />
                            </div>
                            <div className="bar"></div>
                        </div>
                    </div>
                    <div onClick={() => toggleDeepMenu()} className="nav-option-cold pointer">
                        <img src={user.photoURL ? user.photoURL : "https://i.imgur.com/MacUxKa.png"} alt="" className="img-dp mx-2" />
                        <p className="inline ml-1">{user.displayName}</p>
                        <p className="position-right x-small pr-2 pt-2 gray-text">Level {user.level}</p>
                    </div>
                    <div className="flx-r just-ce">
                        <ProgressBar height={15} progress={user.points} total={user.pointsForLevelUp} />
                    </div>

                    {/* deep navbar */}
                    <div className={`navbar-deepmenu${darkMode ? "-dark" : ""}`} style={{ height: deepMenuOpen ? 180 : 0 }}>
                        <div id='deepMenuContents' className="contents hidden-o-from-right">
                            

                            <div onClick={() => setProfileOpen(true)} className="option">
                                <div className="align-all-items">
                                    <span className="material-symbols-outlined">account_circle</span>
                                    <p className="m-0">My Profile</p>
                                </div>
                            </div>
                            <div className="option">
                                <div className="align-all-items">
                                    <span className="material-symbols-outlined">group</span>
                                    <p className="m-0">My Friends</p>
                                </div>
                            </div>
                            <div className="option">
                                <div className="align-all-items">
                                    <span className="material-symbols-outlined">trophy</span>
                                    <p className="m-0">Achievements</p>
                                </div>
                            </div>
                            <div className="option">
                                <div className="align-all-items">
                                    <span className="material-symbols-outlined">settings</span>
                                    <p className="m-0">Account Settings</p>
                                </div>
                            </div>
                            <div onClick={() => logOut()} className="option">
                                <div className="align-all-items">
                                    <span className="material-symbols-outlined">logout</span>
                                    <p className="m-0">Sign Out</p>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    {/* end deep navbar */}

                    {/* predefined categories */}
                    <div onClick={() => { setSelectedCategory("myDay"); setShowDumped(false); setSelectedNavOption('myDay'); goToDashboard(); setMobileNavbarOpen(false) }} className={`${selectedNavOption === 'myDay' ? "nav-option-selected" : "nav-option"}`}>
                        <span className="material-symbols-outlined yellow-text">
                            sunny
                        </span>
                        <p className="inline ml-1">My Day</p>
                        <div className="number-display">
                            {categories.myDay.length}
                        </div>
                    </div>
                    <div onClick={() => { setSelectedCategory("upcoming"); setShowDumped(false); setSelectedNavOption('upcoming'); goToDashboard(); setMobileNavbarOpen(false) }} className={`${selectedNavOption === 'upcoming' ? "nav-option-selected" : "nav-option"}`}>
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
                    <div onClick={() => { setSelectedCategory("priority"); setShowDumped(false); setSelectedNavOption('priority'); goToDashboard(); setMobileNavbarOpen(false) }} className={`${selectedNavOption === 'priority' ? "nav-option-selected" : "nav-option"}`}>
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
                    <div onClick={() => { setSelectedCategory("overdue"); setShowDumped(false); setSelectedNavOption('overdue'); goToDashboard(); setMobileNavbarOpen(false) }} className={`${selectedNavOption === 'overdue' ? "nav-option-selected" : "nav-option"}`}>
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
                    <div onClick={() => { setSelectedCategory("completed"); setShowDumped(false); setSelectedNavOption('completed'); goToDashboard(); setMobileNavbarOpen(false) }} className={`${selectedNavOption === 'completed' ? "nav-option-selected" : "nav-option"}`}>
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
                    {/* end predefined categories */}

                    <hr className='w-80 my-2 border-darkgray' />

                    <div onClick={() => { setSelectedCategory("allTasks"); setShowDumped(false); setSelectedNavOption('allTasks'); goToDashboard(); setMobileNavbarOpen(false) }} className={`${selectedNavOption === 'allTasks' ? "nav-option-selected" : "nav-option"}`}>
                        <span className="material-symbols-outlined">
                            list
                        </span>
                        <p className="inline ml-1">All Tasks</p>
                        <div className="number-display">
                            {categories.allTasks.length}
                        </div>
                    </div>

                    {/* user categories */}
                    <div className="nav-userCategories">
                        {userCategories.categoryOrder.length > 0 && categories ?
                            userCategories.categoryOrder.map((categoryName, index) => {
                                let userCategory = userCategories.categories[categoryName]
                                if (userCategory) {
                                    return <div onClick={() => { setSelectedCategory(userCategory.categoryName); setShowDumped(false); setSelectedNavOption(userCategory.categoryName); goToDashboard(); setMobileNavbarOpen(false) }} key={index} className={`${selectedNavOption === userCategory.categoryName ? "nav-option-selected" : "nav-option"}`}>
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

                    </div>
                    {/* end user categories */}

                    <div onClick={() => {setCreateCategoryModalOpen(true); setMobileNavbarOpen(false) }} className="nav-option-bottom">
                        <span className="material-symbols-outlined">
                            add
                        </span>
                        <p className="inline ml-1">New Category</p>
                    </div>


                    {/* <div onClick={() => logOut()} className="nav-option-bottom">
                        <span className="material-symbols-outlined">
                            logout
                        </span>
                        <p className="inline ml-1">Sign Out</p>
                    </div> */}


                </div>
            </div>
        </>
    )
}
export default Navbar;