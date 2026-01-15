/**
 * 헤딩 텍스트에서 유효한 ID를 생성
 * @param text 헤딩 텍스트
 * @returns URL 친화적인 ID
 */
export function generateHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s가-힣-]/g, '') // 특수 문자 제거
    .replace(/\s+/g, '-') // 공백을 하이픈으로
    .replace(/-+/g, '-') // 연속 하이픈 제거
    .replace(/^-|-$/g, '') // 앞뒤 하이픈 제거
}
