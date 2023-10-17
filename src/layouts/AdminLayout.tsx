import AdminTopBar from "../components/TopBar/AdminTopBar";
import './scss/AdminLayout.scss'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <AdminTopBar  />
            <main className="admin-layout_wrapper pt-5 px-2 md:px-5 flex flex-col items-center container my-0 mx-auto">
                {children}
            </main>
        </>
    )
}