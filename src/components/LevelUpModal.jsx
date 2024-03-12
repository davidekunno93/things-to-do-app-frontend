import React, { useContext } from 'react'
import { Fade, Slide } from 'react-awesome-reveal';
import { DataContext } from '../context/DataProvider';

const LevelUpModal = ({ open, user, onClose }) => {
    if (!open) return null;
    const { mobileWidth } = useContext(DataContext);
    return (
        <div className="overlay-placeholder">
            <Fade duration={200} delay={300} triggerOnce>
                <div className="overlay">
                    <Slide direction='up' duration={400} className='flx w-100' triggerOnce>
                        <div className="mission-completed-modal font-jakarta">
                            <div className="box-title center-text">You Leveled Up!</div>
                            <hr className='w-100' />
                            <img src="https://i.imgur.com/Q3zfU10.png" alt="" className={`img-blown-up h-center ${mobileWidth && "img-blown-up-mobile"}`} />
                            {/* you just hit level #, you have # points to get to level #+1 */}
                            <p className="m-0 center-text"><strong>Congratulations!</strong> You just hit <u>Level {user.level}</u>. Earn another {user.pointsForLevelUp - user.points} points to reach Level {user.level + 1}!</p>
                            <div className="flx-r just-ce position-bottom">
                                <button onClick={() => onClose()} className="btn-primaryflex">&nbsp;&nbsp;OK&nbsp;&nbsp;</button>
                            </div>
                        </div>
                    </Slide>
                </div>
            </Fade>
        </div>
    )
}
export default LevelUpModal;