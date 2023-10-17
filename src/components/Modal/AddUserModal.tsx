// @ts-nocheck
import { IconX } from "@tabler/icons-react";
import './AddUserModal.scss'
import { useState, useCallback, useEffect } from "react";
import { Button, FormControl, Input } from "@mui/base";
import Spinner from "../Loaders/Spinner";
import api from "../../services/api";
import { useMutation } from "@tanstack/react-query";

export default function AddUserModal({open, setOpen, setUserAdded}: {open: boolean, setOpen: Function, setUserAdded: Function}) {
    const [values, setValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
        role: 'TRUCKER'
    });
    const [error, setError] = useState({});

    const onChange = (e: any) => {
        setValues({
          ...values,
            [e.target.name]: e.target.value
        })
    }

    const keyPress = useCallback(
        e => {
          if (e.key === 'Escape' && open) {
            setOpen(false);
            console.log('I pressed');
          }
        },
        [setOpen, open]
      );
    
      useEffect(
        () => {
          document.addEventListener('keydown', keyPress);
          return () => document.removeEventListener('keydown', keyPress);
        },
        [keyPress]
      );

    const mutation = useMutation({
        mutationFn: (values: any) => {          
            return api.post('/api/carrier/add-user', values);
        },
        onError: (error) => {
            if (error?.response?.status === 500) {
                let message = error?.response?.data?.errorCode === "TU-1" ? "User email already exists" : "Issue with adding a user. Please contact us at info@truckyu.com";
                return setError({
                    code: error?.response?.data?.status,
                    message: message
                })
            }
            
            if (error?.response?.data?.status === 401) {
                return setError({
                    code: error?.response?.data?.status,
                    message: "You are not authorized to add users."
                })
            }

            return setError({
                message: error?.data?.errorMessage
            })
        },
        onSuccess: () => { 
            setValues({
                firstName: '',
                lastName: '',
                email: '',
                role: 'TRUCKER'
            });
            setOpen(false);
            setUserAdded(true);
        }
    });

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        mutation.mutate(values)
    }

    return (
        <>
            {open ? (
                <div className="add-user__modal absolute top-0 z-10 h-screen w-screen flex items-center justify-center px-3">
                    <div className="add-user__modal--modal bg-white p-3">
                        <div className="flex flex-row justify-between">
                            <h2 className="text-xl">Add User</h2>
                            <IconX onClick={() => setOpen(false)} />
                        </div>
                        {Object.keys(error).length > 0 && (
                            <div className='bg-rose-200 mt-2 py-1.5 px-1 rounded-md'>
                                <p className='text-rose-900 text-sm'>{error?.message}</p>
                            </div>
                        )}
                        <form onSubmit={handleSubmit}>
                            <FormControl value={values.firstName} required className="mt-3 focus:border-primary-400">
                                <Input 
                                    type="text" 
                                    name="firstName" 
                                    placeholder="First Name"
                                    id="firstName"
                                    className="text-primary-400 auth__input w-full px-1.5 border border-solid border-0.5" 
                                    onChange={onChange}
                                />
                            </FormControl>
                            <FormControl value={values.lastName} required className="mt-3">
                                <Input 
                                    type="text" 
                                    name="lastName" 
                                    placeholder="Last Name"
                                    id="lastName"
                                    className="text-primary-400 auth__input w-full px-1.5 border border-solid border-0.5" 
                                    onChange={onChange}
                                />
                            </FormControl>
                            <FormControl value={values.email} required className="mt-3">
                                <Input 
                                    type="email" 
                                    placeholder="Email"
                                    name="email" 
                                    id="email"
                                    className="text-primary-400 auth__input w-full px-1.5 border border-solid border-0.5" 
                                    onChange={onChange}
                                />
                            </FormControl>
                            <FormControl value={values.role} className="mt-3">
                                <select
                                    id="role"
                                    name="role"
                                    onChange={onChange}
                                    className='w-full bg-transparent border py-1.5 px-1 border-solid border-black'
                                >
                                    <option value={'TRUCKER'}>Trucker</option>
                                    <option value={'DISPATCHER'}>Dispatcher</option>
                                    <option value={'FRIENDS_FAMILY'}>Friends or Family</option>
                                </select>
                            </FormControl>
                            <FormControl className="mt-3 flex justify-items-end">
                                <Button className='bg-primary-400 text-black flex justify-center w-24' id="signupBtn" type="submit">{mutation.isLoading ? <Spinner /> : 'Add User'}</Button>
                            </FormControl>
                        </form>
                    </div>
                </div>
            ) : null}    
        </>
    )
}