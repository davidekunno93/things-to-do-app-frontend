import React from 'react'
import { datify } from './Datify'

export const datifunc = (date) => {
    let formattedDate = format(date, "MM/dd/yyyy")
    return datify(formattedDate)
}
