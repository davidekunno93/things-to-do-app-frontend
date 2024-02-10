import React, { useContext, useEffect, useState } from 'react'
import { DataContext } from '../context/DataProvider'
import { useNavigate } from 'react-router-dom'
import { Fade } from 'react-awesome-reveal'
import { auth, firestore } from '../firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import CompleteSignUpModal from '../components/CompleteSignUpModal'
import { doc, getDoc } from 'firebase/firestore'
import axios from 'axios'

const Authentication = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [tipIndex, setTipIndex] = useState(0);
    const [tipSliderOn, setTipSliderOn] = useState(false)
    const [timer, setTimer] = useState(0);
    const { showNavbar, setShowNavbar, user, setUser, tasks, setTasks, databaseOn, missionsOn, setMissionsOn } = useContext(DataContext);

    // other functions
    function wait(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }
    const navigate = useNavigate()
    useEffect(() => {
        setShowNavbar(false)
    }, [])

    // tips code
    const updateTimer = () => {
        wait(15000).then(() => {
            setTimer(timer + 1)
        })
    }
    const nextTip = () => {
        let tip = document.getElementById('tipBox')
        tip.classList.add('hidden-o')
        wait(500).then(() => {
            if (tipIndex === 3) {
                setTipIndex(0)
            } else {
                setTipIndex(tipIndex + 1)
            }
            tip.classList.remove('hidden-o')
        })
        updateTimer()
    }
    const showTips = () => {
        let tip = document.getElementById('tipBox')
        tip.classList.remove('hidden-o')
    }
    useEffect(() => {
        wait(800).then(() => {
            showTips()
        })
        wait(2000).then(() => {
            setTipSliderOn(true)
            updateTimer()
        })
    }, [])
    useEffect(() => {
        if (tipSliderOn) {
            nextTip()
        }
    }, [timer])
    const tips = [
        {
            title: "Create Tasks",
            imgUrl: "https://i.imgur.com/7WceuWx.png",
            text: "Set the priority, add notes, record the deadline time and add so much more customization to your tasks."
        },
        {
            title: "Advanced Settings",
            imgUrl: "https://i.imgur.com/oAKTC3X.png",
            text: "Toggle on advanced settings to set the frequency, duration, outdoors, and add steps to your task."
        },
        {
            title: "Update Tasks on the fly",
            imgUrl: "https://i.imgur.com/tm064EZ.png",
            text: "Expand tasks from the dashboard and update tasks on the fly directly from the task bar."
        },
        {
            title: "Create Categories",
            imgUrl: "https://i.imgur.com/c4bdKF5.png",
            text: "Create new categories to group your tasks in personalized lists."
        },
    ]

    // toggle show password code
    // sign in toggle
    const [showSignInPassword, setShowSignInPassword] = useState(false);
    const toggleSignInPasswordVisibility = () => {
        let password = document.getElementById('signInPassword')
        if (showSignInPassword) {
            setShowSignInPassword(false)
            password.setAttribute('type', 'password')
        } else {
            setShowSignInPassword(true)
            password.setAttribute('type', 'text')
        }
    }
    // sign up toggle
    const [showSignUpPassword, setShowSignUpPassword] = useState(false);
    const toggleSignUpPasswordVisibility = () => {
        let password = document.getElementById('signUpPassword')
        if (showSignUpPassword) {
            setShowSignUpPassword(false)
            password.setAttribute('type', 'password')
        } else {
            setShowSignUpPassword(true)
            password.setAttribute('type', 'text')
        }
    }

    // slide to and from sign in/sign up - vertical carousel
    const goToSignIn = () => {
        setActiveIndex(1)
    }
    const goToSignUp = () => {
        setActiveIndex(0)
    }


    // avatar selection code
    const [selectedAvatar, setSelectedAvatar] = useState(null)
    const [selectedAvatarUrl, setSelectedAvatarUrl] = useState(null)
    const avatars = [
        {
            avatarName: "Frederick the Frog",
            imgUrl: "https://i.imgur.com/KN1lQAg.png"
        },
        {
            avatarName: "Golden guy",
            imgUrl: "https://i.imgur.com/TsCbO41.png"
        },
        {
            avatarName: "Moody Bird",
            imgUrl: "https://i.imgur.com/eoftNcm.png"
        },
        {
            avatarName: "Hearty Heather",
            imgUrl: "https://i.imgur.com/wYUUYrd.png"
        },
        {
            avatarName: "Timothy Edison",
            imgUrl: "https://i.imgur.com/Ag7qwwY.png"
        },
        {
            avatarName: "yoda, The",
            imgUrl: "https://i.imgur.com/2kdku4H.png"
        }
    ]


    const navigateToDashboard = () => {
        let page = document.getElementById('pageBody')
        let tips = document.getElementById('tipBox')
        let authC = document.getElementById('authContainer')
        page.classList.add('hidden-o')
        tips.classList.add('hidden-o')

        wait(600).then(() => {
            tips.classList.add('d-none')
            authC.classList.add('auth-container-anim')
            wait(600).then(() => {
                setShowNavbar(true)
                navigate('/')
            })
        })
    }


    // sign up authentication code
    const [signUpName, setSignUpName] = useState("")
    const [signUpEmail, setSignUpEmail] = useState("")
    const [signUpPassword, setSignUpPassword] = useState("")
    const signUp = () => {
        let nameError = document.getElementById('signUpNameError')
        let emailError = document.getElementById('signUpEmailError')
        let passwordError = document.getElementById('signUpPasswordError')
        let error = false
        if (!signUpName) {
            nameError.classList.remove('d-none')
            error = true
        } else {
            nameError.classList.add('d-none')
        }
        if (!signUpEmail || !signUpEmail.includes('@')) {
            emailError.classList.remove('d-none')
            error = true
        } else {
            emailError.classList.add('d-none')
        }
        if (signUpPassword.length < 6) {
            passwordError.classList.remove('d-none')
            error = true
        } else {
            passwordError.classList.add('d-none')
        }
        if (!error) {
            createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword)
                .then(() => {
                    // after user has been signed up go to CompleteSignUpModal to handle dname/dp/initiate level on firestore and get tasks/userCategories environment ready
                    setCompleteSignUpModalOpen(true)
                })
                .catch((error) => {
                    console.log(error)
                    alert("Something went wrong. Please try again later.")
                })
        }
    }

    // sign in authentication code
    const [signInEmail, setSignInEmail] = useState("")
    const [signInPassword, setSignInPassword] = useState("")
    const signIn = () => {
        let emailError = document.getElementById('signInEmailError')
        let passwordError = document.getElementById('signInPasswordError')

        let error = false
        if (!signInEmail || !signInEmail.includes('@')) {
            emailError.classList.remove('d-none')
            error = true
        } else {
            emailError.classList.add('d-none')
        }
        if (signInPassword.length < 6) {
            passwordError.classList.remove('d-none')
            error = true
        } else {
            passwordError.classList.add('d-none')
        }
        if (!error) {
            signInWithEmailAndPassword(auth, signInEmail, signInPassword).then((userCredential) => {
                handleLogin(userCredential)
            }).catch((error) => {
                console.log(error)
            })
        }
    }
    const handleLogin = async (cred) => {
        let userLevelDoc = await getDoc(doc(firestore, `userLevel/${auth.currentUser.uid}`))
        let userLevelData = userLevelDoc.data()
        console.log(userLevelData)
        let userCopy = { ...user }
        // using login cred response from firebase
        userCopy.uid = cred.user.uid
        userCopy.displayName = cred.user.displayName
        userCopy.photoURL = cred.user.photoURL
        // using firestore document saved userLevel data
        userCopy.level = userLevelData.level
        userCopy.points = userLevelData.points
        userCopy.pointsForLevelUp = userLevelData.pointsForLevelUp
        setUser(userCopy)
        setTasks({})
        // set tasks environment
        navigateToDashboard()
    }


    // after signing up, modal comes up to welcome the new user
    const [completeSignUpModalOpen, setCompleteSignUpModalOpen] = useState(false);
    const openCompleteSignUpModal = () => {
        setCompleteSignUpModalOpen(true)
    }
    const completeSignUp = () => {
        setCompleteSignUpModalOpen(false)
        wait(300).then(() => {
            navigateToDashboard()
        })
    }

    const sendData = async () => {
        if (databaseOn) {
            let url = "http://localhost:5000/auth/create_user"
            let data = "testing"
            const response = await axios.post(url, JSON.stringify(data), {
                headers: { "Content-Type": "application/json" }
            }).then((response) => {
                console.log(response.data)
            }).catch((error) => {
                console.log(error)
            })
        }
    }

    // for tour as guest, load demo tasks to play with
    const loadDemoTasks = () => {
        setTasks({
            1: {
                id: 1,
                db_task_id: null,
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
                location: "Kroger's",
                participants: [], // [{uid: "", displayName: "", photoURL: ""}]
                steps: [
                    { number: 1, desc: "Complete car inspection", completed: false },
                    { number: 2, desc: "Go to grocery store to purchase updated registration", completed: false }
                ], // [{number: #, desc: "", completed: false}]
                progress: 0,
                completed: false,
                completionDate: null,
                dumped: false,
                pointsAwarded: null,
            },
            2: {
                id: 2,
                db_task_id: null,
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
                location: "Home",
                participants: [], // [{uid: "", displayName: "", photoURL: ""}]
                steps: [
                    { number: 1, desc: "Wash the dishes", completed: false },
                    { number: 2, desc: "Set them on the drying rack", completed: false },
                    { number: 3, desc: "Put the dishes away", completed: false }
                ], // [{number: 1, desc: "", completed: false}]
                progress: 0,
                completed: false,
                completionDate: null,
                dumped: false,
                pointsAwarded: null,
            },
            3: {
                id: 3,
                db_task_id: null,
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
                location: "Central Houston",
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
                completionDate: null,
                dumped: false,
                pointsAwarded: null,
            },
            4: {
                id: 4,
                db_task_id: null,
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
                location: null,
                participants: [], // [{uid: "", displayName: "", photoURL: ""}]
                steps: [], // [{number: 1, desc: "", completed: false}]
                progress: 0,
                completed: false,
                completionDate: null,
                dumped: false,
                pointsAwarded: null,
            },
            5: {
                id: 5,
                db_task_id: null,
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
                location: null,
                participants: [], // [{uid: "", displayName: "", photoURL: ""}]
                steps: [
                    { number: 1, desc: "Own a company", completed: false },
                    { number: 2, desc: "Sell it for a million bucks!", completed: false }
                ], // [{number: "", desc: "", completed: ""}]
                progress: 0,
                completed: false,
                completionDate: null,
                dumped: false,
                pointsAwarded: null,
            },
            6: {
                id: 6,
                db_task_id: null,
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
                location: null,
                participants: [], // [{uid: "", displayName: "", photoURL: ""}]
                steps: [
                    { number: 1, desc: "Find one infinity stone", completed: false },
                    { number: 2, desc: "Find the rest of the inifinity stones", completed: false }
                ], // [{number: "", desc: "", completed: ""}]
                progress: 0,
                completed: false,
                completionDate: null,
                dumped: false,
                pointsAwarded: null,
            },
            7: {
                id: 7,
                db_task_id: null,
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
                location: null,
                participants: [], // [{uid: "", displayName: "", photoURL: ""}]
                steps: [
                    { number: 1, desc: "Buy pokeballs", completed: true },
                    { number: 2, desc: "Walk through tall grass", completed: false },
                    { number: 3, desc: "Battle a pokemon", completed: false },
                    { number: 4, desc: "Weaken the pokemon", completed: false },
                    { number: 5, desc: "Catch the pokemon", completed: false }
                ], // [{number: "", desc: "", completed: ""}]
                progress: 0,
                completed: false,
                completionDate: null,
                dumped: false,
                pointsAwarded: null,
            },
        })
    }

    return (
        <>
            <CompleteSignUpModal open={completeSignUpModalOpen} displayName={signUpName} photoURL={selectedAvatarUrl} onClose={completeSignUp} />
            <div id='authContainer' className="auth-container">
                {/* <Fade fraction={0} triggerOnce> */}
                <div id='tipBox' className="website-tips z-1 flx position-absolute white-text hidden-o">
                    <div className="m-auto">
                        <p className="m-0 xx-large font-jakarta">{tips[tipIndex].title}</p>

                        <img src={tips[tipIndex].imgUrl} alt="" className="img-tip my-2" />
                        <p className="m-0">{tips[tipIndex].text}</p>
                    </div>
                </div>
                {/* </Fade> */}
                <Fade fraction={0} triggerOnce>
                    <div id='pageBody' className="pagebody-bg-black flx">
                        <div className="carousel-window">
                            <div className="inner" style={{ transform: `translateY(-${activeIndex * 100}%)` }}>
                                <div className="carousel-item">



                                    <div className="sign-up-box flx-c just-se">

                                        <div onClick={() => sendData()} className="xx-large font-jakarta">Sign Up</div>

                                        <div className="name flx-c">
                                            <label htmlFor='name' className="m-0">Name: <span id='signUpNameError' className="red-text d-none">*Please enter your name*</span></label>
                                            <input onChange={(e) => setSignUpName(e.target.value)} id='name' type="text" className='input-style3' />
                                        </div>

                                        <div className="email flx-c">
                                            <label htmlFor='email' className="m-0">Email: <span id='signUpEmailError' className="red-text d-none">*Please enter a valid email*</span></label>
                                            <input onChange={(e) => setSignUpEmail(e.target.value)} id='email' type="text" className='input-style3' />
                                        </div>

                                        <div className="avatarsTitle flx-r align-r">
                                            <p className="m-0">Avatar:</p>
                                            <p onClick={() => { setSelectedAvatar(null); setSelectedAvatarUrl(null) }} className="m-0 position-right gray-text small hoverFade pointer">Clear</p>
                                        </div>
                                        <div className="avatarIcons mb-4 flx-r just-sb">
                                            {avatars.map((avatar, index) => {
                                                let selected = avatar.avatarName === selectedAvatar ? true : false
                                                return <img key={index} onClick={() => { setSelectedAvatar(avatar.avatarName); setSelectedAvatarUrl(avatar.imgUrl) }} src={avatar.imgUrl} alt={avatar.avatarName} className={`img-small pointer ${selected ? " chosen" : "unchosen"}`} />
                                            })}
                                        </div>

                                        <div className="password flx-c">
                                            <label htmlFor='signUpPassword' className="m-0">Password: <span id='signUpPasswordError' className="red-text d-none">*Password must be min. 6 characters*</span></label>
                                            <div className="inputBox flx-c">
                                                <div className="overlay-icon-right flx">
                                                    <span onClick={() => toggleSignUpPasswordVisibility()} className="showPasswordIcon material-symbols-outlined">
                                                        {showSignUpPassword ? "visibility" : "visibility_off"}
                                                    </span>
                                                </div>
                                                <input onChange={(e) => setSignUpPassword(e.target.value)} id='signUpPassword' type="password" className='input-style3' />
                                            </div>
                                        </div>

                                        <div className="registerBtn flx-c">
                                            <div className="flx">
                                                <div className="align-all-items hoverLightGraylight pointer">
                                                    <p onClick={() => { signUp(); setMissionsOn(false) }} className="m-0 x-large">Register</p>
                                                    <span className="material-symbols-outlined ml-2">
                                                        arrow_forward
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="m-0 gray-text">Already have an account? <span onClick={() => goToSignIn()} className="hoverGraylight pointer"><u>Sign In</u></span></p>
                                        </div>
                                    </div>
                                </div>


                                <div className="carousel-item">
                                    <div className="sign-in-box flx-c just-se">
                                        <div className="xx-large font-jakarta">Sign In</div>
                                        <div className="email flx-c">
                                            <label htmlFor='signInEmail' className="m-0">Email: <span id='signInEmailError' className="red-text d-none">*Please enter a valid email*</span></label>
                                            <input onChange={(e) => setSignInEmail(e.target.value)} id='signInEmail' type="text" className='input-style3' />
                                        </div>
                                        <div className="password flx-c">
                                            <label htmlFor='signInPassword' className="m-0">Password: <span id='signInPasswordError' className="red-text d-none">*Password must be min. 6 characters*</span></label>
                                            <div className="inputBox flx-c">
                                                <div className="overlay-icon-right flx">
                                                    <span onClick={() => toggleSignInPasswordVisibility()} className="showPasswordIcon material-symbols-outlined">
                                                        {showSignInPassword ? "visibility" : "visibility_off"}
                                                    </span>
                                                </div>
                                                <input onChange={(e) => setSignInPassword(e.target.value)} id='signInPassword' type="password" className='input-style3' />
                                            </div>
                                        </div>

                                        <div className="registerBtn flx-c">
                                            <div className="flx">
                                                <div onClick={() => { signIn(); setMissionsOn(false) }} className="align-all-items hoverLightGraylight pointer">
                                                    <p className="m-0 x-large">Login</p>
                                                    <span className="material-symbols-outlined ml-2">
                                                        arrow_forward
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="m-0 gray-text">Don't have an account? <span onClick={() => goToSignUp()} className="hoverGraylight pointer"><u>Sign Up</u></span> or <span onClick={() => { loadDemoTasks(); navigateToDashboard(); setMissionsOn(false) }} className="hoverGraylight pointer"><u>Tour as a Guest</u></span></p>
                                        </div>
                                    </div>

                                </div>


                            </div>
                        </div>

                    </div>
                </Fade>
            </div>
        </>
    )
}
export default Authentication