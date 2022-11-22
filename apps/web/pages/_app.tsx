import type { AppProps } from 'next/app'
import '../styles/github-markdown-light.css'
import '../styles/prism-ghcolors.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
