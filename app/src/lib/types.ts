export interface Task {
  id: string
  title: string
  space: 'work' | 'personal'
  priority: 'none' | 'low' | 'medium' | 'high'
  dueAt?: number
  estimatedMinutes?: number
  completed: boolean
  createdAt: number
}
