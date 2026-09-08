import { Component, type ReactNode } from 'react'
import { Button } from './Button'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

/** Catches render-time crashes (e.g. from unexpectedly-shaped data) so a bug
 * never presents as a permanent blank white screen with no way out. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-canvas p-6 text-center">
          <p className="text-lg font-semibold text-primary">Something went wrong.</p>
          <p className="max-w-sm text-sm text-secondary">
            The app hit an unexpected error and can't continue safely. Reloading won't lose your tasks.
          </p>
          <Button onClick={() => window.location.reload()}>Reload</Button>
        </div>
      )
    }
    return this.props.children
  }
}
