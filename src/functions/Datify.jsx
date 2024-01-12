import React from 'react'

export const datify = (mm_dd_yy) => {
        let twoDay = mm_dd_yy.slice(3, 5)
        let monthNum = mm_dd_yy.slice(0, 2)
        let year = mm_dd_yy.slice(8)
        let month = months[monthNum - 1]
        let day = twoDay.charAt(0) === "0" ? twoDay.slice(1) : twoDay;
        // Jan 6, 24
        return month + " " + day + ", " + year
}
