import React, { useContext, useEffect, useState } from 'react'
import { DataContext } from '../context/DataProvider';

const TimePickerModal = ({ open, taskId, quickUpdate, endTime, goBack, onClose }) => {
    if (!open) return null
    const { darkMode } = useContext(DataContext);
    const { mobileWidth } = useContext(DataContext);
    
    // time code
    const [selectedHour, setSelectedHour] = useState(null)
    const [selectedMinute, setSelectedMinute] = useState(null)
    const [timeOfDay, setTimeOfDay] = useState("PM")
    const clearSelectedTime = () => {
        let hour = document.getElementById('hourInput')
        let minute = document.getElementById('minuteInput')
        hour.value = ""
        minute.value = ""
        setSelectedHour(null)
        setSelectedMinute(null)
    }
    const wakeUpMinutes = () => {
        let minute = document.getElementById('minuteInput')
        if (!selectedMinute) {
            minute.value = "00"
            setSelectedMinute("00")
        }
    }
    const wakeUpHours = () => {
        let hour = document.getElementById('hourInput')
        if (!selectedHour) {
            hour.value = "12"
            setSelectedHour("12")
        }
    }
    // useEffect(() => {
    //     updateTaskEndTime()
    // }, [selectedHour, timeOfDay])

    // load time
    const loadEndTime = () => {
        const hourInput = document.getElementById('hourInput')
        const minuteInput = document.getElementById('minuteInput')
        if (endTime) {
            let taskHour = (timifee(endTime).slice(0, 2))
            let taskMinute = (timifee(endTime).slice(3, 5))
            hourInput.value = taskHour
            minuteInput.value = taskMinute
            setSelectedHour(taskHour)
            setSelectedMinute(taskMinute)
            setTimeOfDay(endTime.slice(-2))
        }
    }

    useEffect(() => {
        loadEndTime()
    }, [])

    // other functions
    const timify = (time) => {
        if (time[0] === "0") {
            time = time.slice(1)
        }
        return time
    }
    const timifee = (timeWithPM) => {
        // goes from 3:00 PM to 03:00
        let time = timeWithPM.slice(0, -3).trim()
        if (time.length === 4) {
            time = "0" + time
        }
        return time
    }

    const printTime = () => {
        console.log(timify(selectedHour + ":" + selectedMinute + " " + timeOfDay))
    }

    return (
        <div className="overlay">
            <div className={`timepicker-modal${darkMode ? "-dark" : ""} ${mobileWidth && "vw94"}`}>
                <div className="box-top position-top">
                    <p className={`m-0 box-title${darkMode ? "-dark" : ""} ${mobileWidth && "box-title-mobile"}`}>Set Time of Task</p>
                    <hr className='w-100' />
                </div>
                <div className="time-input-div">

                    <div className="time-picker-box">
                        <span className="material-symbols-outlined overlay-icon3">
                            schedule
                        </span>
                        <select onChange={(e) => { setSelectedHour(e.target.value); wakeUpMinutes() }} name="time-picker" id="hourInput" className={`hour-input-box${darkMode ? "-dark" : ""}`} placeholder="hh" required>
                            <option value="" disabled selected hidden>hh</option>
                            <option value="01">1</option>
                            <option value="02">2</option>
                            <option value="03">3</option>
                            <option value="04">4</option>
                            <option value="05">5</option>
                            <option value="06">6</option>
                            <option value="07">7</option>
                            <option value="08">8</option>
                            <option value="09">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                        </select>
                        <div className="">&nbsp;:&nbsp;</div>
                        <select onChange={(e) => { setSelectedMinute(e.target.value); wakeUpHours() }} name="time-picker" id="minuteInput" className={`minute-input-box${darkMode ? "-dark" : ""}`} placeholder="mm" required>
                            <option value="" disabled selected hidden>mm</option>
                            <option value="00">00</option>
                            <option value="05">05</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                            <option value="25">25</option>
                            <option value="30">30</option>
                            <option value="35">35</option>
                            <option value="40">40</option>
                            <option value="45">45</option>
                            <option value="50">50</option>
                            <option value="55">55</option>
                        </select>
                    </div>
                    {selectedHour && selectedMinute && timeOfDay === "AM" &&
                        <div onClick={() => setTimeOfDay("PM")} className={`todPicker${darkMode ? "-dark" : ""} hoverSlighterFade ml-2 pointer`}>AM</div>
                    }
                    {selectedHour && selectedMinute && timeOfDay === "PM" &&
                        <div onClick={() => setTimeOfDay("AM")} className={`todPicker${darkMode ? "-dark" : ""} hoverSlighterFade ml-2 pointer`}>PM</div>
                    }
                </div>
                <p onClick={() => clearSelectedTime()} className={`m-0 small gray-text hoverFade pointer ${selectedHour ? null : "hidden-o"}`}>Clear</p>

                <div className="flx-r gap-4 position-bottom">
                    <button onClick={() => goBack(taskId)} className={`btn-secondary${darkMode ? "-dark" : ""}`}>Go Back</button>
                    <button onClick={() => { quickUpdate.updateEndTime(taskId, selectedHour ? selectedHour + ":" + selectedMinute : null, timeOfDay); onClose() }} className={`btn-primary${darkMode ? "-dark" : ""}`}>Done</button>
                </div>
            </div>
        </div>
    )
}
export default TimePickerModal;