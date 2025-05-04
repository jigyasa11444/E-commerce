import React from 'react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Loader from '../../component/Loader'
import { setCredientials } from '../../redux/features/auth/authSlice'
import { Link } from 'react-router-dom'
import { useProfileMutation } from '../../redux/api/apiUserSlice'

const Profile = () => {
    const [username, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassowrd] = useState("")

    const {userInfo} = useSelector(state => state.auth)

    const [updateProfile, {isloading: loadingUpdateProfile}] = useProfileMutation()

    useEffect(() => {
        setUserName(userInfo.username)
        setEmail(userInfo.email)
    }, [userInfo.email , userInfo.username])

    const dispatch = useDispatch()

    const submitHandler = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword){
            toast.error("Password do not match")
        } else {
            try {
                const res = await updateProfile({
                    _id: userInfo._id,
                    username,
                    email,
                    password,
                }).unwrap();
                dispatch(setCredientials({...res}));
                toast.success("Profile updated successfully")
                
            } catch (error) {
                toast.error(error?.data?.message || error.message)
            }
        }
    }
  return (
    <div className='container mx-auto p-4 mt-[10rem]'>
        <div className='flex justify-center align-center md-space-x-4'>
           <div className='md:w-1/4'>
           <h2 className='text-2xl font-semibold mb-4'>Update Profile</h2>
            

            <form onSubmit={submitHandler}>
                <div className='mb-3 '>
                <label className='block text-white mb-2'>Name</label>
                <input 
                 type='text'
                 placeholder='Enter name'
                 className=' form-input p-3 rounded-sm w-full  text-black'
                 value={username}
                 onChange={(e) => setUserName(e.target.value)}
                />
                </div>

                <div className='mb-3 '>
                <label className='block text-white mb-2'>Eamil</label>
                <input 
                 type='email'
                 placeholder='Enter email'
                 className=' form-input p-3 rounded-sm w-full  text-black'
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                />
                </div>

                <div className='mb-3 '>
                <label className='block text-white mb-2'>Password</label>
                <input 
                 type='password'
                 placeholder='Enter password'
                 className=' form-input p-3 rounded-sm w-full  text-black'
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                />
                </div>

                <div className='mb-3 '>
                <label className='block text-white mb-2'>Confirm Password</label>
                <input 
                 type='password'
                 placeholder='confirm password'
                 className=' form-input p-3 rounded-sm w-full  text-black'
                 value={confirmPassword}
                 onChange={(e) => setConfirmPassowrd(e.target.value)}
                />
                </div>

                <div className='flex justify-between'>
                    <button 
                    type='submit'
                    className='bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600'
                    >
                        Update
                    </button>

                    <Link to="/user-orders" className='bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-700'>
                      My Orders
                    </Link>
                </div>
            </form>

           </div>

           {loadingUpdateProfile && <Loader/>}
        </div>
      
    </div>
  )
}

export default Profile
