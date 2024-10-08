import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { isLoggedIn } from "../classes/Auth"
import { Navigate, useParams, useNavigate, useOutletContext } from "react-router-dom";
import { AlertTypes } from "../styles/modules/AlertStyles";
import DateRangeSelector from '../components/DateRangeSelector';

export default () => {
    const [storages, setStorages] = useState([]);
    const [selectedStorage, setSelectedStorage] = useState(null);
    const [sectors, setSectors] = useState([]);
    const [selectedSector, setSelectedSector] = useState(null);

    const [step, setStep] = useState(1);
    const [selectedDates, setSelectedDates] = useState({ startDate: null, endDate: null });

    const { setAlert } = useOutletContext();
    const navigate = useNavigate();

    const handleIncrementStep = () => {
      if(step === 1 && !selectedStorage){
        setAlert({ text: 'You did not select storage', type: AlertTypes.warning });
        return;
      }
      if(step === 2 && !selectedSector){
        setAlert({ text: 'You did not select sector', type: AlertTypes.warning });
        return;
      }
      setStep(step + 1);
    };

    const fetchSectors = (storage) => {
      const code = storage.code;
      const accessToken = localStorage.getItem('accessToken');
      
      axios.get(`http://localhost:3333/sectors/get/${code}`, {
          headers: {
              Authorization: `Bearer ${accessToken}`
          }
      })
        .then(response => {
          setSectors(response.data);
        })
        .catch(error => {
          console.error('Error fetching sectors: ', error);
        });
    };

    useEffect(() => {
      if (step === 2 && selectedStorage) {
        fetchSectors(selectedStorage);
      }
    }, [step, selectedStorage]);

    useEffect(() => {
      const token = localStorage.getItem('accessToken');

      axios.get('http://localhost:3333/storages/all', {
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
    
    const onCreatePressed = async () => {

      const accessToken = localStorage.getItem('accessToken');
  
      axios.post('http://localhost:3333/reservations/create', {
        sectorId: Number(selectedSector.id),
        startDate: selectedDates.startDate,
        endDate: selectedDates.endDate
      },
      {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
      }
      )
      .then(function (response) {
          setAlert({ text: 'Successfuly created new reservation', type: AlertTypes.success })
          setTimeout(async ()=> { 
            navigate('/reservations')
          }, 2000)
        })
      .catch(function (error) {
          setAlert({ text: `An error has occurred (${error.message})`, type: AlertTypes.error });
      }); 
  }
  

    switch(step){
      case 1:
        return(
          <div>
            <div className="w-full">
              <div className="container sm:flex pt-12">
                <div className="w-3/6 sm:mx-8 mx-auto">
                  <h1 className="text-2xl text-center font-medium">Please choose storage</h1>
                  <hr className="my-6" />
                  <div className="mb-3">
                    <div className="text-base mb-2">Storage</div>
                    <select
                      value={selectedStorage ? selectedStorage.code : ''}
                      onChange={(e) => {
                        const selectedCode = e.target.value;
                        const storage = storages.find(storage => storage.code === selectedCode);
                        setSelectedStorage(storage);
                      }}
                      className="w-full p-3 border-[1px] border-gray-400 rounded-lg hover:border-[#61E9B1] bg-white"
                    >
                      <option value="" disabled>Select storage</option>
                      {storages.map(storage => (
                        <option key={storage.code} value={storage.code}>
                          {storage.city} - {storage.address}
                        </option>
                      ))}
                    </select>
                  </div>
                  <hr className="my-9 mt-9" />

                  <button onClick={handleIncrementStep} className="w-full mb-3 p-3 bg-[#61E9B1] border-[1px] border-[#61E9B1] rounded-lg hover:bg-[#4edba1]">
                    <i className="fa-solid fa-bullseye"></i> Next step
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
      case 2:
            return(
              <div>
                <div className="w-full">
      
                  <div className="container sm:flex pt-12">
                    <div className="w-3/6 sm:mx-8 mx-auto">
                      <h1 className="text-2xl text-center font-medium">Please choose sector</h1>
                      <hr className="my-6" />
                      <div className="mb-3">
                        <div className="text-base mb-2">Sector</div>
                        <select
                          value={selectedSector ? selectedSector.code : ''}
                          onChange={(e) => {
                            const selectedCode = e.target.value;
                            const sector = sectors.find(sector => sector.code === selectedCode);
                            setSelectedSector(sector);
                          }}
                          className="w-full p-3 border-[1px] border-gray-400 rounded-lg hover:border-[#61E9B1] bg-white"
                        >
                          <option value="" disabled>Select sector</option>
                          {sectors.map(sector => (
                            <option key={sector.code} value={sector.code}>
                              Sector: {sector.code} Max space: {sector.max_space}t Day price: {sector.day_price}$
                            </option>
                          ))}
                        </select>
                      </div>
                      <hr className="my-9 mt-9" />

                      <button onClick={handleIncrementStep} className="w-full mb-3 p-3 bg-[#61E9B1] border-[1px] border-[#61E9B1] rounded-lg hover:bg-[#4edba1]">
                        <i className="fa-solid fa-bullseye"></i> Next step
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
      case 3:
        return(
          <div>
            <div className="w-full">
  
              <div className="container sm:flex pt-12">
                <div className="w-3/6 sm:mx-8 mx-auto">
                  <h1 className="text-2xl text-center font-medium">Please choose date</h1>
                  <hr className="my-6" />
                  <div className="mb-3">
                    <DateRangeSelector sectorId={selectedSector.id} onDatesChange={setSelectedDates} />
                  </div>
                  <hr className="my-9 mt-9" />

                  <button onClick={onCreatePressed} className="w-full mb-3 p-3 bg-[#61E9B1] border-[1px] border-[#61E9B1] rounded-lg hover:bg-[#4edba1]">
                    <i className="fa-solid fa-bullseye"></i> Create reservation
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