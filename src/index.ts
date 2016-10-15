import * as React from 'react'
import withSideEffect = require('react-side-effect')

export interface IScriptDefinition {
  url: String,
  async?: boolean,
  defer?: boolean
}

export interface IExternalScriptsProps {
  children?: React.ReactNode
  scripts?: Array<string | IScriptDefinition>
}

function reducePropsToState(propsList : Array<IExternalScriptsProps> = []) : Array<IScriptDefinition> {
  const state = [] as Array<IScriptDefinition>

  propsList.forEach(props => {
    (props.scripts || []).forEach(script => {
      if (typeof script === 'string') {
        state.push({ url: script })
      } else {
        state.push(script)
      }
    })
  })

  return state
}

function handleStateChangeOnClient(/* scripts = [] */) {
  // not supported yet
}

class ExternalScripts extends React.Component<IExternalScriptsProps, null> {
  static propTypes = {
    children: React.PropTypes.node,
    scripts: React.PropTypes.array.isRequired
  }

  render() {
    const { children } = this.props

    return children ? React.Children.only(children) : null
  }
}

const WrappedComponent = withSideEffect(reducePropsToState, handleStateChangeOnClient)(ExternalScripts)

export default WrappedComponent as React.ComponentClass<IExternalScriptsProps> & {
  rewind() : Array<string | IScriptDefinition>
}