'use client'

import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { getOpportunities } from "../../action/opportunity.action"
import { useUser } from "@/app/context/UserProvider"
import { spliteNumber } from "@/app/utils/helpers"

export default function OpportunitiesList() {
    const [filter, setFilter] = useState('')
    const { user } = useUser()
    const [opportunitiesList, setOpportunitiesList] = useState([])
    const fetchOpportunities = useCallback(async () => {
        if (user?._id !== undefined) {
            let list = await getOpportunities({ isDeleted: false })
            setOpportunitiesList(list)
        }
    }, [user])

    useEffect(() => { fetchOpportunities() }, [fetchOpportunities])

    return (
        < >
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link href="/account/">خانه</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">لیست فرصت های فروش</li>
                </ol>
            </nav>
            <section className="main-body-container rounded">
                <section className="d-flex justify-content-between align-items-center mt-1  mb-3 border-bottom pb-3" >
                    <div className="col-md-6">
                        <input type="text" onChange={(e: any) => setFilter(e.target.value)} placeholder='فیلتر براساس عنوان فرصت ' className="form-control form-control-sm" />
                    </div>
                </section>
                <section className="table-responsive">
                    <table className="table table-hover table-striped">
                        <thead>
                            <tr>
                                <th className="text-center">#</th>
                                <th>عنوان</th>
                                <th>مرحله</th>
                                <th>کارشناس</th>
                                <th>بودجه</th>
                                <th>درصد احتمال</th>
                                <th className="text-center"> <i className="fa fa-cogs px-1"></i>تنظیمات </th>
                            </tr>
                        </thead>
                        <tbody>
                            {opportunitiesList.map((opportunity: any, idx: number) => {
                                if (opportunity?.title.includes(filter)) {
                                    return (<tr key={idx}>
                                        <td>{idx + 1}</td>
                                        <td>{opportunity?.title}</td>
                                        <td>{opportunity?.stage}</td>
                                        <td><Link href={`/account/experts/${opportunity?.expert?._id}`}>{opportunity?.expert?.employe_id?.name}</Link></td>
                                        <td>{spliteNumber(opportunity?.amount)} تومان</td>
                                        <td>{opportunity?.probability}%</td>
                                        <td className="text-center">
                                            <Link href={`/account/opportunity/${opportunity?._id}`} className="btn btn-sm bg-custom-4 ms-1" ><i className="fa fa-edit px-1"></i>پرونده</Link>
                                            {/* <button type="button" className="btn btn-sm bg-custom-3 ms-1" onClick={() => toast(<Confirmation onDelete={() => handleDelete(opportunity?._id)} />, { autoClose: false, })}>
                                                <i className="fa fa-trash px-1"></i>حذف
                                            </button> */}
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