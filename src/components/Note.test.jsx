import { render, screen } from '@testing-library/react'
import Note from './Note'
import userEvent from '@testing-library/user-event'
import { test, expect, vi } from 'vitest'

test('renders content', () => {
  const note = {
    content: 'Not work anymore :(',
    important: true,
  }

  render(<Note note={note} />)

  const element = screen.getByText(note.content, { exact: false })

  expect(element).toBeDefined()
})

test('clicking the button calls event handler once', async () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  const mockHandler = vi.fn()

  render(
    <Note note={note} toggleImportance={mockHandler} />
  )

  const user = userEvent.setup()
  const button = screen.getByText('make not important')
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
})