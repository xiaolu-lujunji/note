import type { AppProps } from 'next/app'
import '../styles/prism-ghcolors.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
