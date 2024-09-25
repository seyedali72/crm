'use client'

import { editDepartment, getDepartments, getSingleDepartment } from "@/app/action/department.action"
import { Confirmation } from "@/app/components/Confirmation"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
interface IForm {
    name: string
    status: string
    parent: string
}
export default function DepartmentDetail() {
    const { id }: any = useParams()
    const [singleDepartment, setSingleDepartment] = useState<any>([])
    const [filter, setFilter] = useState('')
    const [departments, setDepartments] = useState([])
    const [editInfo, setEditInfo] = useState(false)
    const [change, setChange] = useState(false)
    const [mutated, setMutated] = useState(false)
    const router = useRouter()
    const fetchDepartmentsList = useCallback(async () => {
        let single = await getSingleDepartment(id)
        setSingleDepartment(single)
    }, [])
    const { handleSubmit, register, setValue } = useForm<IForm>({
        values: {
            name: singleDepartment.name,
            status: singleDepartment.status,
            parent: singleDepartment.parent?._id,
        }
    })
    const allDepartments = useCallback(async () => {
        let departments = await getDepartments({})
        setDepartments(departments)
    }, [])
    const handleEditDepartments = async (obj: any) => {
        let res = await editDepartment(singleDepartment?._id, obj)
        if (!res.error) {
            router.replace('/account/departments')
        }
    }
    useEffect(() => { fetchDepartmentsList(), allDepartments() }, [fetchDepartmentsList, mutated])
    const handleDelete = async (expertId: any) => {
        let filter = singleDepartment?.users?.filter((expert: any) => expert?._id !== expertId)
        singleDepartment.users = filter
        let res = await editDepartment(singleDepartment?._id, singleDepartment)
        if (!res.error) { setMutated(!mutated) }
    }
    if (singleDepartment?.length !== 0) {
        return (
            <>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item "><Link href="/account/">داشبورد</Link></li>
                        <li className="breadcrumb-item "><Link href="/account/departments"> لیست دپارتمان ها</Link></li>
                        <li className="breadcrumb-item active" aria-current="page"> {singleDepartment?.name}</li>
                    </ol>
                </nav>
                <section className="main-body-container rounded">
                    <form action="post" onSubmit={handleSubmit(handleEditDepartments)} method='Post'>
                        <section className="row">
                            <div className="col-12 col-md-6">
                                <label className='my-1' htmlFor="">عنوان دپارتمان </label>
                                <input disabled={!editInfo} type="text" className="form-control form-control-sm" {...register('name', { required: 'عنوان دپارتمان را وارد کنید', })} />
                            </div>
                            <div className="col-12 col-md-6">
                                <label className='my-1' htmlFor="">دپارتمان والد </label>
                                <select disabled={!editInfo} className="form-control form-control-sm" defaultValue={singleDepartment?.parent?._id} onChange={(e: any) => [setValue('parent', e.target.value), setChange(true)]}>
                                    {!change && <option value={singleDepartment?.parent?._id !== undefined ? singleDepartment?.parent?._id : ''}>{singleDepartment?.parent?.name !== undefined ? singleDepartment?.parent?.name : 'بدون والد'}</option>}
                                    {departments?.map((department: any, idx: number) => {
                                        if (department?._id !== singleDepartment?._id) {
                                            if (!change) {
                                                if (department?._id !== singleDepartment?.parent?._id) {
                                                    return (<option key={idx} value={department?._id}>{department?.name}</option>)
                                                }
                                            } else { return (<option key={idx} value={department?._id}>{department?.name}</option>) }
                                        }
                                    })}
                                </select>
                            </div>
                            <div className="col-12 my-2">
                                {editInfo && <button type='submit' className="btn btn-primary btn-sm">ثبت ویرایش</button>}
                            </div>
                        </section>
                    </form>
                    <div className="col-12 my-2">
                        {!editInfo && <button type="button" onClick={() => setEditInfo(!editInfo)} className="btn btn-primary btn-sm">درخواست ویرایش</button>}
                    </div>
                </section>

                {singleDepartment?.users.length !== 0 && <section className="main-body-container rounded">
                    <section className="d-flex justify-content-between align-items-center mt-1mb-3 border-bottom pb-3" >
                        <section className="main-body-title">
                            <h5 className="mb-0">لیست اعضا</h5>
                        </section>
                        <div className="col-md-6">
                            <input type="text" onChange={(e: any) => setFilter(e.target.value)} placeholder='فیلتر براساس نام دپارتمان ' className="form-control form-control-sm" />
                        </div>
                    </section>
                    <section className="table-responsive">
                        <table className="table table-hover table-striped">
                            <thead>
                                <tr>
                                    <th className="text-center">#</th>
                                    <th>نام عضو</th>
                                    <th>نام کاربری</th>
                                    <th>عنوان</th>
                                    <th>دسترسی</th>
                                    <th>تایپ</th>
                                    <th>وضعیت</th>
                                    <th className=" text-center">
                                        <i className="fa fa-cogs px-1"></i>تنظیمات
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {singleDepartment?.users.map((expert: any, idx: number) => {
                                    if (expert.employe_id.name.includes(filter)) {
                                        return (<tr key={idx}>
                                            <td>{idx + 1}</td>
                                            <td > {expert?.employe_id?.name} </td>
                                            <td>{expert.user_name}</td>
                                            <td>{expert.title}</td>
                                            <td>{expert.roles}</td>
                                            <td>{expert.type}</td>
                                            <td>{expert.status}</td>
                                            <td className="text-center">
                                                <Link href={`/account/expert/${expert?._id}`} className="btn btn-sm bg-custom-2 ms-1" ><i className="fa fa-edit px-1"></i>پرونده</Link>
                                                <Link href={`/account/expert/edit/${expert?._id}`} className="btn btn-sm bg-custom-4 ms-1" ><i className="fa fa-edit px-1"></i>ویرایش</Link>
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
                </section>}

            </>
        )
    } else { return (<p>درحال دریافت اطلاعات</p>) }
}