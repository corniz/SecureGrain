import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { isLoggedIn } from "../classes/Auth"
import { Navigate, useParams, useNavigate, useOutletContext } from "react-router-dom";
import { AlertTypes } from "../styles/modules/AlertStyles";

export default () => {
    const [storageCity, setStorageCity] = useState('');
    const [storageAddress, setStorageAddress] = useState('');

    const { setAlert } = useOutletContext();
    const navigate = useNavigate();

    const validate = () => {
        if (!storageCity || !storageAddress) {
          setAlert({ text: 'There are empty fields', type: AlertTypes.warning });
          return false;
        }
        return true;
      }

      const onCreatePressed = async () => {
        if(!validate()) return

        const accessToken = localStorage.getItem('accessToken');
    
        console.log('Sending request to API:', {
          url: 'http://localhost:3333/storages',
          method: 'POST',
            storageCity: storageCity,
            storageAddress: storageAddress  
      });
      
      console.log(localStorage.getItem('accessToken'))


        axios.post('http://localhost:3333/storages', {
          storageCity: storageCity,
          storageAddress: storageAddress,
        },
        {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
        }
        )
        .then(function (response) {
            setAlert({ text: 'Successfuly created new storage', type: AlertTypes.success })
            setTimeout(async ()=> { 
              navigate('/storages')
            }, 2000)
          })
        .catch(function (error) {
            setAlert({ text: `An error has occurred (${error.message})`, type: AlertTypes.error });
        }); 
    }

    return isLoggedIn() ? (
        <div>
            <div className="w-full">
   
   <div className="container sm:flex pt-12">
     <div className="w-3/6 sm:mx-8 mx-auto">
       <h1 className="text-2xl text-center font-medium">Create a new storage</h1>
       <hr className="my-6" />

       <div className="mb-3">
         <div className="text-base mb-2">Storage City</div>
         <input value={storageCity} onChange={(e) => setStorageCity(e.target.value)} type="text" placeholder="Storage city" className="w-full p-3 border-[1px] border-gray-400 rounded-lg hover:border-[#61E9B1]" />
       </div>

       <div className="mb-3">
         <div className="text-base mb-2">Storage Address</div>
         <input value={storageAddress} onChange={(e) => setStorageAddress(e.target.value)} type="text" placeholder="Storage address" className="w-full p-3 border-[1px] border-gray-400 rounded-lg hover:border-[#61E9B1]" />
       </div>

       <hr className="my-9 mt-9" />

       <button onClick={onCreatePressed} className="w-full mb-3 p-3 bg-[#61E9B1] border-[1px] border-[#61E9B1] rounded-lg hover:bg-[#4edba1]">
         <i className="fa-solid fa-bullseye"></i> Create a storage
       </button>
     </div>
     <div className="w-3/6 sm:mx-8 mx-auto">
       <h2 className="pb-3 pt-1 font-semibold text-xl">What are storages?</h2>
       <p>Storages are a place to keep your grain dry and warm.
       </p>
       <h2 className="pb-3 pt-6 font-semibold text-xl">What city should you choose?</h2>
       <p>The one where werehouse is located.
       </p>
       <h2 className="pb-3 pt-6 font-semibold text-xl">What address should you choose?</h2>
       <p>The one where warehouse is located in the city. Preferably full address.
       </p>
       <h2 className="pb-3 pt-6 font-semibold text-xl">Who can create new storages?</h2>
       <p>Only administrators of the system are allowed to create new storages.
       </p>
     </div>
   </div>
   </div>
        </div>
    ): (
        <Navigate to='/login' />
    );
}