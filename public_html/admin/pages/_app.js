import React from "react";
import ReactDOM from "react-dom";
import App from "next/app";
import Head from "next/head";
import Router from "next/router";
import { Provider } from 'react-redux'
import PageChange from "components/PageChange/PageChange.js";
import store from '../store'
import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/nextjs-argon-dashboard.scss";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
//Binding events. 
Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

export default class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }
  render() {
    const { Component, pageProps } = this.props;

    const Layout = Component.layout || (({ children }) => <>{children}</>);

    return (
      
      <Provider store={store}>
      <React.Fragment>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <title>Oxens Dashboard</title>
          {/* <base href={config.basePath + '/'}/> */}
          
        </Head>
        <Layout>
          <ToastContainer
            position="top-right"
            hideProgressBar={true}
            autoClose={3000}
            closeOnClick
            draggable
          ></ToastContainer>
          <Component {...pageProps} />
        </Layout>
      </React.Fragment>
      </Provider>
    );
  }
}
