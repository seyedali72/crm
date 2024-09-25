'use client'

import Link from "next/link"
import { useState } from "react"
import logo from '#/assets/images/logo.png'
import avatar from '#/assets/images/avatar-4.jpg'
import Image from "next/image"

export default function HeaderPanel() {
  const [accountToggle, setAccountToggle] = useState(false)
  const [remainderToggle, setRemainderToggle] = useState(false)
  const [ticketToggle, setTicketToggle] = useState(false)
  return (
    <header className="header">
      <section className="sidebar-header bg-darkPurple">
        <section className="d-flex justify-content-between flex-md-row-reverse px-2">
          <span id="sidebar-toggle-show" className="d-md-none d-inline"><i className="fa fa-toggle-off pointer"></i></span>
          <span id="sidebar-toggle-hide" className="d-md-inline d-none"><i className="fa fa-toggle-on pointer"></i></span>
          <span><Image src={logo} alt="logo" width={150} height={50} className="h-auto" /></span>
          <span id="menu-toggle" className="d-md-none"><i className="fa fa-ellipsis-h"></i></span>
        </section>
      </section>
      <section id="body-header" className="body-header">
        <section className="d-flex justify-content-between px-3">
          <section>
            <span className="me-2 me-md-2 px-md-2 position-relative pointer">
              <span className="pointer" onClick={() => [setRemainderToggle(!remainderToggle), setTicketToggle(false)]}>
                <i className="fa fa-bell"></i><sup className="badge bg-danger">4</sup>
              </span>
              <section id="notify" className={`header-notification ${!remainderToggle && 'd-none'}`}>
                <section className="d-flex justify-content-between px-1">
                  <span>یادآور</span>
                  <span className="px-2">
                    <span className="badge bg-danger">جدید</span>
                  </span>
                </section>
                <ul className="list-group rounded px-0">
                  <li className="list-group-item lis-group-item-action">
                    <section className="media">
                      <img className="notify-img rounded" src="#/assets/images/avatar-2.jpg" alt="" />

                      <section className="media-body pr-2">
                        <h5 className="notify-user">علی حسینی</h5>
                        <p className="notify-text">متن تستی برای بدنه</p>
                        <p className="notify-time">30 دیقه قبل</p>
                      </section>

                    </section>
                  </li>
                  <li className="list-group-item lis-group-item-action">
                    <section className="media">
                      <img className="notify-img rounded" src="#/assets/images/avatar-2.jpg" alt="" />

                      <section className="media-body pr-2">
                        <h5 className="notify-user">علی حسینی</h5>
                        <p className="notify-text">متن تستی برای بدنه</p>
                        <p className="notify-time">30 دیقه قبل</p>
                      </section>

                    </section>
                  </li>
                  <li className="list-group-item lis-group-item-action">
                    <section className="media">
                      <img className="notify-img rounded" src="#/assets/images/avatar-2.jpg" alt="" />

                      <section className="media-body pr-2">
                        <h5 className="notify-user">علی حسینی</h5>
                        <p className="notify-text">متن تستی برای بدنه</p>
                        <p className="notify-time">30 دیقه قبل</p>
                      </section>

                    </section>
                  </li>

                </ul>
              </section>
            </span>

            <span className="me-2 me-md-2 px-md-2 position-relative pointer">
              <span className="pointer" onClick={() => [setRemainderToggle(false), setTicketToggle(!ticketToggle)]}><i className="fa fa-comment"></i> <sup className="badge bg-danger">3</sup> </span>

              <section id="comment-box" className={`header-comment ${!ticketToggle && 'd-none'}`}>
                <section className="px-2">
                  <input type="text" className="form-control my-2 " placeholder="جستجو ..." />
                </section>
                <section className="header-comment-wrapper">
                  <ul className="list-group rounded px-0">
                    <li className="list-group-item list-group-item-action px-2 py-1">
                      <section className="media align-item-center">
                        <img className="notify-img rounded" src="#/assets/images/avatar-2.jpg" alt="" />
                        <section className="media-body pr-2 d-flex justify-content-between align-item-center">
                          <h5 className="notify-user">علی حسینی</h5>
                          <span>
                            <i className="fa fa-circle green"> </i>
                          </span>
                        </section>
                      </section>
                    </li>
                    <li className="list-group-item list-group-item-action px-2 py-1">
                      <section className="media align-item-center">
                        <img className="notify-img rounded" src="#/assets/images/avatar-2.jpg" alt="" />
                        <section className="media-body pr-2 d-flex justify-content-between align-item-center">
                          <h5 className="notify-user">علی حسینی</h5>
                          <span>
                            <i className="fa fa-circle green"> </i>
                          </span>
                        </section>
                      </section>
                    </li>
                  </ul>
                </section>
              </section>
            </span>

          </section>
          <section>
            <span id="account-toggle" className="ml-3 ml-md-5 position-relative pointer">
              <span onClick={() => setAccountToggle(!accountToggle)} >
                <Image src={avatar} className="header-avatar h-auto" alt="" width={50} height={50} />
                <span className="avatar-name mx-1"> علی حسینی </span>
                <i className="fa fa-angle-down"></i>
              </span>
              <section id="account-box" className={`${accountToggle ? 'account-manage-box rounded' : 'd-none'}`}>
                <section className="list-group rounded ">
                  <Link href="#" className="list-group-item list-group-item-action account-text ">
                    <i className="fa fa-cog"></i>تنظیمات
                  </Link>
                  <Link href="#" className="list-group-item list-group-item-action account-text ">
                    <i className="fa fa-user"></i>کاربر
                  </Link>
                  <Link href="#" className="list-group-item list-group-item-action account-text ">
                    <i className="fa fa-envelope"></i>پیام ها
                  </Link>
                  <Link href="#" className="list-group-item list-group-item-action account-text ">
                    <i className="fa fa-lock"></i> قفل صفحه
                  </Link>
                  <Link href="#" className="list-group-item list-group-item-action account-text ">
                    <i className="fa fa-sign-out"></i>خروج
                  </Link>

                </section>
              </section>
            </span>

          </section>
        </section>
      </section>
    </header>
  )
}