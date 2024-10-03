'use client'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { deleteCompany, getCompanies } from '../../action/company.action'
import { toast } from 'react-toastify'
import { Confirmation } from '../../components/Confirmation'
import { useUser } from '@/app/context/UserProvider'

export default function Home() {
  const [companyList, setCompanyList] = useState([])
  const [filter, setFilter] = useState('')
  const { user } = useUser()
  const [mutated, setMutated] = useState(false)
  const fetchCompanyList = useCallback(async () => {
    if (user?._id !== undefined) {
      let companies = await getCompanies({ isDeleted: false, creator: user._id })
      setCompanyList(companies)
    }
  }, [user])

  useEffect(() => {
    fetchCompanyList()
  }, [fetchCompanyList, mutated])
  const handleDelete = async (companyId: any) => {
    let res = await deleteCompany(companyId)
    if (!res.error) { setMutated(!mutated) }
  }
  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/expert/">خانه</Link></li>
          <li className="breadcrumb-item active" aria-current="page">لیست شرکت ها</li>
        </ol>
      </nav>
      <section className="main-body-container rounded">
        <section className="d-flex justify-content-between align-items-center mt-1  mb-3 border-bottom pb-3" >
          <div className="col-md-6">
            <input type="text" onChange={(e: any) => setFilter(e.target.value)} placeholder='فیلتر براساس نام یا شماره موبایل ' className="form-control form-control-sm" />
          </div>
          <Link href="/expert/companies/create" className="btn bg-success text-white btn-sm" >
            افزودن شرکت جدید
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
                <th className=" text-center"> <i className="fa fa-cogs px-1"></i>تنظیمات </th>
              </tr>
            </thead>
            <tbody>
              {companyList.map((company: any, idx: number) => {
                if (company.name.includes(filter) || company.phone_number_1.includes(filter)) {
                  return (<tr key={idx}>
                    <td className='text-center'>{idx + 1}</td>
                    <td >{company.name} </td>
                    <td>{company.status}</td>
                    <td>{company.phone_number_1}</td>
                    <td className="  text-center">
                      <Link href={`/expert/companies/${company?._id}`} className="btn btn-sm bg-custom-4 ms-1" ><i className="fa fa-edit px-1"></i>جزئیات</Link>
                      <button type="button" className="btn btn-sm bg-custom-3 ms-1" onClick={() => toast(<Confirmation onDelete={() => handleDelete(company?._id)} />, { autoClose: false, })}>
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
