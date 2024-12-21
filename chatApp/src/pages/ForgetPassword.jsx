import { useForm } from "react-hook-form"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";


const ForgetPassword =  () =>{  
    const navigate = useNavigate ()
    const notify = (message) => toast.error(message);
   const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const haldlePassword= async (data) =>{
        try{
            const email = data.email
            const response = await fetch(' http://localhost:3000/api/forgetPassword',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({email})
            })
            const responseData = await response.json()
            if(!response.ok){
                return  notify(responseData.message);
            }
          navigate('/ResetPassword')
         
        }catch(error){
            return  notify(error);
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
            <a
              href="#"
              className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
            >
              <img
                className="w-8 h-8 mr-2"
                src="../src/assets/logo.svg"
                alt="logo"
              />
              let's chat
            </a>
            <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
              <h1 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Forgot your password?
              </h1>
              <p className="font-light text-gray-500 dark:text-gray-400">
                Don't fret! Just type in your email and we will send you a code
                to reset your password!
              </p>
              <form
                className="mt-4 space-y-4 lg:mt-5 md:space-y-5"
                onSubmit={handleSubmit(haldlePassword)}
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    {...register("email", { require: true })}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    required=""
                  />
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      aria-describedby="terms"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      required=""
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="terms"
                      className="font-light text-gray-500 dark:text-gray-300"
                    >
                      I accept the{" "}
                      <a
                        className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                        href="#"
                      >
                        Terms and Conditions
                      </a>
                    </label>
                  </div>
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    className="w-1/2 text-gray-900 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                    onClick={handleBack}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                   Next
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </>
    );
}

export default ForgetPassword