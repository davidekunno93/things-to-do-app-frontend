import React, { useEffect, useState } from 'react'

const TimePickerModal = ({ open, taskId, quickUpdate, endTime, goBack, onClose }) => {
    if (!open) return null
    // time code
    const [selectedTime, setSelectedTime] = useState(endTime ? endTime : null);
    const [timeOfDay, setTimeOfDay] = useState("PM")
    const updateSelectedTime = (time) => {
        if (time === "Clear") {
            let timeInput = document.getElementById('timeInput')
            timeInput.value = ""
            setSelectedTime(null)
        } else {
            setSelectedTime(time)
        }
    }
    // load time
    const loadEndTime = () => {
        const timeInput = document.getElementById('timeInput')
        if (endTime) {
            timeInput.value = timifee(endTime)
            setSelectedTime(timifee(endTime))
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
            time = "0"+time
        }
        return time
    }

    const printTime = () => {
        console.log(timify(selectedTime+" "+timeOfDay))
    }

    return (
        <div className="overlay">
            <div className="timepicker-modal">
                <div className="box-top position-top">
                    <p onClick={() => printTime()} className="m-0 box-title">Set Time of Task</p>
                    <hr className='w-100' />
                </div>
                <div className="time-picker-box">
                    <span className="material-symbols-outlined overlay-icon3">
                        schedule
                    </span>
                    {selectedTime && timeOfDay === "AM" &&
                        <div onClick={() => setTimeOfDay("PM")} className="overlay-am">AM</div>
                    }
                    {selectedTime && timeOfDay === "PM" &&
                        <div onClick={() => setTimeOfDay("AM")} className="overlay-pm">PM</div>
                    }
                    <select onChange={(e) => updateSelectedTime(e.target.value)} name="time-picker" id="timeInput" className='time-input-box m-auto' required>
                        <option value="" disabled selected hidden>hh:mm</option>
                        <option value="Clear">Clear</option>
                        <option value="12:00">12:00</option>
                        <option value="12:15">12:15</option>
                        <option value="12:30">12:30</option>
                        <option value="12:45">12:45</option>
                        <option value="01:00">01:00</option>
                        <option value="01:15">01:15</option>
                        <option value="01:30">01:30</option>
                        <option value="01:45">01:45</option>
                        <option value="02:00">02:00</option>
                        <option value="02:15">02:15</option>
                        <option value="02:30">02:30</option>
                        <option value="02:45">02:45</option>
                        <option value="03:00">03:00</option>
                        <option value="03:15">03:15</option>
                        <option value="03:30">03:30</option>
                        <option value="03:45">03:45</option>
                        <option value="04:00">04:00</option>
                        <option value="04:15">04:15</option>
                        <option value="04:30">04:30</option>
                        <option value="04:45">04:45</option>
                        <option value="05:00">05:00</option>
                        <option value="05:15">05:15</option>
                        <option value="05:30">05:30</option>
                        <option value="05:45">05:45</option>
                        <option value="06:00">06:00</option>
                        <option value="06:15">06:15</option>
                        <option value="06:30">06:30</option>
                        <option value="06:45">06:45</option>
                        <option value="07:00">07:00</option>
                        <option value="07:15">07:15</option>
                        <option value="07:30">07:30</option>
                        <option value="07:45">07:45</option>
                        <option value="08:00">08:00</option>
                        <option value="08:15">08:15</option>
                        <option value="08:30">08:30</option>
                        <option value="08:45">08:45</option>
                        <option value="09:00">09:00</option>
                        <option value="09:15">09:15</option>
                        <option value="09:30">09:30</option>
                        <option value="09:45">09:45</option>
                        <option value="10:00">10:00</option>
                        <option value="10:15">10:15</option>
                        <option value="10:30">10:30</option>
                        <option value="10:45">10:45</option>
                        <option value="11:00">11:00</option>
                        <option value="11:15">11:15</option>
                        <option value="11:30">11:30</option>
                        <option value="11:45">11:45</option>

                    </select>
                </div>

                <div className="flx-r gap-4 position-bottom">
                    <button onClick={() => goBack(taskId)} className="btn-secondary">Go Back</button>
                    <button onClick={() => {quickUpdate.updateEndTime(taskId, selectedTime, timeOfDay); onClose()}} className="btn-primary">Done</button>
                </div>
            </div>
        </div>
    )
}
export default TimePickerModal;