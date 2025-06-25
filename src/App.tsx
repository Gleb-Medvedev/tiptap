import { useState, type FC } from 'react'
import { SmartMarkdownEditor } from './components/editor/Editor'

const App: FC = () => {

  const onChangeMarkdown = () => {
  }
  
  return (
      <>
            <div>dsadadadasdada</div>
            <SmartMarkdownEditor initialMarkdown='dsadasdadasdas' onChangeMarkdown={onChangeMarkdown}/>
      </>
  )
}

export default App
