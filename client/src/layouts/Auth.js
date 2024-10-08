import { Outlet, Link } from "react-router-dom";
import { useState } from 'react'
import { AlertTypes } from "../styles/modules/AlertStyles";
import Alert from "../components/Alert";

export default () => {
  const [alert, setAlert] = useState({
    text: '',
    type: AlertTypes.info,
  })

  return (
    <div className="flex min-h-dvh p-5" style={{
      background: "url(https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/334c032a-ba05-4782-96f1-886690f6018d/dd29mju-3c5c2c16-5733-4155-9c32-0f6f2b92f864.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzMzNGMwMzJhLWJhMDUtNDc4Mi05NmYxLTg4NjY5MGY2MDE4ZFwvZGQyOW1qdS0zYzVjMmMxNi01NzMzLTQxNTUtOWMzMi0wZjZmMmI5MmY4NjQuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.nPqw65yXe30GbLbKRCucPAyl3cs0AiW8homeFKpnliQ)",
      backgroundSize: "cover",
    }}>

      <div className="m-auto sm:w-[26rem]">

        <Alert text={alert.text} type={alert.type} />

        <div className="mx-auto p-10 bg-white rounded] rounded-lg">
            <Outlet context={{ setAlert }} />
            <Link to="/" className="block text-center mt-3 text-blue-500 hover:text-blue-700">Back to home</Link>
        </div>
      </div>

    </div>
  );
}