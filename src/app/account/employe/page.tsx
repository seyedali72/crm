'use client'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { deleteEmploye, getEmployes } from '../../action/employe.action'
import { toast } from 'react-toastify'
import { Confirmation } from '../../components/Confirmation'

export default function Home() {
  const [employeList, setEmployeList] = useState([])
  const [filter, setFilter] = useState('')
  const [mutated, setMutated] = useState(false)
  const fetchLeatList = useCallback(async () => {
    let employes = await getEmployes({isDeleted:false})
    setEmployeList(employes)
  }, [])

  useEffect(() => {
    fetchLeatList()
  }, [fetchLeatList, mutated])
  const handleDelete = async (expertId: any) => {
    let res = await deleteEmploye(expertId)
    if (!res.error) { setMutated(!mutated) }
  }
  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/account/">خانه</Link></li>
          <li className="breadcrumb-item active" aria-current="page">لیست کارمندان</li>
        </ol>
      </nav>
      <section className="main-body-container rounded">
        <section className="d-flex justify-content-between align-items-center mt-1  mb-3 border-bottom pb-3" >
          <div className="col-md-6">
            <input type="text" onChange={(e: any) => setFilter(e.target.value)} placeholder='فیلتر براساس نام یا شماره ملی ' className="form-control form-control-sm" />
          </div>
          <Link href="/account/employe/create" className="btn bg-success text-white btn-sm" >
            افزودن کارمند جدید
          </Link>
        </section>
        <section className="table-responsive">
          <table className="table table-hover table-striped">
            <thead>
              <tr>
                <th className="text-center">#</th>
                <th>نام کارمند</th>
                <th> واحد</th>
                <th>عنوان شغلی</th>
                <th> جنسیت</th>
                <th className=" text-center">
                  <i className="fa fa-cogs px-1"></i>تنظیمات
                </th>
              </tr>
            </thead>
            <tbody>
              {employeList.map((employe: any, idx: number) => {
                if (employe.name.includes(filter) || employe.national_code.includes(filter)) {
                  return (<tr key={idx}>
                    <td className="text-center">{idx + 1}</td>
                    <td>{employe.name}</td>
                    <td>{employe.department_id?.name}</td>
                    <td>{employe.skill}</td>
                    <td>{employe.gender}</td>
                    <td className="text-center">
                      <Link href={`/account/employe/${employe?._id}`} className="btn btn-sm bg-custom-2 ms-1" ><i className="fa fa-edit px-1"></i>پرونده</Link>
                      <Link href={`/account/employe/edit/${employe?._id}`} className="btn btn-sm bg-custom-4 ms-1" ><i className="fa fa-edit px-1"></i>ویرایش</Link>
                      <button type="button" className="btn btn-sm bg-custom-3 ms-1" onClick={() => toast(<Confirmation onDelete={() => handleDelete(employe?._id)} />, { autoClose: false, })}>
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
