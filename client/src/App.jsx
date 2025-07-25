import WrapperRouter from './router/index.jsx'
import { Toaster } from 'react-hot-toast';

export default function App () {
  return (
    <>
      <WrapperRouter/>
      <Toaster/>
    </>

  )
}