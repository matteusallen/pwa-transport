import './scss/Onboarding.scss'
import Button from '@mui/base/Button'
import { useNavigate } from 'react-router-dom'

export default function Onboard() {
    const navigate = useNavigate();

    return (
        <section className='auth__wrapper flex flex-col justify-center max-md:justify-end h-screen bg-contain bg-top md:bg-center md:bg-cover relative auth__bg'>
            <div className='auth__container w-full px-6 pt-10 pb-12'>
                <h1 className='text-primary-400 text-2.5xl text-center font-bold'>Destination | Better life</h1>
                <p className='text-white text-center mt-2'>Community of truckers and their families that help each other across the country</p>
                <div className='mt-10 flex justify-center'>
                    <Button className='button-basic border border-white border-solid text-white' id="loginBtn" onClick={() => navigate('/login')}>Login</Button>
                </div>
                <div>
                    <p className='text-xs text-center mt-4 text-white -mx-2'>By continuing, you agree to the Terms of Service & Privacy Policy</p>
                </div>
                </div>
        </section>
    )
}