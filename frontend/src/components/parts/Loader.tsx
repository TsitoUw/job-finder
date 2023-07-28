import Search from '@mui/icons-material/Search'

const Loader = () => {
  return (
    <div className='w-screen h-screen flex items-center justify-center'>
      <div className="icon text-6xl text-emerald-400 animate-pulse">
        <Search fontSize='inherit'/>
      </div>
    </div>
  )
}

export default Loader