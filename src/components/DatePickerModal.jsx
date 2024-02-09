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
                    <div className="flx-r font-jakarta gap-4">
                    <div onClick={() => { quickUpdate.updateEndDate(taskId, "clear"); onClose() }} className="hoverBottomLine-white white-text pointer">Clear Date</div>
                    <div onClick={() => { onClose() }} className="hoverBottomLine-white white-text pointer">Keep Date</div>
                    </div>
                </div>

                

            </div>
        </div>
    )
}
export default DatePickerModal;