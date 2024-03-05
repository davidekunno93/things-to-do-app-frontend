import React, { useEffect, useRef } from 'react'
import { Fade } from 'react-awesome-reveal';

const MyProfile = ({ open, photoURL, onClose }) => {
    if (!open) return null
    // username = @(name w/o spaces)
    useEffect(() => {
        window.addEventListener('click', hideOnClickOutside, true)
    }, [])
    
    const refCard = useRef(null);
    const hideOnClickOutside = (e) => {
        if (refCard.current && !refCard.current.contains(e.target.value)) {
            onClose()
        }
    }


    return (
        <div className="overlay-placeholder">
            <Fade duration={200} triggerOnce>
                <div className="overlay">

                    <div ref={refCard} className="profile-modal">
                        <div className="profile-displayPictureFrame">
                            {/* <div className="displayPicture"></div> */}
                            <img src={photoURL} alt="" className="displayPicture" />
                        </div>
                        <div className="level">Level 1</div>
                        <div className="name-info">
                            <p className="m-0">Guest</p>
                            <p className="m-0">@guest</p>
                        </div>
                        <div className="profile-hero flx-1" style={{ backgroundImage: 'url(https://i.imgur.com/1xpKlBr.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                        <div className="contents flx-2">
                            <div className="friends">
                                <div className="align-all-items gap-2">
                                    <span className="material-symbols-outlined">group</span>
                                    <p className="m-0 large bold600">Friends</p>
                                </div>
                            </div>
                            <div className="achievements">
                                <div className="align-all-items gap-2">
                                    <span className="material-symbols-outlined">trophy</span>
                                    <p className="m-0 large bold600">Achievements</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </Fade>
        </div>
    )
}
export default MyProfile;