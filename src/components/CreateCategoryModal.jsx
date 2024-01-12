import React, { useContext, useState } from 'react'
import Scrollbars from 'react-custom-scrollbars-2'
import { DataContext } from '../context/DataProvider'

const CreateCategoryModal = ({ open, onClose }) => {
    if (!open) return null
    const { userCategories, setUserCategories } = useContext(DataContext);
    const [newCategory, setNewCategory] = useState({
        categoryName: "",
        color: "",
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
        newCategoryCopy.color = color
        setNewCategory(newCategoryCopy)
    }

    // update icon code 
    const updateCategoryIcon = (icon) => {
        let newCategoryCopy = { ...newCategory }
        newCategoryCopy.iconUrl = icon.iconUrl
        setNewCategory(newCategoryCopy)
    }

    const addCategory = () => {
        let userCategoriesCopy = {...userCategories}
        userCategoriesCopy.categories[newCategory.categoryName] = (newCategory)
        userCategoriesCopy.categoryOrder.push(newCategory.categoryName)
        setUserCategories(userCategoriesCopy)
        onClose()
    }


    const [selectedIcon, setSelectedIcon] = useState(null)
    const icons = [
        {
            iconName: "pikachu",
            iconUrl: "https://i.imgur.com/LWbEQps.jpg",
            iconTags: ['pokemon', 'pikachu', 'pet', 'cute', 'yellow']
        },
        {
            iconName: "pigeon",
            iconUrl: "https://i.imgur.com/DQ1Otmw.png",
            iconTags: ['pigeon', 'fly', 'pet', 'cute', 'bird', 'purple']
        },
        {
            iconName: "pikachu",
            iconUrl: "https://i.imgur.com/LWbEQps.jpg",
            iconTags: ['pokemon', 'pikachu', 'pet', 'cute', 'yellow']
        },
        {
            iconName: "pigeon",
            iconUrl: "https://i.imgur.com/DQ1Otmw.png",
            iconTags: ['pigeon', 'fly', 'pet', 'cute', 'bird', 'purple']
        },
        {
            iconName: "pikachu",
            iconUrl: "https://i.imgur.com/LWbEQps.jpg",
            iconTags: ['pokemon', 'pikachu', 'pet', 'cute', 'yellow']
        },
        {
            iconName: "pigeon",
            iconUrl: "https://i.imgur.com/DQ1Otmw.png",
            iconTags: ['pigeon', 'fly', 'pet', 'cute', 'bird', 'purple']
        },
        {
            iconName: "pikachu",
            iconUrl: "https://i.imgur.com/LWbEQps.jpg",
            iconTags: ['pokemon', 'pikachu', 'pet', 'cute', 'yellow']
        },
        {
            iconName: "pigeon",
            iconUrl: "https://i.imgur.com/DQ1Otmw.png",
            iconTags: ['pigeon', 'fly', 'pet', 'cute', 'bird', 'purple']
        },
        {
            iconName: "pikachu",
            iconUrl: "https://i.imgur.com/LWbEQps.jpg",
            iconTags: ['pokemon', 'pikachu', 'pet', 'cute', 'yellow']
        },
        {
            iconName: "pigeon",
            iconUrl: "https://i.imgur.com/DQ1Otmw.png",
            iconTags: ['pigeon', 'fly', 'pet', 'cute', 'bird', 'purple']
        },
        {
            iconName: "pikachu",
            iconUrl: "https://i.imgur.com/LWbEQps.jpg",
            iconTags: ['pokemon', 'pikachu', 'pet', 'cute', 'yellow']
        },
        {
            iconName: "pigeon",
            iconUrl: "https://i.imgur.com/DQ1Otmw.png",
            iconTags: ['pigeon', 'fly', 'pet', 'cute', 'bird', 'purple']
        },
        {
            iconName: "pikachu",
            iconUrl: "https://i.imgur.com/LWbEQps.jpg",
            iconTags: ['pokemon', 'pikachu', 'pet', 'cute', 'yellow']
        },
        {
            iconName: "pigeon",
            iconUrl: "https://i.imgur.com/DQ1Otmw.png",
            iconTags: ['pigeon', 'fly', 'pet', 'cute', 'bird', 'purple']
        },
        {
            iconName: "pikachu",
            iconUrl: "https://i.imgur.com/LWbEQps.jpg",
            iconTags: ['pokemon', 'pikachu', 'pet', 'cute', 'yellow']
        },
        {
            iconName: "pigeon",
            iconUrl: "https://i.imgur.com/DQ1Otmw.png",
            iconTags: ['pigeon', 'fly', 'pet', 'cute', 'bird', 'purple']
        },
        {
            iconName: "pikachu",
            iconUrl: "https://i.imgur.com/LWbEQps.jpg",
            iconTags: ['pokemon', 'pikachu', 'pet', 'cute', 'yellow']
        },
    ]


    const updateColor = (color) => {
        let currentSelected = document.getElementsByClassName('color-circle-container-selected')
        if (currentSelected.length > 0) {
            for (let i=0;i<currentSelected.length;i++) {
                currentSelected[i].classList.replace('color-circle-container-selected', 'color-circle-container')
            }
        }


        let newSelected = document.getElementById(color)
        newSelected.classList.replace('color-circle-container', 'color-circle-container-selected')

    }



    // other functions
    const printNewCategory = () => {
        console.log(newCategory)
    }
    return (
        <div className="overlay">
            <div className="create-category-modal">
                <p onClick={() => printNewCategory()} className="m-0 box-title">Create New Category</p>
                <hr className='w-100' />


                <p className="m-0 ml-1">Category Name</p>
                <div className="name-and-color flx-r">
                    <input onChange={(e) => updateCategoryName(e)} type="text" className="input-box flx-1" />
                    {/* <select name="color" id="colorSelect">
                        <option></option>
                    </select> */}
                </div>

                <p className="m-0 ml-1 mt-2">Color</p>
                <div className="flx-r w-100 just-sb">
                    <div id='none' className="color-circle-container">
                        <div onClick={() => {updateCategoryColor('none'); updateColor('none')}} className="color-circle cc-none position-absolute abs-center">
                            <span className="material-symbols-outlined large position-absolute abs-center">
                                close
                            </span>
                        </div>
                    </div>
                    <div id='red' className="color-circle-container">
                        <div onClick={() => {updateCategoryColor('red'); updateColor('red')}} className="color-circle cc-red position-absolute abs-center"></div>
                    </div>

                    <div id='blue' className="color-circle-container">
                        <div onClick={() => {updateCategoryColor('blue'); updateColor('blue')}} className="color-circle cc-blue position-absolute abs-center"></div>
                    </div>
                    <div id='green' className="color-circle-container">
                        <div onClick={() => {updateCategoryColor('green'); updateColor('green')}} className="color-circle cc-green position-absolute abs-center"></div>
                    </div>
                    <div id='yellow' className="color-circle-container">
                        <div onClick={() => {updateCategoryColor('yellow'); updateColor('yellow')}} className="color-circle cc-yellow position-absolute abs-center"></div>
                    </div>
                    <div id='purple' className="color-circle-container">
                        <div onClick={() => {updateCategoryColor('purple'); updateColor('purple')}} className="color-circle cc-purple position-absolute abs-center"></div>
                    </div>
                    <div id='pink' className="color-circle-container">
                        <div onClick={() => {updateCategoryColor('pink'); updateColor('pink')}} className="color-circle cc-pink position-absolute abs-center"></div>
                    </div>
                    <div id='white' className="color-circle-container">
                        <div onClick={() => {updateCategoryColor('white'); updateColor('white')}} className="color-circle cc-white position-absolute abs-center"></div>
                    </div>
                    <div id='black' className="color-circle-container">
                        <div onClick={() => {updateCategoryColor('black'); updateColor('black')}} className="color-circle cc-black position-absolute abs-center"></div>
                    </div>
                    <div id='navy' className="color-circle-container">
                        <div onClick={() => {updateCategoryColor('navy'); updateColor('navy')}} className="color-circle cc-navy position-absolute abs-center"></div>
                    </div>
                    <div id='orange' className="color-circle-container">
                        <div onClick={() => {updateCategoryColor('orange'); updateColor('orange')}} className="color-circle cc-orange position-absolute abs-center"></div>
                    </div>
                </div>

                <div className="flx-r mt-4 align-r">
                    <p className="m-0">Choose Icon:</p>
                    <div className="selectedImg-div ml-3 flx">
                        {selectedIcon &&
                        <img src={selectedIcon} alt="" className="img-small" />
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
                        <input type="text" className="input-box padr" placeholder='Search' />
                    </div>
                </div>
                <div className="flx-r flx-wrap">
                    <Scrollbars style={{ width: "100%", height: "150px" }}>
                        {icons.map((icon, index) => {
                            return <img key={index} onClick={() => setSelectedIcon(icon.iconUrl)} src={icon.iconUrl} alt="" className="catIcon img-small" />
                        })}

                    </Scrollbars>
                </div>

                <div className="flx-r just-ce gap-4 position-bottom">
                    <button onClick={() => addCategory()} className="btn-primary">Create Category</button>
                    <button onClick={() => onClose()} className="btn-secondary">Cancel</button>
                </div>
            </div>
        </div>
    )
}
export default CreateCategoryModal;