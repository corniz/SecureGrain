import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { isLoggedIn } from "../classes/Auth"
import { Navigate, useNavigate } from "react-router-dom";

export default () => {
    const [storages, setStorages] = useState([]);
    const navigate = useNavigate();

    const getMapsUrl = (loc) => {
        return `https://www.google.com/maps/place/${loc}/`
      };

    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        console.log('Sending request to API:', {
            url: 'http://localhost:3333/storages',
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        console.log(localStorage.getItem('accessToken'))

        axios.get('http://localhost:3333/storages', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
          .then(response => {
            setStorages(response.data);
          })
          .catch(error => {
            console.error('Error fetching storages: ', error);
          });
    }, []);
    
    const handleInfo = async (storageId) => {
        navigate(`/storages/${storageId}`);
    }

    const handleNewStorage = () => {
        navigate('/storages/create');
    }

    const handleDelete = async (storageId) => {
        const accessToken = localStorage.getItem('accessToken');

        try {
          const response = await axios.delete(`http://localhost:3333/storages/${storageId}`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          });
          
          console.log(accessToken)
      
          if (response.status !== 200) {
            throw new Error('Failed to delete storage');
          }
      
          console.log('Storage deleted:', response.data);
          
          window.location.reload();
        } catch (error) {
          console.error('Error deleting storage:', error);
        }
      };

    return isLoggedIn() ? (
        <div>
            <div className="container pt-12">
                <div className="text-customGreen mb-6">
                    <h2 className="font-font-sans-apple-color-emoji text-center text-3xl">All storages in system</h2>
                </div>
                <div className="max-w-full overflow-x-auto">
                    <table className="table-fixed w-full border border-collapse border-gray-300">
                        <thead>
                            <tr>
                                <th className="w-1/5 text-center border border-gray-300">Code</th>
                                <th className="w-1/5 text-center border border-gray-300">City</th>
                                <th className="w-1/5 text-center border border-gray-300">Address</th>
                                <th className="w-1/5 text-center border border-gray-300">Info</th>
                                <th className="w-1/5 text-center border border-gray-300">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {storages.map((storage, index) => (
                                <tr key={index}>
                                    <td className="w-1/5 text-center border border-gray-300 break-words">{storage.code}</td>
                                    <td className="w-1/5 text-center border border-gray-300 break-words">{storage.city}</td>
                                    <td className="w-1/5 text-center border border-gray-300 break-words">
                                        <a href={getMapsUrl(storage.address + ', ' + storage.city)} target="_blank" rel="noopener noreferrer" className='text-[#74cfda]'>
                                            <i className="fa-solid fa-location-dot"></i> {storage.address}
                                        </a>
                                    </td>

                                    <td className="w-1/5 text-center border border-gray-300">
                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleInfo(storage.id)}>Info</button>
                                    </td>
                                    <td className="w-1/5 text-center border border-gray-300">
                                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleDelete(storage.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex flex-col items-center mt-10">
                    <p className='font-font-sans-apple-color-emoji text-customGreen text-2xl ml-2'>Create new storage</p>
                    <button type="button" className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 mt-5" onClick={handleNewStorage}>Add new storage</button>
                </div>
            </div>
        </div>
    ): (
        <Navigate to='/login' />
    );
}