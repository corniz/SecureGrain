import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { isLoggedIn } from "../classes/Auth";
import { Navigate, useParams, useNavigate, useOutletContext } from "react-router-dom";
import { AlertTypes } from "../styles/modules/AlertStyles";

const UserInfo = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [warehouses, setWarehouses] = useState([]);
    const [selectedWarehouseId, setSelectedWarehouseId] = useState('');

    const [editMode, setEditMode] = useState({ firstName: false, lastName: false, email: false, role: false, phoneNumber: false, warehouseId: false });
    const [editedValues, setEditedValues] = useState({ firstName: '', lastName: '', email: '', role: '', phoneNumber: '', warehouseId: '' });
    const [changesMade, setChangesMade] = useState(false);

    const { userId } = useParams();
    const { setAlert } = useOutletContext();
    const navigate = useNavigate();

    const handleDoubleClick = (field) => {
        setEditMode(prev => ({ ...prev, [field]: true }));
        setEditedValues(prev => ({ ...prev, [field]: userInfo[field] }));
    };

    const handleChange = (field, value) => {
        setEditedValues(prev => ({ ...prev, [field]: value }));
        if (field === 'warehouseId') {
            setSelectedWarehouseId(value);
        }
        if (field === 'role') {
            // If the role is "Client" or "Admin", set warehouseId to null
            const warehouseId = (value === 'Client' || value === 'Admin') ? null : selectedWarehouseId;
            setSelectedWarehouseId(warehouseId);
        } else {
            // For other fields, update normally
            setEditedValues(prev => ({ ...prev, [field]: value }));
        }
        setChangesMade(true);
    };

    const handleSubmitUpdate = async () => {
        const accessToken = localStorage.getItem('accessToken');
        const updatedFields = {
            firstName: editedValues.firstName || userInfo.firstName,
            lastName: editedValues.lastName || userInfo.lastName,
            email: editedValues.email || userInfo.email,
            role: editedValues.role || userInfo.role,
            phoneNumber: editedValues.phoneNumber || userInfo.phoneNumber,
            warehouseId: selectedWarehouseId !== "" ? parseInt(selectedWarehouseId) : null,
        };
        
        try {
            await axios.patch(`http://localhost:3333/user/update/${userId}`, updatedFields, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setAlert({ text: 'Successfully updated user', type: AlertTypes.success });
            setUserInfo(prev => ({ ...prev, ...updatedFields }));
            setEditMode({ firstName: false, lastName: false, email: false, role: false, phoneNumber: false, warehouseId: false });
            setChangesMade(false);
            setTimeout(() => navigate('/users'), 2000);
        } catch (error) {
            setAlert({ text: `An error has occurred (${error.message})`, type: AlertTypes.error });
        }
    };
    
    
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        axios.get(`http://localhost:3333/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            setUserInfo(response.data);
            setSelectedWarehouseId(response.data.warehouseId || '');
        })
        .catch(error => {
            console.error('Error fetching user info:', error);
        });

        axios.get(`http://localhost:3333/storages/all`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            setWarehouses(response.data);
        })
        .catch(error => {
            console.error('Error fetching warehouses:', error);
        });
    }, [userId]);

    return isLoggedIn() ? (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto shadow-lg rounded-lg overflow-hidden">
                <div className="bg-customGreen px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-white">User Information</h3>
                </div>
                <div className="border-t border-gray-200">
                    <dl>
                        {['firstName', 'lastName', 'email', 'role', 'phoneNumber'].map(field => (
                            <div key={field} className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">{field.charAt(0).toUpperCase() + field.slice(1)}</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {editMode[field] ? (
                                        field === 'role' ? (
                                            <select
                                                value={editedValues[field]}
                                                onChange={(e) => handleChange(field, e.target.value)}
                                                className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                            >
                                                <option value="Manager">Manager</option>
                                                <option value="Client">Client</option>
                                            </select>
                                        ) : (
                                            <input
                                                type="text"
                                                value={editedValues[field]}
                                                onChange={(e) => handleChange(field, e.target.value)}
                                                className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                            />
                                        )
                                    ) : (
                                        <span onDoubleClick={() => handleDoubleClick(field)}>
                                            {userInfo ? userInfo[field] : 'Loading...'}
                                        </span>
                                    )}
                                </dd>
                            </div>
                        ))}
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Warehouse</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {editMode.warehouseId ? (
                                    <select
                                        value={selectedWarehouseId}
                                        onChange={(e) => handleChange('warehouseId', e.target.value)}
                                        className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="">No warehouse</option>
                                        {warehouses.map(warehouse => (
                                            <option key={warehouse.id} value={warehouse.id}>
                                                {warehouse.code}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <span onDoubleClick={() => handleDoubleClick('warehouseId')}>
                                        {userInfo && userInfo.warehouseId ? userInfo.warehouseId : 'No warehouse'}
                                    </span>
                                )}
                            </dd>
                        </div>
                    </dl>
                </div>
                {changesMade && (
                    <div className="flex justify-end p-4">
                        <button onClick={handleSubmitUpdate} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Apply Changes
                        </button>
                    </div>
                )}
            </div>
        </div>
    ) : <Navigate to="/login" />;
};

export default UserInfo;
