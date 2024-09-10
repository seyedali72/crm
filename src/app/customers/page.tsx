'use client'

import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { getCustomers } from "../action/customer.action"

export default function CustomersList() {
    const [filter, setFilter] = useState('')
    const [customersList, setCustomersList] = useState([])
    const fetchCustomers = useCallback(async () => {
        let list = await getCustomers({})
        setCustomersList(list)
    }, [])
    useEffect(() => { fetchCustomers() }, [fetchCustomers])
    return (
        <div style={{ maxHeight: "80vh", overflowY: 'scroll', width: '70%', padding: 10 }}>
            <h2 style={{ width: '100%', textAlign: 'start' }}> لیست مشتریان</h2>

            <input type="text" onChange={(e: any) => setFilter(e.target.value)} style={{ display: 'block', width: '90%', margin: '10px 0', padding: '5px 15px' }} placeholder='براساس نام یا شماره موبایل فیلتر کنید' />
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>
                    <th>نام و فامیلی</th>
                    <th>وضعیت</th>
                    <th>شماره موبایل</th>
                    <th>تماس ها</th>
                    <th>کارشناس</th>
                </tr></thead>
                <tbody>
                    {customersList.map((customer: any, idx: number) => {
                        if (customer.name.includes(filter) || customer.mobile_number.includes(filter)) {
                            return (<tr key={idx}>
                                <td style={{ textAlign: 'start' }}> <Link href={`/customers/${customer?._id}`} >{customer.name}  </Link></td>
                                <td>{customer.status}</td>
                                <td>{customer.mobile_number}</td>
                                <td>{customer.call.length && customer.call.length}</td>
                                <td><Link href={`/expert/${customer?.expert?._id}`}>{customer?.expert?.user_id?.name}</Link></td>
                            </tr>)
                        }
                    })}
                </tbody>
            </table>
        </div>
    )
}