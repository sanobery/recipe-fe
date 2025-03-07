import React from "react"
import { Tooltip } from "@mui/material"

interface CustomToolTipProps {
    title: string,
    children: React.ReactNode
}

const CustomToolTip: React.FC<CustomToolTipProps> = ({ title, children }) => {
    return (
        <Tooltip title={title}>
            <span>{children}</span>
        </Tooltip>
    )
}

export default CustomToolTip
