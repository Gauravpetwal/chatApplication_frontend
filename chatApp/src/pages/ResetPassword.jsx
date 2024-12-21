import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ResetPassword = () =>{
    const notify = (message) => toast.error(message);
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const navigate = useNavigate()

    const handleResetPassword = async (data) =>{
        try{
        const otp= data.otp
        const newPassword = data.newPassword
        console.log(otp, newPassword)
        const response = await fetch (' http://localhost:3000/api/restPassword',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
                //'Content-Type':'application/json'
            },
            body:JSON.stringify({otp, newPassword})
        })
        const responseData = await response.json()
        if(!response.ok){
            console.log("failed to resent")
            return notify(responseData.message)
     
        }
        if(response.ok){
            alert('Password reset successfully go to the login page')
            navigate('/')
            console.log("reset")
        }

        }catch(error){
            return notify(responseData.message)
        }
    }

    const handleBack  = () =>{
        navigate('/')
    }
    return (
        <>
            <ToastContainer />
            <section className="bg-gray-50 dark:bg-gray-900 min-h-screen">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                        <img className="w-8 h-8 mr-2" src="../src/assets/logo.svg" alt="logo" />
                        let's chat    
                    </a>
                    <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
                        <h1 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Reset Your Password
                        </h1>
                        <p className="font-light text-gray-500 dark:text-gray-400">
                            Please enter your new password and the OTP sent to your email.
                        </p>
                        <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5" onSubmit={handleSubmit(handleResetPassword)}>
                            <div>
                                <label htmlFor="otp" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">OTP</label>
                                <input 
                                    type="text" 
                                    name="otp" 
                                    id="otp" 
                                    {...register('otp', { required: true })} 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    placeholder="Enter OTP" 
                                    required 
                                />
                            </div>
                            <div>
                                <label htmlFor="newPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New Password</label>
                                <input 
                                    type="password" 
                                    name="newPassword" 
                                    id="newPassword" 
                                    {...register('newPassword', { required: true })} 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    placeholder="New Password" 
                                    required 
                                />
                            </div>
                            <div className="flex justify-between">
                                <button type="button" className="w-1/2 text-gray-900 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600" onClick={handleBack}>
                                    Back
                                </button>
                                <button type="submit" className="w-1/2 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                    Reset Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}

export default ResetPassword
