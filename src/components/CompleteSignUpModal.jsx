import React, { useContext, useEffect, useState } from 'react'
import { auth, firestore } from '../firebase'
import { DataContext } from '../context/DataProvider'
import { useNavigate } from 'react-router-dom';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Fade } from 'react-awesome-reveal';
import axios from 'axios';

const CompleteSignUpModal = ({ open, displayName, photoURL, onClose }) => {
    if (!open) return null
    const { user, setUser, setTasks, setUserCategories } = useContext(DataContext);

    // other functions
    const capitalized = (str) => {
        return str.charAt(0).toUpperCase() + displayName.slice(1)
    }
    const navigate = useNavigate()
    function wait(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    // set to true after user dname and photo updated on firebase, level details initiated in firestore, use/tasks/userCategories set up on data provider
    const [userSetUpComplete, setUserSetUpComplete] = useState(false);

    // not needed - just checking the firestore doc code
    const getDocument = async () => {
        let uid = "testUser"
        let testDoc = await getDoc(doc(firestore, `userLevel/${uid}`))
        let testData = testDoc.data()
        console.log(testData)
    }
    // initiates user level details on firestore 
    const initiateUserLevel = () => {
        let uid = auth.currentUser ? auth.currentUser.uid : "testUser"
        setDoc(doc(firestore, `userLevel/${uid}`), {
            level: 1,
            points: 0,
            pointsForLevelUp: 45
        })
    }

    const sendData = async () => {
        let url = "http://localhost:5000/auth/create_user"
        let data = {
            uid: auth.currentUser.uid,
            displayName: displayName,
            photoURL: photoURL ? photoURL : null,
            email: auth.currentUser.email
        }
        const response = await axios.post(url, JSON.stringify(data), {
            headers: { "Content-Type" : "application/json" }
        }).then((response) => {
            console.log(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }

    const handleSignUp = async () => {
        // update firebase user with display name and photoUrl once user created
        wait(4000).then( async () => {
            // await sendData()
            updateProfile(auth.currentUser, {
                displayName: displayName,
                photoURL: photoURL ? photoURL : null
            }).then(() => {
                // initiate user at level 1 on firestore
                initiateUserLevel()
                // set user in DataProvider
                setUser({
                    uid: auth.currentUser.uid,
                    displayName: displayName,
                    photoURL: photoURL ? photoURL : null,
                    email: auth.currentUser.email,
                    level: 1,
                    points: 0,
                    pointsForLevelUp: 45
                })
                // set user tasks
                setTasks({})
                // empty userCategories
                setUserCategories({
                    categories: {},
                    categoryOrder: []
                })
                // confirm user set up is complete before loading modal text and completion button
                setUserSetUpComplete(true)
            }).catch((error) => {
                console.log(error)
            })
        })
    }

    // triggered on open to handle dname/dp/photoURL/level & pts/tasks environment in DataProvider
    useEffect(() => {
        // // update firebase user with display name and photoUrl once user created
        // wait(4000).then(() => {
        //     updateProfile(auth.currentUser, {
        //         displayName: displayName,
        //         photoURL: photoURL ? photoURL : null
        //     }).then(() => {
        //         // initiate user at level 1 on firestore
        //         initiateUserLevel()
        //         // set user in DataProvider
        //         setUser({
        //             uid: auth.currentUser.uid,
        //             displayName: displayName,
        //             photoURL: photoURL ? photoURL : "https://i.imgur.com/MacUxKa.png",
        //             email: auth.currentUser.email,
        //             level: 1,
        //             points: 0,
        //             pointsForLevelUp: 45
        //         })
        //         // set user tasks
        //         setTasks({})
        //         // empty userCategories
        //         setUserCategories({
        //             categories: {},
        //             categoryOrder: []
        //         })
        //         // confirm user set up is complete before loading modal text and completion button
        //         setUserSetUpComplete(true)
        //     }).catch((error) => {
        //         console.log(error)
        //     })
        // })
        handleSignUp()
    }, [])
    
    return (
        <div className="overlay-placeholder">
            <Fade className='z-1' fraction={0} triggerOnce>
                <div className="overlay">
                    <div className="complete-sign-up-modal flx-c">
                        {userSetUpComplete ?
                            <div className="modal-content h-100 flx-c">
                                <p className="m-0 xx-large">You're in!</p>
                                <p className="m-0">{capitalized(displayName)}, we're really excited for you to try our application.</p>
                                <p className="m-0 mt-3">Please report bugs or feature requests using the <strong>feedback button</strong> in the <u>top section</u> of the dashboard. This is how we improve the product for our users!</p>
                                <div className="btn-space position-bottom">
                                    <button onClick={() => onClose()} className="btn-primary">Got it!</button>
                                </div>
                            </div>
                            :
                            <div className="loading m-auto"></div>
                        }
                    </div>
                </div>
            </Fade>
        </div>
    )
}
export default CompleteSignUpModal;