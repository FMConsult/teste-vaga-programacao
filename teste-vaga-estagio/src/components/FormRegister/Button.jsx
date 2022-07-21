import React from "react";
import './index.css'

export const Button = ({type, text, onClick}) => {
    return (
        <button type={type} onClick={onClick}>{text}</button>
    )
}