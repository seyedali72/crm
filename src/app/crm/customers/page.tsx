'use client'

import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { deleteCustomer, getCustomers } from "../../action/customer.action"
import { toast } from "react-toastify"
import { Confirmation } from "../../components/Confirmation"
import { useUser } from "@/app/context/UserProvider"

export default function CustomersList() {
    const [filter, setFilter] = useState('')
    const { user } = useUser()
    const [mutated, setMutated] = useState(false)
    const [customersList, setCustomersList] = useState([])
    const fetchCustomers = useCallback(async () => {
        if (user?._id !== undefined) {
            let list = await getCustomers({ isDeleted: false })
            setCustomersList(list)
        }
    }, [user])
    useEffect(() => { fetchCustomers() }, [fetchCustomers, mutated])
    const handleDelete = async (customerId: any) => {
        let res = await deleteCustomer(customerId)
        if (!res.error) { setMutated(!mutated) }
    }

    return (
        < >
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link href="/crm/">خانه</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">لیست مشتریان</li>
                </ol>
            </nav>
            <section className="main-body-container rounded">
                <section className="d-flex justify-content-between align-items-center mt-1  mb-3 border-bottom pb-3" >
                    <div className="col-md-6">
                        <input type="text" onChange={(e: any) => setFilter(e.target.value)} placeholder='فیلتر براساس نام یا شماره موبایل ' className="form-control form-control-sm" />
                    </div>
                </section>
                <section className="table-responsive">
                    <table className="table table-hover table-striped">
                        <thead>
                            <tr>
                                <th className="text-center">#</th>
                                <th>نام و فامیلی</th>
                                <th>وضعیت</th>
                                <th>کارشناس</th>
                                <th>شماره تماس</th>
                                <th>تماس ها</th>
                                <th className="text-center"> <i className="fa fa-cogs px-1"></i>تنظیمات </th>
                            </tr>
                        </thead>
                        <tbody>
                            {customersList.map((customer: any, idx: number) => {
                                if (customer?.contactId?.name.includes(filter) || customer?.contactId?.phone_number_1.includes(filter)) {
                                    return (<tr key={idx}>
                                        <td>{idx + 1}</td>
                                        <td > {customer?.contactId?.name}   </td>
                                        <td>{customer?.contactId?.status}</td>
                                        <td>{customer?.expert?.employe_id?.name}</td>
                                        <td>{customer?.contactId?.phone_number_1}</td>
                                        <td>{customer.call.length && customer.call.length}</td>
                                        <td className="text-center">
                                            <Link href={`/crm/customers/${customer?._id}`} className="btn btn-sm bg-custom-4 ms-1" ><i className="fa fa-edit px-1"></i>پرونده</Link>
                                            <button type="button" className="btn btn-sm bg-custom-3 ms-1" onClick={() => toast(<Confirmation onDelete={() => handleDelete(customer?._id)} />, { autoClose: false, })}>
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
    )
}