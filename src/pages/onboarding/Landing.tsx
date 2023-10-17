import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './scss/Onboarding.scss'
import logo from '../../assets/images/Truckyu.svg'

export default function Landing() {
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            navigate('/onboard')
        }, 3000)
    }, [])

    return (
        <>
            <section className="landing flex flex-col h-screen bg-contain bg-top md:bg-center md:bg-cover w-screen items-center justify-center">
                <img src={logo} className='w-60' />
                <h2 className='text-white text-lg mt-3'><span className='text-primary-400'>Destination</span> | Better Life</h2>
            </section>
        </>
    )
}