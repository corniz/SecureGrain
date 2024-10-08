import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import moment from 'moment';

const DateRangeSelector = ({ sectorId, onDatesChange }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reservedDates, setReservedDates] = useState([]);

  useEffect(() => {
    const fetchReservedDates = async () => {
      try {
        const response = await axios.get(`http://localhost:3333/reservations/reserved-dates/${sectorId}`);
        setReservedDates(response.data);
      } catch (error) {
        console.error('Error fetching reserved dates:', error);
      }
    };

    fetchReservedDates();
  }, [sectorId]);

  const isDayBlocked = (date) => {
    if (!reservedDates.length) {
      return false;
    }
    const momentDate = moment(date);
    return reservedDates.some(reserved => {
      const start = moment(reserved.startDate);
      const end = moment(reserved.endDate);
      return momentDate.isBetween(start, end, 'day', '[]');
    });
  };

  return (
    <div className="mb-3">
      <div className="text-base mb-2">Date</div>
      <DatePicker
        selected={startDate}
        onChange={(dates) => {
          const [start, end] = dates;
          setStartDate(start);
          setEndDate(end);
          onDatesChange({ startDate: start, endDate: end });
        }}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        inline
        filterDate={(date) => !isDayBlocked(date)}
        className="w-full p-3 border-[1px] border-gray-400 rounded-lg bg-white"
      />
    </div>
  );
};

export default DateRangeSelector;