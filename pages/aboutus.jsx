import React from 'react'
import Image from 'next/image'
import { MdOutlineRocketLaunch } from "react-icons/md";
//ITERNAL IMPORT
import Style from "../styles/aboutus.module.css";
import {Brand} from '../components/componentsindex';
import images from '../img';
const founderArray = [
    {
        name: "lucas huynh",
        position : "Co-founder and chief excutive",
        images : images.co,
    },
    {
        name: "lucas huynh",
        position : "Co-founder and chief excutive",
        images : images.co,
    },
    {
        name: "lucas huynh",
        position : "Co-founder and chief excutive",
        images : images.co,
    },
]

const factArray = [
    {
        title: "10 milion",
        info : "Registered  users account"
    },
    {
        title: "10 milion",
        info : "Registered  users account"
    },{
        title: "10 milion",
        info : "Registered  users account"
    }
]
const aboutus = () => {
  return (
    <div className={Style.aboutus}>
        <div className={Style.aboutus_box}>
            <div className={Style.aboutus_box_hero}>
                <div className={Style.aboutus_box_hero_left}>
                    <h1>
                        <MdOutlineRocketLaunch/>
                        About us</h1>
                    <p>We 're imparial and indepenet , and every day we create distinctive,
                        content which inform , educate and entertain million of people in 
                    </p>
                </div>
                <div className={Style.aboutus_box_hero_right}>
                    <Image src={images.cartoon1}
                    />
                 </div>
            </div>
            <div className={Style.aboutus_box_hero_title}>
                <h2> Founder</h2>
                <p>We 're impartiaal and independent, and every day we create distince 
                    programes and content
                </p>
            </div>
        </div>
    </div>
  )
}

export default aboutus