'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useUser } from "../context/UserProvider"

export default function SideBar() {
    const path = usePathname()
    const { user } = useUser()
    const [toggle, setToggle] = useState<boolean>(false)
    const [idx, setIdx] = useState<number>(0)
    useEffect(() => {
        if (path?.includes('/employe') || path?.includes('/departments') || path?.includes('/expert') || path?.includes('/teams')) { setToggle(true); setIdx(0) }
        if (path?.includes('/contacts') || path?.includes('/companies') || path?.includes('/customers/categories') || path?.includes('/leads') || path?.includes('/customers')) { setToggle(true); setIdx(1) }
    }, [path])
    if (!path?.includes('auth/')) {
        return (
            <aside id="sidebar" className="sidebar">
                {user?._id !== undefined &&
                    <section className="sidebar-container">
                        {user?.role == 1 ?
                            <section className="sidebar-wrapper">
                                <Link href="/account/dashboard" className="side-bar-link">
                                    <i className="fa fa-home"></i>
                                    <span>پیشخوان</span>
                                </Link>
                                {/* <section className="sidebar-title"> بخش فروش </section> */}
                                <section onClick={() => { setToggle(idx == 0 ? !toggle : true), setIdx(0) }} className={`sidebar-group-link ${(toggle && idx == 0) && 'sidebar-group-link-active'}`}>
                                    <section className="sidebar-dropdown-toggle pointer">
                                        <i className="fa fa-users icon"></i>
                                        <span>مدیریت پرسنل</span>
                                        <i className={`fa angle ${(toggle && idx == 0) ? 'fa-angle-down' : 'fa-angle-left'} `}></i>
                                    </section>
                                    <section className="sidebar-dropdown">
                                        <Link href="/account/employe" className="sidebar-dropdown-link">پرسنل</Link>
                                        <Link href="/account/departments" className="sidebar-dropdown-link">دپارتمان ها</Link>
                                        <Link href="/account/experts" className="sidebar-dropdown-link">کارشناس ها  </Link>
                                        <Link href="/account/teams" className="sidebar-dropdown-link">گروه بندی</Link>
                                    </section>
                                </section>

                                <section onClick={() => { setToggle(idx == 1 ? !toggle : true), setIdx(1) }} className={`sidebar-group-link ${(toggle && idx == 1) && 'sidebar-group-link-active'}`}>
                                    <section className="sidebar-dropdown-toggle pointer">
                                        <i className="fa fa-users icon"></i>
                                        <span>مدیریت مشتریان</span>
                                        <i className={`fa angle ${(toggle && idx == 1) ? 'fa-angle-down' : 'fa-angle-left'} `}></i>
                                    </section>
                                    <section className="sidebar-dropdown">
                                        <Link href="/account/leads" className="sidebar-dropdown-link">سرنخ ها</Link>
                                        <Link href="/account/opportunity" className="sidebar-dropdown-link">فرصت های فروش</Link>
                                        <Link href={`/account/companies`} className="sidebar-dropdown-link">شرکت ها</Link>
                                        <Link href="/account/contacts" className="sidebar-dropdown-link">مخاطبان</Link>
                                        <Link href="/account/customers/categories" className="sidebar-dropdown-link">زمینه های فعالیتی</Link>
                                    </section>
                                </section>
                                <Link href="/account/users" className="side-bar-link">
                                    <i className="fa fa-user"></i>
                                    <span>کاربران</span>
                                </Link>
                            </section>
                            : user?.role == 2 ?
                                <section className="sidebar-wrapper">
                                    <Link href={`/crm/dashboard`} className="side-bar-link"> <i className="fa fa-home"></i> <span>پیشخوان</span> </Link>
                                    <section className="sidebar-title"> بخش مشتریان </section>

                                    <Link href={`/crm/expert`} className="side-bar-link"> <i className="fa fa-angle-left"></i> کارشناسان </Link>
                                    <Link href="/crm/opportunity" className="side-bar-link"> <i className="fa fa-angle-left"></i>فرصت های فروش   </Link>
                                    <Link href={`/crm/leads`} className="side-bar-link"> <i className="fa fa-angle-left"></i> سرنخ ها  </Link>
                                    <Link href={`/crm/contacts`} className="side-bar-link"> <i className="fa fa-angle-left"></i> مخاطبان</Link>
                                    <Link href={`/crm/companies`} className="side-bar-link"> <i className="fa fa-angle-left"></i> شرکت ها</Link>
                                    <Link href={`/crm/customers/categories`} className="side-bar-link"> <i className="fa fa-angle-left"></i> زمینه های فعالیتی</Link>

                                    <section className="sidebar-title"> بخش فعالیت ها </section>
                                    <Link href={`/crm/reminders/?type=meetings`} className="side-bar-link"> <i className="fa fa-angle-left"></i> جلسات</Link>
                                    <Link href={`/crm/reminders/?type=events`} className="side-bar-link"> <i className="fa fa-angle-left"></i> رویدادها</Link>
                                    <Link href={`/crm/reminders/?type=calls`} className="side-bar-link"> <i className="fa fa-angle-left"></i> تماس ها</Link>
                                    <Link href={`/crm/reminders/?type=birthdays`} className="side-bar-link"> <i className="fa fa-angle-left"></i> تولدات</Link>

                                </section>
                                : user?.role == 4 ?
                                    <section className="sidebar-wrapper">
                                        <Link href={`/expert/dashboard`} className="side-bar-link"> <i className="fa fa-home"></i> <span>پیشخوان</span> </Link>
                                        <section className="sidebar-title"> بخش مشتریان </section>

                                        <Link href={`/expert/leads`} className="side-bar-link"> <i className="fa fa-angle-left"></i> سرنخ ها  </Link>
                                        <Link href={`/expert/opportunity`} className="side-bar-link"> <i className="fa fa-angle-left"></i> فرصت های فروش  </Link>
                                        <Link href={`/expert/contacts`} className="side-bar-link"> <i className="fa fa-angle-left"></i> مخاطبان</Link>
                                        <Link href={`/expert/companies`} className="side-bar-link"> <i className="fa fa-angle-left"></i> شرکت ها</Link>
                                        <Link href={`/expert/customers/categories`} className="side-bar-link"> <i className="fa fa-angle-left"></i> زمینه های فعالیتی</Link>

                                        <section className="sidebar-title"> بخش فعالیت ها </section>
                                        <Link href={`/expert/reminders/?type=meetings`} className="side-bar-link"> <i className="fa fa-angle-left"></i> جلسات</Link>
                                        <Link href={`/expert/reminders/?type=events`} className="side-bar-link"> <i className="fa fa-angle-left"></i> رویدادها</Link>
                                        <Link href={`/expert/reminders/?type=calls`} className="side-bar-link"> <i className="fa fa-angle-left"></i> تماس ها</Link>
                                        <Link href={`/expert/reminders/?type=birthdays`} className="side-bar-link"> <i className="fa fa-angle-left"></i> تولدات</Link>

                                    </section>
                                    : user?.role == 6 ?
                                        <section className="sidebar-wrapper">
                                            <Link href={`/emploee/dashboard`} className="side-bar-link"> <i className="fa fa-home"></i> <span>پیشخوان</span> </Link>
                                            <section className="sidebar-title"> بخش کارمند </section>
                                            <Link href={`/emploee/contacts`} className="side-bar-link"> <i className="fa fa-angle-left"></i> چارت سازمانی</Link>
                                            <Link href={`/emploee/contacts`} className="side-bar-link"> <i className="fa fa-angle-left"></i> اطلاعات کارمندی</Link>
                                            <Link href={`/emploee/contacts`} className="side-bar-link"> <i className="fa fa-angle-left"></i> وظایف</Link>
                                            <Link href={`/emploee/contacts`} className="side-bar-link"> <i className="fa fa-angle-left"></i> اطلاعات شخصی</Link>
                                            <Link href={`/emploee/contacts`} className="side-bar-link"> <i className="fa fa-angle-left"></i> سوابق تحصیلی</Link>
                                            <Link href={`/emploee/contacts`} className="side-bar-link"> <i className="fa fa-angle-left"></i> سوابق شغلی</Link>
                                            <Link href={`/emploee/contacts`} className="side-bar-link"> <i className="fa fa-angle-left"></i> فیش حقوقی</Link>
                                            <Link href={`/emploee/contacts`} className="side-bar-link"> <i className="fa fa-angle-left"></i> مکاتبات اداری</Link>

                                        </section>
                                        : <section className="sidebar-wrapper">
                                            <Link href="/hrm/dashboard" className="side-bar-link">
                                                <i className="fa fa-home"></i>
                                                <span>پیشخوان</span>
                                            </Link>
                                            <section className="sidebar-title"> بخش منابع انسانی </section>
                                            <Link href="/hrm/chart" className="side-bar-link"> <i className="fa fa-angle-left"></i> <span>چارت سازمانی</span> </Link>
                                            <Link href="/hrm/departments" className="side-bar-link"> <i className="fa fa-angle-left"></i> <span>دپارتمان ها</span> </Link>
                                            <Link href="/hrm/teams" className="side-bar-link"> <i className="fa fa-angle-left"></i> <span>تیم ها / گروه ها</span> </Link>
                                            <Link href="/hrm/employe" className="side-bar-link"> <i className="fa fa-angle-left"></i> <span>پرسنل</span> </Link>
                                            <Link href="/hrm/staff" className="side-bar-link"> <i className="fa fa-angle-left"></i> <span>کارشناسان</span> </Link>
                                            <Link href="/hrm/staff" className="side-bar-link"> <i className="fa fa-angle-left"></i> <span>شرح وظایف</span> </Link>
                                            <Link href="/hrm/staff" className="side-bar-link"> <i className="fa fa-angle-left"></i> <span>جذب و استخدام</span> </Link>
                                            <Link href="/hrm/users" className="side-bar-link"> <i className="fa fa-angle-left"></i> <span>حضور / غیاب</span> </Link>
                                        </section>}
                    </section>
                }
            </aside>
        )
    }
}