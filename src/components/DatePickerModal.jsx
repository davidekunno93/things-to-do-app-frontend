import React, { useEffect, useRef, useState } from 'react'
import ReactDatePicker from 'react-datepicker';

const DatePickerModal = ({ open, taskId, quickUpdate, endDate, onClose }) => {
    if (!open) return null
    const [selectedDate, setSelectedDate] = useState(endDate ? new Date(endDate) : null)


    const refDatePicker = useRef(null)
    useEffect(() => {
        window.addEventListener('click', closeOnClickOutside, true)
    }, [])
    const closeOnClickOutside = (e) => {
        if (refDatePicker.current && !refDatePicker.current.contains(e.target))
            onClose()
    }

    return (
        <div className="overlay">
            <div ref={refDatePicker} className="datepicker-modal">
                <div className="flx-c align-c">
                    <ReactDatePicker onChange={(date) => { setSelectedDate(date); quickUpdate.updateEndDate(taskId, date); onClose() }} selected={selectedDate} value={selectedDate} inline />
                    <div onClick={() => { quickUpdate.updateEndDate(taskId, "clear"); onClose() }} className="white-text pointer">Clear Date</div>
                </div>

                {/* <div className="flx-c align-c">
                    <select onChange={(e) => updateSelectedTime(e.target.value)} name="time-picker" id="timeInput" size={5} className='time-input-box-long' required>
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
                    <div className="white-text pointer">Clear Time</div>
                </div> */}

            </div>
        </div>
    )
}
export default DatePickerModal;