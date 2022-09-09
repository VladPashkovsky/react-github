import React from 'react'
import { githubApi } from '../store/github/github.api'

const HomePage = () => {
  const {data, isLoading, isError} = githubApi.useSearchUsersQuery('Vlad')

  return (
    <div>
      
    </div>
  )
}

export default HomePage