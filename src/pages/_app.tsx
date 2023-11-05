import "@/styles/globals.css"
import store from "../store"
import { HappyProvider } from '@ant-design/happy-work-theme';

import type { AppProps } from "next/app"
import { Provider } from "react-redux"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <HappyProvider>
        <Component {...pageProps} />
      </HappyProvider>
    </Provider>
  )
}

export default MyApp
