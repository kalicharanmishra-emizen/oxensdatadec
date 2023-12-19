import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/main.css'
import '../styles/responsive.css'
import "../styles/cartBox.css"
import Head from 'next/head'
import Router from "next/router";
import { Provider } from 'react-redux'
import store from '../store'
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css';
import io from 'socket.io-client';
// import ErrorBoundary from '../componets/Error/ErrorBoundary'


//Binding events. 
Router.events.on('routeChangeStart', () => Nprogress.start())
Router.events.on('routeChangeComplete', () => Nprogress.done())
Router.events.on('routeChangeError', () => Nprogress.done())
function MyApp({ Component, pageProps }) {
  var socket = io(process.env.SOCKET_URL)
  const Layout = Component.layout || (({ children }) => <>{children}</>);
  return (
    <Provider socket={socket} store={store}> 
      {/* <ErrorBoundary> */}
        <Head>
          <title>Oxens</title>
        </Head>
        <Layout socket={socket}>
          <Component socket={socket} {...pageProps} />
        </Layout>
      {/* </ErrorBoundary> */}
    </Provider>
  )
}

export default MyApp
