import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Navigate, useParams, useNavigate, useOutletContext } from "react-router-dom";
import { AlertTypes } from "../styles/modules/AlertStyles";

const API_BASE_URL = 'http://localhost:3333';

const api = {
    fetchSectors: () => {
      return axios.get(`${API_BASE_URL}/sectors`)
        .then(response => response.data);
    },
    createSector: (sectorData) => {
      return axios.post(`${API_BASE_URL}/sectors`, sectorData)
        .then(response => response.data);
    },
    deleteSector: (sectorId) => {
      return axios.delete(`${API_BASE_URL}/sectors/${sectorId}`)
        .then(response => response.data);
    }
};
  
function SectorManagement() {
    const [sectors, setSectors] = useState([]);
    const [newSectorSpace, setNewSectorSpace] = useState();
    const [selectedPrice, setSelectedPrice] = useState();
    const [step, setStep] = useState(1);

    const { setAlert } = useOutletContext();

    const validate = () => {
      if (!newSectorSpace || !selectedPrice) {
        setAlert({ text: 'There are empty fields', type: AlertTypes.warning });
        return false;
      }
      return true;
    }

    
    useEffect(() => {
      api.fetchSectors().then(setSectors);
    }, []);
    
  
    const handleCreateSector = () => {
      const parsedNewSectorSpace = parseInt(newSectorSpace, 10);
      const parsedSelectedPrice = parseFloat(selectedPrice, 10);
      const sectorData = { maxSpace: parsedNewSectorSpace, sectorPrice: parsedSelectedPrice };
      api.createSector(sectorData).then((createdSector) => {
        setSectors([...sectors, createdSector]);
        setNewSectorSpace();
        setSelectedPrice();
        alert('Sector created successfully');
        setStep(1);
      });
    };

    const handleIncrementStep = () => {
      setStep(step + 1);
    };
  
    const handleDeleteSector = (sectorId) => {
      if (window.confirm('Are you sure you want to delete this sector?')) {
        api.deleteSector(sectorId).then(() => {
          setSectors(sectors.filter((sector) => sector.id !== sectorId));
          alert('Sector deleted successfully');
        });
      }
    };
    
    switch(step){
      case 1:
        return(
          <div>
            <div className="container pt-12">
                <div className="text-customGreen mb-6">
                    <h2 className="font-font-sans-apple-color-emoji text-center text-3xl">All sectors in system</h2>
                </div>
                <div className="max-w-full overflow-x-auto">
                    <table className="table-fixed w-full border border-collapse border-gray-300">
                        <thead>
                            <tr>
                                <th className="w-1/5 text-center border border-gray-300">Code</th>
                                <th className="w-1/5 text-center border border-gray-300">Space occupied</th>
                                <th className="w-1/5 text-center border border-gray-300">Max space</th>
                                <th className="w-1/5 text-center border border-gray-300">Is working</th>
                                <th className="w-1/5 text-center border border-gray-300">Price</th>
                                <th className="w-1/5 text-center border border-gray-300">Info</th>
                                <th className="w-1/5 text-center border border-gray-300">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sectors?.map((sector, index) => (
                                <tr key={index}>
                                    <td className="w-1/5 text-center border border-gray-300 break-words">{sector.code}</td>
                                    <td className="w-1/5 text-center border border-gray-300 break-words">{sector.taken_space}</td>
                                    <td className="w-1/5 text-center border border-gray-300 break-words">
                                        {sector.max_space}
                                    </td>
                                    <td className="w-1/5 text-center border border-gray-300 break-words">
                                      {sector.is_working ? 'True' : 'False'}
                                    </td>
                                    <td className="w-1/5 text-center border border-gray-300 break-words">
                                        {sector.day_price}
                                    </td>
                                    <td className="w-1/5 text-center border border-gray-300">
                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Info</button>
                                    </td>
                                    <td className="w-1/5 text-center border border-gray-300">
                                        <button onClick={() => handleDeleteSector(sector.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex flex-col items-center mt-10">
                    <p className='font-font-sans-apple-color-emoji text-customGreen text-2xl ml-2'>Create new sector</p>
                    <button type="button" onClick={handleIncrementStep} className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 mt-5">Add new sector</button>
                </div>
            </div>
        </div>
      )
      case 2:
            return(
              <div>
            <div className="w-full">
   
   <div className="container sm:flex pt-12">
     <div className="w-3/6 sm:mx-8 mx-auto">
       <h1 className="text-2xl text-center font-medium">Create a new sector</h1>
       <hr className="my-6" />

       <div className="mb-3">
         <div className="text-base mb-2">Sector Space</div>
         <input value={newSectorSpace} onChange={(e) => setNewSectorSpace(e.target.value)} type="number" placeholder="Sector space in tons" className="w-full p-3 border-[1px] border-gray-400 rounded-lg hover:border-[#61E9B1]" />
       </div>

       <div className="mb-3">
       <div className="text-base mb-2">Sector Day Price</div>
         <input value={selectedPrice} onChange={(e) => setSelectedPrice(e.target.value)} type="number" placeholder="Sector day price" className="w-full p-3 border-[1px] border-gray-400 rounded-lg hover:border-[#61E9B1]" />
       </div>

       <hr className="my-9 mt-9" />

       <button onClick={handleCreateSector} className="w-full mb-3 p-3 bg-[#61E9B1] border-[1px] border-[#61E9B1] rounded-lg hover:bg-[#4edba1]">
         <i className="fa-solid fa-bullseye"></i> Create a sector
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
            )
 
  }
}
  
  export default SectorManagement;