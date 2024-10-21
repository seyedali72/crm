'use client'
interface IForm {
    name: string;
    parent: string;
}
import { useForm } from "react-hook-form"
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { Confirmation } from "../../components/Confirmation";
import { createDepartment, deleteDepartment, getDepartments } from "../../action/department.action";

export default function Departments() {
    const [mutated, setMutated] = useState(false)
    const [filter, setFilter] = useState('')
    const [departments, setDepartments] = useState([])
    const { register, handleSubmit, reset, setValue } = useForm<IForm>()
    const handleCreateDepartment = async (obj: any) => {
        let res = await createDepartment(obj)
        if (!res.error) {
            setMutated(!mutated)
            reset()
        }
    }
    const allDepartments = useCallback(async () => {
        let departments = await getDepartments({})
        setDepartments(departments)
    }, [])
    useEffect(() => {
        allDepartments()
    }, [mutated, allDepartments])
    const handleDelete = async (departmentId: any) => {
        let res = await deleteDepartment(departmentId)
        if (!res.error) { setMutated(!mutated) }
    }
    return (
        <>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item "><Link href="/account/">داشبورد</Link></li>
                    <li className="breadcrumb-item active" aria-current="page"> لیست دپارتمان ها</li>
                </ol>
            </nav>
            <section className="main-body-container rounded">
                <form action="post" onSubmit={handleSubmit(handleCreateDepartment)} method='Post'>
                    <section className="row">
                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">عنوان دپارتمان </label>
                            <input type="text" placeholder="عنوان دپارتمان" className="form-control form-control-sm" {...register('name', { required: 'عنوان دپارتمان را وارد کنید', })} />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className='my-1' htmlFor="">دپارتمان والد </label>
                            <select className="form-control form-control-sm" onChange={(e: any) => setValue('parent', e.target.value)}><option value='' hidden>یک دپارتمان را انتخاب کنید</option>
                                {departments?.map((department: any, idx: number) => { return (<option key={idx} value={department?._id}>{department?.name}</option>) })}
                            </select>
                        </div>
                        <div className="col-12 my-2">
                            <button type='submit' className="btn btn-primary btn-sm">ثبت</button>
                        </div>
                    </section>
                </form>
            </section>

            <section className="main-body-container rounded">
                <section className="d-flex justify-content-between align-items-center mt-1mb-3 border-bottom pb-3" >
                    <section className="main-body-title">
                        <h5 className="mb-0">لیست دپارتمان ها</h5>
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
                                <th>نام دپارتمان</th>
                                <th>دپارتمان والد</th>
                                <th>تعداد اعضا</th>
                                <th>وضعیت</th>
                                <th className=" text-center">
                                    <i className="fa fa-cogs px-1"></i>تنظیمات
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {departments.map((department: any, idx: number) => {
                                if (department.name.includes(filter)) {
                                    return (<tr key={idx}>
                                        <td className="text-center">{idx + 1}</td>
                                        <td > {department.name}</td>
                                        <td>{department?.parent !== undefined ? department?.parent?.name : '---'}</td>
                                        <td>{department.users?.length}</td>
                                        <td>{department.status}</td>
                                        <td className="text-center">
                                            <Link href={`/account/departments/${department?._id}`} className="btn btn-sm bg-custom-4 ms-1" ><i className="fa fa-edit px-1"></i>جزئیات</Link>
                                            <button type="button" className="btn btn-sm bg-custom-3 ms-1" onClick={() => toast(<Confirmation onDelete={() => handleDelete(department?._id)} />, { autoClose: false, })}>
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
    )
}