import React, { useContext, useState } from 'react'
import Scrollbars from 'react-custom-scrollbars-2'
import { DataContext } from '../context/DataProvider'

const CreateCategoryModal = ({ open, onClose }) => {
    if (!open) return null
    const { userCategories, setUserCategories } = useContext(DataContext);
    const { darkMode } = useContext(DataContext);
    const { mobileWidth } = useContext(DataContext);
    const [newCategory, setNewCategory] = useState({
        categoryName: "",
        color: "none",
        iconUrl: "",
        uid: "testUser",
    })

    // update category code
    const updateCategoryName = (e) => {
        let newCategoryCopy = { ...newCategory }
        newCategoryCopy.categoryName = e.target.value
        setNewCategory(newCategoryCopy)
        // console.log(e.target.value)
    }

    // update color code
    const updateCategoryColor = (color) => {
        let newCategoryCopy = { ...newCategory }
        if (color === 'none') {
            newCategoryCopy.color = "none"
        } else {
            newCategoryCopy.color = color
        }
        setNewCategory(newCategoryCopy)
    }

    // update icon code 
    const updateCategoryIcon = (icon) => {
        let newCategoryCopy = { ...newCategory }
        newCategoryCopy.iconUrl = icon
        setNewCategory(newCategoryCopy)
    }

    const addCategory = () => {
        if (newCategory.categoryName) {
            let userCategoriesCopy = { ...userCategories }
            userCategoriesCopy.categories[newCategory.categoryName] = (newCategory)
            userCategoriesCopy.categoryOrder.push(newCategory.categoryName)
            setUserCategories(userCategoriesCopy)
            onClose()
        } else {

        }
    }


    const [selectedIcon, setSelectedIcon] = useState(null)
    const icons = [
        {
            iconName: "shopping bags",
            iconUrl: "https://i.imgur.com/NLmGzrG.png",
            iconTags: ['shopping', 'bags', 'spend', 'mall']
        },
        {
            iconName: "inbox",
            iconUrl: "https://i.imgur.com/V0P8X5E.png",
            iconTags: ['inbox', 'mail', 'papers', 'file']
        },
        {
            iconName: "groceries",
            iconUrl: "https://i.imgur.com/ccL7bih.png",
            iconTags: ['groceries', 'basket', 'market', 'yellow']
        },
        {
            iconName: "tags",
            iconUrl: "https://i.imgur.com/P6RBdSr.png",
            iconTags: ['tags', 'shop', 'blue']
        },
        {
            iconName: "camera",
            iconUrl: "https://i.imgur.com/b9H0BDA.png",
            iconTags: ['camera', 'picture', 'image', 'photo', 'photography']
        },
        {
            iconName: "apple",
            iconUrl: "https://i.imgur.com/dIiXUrK.png",
            iconTags: ['apple', 'technology', 'phones', 'iphone']
        },
        {
            iconName: "artificial intelligence",
            iconUrl: "https://i.imgur.com/3vKeC0A.png",
            iconTags: ['artifical', 'intelligence', 'technology', 'programming']
        },
        {
            iconName: "veggie bowl",
            iconUrl: "https://i.imgur.com/Q3uCN6H.png",
            iconTags: ['veggie', 'vegetarian', 'bowl', 'food']
        },
        {
            iconName: "trophy",
            iconUrl: "https://i.imgur.com/0W3hS9H.png",
            iconTags: ['trophy', 'winning', 'competition', 'champion', 'yellow', 'victory']
        },
        {
            iconName: "money bag",
            iconUrl: "https://i.imgur.com/McQRcDJ.png",
            iconTags: ['money', 'bags', 'bank', 'green', 'rich']
        },
        {
            iconName: "map",
            iconUrl: "https://i.imgur.com/Hh5K6aF.png",
            iconTags: ['map', 'location', 'pin', 'travel']
        },
        {
            iconName: "christmas tree",
            iconUrl: "https://i.imgur.com/r1inSNZ.png",
            iconTags: ['christmas', 'tree', 'xmas', 'holiday']
        },
        {
            iconName: "compact disk",
            iconUrl: "https://i.imgur.com/Uw6RZOQ.png",
            iconTags: ['compact', 'disk', 'music', 'playlist', 'blue']
        },
        {
            iconName: "bookmark",
            iconUrl: "https://i.imgur.com/2aBr45Z.png",
            iconTags: ['bookmark', 'star', 'favorite']
        },
        {
            iconName: "presentation",
            iconUrl: "https://i.imgur.com/I0UjmF6.png",
            iconTags: ['presentation', 'work', 'office']
        },
        {
            iconName: "location pin",
            iconUrl: "https://i.imgur.com/t2EAesy.png",
            iconTags: ['location', 'pin', 'map', 'travel', 'destination']
        },
        {
            iconName: "shopping cart",
            iconUrl: "https://i.imgur.com/LkO5iAj.png",
            iconTags: ['shopping', 'cart', 'groceries', 'market']
        },
        {
            iconName: "bank",
            iconUrl: "https://i.imgur.com/eoftxDS.png",
            iconTags: ['bank', 'money', 'building']
        },
        {
            iconName: "chart",
            iconUrl: "https://i.imgur.com/w4u4PTo.png",
            iconTags: ['pie', 'chart', 'portions']
        },
        {
            iconName: "smartphone",
            iconUrl: "https://i.imgur.com/xralCEf.png",
            iconTags: ['smart', 'phone', 'smartphone', 'telephone']
        },
        {
            iconName: "user",
            iconUrl: "https://i.imgur.com/aNjWuCO.png",
            iconTags: ['user', 'person', 'individual']
        },
        {
            iconName: "car key",
            iconUrl: "https://i.imgur.com/EBiy6DH.png",
            iconTags: ['car', 'key']
        },
        {
            iconName: "email",
            iconUrl: "https://i.imgur.com/G8dJ8h1.png",
            iconTags: ['email', 'inbox', 'internet', 'message']
        },
        {
            iconName: "coffee cup",
            iconUrl: "https://i.imgur.com/zxN3pyr.png",
            iconTags: ['coffee', 'cup', 'hot', 'drink']
        },
        {
            iconName: "taxi",
            iconUrl: "https://i.imgur.com/Nm1N0cy.png",
            iconTags: ['taxi', 'car', 'drive', 'road']
        },
        {
            iconName: "team",
            iconUrl: "https://i.imgur.com/mzPrzwq.png",
            iconTags: ['team', 'people', 'group']
        },
        {
            iconName: "gift box",
            iconUrl: "https://i.imgur.com/q5pMJuZ.png",
            iconTags: ['gifts', 'box', 'wrapped', 'present']
        },
        {
            iconName: "health report",
            iconUrl: "https://i.imgur.com/3Do4ea2.png",
            iconTags: ['health', 'report', 'doctors', 'heart', 'hospital']
        },
        {
            iconName: "soccer",
            iconUrl: "https://i.imgur.com/XdnUluo.png",
            iconTags: ['soccer', 'football', 'sports', 'ball']
        },
        {
            iconName: "money dollar",
            iconUrl: "https://i.imgur.com/LPdB0G1.png",
            iconTags: ['money', 'dollar', 'green', 'rich']
        },
        {
            iconName: "android",
            iconUrl: "https://i.imgur.com/IAsDuMh.png",
            iconTags: ['android', 'phone', 'technology', 'smartphone']
        },
        {
            iconName: "star",
            iconUrl: "https://i.imgur.com/DHUWspC.png",
            iconTags: ['star', 'golden', 'bookmark', 'favorite']
        },
        {
            iconName: "gift card",
            iconUrl: "https://i.imgur.com/LhsAM8q.png",
            iconTags: ['gifts', 'cards', 'present', 'holiday']
        },
        {
            iconName: "vintage car",
            iconUrl: "https://i.imgur.com/YZoBLjt.png",
            iconTags: ['vintage', 'car', 'blue', 'drive', 'vehicle', 'road']
        },
        {
            iconName: "basket",
            iconUrl: "https://i.imgur.com/HZ3tQW9.png",
            iconTags: ['baskets', 'shopping', 'groceries', 'market']
        },
        {
            iconName: "email document",
            iconUrl: "https://i.imgur.com/fvo66vH.png",
            iconTags: ['email', 'document', 'inbox', 'mail']
        },
        {
            iconName: "pie chart",
            iconUrl: "https://i.imgur.com/gkS0AEZ.png",
            iconTags: ['pie', 'charts', 'math', 'portions', 'thirds']
        },
        {
            iconName: "office",
            iconUrl: "https://i.imgur.com/b7Hacuv.png",
            iconTags: ['office', 'buildings', 'blue', 'work']
        },
        {
            iconName: "basketball",
            iconUrl: "https://i.imgur.com/gIYKArk.png",
            iconTags: ['basketball', 'sports', 'ball', 'blue']
        },
        {
            iconName: "two users",
            iconUrl: "https://i.imgur.com/sqPWKA3.png",
            iconTags: ['two', 'users', 'people']
        }
    ]


    const updateColor = (color) => {
        let currentSelected = document.getElementsByClassName('color-circle-container-selected')
        if (currentSelected.length > 0) {
            for (let i = 0; i < currentSelected.length; i++) {
                currentSelected[i].classList.replace('color-circle-container-selected', 'color-circle-container')
            }
        }


        let newSelected = document.getElementById(color)
        newSelected.classList.replace('color-circle-container', 'color-circle-container-selected')

    }

    const [searchQuery, setSearchQuery] = useState("")


    // other functions
    const printNewCategory = () => {
        console.log(newCategory)
    }
    return (
        <div className="overlay">
            <div className={`create-category-modal${darkMode ? "-dark" : ""} ${mobileWidth && "create-category-modal-mobile"}`}>
                <p onClick={() => printNewCategory()} className={`m-0 box-title${darkMode ? "-dark" : ""}`}>Create New Category</p>
                <hr className='w-100' />


                <p className="m-0 ml-1">Category Name</p>
                <div className="name-and-color flx-r">
                    <input onChange={(e) => updateCategoryName(e)} type="text" className={`input-box${darkMode ? "-dark" : ""} flx-1`} placeholder='Enter category name' />
                    {/* <select name="color" id="colorSelect">
                        <option></option>
                    </select> */}
                </div>

                <p className="m-0 ml-1 mt-2">Color</p>
                <div className="flx-r w-100 just-sb">
                    <div id='none' className="color-circle-container-selected">
                        <div onClick={() => { updateCategoryColor('none'); updateColor('none') }} className="color-circle cc-none position-absolute abs-center">
                            {/* <span className="material-symbols-outlined large position-absolute abs-center dark-text">
                                close
                            </span> */}
                            <p className="m-0 xx-small position-absolute abs-center dark-text">None</p>
                        </div>
                    </div>
                    <div id='red' className="color-circle-container">
                        <div onClick={() => { updateCategoryColor('red'); updateColor('red') }} className="color-circle cc-red position-absolute abs-center"></div>
                    </div>

                    <div id='blue' className="color-circle-container">
                        <div onClick={() => { updateCategoryColor('blue'); updateColor('blue') }} className="color-circle cc-blue position-absolute abs-center"></div>
                    </div>
                    <div id='green' className="color-circle-container">
                        <div onClick={() => { updateCategoryColor('green'); updateColor('green') }} className="color-circle cc-green position-absolute abs-center"></div>
                    </div>
                    <div id='yellow' className="color-circle-container">
                        <div onClick={() => { updateCategoryColor('yellow'); updateColor('yellow') }} className="color-circle cc-yellow position-absolute abs-center"></div>
                    </div>
                    {/* <div id='purple' className="color-circle-container">
                        <div onClick={() => {updateCategoryColor('purple'); updateColor('purple')}} className="color-circle cc-purple position-absolute abs-center"></div>
                    </div> */}
                    <div id='purple' className="color-circle-container">
                        <div onClick={() => { updateCategoryColor('purple'); updateColor('purple') }} className="color-circle cc-purple position-absolute abs-center"></div>
                    </div>
                    <div id='white' className="color-circle-container">
                        <div onClick={() => { updateCategoryColor('white'); updateColor('white') }} className="color-circle cc-white position-absolute abs-center"></div>
                    </div>
                    {/* <div id='black' className="color-circle-container">
                        <div onClick={() => {updateCategoryColor('black'); updateColor('black')}} className="color-circle cc-black position-absolute abs-center"></div>
                    </div> */}
                    <div id='navy' className="color-circle-container">
                        <div onClick={() => { updateCategoryColor('navy'); updateColor('navy') }} className="color-circle cc-navy position-absolute abs-center"></div>
                    </div>
                    <div id='orange' className="color-circle-container">
                        <div onClick={() => { updateCategoryColor('orange'); updateColor('orange') }} className="color-circle cc-orange position-absolute abs-center"></div>
                    </div>
                </div>

                <div className="flx-c mt-3">
                    {mobileWidth &&
                        <p className="m-0">Choose Icon:</p>
                    }
                    <div className="flx-r align-r mb-2">
                        {!mobileWidth &&
                            <p className="m-0">Choose Icon:</p>
                        }
                        <div className="selectedImg-div ml-3 flx">
                            {selectedIcon &&
                                <img src={selectedIcon} alt="" className={`${mobileWidth ? "catIcon-mobile" : "img-small"}`} />
                            }
                        </div>
                        {selectedIcon &&
                            <div className="removeIcon ml-1h">
                                <p onClick={() => setSelectedIcon(null)} className="m-0 small hoverFade pointer gray-text">Clear</p>
                            </div>
                        }

                        <div className="inputBox position-right">
                            <div className="overlay-icon-right2">
                                <span className="material-symbols-outlined">
                                    search
                                </span>
                            </div>
                            <input onChange={(e) => setSearchQuery(e.target.value)} type="text" className={`${mobileWidth ? "input-search-box" : "input-box"}${darkMode ? "-dark" : ""} padr`} placeholder='Search' />
                        </div>
                    </div>
                </div>
                <div className="flx-r flx-wrap">
                    <Scrollbars style={{ width: "100%", height: "140px" }}>
                        {icons.map((icon, index) => {
                            let tagString = icon.iconTags.join("")
                            let filteredIn = searchQuery ? tagString.includes(searchQuery) : true
                            return filteredIn ? <img key={index} onClick={() => { updateCategoryIcon(icon.iconUrl); setSelectedIcon(icon.iconUrl) }} src={icon.iconUrl} alt="" className={`${mobileWidth ? "catIcon-mobile" : "catIcon img-small"}`} />
                                : null
                        })}

                    </Scrollbars>
                </div>

                <div className="flx-r just-ce gap-4 position-bottom">
                    <button onClick={() => addCategory()} className={`btn-primary${darkMode ? "-dark" : ""} medium`}>Create {!mobileWidth && "Category"}</button>
                    <button onClick={() => onClose()} className={`btn-secondary${darkMode ? "-dark" : ""} medium`}>Cancel</button>
                </div>
            </div>
        </div>
    )
}
export default CreateCategoryModal;