import React from "react";
import {ButtonCustom} from './FormRegisterStyled'
import './index.css'

export const Button = ({type, text, onClick}) => {
    return (
        <ButtonCustom type={type} onClick={onClick}>{text}</ButtonCustom>
    )
}