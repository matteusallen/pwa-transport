import './Trucker.scss';
import survey from '../../assets/images/survey.svg';
import submittedSurvey from '../../assets/images/circles-plus-one.svg';
import success from '../../assets/images/magic-approval.svg';
import truckIco from '../../assets/images/truck-icon-gray.svg';
import Button from '@mui/base/Button';
import { useState, MouseEvent } from 'react';
import { FormControl } from '@mui/base';
import { IconHelpCircle, IconThumbDown, IconThumbUp } from '@tabler/icons-react'
import InfoSlider from '../onboarding/InfoSlider';
import { useMutation } from '@tanstack/react-query';
import Spinner from '../../components/Loaders/Spinner';
import api from '../../services/api';
import UserTopBar from '../../components/TopBar/UserTopBar';
import { useAuthState } from "../../contexts/AuthContext";

export default function Survey() {
    const { user } = useAuthState();
    const { dispatch } = useAuthState();
    const [submitted, setSubmitted] = useState(false);
    const [feeling, setFeeling] = useState('');
    const [reasons, setReasons] = useState([
        {
            id: 1,
            name: 'Respect',
            active: false,
            good: false
        },
        {
            id: 2,
            name: 'Communication',
            active: false,
            good: false
        },
        {
            id: 3,
            name: 'Breakdown',
            active: false,
            good: false
        },
        {
            id: 4,
            name: 'Dispatch Experience',
            active: false,
            good: false
        },
        {
            id: 5,
            name: 'Shipper Experience',
            active: false,
            good: false
        },
        {
            id: 6,
            name: 'Family',
            active: false,
            good: false
        },
        {
            id: 7,
            name: 'Money',
            active: false,
            good: false
        },
        {
            id: 8,
            name: 'Health',
            active: false,
            good: false
        },
        {
            id: 9,
            name: 'Delay',
            active: false,
            good: false
        },
    ]);
    const [error, setError] = useState({
        message: '',
        code: ''
    });
    const [delayReason, setDelayReason] = useState('');
    const [infoOpen, setInfoOpen] = useState(false);
    const mutation = useMutation({
        mutationFn: (reqBody: any) => api.post('/api/survey', reqBody),
        onError: (error: any) => {
            if (error?.response?.status === 500) {
                let message = error?.response?.data?.errorCode === "TU-1" ? error.response.data.errorMessage : "Issue with adding a user. Please contact us at info@truckyu.com";
                return setError({
                    code: error?.response?.data?.status,
                    message: message
                })
            }
            
            if (error?.response?.data?.status === 401 || error?.response?.data?.status === 403) {
                return setError({
                    code: error?.response?.data?.status,
                    message: error?.response?.data?.error
                })
            }

            setError({
                message: error?.data?.errorMessage,
                code: error.response.data.errorCode
            })
        },
        onSuccess: () => { 
            if (user) {
                dispatch({ type: 'UPDATE_USER', payload: {...user, rewards: (user?.rewards ? Number(user?.rewards) + 1 : 1).toString()}});
            }
            setError({
                message: '',
                code: ''
            });
            setSubmitted(true);
        }
    });
    
    let disableSubmit = !feeling.length || (reasons.filter(i => i.active).length > 0 && (reasons[8].active && delayReason.length < 1)) || reasons.filter(i => i.active).length < 1;
    
    const handleReasons = (e: MouseEvent<HTMLButtonElement, MouseEvent>, index: number) => {
        e.preventDefault();
        let newReasons = [...reasons];
        newReasons[index].active = !newReasons[index].active;
        newReasons[index].good = newReasons[index].active && feeling === 'good';
        setReasons(newReasons);
    }    

    const handleReasonChange = (event: any) => {        
        setDelayReason(event?.target?.value);
    };

    const handleSubmit = () => {
        let body = {
            goodReasons: reasons.filter(reason => reason.active && reason.good).map(reason => reason.name),
            badReasons: reasons.filter(reason => reason.active && !reason.good).map(reason => reason.name),
            delay: reasons[8].active && delayReason.length > 0 ? delayReason : null
        }
        
        return mutation.mutate(body);          
    }
    
    return (
        <>
            
            {infoOpen ? <InfoSlider close={() => setInfoOpen(false)} /> : (
                <>
                    {error && error.message?.length > 0 && (
                        <div className='bg-rose-200 py-1.5 px-1 sticky top-0 z-50'>
                            <p className='text-rose-900 text-sm'>{error.message}</p>
                        </div>
                    )}
                    <UserTopBar pageTitle={'Survey'} />
                    <section className='survey__wrapper flex flex-col h-screen'>
                        <div className='survey__banner bg-primary-400 flex justify-around py-2 px-2 items-center flex-none align-center'>
                                <img src={submitted ? submittedSurvey : survey} className='w-6' />
                                <p className='text-center px-2'>Please fill out this survey to earn your first set of points.</p>
                                <IconHelpCircle size="34" onClick={() => setInfoOpen(true)} />
                        </div>
                        <div className='flex-1 bg-gray-light py-4 survey__survey-wrapper px-3'>
                            <div className=' max-w-2xl my-0 mx-auto'>
                                {submitted ? (
                                    <div className='flex items-center flex-col'>
                                        <img src={success} style={{width: '107px'}} />
                                        <p className='max-w-lg text-center mt-5'>Thank you for submitting your survey results!  Please remember to come back in the morning and evening so that we can help provide awareness to the challenges all truckers are having!</p>
                                    </div>
                                ) : (
                                    <>
                                        <h3 className='font-semibold text-center'>Please share how you feel, the good and the bad?</h3>
                                        <div className='flex justify-between items-center my-3 w-60 mx-auto max-h-5.5 bg-disabledGray p-0.5 rounded-full'>
                                                <Button className={`flex flex-row px-3 ${feeling === 'good' && 'bg-green-600 text-white'}`} onClick={() => setFeeling('good')}><IconThumbUp size="24" className={`mr-1 ${feeling === 'good' && 'stroke-white'}`} />Good</Button>
                                                <Button className={`flex flex-row px-3 mt-0 ${feeling === 'bad' && 'bg-rose-600 text-white'}`} onClick={() => setFeeling('bad')}><IconThumbDown size="24" className={`mr-1.5 ${feeling === 'bad' && 'stroke-white'}`} />Bad </Button>
                                        </div>
                                        <h3 className='font-semibold text-center'>Select a reason:</h3>
                                        <div className='max-w-sm flex justify-center items-center flex-wrap my-0 mx-auto'>
                                            {reasons.map((reason, index) => (
                                                    <Button disabled={!feeling} key={reason.id} onClick={(e: any) => handleReasons(e, index)} className={`survey__reason border border-solid border-black inline py-1.5 px-1.5 mr-1 rounded-lg mt-2 ${reason.active && 'text-white'} ${reason.active &&reason.good && 'bg-green-600 border-green-600'} ${reason.active && !reason.good && 'bg-rose-600 border-rose-600'}`}>
                                                        {reason.name}
                                                    </Button>
                                            ))}
                                            
                                            {reasons[8].active && (
                                                <FormControl className='px-2 mt-7'>
                                                    <select
                                                        id="selectReason"
                                                        name="delayReason"
                                                        onChange={handleReasonChange}
                                                        className='w-full bg-transparent py-1.5 border-b border-solid border-black'
                                                    >
                                                        <option value={'time'}>Time for delay</option>
                                                        <option value={'1'}>1 Hour</option>
                                                        <option value={'2'}>2 Hours</option>
                                                        <option value={'3'}>3 Hours</option>
                                                        <option value={'4'}>4 Hours</option>
                                                        <option value={'5'}>5 Hours</option>
                                                        <option value={'6'}>6 Hours</option>
                                                        <option value={'7'}>7 Hours</option>
                                                        <option value={'8'}>8 Hours</option>
                                                        <option value={'9'}>9 Hours</option>
                                                        <option value={'10'}>10 Hours</option>
                                                        <option value={'11'}>11 Hours</option>
                                                        <option value={'12'}>12 Hours</option>
                                                    </select>
                                                </FormControl>
                                            )}
                                        </div>
                                        <div className='flex justify-center mt-7'>
                                            <Button className={`button-basic ${disableSubmit ? 'bg-disabledGray' : 'bg-primary-400'} w-full text-black flex justify-center`} id="submitFeeling" disabled={disableSubmit} onClick={handleSubmit}>
                                                {mutation.isLoading ? <Spinner /> : 'Submit'}
                                            </Button>
                                        </div>
                                    </>
                                )}
                                
                                <div className='flex justify-center mt-6'>
                                    <img src={truckIco} className=''></img>
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            )}
        </>
    )
}
