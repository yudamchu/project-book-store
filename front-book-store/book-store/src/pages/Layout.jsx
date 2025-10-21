import React from 'react';
import { Outlet } from 'react-router';
import Header from '../components/Header';
import '../assets/css/LayoutStyle.css'
import Footer from '../components/Footer';

function Layout(props) {
    return (
        <div className='container'>
            <section className='header-container'>
                <Header/>
            </section>
            <section className='content-container'>
                <Outlet/> 
            </section>
            <Footer/>
         </div>
    );
}

export default Layout;