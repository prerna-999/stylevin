import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "../../public/assets/css/main.css";
import "../../public/assets/css/themes/_index.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "@/layout/TopBar/Header";
import Footer from "@/layout/footer";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* <Header /> */}

<Header/>
      <main>
        <Component {...pageProps} />
      </main>

      { <Footer /> }
    </>
  );
}