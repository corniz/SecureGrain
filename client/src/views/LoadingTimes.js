/* eslint-disable import/no-anonymous-default-export */
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate, useParams, useNavigate, useOutletContext } from "react-router-dom";
import { AlertTypes } from "../styles/modules/AlertStyles";

export default () => {
    const { setAlert } = useOutletContext();
    const navigate = useNavigate();

    const [loadingTimes, setLoadingTimes] = useState([]);
    const [sectors, setSectors] = useState([]);

    const [selectedDate, setSelectedDate] = useState('');

    const [loadingType, setLoadingType] = useState('');
    const [loadingTime, setLoadingTime] = useState();
    const [sectorId, setSectorId] = useState();


    const today = new Date();

    const handleLoadingTypeChange = (event) => {
        setLoadingType(event.target.value);
    };

    const handleLoadingTimeChange = (event) => {
        setLoadingTime(event.target.value);
    };

    const checkIfSlotIsOccupied = () => {
        const date = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
        
        axios.get(`http://localhost:3333/loadingtimes/get/${date}/${loadingTime}`)
        .then(response => {
            setAlert({ text: 'This loading time and day are already occupied.', type: AlertTypes.warning });
            return true;
        })
        .then(error => {
            return false;
        });
    

    };

    const validate = () => {
        if (!selectedDate || !loadingType || !loadingTime || !sectorId) {
            setAlert({ text: 'There are empty fields', type: AlertTypes.warning });
            return false;
        }
        return true;
    }

    const handleDelete = (loadingTimeId) => {
        if (window.confirm('Are you sure you want to delete this loading time?')) {
            const token = localStorage.getItem('accessToken');
            axios.delete(`http://localhost:3333/loadingtimes/delete/${loadingTimeId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(response => {
                setAlert({ text: 'Loading time deleted successfully', type: AlertTypes.success });
                setLoadingTimes(loadingTimes.filter(loadingTime => loadingTime.id !== loadingTimeId));
            })
            .catch(error => {
                setAlert({ text: `An error occurred: ${error.message}`, type: AlertTypes.error });
            });
        }
    };
    

    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        axios.get('http://localhost:3333/loadingtimes/all', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            setLoadingTimes(response.data);
        })
        .catch(error => {
            console.error('Error fetching loading times: ', error);
        });

        axios.get('http://localhost:3333/sectors/get/all', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            setSectors(response.data);
        })
        .catch(error => {
            console.error('Error fetching sectors: ', error);
        });
    }, []);

    const onCreatePressed = async () => {
        const date = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
        console.log("Values: ", date, loadingType, loadingTime, sectorId);

        if (!validate()) return;

        if (checkIfSlotIsOccupied()) return;

        const accessToken = localStorage.getItem('accessToken');

        axios.post('http://localhost:3333/loadingtimes/create', {
            date: date,
            time: loadingTime,
            type: loadingType,
            sectorId: sectorId
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then(function (response) {
            setAlert({ text: 'Successfully registered a new loading time', type: AlertTypes.success });
            // Reload the loading times data from the server
            axios.get('http://localhost:3333/loadingtimes/all', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            .then(response => {
                setLoadingTimes(response.data); // Update the loadingTimes state with new data
            })
            .catch(error => {
                console.error('Error fetching loading times: ', error);
            });
        })
        .catch(function (error) {
            setAlert({ text: `An error has occurred (${error.message})`, type: AlertTypes.error });
        }); 
    };


    return (
        <div className="p-4">
            <div className="text-customGreen mb-6">
                <h2 className="font-font-sans-apple-color-emoji text-center text-3xl">Register a new loading time</h2>
            </div>

            <div className="mb-4 flex">
                <div>
                    <label htmlFor="date" className="block text-gray-700">Date:</label>
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        dateFormat="yyyy-MM-dd"
                        className="border p-2"
                        placeholderText="Select loading date"
                        minDate={today}
                    />
                </div>

                <div className="ml-4">
                    <label htmlFor="loadingType" className="block text-gray-700">Loading Type:</label>
                    <select
                        id="loadingType"
                        value={loadingType}
                        onChange={handleLoadingTypeChange}
                        className="border p-2"
                    >
                        <option value="">Select loading type</option>
                        <option value="import">Import</option>
                        <option value="export">Export</option>
                    </select>
                </div>
                
                <div className="ml-4">
                    <label htmlFor="loadingTime" className="block text-gray-700">Loading Time:</label>
                    <select
                        id="loadingTime"
                        className="border p-2"
                        onChange={handleLoadingTimeChange}
                    >
                        <option value="">Select loading time</option>
                        <option value="8">08:00</option>
                        <option value="9">09:00</option>
                        <option value="10">10:00</option>
                        <option value="11">11:00</option>
                        <option value="13">13:00</option>
                        <option value="14">14:00</option>
                        <option value="15">15:00</option>
                        <option value="16">16:00</option>
                    </select>
                </div>
                <div className="ml-4">
                    <label htmlFor="sector" className="block text-gray-700">Sector:</label>
                    <select id="sector" className="border p-2" onChange={(event) => setSectorId(event.target.value)}> 
                        <option value="">Select sector</option>
                        {sectors.map((sector, index) => (
                            <option key={index} value={sector.id}>{sector.code}</option>
                        ))}
                    </select>
                </div>
                <div className="ml-4">
                    <button 
                        type="button"
                        class="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 mt-5"
                        onClick={onCreatePressed}
                        >
                        Add new storage
                    </button>
                </div>
            </div>

            <div className="text-customGreen mb-6">
                <h2 className="font-font-sans-apple-color-emoji text-center text-3xl">All loading times in system</h2>
            </div>

            <table className="min-w-full border-collapse block md:table">
                <thead className="block md:table-header-group">
                    <tr className="border border-gray-300 block md:table-row absolute -top-full md:top-auto -left-full md:left-auto md:relative">
                        <th className="bg-gray-400 p-2 text-gray-700 font-bold md:border md:border-gray-300 text-left block md:table-cell">#</th>
                        <th className="bg-gray-400 p-2 text-gray-700 font-bold md:border md:border-gray-300 text-left block md:table-cell">Date</th>
                        <th className="bg-gray-400 p-2 text-gray-700 font-bold md:border md:border-gray-300 text-left block md:table-cell">Time</th>
                        <th className="bg-gray-400 p-2 text-gray-700 font-bold md:border md:border-gray-300 text-left block md:table-cell">Type</th>
                        <th className="bg-gray-400 p-2 text-gray-700 font-bold md:border md:border-gray-300 text-left block md:table-cell">Sector</th>
                        <th className="bg-gray-400 p-2 text-gray-700 font-bold md:border md:border-gray-300 text-left block md:table-cell"></th>
                    </tr>
                </thead>
                <tbody>
                            {loadingTimes.map((loadingTime, index) => (
                                <tr key={index}>
                                    <td className="w-1/5 text-center border border-gray-300 break-words">{loadingTime.id}</td>
                                    <td className="w-1/5 text-center border border-gray-300 break-words">{loadingTime.date.split('T')}</td>
                                    <td className="w-1/5 text-center border border-gray-300 break-words">{loadingTime.time + ":00"}</td>
                                    <td className="w-1/5 text-center border border-gray-300 break-words">{loadingTime.type.charAt(0).toUpperCase() + loadingTime.type.slice(1)}</td>
                                    <td className="w-1/5 text-center border border-gray-300 break-words">{loadingTime.sector.code}</td>

                                    <td className="w-1/5 text-center border border-gray-300">
                                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleDelete(loadingTime.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
            </table>
        </div>
    );
};
