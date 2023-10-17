import { Input } from "@mui/base";
import { IconCaretDown, IconCaretUp, IconSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import './UserTable.scss'

type UserInfo = {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    authority: string;
    status: boolean;
    lastLogin: string;
}

type Users = Array<UserInfo>;

export default function UserTable({users, setUsers}: {users: Users, setUsers: Function}) {
    const [tableUsers, setTableUsers] = useState(users)
    const [nameSortAsc, setNameSortAsc] = useState(true);
    const [filtString, setFiltString] = useState('');
    
    const userFilter = (filtString: string) => {
        if (filtString.length > 0) {
            let newUsers = users.filter((user: any) => user.firstName.toLowerCase().includes(filtString) || user.lastName.toLowerCase().includes(filtString) || user.email.toLowerCase().includes(filtString) || user.authority.toLowerCase().includes(filtString))

            return setTableUsers(newUsers);
        } else if (filtString.length === 0) {
            return setTableUsers(users);
        }
    };

    const handlePress = (e: { key: string; }) => {
        if(e.key === 'Enter') { 
            userFilter(filtString)
        }
       }

    useEffect(() => {
        const newArr = nameSortAsc ? users.sort((e1, e2) =>
            e1.firstName.toLowerCase().localeCompare(e2.firstName.toLowerCase())
        ) : users.sort((e1, e2) =>
            e1.firstName.toLowerCase().localeCompare(e2.firstName.toLowerCase())
        ).reverse();

        setUsers(newArr);
    }, [users, tableUsers, nameSortAsc])
    
    return (
        <>
            <section className="carrier__table-search mt-2.5">
                <Input 
                    type="text"
                    name="search" 
                    id="search" 
                    placeholder="Search for user by name or email" 
                    className="text-primary-400 text-sm text-slate-800 w-full px-1.5 border border-solid border-0.5 border-slate-300 flex flex-row-reverse items-center"
                    onChange={(e) => setFiltString(e.target.value)}
                    onKeyDown={handlePress}
                    endAdornment={<IconSearch className="mr-1 w-2 stroke-slate-500" />}
                />
            </section>
            <section className="my-2 relative overflow-y-auto users-table__wrapper relative">
                <table className="w-full border-separate border-spacing-0 table-auto users-table_table">
                    <thead className="font-medium border-t border-b border-solid sticky top-0">
                        <tr>
                            <th onClick={() => setNameSortAsc(!nameSortAsc)} className="font-semibold flex flex-row items-center py-2 pl-3 bg-gray-highlight">Name {nameSortAsc ? <IconCaretDown className="w-2 fill-black" /> : <IconCaretUp className="w-2 fill-black" />}</th>
                            <th className="font-semibold bg-gray-highlight text-left">Role</th>
                            <th className="font-semibold bg-gray-highlight text-left">Status</th>
                            {/* <th className="font-semibold flex flex-row py-2 bg-gray-highlight">Last Login {loginSort === 'ascending' ? <IconCaretDown /> : loginSort?.length ?
                            <IconCaretUp /> : ''}</th> */}
                            {/* <th className="font-semibold bg-gray-highlight text-gray-highlight text-left">Edit</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {tableUsers && tableUsers?.map((user: UserInfo) => (
                            <tr key={user.userId} className="text-xs">
                                <td className="bg-white border-solid border-b pl-3 py-1.5 bg-transparent"><span>{user.firstName} {user.lastName}</span><br></br><a className="text-gray-darker underline bg-transparent" href={`mailto:${user.email}`}>{user.email}</a></td>
                                <td className="bg-white border-solid border-b bg-transparent">{user.authority}</td>
                                <td className={`bg-white border-solid border-b bg-transparent ${user.status ? 'text-emerald-400' : 'text-amber-200'}`}>{user.status ? 'Active' : 'Pending'}</td>
                                {/* <td className="bg-white border-solid border-b text-lg bg-transparent"><button>. . .</button></td> */}
                            </tr>
                        ))}
                        {!tableUsers.length && (
                            <tr className="bg-white h-96">
                                <td colSpan={4} className="bg-white w-full">
                                    <p className="text-center">No resuls to display</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>
        </>
        
    )
}