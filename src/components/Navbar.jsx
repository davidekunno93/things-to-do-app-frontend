import React, { useContext, useState } from 'react'
import { DataContext } from '../context/DataProvider';
import { useNavigate } from 'react-router-dom';
import CreateCategoryModal from './CreateCategoryModal';
import ProgressBar from './ProgressBar';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const Navbar = () => {
    const { tasks, showNavbar, setShowNavbar, user, setUser } = useContext(DataContext);
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


                    <div onClick={() => {goToAuth(); signOut()}} className="nav-option-bottom">
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