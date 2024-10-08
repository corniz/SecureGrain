import { isLoggedIn } from "../classes/Auth"
import { Navigate, Link } from "react-router-dom";

export default () => {

    return isLoggedIn() ? (
        <div>
            <div className="container pt-12">
                <div className="text-customGreen">
                    <h2 className="font-font-sans-apple-color-emoji text-center text-3xl">Your available services</h2>
                </div>
                <div className="grid grid-cols-2 items-end mt-5">
                    <div className="font-font-sans-apple-color-emoji text-center text-customGreen text-2xl mr-2">
                        <Link to="/storages">
                            <div className="h-full w-full rounded-xl mt-3 text-center pt-5 pb-5 bg-gray-50 border border-solid border-customGreen hover:bg-gray-100">
                                <p>View all storages</p>
                            </div>
                        </Link>
                    </div>
                    {/*<div className="font-font-sans-apple-color-emoji text-center text-customGreen text-2xl ml-2">
                        <Link to="/sectors">
                            <div className="h-full w-full rounded-xl mt-3 text-center pt-5 pb-5 bg-gray-50 border border-solid border-customGreen hover:bg-gray-100">
                                <p>View all sectors</p>
                            </div>
                        </Link>
                    </div>
                    <div className="font-font-sans-apple-color-emoji text-center text-customGreen text-2xl mr-2">
                        <Link to="/reservations">
                            <div className="h-full w-full rounded-xl mt-3 text-center pt-5 pb-5 bg-gray-50 border border-solid border-customGreen hover:bg-gray-100">
                                <p>View all reservations</p>
                            </div>
                        </Link>
                    </div>
                    <div className="font-font-sans-apple-color-emoji text-center text-customGreen text-2xl mr-2">
                        <Link to="/loadingtimes">
                            <div className="h-full w-full rounded-xl mt-3 text-center pt-5 pb-5 bg-gray-50 border border-solid border-customGreen hover:bg-gray-100">
                                <p>View all loading times</p>
                            </div>
                        </Link>
                    </div>*/}
                </div>
            </div>
        </div>

    ) : (
        <Navigate to='/login' />
    )
}