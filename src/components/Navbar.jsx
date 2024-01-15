import React, { useContext, useState } from 'react'
import { DataContext } from '../context/DataProvider';
import { useNavigate } from 'react-router-dom';
import CreateCategoryModal from './CreateCategoryModal';

const Navbar = () => {
    const { tasks, showNavbar, setShowNavbar } = useContext(DataContext);
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

    return (
        <>
            <CreateCategoryModal open={createCategoryModalOpen} onClose={() => setCreateCategoryModalOpen(false)} />
            <div className="navbar-holder">


                <div className='native-nav navbar-black' style={{ transform: `translateX(-${showNavbar ? "0" : "101"}%)` }}>


                    <div className="nav-option-cold">
                        <p className="inline ml-1">THINGS TO-DO</p>
                    </div>
                    <div className="nav-option-cold">
                        <span className="material-symbols-outlined">
                            account_circle
                        </span>
                        <p className="inline ml-1">*Username*</p>
                    </div>
                    <div onClick={() => { setSelectedCategory("myDay"); goToDashboard() }} className="nav-option">
                        <span className="material-symbols-outlined">
                            sunny
                        </span>
                        <p className="inline ml-1">My Day</p>
                        <div className="number-display">
                            {categories.myDay.length}
                        </div>
                    </div>
                    <div onClick={() => { setSelectedCategory("upcoming"); goToDashboard() }} className="nav-option">
                        <span className="material-symbols-outlined">
                            event_upcoming
                        </span>
                        <p className="inline ml-1">Upcoming</p>
                        {categories.upcoming.length > 0 &&
                            <div className="number-display">
                                {categories.upcoming.length}
                            </div>
                        }
                    </div>
                    <div onClick={() => { setSelectedCategory("priority"); goToDashboard() }} className="nav-option">
                        <span className="material-symbols-outlined">
                            priority_high
                        </span>
                        <p className="inline ml-1">Priority</p>
                        {categories.priority.length > 0 &&
                            <div className="number-display-red">
                                {categories.priority.length}
                            </div>
                        }
                    </div>
                    <div onClick={() => { setSelectedCategory("overdue"); goToDashboard() }} className="nav-option">
                        <span className="material-symbols-outlined">
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
                    <div onClick={() => { setSelectedCategory("completed"); goToDashboard() }} className="nav-option">
                        <span className="material-symbols-outlined">
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
                    <div onClick={() => { setSelectedCategory("allTasks"); goToDashboard() }} className="nav-option">
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
                                return <div onClick={() => { setSelectedCategory(userCategory.categoryName); goToDashboard() }} key={index} className="nav-option">
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


                    <div onClick={() => goToAuth()} className="nav-option-bottom">
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