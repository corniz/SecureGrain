import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { isLoggedIn } from "../classes/Auth"
import { Navigate, useNavigate } from "react-router-dom";

export default () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        axios.get('http://localhost:3333/user/all', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
          .then(response => {
            setUsers(response.data);
          })
          .catch(error => {
            console.error('Error fetching users: ', error);
          });
    }, []);
    
    const handleInfo = async (userId) => {
        navigate(`/user/${userId}`);
    }

    const handleDelete = async (userId) => {
        const accessToken = localStorage.getItem('accessToken');

        try {
          const response = await axios.delete(`http://localhost:3333/user/delete/${userId}`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          });
      
          if (response.status !== 200) {
            throw new Error('Failed to delete user');
          }
      
          console.log('User deleted:', response.data);
          
          window.location.reload();
        } catch (error) {
          console.error('Error deleting user:', error);
        }
      };

    return isLoggedIn() ? (
        <div>
            <div className="container pt-12">
                <div className="text-customGreen mb-6">
                    <h2 className="font-font-sans-apple-color-emoji text-center text-3xl">All users in system</h2>
                </div>
                <div className="max-w-full overflow-x-auto">
                    <table className="table-fixed w-full border border-collapse border-gray-300">
                        <thead>
                            <tr>
                                <th className="w-1/5 text-center border border-gray-300">First Name</th>
                                <th className="w-1/5 text-center border border-gray-300">Last Name</th>
                                <th className="w-1/5 text-center border border-gray-300">Email</th>
                                <th className="w-1/5 text-center border border-gray-300">Role</th>
                                <th className="w-1/5 text-center border border-gray-300">Info</th>
                                <th className="w-1/5 text-center border border-gray-300">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={index}>
                                    <td className="w-1/5 text-center border border-gray-300 break-words">{user.firstName}</td>
                                    <td className="w-1/5 text-center border border-gray-300 break-words">{user.lastName}</td>
                                    <td className="w-1/5 text-center border border-gray-300 break-words">{user.email}</td>
                                    <td className="w-1/5 text-center border border-gray-300 break-words">{user.role}</td>

                                    <td className="w-1/5 text-center border border-gray-300">
                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleInfo(user.id)}>Info</button>
                                    </td>
                                    <td className="w-1/5 text-center border border-gray-300">
                                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleDelete(user.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    ): (
        <Navigate to='/login' />
    );
}