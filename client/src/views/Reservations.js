import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from "react-router-dom";

export default () => {

    const [reservations, setReservations] = useState([]);
    const navigate = useNavigate();

    const getStatusBgColor = (status) => {
        switch (status) {
          case 'IN_USE':
            return 'bg-green-400';
          case 'WAITING':
            return 'bg-yellow-400';
          case 'CONFIRMED':
            return 'bg-green-800';
          case 'DENIED':
            return 'bg-red-600';
          case 'CANCELLED':
            return 'bg-gray-400';
          default:
            return '';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        axios.get('http://localhost:3333/reservations/my', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
          .then(response => {
            setReservations(response.data);
          })
          .catch(error => {
            console.error('Error fetching my reservations: ', error);
          });
    }, []);

    const handleCreateReservation = () => {
        navigate('/reservations/create');
    }

    return (
      <div className="p-4">
        <table className="min-w-full border-collapse block md:table">
          <thead className="block md:table-header-group">
            <tr className="border border-gray-300 block md:table-row absolute -top-full md:top-auto -left-full md:left-auto md:relative">
              <th className="bg-gray-400 p-2 text-gray-700 font-bold md:border md:border-gray-300 text-left block md:table-cell">#</th>
              <th className="bg-gray-400 p-2 text-gray-700 font-bold md:border md:border-gray-300 text-left block md:table-cell">State</th>
              <th className="bg-gray-400 p-2 text-gray-700 font-bold md:border md:border-gray-300 text-left block md:table-cell">From</th>
              <th className="bg-gray-400 p-2 text-gray-700 font-bold md:border md:border-gray-300 text-left block md:table-cell">To</th>
              <th className="bg-gray-400 p-2 text-gray-700 font-bold md:border md:border-gray-300 text-left block md:table-cell">Sector</th>
              <th className="bg-gray-400 p-2 text-gray-700 font-bold md:border md:border-gray-300 text-left block md:table-cell">Capacity</th>
              <th className="bg-gray-400 p-2 text-gray-700 font-bold md:border md:border-gray-300 text-left block md:table-cell"></th>
            </tr>
          </thead>
          <tbody className="block md:table-row-group">
          {reservations.map((reservation, index) => (
            <tr
                key={index}
                className={`border border-gray-300 block md:table-row ${getStatusBgColor(reservation.state)}`}
            >
                <td className="p-2 md:border md:border-gray-300 text-left block md:table-cell">
                {reservation.id}
                </td>
                <td className="p-2 md:border md:border-gray-300 text-left block md:table-cell">
                {reservation.state}
                </td>
                <td className="p-2 md:border md:border-gray-300 text-left block md:table-cell">
                {formatDate(reservation.start_date)}
                </td>
                <td className="p-2 md:border md:border-gray-300 text-left block md:table-cell">
                {formatDate(reservation.end_date)}
                </td>
                <td className="p-2 md:border md:border-gray-300 text-left block md:table-cell">
                {reservation.sector?.code}
                </td>
                <td className="p-2 md:border md:border-gray-300 text-left block md:table-cell">
                {reservation.sector ? `${reservation.sector.taken_space}/${reservation.sector.max_space}` : ''}
                </td>
                <td className="p-2 md:border md:border-gray-300 text-left block md:table-cell">
                <i className="fas fa-exclamation-circle"></i>
                </td>
            </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center mt-4">
            <button
            onClick={handleCreateReservation}
            className="bg-gradient-to-r from-green-400 via-teal-500 to-green-400 text-white font-bold py-2 px-4 rounded-full shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl"
            >
            Create New Reservation
            </button>
        </div>
      </div>
    );
};