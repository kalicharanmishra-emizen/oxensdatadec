import React from "react";
import Head from "next/head";
import Router from "next/router";
import { Provider } from 'react-redux'
import store from '../store'
import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/nextjs-argon-dashboard.scss";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import io from "socket.io-client";
//Binding events. 
Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

const MyApp =({ Component, pageProps }) => {
    var socket = io(process.env.SOCKET_URL)
    const Layout = Component.layout || (({ children }) => <>{children}</>);
    return (
      <Provider store={store}>
      <React.Fragment>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <title>Oxens Vendor</title>
          {/* <base href={config.basePath + '/'}/> */}
        </Head>
        <ToastContainer
          position="top-right"
          hideProgressBar={true}
          autoClose={3000}
          closeOnClick
          draggable
        />
        <Layout socket={socket}>
          <Component socket={socket} {...pageProps} />
        </Layout>
      </React.Fragment>
        
      </Provider>
    );
}
export default MyApp
