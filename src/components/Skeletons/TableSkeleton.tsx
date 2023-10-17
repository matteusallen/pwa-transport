export function TableSkeleton() {
    return (
        <table className="w-full table-auto users-table_table">
                    <thead className="border-t border-b border-solid">
                        <tr>
                            <th className="py-2 px-3 bg-gray-200">
                                <div className="bg-gray-100 py-1 rounded-md animate-pulse" />
                            </th>
                            <th className="py-2 px-3 bg-gray-200">
                                <div className="bg-gray-100 py-1 rounded-md animate-pulse" />
                            </th>
                            <th className="py-2 px-3 bg-gray-200">
                                <div className="bg-gray-100 py-1 rounded-md animate-pulse" />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({length: 7}, (_, i) => 
                            <tr key={i}>
                                <td colSpan={3} className="py-2 px-3 bg-white">
                                    <div className="bg-gray-100 py-1 rounded-md animate-pulse" />
                                </td>
                            </tr>
                        )}                            
                    </tbody>
                </table>
    )
}