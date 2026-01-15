import { describe, it, expect } from 'vitest'
import { generateHeadingId } from './headingId'

describe('generateHeadingId', () => {
  it('영문 텍스트를 소문자로 변환해야 함', () => {
    expect(generateHeadingId('Hello World')).toBe('hello-world')
  })

  it('특수 문자를 제거해야 함', () => {
    expect(generateHeadingId('Hello! World?')).toBe('hello-world')
    expect(generateHeadingId('This & That')).toBe('this-that')
    expect(generateHeadingId('A/B Testing')).toBe('ab-testing')
  })

  it('한글을 유지해야 함', () => {
    expect(generateHeadingId('안녕하세요')).toBe('안녕하세요')
    expect(generateHeadingId('헬로 월드')).toBe('헬로-월드')
  })

  it('공백을 하이픈으로 변환해야 함', () => {
    expect(generateHeadingId('one two three')).toBe('one-two-three')
    expect(generateHeadingId('multiple   spaces')).toBe('multiple-spaces')
  })

  it('연속된 하이픈을 하나로 병합해야 함', () => {
    expect(generateHeadingId('one--two---three')).toBe('one-two-three')
  })

  it('앞뒤 하이픈을 제거해야 함', () => {
    expect(generateHeadingId('-leading')).toBe('leading')
    expect(generateHeadingId('trailing-')).toBe('trailing')
    expect(generateHeadingId('-both-')).toBe('both')
  })

  it('숫자와 언더스코어를 유지해야 함', () => {
    expect(generateHeadingId('test_123')).toBe('test_123')
    expect(generateHeadingId('version-2.0')).toBe('version-20')
  })

  it('빈 문자열을 처리해야 함', () => {
    expect(generateHeadingId('')).toBe('')
    expect(generateHeadingId('   ')).toBe('')
  })

  it('특수 문자만 있는 경우 빈 문자열을 반환해야 함', () => {
    expect(generateHeadingId('!!!')).toBe('')
    expect(generateHeadingId('???')).toBe('')
  })

  it('복합 케이스를 처리해야 함', () => {
    expect(generateHeadingId('React.js - Advanced Guide')).toBe('reactjs-advanced-guide')
    expect(generateHeadingId('TypeScript에서 타입 추론')).toBe('typescript에서-타입-추론')
  })
})
