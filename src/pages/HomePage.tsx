import React, { useEffect, useState } from 'react'
import { githubApi } from '../store/github/github.api'
import { useDebounce } from '../hooks/useDebounce'
import { util } from 'prettier'
import Repocard from '../components/Repocard'

const HomePage = () => {

  const [search, setSearch] = useState('')
  const [dropdown, setDropdown] = useState(false)
  const debounced = useDebounce(search)

  const { data, isLoading, isError } = githubApi.useSearchUsersQuery(debounced,
    { skip: debounced.length < 3, refetchOnFocus: true })

  const [fetchRepos, { isLoading: areReposLoading, data: repos }] = githubApi.useLazyGetUserReposQuery()

  useEffect(() => {
    setDropdown(debounced.length > 3 && data?.length! > 0)
  }, [debounced, data])

  const clickHandler = (username: string) => {
    fetchRepos(username)
    setDropdown(false)
  }

  return (
    <div className='flex justify-center pt-10 mx-auto h-screen w-screen'>
      {isError && <p className='text-center text-red-600'>Error...</p>}
      <div className='relative w-[560px]'>
        <input
          type='text'
          className='border py-2 px-4 w-full h-[42px] mb-2'
          placeholder='Github username search...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {dropdown && <ul
          className='List-one absolute top-[42px] left-0 right-0 max-h-[200px] overflow-y-scroll shadow-md bg-white'>
          {isLoading && <p className='text-center'>Loading...</p>}
          {data?.map(user =>
            <li
              onClick={() => clickHandler(user.login)}
              key={user.id}
              className='py-2 px-4 hover:bg-gray-500 hover:text-white transition-colors cursor-pointer'
            >
              {user.login}</li>)}
        </ul>}
        <div className='container'>
          {areReposLoading && <p className='text-center'>Repositary is loading...</p>}
          {repos?.map((repo) => <Repocard repo={repo} key={repo.id} />)}
        </div>
      </div>
    </div>
  )
}

export default HomePage