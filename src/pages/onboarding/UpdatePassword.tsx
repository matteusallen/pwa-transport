// @ts-nocheck
import { useState } from 'react'
import './scss/Onboarding.scss'
import Button from '@mui/base/Button'
import FormControl from '@mui/base/FormControl'
import Input from '@mui/base/Input'
import { IconEye, IconEyeClosed, IconX, IconCheck } from '@tabler/icons-react';
import { useMutation } from "@tanstack/react-query";
import api from '../../services/api'
import { Link, useNavigate } from 'react-router-dom'
import Spinner from '../../components/Loaders/Spinner'


export default function UpdatePassword() {
    const [resetError, setResetError] = useState({});
    const navigate = useNavigate();
    const mutation = useMutation({
        mutationFn: (values: any) => {
            delete values.showPassword;
            delete values.showConfirmPassword;
            return api.post('/api/user/update/password', values)
        },
        onError: (error, variables, context) => {
            if (error.response.data.status === 500) {
                return setResetError({
                    code: error.response.data.status,
                    message: "Issue with resetting your password. Please contact us at info@truckyu.com"
                })
            }
            
            return setResetError({
                code: error.response.data.errorCode,
                message: error.response.data.errorMessage
            })
        },
        onSuccess: (response, variables, context) => { 
            navigate('/login', {replace: true})
        }
    });
    
    const codeMutation = useMutation({
        mutationFn: (email: string) => {
            return api.post('/api/user/reset/password', {email, community: "truckyu"})
        },
        onError: (error, variables, context) => {
            if (error.response.data.status === 500) {
                return setResetError({
                    code: error.response.data.status,
                    message: "Issue with sending code. Please contact us at info@truckyu.com"
                })
            }
            
            return setResetError({
                code: error.response.data.errorCode,
                message: error.response.data.errorMessage
            })
        },
        onSuccess: (response, variables, context) => { 
            setSuccessMessage("An Email has been sent with PassCode")
            setShowPasscode(true)
            setResetError({})
        }
    });

    const handleSendCode = (e: any) => {
        e.preventDefault();
        return codeMutation.mutate(values.email);
    }

    const [showPasscode, setShowPasscode] = useState(false);
    const [successMessage, setSuccessMessage] = useState();
    const [values, setValues] = useState({
        email: '',
        confirmationCode: '',
        password: '',
        confirmPassword: '',
        showPassword: false,
        showConfirmPassword: false,
        community: "truckyu"
    });

    const pattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;

    const passCriteria = [
        {
            text: 'Password at least 8 characters',
            met: values.password.length > 8,
        },
        {
            text: 'Contains at least 1 number and at least 1 special character',
            met: pattern.test(values.password),
        },
        {
            text: 'Contains at least 1 lowercase letter and at least 1 uppercase letter',
            met: /[A-Z]/.test(values.password) && /[a-z]/.test(values.password),
        }
    ]
    
    // const onPassChange = (e: any) => {
    //     setPassValues({
    //       ...passValues,
    //         [e.target.name]: e.target.value
    //     })
    // }

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

    const handleClickShowConfirmPassword = (e: any) => {
        e.preventDefault();
        setValues({
          ...values,
          showConfirmPassword: !values.showConfirmPassword,
        });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();

        if (values.confirmPassword != values.password) return setResetError({message: "Password Should Match with Confirm Password"})
        
        return mutation.mutate(values);
    };

    return (
        <section className='auth__wrapper flex flex-col max-md:justify-end min-h-screen bg-contain bg-top md:bg-center md:bg-cover auth__bg'>
            <div className='auth__container w-full px-6 pt-10 pb-4'>
                <div className='container my-0 mx-auto'>
                    <h1 className='text-primary-400 text-2.5xl text-center font-bold mb-5'>Reset Password</h1>
                    {resetError && resetError.message && (
                        <div className='bg-rose-200 mt-2 py-1.5 px-1 rounded-md max-w-sm my-0 mx-auto'>
                            <p className='text-rose-900 text-sm'>{resetError.message}</p>
                        </div>
                    )}

                    {successMessage && (
                        <div className='bg-blue-200 mt-2 py-1.5 pl-1 rounded-md max-w-sm my-0 mx-auto'>
                            <p className='text-blue-900 text-sm'>{successMessage}</p>
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
                        
                        {!showPasscode && (
                            <>
                            <FormControl className="mt-3">
                                <Button className='bg-primary-400 w-full text-black flex justify-center' id="sendCodeBtn" onClick={handleSendCode
                                } type="button">{codeMutation.isLoading ? <Spinner /> : 'Send Code'}</Button>
                            </FormControl>
                            <Button onClick={() => setShowPasscode(true)} className='text-white border border-0.5 border-solid w-full mt-3'>I have a code</Button>
                            </>
                        )}

                        {showPasscode && (
                            <div>
                                <FormControl value={values.confirmationCode} required>
                                    <Input
                                        type="text"
                                        name="confirmationCode"
                                        id="confirmationCode"
                                        placeholder="Passcode"
                                        className="text-primary-400 auth__input w-full py-0.5 border-b border-solid border-0.5"
                                        onChange={onChange}
                                    />
                                </FormControl>
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
                                <FormControl className="mt-3" value={values.confirmPassword} required>
                                    <Input
                                        type={values.showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        placeholder="Confirm Password"
                                        className="text-primary-400 auth__input w-full py-0.5 border-b border-solid border-0.5 flex flex-row"
                                        onChange={onChange}
                                        endAdornment={
                                            <Button
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowConfirmPassword}
                                                className='mr-2 text-primary-400'
                                            >
                                                {values.showConfirmPassword ? <IconEyeClosed /> : <IconEye />}
                                            </Button>
                                        }
                                    />
                                </FormControl>
                                <FormControl className="mt-3">
                                    <Button className='bg-primary-400 w-full text-black flex justify-center' id="updateBtn" type="submit" disabled={passCriteria.some(cri => !cri.met) || values.password !== values.confirmPassword}>{mutation.isLoading ? <Spinner /> : 'Update'}</Button>
                                </FormControl>
                            </div>
                        )}

                    </form>
                    <div className='mt-3 text-center'>
                        <Link to='/login'>Back to login</Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

