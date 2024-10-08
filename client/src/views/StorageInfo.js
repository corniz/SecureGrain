import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { isLoggedIn } from "../classes/Auth"
import { Navigate, useParams, useNavigate, useOutletContext } from "react-router-dom";
import { AlertTypes } from "../styles/modules/AlertStyles";

export default () => {
    const [storageInfo, setStorageInfo] = useState(null);
    const [storageSectors, setStorageSectors] = useState([]);
    const [sectors, setSectors] = useState([]);

    const [editMode, setEditMode] = useState({ code: false, city: false, address: false });
    const [editedValues, setEditedValues] = useState({ city: '', address: '' });
    const [changesMade, setChangesMade] = useState(false);

    const { storageId } = useParams();
    const { setAlert } = useOutletContext();
    const navigate = useNavigate();
    /*
    const handleSubmitUpdate = () => {
        const accessToken = localStorage.getItem('accessToken');
    
        axios.post(`http://localhost:3333/storages/update/${storageId}`, {
          storageCity: editedCity,
          storageAddress: editedAddress,
        },
        {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
        }
        )
        .then(function (response) {
            setAlert({ text: 'Successfuly updated storage', type: AlertTypes.success })
            setTimeout(async ()=> { 
              navigate('/storages')
            }, 2000)
          })
        .catch(function (error) {
            setAlert({ text: `An error has occurred (${error.message})`, type: AlertTypes.error });
        }); 
    };
    */

    async function applySectorToWarehouse(sectorId, warehouseId) {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.patch(`http://localhost:3333/storages/${sectorId}/apply-warehouse`, {
          warehouseId
        }, {
          headers: {
            Authorization: `Bearer ${token}`
        }
        });
    
        console.log('Sector applied successfully:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error applying sector to warehouse:', error);
        throw error;
      }
    }

    const handleSectorClick = async (sectorId) => {
      try {
        const result = await applySectorToWarehouse(sectorId, storageId);
        alert('Sector successfully associated with warehouse!');
        window.location.reload();
      } catch (error) {
        alert('Failed to associate sector with warehouse');
      }
    };

    const handleDoubleClick = (field) => {
      setEditMode(prev => ({ ...prev, [field]: true }));
      setEditedValues(prev => ({ ...prev, [field]: storageInfo[field] }));
  };

  const handleChange = (field, value) => {
      setEditedValues(prev => ({ ...prev, [field]: value }));
      setChangesMade(true);
  };

  const handleDeleteSector = async (sectorId) => {
    if (window.confirm("Are you sure you want to delete this sector?")) {
      const token = localStorage.getItem('accessToken');
        try {
            await axios.patch(`http://localhost:3333/storages/${sectorId}/unapply-warehouse`, {}, {
              headers: { Authorization: `Bearer ${token}` }
            });
            setAlert({ text: 'Sector successfully unapploed', type: AlertTypes.success });
            setStorageInfo(prev => ({
                ...prev,
                sectors: prev.sectors.filter(sector => sector.id !== sectorId)
            }));
            window.location.reload();
        } catch (error) {
            console.error('Failed to delete sector:', error);
            setAlert({ text: `An error has occurred (${error.message})`, type: AlertTypes.error });
        }
    }
};

  const handleSubmitUpdate = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const newCity = editedValues.city !== "" ? editedValues.city : storageInfo.city;
      const newAddress = editedValues.address !== "" ? editedValues.address : storageInfo.address;
      try {
        axios.post(`http://localhost:3333/storages/update/${storageId}`, {
          storageCity: newCity,
          storageAddress: newAddress,
        },
        {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
        })
          setAlert({ text: 'Successfully updated storage', type: AlertTypes.success });
          setStorageInfo(prev => ({ ...prev, ...editedValues }));
          setEditMode({ code: false, city: false, address: false });
          setChangesMade(false);
          setTimeout(() => navigate('/storages'), 2000);
      } catch (error) {
          setAlert({ text: `An error has occurred (${error.message})`, type: AlertTypes.error });
      }
  };


    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        axios.get(`http://localhost:3333/storages/${storageId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
          .then(response => {
            setStorageInfo(response.data);
          })
          .catch(error => {
            console.error('Error fetching storage info:', error);
          });
    }, []);

    useEffect(() => {
      const token = localStorage.getItem('accessToken');
      axios.get(`http://localhost:3333/sectors/inactive`, {
          headers: {
              Authorization: `Bearer ${token}`
          }
      })
        .then(response => {
          setSectors(response.data);
        })
        .catch(error => {
          console.error('Error fetching storage info:', error);
        });
    }, []);

    return isLoggedIn() ? (
      <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto shadow-lg rounded-lg overflow-hidden">
              <div className="bg-customGreen px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-white">Storage Information</h3>
              </div>
              <div className="border-t border-gray-200">
                  <dl>
                      {['code', 'city', 'address'].map(field => (
                          <div key={field} className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                              <dt className="text-sm font-medium text-gray-500">{field.charAt(0).toUpperCase() + field.slice(1)}</dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                  {editMode[field] ? (
                                      <input type="text" value={editedValues[field]} onChange={(e) => handleChange(field, e.target.value)}
                                             className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
                                  ) : (
                                      <span onDoubleClick={() => handleDoubleClick(field)}>{storageInfo ? storageInfo[field] : 'Loading...'}</span>
                                  )}
                              </dd>
                          </div>
                      ))}
                  </dl>
              </div>
              {changesMade && (
                  <div className="flex justify-end p-4">
                      <button onClick={handleSubmitUpdate} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                          Apply Changes
                      </button>
                  </div>
              )}
              <div className="bg-white px-4 py-5">
                  <h4 className="text-lg font-medium text-gray-900">Sectors</h4>
                  <div className="mt-4">
                      <div className="border border-gray-200 rounded-lg">
                          <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                  <tr>
                                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Code
                                      </th>
                                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Taken Space
                                      </th>
                                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Max Space
                                      </th>
                                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Day Price
                                      </th>
                                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Is Working
                                      </th>
                                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Actions
                                      </th>
                                  </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                  {storageInfo?.sectors?.map((sector, index) => (
                                      <tr key={index}>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sector.code}</td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sector.taken_space}</td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sector.max_space}</td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sector.day_price.toFixed(2)}</td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sector.is_working ? 'Yes' : 'No'}</td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                              <button 
                                                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                                                  onClick={() => handleDeleteSector(sector.id)}>
                                                  Delete
                                              </button>
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  </div>
              </div>
              <div className="mt-10 px-4">
                  <h4 className="text-lg font-medium text-gray-900">Inactive Sectors</h4>
                  <ul className="mt-4 space-y-3">
                      {sectors.filter(sector => !sector.is_working).map((sector, index) => (
                          <li key={index} className="cursor-pointer p-3 border border-gray-300 rounded hover:bg-gray-100" onClick={() => handleSectorClick(sector.id)}>
                              {sector.code} - Click to associate
                          </li>
                      ))}
                  </ul>
                  <br/>
              </div>
          </div>
      </div>
  ) : (
      <Navigate to='/login' />
  );
}