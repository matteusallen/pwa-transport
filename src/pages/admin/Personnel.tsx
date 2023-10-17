import { Button } from "@mui/base";
import AdminLayout from "../../layouts/AdminLayout";
import UserTable from "../../components/Table/UserTable";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";
import { useEffect, useState } from "react";
import AddUserModal from "../../components/Modal/AddUserModal";
import { TableSkeleton } from "../../components/Skeletons/TableSkeleton";

export default function Personnel() {
    const [users, setUsers] = useState([]);
    const [userAdded, setUserAdded] = useState(false);
    const [open, setOpen] = useState(false);
    const [surveyResults, setSurveyResults] = useState()
    
    useEffect(() => {
        if (userAdded) {
            refetch();
        }
    }, [userAdded, setUserAdded]);
    
    useEffect(() => {
        api.get('/api/carrier/surveys/export').then(({data}) => {
            return setSurveyResults(data);
        }).catch(() => console.error('csv'));
    })

    const getUsers = async () => {
        const { data } = await api.get('/api/carrier/users');        
        await data.sort((e1: any, e2: any) => e1.firstName.toLowerCase().localeCompare(e2.firstName.toLowerCase()))
        await setUsers(data);
        return data;
    }

    const { status, error, refetch, fetchStatus} = useQuery({ 
        queryKey: ['users'], 
        queryFn: getUsers
    });

    if (error) {
        console.log(error);
    }

    return (
        <>
            <AdminLayout>
                <section className="carrier__table-header container flex flex-row justify-between items-start pb-1 border-b border-solid border-slate-300">
                    <div>
                        <h2 className="text-xl">User Management</h2>
                    </div>
                    <div>
                        {surveyResults && <a href={`data:text/csv;charset=utf-8,${escape(surveyResults)}`} download={"SurveyResults.csv"} className="text-xs underline mr-3">Download survey results</a>}
                        <Button className="bg-primary-400 py-1 px-4" onClick={() => setOpen(true)}>Add User</Button>
                    </div>
                </section>
                <section className="carrier__table container mt-2 text-sm relative">
                    {status === 'loading' || fetchStatus === 'fetching' ? <TableSkeleton /> : <UserTable users={users} setUsers={setUsers} />}
                </section>
            </AdminLayout>
            <AddUserModal open={open} setOpen={setOpen} setUserAdded={setUserAdded} />
        </>
    )
}