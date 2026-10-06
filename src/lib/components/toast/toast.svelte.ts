export type ToastTone = 'success' | 'error' | 'info'

interface Toast {
  id: number
  message: string
  tone: ToastTone
}

let nextId = 0

/** Toasts currently on screen, oldest first; shown by the `Toaster` in the root layout */
export const toasts = $state<Toast[]>([])

export function dismissToast(id: number) {
  const index = toasts.findIndex(toast => toast.id === id)
  if (index !== -1) toasts.splice(index, 1)
}

export function showToast(message: string, tone: ToastTone = 'info', durationMs = 1800) {
  const id = nextId++
  toasts.push({ id, message, tone })
  setTimeout(() => {
    dismissToast(id)
  }, durationMs)
}
