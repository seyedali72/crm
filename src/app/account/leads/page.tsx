'use client'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { deleteLead, getLeads } from '../../action/lead.action'
import { toast } from 'react-toastify'
import { Confirmation } from '../../components/Confirmation'

export default function Home() {
  const [leadList, setLeadList] = useState([])
  const [filter, setFilter] = useState('')
  const [mutated, setMutated] = useState(false)
  const fetchLeadList = useCallback(async () => {
    let leads = await getLeads({ isDeleted: false })
    setLeadList(leads)
  }, [])

  useEffect(() => {
    fetchLeadList()
  }, [fetchLeadList, mutated])
  const handleDelete = async (leadId: any) => {
    let res = await deleteLead(leadId)
    if (!res.error) { setMutated(!mutated) }
  }

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/account/">خانه</Link></li>
          <li className="breadcrumb-item active" aria-current="page">لیست سرنخ ها</li>
        </ol>
      </nav>
      <section className="main-body-container rounded">
        <section className="d-flex justify-content-between align-items-center mt-1  mb-3 border-bottom pb-3" >
          <div className="col-md-6">
            <input type="text" onChange={(e: any) => setFilter(e.target.value)} placeholder='فیلتر براساس نام یا شماره موبایل ' className="form-control form-control-sm" />
          </div>
          <Link href="/account/contacts" className="btn bg-success text-white btn-sm" >
            افزودن سرنخ جدید
          </Link>
        </section>
        <section className="table-responsive">
          <table className="table table-hover table-striped">
            <thead>
              <tr>
                <th className="text-center">#</th>
                <th>نام و فامیلی</th>
                <th>وضعیت</th>
                <th>شماره تماس</th>
                <th>تماس ها</th>
                <th>کارشناس</th>
                <th className=" text-center"> <i className="fa fa-cogs px-1"></i>تنظیمات </th>
              </tr>
            </thead>
            <tbody>
              {leadList.map((lead: any, idx: number) => {
                if (lead.contactId.name.includes(filter) || lead.contactId.phone_number_1.includes(filter)) {
                  return (<tr key={idx}>
                    <td className='text-center'>{idx + 1}</td>
                    <td >{lead.contactId.name} </td>
                    <td>{lead.contactId.status}</td>
                    <td>{lead.contactId.phone_number_1}</td>
                    <td>{lead.call.length && lead.call.length}</td>
                    <td><Link href={`/account/expert/${lead?.expert?._id}`}>{lead?.expert?.employe_id?.name}</Link></td>
                    <td className="  text-center">
                      <Link href={`/account/leads/${lead?._id}`} className="btn btn-sm bg-custom-4 ms-1" ><i className="fa fa-edit px-1"></i>جزئیات</Link>
                      <button type="button" className="btn btn-sm bg-custom-3 ms-1" onClick={() => toast(<Confirmation onDelete={() => handleDelete(lead?._id)} />, { autoClose: false, })}>
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