type Status = 'Loading' | 'Failure' | 'Success' | 'NotAsked'

interface NotAskedState {
    status: 'NotAsked'
}

interface LoadingState {
    status: 'Loading'
}

interface FailureState {
    status: 'Failure',
    error: string
}

interface SuccessState<T> {
    status: 'Success'
    data: T
}

type State<T> = LoadingState | NotAskedState | FailureState | SuccessState<T>

export default State