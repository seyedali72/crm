'use client'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { deleteContact, editContact, getCheckStatus, getContacts } from '../../action/contact.action'
import { toast } from 'react-toastify'
import { Confirmation } from '../../components/Confirmation'
import { createLead, editLead } from '../../action/lead.action'
import { useRouter } from 'next/navigation'
import { useUser } from '../../context/UserProvider'

export default function Home() {
  const [contactList, setContactList] = useState([])
  const [filter, setFilter] = useState('')
  const [mutated, setMutated] = useState(false)
  const router = useRouter()
  const { user } = useUser()
  const fetchContactList = useCallback(async () => {
    if (user?._id !== undefined) {
      let contacts = await getContacts({ isDeleted: false })
      setContactList(contacts)
    }
  }, [user])
  const convertToLead = async (obj: string) => {
    let body = { contactId: obj, expert: user?._id, assignedAt: Date.now() }
    let res = await createLead(body)
    if (!res?.error) {
      await editContact(obj, { converted: true })
      router.replace(`/crm/leads/${res?._id}`)
    } else { toast.error(res?.error) }
  }
  const checkStatus = async (id: any) => {
    toast.success('در حال پردازش')
    let res = await getCheckStatus(id)
    if (res.lead) {
      router.replace(`/crm/leads/${res.lead}`)
    }
  

  }
  useEffect(() => {
    fetchContactList()
  }, [fetchContactList, mutated])
  const handleDelete = async (contactId: any) => {
    let res = await deleteContact(contactId)
    if (!res.error) { setMutated(!mutated) }
  }
  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/crm/">خانه</Link></li>
          <li className="breadcrumb-item active" aria-current="page">لیست مخاطبان</li>
        </ol>
      </nav>
      <section className="main-body-container rounded">
        <section className="d-flex justify-content-between align-items-center mt-1  mb-3 border-bottom pb-3" >
          <div className="col-md-6">
            <input type="text" onChange={(e: any) => setFilter(e.target.value)} placeholder='فیلتر براساس نام یا شماره موبایل ' className="form-control form-control-sm" />
          </div>
          <Link href="/crm/contacts/create" className="btn bg-success text-white btn-sm" > افزودن مخاطب جدید </Link>
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
                      <td><button type="button" className="btn btn-sm bg-custom-2 ms-1" onClick={() => checkStatus(contact?._id)}> <i className="fa fa-refresh px-1"></i>جزئیات </button></td>
                      : contact?.creator !== user?._id ? <td> <Link href={`/crm/contacts/${contact?._id}`} className="btn btn-sm bg-custom-4 ms-1" ><i className="fa fa-eye px-1"></i> نمایش</Link></td>:
                       <td className="text-center">
                        <button type="button" className="btn btn-sm bg-custom-2 ms-1" onClick={() => convertToLead(contact?._id)}> <i className="fa fa-refresh px-1"></i>تبدیل به سرنخ </button>
                        <Link href={`/crm/contacts/${contact?._id}`} className="btn btn-sm bg-custom-4 ms-1" ><i className="fa fa-edit px-1"></i> ویرایش</Link>
                        <button type="button" className="btn btn-sm bg-custom-3 ms-1" onClick={() => toast(<Confirmation onDelete={() => handleDelete(contact?._id)} />, { autoClose: false, })}> <i className="fa fa-trash px-1"></i>حذف </button>
                      </td>}
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
