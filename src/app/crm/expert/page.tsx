'use client'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { deleteExpert, getExperts } from '../../action/expert.action'
import { toast } from 'react-toastify'
import { Confirmation } from '../../components/Confirmation'

export default function Home() {
    const [expertsList, setExpertsList] = useState([])
    const [filter, setFilter] = useState('')
    const [mutated, setMutated] = useState(false)

    const fetchExpertsList = useCallback(async () => {
        let experts = await getExperts({ role: 4 })
        setExpertsList(experts)
    }, [])

    useEffect(() => {
        fetchExpertsList()
    }, [fetchExpertsList, mutated])
    const handleDelete = async (expertId: any) => {
        let res = await deleteExpert(expertId)
        if (!res.error) { setMutated(!mutated) }
    }
    return (
        <>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item "><Link href="/crm/">داشبورد</Link></li>
                    <li className="breadcrumb-item active" aria-current="page"> لیست کارشناس ها </li>
                </ol>
            </nav>
            <section className="main-body-container rounded">
                <section className="d-flex justify-content-between align-items-center mt-1 mb-3 border-bottom pb-3" >
                    <div className="col-md-6">
                        <input type="text" onChange={(e: any) => setFilter(e.target.value)} placeholder='فیلتر براساس نام یا شماره ملی ' className="form-control form-control-sm" />
                    </div>
                    <Link href="/crm/expert/create" className="btn bg-success text-white btn-sm" >
                        افزودن کارشناس جدید
                    </Link>
                </section>
                <section className="table-responsive">
                    <table className="table table-hover table-striped">
                        <thead>
                            <tr>
                                <th className="text-center">#</th>
                                <th>نام کارشناس</th>
                                <th> وضعیت</th>
                                <th>کد ملی</th>
                                <th> واحد</th>
                                <th> سرنخ ها</th>
                                <th> مشتریان</th>
                                <th className="text-center">
                                    <i className="fa fa-cogs px-1"></i>تنظیمات
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {expertsList.map((expert: any, idx: number) => {
                                if (expert?.employe_id?.name.includes(filter) || expert?.employe_id?.national_code.includes(filter)) {
                                    return (<tr key={idx}>
                                        <td className="text-center">{idx + 1}</td>
                                        <td > {expert?.employe_id?.name}</td>
                                        <td>{expert.status}</td>
                                        <td>{expert.employe_id?.national_code}</td>
                                        <td>{expert?.teams?.name}</td>
                                        <td>{expert?.leads?.length}</td>
                                        <td>{expert?.customers?.length}</td>
                                        <td className="text-center">
                                            <Link href={`/crm/expert/${expert?._id}`} className="btn btn-sm bg-custom-2  ms-1" ><i className="fa fa-book px-1"></i>پرونده</Link>
                                            <Link href={`/crm/expert/edit/${expert?._id}`} className="btn btn-sm bg-custom-4 ms-1" ><i className="fa fa-edit px-1"></i>ویرایش</Link>
                                            <button type="button" className="btn btn-sm bg-custom-3 ms-1" onClick={() => toast(<Confirmation onDelete={() => handleDelete(expert?._id)} />, { autoClose: false, })}>
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
