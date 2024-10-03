'use client'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { Confirmation } from '../../components/Confirmation'
import { deleteClient, getClients } from '@/app/action/client.action'

export default function Home() {
    const [clientsList, setClientsList] = useState([])
    const [filter, setFilter] = useState('')
    const [mutated, setMutated] = useState(false)

    const fetchClientsList = useCallback(async () => {
        let clients = await getClients({})
        setClientsList(clients)
    }, [])

    useEffect(() => {
        fetchClientsList()
    }, [fetchClientsList, mutated])
    const handleDelete = async (clientId: any) => {
        let res = await deleteClient(clientId)
        if (!res.error) { setMutated(!mutated) }
    }
    console.log(clientsList)
    return (
        <>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item "><Link href="/account/">داشبورد</Link></li>
                    <li className="breadcrumb-item active" aria-current="page"> لیست کاربر ها </li>
                </ol>
            </nav>
            <section className="main-body-container rounded">
                <section className="d-flex justify-content-between align-items-center mt-1 mb-3 border-bottom pb-3" >
                    <div className="col-md-6">
                        <input type="text" onChange={(e: any) => setFilter(e.target.value)} placeholder='فیلتر براساس نام یا شماره ملی ' className="form-control form-control-sm" />
                    </div>
                    <Link href="/account/users/create" className="btn bg-success text-white btn-sm" >
                        افزودن کاربر جدید
                    </Link>
                </section>
                <section className="table-responsive">
                    <table className="table table-hover table-striped">
                        <thead>
                            <tr>
                                <th className="text-center">#</th>
                                <th>نام </th>
                                <th> شماره تماس</th>
                                <th>نام کاربری</th>
                                <th> نقش</th>
                                <th className="text-center">
                                    <i className="fa fa-cogs px-1"></i>تنظیمات
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientsList.map((client: any, idx: number) => {
                                if (client?.name.includes(filter) || client?.user_name?.includes(filter)) {
                                    return (<tr key={idx}>
                                        <td className="text-center">{idx + 1}</td>
                                        <td > {client?.name}</td>
                                        <td>{client.mobile_number}</td>
                                        <td>{client?.user_name}</td>
                                        <td>{client?.role == 2 ? 'مدیر' : 'ادمین'}</td>
                                        <td className="text-center">
                                            <Link href={`/account/users/edit/${client?._id}`} className="btn btn-sm bg-custom-4 ms-1" ><i className="fa fa-edit px-1"></i>ویرایش</Link>
                                            <button type="button" className="btn btn-sm bg-custom-3 ms-1" onClick={() => toast(<Confirmation onDelete={() => handleDelete(client?._id)} />, { autoClose: false, })}>
                                                <i className="fa fa-trash px-1"></i>حذف
                                            </button>
                                        </td>
                                    </tr>)
                                }
                            })}
                        </tbody>
                    </table>
                </section>
            </section>
        </>
    );
}
