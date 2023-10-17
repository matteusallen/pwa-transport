// @ts-nocheck
import jwt_decode from "jwt-decode";
import { useEffect, useState } from 'react'
import './scss/Onboarding.scss'
import Button from '@mui/base/Button'
import FormControl from '@mui/base/FormControl'
import Input from '@mui/base/Input'
import { IconEye,IconEyeClosed } from '@tabler/icons-react';
import { useMutation } from "@tanstack/react-query";
import api from '../../services/api'
import Spinner from '../../components/Loaders/Spinner'
import TermsAndConditions from './TermsConditions'
import { handleLogin, handleResendTempPass } from '../../services/auth'
import { useAuthState } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { SetPassword } from ".";

export default function Login() {
    const { dispatch } = useAuthState();
    const navigate = useNavigate();
    const [values, setValues] = useState({
        email: '',
        password: '',
        showPassword: false,
        community: "truckyu"
    });
    const [loginError, setLoginError] = useState({});
    const [setPass, setSetPass] = useState(false);
    const [resendPass, setResendTempPass] = useState(false);
    const mutation = useMutation({
        mutationFn: (values: any) => {
            delete values.showPassword;            
            return handleLogin(values);
        },
        onError: (error, variables, context) => {
            
            if (error.response.data.errorCode === 'TU-3') {
                return setLoginError({
                    code: error.response.data.status,
                    message: `${error.response.data.errorMessage}. Please reset your password.`
                })
            }
            
            if (error.response.data.errorCode === 'TU-2') {
                setResendTempPass(true)
            }

            if (error.response.data.status === 500) {
                return setLoginError({
                    code: error.response.data.status,
                    message: "Issue with resetting your password. Please contact us at info@truckyu.com"
                })
            }

            return setLoginError({
                code: error.response.data.errorCode,
                message: error.response.data.errorMessage
            })
        },
        onSuccess: async ({data}, variables, context) => { 
            const idToken = jwt_decode(data.idToken);
            const user = {
                email: idToken.email, 
                givenName: idToken.given_name, 
                familyName: idToken.family_name, 
                userId: idToken.sub, 
                role: idToken['cognito:groups'][0],
                rewards: ''
            };
            await sessionStorage.setItem('ud', JSON.stringify(data));
            const response = await api.get('/api/rewards');
            user.rewards = await response.data.rewards || '0';
            await localStorage.setItem('user', JSON.stringify(user));
            await dispatch({ type: 'LOGIN', payload: user });  
        }
    });
    const tempMutation = useMutation({
        mutationFn: (email: string) => {           
            return api.post('/api/user/reset/password', {email})
        },
        onError: (error, variables, context) => {
            if (error.response.data.status === 500) {
                return setResetError({
                    code: error.response.data.status,
                    message: "Issue with resetting your password. Please contact us at info@truckyu.com"
                })
            }

            return setLoginError({
                code: error.response.data.errorCode,
                message: error.response.data.errorMessage
            })
        },
        onSuccess: async ({data}, variables, context) => { 
            await console.log(data);
            await setResendTempPass(false);
        }
    });

    const onChange = (e: any) => {
        setValues({
          ...values,
            [e.target.name]: e.target.value
        })
    }

    const handleClickShowPassword = (e: any) => {
        e.preventDefault();
        setValues({
          ...values,
          showPassword: !values.showPassword,
        });
    };

    const handleResendPass = (e: any) => {
        return tempMutation.mutate(values.email);
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        return mutation.mutate(values)
    };

    if (setPass) { 
        return <SetPassword email={values.email} /> 
    }

    return (
        <section className='auth__wrapper flex flex-col max-md:justify-end min-h-screen bg-contain bg-top md:bg-center md:bg-cover auth__bg'>
            <div className='auth__container w-full px-6 pt-10 pb-4 md:mt-7'>
                <div className="container my-0 mx-auto">
                    <h1 className='text-primary-400 text-2.5xl text-center font-bold mb-5'>Sign In</h1>
                    {loginError && loginError.message && (
                        <div className='bg-rose-200 mt-2 py-1.5 px-1 rounded-md max-w-sm my-0 mx-auto'>
                            <p className='text-rose-900 text-sm'>{loginError.message}</p>
                        </div>
                    )}
                    <form className={`auth__form mt-2 max-w-sm my-0 mx-auto`} onSubmit={handleSubmit}>
                        <FormControl value={values.email} required>
                            <Input 
                                type="email"
                                name="email" 
                                id="email" 
                                placeholder="Email" 
                                className="text-primary-400 auth__input w-full py-0.5 border-b border-solid border-0.5" 
                                onChange={onChange}
                            />
                        </FormControl>
                        <FormControl className="mt-3" value={values.password} required>
                            <Input 
                                type={values.showPassword ? 'text' : 'password'}
                                name="password" 
                                id="password" 
                                placeholder="Password" 
                                className="text-primary-400 auth__input w-full py-0.5 border-b border-solid border-0.5 flex flex-row"
                                onChange={onChange}
                                endAdornment={
                                    <Button
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        className='mr-2 text-primary-400'
                                    >
                                        {values.showPassword ? <IconEyeClosed /> : <IconEye />}
                                    </Button>
                                }
                            />
                        </FormControl>
                        <FormControl className="mt-3 flex items-center flex-col">
                            <Button className='button-basic bg-primary-400 text-black flex justify-center' id="signupBtn" type="submit">{mutation.isLoading ? <Spinner /> : 'Login'}</Button>
                            {resendPass && <Button type="button" className='button-basic border border-white block border-solid text-white mt-3 mx-auto' onClick={handleResendPass}>{tempMutation.isLoading ? <Spinner /> : 'Resend Password'}</Button>}
                        </FormControl>
                    </form>
                    <p className='text-xs text-center mt-3'><Link to='/reset-password'>Reset Password?</Link></p>
                    <div className='mt-4'>
                        <TermsAndConditions/>
                    </div>
                </div>
            </div>
        </section>
    )
}

