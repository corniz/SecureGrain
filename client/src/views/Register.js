import { useOutletContext, Link, Navigate } from "react-router-dom";
import { useState } from 'react'
import { AlertTypes } from "../styles/modules/AlertStyles";
import axios from 'axios';
import { isLoggedIn } from "../classes/Auth";
import React from 'react';

export default () => {
  const { setAlert } = useOutletContext();

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rePassword, setRePassword] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  const validate = () => {
    if(!firstName || !lastName || !email || !password || !rePassword || !phoneNumber) {
      setAlert({ text: 'There are empty fields', type: AlertTypes.warning })
      return false
    }

    if(!email.match(/^\S+@\S+\.\S+$/)) {
      setAlert({ text: 'Invalid email address is provided', type: AlertTypes.warning })
      return false
    }

    if(password.length < 5) {
      setAlert({ text: 'Password must be atleast 5 characters', type: AlertTypes.warning })
      return false
    }

    if(password != rePassword) {
      setAlert({ text: 'Password do not match', type: AlertTypes.warning })
      return false
    }

    return true
  }

  const submit = () => {
    if(!validate()) return

    axios.post('http://localhost:3333/auth/signup', {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      rePassword: rePassword,
      phoneNumber: phoneNumber,
    })
      .then(function (response) {
        setAlert({ text: 'Successful registration', type: AlertTypes.success })
      })
      .catch(function (error) {
        console.log(error);
        if (error.response.status === 403) {
            if(error.response.data.message == "Email is already taken"){
              setAlert({ text: 'Email is already taken', type: AlertTypes.error });
            }
        } else {
            setAlert({ text: `An error has occurred (${error.message})`, type: AlertTypes.error });
        }
    });  
  }

  return (
    <div>
      <h1 className="text-2xl text-center font-medium">Registration</h1>
      <hr className="my-6" />

      <div className="mb-3">
        <div className="text-base mb-2">First name</div>
        <input value={firstName} onChange={(e) => setFirstName(e.target.value)} type="text" placeholder="First name" className="w-full p-3 border-[1px] border-gray-400 rounded-lg" />
      </div>

      <div className="mb-3">
        <div className="text-base mb-2">Last name</div>
        <input value={lastName} onChange={(e) => setLastName(e.target.value)} type="text" placeholder="Last name" className="w-full p-3 border-[1px] border-gray-400 rounded-lg" />
      </div>

      <div className="mb-3">
        <div className="text-base mb-2">Your email address</div>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder="Email address" className="w-full p-3 border-[1px] border-gray-400 rounded-lg" />
      </div>

      <div className="mb-3">
        <div className="text-base mb-2">Password</div>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="w-full p-3 border-[1px] border-gray-400 rounded-lg" />
      </div>

      <div className="mb-3">
        <div className="text-base mb-2">Repeat password</div>
        <input value={rePassword} onChange={(e) => setRePassword(e.target.value)} type="password" placeholder="Password" className="w-full p-3 border-[1px] border-gray-400 rounded-lg" />
      </div>

      <div className="mb-3">
        <div className="text-base mb-2">Phone number</div>
        <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} type="text" placeholder="Phone number" className="w-full p-3 border-[1px] border-gray-400 rounded-lg" />
      </div>

      <hr className="my-6" />

      <button onClick={submit} className="w-full mb-3 p-3 bg-[#61E9B1] border-[1px] border-[#61E9B1] rounded-lg hover:bg-[#4edba1]">
        <i className="fa-solid fa-key"></i> Create an account
      </button>

      <Link to="/login" className="block w-full mb-3 p-3 bg-white text-center border-[1px] border-gray-400 rounded-lg hover:bg-gray-100">
        <i className="fa-solid fa-user-plus"></i> Login
      </Link>
      
    </div>
  )
};
