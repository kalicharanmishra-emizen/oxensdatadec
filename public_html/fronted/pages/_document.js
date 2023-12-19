import React from "react";
import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta charSet="utf-8" />
          <meta name="theme-color" content="#000000" />
          <script async src="//cdn.jsdelivr.net/npm/sweetalert2@11"/>
          <script async src={`https://maps.googleapis.com/maps/api/js?key=${process.env.MAP_API}&libraries=places`}></script>
          <link
            rel="shortcut icon"
            href="/favicon.ico"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
        
      </Html>
    );
  }
}
export default MyDocument;