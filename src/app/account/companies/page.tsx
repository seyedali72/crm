'use client'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { getCheckCompany, getCompanies } from '@/app/action/company.action'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [companyList, setCompanyList] = useState([])
  const [filter, setFilter] = useState('')
  const router = useRouter()
  const fetchLeatList = useCallback(async () => {
    let companies = await getCompanies({ isDeleted: false })
    setCompanyList(companies)
  }, [])

  useEffect(() => {
    fetchLeatList()
  }, [fetchLeatList])
  const checkStatus = async (id: any) => {
    toast.success('در حال پردازش')
    let res = await getCheckCompany(id)
    if (res?.lead !== undefined) {
      router.replace(`/account/leads/${res?.lead}`)
    }
  }
  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/account/">خانه</Link></li>
          <li className="breadcrumb-item active" aria-current="page">لیست شرکت ها</li>
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
                <th className=" text-center"> <i className="fa fa-cogs px-1"></i>تنظیمات </th>
              </tr>
            </thead>
            <tbody>
              {companyList.map((company: any, idx: number) => {
                if (company?.name?.includes(filter) || company?.phone_number_1?.includes(filter)) {
                  return (<tr key={idx}>
                    <td className='text-center'>{idx + 1}</td>
                    <td>{company.name}</td>
                    <td>{company.status}</td>
                    <td>{company.phone_number_1}</td>
                    <td className="  text-center">
                      {company?.converted ? <button type="button" className="btn btn-sm bg-custom-2 ms-1" onClick={() => checkStatus(company?._id)}> <i className="fa fa-refresh px-1"></i>جزئیات </button>
                        : 'تبدیل نشده است'}
                      {/* <button type="button" className="btn btn-sm bg-custom-3 ms-1" onClick={() => toast(<Confirmation onDelete={() => handleDelete(company?._id)} />, { autoClose: false, })}>
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
  );
}
