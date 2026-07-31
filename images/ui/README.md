# UI Images

여기에 **원본 JPG/PNG**만 넣으세요.

## 사용법 (앞으로 이렇게만 하면 됩니다)

1. 이 폴더(`images/ui/`)에 원본 이미지 파일을 올립니다.
2. GitHub에 푸시합니다.
3. GitHub Action이 자동으로 `.webp` 파일을 만들어 줍니다.

## 규칙

- 파일 이름: 영문 소문자 + 하이픈 권장 (예: `header.jpg`, `welcome.jpg`)
- 이 폴더의 이미지는 자동으로 가로 600px로 리사이즈됩니다.
- 코드에서는 항상 `.webp` 버전을 사용합니다.

예시:
- `header.jpg` → 자동으로 `header.webp` 생성
- `welcome.jpg` → 자동으로 `welcome.webp` 생성
