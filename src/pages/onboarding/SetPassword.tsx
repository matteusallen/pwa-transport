import { useState } from 'react'
import './scss/Onboarding.scss'
import Button from '@mui/base/Button'
import FormControl from '@mui/base/FormControl'
import Input from '@mui/base/Input'
import { IconEye,IconEyeClosed } from '@tabler/icons-react';
import { useMutation } from "@tanstack/react-query";
import Spinner from '../../components/Loaders/FullSpinner'
import { IconX, IconCheck } from '@tabler/icons-react';
import api from '../../services/api'
import TermsAndConditions from './TermsConditions'
import jwt_decode from "jwt-decode";
import { useAuthState } from "../../contexts/AuthContext";

export default function SetPassword({email}: {email: string}) {
    const { dispatch } = useAuthState();
    const [registerError, setRegisterError] = useState<{message: string, code: string}>({
        message: '',
        code: ''
    });
    const mutation = useMutation({
        mutationFn: (vars: any) => api.post(vars.path, {...vars.payload, community: import.meta.env.VITE_COMMUNITY}),
        onError: (error: any) => {
            setRegisterError({
                code: error.response.data.errorCode,
                message: error.response.data.errorMessage
            })
        },
        onSuccess: async ({data}) => { 
            const idToken: any = jwt_decode(data.idToken);
            const user = {
                email: idToken.email, 
                givenName: idToken.given_name, 
                familyName: idToken.family_name, 
                userId: idToken.sub, 
                role: idToken['cognito:groups'][0],
                rewards: ''
            };
            sessionStorage.setItem('ud', JSON.stringify(data));
            localStorage.setItem('user', JSON.stringify(user));
            const response = await api.get('/api/rewards');
            user.rewards = await response.data.rewards;
            await dispatch({ type: 'LOGIN', payload: user });  
        }
    });
    
    const [passValues, setPassValues] = useState({
        newPassword: '',
        confirmPassword: '',
        showNewPassword: false,
        showConfirmPassword: false
    });
    const pattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;

    const passCriteria = [
        {
            text: 'Password at least 8 characters',
            met: passValues.newPassword.length > 8,
        },
        {
            text: 'Contains at least 1 number and at least 1 special character',
            met: pattern.test(passValues.newPassword),
        },
        {
            text: 'Contains at least 1 lowercase letter and at least 1 uppercase letter',
            met: /[A-Z]/.test(passValues.newPassword) && /[a-z]/.test(passValues.newPassword),
        }
    ]
    
    const onPassChange = (e: any) => {
        setPassValues({
          ...passValues,
            [e.target.name]: e.target.value
        })
    }

    const handleClickShowNewPassword = (e: any) => {
        e.preventDefault();
        setPassValues({
          ...passValues,
          showNewPassword: !passValues.showNewPassword,
        });
    };

    const handleClickShowConfirmPassword = (e: any) => {
        e.preventDefault();
        setPassValues({
          ...passValues,
          showConfirmPassword: !passValues.showConfirmPassword,
        });
    };
    
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        let vars = {
            email,
            password: passValues.newPassword
        }
        await mutation.mutate({payload: vars, path: '/api/user/force/password'});
    };

    return (
        <section className='auth__wrapper flex flex-col h-screen bg-cover bg-black relative'>
            <div className='auth__container w-full px-6 pt-10 pb-12 flex flex-col mt-6'>
                <div className='container my-0 mx-auto max-w-sm'>
                    <h1 className='text-primary-400 text-2.5xl text-center font-bold mb-5'>Set Password</h1>
                    {registerError && registerError.message.length > 0 && (
                        <div className='bg-rose-200 mt-2 py-1.5 px-1 rounded-md'>
                            <p className='text-rose-900 text-sm'>{registerError?.message}</p>
                        </div>
                    )}
                    <form className="auth__form mt-2" onSubmit={handleSubmit}>
                        <FormControl className="auth__form-control mt-3 relative" value={passValues.newPassword} required>
                            <Input 
                                type={passValues.showNewPassword ? 'text' : 'password'}
                                name="newPassword" 
                                id="newPassword" 
                                placeholder="New Password" 
                                className="text-primary-400 auth__input w-full py-0.5 border-b border-solid border-0.5 flex flex-row"
                                onChange={onPassChange}
                                endAdornment={
                                    <Button
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowNewPassword}
                                        className='mr-2 text-primary-400'
                                    >
                                        {passValues.showNewPassword ? <IconEyeClosed /> : <IconEye />}
                                    </Button>
                                }
                            />
                            <div id="passCriteriaCheck" className='border border-gray-700 mt-2 p-1.5 text-sm rounded-lg'>
                                <ul>
                                    {passCriteria.map((criteria, index) => (
                                        <li key={index} className={`text-gray-light flex space-between ${index !== 0 && 'mt-3'}`}>
                                            {criteria.met ? <IconCheck className='mr-1 text-emerald-500' /> : <IconX className='mr-1 text-rose-700' />}
                                            <span>{criteria.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </FormControl>
                        <FormControl className="auth__form-control mt-3 relative" value={passValues.confirmPassword} required>
                            <Input 
                                type={passValues.showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword" 
                                id="confirmPassword" 
                                placeholder="Confirm Password" 
                                className="text-primary-400 auth__input w-full py-0.5 border-b border-solid border-0.5 flex flex-row"
                                onChange={onPassChange}
                                endAdornment={
                                    <Button
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowConfirmPassword}
                                        className='mr-2 text-primary-400'
                                    >
                                        {passValues.showConfirmPassword ? <IconEyeClosed /> : <IconEye />}
                                    </Button>
                                }
                            />
                        </FormControl>
                        <FormControl className="mt-3">
                            <Button className='bg-primary-400 w-full text-black' id="signupBtn" type="submit" disabled={passCriteria.some(cri => !cri.met) || passValues.newPassword !== passValues.confirmPassword}>Sign Up</Button>
                        </FormControl>
                    </form>
                </div>
                <div className='mt-10'>
                    <TermsAndConditions/>
                </div>
            </div>
            {mutation.isLoading && <Spinner />}
        </section>
    )
}
