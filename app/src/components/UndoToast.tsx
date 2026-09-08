export function UndoToast({ message, onUndo }: { message: string; onUndo: () => void }) {
  return (
    <div className="fixed bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 rounded-md border border-border bg-surface px-4 py-2.5 shadow-lg">
      <span className="text-sm text-primary">{message}</span>
      <button
        type="button"
        onClick={onUndo}
        className="text-sm font-medium text-accent hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        Undo
      </button>
    </div>
  )
}
