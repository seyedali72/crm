'use client'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { getCheckStatus, getContacts } from '../../action/contact.action'
import { useRouter } from 'next/navigation'
 
export default function Home() {
  const [contactList, setContactList] = useState([])
  const [filter, setFilter] = useState('')
  const router = useRouter()
   const fetchContactList = useCallback(async () => {
    let contacts = await getContacts({ isDeleted: false })
    setContactList(contacts)
  }, [])

  const checkStatus = async (id: any) => {
    toast.success('در حال پردازش')
    let res = await getCheckStatus(id)
    if (res.lead) {
      router.replace(`/account/leads/${res.lead}`)
    }
  }
  useEffect(() => {
    fetchContactList()
  }, [fetchContactList])

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/account/">خانه</Link></li>
          <li className="breadcrumb-item active" aria-current="page">لیست مخاطبان</li>
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
                <th>شماره تماس</th>
                <th>زمینه فعالیت</th>
                <th>شرکت</th>
                <th className=" text-center"> <i className="fa fa-cogs px-1"></i>تنظیمات </th>
              </tr>
            </thead>
            <tbody>
              {contactList.map((contact: any, idx: number) => {
                if (contact.name.includes(filter) || contact.phone_number_1.includes(filter)) {
                  return (<tr key={idx}>
                    <td className='text-center'>{idx + 1}</td>
                    <td >{contact.name} </td>
                    <td>{contact.status}</td>
                    <td>{contact.phone_number_1}</td>
                    <td>{contact.categoryId?.name}</td>
                    <td>{contact.companyId?.name}</td>
                    {contact?.converted ?
                      <td><button type="button" className="btn btn-sm bg-custom-2 ms-1" onClick={() => checkStatus(contact?._id)}> <i className="fa fa-refresh px-1"></i>جزئیات </button></td> :
                      'تبدیل نشده است'}
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
