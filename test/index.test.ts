import { describe, expect, test } from 'vitest'
import type { CSSProperties } from '../src'
import { styleObjectToString } from '../src'

const basicStyle: CSSProperties = {
  fontSize: 14,
  backgroundColor: '#fff',
}

describe('style-object-to-string', () => {
  test('should convert normal style object', () => {
    const precessed = styleObjectToString(basicStyle)
    expect(precessed).toBe('font-size:14px;background-color:#fff')
  })

  test('should convert autoprefix', () => {
    const precessed = styleObjectToString({
      WebkitAlignContent: '-moz-initial',
    })
    expect(precessed).toBe('-webkit-align-content:-moz-initial')
  })

  test('should keep unit', () => {
    expect(styleObjectToString({ fontSize: '14rem' })).toBe('font-size:14rem')
  })
})
