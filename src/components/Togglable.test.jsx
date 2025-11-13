import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, test } from 'vitest'
import Togglable from './Togglable'

const testText = 'togglable content'

describe('<Togglable />', () => {
  beforeEach(() => {
    render(
      <Togglable buttonLabel="show...">
        <div>{testText}</div>
      </Togglable>
    )
  })

  test('renders its children', () => {
    screen.getByText(testText)
  })

  test('at start the children are not displayed', () => {
    const element = screen.getByText(testText)
    expect(element).not.toBeVisible()
  })

  test('after clicking the button, children are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show...')
    await user.click(button)

    const element = screen.getByText(testText)
    expect(element).toBeVisible()
  })

  test('toggled content can be closed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show...')
    await user.click(button)

    const closedButton = screen.getByText('cancel')
    await user.click(closedButton)

    const element = screen.getByText(testText)
    expect(element).not.toBeVisible()
  })
})
