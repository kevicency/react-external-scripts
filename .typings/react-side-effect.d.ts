declare module 'react-side-effect' {
  function withSideEffect<T>(
    reducePropsToState : Function,
    handleStateChangeOnClient : Function,
    mapStateOnServer? : Function
  ) : (c : T) => T;

  export = withSideEffect
}