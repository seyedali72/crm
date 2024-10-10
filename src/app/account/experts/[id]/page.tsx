'use client'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { editExpert, getSingleExpert } from '@/app/action/expert.action'
import { useParams } from 'next/navigation'
import { toast } from 'react-toastify'
import { Confirmation } from '@/app/components/Confirmation'

export default function ExpertDetail() {
    const { id }: any = useParams()
    const [singleExpert, setSingleExpert] = useState<any>([])
    const [mutated, setMutated] = useState(false)
    const [viewCustomer, setViewCustomer] = useState(false)
    const [filter, setFilter] = useState('')
    const fetchExpertList = useCallback(async () => {
        let experts = await getSingleExpert(id)
        setSingleExpert(experts)
    }, [])

    useEffect(() => {
        fetchExpertList()
    }, [fetchExpertList, mutated])
    const handleDeleteLead = async (leadId: any) => {
        let filter = singleExpert?.leads?.filter((lead: any) => lead?._id !== leadId)
        singleExpert.leads = filter
        let res = await editExpert(singleExpert?._id, singleExpert)
        if (!res.error) { setMutated(!mutated) }
    }
    const handleDeleteCustomer = async (customerId: any) => {
        let filter = singleExpert?.customers?.filter((customer: any) => customer?._id !== customerId)
        singleExpert.customers = filter
        let res = await editExpert(singleExpert?._id, singleExpert)
        if (!res.error) { setMutated(!mutated) }
    }

    return (
        <>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link href="/account/">خانه</Link></li>
                    <li className="breadcrumb-item"><Link href="/account/experts">لیست کارشناس ها</Link></li>
                    <li className="breadcrumb-item"><Link href={`/account/experts/edit/${singleExpert?._id}`}>کارشناس: {singleExpert?.employe_id?.name}</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">داشبورد</li>
                </ol>
            </nav>
            <section className="main-body-container rounded">
                <section className="d-flex justify-content-between align-items-center mt-1  mb-3 border-bottom pb-3" >
                    {viewCustomer ? <button type='button' onClick={() => setViewCustomer(!viewCustomer)} className="btn bg-primary text-white btn-sm" > نمایش لیست سرنخ ها </button>
                        : <button type='button' onClick={() => setViewCustomer(!viewCustomer)} className="btn bg-success text-white btn-sm" > نمایش لیست مشتریان </button>}
                    <div className="col-md-6">
                        <input type="text" onChange={(e: any) => setFilter(e.target.value)} placeholder='فیلتر براساس نام یا شماره موبایل ' className="form-control form-control-sm" />
                    </div>
                </section>
                {viewCustomer ?
                    <section className="table-responsive">
                        <table className="table table-hover table-striped">
                            <thead>
                                <tr>
                                    <th className="text-center">#</th>
                                    <th>نام و فامیلی</th>
                                    <th>وضعیت</th>
                                    <th>شماره موبایل</th>
                                    <th>تماس ها</th>
                                    <th className=" text-center"> <i className="fa fa-cogs px-1"></i>تنظیمات </th>
                                </tr>
                            </thead>
                            <tbody>
                                {singleExpert?.customers?.length > 0 &&
                                    singleExpert?.customers?.map((customer: any, idx: number) => {
                                        if (customer?.contactId?.name?.includes(filter) || customer?.contactId?.phone_number_1?.includes(filter)) {
                                            return (<tr key={idx}>
                                                <td>{idx + 1}</td>
                                                <td>{customer?.contactId?.name} </td>
                                                <td>{customer?.contactId?.status}</td>
                                                <td>{customer?.contactId?.phone_number_1}</td>
                                                <td>{customer?.call?.length}</td>
                                                <td className="  text-center">
                                                    <Link href={`/account/customers/${customer?._id}`} className="btn btn-sm bg-custom-4 ms-1" ><i className="fa fa-edit px-1"></i>پرونده</Link>
                                                    <button type="button" className="btn btn-sm bg-custom-3 ms-1" onClick={() => toast(<Confirmation onDelete={() => handleDeleteCustomer(customer?._id)} />, { autoClose: false, })}>
                                                        <i className="fa fa-trash px-1"></i>حذف
                                                    </button>
                                                </td>
                                            </tr>)
                                        }
                                    })}
                            </tbody>
                        </table>
                    </section>
                    : <section className="table-responsive">
                        <table className="table table-hover table-striped">
                            <thead>
                                <tr>
                                    <th className="text-center">#</th>
                                    <th>نام و فامیلی</th>
                                    <th>وضعیت</th>
                                    <th>شماره موبایل</th>
                                    <th>تماس ها</th>
                                    <th className=" text-center"> <i className="fa fa-cogs px-1"></i>تنظیمات </th>
                                </tr>
                            </thead>
                            <tbody>
                                {singleExpert?.leads?.length > 0 &&
                                    singleExpert?.leads?.map((lead: any, idx: number) => {
                                        if (lead?.contactId?.name?.includes(filter) || lead?.contactId?.phone_number_1?.includes(filter)) {
                                            return (<tr key={idx}>
                                                <td>{idx + 1}</td>
                                                <td>{lead?.contactId?.name} </td>
                                                <td>{lead?.contactId?.status}</td>
                                                <td>{lead?.contactId?.phone_number_1}</td>
                                                <td>{lead?.call?.length}</td>
                                                <td className="  text-center">
                                                    <Link href={`/account/leads/${lead?._id}`} className="btn btn-sm bg-custom-4 ms-1" ><i className="fa fa-edit px-1"></i>پرونده</Link>
                                                    <button type="button" className="btn btn-sm bg-custom-3 ms-1" onClick={() => toast(<Confirmation onDelete={() => handleDeleteLead(lead?._id)} />, { autoClose: false, })}>
                                                        <i className="fa fa-trash px-1"></i>حذف
                                                    </button>
                                                </td>
                                            </tr>)
                                        }
                                    })}

                            </tbody>
                        </table>
                    </section>}
            </section>
        </>
    );
}
